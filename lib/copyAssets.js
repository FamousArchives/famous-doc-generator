var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var wrench = require('wrench');
var after = require('./after');

module.exports = function (options, callback) {
  var templates = options.templates;
  var srcDir = path.join(__dirname, './assets');

  var afterCb = after(callback, templates.length)
  for (var i = 0; i < templates.length; i++) {
    var currentDir = templates[i].outDirectory;
    var outDir = templates[i].outDirectory;

    wrench.copyDirRecursive(srcDir, outDir, {
      forceDelete: false,
      preserveFiles: false
    }, afterCb);
  }
}
