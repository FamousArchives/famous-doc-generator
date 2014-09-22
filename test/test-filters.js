/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict';
var test = require('tape');

var filters = require('../lib/filters');

test('Filters should export filter functions', function (t) {
  t.plan(4);
  t.ok(filters, 'Filters actually load!');
  t.ok(filters.highlight, 'Filters should have a method called highlight');
  t.ok(filters.highlightCSS, 'Filters should have a method called highlightCSS');
  t.ok(filters.highlightHTML, 'Filters should have a method called highlightHTML');
});
