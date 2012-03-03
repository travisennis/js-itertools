// Make arrays and strings act more like Python lists by iterating their values, not their keys.
Array.prototype.__iterator__ = String.prototype.__iterator__ = function () {
    for (let i = 0; i < this.length; i++)
        yield this[i]
};

// Make numbers behave as iterators
Number.prototype.__iterator__ = function() {
    for (let i = 0; i < this; i++)
        yield i;
};


(function() {

  var root = this;  

  var iter = Object.create(null);


  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = iter;
    }
    exports.iter = iter;
  } else {
    root['iter'] = iter;
  }

  iter.VERSION = '0.1.0';

  /**
   * Make an iterator that returns elements from the first iterable until it is
   * exhausted, then proceeds to the next iterable, until all of the iterables
   * are exhausted. Used for treating consecutive sequences as a single sequence.
   */
  iter.chain = function() {
    var args = arguments;
    for (var i = 0; i <= args.length; i++) {
      for (var x in args[i]) {
        yield x;
      }
    }
  };

  /**
   * Make an iterator that returns consecutive integers starting with start with optional step.
   */
  iter.count = function(start) {
    var step = 1;
    if(arguments.length == 2) {
      step = arguments[1];
    }
    for(let i = start; true; i += step) {
      yield i;
    }
  }

  /**
   * Make an iterator returning elements from the iterable and saving a copy of
   * each. When the iterable is exhausted, return elements from the saved copy.
   * Repeats indefinitely.
   */
  iter.cycle = function(iterable) {
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
  iter.dropwhile = function(func, iterable) {
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
  iter.enumerate = function(iterable) { 
    return iter.zip(iter.count(), iterable);
  };

  /**
   * Make an iterator that filters elements from iterable returning only those
   * for which the predicate is True.
   */
  iter.filter = function(func, iterable) {
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
  iter.filterfalse = function(func, iterable) {
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
  iter.map = function(func, iterable) {
    iterable = Iterator(iterable);
    for (let x in iterable) {
      yield func(x);
    }   
  };

  /**
   * Repeatedly applies a binary function to an array from left to right
   * using a seed value as a starting point; returns the final value.
   */
  iter.foldl = function(func, l, z){
    l = iter.list(l);
    for (let x in l) {
      z = func(z, x);
    }
    return z;
  };

  /**
   * Repeatedly applies a binary function to an array from left to right;
   * returns the final value.
   */
  iter.foldl1 = function(func, l) {
    l = iter.list(l);
    var z = head(l);
    for (let x in l) {
      z = func(z, x);
    }
    return z;  
  };

  /**
   * Repeatedly applies a binary function to an array from right to left
   * using a seed value as a starting point; returns the final value.
   */
  iter.foldr = function(func, l, z){
    l = iter.list(l);
    l = reverse(l);
    for (let x in l) {
      z = func(z, x);
    }
    return z;
  };

  /**
   * repeatedly applies a binary function to an array from right to left;
   * returns the final value.
   */
  iter.foldr1 = function(func, l) {
    l = iter.list(l);
    l = reverse(l);
    var z = head(l);  
    for (let x in l) {
      z = func(z, x);
    }
    return z;
  };

  /**
   * Returns an array created through a series of function.
   */
  iter.unfold = function(start, predicate, func, g, o) {
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
  iter.scanl = function(func, l, z){
    l = iter.list(l);
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
  iter.scanl1 = function(func, l) {
    l = iter.list(l);
    var z = head(l);
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
  iter.scanr = function(func, l, z){
    l = iter.list(l);
    l = reverse(l);
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
  iter.scanr1 = function(func, l) {
    l = iter.list(l);
    l = reverse(l);
    var z = head(l);  
    for (let x in l) {
      z = func(z, x);
      yield z;
    }
  };

  /**
   * Make an iterator that returns elements from the iterable as long as the
   * predicate is true.
   */
  iter.takewhile = function(func, iterable) {
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
   * Make an iterator of arithmetic progressions.
   */
  iter.range = function() {
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
  var slice = function(iterable) {
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
    var it = iter.range(start,stop,step);
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
  iter.zip = function() {
    var args = Array.prototype.slice.call(arguments);
    var iterables = iter.list(iter.map(Iterator, args));
    while (iterables) {
      var result = [i.next() for (i in iterables)];
      yield result;    
    }
  };

  /**
   * Take first n elements from iterable.
   */
  iter.take = function(iterable, n) {
    return iter.slice(iterable, n);
  };

  /**
   * Returns the nth item from the iterable.
   */
  iter.takenth = function(iterable, n) {
    return iter.list(iter.slice(iterable, n, n+1))[0];
  };

  /**
   * Returns the first element in the iterable.
   */
  iter.first = function(iterable) {
    return iter.takenth(iterable, 0);
  };

  /**
   * Returns the last element in the iterable.
   */
  iter.last = function(iterable) {
    iterable = Iterator(iterable);
    return iter.foldl(function(x,y) { return y }, iter.list(iterable));
  };

  /**
   * Converts an interable into a list/array. If an array is given, returns the
   * array.
   */
  iter.list = function(i) {
    if (Array.isArray(i))
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
  iter.weave = function() {
    var args = Array.prototype.slice.call(arguments);
    var iterables = iter.list(iter.map(Iterator, args));
    while (iterables) {
      for (let [i, it] in iter.enumerate(iterables)) {
        yield it.next();
      }
    }
  };

  /**
   * Takes a list a removes all consecutive duplicates.
   */
  iter.compress = function(list) {
    return [a[0] for (a in iter.zip(list, list.slice(1).append("undefined"))) if (a[0] != a[1])];
  };

  /**
   * Takes a list and breaks consecutive runs of elements into sub-lists.
   */
  iter.pack = function(list) {
    var it = Iterator(list.slice(1));
    return [iter.list(iter.takewhile(function(y) { return y == x}, it)).append(x) for (x in iter.compress(list))];
  };

  /**
   *
   */            
  iter.groupBy = function(i) {
    let fn;
    if(arguments.length == 2) {
      fn = args[1];
    }
    else {
      fn = function(x) x;
    }

    
    i = Iterator(i);
    
    let tgtkey,currkey,currvalue;

    function grouper(key) {
      while(currkey === key) {
        yield currvalue;
        currvalue = i.next();
        currkey = fn(currvalue);
      }  
    }

    while(true) {
      while(currkey === tgtkey) {
        currvalue = i.next();
        currkey = fn(currvalue);
      }
      tgtkey = currkey;
      yield [currkey, grouper(tgtkey)];
    }
  };

  /**
   *
   */
  iter.repeat = function(x) {
    let n = 0;
    let step = 0;
    if(arguments.length == 2) {
      n = arguments[1];
    }
    while(true) {
      yield x;
      step++;
      if(step == n) {
        break;
      }
    }
  }

  function reverse(list) {
    var r = [];
    for (let i = list.length - 1; i >= 0; i--) {
      r.push(list[i]);
    }
    return r;
  };

  function isUndefined(a) {
    return typeof a === 'undefined';
  };

  function head(l) {
    return l[0];
  };

}).call(this);