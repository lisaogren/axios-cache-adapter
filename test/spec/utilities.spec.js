/* globals describe it */

import assert from 'assert'

import {
  isObject,
  getTag,
  isFunction,
  isString,
  mapObject
} from 'src/utilities'

describe('Utilities', () => {
  const functions = [
    () => {},
    function * () {},
    async () => {}
  ]
  const objects = [{}, { foo: 'bar' }, { undefined: 'foo' }, { foo: { bar: 42 } }, []]
  const notObjects = ['1', 1, true, null, undefined, Infinity, -Infinity]

  describe('isObject', () => {
    it('Should return true for objects', () => {
      objects.forEach(obj => assert.ok(isObject(obj)))
    })

    it('Should return true for functions', () => {
      functions.forEach(fn => assert.ok(isObject(fn)))
    })

    it('Should return false on everything else', () => {
      notObjects.forEach(value => assert.ok(!isObject(value)))
    })
  })

  describe('getTag', () => {
    it('Should identify null ', () => {
      assert.strictEqual(getTag(null), '[object Null]')
    })

    it('Should identify undefined ', () => {
      assert.strictEqual(getTag(undefined), '[object Undefined]')
    })

    it('Should identify strings ', () => {
      assert.strictEqual(getTag('foo'), '[object String]')
    })

    it('Should identify all function types ', () => {
      assert.strictEqual(getTag(functions[0]), '[object Function]')
      assert.strictEqual(getTag(functions[1]), '[object GeneratorFunction]')
      assert.strictEqual(getTag(functions[2]), '[object AsyncFunction]')
    })
  })

  describe('isFunction', () => {
    it('Should return truthy for functions', () => {
      functions.forEach(fn => assert.ok(isFunction(fn)))
    })

    it('Should return falsy for non-function values', () => {
      objects.forEach(obj => assert.ok(!isFunction(obj)))
      notObjects.forEach(value => assert.ok(!isFunction(value)))
    })
  })

  describe('isString', () => {
    it('Should return truthy for strings', () => {
      assert.ok(isString('foo'))
      // eslint-disable-next-line no-new-wrappers
      assert.ok(new String('bar'))
    })

    it('Should return falsy for other values', () => {
      const [, ...notObjectswithoutString] = notObjects
      objects.forEach(obj => assert.ok(!isString(obj)))
      notObjectswithoutString.forEach(value => assert.ok(!isString(value)))
      functions.forEach(fn => assert.ok(!isString(fn)))
    })
  })

  describe('mapObject', () => {
    it('Should map an object to an Array, using given iteratee', () => {
      let called = false
      const mapped = mapObject({ n: 5, a: 10 }, (value, key) => {
        called = true
        return `${key}=${value + 5}`
      })
      assert.ok(called)
      assert.ok(mapped instanceof Array)
      assert.strictEqual(mapped[0], 'n=10')
      assert.strictEqual(mapped[1], 'a=15')
    })

    it('Should return empty Array for non-object values', () => {
      const mapFn = (v, k) => `${k}=${v}`
      notObjects.forEach(value => assert.deepStrictEqual(mapObject(value, mapFn), []))
      functions.forEach(value => assert.deepStrictEqual(mapObject(value, mapFn), []))
    })
  })
})
