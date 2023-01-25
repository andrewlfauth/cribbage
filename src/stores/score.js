import { reactive } from 'vue'
import { defineStore } from 'pinia'
import { useGameStore } from '../stores/game'
import { getFlush, getPairs, getFifteens, getRuns } from '../utils/scoring'

export const useScoreStore = defineStore('score', () => {
  const { game } = useGameStore()
  const score = reactive({
    user: 0,
    bot: 0,
    flashMessage: { messages: [], player: '' },
    usersHand: {},
    botsHand: {},
  })

  const awardPoints = (points, player) => {
    if (!points.length) return
    let totalPoints = points.reduce((acc, cur) => (acc += cur.points), 0)
    let messages = points.map((p) => p.message)

    score[player] += totalPoints
    score.flashMessage = { messages, player }
  }

  const calculateScores = () => {
    let cutCard = game.deck[20]

    score.usersHand = {
      fifteens: getFifteens(game.usersHand, cutCard),
      pairs: getPairs(game.usersHand, cutCard),
      runs: getRuns(game.usersHand, cutCard),
      flush: getFlush(game.usersHand, cutCard),
    }

    score.botsHand = {
      fifteens: getFifteens(game.botsHand, cutCard),
      pairs: getPairs(game.botsHand, cutCard),
      runs: getRuns(game.botsHand, cutCard),
      flush: getFlush(game.botsHand, cutCard),
    }
  }

  return { score, awardPoints, calculateScores }
})
