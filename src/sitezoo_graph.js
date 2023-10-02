import immutable from 'immutable'

import sitezoo_node from './sitezoo_node.js'

const get = () => (
  immutable.Map({}))

const getnode = (graph, node) => (
  graph.get(node.get('uid')))

const getnoderoot = (graph) => (
  graph.find((val, key) => (
    val.get('inarr').count() === 0)))

const setnode = (graph, node, pnode, refname) => {
  const uid = node.get('uid')
  const graph_final = graph.has(uid) ? graph : graph.set(uid, node)

  if (pnode && refname) {
    if (!graph.has(pnode.get('uid'))) {
      throw new Error('pnode not found');
    }

    return setnodeedge(graph_final, node, pnode, refname);
  }

  return graph_final;
}

const setnodeedge = (graph, innode, outnode, refname) => {
  let innodekey = innode.get('uid'),
      outnodekey = outnode.get('uid')

  if (graph.has(outnodekey) &&
      graph.has(innodekey)) {

    graph = graph
      .set(outnodekey, sitezoo_node.setedgein(
        graph.get(outnodekey), innodekey, refname));
    graph = graph
      .set(innodekey, sitezoo_node.setedgeout(
        graph.get(innodekey), outnodekey, refname));
  } else {
    console.error(graph.toJS());
    throw new Error('[!!!] edge node not found in graph: ' + (
      graph.has(outnodekey)
        ? innodekey
        : outnodekey
    ));
  }
  
  return graph;
};  

const asurllist = graph => (
  Object.values(graph.toJS()).map(v => v.url));

export default {
  get,
  getnode,
  getnoderoot,
  setnode,
  setnodeedge,
  asurllist
}
