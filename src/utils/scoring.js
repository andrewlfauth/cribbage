import { getSetsOfTwo, getSetsOfThree, getSetsOfFour } from './helpers'

export function getPairs(cards, cutCard) {
  let hand = cards.concat(cutCard)
  var combinations = []
  for (let i = 0; i < hand.length; i++) {
    for (let j = i + 1; j < hand.length; j++) {
      if (hand[i].value == hand[j].value) {
        combinations.push([hand[i], hand[j]])
      }
    }
  }
  return combinations
}

export function getFlush(cards, cutCard) {
  let suit = cards[0].suit
  for (let i = 0; i < cards.length; i++) {
    if (cards[i].suit != suit) {
      return []
    }
  }
  if (cutCard.suit == suit) return [[...cards, cutCard]]
  else return [[...cards]]
}

export function getRuns(cards, cutCard) {
  let runs = []
  let hand = cards.concat(cutCard)
  if (isARun(hand)) return hand

  let setsOfFour = getSetsOfFour(hand)
  setsOfFour.forEach((cards) => {
    if (isARun(cards)) runs.push(cards)
  })
  if (runs.length) return runs

  let setsOfThree = getSetsOfThree(hand)
  setsOfThree.forEach((cards) => {
    if (isARun(cards)) runs.push(cards)
  })

  return runs
}

export function isARun(cards) {
  let sorted = cards.sort((a, b) => a.order - b.order)

  for (let i = 0; i < sorted.length - 1; i++) {
    if (i == sorted.length) return true
    if (sorted[i].order + 1 != sorted[i + 1].order) return false
  }
  return true
}

export function getFifteens(cards, cutCard) {
  let hand = cards.concat(cutCard)
  let sets = getSetsOfTwo(hand)
    .concat(getSetsOfThree(hand))
    .concat(getSetsOfFour(hand))

  let fifteens = []

  sets.forEach((cards) => {
    let total = cards.reduce((acc, cur) => (acc += cur.count), 0)
    if (total == 15) fifteens.push(cards)
  })
  return fifteens
}

export function getNobs(cards, cutCard) {
  if (cutCard.value == 'J') return []
  let nobs = cards.filter(
    (card) => card.value == 'J' && card.suit == cutCard.suit
  )
  if (nobs.length) return [[...nobs, cutCard]]
  else return []
}
