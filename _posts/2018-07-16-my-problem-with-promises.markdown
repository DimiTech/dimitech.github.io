---
layout: post
title:  "My Problems with JavaScript Promises"
tags: [Node.js, JavaScript, Promises, Async, async/await, MicroServices]

---

I don't particularly fancy JavaScript's **Promises**. Here are some of the
problems I have with using them as well as solutions to those problems which you
can use to write better asynchronous code, today!

# Problem 1: You can't access the lexical scope of Promise callbacks

Promises are not really great for long-running chains of *inter-dependent* async
operations. By *inter-dependent* I mean some async calls needing the return
values of some of the previous async calls in order to perform their job.

One of the ugly patterns that emerge when dealing with this is - declaring
variables in the surrounding scope, above the promise chain itself, so that
you can assign return values to them and use them down the Promise chain.

## Example:

Let's say that you are working in a *microservice-ridden* architecture and that
you need to juggle multiple services in order to process an **order**.

This problem doesn't only come up when working with services, it crops up all
the time in bigger Promise chains.

For this example, let's keep it really simple and say you need to perform the
following steps:

1. Get the particular user's data
2. Get details on items in that user's shopping cart
3. Create an order

> Ignore the code style and "architectural decisions" in this post, the code
serves to illustrate an example.

```javascript
function createOrder(userId) {
  let userData

  return UserService.getUserData(userId)
    .then(fullUserData => {
      userData = fullUserData
      return ItemService.getItemsFromCart(userData.cart)
    })
    .then(cartItems => OrderService.createOrder(userData, cartItems))
    .catch(console.error)
}

createOrder(1)
```

As you can see, the `OrderService.createOrder()` function needs both the **user
data** and **shopping cart items** in order to be executed.

The common solution to this problem is to declare a variable outside (above) the
Promise chain and store the intermediary **user data** in it when it arrives
from the **UserService**.

This obviously produces unnecessary boilerplate and mental overhead.

Another problem with this approach is - you have to come up with different names
for the variable outside the promise chain and the variable that's returned from
the **UserService** in order to be able to assign a value to the outside
variable.

All in all - it's just ugly. All the parenthesis, curly braces and excess
characters are just bogging down the reader. And I've tried to use syntactic
sugar and shorthand notation as much as possible.

Also keep in mind that this is an *extremely simple* example. IRL, you will very
often face promise chains that have 5, 10 and more links in the chain (I'm
sticking with the chain metaphor). This means we're going to have multiple
pre-declared variables in the outer scope, as well as a big, ugly chain.

> **Unnecessary mental overhead is harmful, no matter how insignificant it might
  seem at the moment. Keep code simple, clean and lean!**

## Solution: async/await

Luckily you don't have to use *bare* Promises anymore - **async/await** to the
rescue:

```javascript
async function createOrder(userId) {
  try {
    const userData  = await UserService.getUserData(userId)
    const cartItems = await ItemService.getItemsFromCart(userData.cart)
    await OrderService.createOrder(userData, cartItems)
  } catch (e) {
    console.error(e)
  }
}

createOrder(1)
```

Even at first glance, the async/await example is more readable and fits better
in the reader's mind. Boilerplate is minimal and all the variables are at the
same scope level.

For projects based on Redux - [redux-saga](https://redux-saga.js.org/) offers a
great **Generator** based alternative as well. Be aware that redux-saga is a
library, which of course introduces additional learning, maintenance and
project-size/performance overhead. It's one of the best nonetheless.

## Final advice:

Now, **async/await** is based on **Promises** and that means that you cannot
(and should not) avoid Promises completely. Promises expose the extremely useful
`all()` and `race()` utilities, while async/await cleans up the long-running
sequences of inter-dependent async calls.

One **very important** thing to do is abstract the **Promise** details away from
the **async/await** code.

> **async/await** is used to express higher-level tasks, **Promises** are used
  for the _plumbing_ underneath

This is not a hard and fast rule though, as with many things in programming.
Use good judgement and create the proper level of abstraction for your specific
situation.

# Problem 2: Promises are not cancellable

## Example:

Let's say that we are (1) requesting some raw data (maybe by interacting with
hardware), then we need to (2) decode and process that data, and lastly, (3)
show it on the screen of some user facing interface.

