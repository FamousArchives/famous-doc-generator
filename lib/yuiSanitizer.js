/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/*eslint dot-notation: 1 */
'use strict';

/*
 *  Recursively search the object for objects with the specified parameter, calling
 *  the passed along function when found. Used to iterate through all of the output data
 *  and remove random newlines or tabs in descriptions.
 */
function deepSearchObjectOrArrayFor ( param, obj, fn ) {
  if (!obj) { return; }
  if (obj[param]) {
    fn(obj, param);
  }
  if (typeof obj === 'object') { // intentionally both arrays & objects
    for (var key in obj) {
      deepSearchObjectOrArrayFor(param, obj[key], fn);
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
 * Helper function, return unique directory, given two strings with a similar
 * base path.
 */
function getUniqueDirectory(sameDir, uniquePath) {
  return uniquePath.split(sameDir)[1];
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
function parseClassNavigation (options, json) {
  var classNames = {};
  for (var key in json['classes']) {
    var name = getUniqueDirectory(options.baseDirectory, json['classes'][key].file).split('.')[0];
    var moduleName = name.substring(0, name.lastIndexOf('/'));
    if (!classNames[moduleName]) { classNames[moduleName] = []; }

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
    };
  }
  json['classNavigation'] = sortedArray;
}

function annotatePaths (options, json) {
  for (var key in json['classes']) {
    var uniqueName = getUniqueDirectory(options.baseDirectory, json['classes'][key].file).split('.')[0];
    json['classes'][key].path = uniqueName;
    json['classes'][key].pathPrefix = options.pathPrefix;
  }
}

module.exports = function (options, json) {
  sanitizeDescriptions(json);
  reorganizeClassitems(json);
  parseClassNavigation(options, json);
  annotatePaths(options, json);
};
