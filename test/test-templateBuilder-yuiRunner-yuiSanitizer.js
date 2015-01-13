/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict';
var path = require('path');
var fs = require('fs');
var os = require('os');

var test = require('tape');
var rimraf = require('rimraf');
var mkdirp = require('mkdirp');

var templateBuilder = require('../lib/templateBuilder');
var yuiRunner = require('../lib/yuiRunner');
var yuiSanitizer = require('../lib/yuiSanitizer');

var inPath = path.join(__dirname, 'fixtures');
var outPath = path.join(os.tmpdir(), 'famous-doc-generator', 'test-templateBuilder');
var templatePath = path.join(__dirname, '../templates/doc.jade');

test('setup templateBuilder / yuiSanitizer / yuiRunner', function (t) {
  t.plan(1);
  mkdirp.sync(outPath);
  fs.exists(outPath, function (exists) {
    t.ok(exists, 'The output path folder should have been created in $TMPDIR');
  });
});

test('Make sure templateBuilder actually builds templates', function (t) {
  t.plan(4);
  var options = {
    baseDirectory: inPath,
    templates: [{
      outDirectory: outPath,
      baseTemplate: templatePath
    }]
  };
  yuiRunner(options, function (json) {
    t.equal(typeof json, 'object', 'yuiRunner should return a valid object');
    yuiSanitizer(options, json);
    t.equal(typeof json, 'object', 'yuiSanitizer should return a valid object');

    templateBuilder(options, json, function (err) {
      t.notok(err, 'templateBuilder should finish without an error');
      var dirs = fs.readdirSync(outPath);
      t.deepEqual(dirs, ['Entity.html', 'physics'], 'templateBuilder should create an Entity.html file');
    });
  });
});

test('teardown templateBuilder / yuiSanitizer / yuiRunner', function (t) {
  t.plan(1);
  rimraf.sync(outPath);
  fs.exists(outPath, function (exists) {
    t.notok(exists, 'The output path folder should have been destroyed');
  });
});

test('Make sure templateBuilder creates an index.html page', function (t) {
  t.plan(4);
  var options = {
    baseDirectory: inPath,
    templates: [{
      outDirectory: outPath,
      baseTemplate: templatePath
    }],
    createIndex: true
  };
  yuiRunner(options, function (json) {
    t.equal(typeof json, 'object', 'yuiRunner should return a valid object');
    yuiSanitizer(options, json);
    t.equal(typeof json, 'object', 'yuiSanitizer should return a valid object');

    templateBuilder(options, json, function (err) {
      t.notok(err, 'templateBuilder should finish without an error');
      var dirs = fs.readdirSync(outPath);
      t.deepEqual(dirs, ['Entity.html', 'index.html', 'physics'], 'templateBuilder should create an index.html file');
    });
  });
});

test('teardown templateBuilder / yuiSanitizer / yuiRunner', function (t) {
  t.plan(1);
  rimraf.sync(outPath);
  fs.exists(outPath, function (exists) {
    t.notok(exists, 'The output path folder should have been destroyed');
  });
});

test('Make sure templateBuilder creates HTML partials', function (t) {
  t.plan(5);
  var options = {
    baseDirectory: inPath,
    templates: [{
      outDirectory: outPath,
      baseTemplate: templatePath
    }],
    createPartials: true
  };
  yuiRunner(options, function (json) {
    t.equal(typeof json, 'object', 'yuiRunner should return a valid object');
    yuiSanitizer(options, json);
    t.equal(typeof json, 'object', 'yuiSanitizer should return a valid object');

    templateBuilder(options, json, function (err) {
      t.notok(err, 'templateBuilder should finish without an error');
      var dirs = fs.readdirSync(outPath);
      t.deepEqual(dirs, ['Entity.part', 'physics'], 'templateBuilder should create an Entity.part file');
      var fixture = fs.readFileSync(path.join(inPath, 'Entity.part'), {encoding: 'utf8'});
      var output = fs.readFileSync(path.join(outPath, 'Entity.part'), {encoding: 'utf8'});
      t.equal(output, fixture, 'Entity.part should be a HTML partial');
    });
  });
});

test('teardown templateBuilder / yuiSanitizer / yuiRunner', function (t) {
  t.plan(1);
  rimraf.sync(outPath);
  fs.exists(outPath, function (exists) {
    t.notok(exists, 'The output path folder should have been destroyed');
  });
});
