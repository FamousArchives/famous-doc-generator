/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict';
var path = require('path');
var findit = require('findit');

/**
 *  Async. Find paths to all nested directories.
 *  @param basepath {String} path to start searching from
 *  @param callback {Function} callback(err, paths)
 */
module.exports = function findDirectories(basepath, callback) {
  var finder = findit(basepath);
  var list = [];

  finder.on('directory', function (dir, stat, stop) {
    var base = path.basename(dir);
    if (base === '.git' || base === 'node_modules') { return stop(); }
    else { list.push(dir); }
  });

  finder.on('end', function () {
    callback(null, list);
  });

  finder.on('error', function (err) {
    finder.stop();
    callback(err);
  });
};
