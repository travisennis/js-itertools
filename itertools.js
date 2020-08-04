'use strict'

export const iter = function (iterable) {
  return iterable[Symbol.iterator]()
}

export const isIterable = function (obj = null) {
  return (obj !== null && typeof obj[Symbol.iterator] === 'function')
}

/**
 * Make an iterator that returns elements from the first iterable until it is
 * exhausted, then proceeds to the next iterable, until all of the iterables
 * are exhausted. Used for treating consecutive sequences as a single sequence.
 */
export const chain = function * (...iters) {
  for (let i = 0; i <= iters.length; i++) {
    for (const x of iters[i]) {
      yield x
    }
  }
}

/**
 * Make an iterator that returns consecutive integers starting with start with optional step.
 */
export const count = function * (start = 0, step = 1) {
  for (let i = start; true; i += step) {
    yield i
  }
}

/**
 * Make an iterator returning elements from the iterable and saving a copy of
 * each. When the iterable is exhausted, return elements from the saved copy.
 * Repeats indefinitely.
 */
export const cycle = function * (iterable) {
  const saved = []
  for (const e of iterable) {
    yield e
    saved.push(e)
  }
  while (true) {
    for (const j of saved) {
      yield j
    }
  }
}

/**
 * Make an iterator that drops elements from the iterable as long as the
 * predicate is true; afterwards, returns every element.
 */
export const dropwhile = function * (iterable, func) {
  iterable = iter(iterable)
  for (const x of iterable) {
    if (!func(x)) {
      yield x
      break
    }
  }
  for (const x of iterable) {
    yield x
  }
}

/**
 * Return an enumerate object.
 */
export const enumerate = function * (iterable) {
  yield * zip(count(), iterable)
}

/**
 * Make an iterator that filters elements from iterable returning only those
 * for which the predicate is True.
 */
export const filter = function * (iterable, func) {
  for (const x of iterable) {
    if (func(x)) {
      yield x
    }
  }
}

/**
 * Make an iterator that filters elements from iterable return only those
 * for which the predicate is False.
 */
export const filterfalse = function * (iterable, func) {
  iterable = iter(iterable)
  for (const x of iterable) {
    if (!func(x)) {
      yield x
    }
  }
}

/**
 * Make an iterator that computes the function using elements from the
 * iterable.
 */
export const map = function * (iterable, func) {
  iterable = iter(iterable)
  for (const x of iterable) {
    yield func(x)
  }
}

/**
 *
 * @param {*} iterable
 * @param {*} func
 */
export const starmap = function * (iterable, func) {
  iterable = iter(iterable)
  for (const x of iterable) {
    yield func(...x)
  }
}

//   /**
//    * Repeatedly applies a binary function to an array from left to right
//    * using a seed value as a starting point; returns the final value.
//    */
//   export const foldl = function(func, l, z){
//     l = list(l);
//     for (let x of l) {
//       z = func(z, x);
//     }
//     return z;
//   };

//   /**
//    * Repeatedly applies a binary function to an array from left to right;
//    * returns the final value.
//    */
//   export const foldl1 = function*(func, l) {
//     l = list(l);
//     var z = head(l);
//     for (let x of l) {
//       z = func(z, x);
//     }
//     return z;
//   };

//   /**
//    * Repeatedly applies a binary function to an array from right to left
//    * using a seed value as a starting point; returns the final value.
//    */
//   export const foldr = function*(func, l, z){
//     l = list(l);
//     l = reverse(l);
//     for (let x of l) {
//       z = func(z, x);
//     }
//     return z;
//   };

//   /**
//    * repeatedly applies a binary function to an array from right to left;
//    * returns the final value.
//    */
//   export const foldr1 = function*(func, l) {
//     l = list(l);
//     l = reverse(l);
//     var z = head(l);
//     for (let x of l) {
//       z = func(z, x);
//     }
//     return z;
//   };

//   /**
//    * Returns an array created through a series of function.
//    */
//   export const unfold = function*(start, predicate, func, g, o) {
//     while (predicate.call(o, start)) {
//       let r = func.call(o , start);
//       yield r;
//       start = g.call(o, start);
//     }
//   };

//   /**
//    * Make an iterator by repeatedly applying a binary function to an iterable
//    * from left to right using a seed value as a starting point; the iterator
//    * of values are those produced by foldl() at that point.
//    */
//   export const scanl = function*(func, l, z){
//     l = list(l);
//     for (let x of l) {
//       z = func(z, x);
//       yield z;
//     }
//   };

