/**
 * Make an iterator that returns elements from the first iterable until it is
 * exhausted, then proceeds to the next iterable, until all of the iterables
 * are exhausted. Used for treating consecutive sequences as a single sequence.
 */
chain = function() {
  var args = arguments;
  for (var i = 0; i <= args.length; i++) {
    for (var x in args[i]) {
      yield x;
    }
  }
};

/**
 * Make an iterator returning elements from the iterable and saving a copy of
 * each. When the iterable is exhausted, return elements from the saved copy.
 * Repeats indefinitely.
 */
cycle = function(iterable) {
  iterable = Iterator(iterable);
  var saved = [];
  for (let e in iterable) {
    yield e;
    saved.push(e);
  }
  while (saved) {
    for (let j in saved) {
      yield j;
    }
  }
};

/**
 * Make an iterator that drops elements from the iterable as long as the
 * predicate is true; afterwards, returns every element.
 */
dropwhile = function(func, iterable) {
  iterable = Iterator(iterable);
  for (let x in iterable) {
    if (!func(x)) {
      yield x;
      break;
    }
  }
  for (let x in iterable) {
    yield x;
  }
};

/**
 * Return an enumerate object.
 */
enumerate = function(iterable) { 
  return Iter.zip(Iter.count(), iterable);
};

/**
 * Make an iterator that filters elements from iterable returning only those
 * for which the predicate is True.
 */
filter = function(func, iterable) {
  iterable = Iterator(iterable);
  for (let x in iterable) {
    if (func(x)) {
      yield x;
    }
  }    
};

/**
 * Make an iterator that filters elements from iterable return only those
 * for which the predicate is False.
 */
filterfalse = function(func, iterable) {
  iterable = Iterator(iterable);
  for (let x in iterable) {
    if (!func(x)) {
      yield x;
    }
  }    
};

/**
 * Make an iterator that computers the function using elements from the
 * iterable.
 */
map = function(func, iterable) {
  iterable = Iterator(iterable);
  for (let x in iterable) {
    yield func(x);
  }   
};

/**
 * Repeatedly applies a binary function to an array from left to right
 * using a seed value as a starting point; returns the final value.
 */
foldl = function(func, l, z){
  l = Iter.list(l);
  for (let x in l) {
    z = func(z, x);
  }
  return z;
};

/**
 * Repeatedly applies a binary function to an array from left to right;
 * returns the final value.
 */
foldl1 = function(func, l) {
  l = Iter.list(l);
  var z = Iter.head(l);
  for (let x in l) {
    z = func(z, x);
  }
  return z;  
};

/**
 * Repeatedly applies a binary function to an array from right to left
 * using a seed value as a starting point; returns the final value.
 */
foldr = function(func, l, z){
  l = Iter.list(l);
  l = Iter.reverse(l);
  for (let x in l) {
    z = func(z, x);
  }
  return z;
};

/**
 * repeatedly applies a binary function to an array from right to left;
 * returns the final value.
 */
foldr1 = function(func, l) {
  l = Iter.list(l);
  l = Iter.reverse(l);
  var z = Iter.head(l);  
  for (let x in l) {
    z = func(z, x);
  }
  return z;
};

/**
 * Returns an array created through a series of function.
 */
unfold = function(start, predicate, func, g, o) {
  while (predicate.call(o, start)) {
    let r = func.call(o , start);
    yield r;
    start = g.call(o, start);
  }
};

/**
 * Make an iterator by repeatedly applying a binary function to an iterable
 * from left to right using a seed value as a starting point; the iterator
 * of values are those produced by foldl() at that point.
 */
scanl = function(func, l, z){
  l = Iter.list(l);
  for (let x in l) {
    z = func(z, x);
    yield z;
  }
};

/**
 * Make an iterator by repeatedly applying a binary function to an iterable
 * from left to right; the iterator of values are those produced by
 * foldl1() at that point.
 */  
scanl1 = function(func, l) {
  l = Iter.list(l);
  var z = List.head(l);
  for (let x in l) {
    z = func(z, x);
    yield z;
  }
};

/**
 * Make an iterator by repeatedly applying a binary function to an iterable
 * from right to left using a seed value as a starting point; the iterator
 * of values are those produced by foldr() at that point.
 */
