import { reactive } from 'vue'
import { defineStore } from 'pinia'
import { useGameStore } from '../stores/game'
import {
  getFlush,
  getPairs,
  getFifteens,
  getRuns,
  getNobs,
} from '../utils/scoring'

export const useScoreStore = defineStore('score', () => {
  const { game } = useGameStore()
  let scoringTypes = ['fifteen', 'pair', 'run', 'flush', 'nobs']

  const initalState = {
    user: 0,
    bot: 0,
    flashMessage: { messages: [], player: '' },
    usersHandTotal: 0,
    botsHandTotal: 0,
    cribTotal: 0,
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
  }

  const score = reactive({ ...initalState })

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
    let userNobs = getNobs(game.usersHand, cutCard)

    let botFifteens = getFifteens(game.botsHand, cutCard)
    let botPairs = getPairs(game.botsHand, cutCard)
    let botRuns = getRuns(game.botsHand, cutCard)
    let botFlush = getFlush(game.botsHand, cutCard)
    let botNobs = getNobs(game.botsHand, cutCard)

    let userTotal =
      userFifteens.length * 2 +
      userPairs.length * 2 +
      userRuns.reduce((acc, cards) => (acc += cards.length), 0)

    if (userFlush.length) userTotal += userFlush[0].length
    if (userNobs.length) userTotal++
    score.usersHandTotal = userTotal

    let botTotal =
      botFifteens.length * 2 +
      botPairs.length * 2 +
      botRuns.reduce((acc, cards) => (acc += cards.length), 0)

    if (botFlush.length) botTotal += botFlush[0].length
    if (botNobs.length) botTotal++
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
    let nobs = getNobs(game.crib, cutCard)

    score.crib.fifteen = fifteens
    score.crib.pair = pairs
    score.crib.run = runs
    score.crib.flush = flush
    score.crib.nobs = nobs

    let total =
      fifteens.length * 2 +
      pairs.length * 2 +
      runs.reduce((acc, cards) => (acc += cards.length), 0)

    if (flush.length) total += flush[0].length
    if (nobs.length) cribTotal++
    score.cribTotal = total
  }

  const getCardElementsThatScored = (hand) =>
    scoringTypes.reduce(
      (acc, type) => ({
        ...acc,
        [type]: hand[type].map((cards) =>
          cards.map((card) =>
            document.querySelector(`[data-card='${JSON.stringify(card)}'`)
          )
        ),
      }),
      {}
    )

  const resetHandScores = () => {
    let user = score.user
    let bot = score.bot
    Object.assign(score, { ...initalState, user, bot })
  }

  return {
    score,
    awardPoints,
    calculateHandScores,
    calculateCribScores,
    getCardElementsThatScored,
    resetHandScores,
  }
})
