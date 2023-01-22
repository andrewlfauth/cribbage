import { reactive } from 'vue'
import { defineStore } from 'pinia'
import { useGameStore } from './game'
import { objectsEqual } from '../utils/helpers'

export const usePeggingStore = defineStore('pegging', () => {
  const { game } = useGameStore()

  const pegging = reactive({
    active: [],
    spent: [],
    count: 0,
    user: { hand: game.usersHand, status: '' },
    bot: { hand: game.botsHand, status: '' },
    opponent: '',
    doubleGo: false,
    turn: game.dealer == 'user' ? 'bot' : 'user',
    waitForUserCard: false,
    waitForBotCard: false,
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
      // award 1 for go
      return switchTurns()
    }
    if (pegging.count == 31) {
      // award 2 for 31
      resetPegging()
      return switchTurns()
    }
    if (!pegging[player].hand?.length) {
      if (pegging.opponent == 'out') {
        // award 1 for last card
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
    pegging.waitForUserCard = false
    pegging.waitForBotCard = false
    pegging.turn === 'bot' ? (pegging.turn = 'user') : (pegging.turn = 'bot')
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
      resetPegging()
      // award points
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
