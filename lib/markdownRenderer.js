/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/*eslint dot-notation: 1 */

'use strict';
var _ = require('lodash');
var template = require('../templates/markdownOutput');
var async = require('async');
var path = require('path');
var fs = require('fs');
var mkdirp = require('mkdirp');

function writeMarkdown (outDirectory, output, cb) {
  async.each(output, function (template, innerCb) {
    var outPath = path.join(outDirectory, template.path + '.md');
    var outFolder = path.dirname(outPath);

    mkdirp(outFolder, function (outPath, markdown, innerCb) {
      fs.writeFile(outPath, markdown, innerCb);
    }.bind(null, outPath, template.markdown, innerCb));
  }, cb);
}

function compileMarkdown (outDirectory, json, cb) {
  var compiled = _.template(template);
  var outputMarkdown = [];
  for (var key in json['classes']) {
    var output = compiled(json['classes'][key]);
    outputMarkdown.push({
      markdown: output,
      path: json['classes'][key].path
    });
  }
  writeMarkdown(outDirectory, outputMarkdown, cb);
}

module.exports = function (options, json, cb) {
  if (!options.markdown) { return cb(); }
  compileMarkdown(options.outPath, json, cb);
};