//   /**
//    * Make an iterator by repeatedly applying a binary function to an iterable
//    * from left to right; the iterator of values are those produced by
//    * foldl1() at that point.
//    */
//   export const scanl1 = function*(func, l) {
//     l = list(l);
//     var z = head(l);
//     for (let x of l) {
//       z = func(z, x);
//       yield z;
//     }
//   };

//   /**
//    * Make an iterator by repeatedly applying a binary function to an iterable
//    * from right to left using a seed value as a starting point; the iterator
//    * of values are those produced by foldr() at that point.
//    */
//   export const scanr = function*(func, l, z){
//     l = list(l);
//     l = reverse(l);
//     for (let x of l) {
//       z = func(z, x);
//       yield z;
//     }
//   };

//   /**
//    * Make an iterator by repeatedly applying a binary function to an iterable
//    * from right to left; the iterator of values are those produced by
//    * foldr1() at that point.
//    */
//   export const scanr1 = function*(func, l) {
//     l = list(l);
//     l = reverse(l);
//     var z = head(l);
//     for (let x of l) {
//       z = func(z, x);
//       yield z;
//     }
//   };

/**
   * Make an iterator that returns elements from the iterable as long as the
   * predicate is true.
   */
export const takewhile = function * (iterable, func) {
  iterable = iter(iterable)
  for (const x of iterable) {
    if (func(x)) {
      yield x
    } else {
      return
    }
  }
}

/**
 * Returns a range iterator
 *
 * @param {number} start the number to start the range
 * @param {number} end the number to end the range
 * @param {number} [step] optional step. will default to 1
 */
export const range = function * (start, end, step = 1) {
  if (typeof end === 'undefined') {
    end = start
    start = 0
  }
  if (step > 0 && start >= end) {
    return
  }

  if (step < 0 && start <= end) {
    return
  }

  yield start
  yield * range(start + step, end, step)
}

/**
 * Make an iterator that returns selected elements from the iterable.
 */
export const slice = function * (iterable) {
  iterable = iter(iterable)
  let start = 0; let stop = 0; let step = 1
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
  const it = range(start, stop, step)
  let nexti = it.next()
  let count = -1
  for (const x of iterable) {
    count++
    if (count === nexti.value) {
      yield x
      nexti = it.next()
      if (nexti.done) {
        return
      }
    }
  }
}

/**
 * Make an iterator that aggregates elements from each of the iterables.
 */
export const zip = function * (iterable1, iterable2) {
  iterable1 = iter(iterable1)
  iterable2 = iter(iterable2)
  while (true) {
    const x = iterable1.next()
    const y = iterable2.next()
    if (!x.done && !y.done) {
      yield [x.value, y.value]
    } else {
      return
    }
  }
}

/**
 * Take first n elements from iterable.
 */
export const take = function * (iterable, n) {
  yield * slice(iterable, n)
}

//   /**
//    * Returns the nth item from the iterable.
//    */
//   export const takenth = function(iterable, n) {
//     return list(slice(iterable, n, n+1))[0];
//   };

//   /**
//    * Returns the first element in the iterable.
//    */
//   export const first = function(iterable) {
//     return takenth(iterable, 0);
//   };

//   /**
//    * Returns the last element in the iterable.
//    */
//   export const last = function(iterable) {
//     iterable = Iterator(iterable);
//     return foldl(function(x,y) { return y }, list(iterable));
//   };

//   /**
//    * Converts an interable into a list/array. If an array is given, returns the
//    * array.
//    */
//   export const list = function(i) {
//     if (Array.isArray(i))
//       return i;
//     var r = [];
//     try {
//       while (true) {
//         r.push(i.next());
//       }
//     } catch (e) {
//        if (e != StopIteration) {
//          throw e;
//        }
//        return r;
//     }
//   };

/**
 * Makes an iterator with each element of every iterable yielded in turn.
 */
export const weave = function * (...iterables) {
  iterables = iterables.map((i) => iter(i))
  for (const count of cycle(range(0, iterables.length))) {
    yield iterables[count].next().value
  }
}

/**
 *
 */
