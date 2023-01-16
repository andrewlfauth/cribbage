import { reactive } from 'vue'
import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', () => {
  const theme = reactive({
    color: 'classic',
    card: 'https://res.cloudinary.com/dpnkrz8c8/image/upload/v1673850639/cribbage/brdtomirmaqh8mextlol.png',
  })

  const changeTheme = (newTheme) => {
    const app = document.querySelector('html')
    const oldTheme = theme.color
    app.classList.remove('t-' + oldTheme)
    app.classList.add('t-' + newTheme)
    theme.color = newTheme
  }

  return { theme, changeTheme }
})
