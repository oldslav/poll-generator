function sleep(time: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, time)
  })
}

function onPollInterrupted() {
  throw new Error('Poll interrupted')
}

function onTiresExceeded() {
  throw new Error('Tries ecxeeded')
}

function customizePollGenerator(
  pollInterrupted = onPollInterrupted as (result?: unknown) => any,
  triesExceeded = onTiresExceeded as (result?: unknown) => any
) {
  return async function* (
    fn: () => any,
    maxTries: number,
    time: number,
    controller?: AbortController
  ) {
    if (maxTries == Infinity && !controller) {
      console.warn('Provide AbortController for infinite loop!')
    }
    let result
    do {
      if (controller?.signal.aborted) pollInterrupted(result)
      result = await fn()
      yield result
      await sleep(time)
    } while (--maxTries > 0)
    triesExceeded(result)
  }
}

const createPollGenerator = customizePollGenerator()
export { createPollGenerator as default, customizePollGenerator }
