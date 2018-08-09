---
layout: post
title:  "My issues with Promises"
tags: [Node.js, JavaScript, Promises, Async, async/await]

---

Back in the day Promises were the shit. Nowdays we have better options.

I don't particularly fancy Promises lately, and here are the problems I have
with them:

## Problem 1: Promise chains often force "global" variables

They suck for long-running chains of inter-dependent async operations.


Let's say we have to make a buch of async calls.

The ugliness can emerge:

- When some of the async calls need data that is being produced by previous
  promise calls.

Splitting the declaration and assignment of variables like this is just
annoying.
  
This means we have to capture that data and make it available downstream. Example:

```javascript
getUserInfo(userId)
  .then(userInfo => {
    const { shoppingCartId, shoppingCartItems } = userInfo
    return Promise.all(shoppingCartItems.forEach(item => checkIfItemsInStock(item)))
  })
  .then(itemsAvailable => {
    if (itemsAvailable.every(item => item.isAvailable)) {
    
    }
  })
```
