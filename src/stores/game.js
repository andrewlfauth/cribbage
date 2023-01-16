import { reactive } from 'vue'
import { SUITS, VALUES } from '../data/cards'
import { defineStore } from 'pinia'

export const useGameStore = defineStore('game', () => {
  const game = reactive({
    theme: 'classic',
    stage: '',
    dealer: '',
  })

  const changeTheme = (newTheme) => {
    const app = document.querySelector('html')
    const oldTheme = game.theme
    app.classList.remove('t-' + oldTheme)
    app.classList.add('t-' + newTheme)
    game.theme = newTheme
  }

  const changeStage = (stage) => (game.stage = stage)

  return { game, changeTheme, changeStage }
})

function newDeck() {
  return SUITS.flatMap((suit) => VALUES.map((values) => ({ suit, ...values })))
}
