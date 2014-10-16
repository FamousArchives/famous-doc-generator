/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/*eslint dot-notation: 1 */
'use strict';

var fs = require('fs');
var async = require('async');
var path = require('path');
var mkdirp = require('mkdirp');
var jade = require('jade');
var helpers = require('./objectHelpers');

/*
 *  Register Jade filters
 */
function registerFilters(filters) {
  for (var filter in filters) {
    jade.filters[filter] = filters[filter];
  }
}

/*
 * Read the template
 */
function readTemplate(templatePath, cb) {
  console.log('reading template', templatePath);
  fs.readFile(templatePath, function (err, data) {
    if (err) { cb(err); }
    cb(null, data);
  });
}

/*
 *  Read and compile a template, reinserting it into options.
 */
function buildTemplate(options, key, cb) {
  if (options[key]) {
    readTemplate(options[key], function (err, data) {
      if (err) { cb(err); }
      options[key] = jade.compile(data.toString())(options);
      cb();
    });
  }
  else { cb(); }
}

/*
 *  Read and compile the footer template, reinserting it into options.
 */
function buildFooterTemplate(options, cb) {
  buildTemplate(options, 'footerTemplate', cb);
}

/*
 *  Read and compile the header template, reinserting it into options.
 */
function buildHeaderTemplate(options, cb) {
  buildTemplate(options, 'headerTemplate', cb);
}

/*
 *  Build the documentaiton folder.
 */
function buildDocFolder(outDirectory, cb) {
  console.log('building folder');
  mkdirp(outDirectory, function (err) {
    cb(err);
  });
}

/*
 * Compile all of the templates
 */
function compileTemplates(baseDirectory, baseTemplate, options, json, tmpl, cb) {
  var template = jade.compile(tmpl.toString(), {
    pretty: true,
    filename: baseTemplate
  });
  var outData = [];
  var parsedClasses = json['classNavigation'];
  for (var key in json['classes']) {
    var data = helpers.merge(options.filters, json['classes'][key]);
    data = helpers.merge({classes: parsedClasses}, data);

    // header footer, compiled as html strings
    data.header = options.headerTemplate;
    data.footer = options.footerTemplate;
    if (!data.pathPrefix) {
      data.pathPrefix = path.relative(path.dirname(data.file), baseDirectory) + '/';
      if (data.pathPrefix === '') {
        data.pathPrefix = '.';
      }
    }
    outData.push({
      html: template(data),
      name: data.path
    });
  }
  cb(null, outData);
}

/*
 *  Write all of the templates to disk.
 */
function writeTemplates(outDirectory, toWrite, cb) {

  async.each(toWrite, function (template, innerCb) {
    var outPath = path.join(outDirectory, template.name + '.html');
    var outFolder = path.dirname(outPath);

    mkdirp(outFolder, function (outPath, html, innerCb) {
      fs.writeFile(outPath, html, innerCb);
    }.bind(null, outPath, template.html, innerCb));

  }, cb);
}

/*
 * Build all the templates!
 */
function buildTemplates(options, json, cb) {
  if (options.filters) { registerFilters(options.filters); }
  async.each(options.templates, function (template, nestedCb) {
    async.waterfall([
      buildHeaderTemplate.bind(null, options),
      buildFooterTemplate.bind(null, options),
      buildDocFolder.bind(null, template.outDirectory),
      readTemplate.bind(null, template.baseTemplate),
      compileTemplates.bind(null, options.baseDirectory, template.baseTemplate, options, json),
      writeTemplates.bind(null, template.outDirectory)
    ], nestedCb);
  }, cb);
}

module.exports = buildTemplates;
