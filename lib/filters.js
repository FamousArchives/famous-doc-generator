var highlighter = require('highlight.js');

module.exports = { 
  highlight: function (block) {
    return highlighter.highlight('javascript', block).value;
  },
  highlightCSS: function (block) {
    return highlighter.highlight('css', block).value;
  },
  highlightHTML: function (block) {
    return highlighter.highlight('html', block).value;
  }
}
