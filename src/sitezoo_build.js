// Filename: sitezoo_build.js  
// Timestamp: 2017.07.27-13:02:21 (last modified)
// Author(s): bumblehead <chris@bumblehead.com>

import url from 'node:url'
import {DomUtils,DomHandler,Parser} from 'htmlparser2'
      
import sitezoo_graph from './sitezoo_graph.js'
import sitezoo_node from './sitezoo_node.js'
import sitezoo_opts from './sitezoo_opts.js'
import sitezoo_log from './sitezoo_log.js'

const fetchNormal = (uri, opts) => fetch(uri, opts).then(async res => ({
  body: /application\/json/.test(res.headers.get('content-type'))
    ? await res.json().catch(() => null)
    : await res.text().catch(() => null),
  status: res.status,
  statusText: res.statusText,
  redirected: res.redirected,
  url: res.url
})).catch(e => e)

const request = async (urlstr, opts, fn) => (
  fn(null, await fetchNormal(urlstr)))

const protocol = urlstr => (
  url.parse(urlstr).protocol);

const hostname = urlstr => (
  url.parse(urlstr).hostname);

const pathname = urlstr => (
  url.parse(urlstr).pathname);
  
const striplink = urlstr => (
  urlstr.replace(/(#|\?).*/, ''));

const normalisehref = (baseurl, href) => (
  hostname(href)
    ? url.resolve(protocol(href) + '//' + hostname(href), pathname(href))
    : url.resolve(baseurl, href))

const stripsubdomain = url => (
  url.split('.').slice(-2).join('.'))

const tophostname = url => stripsubdomain(hostname(url));

const isinternal = (baseurl, url) => (
  tophostname(baseurl) === tophostname(url));

const domparser = (htmlstr, fn, parser) => {
  parser = new Parser(new DomHandler(fn));
  parser.write(htmlstr);
  parser.end();
};

const isprotocolweb = urlstr => (
  !/^(ftp|mailto|telnet|file|news):/.test(urlstr));

  // - remove hash and or params
  // - normalise path to provide full url
const normalisefilter = (opts, baseurl, linkarr) => linkarr
  .map(elem => normalisehref(baseurl, striplink(elem)))
  .filter(url => isinternal(baseurl, url) && !opts.preventurl(url));
  
const parselinks = (opts, htmlstr, baseurl, fn) => (
  domparser(htmlstr, (err, dom) => {
    if (err) return fn(err);

    fn(null, DomUtils
       .getElementsByTagName('a', dom, true)
       .reduce((accum, elem) => (
         DomUtils.hasAttrib(elem, 'href')
           && accum.push(DomUtils.getAttributeValue(elem, 'href')),
         accum), [])
       .filter(isprotocolweb));
  })
);

const addlinkednode = (opts, url, graph, fn, pkey) => {
  if (graph.has(url)) {
    graph = sitezoo_graph.setnode(
      graph, sitezoo_node.get(url), pkey && graph.get(pkey), url);
    
    return fn(null, graph, pkey);
  }
  
  sitezoo_log.requesturl(opts, url);
  
  request(url, opts, (err, res) => {
    if (err) return sitezoo_log.error(opts, err);

    graph = sitezoo_graph.setnode(
      graph, sitezoo_node.get(url), pkey && graph.get(pkey), url);
    
    parselinks(opts, res.body, url, (err, urls) => {
      if (err) return fn(err);

      urls = normalisefilter(opts, url, urls);

      addlinkednodes(opts, urls, graph, (err, graph, res3) => {
        if (err) return fn(err);

        opts.onresponse(graph.get(url), res, url, urls, (err, node) => {
          if (err) return fn(err);

          graph = graph.set(node.get(url), node);
          
          fn(null, graph, url);
        });
      }, url);
    });
  });
};

const addlinkednodes = (opts, urls, graph, fn, pkey) => {
  if (!urls[0]) return fn(null, graph, pkey);

  addlinkednode(opts, urls[0], graph, (err, graph, pkey) => {
    if (err) return fn(err);

    addlinkednodes(opts, urls.slice(1), graph, fn, pkey);
  }, pkey);
};

const start = (opts, fn) => {
  opts = sitezoo_opts(opts);

  addlinkednodes(opts, opts.urls, sitezoo_graph.get(), (err, graph) => {
    if (err) return fn(err);

    sitezoo_log.finished(opts);

    fn(null, sitezoo_graph.asurllist(graph).sort(), graph);
  });
};

export default Object.assign(start, {
  request,
  striplink,
  normalisehref,
  stripsubdomain,
  tophostname,
  isinternal,
  domparser,
  isprotocolweb,
  normalisefilter,
  parselinks,
  addlinkednode,
  addlinkednode,
  start
})
