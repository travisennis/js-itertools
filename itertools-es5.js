(function () {
  'use strict'

  const root = this

  const iter = Object.create(null)

  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = iter
    }
    exports.iter = iter
  } else {
    root.iter = iter
  }

  iter.VERSION = '0.1.0'

  // For script engines that already support iterators.
  if ('StopIteration' in root) {
    iter.StopIteration = root.StopIteration
  } else {
    iter.StopIteration = Error('StopIteration')
  }

  /**
     *
     */
  iter.Iterator = function () {}

  /**
     *
     */
  iter.Iterator.prototype.next = function () {
    throw iter.StopIteration
  }

  /**
     *
     */
  iter.Iterator.prototype.__iterator__ = function (opt_keys) {
    return this
  }

  /**
     *
     */
  iter.toIterator = function (iterable, keysOnly) {
    // if (typeof root['Iterator'] === 'function') {
    //    return root['Iterator'](o, keysOnly);
    // }
    if (iterable instanceof iter.Iterator) {
      return iterable
    }
    if (typeof iterable.__iterator__ === 'function') {
      return iterable.__iterator__(keysOnly)
    }
    const newIter = new iter.Iterator()
    if (Array.isArray(iterable)) {
      let i = 0
      newIter.next = function () {
        while (true) {
          if (i >= iterable.length) {
            throw iter.StopIteration
          }
          // Don't include deleted elements.
          if (!(i in iterable)) {
            i++
            continue
          }
          return iterable[i++]
        }
      }
      return newIter
    } else {
      newIter.next = function () {
        while (true) {
          throw iter.StopIteration
        }
      }
      return newIter
    }
  }

  /**
     * Make an iterator that returns elements from the first iterable until it is
     * exhausted, then proceeds to the next iterable, until all of the iterables
     * are exhausted. Used for treating consecutive sequences as a single sequence.
     */
  iter.chain = function () {
    const args = arguments
    const length = args.length
    let i = 0
    const newIter = new iter.Iterator()
    let current = iter.toIterator(args[i])
    newIter.next = function () {
      try {
        return current.next()
      } catch (ex) {
        if (ex !== iter.StopIteration || i >= length) {
          throw ex
        } else {
          i++
          if (i >= length) {
            throw iter.StopIteration
          }
          current = iter.toIterator(args[i])
          return this.next()
        }
      }
    }
    return newIter
  }

  /**
     * Make an iterator that returns consecutive integers starting with start with optional step.
     */
  iter.count = function () {
    let start = 0
    let step = 1
    if (arguments.length === 1) {
      start = arguments[0]
    } else if (arguments.length === 2) {
      start = arguments[0]
      step = arguments[1]
    }
    const newIter = new iter.Iterator()
    newIter.next = function () {
      const i = start
      start += step
      return i
    }
    return newIter
  }

  /**
     * Make an iterator returning elements from the iterable and saving a copy of
     * each. When the iterable is exhausted, return elements from the saved copy.
     * Repeats indefinitely.
     */
  iter.cycle = function (iterable) {
    const baseIterator = iter.toIterator(iterable)

    const cache = []
    let cacheIndex = 0

    const newIter = new iter.Iterator()

    let useCache = false

    newIter.next = function () {
      let returnElement = null

      if (!useCache) {
        try {
          returnElement = baseIterator.next()
          cache.push(returnElement)
          return returnElement
        } catch (e) {
          if (e !== iter.StopIteration || cache.length === 0) {
            throw e
          }
          useCache = true
        }
      }

      returnElement = cache[cacheIndex]
      cacheIndex = (cacheIndex + 1) % cache.length

      return returnElement
    }
    return newIter
  }

  /**
     * Make an iterator that drops elements from the iterable as long as the
     * predicate is true; afterwards, returns every element.
     */
  iter.dropwhile = function (func, iterable, opt_obj) {
    iterable = iter.toIterator(iterable)
    const newIter = new iter.Iterator()
    let dropping = true
    newIter.next = function () {
      while (true) {
        const val = iterable.next()
        if (dropping && func.call(opt_obj, val, undefined, iterable)) {
          continue
        } else {
          dropping = false
        }
        return val
      }
    }
    return newIter
  }

  /**
     * Return an enumerate object.
     */
  iter.enumerate = function (iterable) {
    return iter.zip(iter.count(), iterable)
  }

  /**
     * Make an iterator that filters elements from iterable returning only those
     * for which the predicate is True.
     */
  iter.filter = function (func, iterable, opt_obj) {
    iterable = iter.toIterator(iterable)
    const newIter = new iter.Iterator()
    newIter.next = function () {
      while (true) {
        const val = iterable.next()
        if (func.call(opt_obj, val, undefined, iterable)) {
          return val
        }
      }
    }
    return newIter
  }

  /**
     * Make an iterator that filters elements from iterable return only those
     * for which the predicate is False.
     */
  iter.filterfalse = function (func, iterable, opt_obj) {
    iterable = iter.toIterator(iterable)
    const newIter = new iter.Iterator()
    newIter.next = function () {
      while (true) {
        const val = iterable.next()
        if (!func.call(opt_obj, val, undefined, iterable)) {
          return val
        }
      }
    }
    return newIter
  }

  /**
     * Make an iterator that computers the function using elements from the
     * iterable.
     */
  iter.map = function (func, iterable, opt_obj) {
    iterable = iter.toIterator(iterable)
    const newIter = new iter.Iterator()
    newIter.next = function () {
      while (true) {
        const val = iterable.next()
        return func.call(opt_obj, val, undefined, iterable)
      }
    }
    return newIter
  }

  /**
     * Repeatedly applies a binary function to an array from left to right
     * using a seed value as a starting point; returns the final value.
     */
  iter.foldl = function (func, iterable, z) {
    iterable = iter.toArray(iterable)
    for (const x in iterable) {
      z = func(z, x)
    }
    return z
  }

  /**
     * Repeatedly applies a binary function to an array from left to right;
     * returns the final value.
     */
  iter.foldl1 = function (func, l) {
    l = iter.toArray(l)
    let z = head(l)
    for (const x in l) {
      z = func(z, x)
    }
    return z
  }

  /**
     * Repeatedly applies a binary function to an array from right to left
     * using a seed value as a starting point; returns the final value.
     */
  iter.foldr = function (func, l, z) {
    l = iter.toArray(l)
    l = reverse(l)
    for (const x in l) {
      z = func(z, x)
    }
    return z
  }

  /**
     * repeatedly applies a binary function to an array from right to left;
     * returns the final value.
     */
  iter.foldr1 = function (func, l) {
    l = iter.toArray(l)
    l = reverse(l)
    let z = head(l)
    for (const x in l) {
      z = func(z, x)
    }
    return z
  }

  /**
     * Returns an array created through a series of functions.
     */
  /*    iter.unfold = function(start, predicate, func, g, o) {
        while (predicate.call(o, start)) {
            var r = func.call(o, start);
            yield r;
            start = g.call(o, start);
        }
    }; */

  /**
     * Make an iterator by repeatedly applying a binary function to an iterable
     * from left to right using a seed value as a starting point; the iterator
     * of values are those produced by foldl() at that point.
     */
  /*    iter.scanl = function(func, l, z) {
        l = iter.toArray(l);
        for (var x in l) {
            z = func(z, x);
            yield z;
        }
    }; */

  /**
     * Make an iterator by repeatedly applying a binary function to an iterable
     * from left to right; the iterator of values are those produced by
     * foldl1() at that point.
     */
  /*    iter.scanl1 = function(func, l) {
        l = iter.toArray(l);
        var z = head(l);
        for (var x in l) {
            z = func(z, x);
            yield z;
        }
    }; */

  /**
     * Make an iterator by repeatedly applying a binary function to an iterable
     * from right to left using a seed value as a starting point; the iterator
     * of values are those produced by foldr() at that point.
     */
  /* iter.scanr = function(func, l, z) {
        l = iter.toArray(l);
        l = reverse(l);
        for (let x in l) {
            z = func(z, x);
            yield z;
        }
    }; */

  /**
     * Make an iterator by repeatedly applying a binary function to an iterable
     * from right to left; the iterator of values are those produced by
     * foldr1() at that point.
     */
  /* iter.scanr1 = function(func, l) {
        l = iter.toArray(l);
        l = reverse(l);
        var z = head(l);
        for (let x in l) {
            z = func(z, x);
            yield z;
        }
    }; */

  /**
     * Make an iterator that returns elements from the iterable as long as the
     * predicate is true.
     */
  iter.takewhile = function (func, iterable, opt_obj) {
    iterable = iter.toIterator(iterable)
    const newIter = new iter.Iterator()
    let taking = true
    newIter.next = function () {
      while (true) {
        if (taking) {
          const val = iterable.next()
          if (func.call(opt_obj, val, undefined, iterable)) {
            return val
          } else {
            taking = false
          }
        } else {
          throw iter.StopIteration
        }
      }
    }
    return newIter
  }

  /**
     * Make an iterator of arithmetic progressions.
     */
  iter.range = function () {
    let min, max, step
    if (arguments.length === 1) {
      min = 0
      max = arguments[0]
      step = 1
    } else { /* default step to 1 if it's zero or undefined */
      min = arguments[0]
      max = arguments[1]
      step = arguments[2] || 1
    }

    if (step === 0) {
      throw new Error('Range step argument must not be zero')
    }

    const newIter = new iter.Iterator()
    newIter.next = function () {
      if (step > 0 && min >= max || step < 0 && min <= max) {
        throw iter.StopIteration
      }

      const rv = min
      min += step
      return rv
    }
    return newIter
  }

  /**
     * Make an iterator that returns selected elements from the iterable.
     */
  iter.slice = function (iterable) {
    iterable = iter.toIterator(iterable)
    let start = 0
    let stop = 0
    let step = 1
    if (arguments.length === 2) {
      stop = arguments[1]
    } else if (arguments.length === 3) {
      start = arguments[1]
      stop = arguments[2]
    } else {
      start = arguments[1]
      stop = arguments[2]
      step = arguments[3]
    }
    const it = iter.range(start, stop, step)
    let nexti = it.next()
    let count = -1
    const newIter = new iter.Iterator()
    newIter.next = function () {
      while (true) {
        if (count === (stop - 1)) {
          throw iter.StopIteration
        }

        count++
        if (count === nexti) {
          try {
            nexti = it.next()
          } catch (ex) {
            if (ex !== iter.StopIteration) {
              throw ex
            }
          }
          return iterable.next()
        }
        iterable.next()
      }
    }
    return newIter
  }

  /**
     * Make an iterator that aggregates elements from each of the iterables.
     */
  iter.zip = function () {
    const args = Array.prototype.slice.call(arguments)
    const iterables = iter.toArray(iter.map(iter.toIterator, args))
    const len = iterables.length
    const newIter = new iter.Iterator()
    newIter.next = function () {
      const result = []
      for (let i = 0; i < len; i++) {
        result.push(iterables[i].next())
      }
      return result
    }
    return newIter
  }

  /**
     * Take first n elements from iterable.
     */
  iter.take = function (iterable, n) {
    return iter.slice(iterable, n)
  }

  /**
     * Returns the nth item from the iterable.
     */
  iter.takenth = function (iterable, n) {
    return iter.toArray(iter.slice(iterable, n, n + 1))[0]
  }

  /**
     * Returns the first element in the iterable.
     */
  iter.first = function (iterable) {
    return iter.takenth(iterable, 0)
  }

  /**
     * Returns the last element in the iterable.
     */
  iter.last = function (iterable) {
    iterable = iter.toIterator(iterable)
    return iter.foldl(function (x, y) {
      return y
    }, iter.toArray(iterable))
  }

  /**
     * Converts an interable into a list/array. If an array is given, returns the
     * array.
     */
  iter.toArray = function (iterable) {
    if (Array.isArray(iterable)) {
      return iterable
    }
    const r = []
    try {
      while (true) {
        r.push(iterable.next())
      }
    } catch (ex) {
      if (ex !== iter.StopIteration) {
        throw ex
      }
      return r
    }
  }

  /**
     * Makes an iterator with each element of every iterable yielded in turn.
     */
  iter.weave = function () {
    const args = Array.prototype.slice.call(arguments)
    const iterables = iter.toArray(iter.map(iter.toIterator, args))
    const len = iterables.length
    let i = 0
    const newIter = new iter.Iterator()
    newIter.next = function () {
      const result = iterables[i].next()
      i++
      if (i === len) i = 0
      return result
    }
    return newIter
  }

  /**
     * Takes an iterable and returns tuples of groupings
     */
  iter.groupBy = function (iterable, keyfunc) {
    if (arguments.length < 2) {
      keyfunc = function (x) {
        return x
      }
    }

    iterable = iter.toIterator(iterable)

    let tgtkey, currkey, currvalue

    function grouper (key) {
      const newIter = new iter.Iterator()
      newIter.next = function () {
        while (currkey === key) {
          const temp = currvalue
          currvalue = iterable.next()
          currkey = keyfunc(currvalue)
          return temp
        }
        throw iter.StopIteration
      }
      return newIter
    }

    const newIter = new iter.Iterator()
    newIter.next = function () {
      while (true) {
        while (currkey === tgtkey) {
          currvalue = iterable.next()
          currkey = keyfunc(currvalue)
        }
        tgtkey = currkey
        return [currkey, grouper(tgtkey)]
      }
    }
    return newIter
  }

  /**
     * Takes a list a removes all consecutive duplicates.
     */
  iter.compress = function (iterable) {
    const groups = iter.toArray(iter.groupBy(iterable))
    const len = groups.length
    const result = []
    for (let i = 0; i < len; i++) {
      const tmp = groups[i][0]
      result.push(tmp)
    }
    return result
  }

  /**
     * Takes a list and breaks consecutive runs of elements into sub-lists.
     */
  iter.pack = function (iterable) {
    const groups = iter.groupBy(iterable)
    const result = []
    try {
      while (true) {
        const tmp = iter.toArray(groups.next()[1])
        result.push(tmp)
      }
    } catch (ex) {
      if (ex !== iter.StopIteration) {
        throw ex
      }
      return result
    }
  }

  /**
     * Will repeat x indefinitely unless an optional, end, is given
     */
  iter.repeat = function (x, end) {
    let step = 0
    if (arguments.length < 2) {
      end = 0
    }
    const newIter = new iter.Iterator()
    newIter.next = function () {
      while (true) {
        step++
        if (step == end) {
          break
        }
        return x
      }
    }
    return newIter
  }

  /**
     * Will take an iterable and will return n independent iteratators
     */
  iter.tee = function (iterable, n) {
    iterable = iter.toIterator(iterable)
    if (arguments.length < 2) {
      n = 2
    }
    const queues = []
    for (let i = 0; i < n; i++) {
      queues.push([])
    }

    function gen (q) {
      const newIter = new iter.Iterator()
      newIter.next = function () {
        while (true) {
          if (q.length === 0) {
            const val = iterable.next()
            for (const d in queues) {
              queues[d].push(val)
            }
          }
          return q.shift()
        }
      }
      return newIter
    }
    const result = []
    for (const d in queues) {
      result.push(gen(queues[d]))
    }
    return result
  }

  /**
     * Takes an iterator and will apply a function over each item
     */
  iter.forEach = function (func, iterable, opt_obj) {
    iterable = iter.toIterator(iterable)
    const newIter = new iter.Iterator()
    newIter.next = function () {
      try {
        func.call(opt_obj, iterable.next(), undefined, iterable)
      } catch (ex) {
        if (ex !== iter.StopIteration) {
          throw ex
        }
      }
    }
    return newIter
  }

  /**
     * Takes an iterator and flattens one level of nesting
     */
  iter.flatten = function (iterable) {
    const chainedIter = iter.chain(iterable)
    const temp = chainedIter.next()
    let current = iter.toIterator(temp)
    const newIter = new iter.Iterator()
    newIter.next = function () {
      while (true) {
        try {
          return current.next()
        } catch (ex) {
          if (ex !== iter.StopIteration) {
            throw ex
          } else {
            current = iter.toIterator(chainedIter.next())
            return this.next()
          }
        }
      }
    }
    return newIter
  }

  /**
     * Joins the values in a iterator with a delimiter.
     */
  iter.join = function (iterable, deliminator) {
    return iter.toArray(iterable).join(deliminator)
  }

  // private helper functions
  function reverse (list) {
    const r = []
    for (let i = list.length - 1; i >= 0; i--) {
      r.push(list[i])
    }
    return r
  }

  function isUndefined (a) {
    return typeof a === 'undefined'
  }

  function head (list) {
    return list[0]
  }
}).call(this)
