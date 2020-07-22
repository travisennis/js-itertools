import * as iter from './itertools.js'

test('chain succeeds', () => {
  const testIter = iter.chain([1, 2, 3], ['a', 'b', 'c'])
  expect(testIter.next().value).toBe(1)
  expect(testIter.next().value).toBe(2)
  expect(testIter.next().value).toBe(3)
  expect(testIter.next().value).toBe('a')
  expect(testIter.next().value).toBe('b')
  expect(testIter.next().value).toBe('c')
})

test('count succeeds with default args', () => {
  const testIter = iter.count()
  expect(testIter.next().value).toBe(0)
  expect(testIter.next().value).toBe(1)
  expect(testIter.next().value).toBe(2)
  expect(testIter.next().value).toBe(3)
  expect(testIter.next().value).toBe(4)
  expect(testIter.next().value).toBe(5)
})

test('count succeeds with given start and step', () => {
  const testIter = iter.count(1, 5)
  expect(testIter.next().value).toBe(1)
  expect(testIter.next().value).toBe(6)
  expect(testIter.next().value).toBe(11)
  expect(testIter.next().value).toBe(16)
  expect(testIter.next().value).toBe(21)
  expect(testIter.next().value).toBe(26)
})

test('cycle succeeds', () => {
  const testIter = iter.cycle([1, 2])
  expect(testIter.next().value).toBe(1)
  expect(testIter.next().value).toBe(2)
  expect(testIter.next().value).toBe(1)
  expect(testIter.next().value).toBe(2)
  expect(testIter.next().value).toBe(1)
  expect(testIter.next().value).toBe(2)
})

test('dropwhile succeeds', () => {
  const testIter = iter.dropwhile([7, -1, 0, 1], (i) => i > 0)
  expect(testIter.next().value).toBe(-1)
  expect(testIter.next().value).toBe(0)
  expect(testIter.next().value).toBe(1)
})

test('filter succeeds', () => {
  const testIter = iter.filter(iter.range(0, 10), (i) => i % 2 === 0)
  expect(testIter.next().value).toBe(0)
  expect(testIter.next().value).toBe(2)
  expect(testIter.next().value).toBe(4)
  expect(testIter.next().value).toBe(6)
  expect(testIter.next().value).toBe(8)
  expect(testIter.next().value).toBeUndefined()
})

test('filterfalse succeeds', () => {
  const testIter = iter.filterfalse(iter.range(0, 10), (i) => i % 2 === 0)
  expect(testIter.next().value).toBe(1)
  expect(testIter.next().value).toBe(3)
  expect(testIter.next().value).toBe(5)
  expect(testIter.next().value).toBe(7)
  expect(testIter.next().value).toBe(9)
  expect(testIter.next().value).toBeUndefined()
})

test('map succeeds', () => {
  const testIter = iter.map(iter.range(0, 5), (i) => i ** 2)
  expect(testIter.next().value).toBe(0)
  expect(testIter.next().value).toBe(1)
  expect(testIter.next().value).toBe(4)
  expect(testIter.next().value).toBe(9)
  expect(testIter.next().value).toBe(16)
  expect(testIter.next().value).toBeUndefined()
})

test('starmap succeeds', () => {
  const input = iter.zip(iter.range(0, 5), iter.range(6, 11))
  const testIter = iter.starmap(input, (x, y) => x + y)
  expect(testIter.next().value).toBe(6)
  expect(testIter.next().value).toBe(8)
  expect(testIter.next().value).toBe(10)
  expect(testIter.next().value).toBe(12)
  expect(testIter.next().value).toBe(14)
  expect(testIter.next().value).toBeUndefined()
})

test('range succeeds', () => {
  const testIter = iter.range(0, 5)
  expect(testIter.next().value).toBe(0)
  expect(testIter.next().value).toBe(1)
  expect(testIter.next().value).toBe(2)
  expect(testIter.next().value).toBe(3)
  expect(testIter.next().value).toBe(4)
  expect(testIter.next().value).toBeUndefined()
  expect(testIter.next().done).toBe(true)
})

test('range succeeds in reverse', () => {
  const testIter = iter.range(5, 0, -1)
  expect(testIter.next().value).toBe(5)
  expect(testIter.next().value).toBe(4)
  expect(testIter.next().value).toBe(3)
  expect(testIter.next().value).toBe(2)
  expect(testIter.next().value).toBe(1)
  expect(testIter.next().value).toBeUndefined()
  expect(testIter.next().done).toBe(true)
})

