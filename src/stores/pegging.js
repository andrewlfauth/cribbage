import { reactive } from 'vue'
import { defineStore } from 'pinia'
import { useGameStore } from './game'
import { useScoreStore } from './score'
import { objectsEqual, wait } from '../utils/helpers'

export const usePeggingStore = defineStore('pegging', () => {
  const { game } = useGameStore()
  const { awardPoints } = useScoreStore()
  const initialState = {
    active: [],
    spent: [],
    count: 0,
    user: { hand: [] },
    bot: { hand: [] },
    opponent: '',
    go: { user: false, bot: false },
    turn: game.dealer == 'user' ? 'bot' : 'user',
    waitForUserCard: false,
    waitForBotCard: false,
    turnScore: [],
  }

  const pegging = reactive({ ...initialState })

  const startTurn = (player) => {
    if (!pegging.bot.hand?.length && !pegging.user.hand?.length) {
      // handle end of stage
      return
    }
    if (!pegging[player].hand?.length) {
      pegging.opponent = 'out'
      return switchTurns()
    }
    if (turnIsAGo()) {
      return handleGo(player)
    }
    pegging.turn == 'bot'
      ? (pegging.waitForBotCard = true)
      : (pegging.waitForUserCard = true)
  }

  const playCard = async (card) => {
    let player = pegging.turn

    pegging.active.push(card)
    pegging.count += card.count
    pegging[player].hand = pegging[player].hand.filter(
      (c) => !objectsEqual(c, card)
    )

    if (!pegging[player].hand?.length) {
      if (pegging.opponent == 'out') {
        pegging.turnScore.push({ points: 1, message: '1 for last card' })
      } else {
        pegging.opponent = 'out'
      }
    } else {
      pegging.opponent = ''
    }

    if (pegging.opponent == 'go' && turnIsAGo() && pegging.count != 31) {
      pegging.go[player] = true
      pegging.turnScore.push({ points: 1, message: '1 for Go' })
      return switchTurns()
    }
    if (pegging.count == 31) {
      pegging.turnScore.push({ points: 2, message: '2 for 31' })
      await wait(0.5)
      resetPegging()
      return switchTurns()
    }
    if (pegging.count == 15) {
      pegging.turnScore.push({ points: 2, message: '2 for 15' })
      return switchTurns()
    }
    switchTurns()
  }

  const switchTurns = () => {
    checkForPairs()
    checkForRun()
    awardPoints(pegging.turnScore, pegging.turn)
    pegging.waitForUserCard = false
    pegging.waitForBotCard = false
    pegging.turn === 'bot' ? (pegging.turn = 'user') : (pegging.turn = 'bot')
    pegging.turnScore = []
    startTurn(pegging.turn)
  }

  const turnIsAGo = () => {
    let player = pegging.turn
    if (!pegging[player].hand.some((card) => card.count <= 31 - pegging.count))
      return true
  }

  const handleGo = async () => {
    let player = pegging.turn

    if (pegging.opponent == 'go') {
      await wait(1)
      pegging.go[player] = true
      pegging.turnScore.push({ points: 1, message: '1 for Go' })
      resetPegging()
      return switchTurns()
    }
    if (pegging.opponent === 'out') {
      pegging.go[player] = true
      resetPegging()
      return startTurn(pegging.turn)
    }
    pegging.opponent = 'go'
    pegging.go[player] = true
    return switchTurns()
  }

  const getBotsCard = () => {
    let possibles = pegging.bot.hand.filter(
      (card) => card.count <= 31 - pegging.count
    )
    return possibles[0]
  }

  const resetPegging = async () => {
    pegging.spent = pegging.spent.concat(pegging.active)
    pegging.count = 0
    pegging.active = []
    if (pegging.opponent == 'go') {
      pegging.opponent = ''
    }
    await wait(1)
    pegging.go = { user: false, bot: false }
  }

  const checkForPairs = () => {
    let cards = [...pegging.active]
    let pairs = 0

    if (cards.length < 2) return
    for (let i = 0; i < cards.length; i++) {
      let c = cards.pop()
      if (c.value === cards[cards.length - 1].value) {
        pairs++
      } else break
    }

    if (pairs) {
      let pointTotal = pairs * (pairs + 1)
      pegging.turnScore.push({
        points: pointTotal,
        message: pointTotal + ' for a pair',
      })
    }
  }

  const checkForRun = () => {
    let cards = [...pegging.active].map((c) => c.order)
    let card = cards.pop()
    let idxs = []
    let nextCard = card - 1

    for (let i = 0; i < cards.length; i++) {
      let nextIdx = cards.lastIndexOf(nextCard)
      if (nextIdx !== -1) {
        nextCard -= 1
        idxs.push(nextIdx)
      } else break
    }

    nextCard = card + 1
    for (let i = 0; i < cards.length; i++) {
      let nextIdx = cards.lastIndexOf(nextCard)
      if (nextIdx !== -1) {
        nextCard += 1
        idxs.push(nextIdx)
      } else break
    }

    if (idxs.length < 2 || Math.max(...idxs) < cards.length - 1) {
      return
    }

    let sorted = [...idxs].sort((a, b) => b - a)
    let run = []

    for (let i = 0; i < sorted.length; i++) {
      let n = sorted[i]
      if (sorted[i + 1] == n - 1) {
        run.push(n)
      } else {
        run.push(n)
        break
      }
    }
    if (run.length < 2) return

    let sliced = cards
      .slice(Math.min(...run))
      .concat([card])
      .sort((a, b) => a - b)

    for (let i = 0; i < sliced.length; i++) {
      if (i == sliced.length - 1) {
        return pegging.turnScore.push({
          points: sliced.length,
          message: sliced.length + ' for run of ' + sliced.length,
        })
      }
      if (sliced[i + 1] == sliced[i] + 1) {
        continue
      } else {
        break
      }
    }
  }

  const setupPegging = () => {
    Object.assign(pegging, initialState)
    pegging.user.hand = game.usersHand
    pegging.bot.hand = game.botsHand
    pegging.go = { user: false, bot: false }
    pegging.active = []
    game.dealer == 'user' ? (pegging.turn = 'bot') : (pegging.turn = 'user')
  }

  const clearPegging = () => {
    Object.assign(pegging, initialState)
    pegging.user.hand = []
    pegging.bot.hand = []
  }

  return {
    pegging,
    playCard,
    getBotsCard,
    startTurn,
    setupPegging,
    clearPegging,
  }
})
