import { reactive } from 'vue'
import { SUITS, VALUES } from '../data/cards'
import { objectsEqual } from '../utils/helpers'
import { defineStore } from 'pinia'

export const useGameStore = defineStore('game', () => {
  const game = reactive({
    stage: '',
    dealer: '',
    deck: shuffle(newDeck()),
    usersHand: [],
    botsHand: [],
  })

  const changeStage = (stage) => (game.stage = stage)
  const setDealer = (dealer) => (game.dealer = dealer)
  const addCardToHand = (card, player) => {
    if (player == 'user') game.usersHand.push(card)
    else game.botsHand.push(card)
    console.log(game)
  }

  return { game, changeStage, setDealer, removeCardsFromDeck, addCardToHand }
})

function newDeck() {
  return SUITS.flatMap((suit) => VALUES.map((values) => ({ suit, ...values })))
}

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5)
}
