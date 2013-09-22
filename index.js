var Assertions = require("./lib/assertions")
var AssertionError = require("./lib/assertion_error")
module.exports = Must

/**
 * The main class that wraps the asserted object and that you call matchers on.
 * 
 * Most of the time you'll be using
 * [`Object.prototype.must`](#Object.prototype.must) to create this wrapper, but
 * occasionally you might want to assert `null`s or `undefined`s and in those
 * cases assigning `Must` to something like `expect` or `demand` works nicely.
 *
 * @example
 * true.must.be.true()
 * [].must.be.empty()
 *
 * var expect = require("must")
 * expect(null).be.null()
 *
 * var demand = require("must")
 * demand(undefined).be.undefined()
 *
 * @class Must
 * @constructor
 * @param actual
 */
function Must(actual) {
  if (!(this instanceof Must)) return new Must(actual)
  this.actual = actual
}

Must.prototype = Assertions

Object.defineProperty(Must.prototype, "constructor", {
  value: Must,
  writable: true,
  configurable: true
})

Must.AssertionError = AssertionError

Object.defineProperty(Object.prototype, "must", {
  get: function() { return new Must(unbox(this)) },

  set: function(value) {
    Object.defineProperty(this, "must", {
      value: value,
      configurable: true,
      enumrable: true,
      writable: true
    })
  },

  // Without configurable, can't redefine it when reloading this file, e.g.
  configurable: true
})

function unbox(obj) {
  // No need to worry about values from other contexts because they won't have
  // the global "must" property on their objects in the first place. And if
  // they did, their context would have its own unbox function with correct
  // references.
  return obj instanceof Boolean ||
         obj instanceof String ||
         obj instanceof Number  ? obj.valueOf() : obj
}
