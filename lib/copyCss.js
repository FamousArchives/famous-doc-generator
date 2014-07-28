var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');

module.exports = function (options) {
  var templates = options.templates;
  var readFile = fs.readFileSync(path.join(__dirname, './css/famous_styles.css'));
  for (var i = 0; i < templates.length; i++) {
    var currentDir = templates[i].outDirectory;

    mkdirp(path.join(templates[i].outDirectory, './css'), (function (currentDir, err) {
      fs.writeFileSync(path.join(currentDir, '/css/famous_styles.css'), readFile);
    }).bind(null, currentDir));

  };
}
