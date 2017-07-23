// Filename: sitezoo.js  
// Timestamp: 2017.07.22-18:02:58 (last modified)
// Author(s): bumblehead <chris@bumblehead.com>

const sitezoo_build = require('./sitezoo_build'),
      sitezoo_opts = require('./sitezoo_opts'),
      sitezoo_log = require('./sitezoo_log');

module.exports = (o => {

  o = (opts, fn) =>
    sitezoo_build(opts, fn);

  o.build = sitezoo_build;
  o.opts = sitezoo_opts;
  o.log = sitezoo_log;
  
  return o;

})({});
