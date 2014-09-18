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