test('takewhile succeeds', () => {
  const testIter = iter.takewhile(iter.range(0, 10), i => i < 5)
  expect(testIter.next().value).toBe(0)
  expect(testIter.next().value).toBe(1)
  expect(testIter.next().value).toBe(2)
  expect(testIter.next().value).toBe(3)
  expect(testIter.next().value).toBe(4)
  expect(testIter.next().value).toBeUndefined()
  expect(testIter.next().done).toBe(true)
})

test('slice succeeds', () => {
  const testIter = iter.slice(iter.range(0, 10), 2, 4)
  expect(testIter.next().value).toBe(2)
  expect(testIter.next().value).toBe(3)
  expect(testIter.next().value).toBeUndefined()
  expect(testIter.next().done).toBe(true)
})

test('zip succeeds', () => {
  const testIter = iter.zip(iter.range(0, 5), iter.range(6, 11))
  expect(testIter.next().value).toStrictEqual([0, 6])
  expect(testIter.next().value).toStrictEqual([1, 7])
})

test('take succeeds', () => {
  const testIter = iter.take(iter.count(), 3)
  expect(testIter.next().value).toBe(0)
  expect(testIter.next().value).toBe(1)
  expect(testIter.next().value).toBe(2)
  expect(testIter.next().value).toBeUndefined()
  expect(testIter.next().done).toBe(true)
})

test('weave succeeds', () => {
  const testIter = iter.weave(iter.count(100), iter.count(200), iter.count(300))
  expect(testIter.next().value).toBe(100)
  expect(testIter.next().value).toBe(200)
  expect(testIter.next().value).toBe(300)
  expect(testIter.next().value).toBe(101)
  expect(testIter.next().value).toBe(201)
  expect(testIter.next().value).toBe(301)
})

test('groupby succeeds', () => {
  const countValues = (grouped) => Array.from(grouped).length
  const testIter = iter.groupBy('aaabbbcddddaa')
  const first = testIter.next().value
  expect(first[0]).toBe('a')
  expect(countValues(first[1])).toBe(3)
  const second = testIter.next().value
  expect(second[0]).toBe('b')
  expect(countValues(second[1])).toBe(3)
})

test('compress succeeds', () => {
  const testIter = iter.compress('aaabbbcddddaa')
  expect(testIter.next().value).toBe('a')
  expect(testIter.next().value).toBe('b')
  expect(testIter.next().value).toBe('c')
  expect(testIter.next().value).toBe('d')
  expect(testIter.next().value).toBe('a')
  expect(testIter.next().value).toBeUndefined()
  expect(testIter.next().done).toBe(true)
})

test('pack succeeds', () => {
  const testIter = iter.pack('aaabbbcddddaa')
  expect(testIter.next().value).toStrictEqual(['a', 'a', 'a'])
  expect(testIter.next().value).toStrictEqual(['b', 'b', 'b'])
  expect(testIter.next().value).toStrictEqual(['c'])
  expect(testIter.next().value).toStrictEqual(['d', 'd', 'd', 'd'])
  expect(testIter.next().value).toStrictEqual(['a', 'a'])
  expect(testIter.next().value).toBeUndefined()
  expect(testIter.next().done).toBe(true)
})

test('repeat succeeds', () => {
  const testIter = iter.repeat(10)
  expect(testIter.next().value).toBe(10)
  expect(testIter.next().value).toBe(10)
  expect(testIter.next().value).toBe(10)
})

test('tee succeeds', () => {
  const testIters = iter.tee(iter.count())
  expect(testIters[0].next().value).toBe(0)
  expect(testIters[1].next().value).toBe(0)
  expect(testIters[0].next().value).toBe(1)
  expect(testIters[1].next().value).toBe(1)
})

test('repeat with stop succeeds', () => {
  const testIter = iter.repeat(10, 3)
  expect(testIter.next().value).toBe(10)
  expect(testIter.next().value).toBe(10)
  expect(testIter.next().value).toBe(10)
  expect(testIter.next().value).toBeUndefined()
  expect(testIter.next().done).toBe(true)
})

test('flatten succeeds', () => {
  const testIter = iter.flatten([[0, 1], [2, 3]])
  expect(testIter.next().value).toBe(0)
  expect(testIter.next().value).toBe(1)
  expect(testIter.next().value).toBe(2)
  expect(testIter.next().value).toBe(3)
  expect(testIter.next().value).toBeUndefined()
  expect(testIter.next().done).toBe(true)
})

test('permutations succeeds', () => {
  const testIter = iter.permutations(iter.range(1, 6), 2)
  const result = [...testIter]
  expect(result).toHaveLength(120)
})
