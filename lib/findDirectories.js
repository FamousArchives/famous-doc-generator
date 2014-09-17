'use strict';
var fs = require('fs');
var path = require('path');

/**
 *  Async. Find paths to all nested directories.
 *  @param basepath {String} path to start searching from
 *  @param callback {Function} callback(err, paths)
 */
module.exports = function findDirectories(basepath, callback) {
  var list = [];
  fs.readdir(basepath, function (err, files) {
    if (err) { return callback(err, list); }
    var pending = files.length;
    if (!pending) { return callback(null, list); }
    files.forEach(function (file) {
      fs.stat(path.join(basepath, file), function (err, stats) {
        if (err) { return callback(err, list); }
        if (stats.isDirectory() && file !== '.git' && file !== 'node_modules') {
          list.push(path.join(basepath, file));
          files = findDirectories(path.join(basepath, file), function (err, res) {
            if (err) { return callback(err); }
            list = list.concat(res);
            pending -= 1;
            if (!pending) { return callback(null, list); }
          });
        }
        else {
          pending -= 1;
          if (!pending) { return callback(null, list); }
        }
      });
    });
  });
};
