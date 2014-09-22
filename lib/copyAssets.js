/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict';
var path = require('path');
var async = require('async');
var ncp = require('ncp').ncp;

module.exports = function (options, callback) {
  var templates = options.templates;
  var srcDir = path.join(__dirname, './assets');

  async.each(templates, function (file, cb) {
    var outDir = file.outDirectory;
    ncp(srcDir, outDir, cb);
  }, function (err) {
    return callback(err);
  });
};
