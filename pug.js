'use strict';

var pug = require('pug');

module.exports = function (options) {
  return function (file) {
    pug.render(file.content, options, function (err, html) {
      if (err)
        console.error(err.toString());
      else
        console.log(html.trim());
    });
  };
}
