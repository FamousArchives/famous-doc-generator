'use strict';
// var fs = require('fs');
var path = require('path');
// var mkdirp = require('mkdirp');
var ncp = require('ncp').ncp;
var after = require('./after');

module.exports = function (options, callback) {
  var templates = options.templates;
  var srcDir = path.join(__dirname, './assets');

  var cb = function (err) {
    if (err) { console.log(err); }
    after(callback, templates.length);
  };

  for (var i = 0; i < templates.length; i++) {
    // var currentDir = templates[i].outDirectory;
    var outDir = templates[i].outDirectory;

    ncp(srcDir, outDir, cb);
  }
};
