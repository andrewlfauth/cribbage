import { reactive } from 'vue'
import { defineStore } from 'pinia'
import { useGameStore } from '../stores/game'
import {
  getFlush,
  getPairs,
  getFifteens,
  getRuns,
  isNobs,
} from '../utils/scoring'

export const useScoreStore = defineStore('score', () => {
  const { game } = useGameStore()
  const score = reactive({
    user: 0,
    bot: 0,
    flashMessage: { messages: [], player: '' },
    usersHandTotal: 0,
    botsHandTotal: 0,
    usersHand: {
      fifteen: [],
      pair: [],
      run: [],
      flush: [],
      nobs: [],
    },
    botsHand: {
      fifteen: [],
      pair: [],
      run: [],
      flush: [],
      nobs: [],
    },
    crib: {
      fifteen: [],
      pair: [],
      run: [],
      flush: [],
      nobs: [],
    },
  })

  const awardPoints = (points, player) => {
    if (!points.length) return
    let totalPoints = points.reduce((acc, cur) => (acc += cur.points), 0)
    let messages = points.map((p) => p.message)

    score[player] += totalPoints
    score.flashMessage = { messages, player }
  }

  const calculateHandScores = () => {
    let cutCard = game.deck[20]

    let userFifteens = getFifteens(game.usersHand, cutCard)
    let userPairs = getPairs(game.usersHand, cutCard)
    let userRuns = getRuns(game.usersHand, cutCard)
    let userFlush = getFlush(game.usersHand, cutCard)
    let userNobs = isNobs(game.usersHand, cutCard)

    let botFifteens = getFifteens(game.botsHand, cutCard)
    let botPairs = getPairs(game.botsHand, cutCard)
    let botRuns = getRuns(game.botsHand, cutCard)
    let botFlush = getFlush(game.botsHand, cutCard)
    let botNobs = isNobs(game.botsHand, cutCard)

    let userTotal =
      userFifteens.length * 2 +
      userPairs.length * 2 +
      userRuns.reduce((acc, cards) => (acc += cards.length), 0) +
      userFlush.length +
      userNobs.length

    let botTotal =
      botFifteens.length * 2 +
      botPairs.length * 2 +
      botRuns.reduce((acc, cards) => (acc += cards.length), 0) +
      botFlush.length +
      botNobs.length

    score.usersHandTotal = userTotal
    score.botsHandTotal = botTotal

    score.usersHand = {
      fifteen: userFifteens,
      pair: userPairs,
      run: userRuns,
      flush: userFlush,
      nobs: userNobs,
    }

    score.botsHand = {
      fifteen: botFifteens,
      pair: botPairs,
      run: botRuns,
      flush: botFlush,
      nobs: botNobs,
    }
  }

  const calculateCribScores = () => {
    let cutCard = game.deck[20]

    let fifteens = getFifteens(game.crib, cutCard)
    let pairs = getPairs(game.crib, cutCard)
    let runs = getRuns(game.crib, cutCard)
    let flush = getFlush(game.crib, cutCard)
    let nobs = isNobs(game.crib, cutCard)

    score.crib.fifteen = fifteens
    score.crib.pair = pairs
    score.crib.run = runs
    score.crib.flush = flush
    score.crib.nobs = nobs
  }

  return { score, awardPoints, calculateHandScores, calculateCribScores }
})
