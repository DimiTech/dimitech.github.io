---
layout: post
title:  "Re: How well do you know Node.js?"
description: "Answers to 40 questions that every Node.js developer needs to know."
tags: [Node.js, JavaScript]

---
So, the other day I ran across a blog post called [How well do you know Node.js?](https://edgecoders.com/how-well-do-you-know-node-js-36b1473c01c8){:target="_blank"}
I wrote my answers to these questions in this post. You might find them useful
in reviewing or upgrading your Node.js chops.

**Tip:** In order to get most out of these answers - try out all of the examples and see
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
13. [Can reverse-search in commands history be used inside Node’s REPL?](#13-can-reverse-search-in-commands-history-be-used-inside-nodes-repl)
14. [What are V8 object and function templates?](#14-what-are-v8-object-and-function-templates)
15. [What is libuv and how does Node.js use it?](#15-what-is-libuv-and-how-does-nodejs-use-it)
16. [How can you make Node’s REPL always use JavaScript strict mode?](#16-how-can-you-make-nodes-repl-always-use-javascript-strict-mode)
17. [How can we do one final operation before a Node process exits? Can that operation be done asynchronously?](#17-how-can-we-do-one-final-operation-before-a-node-process-exits-can-that-operation-be-done-asynchronously)
18. [Besides V8 and libuv, what other external dependencies does Node have?](#18-besides-v8-and-libuv-what-other-external-dependencies-does-node-have)
19. [What’s the problem with the process uncaughtException event? How is it different than the exit event?](#19-whats-the-problem-with-the-process-uncaughtexception-event-how-is-it-different-than-the-exit-event)
20. [Do Node buffers use V8 memory? Can they be resized?](#20-do-node-buffers-use-v8-memory-can-they-be-resized)
21. [What’s the difference between Buffer.alloc and Buffer.allocUnsafe?](#21-whats-the-difference-between-bufferalloc-and-bufferallocunsafe)
22. [How is the slice method on buffers different from that on arrays?](#22-how-is-the-slice-method-on-buffers-different-from-that-on-arrays)
23. [What is the string_decoder module useful for? How is it different than casting buffers to strings?](#23-what-is-the-string_decoder-module-useful-for-how-is-it-different-than-casting-buffers-to-strings)
24. [What are the 5 major steps that the require function does?](#24-what-are-the-5-major-steps-that-the-require-function-does)
25. [What is the require.resolve function and what is it useful for?](#25-what-is-the-requireresolve-function-and-what-is-it-useful-for)
26. [What is the main property in package.json useful for?](#26-what-is-the-main-property-in-packagejson-useful-for)
27. [What are circular modular dependencies in Node and how can they be avoided?](#27-what-are-circular-modular-dependencies-in-node-and-how-can-they-be-avoided)
28. [What are the 3 file extensions that will be automatically tried by the require function?](#28-what-are-the-3-file-extensions-that-will-be-automatically-tried-by-the-require-function)
29. [When creating an http server and writing a response for a request, why is the end() function required?](#29-when-creating-an-http-server-and-writing-a-response-for-a-request-why-is-the-end-function-required)
30. [When is it ok to use the file system *Sync methods?](#30-when-is-it-ok-to-use-the-file-system-sync-methods)
31. [How can you print only one level of a deeply nested object?](#31-how-can-you-print-only-one-level-of-a-deeply-nested-object)
32. [What is the node-gyp package used for?](#32-what-is-the-node-gyp-package-used-for)
33. [The objects exports, require, and module are all globally available in every module but they are different in every module. How?](#33-the-objects-exports-require-and-module-are-all-globally-available-in-every-module-but-they-are-different-in-every-module-how)
34. [How can a module be both requirable by other modules and executable directly using the node command?](#34-how-can-a-module-be-both-requirable-by-other-modules-and-executable-directly-using-the-node-command)
35. [What’s an example of a built-in stream in Node that is both readable and writable?](#35-whats-an-example-of-a-built-in-stream-in-node-that-is-both-readable-and-writable)
36. [What’s the difference between using event emitters and using simple callback functions to allow for asynchronous handling of code?](#36-whats-the-difference-between-using-event-emitters-and-using-simple-callback-functions-to-allow-for-asynchronous-handling-of-code)
37. [The require function always caches the module it requires. What can you do if you need to execute the code in a required module many times?](#37-the-require-function-always-caches-the-module-it-requires-what-can-you-do-if-you-need-to-execute-the-code-in-a-required-module-many-times)
38. [What’s the difference between the Paused and the Flowing modes of readable streams?](whats-the-difference-between-the-paused-and-the-flowing-modes-of-readable-streams)
39. [What does the --inspect argument do for the node command?](#39-what-does-the-inspect-argument-do-for-the-node-command)
40. [When working with streams, when do you use the pipe function and when do you use events? Can those two methods be combined?](#40-when-working-with-streams-when-do-you-use-the-pipe-function-and-when-do-you-use-events-can-those-two-methods-be-combined)

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

- Eloquent JavaScript - Modules chapter explains how the CommonJS require function works on a basic level: [http://eloquentjavascript.net/10_modules.html](http://eloquentjavascript.net/10_modules.html)
- Node.js Module documentation explains how Node.js modules work in more detail [https://nodejs.org/api/modules.html](https://nodejs.org/api/modules.html)


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

You can see which version of V8 your Node.js installation uses by running:
```bash
$ node -p 'process.versions.v8'
7.4.288.21-node.16
```

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

### 12.1 Using Linux `top`

Since I love simplicity - let's start with what we already have in UNIX, the
`top` command.

Let's first create a test Node.js program that will run for a long time:

```bash
$ cat << _EOF_ >> ./test.js
let i = 0
setInterval(() => {
  ++i
  console.log('i:', i)
}, 1000)
_EOF_
$ node test.js
```

If you are on Linux, you could perform simple monitoring manually using `top`:

```bash
# Find your Node.js PID
$ ps aux | grep 'node test.js' | grep -v grep | tr -s ' ' | cut -d ' ' -f 2
9268

# Then feed it to `top`
$ top -p 9268

# Both commands can be ran in a single line like this:
top -p $(ps aux | grep 'node test.js' | grep -v grep | tr -s ' ' | cut -d ' ' -f 2)
```

The relevant `top` output might look something like this:

```
 PID USER      PR  NI    VIRT    RES    SHR S  %CPU %MEM     TIME+ COMMAND
9268 dusan     20   0  562964  27844  23320 S   0.3  0.3   0:00.09 node
```

We're interested in the `RES` value, which is the physical memory that the
task is using (in KiB). In this case it's `26,844 KiB` (`27488.256 KB`), so our
Node.js process is using roughly 27 MB of physical memory at that certain point
in time.

[> Difference between KiB and KB](https://superuser.com/questions/287498/what-is-the-difference-between-a-kibibyte-a-kilobit-and-a-kilobyte)

### 12.2 Using `process.memoryUsage()`

Node's global `process` object has a `.memoryUsage()` function you can use to
get more segmented view into your program's memory usage:

```javascript
process.memoryUsage()

/* Example output:
{
  rss: 29405184,
  heapTotal: 5799936,
  heapUsed: 2982200,
  external: 774256
}
*/
```

* `rss` - Resident Set Size, basically how much memory your program is using in
  total.
* `heapTotal` - heap space available.
* `heapUsed` - heap space that's currently occupied.
* `external` - memory usage of C++ objects bound to JavaScript (managed by V8).

You can find more info about this function in the
[process API Docs](https://nodejs.org/api/process.html#process_process_memoryusage).

### 12.3 Using Chrome DevTools for Node.js

DevTools are helpful when you need to dig deeper, i.e. when you've realized
that a memory leak exists but not sure what's causing it.

Before running DevTools first run node with the `--inspect` flag:

```bash
$ node --inspect test.js
```

Now that you have a debugging handle on our Node.js process open up `Chrome` and
enter `chrome://inspect` in the URL bar. There you will see your target process
and when you press `inspect` the DevTools will pop up:

![Chrome DevTools Screenshot](/images/2017-01-14-how-well-do-you-know-node.js/12.3_screenshot_chrome_devtools.jpg "Chrome DevTools Screenshot")

To inspect the `heap` portion of your memory (which is the important one if you
are looking for memory leaks) go to the `Memory` tab and create a `Heap Snapshot`.
The result is going to look something like this:

![Heap Snapshot](/images/2017-01-14-how-well-do-you-know-node.js/12.3_screenshot_heap_snapshot.jpg "Heap Snapshot")

The heap snapshot is large and complex but if you know your program really well
you should be able to realize what's happening. You can also sample memory
usage over time (Record Allocation Timeline) in order to get more insight.

DevTools have quite a bit of useful functionalities so I encourage you to
explore them if you need to. There is also a Chrome Extension called
[NIM (Node Inspector Manager)](https://chrome.google.com/webstore/detail/nodejs-v8-inspector-manag/gnhhdgbaldcilmgcpfddgdbkhjohddkj)
that might improve your workflow. Also keep in mind that you're better off
running Chrome (and its DevTools) on Windows or MacOX since there it offers the
full set of features unlike on Linux.

Those were a couple of ways that you can inspect your program's memory usage
but there are many more, and more are being developed. Feel free to explore and
find what you need/like.

### Useful links:
* [https://www.valentinog.com/blog/memory-usage-node-js/](https://www.valentinog.com/blog/memory-usage-node-js/)
* [https://www.youtube.com/watch?v=hliOMEQRqf8](https://www.youtube.com/watch?v=hliOMEQRqf8)
* [https://nodejs.org/en/docs/guides/debugging-getting-started/#chrome-devtools-55](https://nodejs.org/en/docs/guides/debugging-getting-started/#chrome-devtools-55)

## 13. Can reverse-search in commands history be used inside Node’s REPL?

Out of the box - **no**.

## 14. What are V8 object and function templates?

Simply put - v8::ObjectTemplate and v8::FunctionTemplate are used to make C++
Objects/Functions available in JavaScript code.

> For example, Google Chrome uses templates to wrap C++ DOM nodes as JavaScript
  objects and to install functions in the global namespace.

I recommend reading the v8 dev doc section on templates, as well as that entire
_Getting started_ guide: [https://v8.dev/docs/embed#templates](https://v8.dev/docs/embed#templates)

## 15. What is libuv and how does Node.js use it?

`libuv` is a C library that provides Node.js with its async I/O capabilities -
everything from networking to filesystem access.
It is of crucial significance to Node.

`libuv` contributors have even made some YouTube videos:

<iframe width="560" height="315" src="https://www.youtube.com/embed/sGTRmPiXD4Y" frameborder="0" allowfullscreen></iframe>

Also, Ryan Dahl has done a tutorial on it a couple of years ago, I highly
recommend watching it:

<iframe src="https://player.vimeo.com/video/24713213" width="640" height="400"
frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>
<p><a href="https://vimeo.com/24713213">using libuv and http-parser to build a
webserver</a> from <a href="https://vimeo.com/user278471">ry</a> on <a
href="https://vimeo.com">Vimeo</a>.</p>

## 16. How can you make Node’s REPL always use JavaScript strict mode?

Just run the REPL with the `--use_strict` flag:

```
$ node --use_strict
> foo = 3
Thrown:
ReferenceError: foo is not defined
```

## 17. How can we do one final operation before a Node process exits? Can that operation be done asynchronously?

A Node.js process exits if:
1. The event loop is emptied out and has no more work to do.
2. `process.exit()` was called.

In either case the global `process` object will receive an `'exit'` event where
you can do some synchronous work. Here is a simple example:

```javascript
process.stdout.write('Hello')
process.on('exit', () => {
  process.stdout.write('Goodbye!\n')
})
process.stdout.write(' there!\n')

/* Output:
Hello there!
Goodbye!
*/
```

The code in the 'exit' event callback can **only be synchronous**, otherwise it
will not work correctly:

```javascript
process.stdout.write('Hello')
process.on('exit', () => {
  setTimeout(() => {
    process.stdout.write('Goodbye!\n')
  }, 0)
})
process.stdout.write(' there!\n')

/* Output:
Hello there!
*/
```

In order to perform async work you should use the [beforeExit](https://nodejs.org/api/process.html#process_event_beforeexit)
event:

```javascript
process.stdout.write('Hello')
process.on('beforeExit', () => {
  setTimeout(() => {
    process.stdout.write('Goodbye!\n')
    process.exit(0)
  }, 0)
})
process.stdout.write(' there!\n')

/* Output:
Hello there!
Goodbye!
*/
```

## 18. Besides V8 and libuv, what other external dependencies does Node have?

Since Node.js is open-source we can view its [GitHub repository](https://github.com/nodejs/node)
and see the dependencies there.

At the time of this writing - the `deps/` directory contains most of the static
libraries which Node depends on:

```bash
$ git clone https://github.com/nodejs/node.git
$ cd node/
$ ls -alhF deps/
total 68K
drwxrwxr-x 17 xxx xxx 4.0K Jun 10 12:21 ./
drwxrwxr-x 11 xxx xxx 4.0K Jun 10 12:21 ../
drwxrwxr-x  4 xxx xxx 4.0K Jun 10 12:21 acorn/
drwxrwxr-x  8 xxx xxx 4.0K Jun 10 12:21 acorn-plugins/
drwxrwxr-x  3 xxx xxx 4.0K Jun 10 12:21 brotli/
drwxrwxr-x  5 xxx xxx 4.0K Jun 10 12:21 cares/
drwxrwxr-x  3 xxx xxx 4.0K Jun 10 12:21 histogram/
drwxrwxr-x  3 xxx xxx 4.0K Jun 10 12:21 http_parser/
drwxrwxr-x  3 xxx xxx 4.0K Jun 10 12:21 icu-small/
drwxrwxr-x  4 xxx xxx 4.0K Jun 10 12:21 llhttp/
drwxrwxr-x  3 xxx xxx 4.0K Jun 10 12:21 nghttp2/
drwxrwxr-x  6 xxx xxx 4.0K Jun 10 12:21 node-inspect/
drwxrwxr-x 11 xxx xxx 4.0K Jun 10 12:21 npm/
drwxrwxr-x  4 xxx xxx 4.0K Jun 10 12:21 openssl/
drwxrwxr-x 10 xxx xxx 4.0K Jun 10 12:21 uv/
drwxrwxr-x 16 xxx xxx 4.0K Jun 10 12:21 v8/
drwxrwxr-x 14 xxx xxx 4.0K Jun 10 12:21 zlib/
```

We can get even more information if we peek into the LICENSE file, where Node's
dependency licences are listed:

```
The externally maintained libraries used by Node.js are:

- Acorn, located at deps/acorn, is licensed as follows: ...
- Acorn plugins, located at deps/acorn-plugins, is licensed as follows: ...
- c-ares, located at deps/cares, is licensed as follows: ...
- HTTP Parser, located at deps/http_parser, is licensed as follows: ...
- ICU, located at deps/icu-small, is licensed as follows: ...
- libuv, located at deps/uv, is licensed as follows: ...
- llhttp, located at deps/llhttp, is licensed as follows: ...
- OpenSSL, located at deps/openssl, is licensed as follows: ...
- Punycode.js, located at lib/punycode.js, is licensed as follows: ...
- V8, located at deps/v8, is licensed as follows: ...
- SipHash, located at deps/v8/src/third_party/siphash, is licensed as follows: ...
- zlib, located at deps/zlib, is licensed as follows: ...
- npm, located at deps/npm, is licensed as follows: ...
- GYP, located at tools/gyp, is licensed as follows: ...
- jinja2, located at tools/inspector_protocol/jinja2, is licensed as follows: ...
- markupsafe, located at tools/inspector_protocol/markupsafe, is licensed as follows: ...
- cpplint.py, located at tools/cpplint.py, is licensed as follows: ...
- ESLint, located at tools/node_modules/eslint, is licensed as follows: ...
- babel-eslint, located at tools/node_modules/babel-eslint, is licensed as follows: ...
- gtest, located at test/cctest/gtest, is licensed as follows: ...
- nghttp2, located at deps/nghttp2, is licensed as follows: ...
- node-inspect, located at deps/node-inspect, is licensed as follows: ...
- large_pages, located at src/large_pages, is licensed as follows: ...
- caja, located at lib/internal/freeze_intrinsics.js, is licensed as follows: ...
- brotli, located at deps/brotli, is licensed as follows: ...
- HdrHistogram, located at deps/histogram, is licensed as follows: ...
- node-heapdump, located at src/heap_utils.cc, is licensed as follows: ...
```

You can also dig deepeer if you're interested but these were the most important
ones.

## 19. What’s the problem with the process uncaughtException event? How is it different than the exit event?

The [uncaughtException](https://nodejs.org/api/process.html#process_event_uncaughtexception)
event callback can be used as a global error handler.
It might seem useful since it prevents the process from crashing when unhandled
errors occur.
I prefer to **crash hard** and fix the problems at the cause.

Therefore, I recommend using 'uncaughtException' sparringly, if at all.
You should handle your errors locally - at the place where you expect them to be
thrown.

2 major problems with using 'uncaughtException':
* It can easily leave the process in an invalid state by not crashing on serious errors
* Exceptions thrown from within the 'uncaughtException' event handler will not be caught

The [documentation](https://nodejs.org/api/process.html#process_warning_using_uncaughtexception_correctly)
offers great advice:
> The correct use of 'uncaughtException' is to perform synchronous cleanup of
allocated resources (e.g. file descriptors, handles, etc) before shutting down
the process. It is not safe to resume normal operation after
'uncaughtException'.

When the 'exit' event is emitted the application is toast, you can't save it
from exiting or restart it. You can do async work, restart or keep the app
running in the 'uncaughtException' handler, and that's the difference. Also the
'exit' event is fired after 'uncaughtException'.

If you're tempted to restart the application after a 'uncaughtException', do not.
Use `supervisor`, `pm2`, `nodemon` or whatever other tool instead:
> To restart a crashed application in a more reliable way, whether
'uncaughtException' is emitted or not, an external monitor should be employed
in a separate process to detect application failures and recover or restart as
needed.

## 20. Do Node buffers use V8 memory? Can they be resized?

The [documentation](https://nodejs.org/api/buffer.html#buffer_buffer) states
that Buffers **do not use V8 memory**:

> Instances of the Buffer class ... correspond to fixed-sized, raw memory
allocations outside the V8 heap.

It also says that the **Buffer size cannot be changed**:

> The size of the Buffer is established when it is created and cannot be changed.

## 21. What’s the difference between Buffer.alloc and Buffer.allocUnsafe?

`Buffer.alloc()` allocates a memory block and fills that memory with 0x00 or
user-defined data.

`Buffer.allocUnsafe()` also allocates a memory block but **does not fill it
with data**. The contents of the Buffer that was created this way are unknown
and might contain old data.
`Buffer.allocUnsafe()` is faster than `Buffer.alloc()` and the cost is that the
newly created Buffer might contain undefined, and possibly sensitive Buffer
content.

The [documentation](https://nodejs.org/api/buffer.html#buffer_buffer_from_buffer_alloc_and_buffer_allocunsafe)
covers this pretty well.

## 22. How is the slice method on buffers different from that on arrays?

`String.slice()` returns the slice as a new string instance, leaving the
original intact:

```javascript
var original = '123456789'
var slice = original.slice(0, 3)

console.log(slice)
console.log(original)

/* Output:
123
123456789
*/
```

`buf.slice()` returns a new buffer that points to the same memory as the
original buffer:

```javascript
var original = Buffer.from('123456789')
var slice = original.slice(0, 3)

console.log('slice:', slice)
console.log('original:', original)

/* Output:
slice:    <Buffer 31 32 33>
original: <Buffer 31 32 33 34 35 36 37 38 39>
*/

// If we change the slice, the original is changed as well.
slice[0] = 0x00
slice[1] = 0x00
slice[2] = 0x00

console.log('slice:', slice)
console.log('original:', original)

/* Output:
slice:    <Buffer 00 00 00>
original: <Buffer 00 00 00 34 35 36 37 38 39>
*/
```

Simply put - `String.slice()` is immutable, `buf.slice()` is mutable.

The [documentation](https://nodejs.org/api/buffer.html#buffer_buf_slice_start_end)
explains it really well too.

## 23. What is the string_decoder module useful for? How is it different than casting buffers to strings?

According to the [documentation](https://nodejs.org/api/string_decoder.html)
String Decoder should be useful for converting Buffers to Strings while
preserving encoded multi-byte UTF-8 and UTF-16 characters. 

But by testing it with a simple program it does not seem to differ from
`Buffer.toString()` at all, even with special UTF-8 characters:

```javascript
const { StringDecoder } = require('string_decoder')
const decoder = new StringDecoder('utf8')

const cent = Buffer.from([0xC2, 0xA2])
console.log(cent.toString())
console.log(cent.toString() === decoder.write(cent))

const euro = Buffer.from([0xE2, 0x82, 0xAC])
console.log(euro.toString())
console.log(euro.toString() === decoder.write(euro))

/* Output:
¢
true
€
true
*/
```

`string_decoder` becomes useful when the program is receiving a stream of bytes.
The euro symbol consists of 3 bytes: `0xE2, 0x82, 0xAC`. When we individually
write those to the `sting_decoder` it will wait until the actual 'utf-8'
character is formed. Let's simulate receiving 3 bytes as buffer chunks and then
write them individually to the `string_decoder`:

```javascript
const EventEmitter = require('events')
const { StringDecoder } = require('string_decoder')
const decoder = new StringDecoder('utf8')

class ByteEmitter extends EventEmitter {}

const byteEmitter = new ByteEmitter()

byteEmitter.on('data', chunk => {
  const buffer = Buffer.from([chunk])
  console.log(buffer.toString('utf-8'))
  console.log(decoder.write(buffer))
})

const euro = [0xE2, 0x82, 0xAC]
byteEmitter.emit('data', euro[0])
byteEmitter.emit('data', euro[1])
byteEmitter.emit('data', euro[2])

/* Output:
�

�

�
€
*/
```

We can see that the individual Buffers don't make sense as printable characters
when constructed from individual byte chunks. `string_decoder` expects a 'utf-8'
character and only forms a printable character when all the necessary bytes
arrive.

## 24. What are the 5 major steps that the require function does?

Node.js uses a module system called **CommonJS**.
In the world of CommonJS, every source code file is a module.
Node.js (CommonJS) modules are basically singletons with certain functions and
properties attached to each them (`require()`, `module`, `exports`...).

The `require()` function loads a module at the given file path. It returns that
module's `exports` property.

We can read the Node.js module system source code and figure out what it does.
It is located in `lib/module.js`.

As we can see by analyzing the source, `require()` wraps the `_load()` function
which performs the following steps:

1. Check the cache for the requested (required) file.
2. If a module already exists in the cache: return its exports object.
3. If the module is native: call `NativeModule.require()` with the filename and
   return the result.
4. Otherwise, create a new module for the file and save it to the cache.
5. Then have it load the file contents before returning its exports object.

### Useful links:
* [https://fredkschott.com/post/2014/06/require-and-the-module-system/](https://fredkschott.com/post/2014/06/require-and-the-module-system/)

## 25. What is the require.resolve function and what is it useful for?

As written in the [documentation](https://nodejs.org/api/modules.html#modules_require_resolve_request_options):

> `require.resolve(request[, options]) uses the internal require() machinery to
  look up the location of a module, but rather than loading the module, just
  return the resolved filename.

`require.resolve()` might be useful for debugging or if you want to get a path
string to a module without typing it out explicitly.

## 26. What is the main property in package.json useful for?

The `"main"` property of `package.json` points to the file that is the entry
point to the Node.js application (or package).
Unless you are publishing your package to NPM or another package registry the
"main" property is just informative but not functinally useful.

### Useful links:
* [https://docs.npmjs.com/files/package.json#main](https://docs.npmjs.com/files/package.json#main)

## 27. What are circular modular dependencies in Node and how can they be avoided?

The biggest indicator that you have a circular dependency in Node.js is if you
keep getting an empty object `{}` instead of your required module!

This happened to me once while creating a _Rock, Paper, Scissors_ game, where
the circular dependency was obvious: `Rock > Scissors > Paper > Rock...`.

It still took me a couple of minutes to figure out what was wrong since this is
a really rare situation to get yourself in while using Node. Node.js **permits**
circular depencencies and it's rare to get into problems but you should still
be very careful. Circular dependencies are also an indicator that you possibly
have a design problem, so take a closer look at your code.

If you really can't untangle circular dependencies in your code then you can
export your module first and then require the dependencies second (lexically).

Laurent Perrin explained it really well in his blog post:
[Circular dependencies in node.js](https://coderwall.com/p/myzvmg/circular-dependencies-in-node-js).

## 28. What are the 3 file extensions that will be automatically tried by the require function?

Looking at the `lib/module.js` source, it reveals the file extensions that the
`require()` function tries to resolve:

1. `.js`
2. `.json`
3. `.node`

## 29. When creating an http server and writing a response for a request, why is the end() function required?

Here is what the docs have to say about `res.end()` in the context of a HTTP
Server:

> This method signals to the server that all of the response headers and body
> have been sent; that server should consider this message complete. The
> method, response.end(), MUST be called on each response.

Simple enough, but let's dive deeper.

Node.js HTTP server implementation tries really hard to never buffer entire
requests or responses but instead it prefers to **stream** them to the client.
Streaming offers greater performance and reduces the server's memory footprint.

Because we are streaming the response back to the client, `res.end()` needs to
be called manually in order to close the connection socket and therefore end
the response stream.

## 30. When is it ok to use the file system *Sync methods?

Blocking (*Sync) operations are best to be avoided in Node.js but sometimes
they can be more convenient and even necessary. From my experience you can
freely use *Sync calls when:

1. The order of blocking operations is important.
2. The blocking operation is performed only once (or a couple of times max) in
the entire lifecycle of the application.

## 31. How can you print only one level of a deeply nested object?

Using `util.inspect()` you can specify the logging **depth**:

```javascript
const util = require('util')

const exampleObject = {
  first : 'John',
  last  : 'Doe',
  company : {
    address : 'Example St.',
    IBAN    : 'XXX-XXX',
  }
}

console.log(utsl.inspect(exampleObject, { depth: 1 }))
/* Output:
{
  first: 'John',
  last: 'Doe',
  company: { address: 'Example St.', IBAN: 'XXX-XXX' }
}
*/

console.log(util.inspect(exampleObject, { depth: 0 }))
/* Output:
{ first: 'John', last: 'Doe', company: [Object] }
*/
```

## 32. What is the node-gyp package used for?

Taken from the [node-gyp README](https://github.com/nodejs/node-gyp):

> `node-gyp` is a cross-platform command-line tool written in Node.js for
compiling [native addon modules](https://nodejs.org/api/addons.html) for
Node.js. It bundles the [gyp](https://gyp.gsrc.io) project used by the Chromium
team and takes away the pain of dealing with the various differences in build
platforms.

Node.js Native Addons are written in C/C++ and need to be compiled using
node-gyp in order to be used on your machine (platform).

## 33. The objects exports, require, and module are all globally available in every module but they are different in every module. How?

Every Node.js file is implicitly a CommonJS module. What happens under the hood
is that every file gets wrapped in a function (by the Node module system) and
`exports`, `require` and `module` are provided as the wrapping function's
arguments. That's why those variables appear to be global.

### Useful links:
* [Node.js Module Documentation](https://nodejs.org/api/modules.html#modules_the_module_wrapper)
* [CommonJS Module Source Code](https://github.com/nodejs/node/blob/master/lib/internal/modules/cjs/loader.js)
* [https://fredkschott.com/post/2014/06/require-and-the-module-system/](https://fredkschott.com/post/2014/06/require-and-the-module-system/)

## 34. How can a module be both requirable by other modules and executable directly using the node command?

The [module documentation](https://nodejs.org/api/modules.html#modules_the_module_wrapper)
explains how module code is wrapped before it's executed:

> Before a module's code is executed, Node.js will wrap it with a function
wrapper that looks like the following:

```javascript
(function(exports, require, module, __filename, __dirname) {
  // Module code actually lives in here
});
```

> By doing this, Node.js achieves a few things:

```
* It keeps top-level variables (defined with `var`, `const` or `let`) scoped to
the module rather than the global object.
* It helps to provide some global-looking variables that are actually specific
to the module, such as:
  * The `module` and `exports` objects that the implementor can use to export
    values from the module.
  * The convenience variables `__filename` and `__dirname`, containing the
    module's absolute filename and directory path.
```

Ran directly using `node` or by using `require()`, the module code is being
wrapped by the Node runtime in the same manner.

## 35. What’s an example of a built-in stream in Node that is both readable and writable?

A **Duplex stream** is a stream that implements both the Readable and Writable
streams. You can listen and emit events from duplex streams.

An example of a duplex stream is the ['net.Socket'](https://nodejs.org/api/net.html#net_net_createserver_options_connectionlistener).

## 36. What’s the difference between using event emitters and using simple callback functions to allow for asynchronous handling of code?

Emitting events is usually a more flexible way of dealing with asynchrony in
your program. Of course that comes with a cost of higher complexity.

Here are some technical Event-Emitter characteristics:
* Event-Emitters are a Pub-Sub mechanism, where we can have multiple listeners
  for a single event.
* Error and success events are separated.
* Like when using callbacks, using events doesn't mean that code execution is
  asynchronous.

The main difference between the two approaches is architectural.

Event emitters are a tool by which we can achieve a higher level of
architectural decoupling.

Here's a legendary video on Event-Driven Architecture:

<iframe width="560" height="315"
src="https://www.youtube.com/embed/STKCRSUsyP0" frameborder="0"
allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
allowfullscreen></iframe>>

## 37. The require function always caches the module it requires. What can you do if you need to execute the code in a required module many times?

Let's create 2 files:
```bash
$ touch main.js accumulator.js
```

The `accumulator` will hold a `sum`, increment and log it.
```javascript
// accumulator.js
let sum = 0
sum = sum + 1
module.exports = sum
```

In the `main` file let's require our `accumulator` module 3 times:
```javascript
// main.js
const sum1 = require('./accumulator')
const sum2 = require('./accumulator')
const sum3 = require('./accumulator')

console.log(sum1)
console.log(sum2)
console.log(sum3)
/* Output:
1
1
1
*/
```

By now, we know that CommonJS modules behave like singletons (because of the
module cache) and therefore the source code in `accumulator.js` will be executed
only once.

One way to execute the entire module code every time the module is required is
by using **wrapping the code that needs to be executed every time with a
function**.

Let's modify the files:
```diff
// accumulator.js
let sum = 0
-sum = sum + 1
-module.exports = sum
+module.exports = () => {
+  sum = sum + 1
+  return sum
+}
```

```diff
// main.js
-const sum1 = require('./accumulator')
-const sum2 = require('./accumulator')
-const sum3 = require('./accumulator')
+const sum1 = require('./accumulator')()
+const sum2 = require('./accumulator')()
+const sum3 = require('./accumulator')()

console.log(sum1)
console.log(sum2)
console.log(sum3)
/* Output:
1
2
3
*/
```

## 38. What’s the difference between the Paused and the Flowing modes of readable streams?

All readable streams are in `Paused` mode by default.
Attaching a `'data'` event listener switches the stream to `Flowing` mode.

`Flowing` mode can also be activated manually by executing `stream.resume()`
but if there are no `'data'` listeners attached at that moment, the **incoming
data will be lost**.

The author of these 40 Node.js questions has written a great article about
Node.js streams:

[Node.js Streams: Everything you need to know](https://www.freecodecamp.org/news/node-js-streams-everything-you-need-to-know-c9141306be93/)

> When a readable stream is in the paused mode, we can use the read() method to
> read from the stream on demand, however, for a readable stream in the flowing
> mode, the data is continuously flowing and we have to listen to events to
> consume it.

## 39. What does the --inspect argument do for the node command?

As we have seen [before](#123-using-chrome-devtools-for-nodejs), the `--inspect`
flag enables the Inspector Agent which makes the Node.js process listen for a
debugging client.

## 40. When working with streams, when do you use the pipe function and when do you use events? Can those two methods be combined?

We usually use `pipe` in order to "pipe" the data into writable streams. It's
a really clean and simple technique. We use `events` in order to react to every
stream event, when that is necessary.

`pipes` and `events` can be freely combined.

