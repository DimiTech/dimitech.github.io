---
layout: post
title:  "Re: How well do you know Node.js?"
description: "My answers to the 48 questions every Node.js developer needs to know answers to."
tags: [Node.js, JavaScript]

---
So, the other day I ran across a blog post by this guy Samer Buna called [How well do you know Node.js?](https://edgecoders.com/how-well-do-you-know-node-js-36b1473c01c8){:target="_blank"}
It's basically a content marketing piece with a purpose of selling his Node.js course (which is perfectly fine of course). 
It still offers value to the reader in form of 48 questions that put your Node knowledge to the test.

I've made a commitment to answer 2 of these questions every day so that people who read this can review or upgrade their Node chops.

Let's get on with it:


## 1. **What is the relationship between Node.js and V8? Can Node work without V8?**

Node.js is built on top of Google's V8 JavaScript engine.

It could be probably made to work on SpiderMonkey or some other JS engine but currently, as far as I know, it only works on V8.

*Helpful resources:*

- Ryan Dahl's original Node.js presentation:

<iframe width="560" height="315" src="https://www.youtube.com/embed/ztspvPYybIY" frameborder="0" allowfullscreen></iframe>


## 2. **How come when you declare a global variable in any Node.js file it’s not really global to all modules?**

### Browser JavaScript:

When you declare a JavaScript variable in a browser environment (outside of any functions), that variable implicitly becomes **global**.

What that means is that the variable becomes available anywhere in your JavaScript code.

When you declare a global variable in the browser, that variable becomes the property of the `window` global object.

This example illustrates that behavior:

{% highlight javascript %}
/* Run this code in your browser console. */
var globalVar = 'global variable';

console.log(globalVar);        // Output: 'global variable'.
console.log(window.globalVar); // Output: 'global variable'.
{% endhighlight %}

### Node.js JavaScript:

In the Node.js environment, we don't have a `window` global variable (since there is no window, duh) but we have `global`.

You can think of the `global` object in the same way you think about `window`. Its properties are global, publicly available *values*.

{% highlight javascript %}
/* Run this code in your Node.js REPL terminal. */
var globalVar = 'global variable';

console.log(globalVar);        // Output: 'global variable'.
console.log(global.globalVar); // Output: 'global variable'.
{% endhighlight %}

Where it gets tricky is when you declare a global variable inside a *.js* file.

Node.js uses the CommonJS module system.

**Every JavaScript file in the Node.js world is considered a module and therefore all of the variables that are global to a single file are not visible in other files (modules).**

To test this behavior, create a new project folder and inside that folder create 2 files - `file1.js` and `file2.js` (creative, I know).

Put the follwing code inside those files:

{% highlight javascript %}
/**
 * file1.js
 */
 
var globalVar = 'global variable';

console.log(globalVar);                      // Output: 'global variable'.
console.log(global.globalVar === undefined); // Output: true.

require('./file2');
{% endhighlight %}

{% highlight javascript %}
/**
 * file2.js
 */
 
try {
    console.log(globalVar); // Throws an exception since `globalVar` is not defined.
} catch(err) {
    console.dir(err.name === 'ReferenceError'); // Output: true.
}

console.log(global.globalVar === undefined); // Output: true.
{% endhighlight %}

`cd` into your project folder and run the first file: `node file1`.

What we see happen here is that the global variable `globalVar` does not get attached to the `global` object in the first place and therefore is not global and other modules can't see it.

This is a good thing, since global namespace pollution tends to be a big problem in programming (that's why people hate on PHP).

If you explicitly need to declare a global variable, attach the value to the `global` object and it will be accessible from anywhere.

*Helpful resources:*

- Eloquent JavaScript - Modules chapter explains how the CommonJS require function works on a basic level:

[http://eloquentjavascript.net/10_modules.html](http://eloquentjavascript.net/10_modules.html){:target="_blank"}



## 3. **When exporting the API of a Node module, why can we sometimes use `exports` and other times we have to use `module.exports`?**

First let's understand what `module`, `exports` and `module.exports` are. They are all properties of the Node's `global` object.

The Node.js runtime environment has some global variables that are always available just as the browser does (browser has `window` and its properties like `location`, `document`, `console`...). 

Open up your Node REPL and try accessing the following variables:

{% highlight javascript %}
/* Type this code in your Node.js REPL terminal line by line 
   and observe the output. */
global; // Enter.

process;                    // Enter.
global.process === process; // Output: true.

module;                   // Enter.
global.module === module; // Output: true.

module.exports;                           // Enter.
global.module.exports === module.exports; // Output: true.
{% endhighlight %}

The `global` object is the Node's global variable and all of the variables below it are its properties.

But what happens inside files? Let's figure it out, create and run the following file:

{% highlight javascript %}
/** 
 *  module_test.js - Node module API test.
 */
console.dir(this);    // Output: {}
console.dir(exports); // Output: {}
console.dir(module.exports === exports); // Output: true
console.dir(module.exports === this);    // Output: true
{% endhighlight %}

Interesting. We come to a conclusion that, inside of a file, `this`, `exports` and `module.exports` are pointing to the same memory address. They are the same object!

Now, to answer the question, when do we use `exports` and when `module.exports`?

**The `exports` object**, that resides inside of every Node module (file), **is the module's API** (public interface).

Every property that we attach on to it becomes publicly accessible to other modules.

We want to use the `exports` variable as a shorthand for `module.exports`.

Let's consider a situation where we want our public API to contain 3 methods.
We could achieve that in multiple ways (there's probably even more than this):

{% highlight javascript %}
/** 
 *  module_test2.js - Node module API test 2.
 */ 
module.exports.methodOne   = () => { console.log('whatever 1'); }
module.exports.methodTwo   = () => { console.log('whatever 2'); }
module.exports.methodThree = () => { console.log('whatever 3'); }

// or:

exports.methodTwo   = () => { console.log('whatever 2'); }
exports.methodOne   = () => { console.log('whatever 1'); }
exports.methodThree = () => { console.log('whatever 3'); }

// or:

this.methodTwo   = () => { console.log('whatever 2'); }
this.methodOne   = () => { console.log('whatever 1'); }
this.methodThree = () => { console.log('whatever 3'); }

// or:

module.exports = {
    methodOne()   { console.log('whatever 1'); },
    methodTwo()   { console.log('whatever 2'); },
    methodThree() { console.log('whatever 3'); }
};

// These two API definitions fail to get exported.

// Fails.
exports = {
    methodOne()   { console.log('whatever 1'); },
    methodTwo()   { console.log('whatever 2'); },
    methodThree() { console.log('whatever 3'); }
};

// Fails.
this = {
    methodOne()   { console.log('whatever 1'); },
    methodTwo()   { console.log('whatever 2'); },
    methodThree() { console.log('whatever 3'); }
};

// etc. etc... 
{% endhighlight %}

So `exports` is used when we want our API to expose multiple values (functions, objects, strings... whatever). We declare those values as separate properties of the `exports` object.

`module.exports` is used when we want to export only a single value (which can be an object containing other values, a function, a number ... any JavaScript value).

You might be wondering why are the last two APIs failing to get exposed? The answer lies in the way that the CommonJS module system works.

Imagine your every Node file (module) being a function and having these invisible lines of code at the beginning and the end of them:

{% highlight javascript %}
function testModule() {
    var exports = module.exports = {};
    // ...
    // Your module code...
    // ...
    return module.exports;
}
{% endhighlight %}

It's only natural that then, if you make `exports` point to another value, it gets compeletely ignored and module.exports gets returned.

`exports` is just a helpful pointer to `module.exports`.

If you want to learn more about this behavior, dig deeper into CommonJS modules. 


## 4. **Can we require local files without using relative paths?**

There are two ways (that I'm familiar with) to `require` local files:

{% highlight javascript %}
// `require`-ing a module using the relative path.
let testModule = require('./test-module.js');

// `require`-ing a module using the absolute path.
let testModuleAgain = require('/home/dusan/Desktop/test-module.js');
{% endhighlight %}

Relative paths are way more clean and readable but we also have the absolute path option if it's necessary.

The cleaner way to use absolute paths is:
{% highlight javascript %}
// `require`-ing a module using the absolute path and the `path` native module.
let path       = require('path');
let testModule = require(path.join(__dirname, 'test-module.js'));
{% endhighlight %}

*Can we require local files without using relative paths?* - the answer is **YES.**


## 5. **Can different versions of the same package be used in the same application?**

I never ran into a problem that needed a such solution, but let's explore if this is possible.

Let's say that we want to install the `pbkdf2` module using `npm`.

{% highlight bash %}
npm install pbkdf2 --save

`-- pbkdf2@3.0.9
  `-- create-hmac@1.1.4
    +-- create-hash@1.1.2
    | +-- cipher-base@1.0.3
    | +-- ripemd160@1.0.1
    | `-- sha.js@2.4.8
    `-- inherits@2.0.3
{% endhighlight %}

As we can see, the `pbkdf2` module has only a single dependency, which, in turn has dependencies of it's own.

Let's look at how `npm` stores those modules in the `node_modules` folder (`npm v.4.0.5`):

{% highlight bash %}
ls node_modules -al
total 36
drwxr-xr-x 1 Dusan 197121 0 Jan 17 20:20 ./
drwxr-xr-x 1 Dusan 197121 0 Jan 17 20:20 ../
drwxr-xr-x 1 Dusan 197121 0 Jan 17 20:20 .bin/
drwxr-xr-x 1 Dusan 197121 0 Jan 17 20:20 cipher-base/
drwxr-xr-x 1 Dusan 197121 0 Jan 17 20:20 create-hash/
drwxr-xr-x 1 Dusan 197121 0 Jan 17 20:20 create-hmac/
drwxr-xr-x 1 Dusan 197121 0 Jan 17 20:20 inherits/
drwxr-xr-x 1 Dusan 197121 0 Jan 17 20:20 pbkdf2/
drwxr-xr-x 1 Dusan 197121 0 Jan 17 20:20 ripemd160/
drwxr-xr-x 1 Dusan 197121 0 Jan 17 20:20 sha.js/
{% endhighlight %}

Since `npm 3`, the way modules are installed is changed from nested to a flattened approach.

Let's say I want to install an older version of the `pbkdf2` module.

{% highlight bash %}
npm view pbkdf2 versions

[ '0.0.1',
  '0.0.2',
  '0.0.3',
  '0.0.4',
  '0.0.5',
  '3.0.3',
  '3.0.4',
  '3.0.5',
  '3.0.6',
  '3.0.7',
  '3.0.8',
  '3.0.9' ]

npm install pbkdf2@3.0.3 --save-exact
{% endhighlight %}

This just overwrites the existing `node_modules` contents with the new ones. 
But we want both versions at the same time.

The only way I can think of achieving this is by installing a particular version of the module with `npm --legacy-bundling` flag, which turns off deduping/flat dependencies and uses the nested dependencies approach when installing modules.

When the particular version of the module is installed rename that module to `module-name-old` or something and then install another version using the same method and rename its folder to something else.

That way you can `require` and use those modules separately in your code.

This is a rare, edge-case and if you really need this you could create a `bash` script that does all that thumbling around for you.


## 5. **What is the Event Loop? Is it part of V8?**

The event loop is **NOT** a part of the V8 engine. The event loop is provided to Node.js by it's C dependency called `libuv`:


[https://github.com/nodejs/node/tree/master/deps/uv](https://github.com/nodejs/node/tree/master/deps/uv){:target="_blank"}

Instead of explaining the event loop myself in a blog post, I will point you to a couple of much better learning resources.

<iframe width="560" height="315" src="https://www.youtube.com/embed/8aGhZQkoFbQ" frameborder="0" allowfullscreen></iframe>

<iframe width="560" height="315" src="https://www.youtube.com/embed/PNa9OMajw9w" frameborder="0" allowfullscreen></iframe>

<iframe width="560" height="315" src="https://www.youtube.com/embed/P9csgxBgaZ8" frameborder="0" allowfullscreen></iframe>


### **2 questions and their answers are added every day...**

