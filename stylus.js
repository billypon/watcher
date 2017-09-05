'use strict';

var stylus = require('stylus');

module.exports = function (options) {
  return function (file) {
    stylus(file.content)
      .set('filename', file.fullname)
      .set('include css', options['include-css'])
      .render(function (err, css) {
        if (err)
          console.error(err.toString());
        else
          console.log(css);
      });
  };
}
