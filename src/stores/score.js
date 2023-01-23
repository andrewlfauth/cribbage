import { reactive } from 'vue'
import { defineStore } from 'pinia'

export const useScoreStore = defineStore('score', () => {
  const score = reactive({
    user: 0,
    bot: 0,
    flashMessage: { message: '', player: '' },
  })

  const awardPoints = (points, player) => {
    if (!points.length) return
    let totalPoints = points.reduce((acc, cur) => (acc += cur.points), 0)
    let message =
      points.length == 1
        ? points[0].message
        : points.map((x) => x.message).join(' + ')

    score[player] += totalPoints
    score.flashMessage = { message, player }
  }

  return { score, awardPoints }
})
