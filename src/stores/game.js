import { reactive } from 'vue'
import { SUITS, VALUES } from '../data/cards'
import { objectsEqual } from '../utils/helpers'
import { defineStore } from 'pinia'

export const useGameStore = defineStore('game', () => {
  const game = reactive({
    stage: '',
    dealer: '',
    deck: shuffle(newDeck()),
  })

  const changeStage = (stage) => (game.stage = stage)
  const setDealer = (dealer) => (game.dealer = dealer)
  const removeCardFromDeck = (card) => {
    game.deck = game.deck.filter((c) => !objectsEqual(c, card))
  }

  return { game, changeStage, setDealer, removeCardFromDeck }
})

function newDeck() {
  return SUITS.flatMap((suit) => VALUES.map((values) => ({ suit, ...values })))
}

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5)
}