The flow goes like this:
1. Fetch raw data (this operation is **asynchronous** and takes some time, around 1000ms
   let's say)
2. Decode data (this is **synchronous** and **blocking**)
2. Present the decoded data on the screen

In code it could look something like this:
```javascript
fetchRawData() // Takes ~1000ms to resolve
  .then(buffer => decode(buffer))
  .then(decoded => showOnScreen(decoded))
  .catch(console.error)
```

Now, what would happen if the user navigated to another screen before
`fetchRawData()` returned? The user doesn't care about the previous screen or
it's data anymore!

Most likely - an error would be thrown since you don't have a place to display
the data anymore. References to the GUI components from the previous screen
are now gone.

This is obviously annoying for a couple of reasons:
* `decode(buffer)` will waste some CPU cycles by processing data we don't need
  anymore
* `showOnScreen(decoded)` will throw an **error** which we have to handle in
  code or feed to the logging system

Depending on your specific use case the annoyances of not being able to
**cancel** a promise chain might be more or less severe.

## Solution:

One ugly solution would be to create a flag and use it to indicate whether
the promise chain should continue executing or not:

```javascript
const p = fetchRawData() // Takes ~1000ms to resolve
  .then(buffer => {
    if (p.isCancelled) return Promise.reject()
    return decode(buffer)
  })
  .then(decoded => {
    if (p.isCancelled) return Promise.reject()
    return showOnScreen(decoded)
  })
  .catch(e => {
    if (p.isCancelled) {
      console.log('Cancelled!')
    }
    else {
      console.error(e)
    }
  })

setTimeout(() => {
  p.isCancelled = true
}, 500)
```

First we saved a reference to the promise chain in the variable `p`. For the
cancellation token we use a boolean property on the promise chain reference -
`p.isCancelled`. 

We will simulate the user interaction by "cancelling" the promise chain after
500ms, which means that `fetchRawData()` has not resolved at that point in time.

This solution forces us to check for the `p.isCancelled` token in every
`.then()` closure.

Pretty rough and contrived, but does the job moderately well.

Is there a better solution though?

The TC39 members were working on it but the [Promise cancellation](https://github.com/tc39/proposal-cancelable-promises)
proposal was withdrawn since they could not reach a consensus.

Until we get language support for cancellation we will have to use an external
async library to solve this problem.

For example, [Bluebird's promise cancellation](http://bluebirdjs.com/docs/api/cancellation.html)
is straight-forward and it also terminates network requests by default, which
is a great bonus.

Using _Bluebird_ the previous code would look like this:

```javascript
const Promise = require('bluebird')

Promise.config({
  cancellation: true
})

const p = fetchRawData() // Takes ~1000ms to resolve
  .then(buffer => decode(buffer))
  .then(decoded => showOnScreen(decoded))
  .catch(console.error)
  .finally(() => {
    if (p.isCancelled) {
      console.log('Cancelled!')
    }
  })

setTimeout(() => p.cancel(), 500)
```

Way better!

Another possible solution would be to use Observables (for example -
[RxJS](https://rxjs-dev.firebaseapp.com/)).  
Observables support cancellation along with custom teardown logic you can add
but they are a completely differnet way of dealing with asynchronous programming
overall.

There are also other libraries can do the job but I would advise against buying
into other people's ideas and abstractions and sticking to something which
looks like a natural extension of the JavaScript feature set or is a standard
library used by millions of people.

# Problem 3: Promises can't handle events/streams of data

Promises are resolved only once, hence they have an inherent inability deal with
events/streams of data. Since Promises are not designed for this use-case I can't
hold it against them. Nevertheless, let's explore some solutions for events and
streams.

## Solutions:

First, and most obvious solution would be to simply go back to callback based
event handling. But callbacks leave much to be desired.

If you are in a Node.js environment, you can use [Node.js streams](https://nodejs.org/api/stream.html)
or [events](https://nodejs.org/api/events.html).
If you are in the browser environment, you can use Streams API.
If you have neither of those environments to leverage, you unfortunately have
to use a 3rd party library.

A full-fledged, robust way to deal with events/streams would be to use the
ubiquitous Reactive Extensions Library for JavaScript - [RxJS](https://rxjs-dev.firebaseapp.com/).

Eventually, ECMAScript standardization of [Observables](https://github.com/tc39/proposal-observable)
will (most likely) come and with the implementations that will follow you can
make use of **Observables** directly in the language itself.

# Final takeaways:

Promises have deficiencies that pretty much rule them out for solving certain
kinds of problems.

By using new JavaScript language features and Async Programming libraries
we can cover the use cases where Promises are not an ideal/viable choice.

Also, I would highly recommend exploring Reactive Programming and there is
not a better place to start than [here](https://gist.github.com/staltz/868e7e9bc2a7b8c1f754).

Angular developers might be more comfortable with RP and FRP (Functional
Reactive Programming) concepts but, if you are a React or a Node.js
developer - give (F)RP a try, it will prove itself very useful in a large
number of situations.
