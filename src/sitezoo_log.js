
module.exports = (o => {
  
  o = (opts, msg) => 
    opts.issilent || console.log(msg);

  o.requesturl = (opts, url) =>
    o(opts, '[...] request: ' + url);

  o.finished = (opts) =>
    o(opts, '[...] finished.');  

  return o;
  
})({});
