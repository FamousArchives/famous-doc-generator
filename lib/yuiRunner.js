var YUI = require('yuidocjs');
var findAllDirectories = require('./findDirectories');
var customTags = require('./customTags');

/*
 * Find all directories, pass it into YUI as paths. 
 * Run the YUI doc parser, calling the callback with the json data.
 */
function runYUI (options, cb) {
  findAllDirectories(options.baseDirectory, function (err, files) {
    console.log(err);
    files.push(options.baseDirectory);
    var opts = { 
      paths: files,
      writeJSON: false,
      quiet: false,
      digesters: customTags
    }
    cb((new YUI.YUIDoc(opts)).run());
  });
}

module.exports = runYUI;
