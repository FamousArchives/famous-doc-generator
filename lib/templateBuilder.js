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
      buildHeaderTemplate.bind(null, options),
      buildFooterTemplate.bind(null, options),
      buildDocFolder.bind(null, template.outDirectory),
      readTemplate.bind(null, template.baseTemplate),
      compileTemplates.bind(null, options.baseDirectory, template.baseTemplate, options, json),
      writeTemplates.bind(null, template.outDirectory)
    ], nestedCb);
  }, cb);
}

/*
 *  Read and compile the footer template, reinserting it into options.
 */
function buildFooterTemplate (options, cb) {
  buildTemplate(options, 'footerTemplate', cb);
}

/*
 *  Read and compile the header template, reinserting it into options.
 */
function buildHeaderTemplate (options, cb) {
  buildTemplate(options, 'headerTemplate', cb);
};

/*
 *  Read and compile a template, reinserting it into options.
 */
function buildTemplate (options, key, cb) {
  if (options[key]) {
    readTemplate(options[key], function (err, data) {
      options[key] = jade.compile(data.toString())(options);
      cb();
    });
  } else cb();
};

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
function compileTemplates (baseDirectory, baseTemplate, options, json, tmpl, cb) {
  var template = jade.compile(tmpl.toString(), { 
    pretty: true,
    filename: baseTemplate
  });
  var outData = [];
  var parsedClasses = parseClasses(json, baseDirectory);
  for (var key in json['classes']) { 
    var data = helpers.merge(options.filters, json['classes'][key]);
    data = helpers.merge({classes: parsedClasses}, data);
    var uniqueName = getUniqueDirectory(baseDirectory, json['classes'][key].file).split('.')[0];
    data.path = uniqueName;
    data.pathPrefix = options.pathPrefix;

    // header footer, compiled as html strings
    data.header = options.headerTemplate;
    data.footer = options.footerTemplate;

    outData.push({
      html: template(data),
      name: uniqueName
    });
  }
  cb(null, outData);
}

/*
 *  Return a sorted array of classes by folders, allowing a side navigation to exist.
 *  @example
 *  [
 *    {
 *      name: 'core', // folder/module name
 *      data: [
 *        {
 *          key: 'Engine', // individual classes names
 *          access: 'public'
 *        },
 *        {
 *          key: 'Context',
 *          access: 'private'
 *        }
 *      ]
 *    }
 *  ]
 */
function parseClasses (json, baseDirectory) {
  var classNames = {};
  for (var key in json['classes']) {
    var name = getUniqueDirectory(baseDirectory, json['classes'][key].file).split('.')[0];
    var moduleName = name.substring(0, name.lastIndexOf('/'));
    if (!classNames[moduleName]) classNames[moduleName] = [];

    classNames[moduleName].push({
      key: key,
      access: json['classes'][key].access,
      path: name
    });
  }

  var sortedKeys = Object.keys(classNames).sort();
  var sortedArray = [];
  for (var i = 0; i < sortedKeys.length; i++) {
    sortedArray[i] = {
      name: sortedKeys[i], 
      data: classNames[sortedKeys[i]]
    }
  };

  return sortedArray;
};

/*
 *  Write all of the templates to disk.
 */
function writeTemplates( outDirectory, toWrite, cb) {

  async.each(toWrite, function (template, innerCb) {
    var outPath = path.join(outDirectory, template.name + '.html');
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
