import { reactive } from 'vue'
import { SUITS, VALUES } from '../data/cards'
import { defineStore } from 'pinia'

export const useGameStore = defineStore('game', () => {
  const initialState = {
    stage: '',
    dealer: '',
    deck: shuffle(newDeck()),
    usersHand: [],
    botsHand: [],
    crib: [],
    winner: false,
  }
  const game = reactive({ ...initialState })

  const changeStage = (stage) => (game.stage = stage)
  const setDealer = (dealer) => (game.dealer = dealer)
  const addCardToHand = (card, player) => {
    if (player == 'user') game.usersHand.push(card)
    else game.botsHand.push(card)
  }
  const startNewHand = () => {
    if (game.dealer == 'user') game.dealer = 'bot'
    else game.dealer = 'user'
    game.deck = shuffle(newDeck())
    game.usersHand = []
    game.botsHand = []
    game.crib = []
    changeStage('deal')
  }

  const startNewGame = () => {
    Object.assign(game, initialState)
    game.botsHand = []
    game.usersHand = []
    game.stage = 'cut'
  }

  const endGame = () => {
    Object.assign(game, initialState)
    game.botsHand = []
    game.usersHand = []
  }

  return {
    game,
    changeStage,
    setDealer,
    addCardToHand,
    startNewHand,
    startNewGame,
    endGame,
  }
})

function newDeck() {
  return SUITS.flatMap((suit) => VALUES.map((values) => ({ suit, ...values })))
}

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5)
}
