import { reactive } from 'vue'
import { defineStore } from 'pinia'
import { cardBacks } from '../data/cards'

export const useThemeStore = defineStore('theme', () => {
  const theme = reactive({
    color: 'classic',
    card: cardBacks.default,
  })

  const changeColor = (newTheme) => {
    const app = document.querySelector('html')
    const oldTheme = theme.color
    app.classList.remove('t-' + oldTheme)
    app.classList.add('t-' + newTheme)
    theme.color = newTheme
  }

  const changeCard = (newCard) => (theme.card = newCard)

  return { theme, changeColor, changeCard }
})
