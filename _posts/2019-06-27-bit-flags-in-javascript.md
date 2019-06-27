---
layout: post
title:  "Bit Flags in JavaScript"
description: "How to create and use bit flags in JavaScript"
tags: [Bit Flags, Low-Level, Useless, Fun, C, C++, JavaScript, Bitwise]

---

**Bit flags** are a clever trick that was used in C programming in order to
represent boolean options (and small numbers in general) in a more memory
efficient manner. 

Instead of using 1 byte of memory (`unsigned char`) to represent each boolean
value and waste 7 bits every time, bit flags were utilized in order to pack up
to 8 boolean options in 1 byte.

TCP/IP, BLE and a whole bunch of other low-level protocols use bit flags and bit
fields extensively. It doesn't make much sense in JavaScript, since all
JavaScript numbers are 64bit floats, and we don't manage the memory ourselves
but it's still a fun technique to use when it's appropriate.

# Example

Let's say we're developing a simple turn-based strategy game, and the player
can move in any of the [4 Cardinal and 4 Intercardinal directions](https://en.wikipedia.org/wiki/Cardinal_direction):

```javascript
4 Cardinal and 4 Intercardinal Directions (8 in total):

/*
       N       
  NW   ▲   NE  
     ◤ ◮ ◥     
W  ◄   ●   ►  E
     ◣   ◢     
  SW   ▼   SE  
       S       
*/
```

In our game, some tiles on the map are **traversable** and some are not.
We want to simulate a situation like this one here:

```
▓▓░░░░
▓▓◄►░░
▓▓▓▓▓▓

◄► - Player
░░ - Traversable
▓▓ - Not Traversable
```

In the example above the player (`◄►`) can only move to the **North**,
**North East** or **East**. Other directions are blocked.

In order to know which of the tiles adjacent to the player are **traversable**
and which are not we can use an 8bit **bit flag**:

```
  00000111 === 7
  ↑↑↑↑↑↑↑↑
  NWSSSENN
  W W E E 

1 - Traversable
0 - Not Traversable
```

# Implementation

The implementation consists of 3 parts:

## 1. Defining the available options (directions)

The `Directions` are modeled using a simple hash-map:

```javascript
const Directions = {
  N  : 1 << 0, // 00000001
  NE : 1 << 1, // 00000010
  E  : 1 << 2, // 00000100
  SE : 1 << 3, // 00001000
  S  : 1 << 4, // 00010000
  SW : 1 << 5, // 00100000
  W  : 1 << 6, // 01000000
  NW : 1 << 7, // 10000000
}

console.log(Directions)
/* Output:
{ N: 1, NE: 2, E: 4, SE: 8, S: 16, SW: 32, W: 64, NW: 128 }
*/
```

Each one of the options is the next power of 2. This is easily achievable using
the `shift left` operator `<<`.

## 2. Definging the traversable directions

We define the traversable directions using the bitwise OR (`|`) operator:

```javascript
const traversableDirections =
  Directions.N  |
  Directions.NE |
  Directions.E

console.log(
  'Available directions:',
  traversableDirections.toString(2).padStart(8, '0'),
)
/* Output:
Available directions: 00000111
*/
```

## 3. Using **bit masks** to check the state of individual bits

To check if the individual bit flags are set we use the `&` bitwise operator.

For example, if we want to check if `North` is traversable, we can check if the
North bit flag is set in `traversableDirections`:

```javascript
(traversableDirections & Directions.N ) === Directions.N // true

/* In binary:
  00000111
& 00000001
= 00000001
*/
```

Let's check every one of the directions:

```javascript
console.log('Player can move N :', (traversableDirections & Directions.N ) === Directions.N ) // true
console.log('Player can move NE:', (traversableDirections & Directions.NE) === Directions.NE) // true
console.log('Player can move E :', (traversableDirections & Directions.E ) === Directions.E ) // true
console.log('Player can move SE:', (traversableDirections & Directions.SE) === Directions.SE) // false
console.log('Player can move S :', (traversableDirections & Directions.S ) === Directions.S ) // false
console.log('Player can move SW:', (traversableDirections & Directions.SW) === Directions.SW) // false
console.log('Player can move W :', (traversableDirections & Directions.W ) === Directions.W ) // false
console.log('Player can move NW:', (traversableDirections & Directions.NW) === Directions.NW) // false
```

# Comparison with the traditional approach

Our code so far looks like this:

```javascript
const Directions = {
  N  : 1 << 0,
  NE : 1 << 1,
  E  : 1 << 2,
  SE : 1 << 3,
  S  : 1 << 4,
  SW : 1 << 5,
  W  : 1 << 6,
  NW : 1 << 7,
}

const traversableDirections =
  Directions.N  |
  Directions.NE |
  Directions.E

console.log('Player can move N :', (traversableDirections & Directions.N ) === Directions.N ) // true
console.log('Player can move NE:', (traversableDirections & Directions.NE) === Directions.NE) // true
console.log('Player can move E :', (traversableDirections & Directions.E ) === Directions.E ) // true
console.log('Player can move SE:', (traversableDirections & Directions.SE) === Directions.SE) // false
console.log('Player can move S :', (traversableDirections & Directions.S ) === Directions.S ) // false
console.log('Player can move SW:', (traversableDirections & Directions.SW) === Directions.SW) // false
console.log('Player can move W :', (traversableDirections & Directions.W ) === Directions.W ) // false
console.log('Player can move NW:', (traversableDirections & Directions.NW) === Directions.NW) // false
```

A more traditional JavaScript implementation would be something like this:

```javascript
const traversableDirections = {
  N  : true,
  NE : true,
  E  : true,
  SE : false,
  S  : false,
  SW : false,
  W  : false,
  NW : false,
}

console.log('Player can move N :', traversableDirections.N ) // true
console.log('Player can move NE:', traversableDirections.NE) // true
console.log('Player can move E :', traversableDirections.E ) // true
console.log('Player can move SE:', traversableDirections.SE) // false
console.log('Player can move S :', traversableDirections.S ) // false
console.log('Player can move SW:', traversableDirections.SW) // false
console.log('Player can move W :', traversableDirections.W ) // false
console.log('Player can move NW:', traversableDirections.NW) // false
```

Even though the traditional JavaScript approach has less code it is less
readable and less performant.

The `traversableDirections` object needs to be created
every time and eventually garbage collected (keep in mind that this code might
be running at 60fps). The hash-map implementation of `traversableDirections` is
way less readable to me than the bit flag - which is crystal clear:

```javascript
const traversableDirections =
  Directions.N  |
  Directions.NE |
  Directions.E
```

The bitwise `&` flag checking is way more tedious than a simple property access although
bitwise operations should be pretty CPU efficient even in JS (since they should
map directly to machine code). It's worth noting that this does not offer any
significant performance improvements in this case.

## Conclusion

Bit flags are an old-school technique that is really unnecessary in JavaScript
but if you want to use them, even as a tribute to the old days, go ahead!

I personally like to sprinkle them here and there just for fun.

P.S. I hope you enjoyed my ASCII art :D

