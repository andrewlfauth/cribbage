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

export function arrayIncludesObject(obj, array) {
  return array.some((item) => objectsEqual(item, obj))
}

export function removeObjFromArray(obj, array) {
  return array.filter((item) => !objectsEqual(item, obj))
}

export function getSetsOfFour(items) {
  const result = []
  for (let i = 0; i < items.length - 3; i++) {
    for (let j = i + 1; j < items.length - 2; j++) {
      for (let k = j + 1; k < items.length - 1; k++) {
        for (let l = k + 1; l < items.length; l++) {
          result.push([items[i], items[j], items[k], items[l]])
        }
      }
    }
  }
  return result
}

export function getSetsOfThree(items) {
  const result = []
  for (let i = 0; i < items.length - 2; i++) {
    for (let j = i + 1; j < items.length - 1; j++) {
      for (let k = j + 1; k < items.length; k++) {
        result.push([items[i], items[j], items[k]])
      }
    }
  }
  return result
}

export function getSetsOfTwo(items) {
  const result = []
  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      result.push([items[i], items[j]])
    }
  }
  return result
}
