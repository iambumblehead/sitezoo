// Filename: sitezoo_opts.js  
// Timestamp: 2017.07.27-12:41:47 (last modified)
// Author(s): bumblehead <chris@bumblehead.com>

import castas from 'castas'

export default (opt = {}) => {
  const finopt = {};

  finopt.urls  = castas.arr(opt.urls, []);
  finopt.delay = castas.num(opt.delay, 20);
  finopt.preventurl = opt.preventurl || (url => false);
  finopt.preventurlrequest = opt.preventurlrequest || (url => false);
  finopt.onresponse = opt.onresponse ||
    ((node, httpres, urlstr, urls, fn) => fn(null, node));
  
  finopt.issilent = castas.bool(opt.issilent, false);

  return finopt;
};
  


