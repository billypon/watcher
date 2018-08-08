#!/usr/bin/env node

'use strict';

var colors = require('colors'),
    fs = require('fs'),
    minimist = require('minimist'),
    path = require('path');

var argv = minimist(process.argv.slice(2), { '--': true });

if (argv.h) {
  help();
}

if (argv.v) {
  version();
}

var modules = {
  '.styl': 'stylus',
  '.pug': 'pug',
  '.dot': 'graphviz'
};

if (argv.l) {
  list();
}

var filename = argv._[0],
    dirname = path.dirname(filename),
    basename = path.basename(filename),
    extname = path.extname(filename),
    compiler, error;
check();

if (argv.c) {
  process.chdir(path.dirname(filename));
  filename = path.basename(filename);
}

if (argv.i) {
  handler();
}

console.log('start watching:', filename.green)
var timeout;
fs.watch(filename, function (eventType, target) {
  if (eventType !== 'change')
    return;
  clearTimeout(timeout);
  timeout = setTimeout(function () {
    handler(target);
  }, 100);
});

function check() {
  if (!filename) {
    error = 'file is missing';
  } else if (!fs.existsSync(filename)) {
    error = 'invalid file';
  } else if (!fs.statSync(filename).isFile()) {
    error = 'path must be file';
  } else {
    var module = modules[extname];
    if (module) {
      compiler = require('./' + module)(minimist(argv['--']));
    } else {
      error = 'unsupported file type';
    }
  }
  if (error) {
    console.log(error + (filename ? ':' : ''), filename ? filename : '');
    process.exit(1);
  }
}

function handler(target) {
  if (target) {
    console.log('file is changed!'.cyan);
  }
  compiler({
    fullname: filename,
    dirname: dirname,
    filename: basename,
    basename: path.basename(basename, extname),
    extname: extname,
    content: fs.readFileSync(filename, 'utf8')
  });
}

function list() {
  for (var ext in modules) {
    console.log('*' + ext + '\t' + modules[ext][0]);
  }
  process.exit();
}

function help() {
  console.log([
    'Usage:',
    '  watcher filename [options]',
    '  watcher filename [options] -- [arguments]',
    '',
    'Options:',
    '  -c   Change dir to path of file',
    '  -h   Display help information',
    '  -i   Compile once immediately',
    '  -l   List compilers',
    '  -v   Display version',
    '',
    'Arguments: Compiler options'
  ].join('\n'));
  process.exit();
}

function version() {
  var json = JSON.parse(fs.readFileSync(__dirname + '/package.json', 'utf8'));
  console.log(json.version);
  process.exit();
}
