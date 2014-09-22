/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict';
var highlighter = require('highlight.js');

module.exports = {
  highlight: function (block) {
    return highlighter.highlight('javascript', block).value;
  },
  highlightCSS: function (block) {
    return highlighter.highlight('css', block).value;
  },
  highlightHTML: function (block) {
    return highlighter.highlight('html', block).value;
  }
};
