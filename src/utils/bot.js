export function getCribCards(cards) {
  let idx1 = Math.floor(Math.random() * cards.length)

  let idx2 = Math.floor(Math.random() * cards.length)

  while (idx1 == idx2) {
    idx2 = Math.floor(Math.random() * cards.length)
  }

  return [idx1, idx2]
}
