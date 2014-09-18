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
