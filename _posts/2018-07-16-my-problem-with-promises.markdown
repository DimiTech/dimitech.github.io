---
layout: post
title:  "My Problems with JavaScript Promises"
tags: [Node.js, JavaScript, Promises, Async, async/await, MicroServices]

---

I don't particularly fancy JavaScript's **Promises**. Here are some of the
problems I have with them as well as solutions to those problems which you can
use to write better asynchronous code, today!

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

Luckily we don't have to use *bare* Promises anymore - **async/await** to the
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
in the reader's mind.

[redux-saga](https://redux-saga.js.org/) is a great alternative as well.
