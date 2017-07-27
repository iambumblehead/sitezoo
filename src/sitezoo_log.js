// Filename: sitezoo_log.js  
// Timestamp: 2017.07.27-13:05:49 (last modified)
// Author(s): bumblehead <chris@bumblehead.com>  

module.exports = (o => {
  
  o = (opts, msg) => 
    opts.issilent || console.log(msg);

  o.stringify = obj =>
    (/string|boolean|number/.test(typeof obj)
     ? obj : JSON.stringify(obj, null, '  '));  

  o.requesturl = (opts, url) =>
    o(opts, '[...] request: ' + url);

  o.finished = (opts) =>
    o(opts, '[...] finished.');

  o.error = (opts, err) => {
    let msg = '[!!!] error, opts: “:opts”'
          .replace(/:opts/, o.stringify(opts));
    
    console.error(msg);

    throw new Error(err);
  };

  return o;
  
})({});
