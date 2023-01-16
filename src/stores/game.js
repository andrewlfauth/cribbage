import { reactive } from 'vue'
import { SUITS, VALUES } from '../data/cards'

export const useGameStore = () => {
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

  return { game, changeTheme }
}

function newDeck() {
  return SUITS.flatMap((suit) => VALUES.map((values) => ({ suit, ...values })))
}
