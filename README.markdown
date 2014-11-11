#Famous-doc-generator


[![Build Status](https://travis-ci.org/FamousTools/famous-doc-generator.svg?branch=master)](https://travis-ci.org/FamousTools/famous-doc-generator) [![Dependency Status](https://david-dm.org/FamousTools/famous-doc-generator.svg)](https://david-dm.org/FamousTools/famous-doc-generator) [![devDependency Status](https://david-dm.org/FamousTools/famous-doc-generator/dev-status.svg)](https://david-dm.org/FamousTools/famous-doc-generator#info=devDependencies)


INSTALLATION
=================
```
npm install famous-doc-generator
```

or if you would like to install from source

```js
git clone git@github.com:Famous/famous-doc-generator.git
cd doc-generator
npm link
```


RUNNING
=================
```js
famous-doc-generator
  --base=[path] The directory to start searching from
  --out=[path] The directory where the compiled templates will write to.
  --ignore=[paths **OPTIONAL**] Add a directory nested underneath the base directory to ignore.
  --outData=[path **OPTIONAL**] Path where the json data will be saved. Useful to debug templates
  --pathPrefix=[path **OPTIONAL**] All asset pathing will get this prefix.
  --headerTemplate=[path **OPTIONAL**] Header partial to include.
  --footerTemplate=[path **OPTIONAL**] Footer partial to include.
  --template=[path **OPTIONAL**] Path to a complete custom template. This template will be run against every file found.
  --markdown [**OPTIONAL**] Output markdown instead of html.
  --createIndex [**OPTIONAL**] Create an index.html file in the root of the output directory.
  --createPartials [**OPTIONAL**] Compile html partials to the output directory. Usefull for consumption by another templating system.
```

Ignoring multiple directories

```shell
famous-doc-generator --base=./lib --ignore=./lib/famous --ignore=./lib/famous/core
```


FAQ
===============
Q. My file isn't showing up in the documentation!
A. 
YUIDoc is very picky about what it chooses to parse as comments. Make sure that your comments start with
```js
/**
 *
 *
 */
```

Note the double ** before every comment.

LICENSE
===============
This Source Code Form is subject to the terms of the Mozilla Public
License, v. 2.0. If a copy of the MPL was not distributed with this
file, You can obtain one at http://mozilla.org/MPL/2.0/.
