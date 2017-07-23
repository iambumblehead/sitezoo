const immutable = require('immutable'),

      sitezoo_node = require('./sitezoo_node');

module.exports = (o => {

  o.get = () =>
    immutable.Map({});

  o.getnode = (graph, node) =>
    graph.get(node.get('uid'));

  o.getnoderoot = (graph) => 
    graph.find((val, key) => (
      val.get('inarr').count() === 0));

  o.setnode = (graph, node, pnode, refname) => {
    var uid = node.get('uid'),
        graph_final = graph.has(uid) ? graph : graph.set(uid, node);    

    if (pnode && refname) {
      if (!graph.has(pnode.get('uid'))) {
        throw new Error('pnode not found');
      }

      return o.setnodeedge(graph_final, node, pnode, refname);
    }

    return graph_final;
  };

  o.setnodeedge = (graph, innode, outnode, refname) => {
    let innodekey = innode.get('uid'),
        outnodekey = outnode.get('uid'),
        edge_outnode,
        edge_innode;

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

  o.asurllist = (graph) =>
    Object.values(graph.toJS()).map(v => v.url);
  
  return o;

})({});
