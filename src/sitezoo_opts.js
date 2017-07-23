const castas = require('castas');

module.exports = (opt = {}) => {
  let finopt = {};

  finopt.urls  = castas.arr(opt.urls, []);
  finopt.delay = castas.num(opt.delay, 20);
  finopt.preventurl = opt.preventurl || (url => false);
  finopt.preventurlrequest = opt.preventurlrequest || (url => false);
  
  return finopt;
};
  


