var stylus = require('stylus');

module.exports = function (str, filename) {
  stylus(str)
    .set('filename', filename)
    .render(function (err, css) {
      if (err)
        console.error(err.toString());
      else
        console.log(css);
    });
}
