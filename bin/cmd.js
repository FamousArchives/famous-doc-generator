#!/usr/bin/env node

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/*eslint no-process-exit:0*/
'use strict';
var argv = require('minimist')(process.argv.slice(2));
var docGenerator = require('../lib');
var filters = require('../lib/filters');
var path = require('path');

if (argv._.indexOf('help') > 0 || argv.h === true || argv.help === true || (argv._.length === 0 && Object.keys(argv).length === 1)) {
  console.log('Famous Documentation Generator');
  console.log('----------------');
  console.log('Possible options');
  console.log('----------------');
  console.log('--base=[path] The directory to start searching from');
  console.log('--out=[path] The directory where the compiled templates will write to.');
  console.log('--ignore=[paths **OPTIONAL**] Add a directory nested underneath the base directory to ignore.');
  console.log('--outData=[path **OPTIONAL**] Path where the json data will be saved. Useful to debug templates');
  console.log('--pathPrefix=[path **OPTIONAL**] All asset pathing will get this prefix.');
  console.log('--template=[path **OPTIONAL**] Path to a complete custom template. This template will be run against every file found.');
  console.log('--headerTemplate=[path **OPTIONAL**] Header partial to include.');
  console.log('--footerTemplate=[path **OPTIONAL**] Footer partial to include.');
  console.log('--markdown [**OPTIONAL**] Output markdown instead of html.');
  console.log('--createIndex [**OPTIONAL**] Create an index.html file in the root of the output directory.');
  console.log('--createPartials [**OPTIONAL**] Compile html partials to the output directory. Usefull for consumption by another templating system.');
  process.exit(0);
}

var opts = {
  baseDirectory: path.join(process.cwd(), argv.base.replace(/\/$/g, '')),
  outPath: path.join(process.cwd(), argv.out.replace(/\/$/g, '')),
  templates: [
    {
      baseTemplate: argv.template ?
          path.join(process.cwd(), argv.template) :
          path.join(__dirname, '../templates/doc.jade'),
      outDirectory: path.join(process.cwd(), argv.out)
    }
  ],
  filters: filters,
  pathPrefix: ''
};

if (argv.outData) {
  opts.outData = argv.outData;
}

if (argv.pathPrefix) {
  opts.pathPrefix = argv.pathPrefix;
}

if (argv.headerTemplate) {
  opts.headerTemplate = path.join(process.cwd(), argv.headerTemplate);
}

if (argv.footerTemplate) {
  opts.footerTemplate = path.join(process.cwd(), argv.footerTemplate);
}

opts.markdown = argv.markdown;
opts.createIndex = !!argv.createIndex;
opts.createPartials = !!argv.createPartials;

if (argv.ignore) {
  if (!(argv.ignore instanceof Array)) {
    opts.ignoreDirectories = [argv.ignore];
  }
  else {
    opts.ignoreDirectories = argv.ignore;
  }
}
else {
  opts.ignoreDirectories = [];
}

opts.ignoreDirectories.push('.git');

docGenerator(opts, function () {
  console.log('documentation is generated.');
});
