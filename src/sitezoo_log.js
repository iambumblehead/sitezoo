// Filename: sitezoo_log.js  
// Timestamp: 2017.07.27-13:05:49 (last modified)
// Author(s): bumblehead <chris@bumblehead.com>  

const log = (opts, msg) => (
  opts.issilent || console.log(msg))

const stringify = obj => (
  (/string|boolean|number/.test(typeof obj)
   ? obj : JSON.stringify(obj, null, '  ')))

const requesturl = (opts, url) => (
  log(opts, '[...] request: ' + url))

const finished = (opts) => (
  log(opts, '[...] finished.'))

const error = (opts, err) => {
  const msg = '[!!!] error, opts: “:opts”'
    .replace(/:opts/, stringify(opts));
    
  console.error(msg);

  throw new Error(err);
};

export default Object.assign(log, {
  stringify,
  requesturl,
  finished,
  error
})