export const groupBy = function * (iterable, fn = (x) => x) {
  iterable = iter(iterable)

  let targetKey, currentKey, currentValue

  function * grouper (key) {
    while (currentKey === key) {
      yield currentValue
      currentValue = iterable.next()
      if (currentValue.done === true) {
        return
      }
      currentKey = fn(currentValue.value)
    }
  }

  while (true) {
    while (currentKey === targetKey) {
      currentValue = iterable.next()
      if (currentValue.done === true) {
        return
      }
      currentKey = fn(currentValue.value)
    }
    targetKey = currentKey
    yield [currentKey, grouper(targetKey)]
  }
}

/**
 * Takes a list a removes all consecutive duplicates.
 */
export const compress = function * (iterable) {
  iterable = iter(iterable)
  for (const [a] of groupBy(iterable)) {
    yield a
  }
}

/**
 * Takes a list and breaks consecutive runs of elements into sub-lists.
 */
export const pack = function * (iterable) {
  iterable = iter(iterable)
  for (const [, b] of groupBy(iterable)) {
    yield Array.from(b).map(i => i.value)
  }
}

/**
 *
 */
export const repeat = function * (n, stop = -1) {
  let count = 0
  while (true) {
    yield n
    count++
    if (stop === count) {
      break
    }
  }
}

/**
 *
 */
export const tee = function (iterable, n = 2) {
  iterable = iter(iterable)

  const queues = []
  for (let i = 0; i < n; i++) {
    queues.push([])
  }

  function * gen (q) {
    while (true) {
      if (q.length === 0) {
        const next = iterable.next()
        if (next.done) {
          return
        }
        const val = next.value
        for (const d of queues) {
          d.push(val)
        }
      }
      yield q.shift()
    }
  }

  const result = []
  for (const d of queues) {
    result.push(gen(d))
  }
  return result
}

/**
 *
 */
export const flatten = function * (iterables) {
  for (const iterable of iterables) {
    for (const item of iterable) {
      yield item
    }
  }
}

/**
 *
 * @see https://stackoverflow.com/questions/9960908/permutations-in-javascript
 *
 * @param {*} iterable
 */
export const permutations = function * (iterable, r = null) {
  const pool = Array.from(iterable)
  const n = pool.length
  const x = r === undefined ? n : r

  if (x > n) {
    return
  }

  let indices = Array.from(range(0, n))
  const cycles = Array.from(range(n, n - x, -1))
  const poolgetter = (i) => pool[i]

  yield indices.slice(0, x).map(poolgetter)

  while (true) {
    let cleanExit = true
    for (const i of range(x - 1, -1, -1)) {
      cycles[i] -= 1
      if (cycles[i] === 0) {
        indices = indices
          .slice(0, i)
          .concat(indices.slice(i + 1))
          .concat(indices.slice(i, i + 1))
        cycles[i] = n - i
      } else {
        const j = cycles[i]

        const [p, q] = [indices[indices.length - j], indices[i]]
        indices[i] = p
        indices[indices.length - j] = q
        yield indices.slice(0, x).map(poolgetter)
        cleanExit = false
        break
      }
    }

    if (cleanExit) {
      return
    }
  }
}

export const combinations = function (iterable, r = null) {
  const pool = Array.from(iterable)
  const poolLength = pool.length
  const n = r === undefined ? poolLength : r

  if (r > poolLength) {
    return
  }

  const result = []

  function * gen (idx = 0, start = 0) {
    if (idx >= n) {
      yield result.slice()
      return
    }
    for (let i = start; i < poolLength; i++) {
      result[idx] = pool[i]
      yield * gen(idx + 1, i + 1)
    }
  }

  return gen()
}

export const combinationsWithReplacement = function (iterable, r) {
  const pool = Array.from(iterable)
  const n = pool.length
  const result = []

  function * gen (pos = 0) {
    if (result.length === r) {
      yield result.slice()
      return
    }
    for (let i = pos; i < n; i++) {
      result.push(pool[i])
      yield * gen(i)
      result.pop()
    }
  }

  return gen()
}

export const product = function (...iterables) {
  const arr = [...iterables].map(it => isIterable(it) ? [...it] : it)
  const len = arr.length
  const res = []

  function * gen (idx = 0) {
    if (idx >= len) {
      yield res.slice()
      return
    }
    for (const v of arr[idx]) {
      res[idx] = v
      yield * gen(idx + 1)
    }
  }

  return gen()
}
