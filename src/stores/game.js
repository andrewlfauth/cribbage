import { reactive } from 'vue'
import { SUITS, VALUES } from '../data/cards'
import { defineStore } from 'pinia'

export const useGameStore = defineStore('game', () => {
  const game = reactive({
    stage: '',
    dealer: '',
  })

  const changeStage = (stage) => (game.stage = stage)

  return { game, changeStage }
})

function newDeck() {
  return SUITS.flatMap((suit) => VALUES.map((values) => ({ suit, ...values })))
}
