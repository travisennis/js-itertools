# js-itertools

## Background

Generators and iterators are constructs that have long existed in many languages. I first ran into over 15 years go in Python and then discovered a similar language feature in F#. I found them to be powerful and useful tools. When they were first proposed for Javascript was way back in 2007 when they were proposed for ECMAScript 4, which was later abandoned. But at the time, a version of interators and generators existed that were very similar to Python's implementation and you could find them implemented both in Mozilla's Rhino and Spidermonkey Javascript engines. When I first implemented this library back in 2008 or 2009, I was mostly trying to copy the standard itertools library that could be found in Python so that I could use it for server-side scripting in Rhino. After ES4 was shelved, generators were redeveloped and the version of iterators and generators that exist today in Javascript is still very similar although a few things are different. The differences range from the minor, such as the `StopIteration` error being replaced by a `done` property that is on the object returned from a call to `next()`: `{done: true}`, to the major with the abandonment of generator expressions which were a concise and elegant way to construct new generators (I kind of miss these since they made is pretty trivial to port Python code that used generators into Javascript). What's left though is still extremely powerful.

Generators are not as well known as some other newer additions to the Javascript language, such as Promises and async/await, which had immediate and practical impacts on how many Javascript developers write code. Generators on the other hand are seemingly little used directly, although their inclusion in the language does make other, more well-known features, possible. For that reason they are worth knowing about, both in terms of how they work and how to use them.

## References

- [Iterators and generators - JavaScript | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators)
- [Understanding Generators in JavaScript | Tania Rascia](https://www.taniarascia.com/understanding-generators-in-javascript/)

## Other Javascript Libraries

- [nvie/itertools.js: JavaScript port of Python's awesome itertools stdlib](https://github.com/nvie/itertools.js)
- [abozhilov/ES-Iter: Itertools for JavaScript](https://github.com/abozhilov/ES-Iter)

## Python Generators

- [itertools — Functions creating iterators for efficient looping — Python Documentation](https://docs.python.org/3/library/itertools.html)
- [Functional Programming HOWTO — Python Documentation](https://docs.python.org/3/howto/functional.html)
