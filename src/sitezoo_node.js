const immutable = require('immutable'),

      sitezoo_edge = require('./sitezoo_edge');

module.exports = (o => {
  
  // 'in'  are dependents
  // 'out' are dependencies
  //
  // nodes with 'in' degree of 0 are tree root nodes
  o.get = (url) =>
    immutable.Map({
      url   : url,
      uid   : url,
      inarr : immutable.List(),
      outarr: immutable.List()
    });

  o.setedge = (node, uid, refname, edgename) => {
    var edge = sitezoo_edge.get(refname, uid);

    return node.set(edgename, node.get(edgename).filter((inedge) => (
      sitezoo_edge.issamenot(edge, inedge)
    )).push(edge));
  };
  
  o.setedgein = (node, uid, refname) => 
    o.setedge(node, uid, refname, 'inarr');

  o.setedgeout = (node, uid, refname) =>
    o.setedge(node, uid, refname, 'outarr');
  

  return o;

})({});
