'use strict';
var path = require('path');
var fs = require('fs');

var test = require('tape');
var rimraf = require('rimraf');
var mkdirp = require('mkdirp');

var docBuilder = require('../lib');

var inPath = path.join(__dirname, 'fixtures');
var outPath = path.join(process.env.TMPDIR || __dirname, 'famous-doc-generator', 'test-templateBuilder');
var templatePath = path.join(__dirname, '../templates/doc.jade');

test('setup docBuilder', function (t) {
  t.plan(1);
  mkdirp.sync(outPath);
  fs.exists(outPath, function (exists) {
    t.ok(exists, 'The output path folder should have been created in $TMPDIR');
  });
});

test('Make sure docBuilder loads', function (t) {
  t.ok(docBuilder, 'docBuilder should exist after being required');
  t.end();
});

test('Make sure docBuilder actually builds docs', function (t) {
  t.plan(2);
  var options = {
    baseDirectory: inPath,
    templates: [{
      outDirectory: outPath,
      baseTemplate: templatePath
    }]
  };
  docBuilder(options, function (err) {
    t.notok(err, 'docBuilder should run without an error');
    var dir = fs.readdirSync(outPath);
    t.deepEqual(dir, [ 'Entity.html', 'css', 'images' ], 'We should have the expected output stat from the build directory');
  });
});

test('teardown docBuilder', function (t) {
  t.plan(1);
  rimraf.sync(outPath);
  fs.exists(outPath, function (exists) {
    t.notok(exists, 'The output path folder should have been destroyed');
  });
});
