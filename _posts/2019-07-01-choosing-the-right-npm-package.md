---
layout: post
title:  "Picking the Right NPM Package"
description: "How to pick the right NPM packages for your project"
tags: [JavaScript, Node.js, NPM, GitHub, Open-Source, Express, TypeScript]

---

**NPM** is the largest software registry in the world and right now (July 2019)
it hosts over **1.000.000** software packages! While that looks great on paper
the reality is that most of those packages are not high quality. Since there
are so many to choose from - **how do you pick the right one for your specific
use case**?

> First things first - I want to strongly emphasize that I do not mean to be
condescending or insensible to any NPM maintainer or contributor.
We all have busy lives, and things can happen that can prevent anyone from
maintaining their open-source projects.
**All I have to say is thank your for putting in your personal time, talent and
effort in order to help others build software more efficiently!**

That being said, here are the heuristics that I use when sifting through NPM
packages:

1. [Search the NPM registry and the Web](#1-search-the-npm-registry-and-the-web)
2. [Popularity](#2-popularity)
3. [Maintenance](#3-maintenance)
5. [Quality of documentation](#4-quality-of-documentation)
4. [Does the package fit your specific use case?](#5-does-the-package-fit-your-specific-use-case)
6. [Evaluate the design choices](#6-evaluate-the-design-choices)
7. [Quality of the example project](#7-quality-of-the-example-project)
8. [Security](#8-security)
9. [Contribute!](#9-contribute)

Btw, all of these points are **valid for dependency management in any other
software ecosystem** besides JavaScript and NPM.

# 1) Search the NPM registry and the Web

In addition to searching on **NPM**, make sure to search the **Web** in general,
using any of your favorite search engines (or many different ones if you're
struggling to find anything good).

When appropriate, try including names of packages that are your hard
dependencies in the search query, _e.g.,_ `react`, `express`, `hapi`...

# 2) Popularity

One of the first parameters by which I sort NPM packages is **popularity**,
which is reflected in the number of weekly downloads as well as GitHub stars.

Popularity gives a certain degree of validation to the package. A lot of people
using a package means that there is pressure to maintain it.

It's more likely that a popular package will have better documentation, useful
content in GitHub issues and more people willing to contribute.

Keep in mind that sometimes there are very high quality packages that are new
and not popular at the moment. **Popularity isn't everything**, but it's a good
place to start.

# 3) Maintenance

If you are building a serious project that will last for years, it's crucial
that your NPM dependencies are **well maintained**.

In terms of software packages, maintenance is the main thing that separates the
wheat from the chaff.

The first indicator of maintenance are the **releases**. If the last version of
the package was released more than 6 months ago that can be a sign that the
project is _abandoned_. That can also mean that the package is in perfect
shape and that there is no need to modify the code and make newer releases -
which can sometimes be the case for very small utility packages.

The next thing I check is the **build status**. Builds are usually available
on the project's GitHub page. A failing build would be a giant red flag.
Sometimes packages don't even have **CI** or **tests** at all which is even
more worrying.

Another big thing is the engagement around **GitHub issues** (or whatever issue
tracking system the project uses). How do the maintainers/contributors respond
to issues? Does anyone respond at all? Are the PRs merged or rejected quickly
or just left hanging around? Can the maintainers be contacted easily - do they
have their contact information readily available? In other words - **does the
project have good support?**

So, when it comes to maintenance, I prefer packages with: **frequent releases**,
**passing builds/tests** and **healthy issue and PR resolution**.

Additionally, you can use NPM to sort packages by **maintanence** and **quality** 
and those sort parameters are explained on the [NPMS website](https://npms.io/about)
as well as in [NPM docs](https://docs.npmjs.com/searching-for-and-choosing-packages-to-download#package-search-rank-criteria).

# 4) Quality of documentation

Although documentation is not extremely important, it can save you a LOT of
time if a package has:

* A good `README` file (both GitHub and NPM show it)
* GitHub Wiki docs
* Its own website with docs

For me, a project that has its own website with documentation shows a high
level of seriousness and dedication. Good, extensive documentation is **extremely
helpful when using packages with a large API surface area**.

# 5) Does the package fit your specific use case?

By now the list of packages should be significantly narrowed down and the next
thing to consider is - **does the package fit your specific use case?**.

Might seem obvious but many times packages have quirks and peculiarities that
prevent you from using them conveniently - or even using them at all. Check the
_usage_ or _getting started_ sections of the package documentation to see if
solves your problem and if it fits your project. If the package is smaller you
can also use [NPM RunKit](https://npm.runkit.com/) to try it out live.

Seamless integration with your project would be ideal, but don't be afraid to
write some glue code if the need arises.

# 6) Evaluate the design choices

## Monolithic vs Modular

Some software packages try to do many things at once and end up having huge
amounts of abstraction and loads of of internal terminology.
These **monolithic packages** can take a lot of effort to learn and use but
they can also be super convenient and time saving when they are exactly what
you need.

Others are very small, focused and simple to integrate but don't offer much
**magic**. They typically don't depend on many (or any) other packages themselves
which is great for maintenance and security.

I personally follow the [UNIX philosophy of simplicity and modularity](https://en.wikipedia.org/wiki/Unix_philosophy)
and prefer small packages of excellent quality. That is also the Node.js way
since Ryan Dahl is a UNIX guy himself and this can be seen throughout the Node.js
project's design choices.

Explore the tradeoffs when choosing between NPM packages and pick the one which
serves your project the best.

## Number of dependencies

NPM packages usually depend on a number of other NPM packages and that number
can sometimes get pretty outrageous. I prefer packages with the least amount of
dependencies since that usually brings greater flexibility, security, faster
build times, smaller bundle sizes, easier maintenance etc. etc...

**The less dependencies the package has - the better!**

## API Design

When reading through the documentation you can get a feeling for the design of 
the API that is offered. A lot can be concluded about the author's style and
skill level when looking at the API as well as the inner project structure.

In general, **the API should be intuitive and elegant**.

Other than that, go with what you like and prefer.

# 7) Quality of the example project

An example demo project can be extremely useful when trying out an NPM
package. This is especially true for larger packages.

Often times the examples are not up to date or they're missing some minor thing
which leaves them in a broken state. Demo projects can be tedious to maintain
so don't shy away from fixing them and submitting a PR.

# 8) Security

**Security is critical for serious projects**. If you're working on an important
project make sure to run regular security checks on your dependencies.

NPM is a inherently insecure platform but it started to offer some help since npm@6
with [`npm audit`](https://docs.npmjs.com/auditing-package-dependencies-for-security-vulnerabilities).

> The npm audit command submits a description of the dependencies configured in
your package to your default registry and asks for a report of known
vulnerabilities. 

> npm audit automatically runs when you install a package with npm install.

It's recommended to include `npm audit` in your CI pipeline and if your project
is really, really important - consider integrating with third-party security
solutions as well.

# 9) Contribute!

The last but not least - **contribute**! 

> If you can't find a package that solves your problem - consider creating it yourself!

My feeling is that at least 99% of programmers (including myself) are not
contributing enough. People take open-source (and free) software for granted
and don't want to think about the fact that there are other humans working hard
on it for little or no gains at all.

I think that every mid to senior level programmer should contribute to their ecosystems of
choice! This is a very bold statement but **contribution** is not only writing
code or dedicating loads of your time to projects. There are many things that
can be done to help others when dealing with software that don't take much time
at all. This is a separate topic in itself but here are a couple of ideas:

## Fix/improve the example project

Often times the example demo projects have some small issues or a dependency or
two missing from the declaration. This is literally a 1 minute fix that anyone
can do. If you spot this in a package that you're using just go ahead and make
a PR.

Often times the demo can be improved by quickly adding a feature that you need
for your use case. Submit a PR and share it with others as well, it takes 5
minutes.

## Fix the tests

Tests can fail for a varity of different reasons, but sometimes the fix is
really easy and cheap to do. If you see that the package that you're using has
failing tests - investigate and try to fix them if it's a minor thing.

## GitHub Issues

If you're feeling confused or have a question or a problem with a package that
you're using - feel free to **open a GitHub issue**. Not only that **you** can get
help this way, **everybody else** will be able to get value from it after the
fact.

## Documentation

There is a small error or a type-o in the documentation? Fix it and submit a
PR, everyone will appreciate it.

## Donate money

In only a couple of minutes you can donate money and support the maintainers of
your favorite software projects. Donating takes almost no time and effort and
can mean a lot to the maintainers.

## Marketing

If you're using "social media" - mention a great software package that helped you
out so that others can know about it. It only takes a couple of seconds and can
mean a lot to the authors.

# Conclusion

By following the points given above you should be able to effectively filter
NPM packages and find exactly what you need. In the case that you don't find
what you need consider authoring and publishing a software package of your own.
I will gladly do a code-review, feel free to hit me up at:
<a href="mailto:dusan_dimitric@yahoo.com">dusan_dimitric@yahoo.com</a>.

Until next time!

