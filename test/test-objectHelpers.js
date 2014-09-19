'use strict';
var test = require('tape');

var objectHelpers = require('../lib/objectHelpers');

test('objectHelpers should work when required', function (t) {
  t.plan(1);
  t.ok(objectHelpers, 'the returned value should exist');
});

test('objectHelpers.extend should shallow copy b into a', function (t) {
  t.plan(2);
  var a = {
    foo: 'foo'
  };

  var b = {
    bar: 'bar'
  };
  objectHelpers.extend(a, b);
  t.deepEqual(a, {
    foo: 'foo',
    bar: 'bar'
  }, 'a should have all of the shallow values from b');
  t.deepEqual(b, {
    bar: 'bar'
  }, 'b should remain unchanged');
});

test('objectHelpers.merge should shallow copy a and b into a new object', function (t) {
  t.plan(3);
  var a = {
    foo: 'foo'
  };

  var b = {
    bar: 'bar'
  };

  var c = objectHelpers.merge(a, b);

  t.deepEqual(c, {
    foo: 'foo',
    bar: 'bar'
  }, 'c should have all of the shallow values from a and b');
  t.deepEqual(a, {
    foo: 'foo'
  }, 'a should remain unchanged');
  t.deepEqual(b, {
    bar: 'bar'
  }, 'b should remain unchanged');
});
