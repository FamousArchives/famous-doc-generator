'use strict';
var path = require('path');
var fs = require('fs');

var test = require('tape');
var rimraf = require('rimraf');
var mkdirp = require('mkdirp');

var copyAssets = require('../lib/copyAssets');

var outPath = path.join(process.env.TMPDIR, 'famous-doc-generator', 'test-copyAssets');
var inPath = path.join(__dirname, '../templates/doc.jade');
var assetsPath = path.join(__dirname, '../lib/assets');

test('setup', function (t) {
  t.plan(1);
  mkdirp.sync(outPath);
  fs.exists(outPath, function (exists) {
    t.ok(exists, 'The output path folder should have been created in $TMPDIR');
  });
});

test('Make sure it loads', function (t) {
  t.ok(copyAssets, 'copyAssets should exist after being required');
  t.end();
});

test('Make sure copyAssets actually copies those assets', function (t) {
  t.plan(2);
  var options = {
    templates: [{
      baseTemplate: inPath,
      outDirectory: outPath
    }]
  };
  copyAssets(options, function (err) {
    t.notok(err, 'copyAssets should work without returning an error');
    t.deepEqual(fs.readdirSync(assetsPath), fs.readdirSync(outPath), 'Both directories should have the same content in them');
  });
});

test('teardown', function (t) {
  t.plan(1);
  rimraf.sync(outPath);
  fs.exists(outPath, function (exists) {
    t.notok(exists, 'The output path folder should have been destroyed');
  });
});
