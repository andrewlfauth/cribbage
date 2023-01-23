import { reactive } from 'vue'
import { defineStore } from 'pinia'

export const useScoreStore = defineStore('score', () => {
  const score = reactive({
    user: 0,
    bot: 0,
  })

  return { score }
})
