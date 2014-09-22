/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict';
var YUI = require('yuidocjs');
var findAllDirectories = require('./findDirectories');
var customTags = require('./customTags');
var path = require('path');

function sanitizeDirectories (options, files) {
  var safeFiles = [];
  var i;

  options.ignoreDirectories = options.ignoreDirectories || [];

  for (i = 0; i < options.ignoreDirectories.length; i++) {
    options.ignoreDirectories[i] = path.join(options.baseDirectory, options.ignoreDirectories[i]);
  }

  for (i = 0; i < files.length; i++) {
    if (options.ignoreDirectories) {
      if (options.ignoreDirectories.indexOf(files[i]) < 0) {
        safeFiles.push(files[i]);
      }
    }
    else { safeFiles[i] = files[i]; }
  }
  return safeFiles;
}

/*
 * Find all directories, pass it into YUI as paths.
 * Run the YUI doc parser, calling the callback with the json data.
 */
function runYUI (options, cb) {
  findAllDirectories(options.baseDirectory, function (err, files) {
    if (err) { return cb(err); }

    var opts = {
      paths: sanitizeDirectories(options, files),
      writeJSON: false,
      norecurse: true,
      quiet: false,
      digesters: customTags
    };
    return cb((new YUI.YUIDoc(opts)).run());
  });
}

module.exports = runYUI;
