/*eslint dot-notation: 1 */
'use strict';
// var YUI = require('yuidocjs');
// var path = require('path');
// var async = require('async');
// var fs = require('fs');
// var findAllDirectories = require('./findDirectories');
// var jade = require('jade');
// var customTags = require('./customTags');
// var helpers = require('./objectHelpers');
// var templateBuilder = require('./templateBuilder');

/*
 *  Recursively search the object for objects with the specified parameter, calling
 *  the passed along function when found. Used to iterate through all of the output data
 *  and remove random newlines or tabs in descriptions.
 */
function deepSearchObjectOrArrayFor ( param, obj, fn ) {
  if( !obj ) { return; }
  if( obj[param] ) {
    fn( obj, param );
  }
  if(typeof obj === 'object') { // intentionally both arrays & objects
    for( var key in obj ) {
      deepSearchObjectOrArrayFor( param, obj[key], fn );
    }
  }
}

/*
 * Remove new lines and extra tabs from a string.
 */
function removeExtraSpacesAndNewlines ( item ) {
  return item
    .replace(/\n/g, ' ')
    .replace(/[ \t]{2,}/g, ' ');
}

/*
 *  Reassigns the object at the param without the newlines
 */
function removeSpacesFrom ( obj, param ) {
  obj[param] = removeExtraSpacesAndNewlines( obj[param] );
}

/*
 *  Sanitize all Descriptions.
 */
function sanitizeDescriptions (json) {
  for (var key in json) {
    var contents = json[key];
      for( var content in contents ) {
        deepSearchObjectOrArrayFor( 'description', contents[content], removeSpacesFrom );
      }
  }
}

/*
 *  Find all the classitems that match a single file, allowing us to regroup them
 *  in the parent class.
 */
function findAllClassItems (json, array, fileName) {
  var classitems = json['classitems'];
  for (var i = 0; i < classitems.length; i++) {
    var item = classitems[i];
    if (fileName === item.file) {
      array.push(item);
    }
  }
  return array;
}

/*
 *  Very custom for Famo.us components. We can bucket events into three distinct types:
 *  Generic events, put in the `events` array.
 *  EventInput Events, put in the `eventInput` array, and
 *  EventOutput Events, put in the `eventOutput` array.
 */
function sepearateEventItems(parentObj) {
  var i;
  function removeFromArray (classitems, eventArray) {
    for (i = 0; i < eventArray.length; i++) {
      var index = classitems.indexOf(eventArray[i]);
      classitems.splice(index, 1);
    }
  }

  for (i = 0; i < parentObj.classitems.length; i++) {
    var method = parentObj.classitems[i];
    if (method.itemtype === 'event') {
      if (method.type === 'eventInput') {
        parentObj.eventInputs.push(method);
      }
      else if (method.type === 'eventOutput') {
        parentObj.eventOutputs.push(method);
      }
      else {
        parentObj.events.push(method);
      }
    }
  }

  removeFromArray(parentObj.classitems, parentObj.eventOutputs);
  removeFromArray(parentObj.classitems, parentObj.eventInputs);
  removeFromArray(parentObj.classitems, parentObj.events);
}

/*
 *  Combine all classitems into the class object.
 */
function reorganizeClassitems (json) {
   for (var klass in json['classes']) {
    var classInfo = json['classes'][klass];
    if (classInfo.file) {
      json['classes'][klass].classitems = findAllClassItems(json, [], classInfo.file);
      json['classes'][klass].events = [];
      json['classes'][klass].eventInputs = [];
      json['classes'][klass].eventOutputs = [];
      sepearateEventItems(json['classes'][klass]);
    }
  }
  delete json['classitems'];
}

module.exports = function (json) {
  sanitizeDescriptions(json);
  reorganizeClassitems(json);
};
