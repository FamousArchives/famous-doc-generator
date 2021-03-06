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

var docBuilder = require('../lib');

var inPath = path.join(__dirname, 'fixtures');
var outPath = path.join(os.tmpdir(), 'famous-doc-generator', 'test-templateBuilder-html');
var markdownPath = path.join(os.tmpdir(), 'famous-doc-generator', 'test-templateBuilder-markdown');
var templatePath = path.join(__dirname, '../templates/doc.jade');

test('setup docBuilder', function (t) {
  t.plan(2);
  mkdirp.sync(outPath);
  mkdirp.sync(markdownPath);
  fs.exists(outPath, function (exists) {
    t.ok(exists, 'The output html folder should have been created in $TMPDIR');
  });
  fs.exists(markdownPath, function (exists) {
    t.ok(exists, 'The output markdown folder should have been created in $TMPDIR');
  });
});

test('Make sure docBuilder loads', function (t) {
  t.ok(docBuilder, 'docBuilder should exist after being required');
  t.end();
});

test('Make sure docBuilder actually builds docs', function (t) {
  t.plan(4);
  var options = {
    baseDirectory: inPath,
    outPath: outPath,
    templates: [{
      outDirectory: outPath,
      baseTemplate: templatePath
    }]
  };
  docBuilder(options, function (err) {
    t.notok(err, 'docBuilder should run without an error');
    var dir = fs.readdirSync(outPath);
    var physicsDir = fs.readdirSync(path.join(outPath, 'physics'));
    var integratorsDir = fs.readdirSync(path.join(outPath, 'physics', 'integrators'));
    t.deepEqual(dir, [ 'Entity.html', 'css', 'images', 'js', 'physics'], 'We should have the expected output stat from the main build directory');
    t.deepEqual(physicsDir, [ 'PhysicsEngine.html', 'integrators'], 'We should have the expected output stat from the physics build directory');
    t.deepEqual(integratorsDir, [ 'SymplecticEuler.html'], 'We should have the expected output stat from the physics build directory');
  });
});

test('Make sure docBuilder actually builds docs', function (t) {
  t.plan(2);
  var options = {
    baseDirectory: inPath,
    outPath: markdownPath,
    markdown: true,
    templates: [{
      outDirectory: outPath,
      baseTemplate: templatePath
    }]
  };
  docBuilder(options, function (err) {
    t.notok(err, 'docBuilder should run without an error');
    var dir = fs.readdirSync(markdownPath);
    t.deepEqual(dir, ['Entity.md', 'physics'], 'We should have the expected output stat from the markdown build directory');
  });
});

test('teardown docBuilder', function (t) {
  t.plan(2);
  rimraf.sync(outPath);
  rimraf.sync(markdownPath);
  fs.exists(outPath, function (exists) {
    t.notok(exists, 'The output html folder should have been destroyed');
  });
  fs.exists(markdownPath, function (exists) {
    t.notok(exists, 'The output markdown folder should have been destroyed');
  });
});
