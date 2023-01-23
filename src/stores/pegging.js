import { reactive } from 'vue'
import { defineStore } from 'pinia'
import { useGameStore } from './game'
import { useScoreStore } from './score'
import { objectsEqual } from '../utils/helpers'

export const usePeggingStore = defineStore('pegging', () => {
  const { game } = useGameStore()
  const { awardPoints } = useScoreStore()

  const pegging = reactive({
    active: [],
    spent: [],
    count: 0,
    user: { hand: game.usersHand },
    bot: { hand: game.botsHand },
    opponent: '',
    doubleGo: false,
    turn: game.dealer == 'user' ? 'bot' : 'user',
    waitForUserCard: false,
    waitForBotCard: false,
    turnScore: [],
  })

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

  const playCard = (card) => {
    let player = pegging.turn

    pegging.active.push(card)
    pegging.count += card.count
    pegging[player].hand = pegging[player].hand.filter(
      (c) => !objectsEqual(c, card)
    )

    if (pegging.opponent == 'go' && turnIsAGo() && pegging.count != 31) {
      console.log('1 for go')
      pegging.turnScore.push({ points: 1, message: '1 for Go' })
      return switchTurns()
    }
    if (pegging.count == 31) {
      console.log('2 for 31')
      pegging.turnScore.push({ points: 2, message: '2 for 31' })
      resetPegging()
      return switchTurns()
    }
    if (pegging.count == 15) {
      console.log('2 for 15')
      pegging.turnScore.push({ points: 2, message: '2 for 15' })
      return switchTurns()
    }
    if (!pegging[player].hand?.length) {
      if (pegging.opponent == 'out') {
        console.log('1 for last card')
        pegging.turnScore.push({ points: 1, message: '1 for last card' })
        // End stage
      } else {
        pegging.opponent = 'out'
      }
    } else {
      pegging.opponent = ''
    }
    switchTurns()
  }

  const switchTurns = () => {
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

  const handleGo = () => {
    if (pegging.opponent == 'go') {
      pegging.doubleGo = true
      pegging.turnScore.push({ points: 1, message: '1 for Go' })
      resetPegging()
      return switchTurns()
    }
    if (pegging.opponent === 'out') {
      resetPegging()
      return startTurn(pegging.turn)
    }
    pegging.opponent = 'go'
    return switchTurns()
  }

  const getBotsCard = () => {
    let possibles = pegging.bot.hand.filter(
      (card) => card.count <= 31 - pegging.count
    )
    return possibles[0]
  }

  const resetPegging = () => {
    pegging.spent = pegging.spent.concat(pegging.active)
    pegging.count = 0
    pegging.cards = []
    pegging.opponent = ''
    pegging.doubleGo = false
  }

  return { pegging, playCard, getBotsCard, startTurn }
})
