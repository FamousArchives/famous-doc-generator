/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict';

var fs = require('fs');
var templateBuilder = require('./templateBuilder');
var yuiRunner = require('./yuiRunner');
var yuiSanitizer = require('./yuiSanitizer');
var copyAssets = require('./copyAssets');
var async = require('async');
var markdownRenderer = require('./markdownRenderer');
/**
 *  Validate the incoming options.
 */

function validateOptions(options) {
  var errors = {
    templates     : 'At least one template is required.',
    baseDirectory : 'baseDirectory required. This is the directory to start searching from.',
    outDirectory  : 'outDirectory required. This is where the compiled templates will write to.',
    baseTemplate  : 'baseTemplate required. This is the main template that each file will be compiled with.'
  };

  function error(key) {
    var message = errors[key];
    if (options.grunt) { options.grunt.fail.warn(message); }
    else { throw message; }
  }

  if (!options.baseDirectory) { error('baseDirectory'); }
  if (!options.templates || options.templates.length === 0) { error('templates'); }
  for (var i = 0; i < options.templates.length; i++) {
    var opt = options.templates[i];
    if (!opt.outDirectory)  { error('outDirectory'); }
    if (!opt.baseTemplate)  { error('baseTemplate'); }
  }
}

function render(options,json, cb) {
  if (options.markdown){
    return markdownRenderer(options, json, cb);
  }
  else {
    return templateBuilder(options, json, cb);
  }
}

/**
 *  Documentation Generator:
 *
 *  -validate the incoming options
 *  -build YUI data
 *  -sanitize YUI data output
 *  -write data JSON if desired
 *  -build the templates.
 */

function init(options, cb) {
  validateOptions(options);
  yuiRunner(options, function (json) {
    yuiSanitizer(options, json);
    if (options.outData) { fs.writeFileSync(options.outData, JSON.stringify(json, null, 4)); }
    async.parallel([
      copyAssets.bind(null, options),
      render.bind(null, options, json),
    ], function (err) {
      cb(err);
    });
  });
}

module.exports = init;
