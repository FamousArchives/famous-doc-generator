'use strict';

/**
 *  Shallow copy b into a.
 *  @method extend
 */
function extend (a, b) {
  for (var key in b) a[key] = b[key];
}

/**
 * Return new object with combination of a & b.
 * @method merge
 */
function merge (a, b) {
  var obj = {};
  extend(obj, a);
  extend(obj, b);
  return obj;
}

module.exports = {
  extend: extend,
  merge: merge
};
