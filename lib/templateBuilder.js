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
      writeTemplates.bind(null, template.outDirectory)
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
    var data = helpers.merge({classes: json['classes']}, data);
    outData.push({
      path: key,
      data: template(data)
    });
  }
  cb(null, outData);
}

/*
 *  Write all of the templates to disk.
 */
function writeTemplates( outDirectory, toWrite, cb) {
  async.each(toWrite, function (template, cb) {
    var outPath = path.join(outDirectory, template.path + '.html');
    fs.writeFile(outPath, template.data, cb); 
  }, cb);
}

module.exports = buildTemplates;
