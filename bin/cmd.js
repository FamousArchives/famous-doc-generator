#!/usr/bin/env node
/*eslint no-process-exit:0*/
'use strict';
var argv = require('minimist')(process.argv.slice(2));
var docGenerator = require('../lib');
var filters = require('../lib/filters');
var path = require('path');

if (argv._.indexOf('help') > 0 || argv.h == true || argv.help == true || (argv._.length == 0 && Object.keys(argv).length == 1)) {
  console.log('Famous Documentation Generator');
  console.log('----------------');
  console.log('Possible options');
  console.log('----------------');
  console.log('--base=[path] The directory to start searching from');
  console.log('--out=[path] The directory where the compiled templates will write to.');
  console.log('--ignore=[paths **OPTIONAL**] Add a directory nested underneath the base directory to ignore.');
  console.log('--outData=[path **OPTIONAL**] Path where the json data will be saved. Useful to debug templates');
  process.exit(0);
}

var opts = {
  baseDirectory: path.join(process.cwd(), argv.base),
  templates: [
    {
      baseTemplate: path.join(__dirname, '../templates/doc.jade'),
      outDirectory: path.join(process.cwd(), argv.out)
    }
  ],
  filters: filters 
}

if (argv.outData) { 
  opts.outData = argv.outData;
}

if (argv.ignore) {
  if (!(argv.ignore instanceof Array)) {
    opts.ignoreDirectories = [argv.ignore];
  }
  else {
    opts.ignoreDirectories = argv.ignore;
  }
} else opts.ignoreDirectories = [];
opts.ignoreDirectories.push('.git');


docGenerator(opts, function () {
  console.log('documentation is generated.');
})
