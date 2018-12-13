const stylus = require('stylus');
const lodash = require('lodash');

module.exports = function (options) {
  options = lodash.extend({}, options);
  return function (file) {
    options.filename = file.fullname;
    stylus.render(file.content, options, function (err, css) {
      if (err)
        console.error(err.toString());
      else
        console.log(css);
    });
  };
}
