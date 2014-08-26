
INSTALLATION
=================
```js
git clone git@github.com:FamousInternal/doc-generator.git
cd doc-generator
npm install -g
```


RUNNING
=================
```js
famousdocs 
  --base=[path] The directory to start searching from
  --out=[path] The directory where the compiled templates will write to.
  --ignore=[paths **OPTIONAL**] Add a directory nested underneath the base directory to ignore.
  --outData=[path **OPTIONAL**] Path where the json data will be saved. Useful to debug templates
  --pathPrefix=[path **OPTIONAL**] All asset pathing will get this prefix.
  --headerTemplate=[path **OPTIONAL**] Header partial to include.
  --footerTemplate=[path **OPTIONAL**] Footer partial to include.
```

Ignoring multiple directories
```
famousdocs --base=./lib --ignore=./lib/famous --ignore=./lib/famous/core

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
