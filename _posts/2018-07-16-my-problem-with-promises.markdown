---
layout: post
title:  "My Problems with JavaScript Promises"
tags: [Node.js, JavaScript, Promises, Async, async/await, MicroServices]

---

I don't particularly fancy JavaScript's **Promises**. Here are some of the
problems I have with using them as well as solutions to those problems which you
can use to write better asynchronous code, today!

# Problem 1: Promise chains often force variable declarations in their surrounding scope

Promises are not really great for long-running chains of *inter-dependent* async
operations. By *inter-dependent* I mean some async calls needing the return
values of some of the previous async calls in order to perform their job.

One of the ugly patterns that emerge when dealing with this is - declaring
variables in the surrounding scope, above the promise chain itself, so that
you can assign return values to them and use them down the Promise chain.

## Example:

Let's say that you are working in a *microservice-ridden* architecture and that
you need to juggle multiple services in order to process an **order**.

This problem doesn't only come up when using the *microservices* pattern, it
comes up all the time in bigger Promise chains.

For this example, let's keep it really simple and say you need to perform the
following steps:

1. Get the particular user's data
2. Get details on items in that user's shopping cart
3. Create an order

*Ignore the code style and "architectural decisions" in this post, the code
serves to illustrate an example.*

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

The natural solution to this is to declare a variable outside (above) the
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

# Problem 2: Promises can't handle events/streams of data

Promises are resolved only once, hence they have an inherent inability deal with
events/streams of data.

## Solutions:

First, and most obvious solution would be to simply go back to callback based
event handling. But callbacks leave much to be desired.

A full-fledged, robust way to deal with events/streams would be to use the
ubiquitous Reactive Extensions Library for JavaScript - [RxJS](https://rxjs-dev.firebaseapp.com/).

Eventually, ECMAScript standardization of [Observables](https://github.com/tc39/proposal-observable)
will (most likely) come and with the implementations that will follow you can
make use of **Observables** direcly in the language itself.

# Problem 3: Promises are not cancellable

## Example:

Let's say we want to process a payment. Payment processing is an asynchronous
action that takes a certain amount of time. We want to cancel that payment
processing if it takes too long and that will be implemented using the **Timeout
Race** pattern.
(Payments wouldn't be handled like this but bear with me, it's just for example
purposes).  

```javascript
const processPayment = () => new Promise((resolve, reject) => {
  preparePayment(() => {
    chargeCreditCard().then(resolve)
  })
})
function preparePayment(callback) {
  setTimeout(callback, 2 * 1000)
}
function chargeCreditCard() {
  console.log('Credit card is charged $XXX')
  return Promise.resolve()
}

const rejectAfter = timeout => new Promise((resolve, reject) => {
  setTimeout(() => reject('Request timed out!'), timeout)
})

Promise.race([
    processPayment(),
    rejectAfter(1000)
  ])
  .then(() => {
    console.log('Payment processed')
  })
  .catch(console.error)
```

In the example above, payment processing takes ~2000ms, and our timeout is set
to 1000ms. The `Promise.race()` will reject after those 1000ms. What happens to
our `processPayment()` promise that lost the race? **Its code executes
nonetheless!**

This is the example program's output:

```
Request timed out!
Credit card is charged $XXX
```

We accidentally charged the customer!

## Solution:

One ugly solution would be to create a flag and use it to indicate whether
the `processPayment()` is should continue executing or not:

```javascript
const processPayment = () => new Promise((resolve, reject) => {
  preparePayment(() => {
    chargeCreditCard()
      .then(resolve)
      .catch(e => {
        console.error(e)
        reject()
      })
  })
})

function preparePayment(callback) {
  setTimeout(callback, 2 * 1000)
}

function chargeCreditCard() {
  if (SHOULD_CHARGE_CUSTOMER) {
    console.log('Credit card is charged $XXX')
    return Promise.resolve()
  }
  return Promise.reject('Cancelled!')
}

const rejectAfter = timeout => new Promise((resolve, reject) => {
  setTimeout(() => reject('Request timed out!'), timeout)
})

let SHOULD_CHARGE_CUSTOMER = true

Promise.race([
    processPayment(),
    rejectAfter(1000)
  ])
  .then(() => {
    console.log('Payment processed')
  })
  .catch(e => {
    SHOULD_CHARGE_CUSTOMER = false
    console.error(e)
  })
```

This is ugly and contrived.

TC39 won't be helping us with [Promise cancellation](https://github.com/tc39/proposal-cancelable-promises)
anytime soon either.

The proper solution again is to use Observables ([RxJS](https://rxjs-dev.firebaseapp.com/) for example).

Observables support cancellation along with custom teardown logic you can add.

# Final takeaways:

Promises have deficiencies that pretty much rule them out for solving certain
kinds of problems.

By using new JavaScript language features and Reactive Programming libraries
we can cover the use cases where Promises are not an ideal/viable choice.

Also, I would higly recommend exploring Reactive Programming and there is
not a better place to start than here: https://gist.github.com/staltz/868e7e9bc2a7b8c1f754

Angular developers might be more comfortable with RP and FRP (Functional
Reactive Programming) concepts but, if you are a React or a Node.js
developer - give (F)RP a try, it will prove invaluable in a large number
of situations.
