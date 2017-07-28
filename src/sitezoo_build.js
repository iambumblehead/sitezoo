// Filename: sitezoo_build.js  
// Timestamp: 2017.07.27-13:02:21 (last modified)
// Author(s): bumblehead <chris@bumblehead.com>

const url = require('url'),
      superagent = require('superagent'),
      {DomUtils,DomHandler,Parser} = require("htmlparser2"),
      
      sitezoo_graph = require('./sitezoo_graph'),
      sitezoo_node = require('./sitezoo_node'),
      sitezoo_opts = require('./sitezoo_opts'),
      sitezoo_log = require('./sitezoo_log');

module.exports = (o => {

  o = (opts, fn) =>
    o.start(opts, fn);

  o.request = (urlstr, opts, fn) =>
    superagent.get(urlstr).end(fn);

  o.hostname = urlstr =>
    url.parse(urlstr).hostname;

  o.pathname = urlstr =>
    url.parse(urlstr).pathname;  
  
  o.striplink = urlstr =>
    urlstr.replace(/(#|\?).*/, '');

  o.normalisehref = (baseurl, href) =>
    o.hostname(href)
      ? url.resolve(o.hostname(href), o.pathname(href))
      : url.resolve(baseurl, href);

  o.isinternal = (baseurl, url) =>
    o.hostname(baseurl) === o.hostname(url);

  o.domparser = (htmlstr, fn) => {
    var parser = new Parser(new DomHandler(fn));
    parser.write(htmlstr);
    parser.end();
  };

  o.isprotocolweb = urlstr =>
    !/^(ftp|mailto|telnet|file|news):/.test(urlstr);

  // - remove hash and or params
  // - normalise path to provide full url
  o.normalisefilter = (opts, baseurl, linkarr) => linkarr
    .map(elem => o.normalisehref(baseurl, o.striplink(elem)))
    .filter(url => o.isinternal(baseurl, url) && !opts.preventurl(url));
  
  o.parselinks = (opts, htmlstr, baseurl, fn) => 
    o.domparser(htmlstr, (err, dom) => {
      if (err) return fn(err);

      fn(null, DomUtils
         .getElementsByTagName('a', dom, true)
         .reduce((accum, elem) => (
           DomUtils.hasAttrib(elem, 'href')
             && accum.push(DomUtils.getAttributeValue(elem, 'href')),
           accum), [])
         .filter(o.isprotocolweb));
    });

  o.addlinkednode = (opts, url, graph, fn, pkey) => {
    if (graph.has(url)) {
      graph = sitezoo_graph.setnode(
        graph, sitezoo_node.get(url), pkey && graph.get(pkey), url);
      
      return fn(null, graph, pkey);
    }
    
    sitezoo_log.requesturl(opts, url);
    
    o.request(url, opts, (err, res) => {
      if (err) return sitezoo_log.error(opts, err);

      graph = sitezoo_graph.setnode(
        graph, sitezoo_node.get(url), pkey && graph.get(pkey), url);
      
      o.parselinks(opts, res.text, url, (err, urls) => {
        if (err) return fn(err);

        urls = o.normalisefilter(opts, url, urls);

        o.addlinkednodes(opts, urls, graph, (err, graph, res3) => {
          if (err) return fn(err);

          opts.onresponse(graph.get(url), res, url, urls, (err, node) => {

            graph = graph.set(node.get(url), node);
            
            fn(null, graph, url);
          });
        }, url);
      });
    });
  };
  
  o.addlinkednodes = (opts, urls, graph, fn, pkey) => {
    if (!urls[0]) return fn(null, graph, pkey);
    
    o.addlinkednode(opts, urls[0], graph, (err, graph, pkey) => {
      o.addlinkednodes(opts, urls.slice(1), graph, fn, pkey);
    }, pkey);
  };

  o.start = (opts, fn) => {
    opts = sitezoo_opts(opts);

    o.addlinkednodes(opts, opts.urls, sitezoo_graph.get(), (err, graph) => {
      if (err) return fn(err);

      sitezoo_log.finished(opts);

      fn(null, sitezoo_graph.asurllist(graph).sort(), graph);
    });
  };

  return o;

})({});
