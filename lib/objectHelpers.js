/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

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
