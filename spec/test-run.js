// Filename: sitemap.js  
// Timestamp: 2017.07.22-18:56:15 (last modified)
// Author(s): bumblehead <chris@bumblehead.com>

import sitezoo from '../src/sitezoo.js'

sitezoo({
  urls: ['http://chris.bumblehead.com:8585/'],
  // do not include matched urls
  preventurl: url => /[^\/]$/.test(url)
}, (err, urllist, graph) => {
  console.log(err || urllist);

  console.log(graph.get('http://chris.bumblehead.com:8585/about/').toJS());
});
