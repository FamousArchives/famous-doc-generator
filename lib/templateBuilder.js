var fs = require('fs');
var async = require('async');
var path = require('path');
var mkdirp = require('mkdirp');
var jade = require('jade');
var helpers = require('./objectHelpers');

/*
 * Build all the templates!
 */
function buildTemplates (options, json, cb) {
  registerFilters(options);
  async.each(options.templates, function (template, nestedCb) {
    async.waterfall([
      buildDocFolder.bind(null, template.outDirectory),
      readTemplate.bind(null, template.baseTemplate),
      compileTemplates.bind(null, template.baseTemplate, options, json),
      writeTemplates.bind(null, options.baseDirectory, template.outDirectory)
    ], nestedCb);
  }, cb);
}

/*
 *  Register Jade filters
 */
function registerFilters (options) {
  if (options.filters) { 
    for (var filter in options.filters) { 
      jade.filters[filter] = options.filters[filter];
    }
  }
}

/*
 *  Build the documentaiton folder.
 */
function buildDocFolder (outDirectory, cb) {
  console.log('building folder');
  mkdirp(outDirectory, function (err) { 
    cb();
  });
}

/*
 * Read the template
 */
function readTemplate (templatePath, cb) {
  console.log('reading template', templatePath);
  fs.readFile(templatePath, function (err, data) {
    if (err) console.log(err);
    cb(null, data);
  });
}

/*
 * Compile all of the templates
 */
function compileTemplates (baseTemplate, options, json, tmpl, cb) {
  var template = jade.compile(tmpl.toString(), { 
    pretty: true,
    filename: baseTemplate
  });
  var outData = [];
  for (var key in json['classes']) { 
    var data = helpers.merge(options.filters, json['classes'][key]);
    var data = helpers.merge({classes: json['classes']}, data); // excessive.

    outData.push({
      html: template(data),
      file: json['classes'][key].file
    });
  }
  cb(null, outData);
}

/*
 *  Write all of the templates to disk.
 */
function writeTemplates( baseDirectory, outDirectory, toWrite, cb) {

  async.each(toWrite, function (template, innerCb) {
    var uniqueName = getUniqueDirectory(baseDirectory, template.file).split('.')[0];
    var outPath = path.join(outDirectory, uniqueName + '.html');
    var outFolder = outPath.substring(0, outPath.lastIndexOf('/'));

    mkdirp(outFolder, function (outPath, html, innerCb) {
      fs.writeFile(outPath, html, innerCb);
    }.bind(null, outPath, template.html, innerCb));

  }, cb);
}

function getUniqueDirectory ( sameDir, uniquePath ) {
  return uniquePath.split(sameDir)[1];
}

module.exports = buildTemplates;
