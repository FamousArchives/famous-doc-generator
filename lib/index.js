'use strict';

var fs = require('fs');
var templateBuilder = require('./templateBuilder');
var YUIRunner = require('./yuiRunner');
var YUISanitizer = require('./yuiSanitizer');
var copyCSS = require('./copyCSS');

/**
 *  Documentation Generator:
 *
 *  -validate the incoming options 
 *  -build YUI data
 *  -sanitize YUI data output
 *  -write data JSON if desired
 *  -build the templates.
 */
function init (options, cb) {
  validateOptions(options);
  YUIRunner(options, function (json) {
    YUISanitizer(json);
    if (options.outData) fs.writeFileSync(options.outData, JSON.stringify(json, null, 4));
    copyCSS(options);
    templateBuilder(options, json, cb);
  });
}

/**
 *  Validate the incoming options.
 */
function validateOptions (options) {
  function error (key) {
    var message = errors[key];
    if (options.grunt) options.grunt.fail.warn(message);
    else throw message;
  }

  var errors = { 
    templates     : 'At least one template is required.',
    baseDirectory : 'baseDirectory required. This is the directory to start searching from.',
    outDirectory  : 'outDirectory required. This is where the compiled templates will write to.',
    baseTemplate  : 'baseTemplate required. This is the main template that each file will be compiled with.'
  }
  
  if (!options.baseDirectory) error('baseDirectory');
  if (!options.templates || options.templates.length == 0) error('templates');
  for (var i = 0; i < options.templates.length; i++) {
    var opt = options.templates[i]
    if (!opt.outDirectory)  error('outDirectory');
    if (!opt.baseTemplate)  error('baseTemplate');
  };
}

module.exports = init;
