# poll-generator

Polling async functions with AsyncGenerator.

### why?

To poll functions without passing multiple callbacks to process different results.

## Instalation & Usage

Install with npm

```sh
npm i --save poll-generator
```

Import and use it

```js
import createPollGenerator from 'poll-generator'

const controller = new AbortController()

async function pollSomething() {
  const poller = createPollGenerator(
    api.apiCall.bind(api, ...someArgs),
    10,
    1000,
    controller
  )
  try {
    for await (const result of poller) {
      console.log(result)
      // do something based on the result
      break // to get out of loop and continue with try block
      return result // just return the result
    }
  } catch (e) {
    if (e.message === 'Poll interrupted') {
      // if poll was aborted
    }
    if (e.message === 'Tries exceeded') {
      // maxTries === 0
    }
    // every other error
  }
}

controller.abort() // call to end poll
```

## Docs

### Parameters

`fn: () => any`

Async function to be called. Use `Function.prototype.bind` to pass arguments.

`maxTries: number`

Number of times to call fn()

`time: number`

Delay between calls in milliseconds

`controller: AbortController` (optional)

Instance of AbortController

### Customization

By default createPollGenerator throws 'Poll interrupted' and 'Tries ecxeeded' errors when poll is aborted or tries are exceeded.
This behavior can be changed by importing and using `customizePollGenerator` function

```js
// customPollGenerator.js

import { customizePollGenerator } from 'poll-generator'

// result of fn() is passed to a function so you can use it
function onAbort(result) {
  console.log(result)
}

function onTimeout(result) {
  console.log('no tries left', result)
}

const customPoll = customizePollGenerator(onAbort, onTimeout)

export default customPoll
```

```js
import customPoll from './customPollGenerator'

async function pollSomething() {
  const poller = ...
}
```