scanr = function(func, l, z){
  l = Iter.list(l);
  l = List.reverse(l);
  for (let x in l) {
    z = func(z, x);
    yield z;
  }
};

/**
 * Make an iterator by repeatedly applying a binary function to an iterable
 * from right to left; the iterator of values are those produced by
 * foldr1() at that point.
 */ 
scanr1 = function(func, l) {
  l = Iter.list(l);
  l = List.reverse(l);
  var z = List.head(l);  
  for (let x in l) {
    z = func(z, x);
    yield z;
  }
};

/**
 * Make an iterator that returns elements from the iterable as long as the
 * predicate is true.
 */
takewhile = function(func, iterable) {
  iterable = Iterator(iterable);
  for (let x in iterable) {
    if (func(x)) {
      yield x;
    } else {
      return;
    }
  }  
};

/**
 * Make an iterator that returns consecutive integers starting with n.
 */
count = function(n) {
  if (Lang.isUndefined(n)) {
    n = 0;
  }
  while (true) {
    yield n;
    n++;
  }
};

/**
 * Make an iterator of arithmetic progressions.
 */
range = function() {
  var min, max, step;
  if (arguments.length == 1) {
    min = 0;
    max = arguments[0];
    step = 1;
  }
  else {
    /* default step to 1 if it's zero or undefined */
    min = arguments[0];
    max = arguments[1];
    step = arguments[2] || 1;
  }
  for (let i = min; i <= max; i += step) {
    yield i;
  }
};

/**
 * Make an iterator tha returns selected elements from the iterable.
 */
slice = function(iterable) {
  iterable = Iterator(iterable);
  var start = 0, stop = 0, step = 1;
  if (arguments.length == 2) {
    stop = arguments[1];
  } else if (arguments.length == 3) {
    start = arguments[1];
    stop = arguments[2];
  } else {
    start = arguments[1];
    stop = arguments[2];
    step = arguments[3];
  }
  var it = fpjs.range(start,stop,step);
  var nexti = it.next();
  var count = -1;
  for (let x in iterable) {
    count++;
    if (count === nexti) {
      yield x;
      nexti = it.next();
    }
  }
};

/**
 * Make an iterator that aggregates elements from each of the iterables.
 */
zip = function() {
  var args = Array.prototype.slice.call(arguments);
  var iterables = Iter.list(Iter.map(Iterator, args));
  while (iterables) {
    var result = [i.next() for (i in iterables)];
    yield result;    
  }
};

/**
 * Take first n elements from iterable.
 */
take = function(iterable, n) {
  return Iter.slice(iterable, n);
};

/**
 * Returns the nth item from the iterable.
 */
takenth = function(iterable, n) {
  return Iter.list(Iter.slice(iterable, n, n+1))[0];
};

/**
 * Returns the first element in the iterable.
 */
first = function(iterable) {
  return Iter.takenth(iterable, 0);
};

/**
 * Returns the last element in the iterable.
 */
last = function(iterable) {
  iterable = Iterator(iterable);
  return Iter.foldl(function(x,y) { return y }; Iter.list(iterable));
};

/**
 * Converts an interable into a list/array. If an array is given, returns the
 * array.
 */
list = function(i) {
  if (Lang.isArray(i))
    return i;
  var r = [];
  try {
    while (true) {
      r.push(i.next());
    }
  } catch (e) {
     if (e != StopIteration) {
       throw e;
     }
     return r;
  }
};    

/**
 * Makes an iterator with each element of every iterable yielded in turn.
 */
weave = function() {
  var args = Array.prototype.slice.call(arguments);
  var iterables = Iter.list(Iter.map(Iterator, args));
  while (iterables) {
    for (let [i, it] in Iter.enumerate(iterables)) {
      yield it.next();
    }
  }
};

/**
 * Takes a list a removes all consecutive duplicates.
 */
compress = function(list) {
  return [a[0] for (a in Iter.zip(list, list.slice(1).append("undefined"))) if (a[0] != a[1])];
};

/**
 * Takes a list and breaks consecutive runs of elements into sub-lists.
 */
pack = function(list) {
  var it = Iterator(list.slice(1));
  return [Iter.list(Iter.takewhile(function(y) { return y == x}; it)).append(x) for (x in Iter.compress(list))];
};