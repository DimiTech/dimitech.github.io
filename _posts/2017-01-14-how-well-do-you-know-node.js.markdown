---
layout: post
title:  "Re: How well do you know Node.js?"
description: "Answers to 40 questions that every Node.js developer needs to know."
tags: [Node.js, JavaScript]

---
So, the other day I ran across a blog post called [How well do you know Node.js?](https://edgecoders.com/how-well-do-you-know-node-js-36b1473c01c8){:target="_blank"}
It's basically a content marketing piece with a purpose of selling a Node.js course (which is perfectly fine of course). 
It still offers value to the reader in form of 40 questions that put your Node knowledge to the test.

I've gone ahead and answered these questions here so that people who read this
post can review or upgrade their Node chops.

In order to get most out of these answers - try out all of the examples and see
the behaviour yourself.

**Notice:** The article is prone to changes so I've copied the list of questions
that were in the blog post at the time of writing this article.

Let's get on with it:

## Questions

1. [How come when you declare a global variable in any Node.js file it’s not really global to all modules?](#1-how-come-when-you-declare-a-global-variable-in-any-nodejs-file-its-not-really-global-to-all-modules)
2. [When exporting the API of a Node module, why can we sometimes use exports and other times we have to use module.exports?](#2-when-exporting-the-api-of-a-node-module-why-can-we-sometimes-use-exports-and-other-times-we-have-to-use-moduleexports)
3. [Can we require local files without using relative paths?](#3-can-we-require-local-files-without-using-relative-paths)
4. [What is the Event Loop? Is it part of V8?](#4-what-is-the-event-loop-is-it-part-of-v8)
5. [What is the Call Stack? Is it part of V8?](#5-what-is-the-call-stack-is-it-part-of-v8)
6. [What is the difference between setImmediate and process.nextTick?](#6-what-is-the-difference-between-setimmediate-and-processnexttick)
7. [How do you make an asynchronous function return a value?](#7-how-do-you-make-an-asynchronous-function-return-a-value)
8. [Can callbacks be used with promises or is it one way or the other?](#8-can-callbacks-be-used-with-promises-or-is-it-one-way-or-the-other)
9. [What are the major differences between spawn, exec, and fork?](#9-what-are-the-major-differences-between-spawn-exec-and-fork)
10. [How does the cluster module work? How is it different than using a load balancer?](#10-how-does-the-cluster-module-work-how-is-it-different-than-using-a-load-balancer)
11. [What are the --harmony-* flags?](#11-what-are-the---harmony--flags)
12. [How can you read and inspect the memory usage of a Node.js process?](#12-how-can-you-read-and-inspect-the-memory-usage-of-a-nodejs-process)
13. Can reverse-search in commands history be used inside Node’s REPL?
14. What are V8 object and function templates?
15. What is libuv and how does Node.js use it?
16. How can you make Node’s REPL always use JavaScript strict mode?
17. How can we do one final operation before a Node process exits? Can that operation be done asynchronously?
18. Besides V8 and libuv, what other external dependencies does Node have?
19. What’s the problem with the process uncaughtException event? How is it different than the exit event?
20. Do Node buffers use V8 memory? Can they be resized?
21. What’s the difference between Buffer.alloc and Buffer.allocUnsafe?
22. How is the slice method on buffers different from that on arrays?
23. What is the string_decoder module useful for? How is it different than casting buffers to strings?
24. What are the 5 major steps that the require function does?
25. What is the require.resolve function and what is it useful for?
26. What is the main property in package.json useful for?
27. What are circular modular dependencies in Node and how can they be avoided?
28. What are the 3 file extensions that will be automatically tried by the require function?
29. When creating an http server and writing a response for a request, why is the end() function required?
30. When is it ok to use the file system *Sync methods?
31. How can you print only one level of a deeply nested object?
32. What is the node-gyp package used for?
33. The objects exports, require, and module are all globally available in every module but they are different in every module. How?
34. How can a module be both requirable by other modules and executable directly using the node command?
35. What’s an example of a built-in stream in Node that is both readable and writable?
36. What’s the difference between using event emitters and using simple callback functions to allow for asynchronous handling of code?
37. The require function always caches the module it requires. What can you do if you need to execute the code in a required module many times?
38. What’s the difference between the Paused and the Flowing modes of readable streams?
39. What does the --inspect argument do for the node command?
40. When working with streams, when do you use the pipe function and when do you use events? Can those two methods be combined?

## 1. How come when you declare a global variable in any Node.js file it’s not really global to all modules?

### Browser JavaScript:

When you declare a JavaScript variable in a browser environment (outside of any functions), that variable implicitly becomes **global**.

What that means is that the variable becomes available anywhere in your JavaScript code.

When you declare a global variable in the browser, that variable becomes the property of the `window` global object.

This example illustrates that behavior:

```javascript
/* Run this code in your browser console. */
var globalVar = 'global variable'

console.log(globalVar)        // Output: 'global variable'.
console.log(window.globalVar) // Output: 'global variable'.
```

### Node.js JavaScript:

In the Node.js environment, we don't have a `window` global variable (since there is no window, duh) but we have `global`.

You can think of the `global` object in the same way you think about `window`. Its properties are global, publicly available *values*.

```javascript
/* Run this code in your Node.js REPL terminal. */
var globalVar = 'global variable'

console.log(globalVar)        // Output: 'global variable'.
console.log(global.globalVar) // Output: 'global variable'.
```

Where it gets tricky is when you declare a global variable inside a *.js* file.

Node.js uses the CommonJS module system.

**Every JavaScript file in the Node.js world is considered a module and therefore all of the variables that are global to a single file are not visible in other files (modules).**

To test this behavior, create a new project folder and inside that folder create 2 files - `file1.js` and `file2.js` (creative, I know).

Put the follwing code inside those files:

```javascript
/**
 * file1.js
 */
 
var globalVar = 'global variable'

console.log(globalVar)                      // Output: 'global variable'.
console.log(global.globalVar === undefined) // Output: true.

require('./file2')
```

```javascript
/**
 * file2.js
 */
 
try {
    console.log(globalVar) // Throws an exception since `globalVar` is not defined.
} catch(err) {
    console.dir(err.name === 'ReferenceError') // Output: true.
}

console.log(global.globalVar === undefined) // Output: true.
```

`cd` into your project folder and run the first file: `node file1`.

What we see happen here is that the global variable `globalVar` does not get attached to the `global` object in the first place and therefore is not global and other modules can't see it.

This is a good thing, since global namespace pollution tends to be a big problem in programming (that's why people hate on PHP).

If you explicitly need to declare a global variable, attach the value to the `global` object and it will be accessible from anywhere.

*Helpful resources:*

- Eloquent JavaScript - Modules chapter explains how the CommonJS require function works on a basic level: [http://eloquentjavascript.net/10_modules.html](http://eloquentjavascript.net/10_modules.html){:target="_blank"}


## 2. When exporting the API of a Node module, why can we sometimes use `exports` and other times we have to use `module.exports`?

First let's understand what `module`, `exports` and `module.exports` are. They are all properties of the Node's `global` object.

The Node.js runtime environment has some global variables that are always available just as the browser does (browser has `window` and its properties like `location`, `document`, `console`...). 

Open up your Node REPL and try accessing the following variables:

```javascript
/* Type this code in your Node.js REPL terminal line by line 
   and observe the output. */
global // Enter.

process                    // Enter.
global.process === process // Output: true.

module                   // Enter.
global.module === module // Output: true.

module.exports                           // Enter.
global.module.exports === module.exports // Output: true.
```

The `global` object is the Node's global variable and all of the variables below it are its properties.

But what happens inside files? Let's figure it out, create and run the following file:

```javascript
/** 
 *  module_test.js - Node module API test.
 */
console.dir(this)    // Output: {}
console.dir(exports) // Output: {}
console.dir(module.exports === exports) // Output: true
console.dir(module.exports === this)    // Output: true
```

Interesting. We come to a conclusion that, inside of a file, `this`, `exports` and `module.exports` are pointing to the same memory address. They are the same object!

Now, to answer the question, when do we use `exports` and when `module.exports`?

**The `exports` object**, that resides inside of every Node module (file), **is the module's API** (public interface).

Every property that we attach on to it becomes publicly accessible to other modules.

We want to use the `exports` variable as a shorthand for `module.exports`.

Let's consider a situation where we want our public API to contain 3 methods.
We could achieve that in multiple ways (there's probably even more than this):

```javascript
/** 
 *  module_test2.js - Node module API test 2.
 */ 
module.exports.methodOne   = () => { console.log('whatever 1') }
module.exports.methodTwo   = () => { console.log('whatever 2') }
module.exports.methodThree = () => { console.log('whatever 3') }

// or:

exports.methodTwo   = () => { console.log('whatever 2') }
exports.methodOne   = () => { console.log('whatever 1') }
exports.methodThree = () => { console.log('whatever 3') }

// or:

this.methodTwo   = () => { console.log('whatever 2') }
this.methodOne   = () => { console.log('whatever 1') }
this.methodThree = () => { console.log('whatever 3') }

// or:

module.exports = {
    methodOne()   { console.log('whatever 1') },
    methodTwo()   { console.log('whatever 2') },
    methodThree() { console.log('whatever 3') }
}

// These two API definitions fail to get exported.

// Fails.
exports = {
    methodOne()   { console.log('whatever 1') },
    methodTwo()   { console.log('whatever 2') },
    methodThree() { console.log('whatever 3') }
}

// Fails.
this = {
    methodOne()   { console.log('whatever 1') },
    methodTwo()   { console.log('whatever 2') },
    methodThree() { console.log('whatever 3') }
}

// etc. etc... 
```

So `exports` is used when we want our API to expose multiple values (functions, objects, strings... whatever). We declare those values as separate properties of the `exports` object.

`module.exports` is used when we want to export only a single value (which can be an object containing other values, a function, a number ... any JavaScript value).

You might be wondering why are the last two APIs failing to get exposed? The answer lies in the way that the CommonJS module system works.

Imagine your every Node file (module) being a function and having these invisible lines of code at the beginning and the end of them:

```javascript
function testModule() {
    var exports = module.exports = {}
    // ...
    // Your module code...
    // ...
    return module.exports
}
```

It's only natural that then, if you make `exports` point to another value, it gets compeletely ignored and module.exports gets returned.

`exports` is just a helpful pointer to `module.exports`.

If you want to learn more about this behavior, dig deeper into CommonJS modules. 

## 3. Can we require local files without using relative paths?

There are two ways (that I'm familiar with) to `require` local files:

```javascript
// `require`-ing a module using the relative path.
let testModule = require('./test-module.js')

// `require`-ing a module using the absolute path.
let testModuleAgain = require('/home/dusan/Desktop/test-module.js')
```

Relative paths are way more clean and readable but we also have the absolute path option if it's necessary.

The cleaner way to use absolute paths is:
```javascript
// `require`-ing a module using the absolute path and the `path` native module.
let path       = require('path')
let testModule = require(path.join(__dirname, 'test-module.js'))
```

*Can we require local files without using relative paths?* - the answer is **YES.**


## 4. What is the Event Loop? Is it part of V8?

To avoid copy-pasting, I'll forward you to the official documentation:

[https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/#what-is-the-event-loop](https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/#what-is-the-event-loop)

Even though Node.js is built on top of Google's V8 JavaScript engine, the event
loop itself is **NOT** a part of the V8 engine. The event loop is provided to
Node.js by its C dependency called `libuv`:

It could be probably made to work on SpiderMonkey or some other JS engine but currently, as far as I know, it only works on V8.

[https://github.com/nodejs/node/tree/master/deps/uv](https://github.com/nodejs/node/tree/master/deps/uv)
[https://nikhilm.github.io/uvbook/](https://nikhilm.github.io/uvbook/)

Instead of explaining the event loop myself in a blog post, I will point you to a couple of much better learning resources.


<iframe width="560" height="315" src="https://www.youtube.com/embed/ztspvPYybIY" frameborder="0" allowfullscreen></iframe>

<iframe width="560" height="315" src="https://www.youtube.com/embed/cCOL7MC4Pl0" frameborder="0" allowfullscreen></iframe>

<iframe width="560" height="315" src="https://www.youtube.com/embed/PNa9OMajw9w" frameborder="0" allowfullscreen></iframe>

<iframe width="560" height="315" src="https://www.youtube.com/embed/P9csgxBgaZ8" frameborder="0" allowfullscreen></iframe>

<iframe width="560" height="315" src="https://www.youtube.com/embed/zphcsoSJMvM" frameborder="0" allowfullscreen></iframe>

<iframe width="560" height="315" src="https://www.youtube.com/embed/sGTRmPiXD4Y" frameborder="0" allowfullscreen></iframe>


## 5. What is the Call Stack? Is it part of V8?

JavaScript's call stack is no different than any different than the call stack
in any other popular programming language. It's just a LIFO (Last In, First Out)
stack data structure onto which we push function calls, which get popped off the
stack after they return.

Having too many "frames" on the stack causes the infamous **Stack Overflow**:

```javascript
(function overflow() {
  overflow()
})()

// RangeError: Maximum call stack size exceeded
```

The important thing to know is that Node.js is "async-first", meaning that most
of the Node.js interfaces will be asynchronous in nature. We pass some sort of
callback functions into these async calls, and those functions are not pushed to
the stack immediately. After the callbacks are ready to be fired - the event
loop will push them (along with their data) onto the stack.

To answer the second question - is the Call Stack a part of the V8 engine? **YES**.

How do you know?

**Proof #1** - if you run:

```bash
node --v8-options
```

... you will see quite a bit of options available, including the stack-related
ones such as `--stack_size`, `--stack_trace_limit`, etc...

**Proof #2** - [https://github.com/v8/v8/wiki/Stack-Trace-API](https://github.com/v8/v8/wiki/Stack-Trace-API)

If you're good with C++ you can dive into the v8 source code and see the
implementation for yourself: [https://github.com/v8/v8](https://github.com/v8/v8)

Links:
* [https://developer.mozilla.org/en-US/docs/Glossary/Call_stack](https://developer.mozilla.org/en-US/docs/Glossary/Call_stack)

## 6. What is the difference between setImmediate and process.nextTick?

The answer is somewhat contrived so I recommend watching all of the videos
listed at the end of the [What is the Event Loop? Is it part of V8?](#4-what-is-the-event-loop-is-it-part-of-v8)
answer.

*The simplistic answer would be:*

`process.nextTick()` will fire "immediately", while `setImmediate()` will fire
after it (even though their names suggest otherwise).

I strongly recommend reading this official Node.js documentation piece:

[https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/#process-nexttick-vs-setimmediate](https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/#process-nexttick-vs-setimmediate)

## 7. How do you make an asynchronous function return a value?

Through Callback arguments or Promise return values. Those are the only 2
building blocks available in the language itself.

## 8. Can callbacks be used with promises or is it one way or the other?

Callbacks are lower level abstractions than Promises. You can certainly use them
together but I would advise against doing so if at all possible.

Node 8 introduced `util.promisify()` which can be handy for converting a
Callback based function into a Promise based one.

## 9. What are the major differences between spawn, exec, and fork?

Each one is suitable for a different set of tasks. **exec** and **fork** are
implemented on top of **spawn** and they exist to provide a more specialized
interface to the user.

**spawn** is the most general child-process creation mechanism in Node.js, with
pipes for **stdin**, **stdout**, and **stderr** automatically established
between the Node.js program and it's spawned child process. The spawned process
can be ran in a _subshell_ but by default - it's not. Good for creating
processes which produce streams of data.

**exec** is well suited for for spawning processes in a _subshell_ which run to
completion and return the result after the child process terminates. Good for
invoking shell commands. There is a slight performance penalty of having to
create a _subshell_. Also beware of the security risks of running arbitrary
shell commands using **exec**.

**fork** is used specifically to spawn new **Node.js processes**. The created
child process will have an additional IPC (Inter-process communication) channel
built-in that allows messages to be passed back and forth between the parent and
child. **fork** is great for offloading data handling, heavy computation,
"clustering", etc...

Here's how processes created by **spawn**, **exec** and **fork** look like in
the Linux process tree:

**Regular** Node.js process (no child processes):
```
|-node-+-4*[{V8 WorkerThread}]
|      `-{node}`
```

**spawn**
```
|-node-+-ping
|      |-4*[{V8 WorkerThread}]
|      `-{node}
```
The `ping` command is **spawn**ed.

**exec**
```
|-node-+-sh---sleep
|      |-4*[{V8 WorkerThread}]
|      `-{node}
```
Here we can clearly see the _subshell_ that's created on the fly by **exec**
(`sh`), and the command that is running inside it (`sleep`).

**fork**
```
|-node-+-nodejs-+-4*[{V8 WorkerThread}]
|      |        `-{nodejs}
|      |-4*[{V8 WorkerThread}]
|      `-{node}
```
Here we can clearly see how **fork** created a new Node.js child process.

**Useful links**

For more details I would recommend the official Node.js documentation:
- [https://nodejs.org/api/child_process.html](https://nodejs.org/api/child_process.html)

More on IPC:
- [https://en.wikipedia.org/wiki/Inter-process_communication](https://en.wikipedia.org/wiki/Inter-process_communication)

Great blog post on the subject:
- [https://medium.freecodecamp.org/node-js-child-processes-everything-you-need-to-know-e69498fe970a](https://medium.freecodecamp.org/node-js-child-processes-everything-you-need-to-know-e69498fe970a)

## 10. How does the cluster module work? How is it different than using a load balancer?

By default Node.js uses a single CPU core, which is not that fast or efficient.
The **cluster** module "spreads" a Node.js program across many CPU cores by
creating a child process for each core (if you choose so). This greatly improves
the capacity of the application running on a single machine.

Here's how a Node.js cluster on an 8-core CPU looks like in the Linux process
tree:
```
|-node-+-8*[nodejs-+-4*[{V8 WorkerThread}]]
|      |           `-{nodejs}]
|      |-4*[{V8 WorkerThread}]
|      `-{node}
```

A **load balancer** usually runs on a separate machine and (both _Layer 4_ and
_Layer 7_ load balancers) are slower because of the fact that they are
communicating with the applications via the network.

The main difference is that **cluster** utilizes and leverages multiple CPUs on
a single machine while **load balancers** leverage copies of the same
application running on multiple machines.

That being said, **clustering** is a vertical scaling and **load balancing** is
more of a horizontal scaling technique. Vertical scaling can only go as far as
hardware allows it while horizontal scaling can go much, much further. A
combination of both can be deployed as well.

In a cloud-native, Docker based infrastructure, **cluster**ing is unnecessary
since we are most likely running each application inside a container, running on
a single-core VM. In this case - horizontal scaling can be achieved using Docker
Swarm or Kubernetes clustering features.

Node.js Cluster documentation:
- [https://nodejs.org/api/cluster.html](https://nodejs.org/api/cluster.html)


## 11. What are the `--harmony-*` flags?

Node.js runs on modern versions of V8 by default, and new ECMAScript features
are being brought in V8 all the time.

`--harmony` is a Node.js runtime flag which enables **staged** ECMAScript
features to be used in the Node.js application.

There are a whole lot of `--harmony_*` flags as well, which enable single **in
progress** ECMAScript features to be used in Node.js. You can get a list of
those by running `node --v8-options | grep "in progress"`

Here are the available `--harmony_*` flags at the moment of writing this blog
post:

```bash
$ node --v8-options | grep "in progress"
--harmony_array_prototype_values (enable "harmony Array.prototype.values" (in progress))
--harmony_function_sent (enable "harmony function.sent" (in progress))
--harmony_sharedarraybuffer (enable "harmony sharedarraybuffer" (in progress))
--harmony_simd (enable "harmony simd" (in progress))
--harmony_do_expressions (enable "harmony do-expressions" (in progress))
--harmony_restrictive_generators (enable "harmony restrictions on generator declarations" (in progress))
--harmony_regexp_named_captures (enable "harmony regexp named captures" (in progress))
--harmony_regexp_property (enable "harmony unicode regexp property classes" (in progress))
--harmony_for_in (enable "harmony for-in syntax" (in progress))
--harmony_trailing_commas (enable "harmony trailing commas in function parameter lists" (in progress))
--harmony_class_fields (enable "harmony public fields in class literals" (in progress))
```

I would avoid using `--harmony` flags in production. They should just be used to
play around with upcoming language features.

The best reference regarding `--harmony` flags:
- [https://nodejs.org/en/docs/es6/](https://nodejs.org/en/docs/es6/)

## 12. How can you read and inspect the memory usage of a Node.js process?
