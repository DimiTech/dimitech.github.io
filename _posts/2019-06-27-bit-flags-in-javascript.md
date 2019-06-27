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

## Example

Let's say we're developing a simple turn-based strategy game, and the player
can move in any of the [4 Cardinal and 4 Intercardinal directions](https://en.wikipedia.org/wiki/Cardinal_direction):

```
4 Cardinal and 4 Intercardinal Directions (8 in total):

       N       
  NW   ▲   NE  
     ◤ ◮ ◥     
W  ◄   ●   ►  E
     ◣   ◢     
  SW   ▼   SE  
       S       
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

* Big Endian Byte Order is used
```

## Conclusion

Bitwise operations should be pretty CPU efficient even in JS since they should
map directly to machine code but this does not offer any significant
performance improvement.

That's it for this quick post, I hope you appreciated my ASCII art :D

