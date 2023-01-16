export async function wait(seconds) {
  await new Promise((res) => setTimeout(res, seconds * 1000))
}
