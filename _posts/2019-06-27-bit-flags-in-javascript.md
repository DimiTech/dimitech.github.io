---
layout: post
title:  "Bit Flags in JavaScript"
description: "How to create and use bit flags in JavaScript"
tags: [Bit Flags, Bit Fields, Low-Level, Useless, Fun, C, C++, JavaScript, TypeScript, Bitwise]

---

**Bit flags** are a clever trick that was used in C programming in order to
represent boolean options (and small numbers in general) in a more memory
efficient manner. 

Instead of using 1 byte of memory (`unsigned char`) to represent each boolean
value and waste 7 bits every time, bit flags were utilized in order to pack up
to 8 boolean options in 1 byte.

TCP/IP, BLE and a bunch of other low-level protocols use bit flags and bit
fields extensively. It doesn't make much sense in JavaScript, since all
JavaScript numbers are 64bit floats and we don't manage the memory ourselves
but it's still a fun technique to use when it's appropriate.

# Example

Let's say we're developing a simple turn-based strategy game, and the player
can move in any of the [4 Cardinal and 4 Intercardinal directions](https://en.wikipedia.org/wiki/Cardinal_direction):

![ASCII Compass](/images/2019-06-27-bit-flags-in-javascript/compass.png "ASCII Compass")

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

![Bit Flags](/images/2019-06-27-bit-flags-in-javascript/bit-flags.png "Bit Flags")

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

## 2. Defining the traversable directions

We define the traversable directions by chaining them using the bitwise OR (`|`)
operator:

```javascript
const traversableDirections =
  Directions.N  |
  Directions.NE |
  Directions.E

console.log(
  'Traversable directions:',
  traversableDirections.toString(2).padStart(8, '0'),
)
/* Output:
Traversable directions: 00000111
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

Our bit-flag code so far looks like this:

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

Even though the traditional JavaScript approach has less code it is somewhat
less readable and less performant.

The `traversableDirections` object needs to be created
every time and eventually garbage collected (keep in mind that this code might
be running at 60fps). This can be mitigated by directly mutating a single
`traversableDirections` object properties.

Either way, the hash-map implementation of `traversableDirections` is
way less readable to me than the bit flag - which is crystal clear:

```javascript
const traversableDirections =
  Directions.N  |
  Directions.NE |
  Directions.E
```

On the other hand, the bitwise `&` flag checking is way more tedious than a
simple property access although, even in JavaScript, bitwise operations should
be pretty CPU efficient (since they should map directly to machine code). It's
worth noting that this does not offer any significant performance improvements
in this case.

# Conclusion

Bit flags are an old-school technique that is really unnecessary in JavaScript
but if you want to use them, as a tribute to the old days, go ahead!

I personally like to sprinkle them here and there just for fun.

P.S. I hope you enjoyed the ASCII :)

# Bonus #1: TypeScript implemenation

In TypeScript, bit flags can be represented by using an `enum`:

```typescript
enum Directions {
  N  = 1 << 0,
  NE = 1 << 1,
  E  = 1 << 2,
  SE = 1 << 3,
  S  = 1 << 4,
  SW = 1 << 5,
  W  = 1 << 6,
  NW = 1 << 7,
}

const traversableDirections: number =
  Directions.N  |
  Directions.NE |
  Directions.E

// ...
```

# Bonus #2 - C Implementation

C Implementation using pre-processor macros:

```c
#include <stdio.h>

#define DIRECTIONS_N  (1 << 0) // 00000001
#define DIRECTIONS_NE (1 << 1) // 00000010
#define DIRECTIONS_E  (1 << 2) // 00000100
#define DIRECTIONS_SE (1 << 3) // 00001000
#define DIRECTIONS_S  (1 << 4) // 00010000
#define DIRECTIONS_SW (1 << 5) // 00100000
#define DIRECTIONS_W  (1 << 6) // 01000000
#define DIRECTIONS_NW (1 << 7) // 10000000

int main(int argc, char** argv) {
  unsigned char traversableDirections =
    DIRECTIONS_N  |
    DIRECTIONS_NE |
    DIRECTIONS_E;

  printf(
    "Size of traversableDirections: %lu %s\n",
    sizeof(traversableDirections),
    sizeof(traversableDirections) == 1 ? "byte" : "bytes"
  ); // 1 byte

  printf(
    "traversableDirections == 0b00000111: %s\n\n",
    (traversableDirections == 0b00000111) ? "true" : "false"
  ); // true

  printf("Player can move N : %d\n", (traversableDirections & DIRECTIONS_N ) == DIRECTIONS_N ); // 1
  printf("Player can move NE: %d\n", (traversableDirections & DIRECTIONS_NE) == DIRECTIONS_NE); // 1
  printf("Player can move E : %d\n", (traversableDirections & DIRECTIONS_E ) == DIRECTIONS_E ); // 1
  printf("Player can move SE: %d\n", (traversableDirections & DIRECTIONS_SE) == DIRECTIONS_SE); // 0
  printf("Player can move S : %d\n", (traversableDirections & DIRECTIONS_S ) == DIRECTIONS_S ); // 0
  printf("Player can move SW: %d\n", (traversableDirections & DIRECTIONS_SW) == DIRECTIONS_SW); // 0
  printf("Player can move W : %d\n", (traversableDirections & DIRECTIONS_W ) == DIRECTIONS_W ); // 0
  printf("Player can move NW: %d\n", (traversableDirections & DIRECTIONS_NW) == DIRECTIONS_NW); // 0
  return 0;
}
```

C Implementation using a bit field struct (less portable and can lead to
possible undefined behavior):

```c
#include <stdio.h>

typedef struct {
  unsigned char N  : 1; // -------□
  unsigned char NE : 1; // ------□-
  unsigned char E  : 1; // -----□--
  unsigned char SE : 1; // ----□---
  unsigned char S  : 1; // ---□----
  unsigned char SW : 1; // --□-----
  unsigned char W  : 1; // -□------
  unsigned char NW : 1; // □-------
} Directions;

int main(int argc, char** argv) {
  printf("Size of Directions struct: %lu\n", sizeof(Directions)); // 1 byte

  Directions traversableDirections = {
    .N  = 1,
    .NE = 1,
    .E  = 1,
    .SE = 0,
    .S  = 0,
    .SW = 0,
    .W  = 0,
    .NW = 0,
  }; // 0b00000111

  printf(
    "Size of traversableDirections: %lu %s\n",
    sizeof(traversableDirections),
    sizeof(traversableDirections) == 1 ? "byte" : "bytes"
  ); // 1 byte

  printf("Player can move N : %d\n", traversableDirections.N  == 1); // 1
  printf("Player can move NE: %d\n", traversableDirections.NE == 1); // 1
  printf("Player can move E : %d\n", traversableDirections.E  == 1); // 1
  printf("Player can move SE: %d\n", traversableDirections.SE == 1); // 0
  printf("Player can move S : %d\n", traversableDirections.S  == 1); // 0
  printf("Player can move SW: %d\n", traversableDirections.SW == 1); // 0
  printf("Player can move W : %d\n", traversableDirections.W  == 1); // 0
  printf("Player can move NW: %d\n", traversableDirections.NW == 1); // 0

  return 0;
}
```
