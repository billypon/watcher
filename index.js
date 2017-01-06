#!/usr/bin/env node

var colors = require('colors'),
    fs = require('fs'),
    path = require('path');

var args = require('minimist')(process.argv.slice(2)),
    types = {
      '.styl': './stylus'
    };

if (args.v) {
  var package = fs.readFileSync(__dirname + '/package.json', 'utf8'), json = JSON.parse(package);
  console.log(json.version);
  process.exit();
}

var filename = args._[0], extname = path.extname(filename), error;
if (!filename) {
  error = 'file is missing';
} else if (!fs.existsSync(filename)) {
  error = 'invalid file';
} else if (!fs.statSync(filename).isFile()) {
  error = 'path must be file';
} else if (!types[extname]) {
  error = 'unsupported file type';
}
if (error) {
  console.log(error + (filename ? ':' : ''), filename ? filename : '');
  process.exit(1);
}

if (args.p) {
  process.chdir(path.dirname(filename));
  filename = path.basename(filename);
}

var typeHandler = require(types[extname]);
function compile() {
  str = fs.readFileSync(filename, 'utf8');
  typeHandler(str, filename);
}

if (args.c) {
  compile();
}

function handler() {
  console.log('file is changed!'.cyan);
  compile();
}

console.log('start watching:', filename.green)

var timeout;
fs.watch(filename, function (eventType) {
  if (eventType !== 'change')
    return;
  clearTimeout(timeout);
  timeout = setTimeout(handler, 10);
});
