import immutable from 'immutable'

import sitezoo_edge from './sitezoo_edge.js'

// module.exports = (o => {
  
// 'in'  are dependents
// 'out' are dependencies
//
// nodes with 'in' degree of 0 are tree root nodes
const get = url => immutable.Map({
  url   : url,
  uid   : url,
  inarr : immutable.List(),
  outarr: immutable.List()
});

const setedge = (node, uid, refname, edgename) => {
  var edge = sitezoo_edge.get(refname, uid);

  return node.set(edgename, node.get(edgename).filter((inedge) => (
    sitezoo_edge.issamenot(edge, inedge)
  )).push(edge));
};

const setedgein = (node, uid, refname) => (
  setedge(node, uid, refname, 'inarr'))

const setedgeout = (node, uid, refname) => (
  setedge(node, uid, refname, 'outarr'))

export default {
  get,
  setedge,
  setedgein,
  setedgeout
}
