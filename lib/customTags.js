var YUI = require('yuidocjs');
var implodeString = function (str) {
  return str.replace(REGEX_GLOBAL_LINES, '!~YUIDOC_LINE~!');
};
var explodeString = function (str) {
  return str.replace(/!~YUIDOC_LINE~!/g, '\n');
};
var REGEX_GLOBAL_LINES = /\r\n|\n/g;
var REGEX_TYPE = /(.*?)\{(.*?)\}(.*)/;
var REGEX_CSSNAME = /([\w-_]+)/;
var trim = YUI.Lang.trim;
var fixType = YUI.Lang.fixType;

module.exports = { 
  /**
   *  Custom @css tags. 
   *    @example
   *      @css {tag} description 
   *
   *  Outputs an array of tags, with the following format: 
   *
   *  {
   *    name: formatted name without '.' or '#',
   *    tag: absolute tag, all content between {}'s
   *    description: description of css class use.
   *  }
   */
  'css': function (tagname, value, target, block) {
    if (!target.css) target.css = [];

    var desc = implodeString(trim(value));
    var match = REGEX_TYPE.exec(desc);
    var result = {};
    var tag;

    if (match) {
      tag = fixType(trim(match[2]));
      desc = trim(match[1] + match[3]);
    }
    result.description = YUI.unindent(explodeString(desc))
    if (tag) result.tag = tag;
    result.name = REGEX_CSSNAME.exec(tag)[1];

    target.css.push(result); 
  },
  'system': function (tagname, value, target, block) {
    target.is_system = 1;
  },
  'component': function (tagname, value, target, block) {
    target.is_component = 1;
  },
  'entity': function (tagname, value, target, block) {
    target.is_entity = 1;
  },
  'singleton': function (tagname, value, target, block) {
    target.is_singleton = 1;
  },
  'factory': function (tagname, value, target, block) {
    target.is_factory = 1;
  },
}
