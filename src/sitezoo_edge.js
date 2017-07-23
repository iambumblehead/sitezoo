const immutable = require('immutable');

module.exports = (o => {

  o.get = (refname, uid) =>
    immutable.Map({
      refname : refname,
      uid     : uid
    });
  
  o.issame = (edgea, edgeb) => 
    immutable.is(edgea, edgeb);

  o.issamenot = (edgea, edgeb) =>
    !o.issame(edgea, edgeb);
  
  return o;
  
})({});
