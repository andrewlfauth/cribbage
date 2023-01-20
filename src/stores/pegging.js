import { reactive } from 'vue'
import { defineStore } from 'pinia'

export const usePeggingStore = defineStore('pegging', () => {
  const pegging = reactive({
    active: [],
    spent: [],
    count: 0,
    opponent: '',
  })

  return { pegging }
})
