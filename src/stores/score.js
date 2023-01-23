import { reactive } from 'vue'
import { defineStore } from 'pinia'

export const useScoreStore = defineStore('score', () => {
  const score = reactive({
    user: 0,
    bot: 0,
    flashMessage: { messages: [], player: '' },
  })
  // { points: 2, message: '2 for 15' }, { points: 2, message: '2 for 15' }
  const awardPoints = (points, player) => {
    if (!points.length) return
    let totalPoints = points.reduce((acc, cur) => (acc += cur.points), 0)
    let messages = points.map((p) => p.message)

    score[player] += totalPoints
    score.flashMessage = { messages, player }
  }

  return { score, awardPoints }
})
