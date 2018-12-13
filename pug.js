'use strict';

var pug = require('pug');

module.exports = function (options, filename) {
  options = options || {};
  options.filename = filename;
  options.pretty = true;
  options.doctype = 'html';
  return function (file) {
    pug.render(file.content, options, function (err, html) {
      if (err)
        console.error(err.toString());
      else
        console.log(html.trim());
    });
  };
}
