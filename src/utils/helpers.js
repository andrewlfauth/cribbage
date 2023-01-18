export async function wait(seconds) {
  await new Promise((res) => setTimeout(res, seconds * 1000))
}

export function objectsEqual(obj1, obj2) {
  return JSON.stringify(obj1) == JSON.stringify(obj2)
}

export function getCenteredYOffset(el) {
  return (
    window.innerHeight - el.getBoundingClientRect().bottom - el.offsetHeight / 2
  )
}

export function getSplitCenteredXOffset(el, side) {
  let windowWidth = window.innerWidth
  let right = el.getBoundingClientRect().right

  return side == 'left'
    ? windowWidth / 2 - right + el.offsetWidth / 2 - el.offsetWidth
    : windowWidth / 2 - right + el.offsetWidth / 2 + el.offsetWidth
}
