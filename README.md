sitezoo
=======
**(c)[Bumblehead][0]**

Returns a json-list of internal links for a website. This can be used to generate a sitemap.

**alpha quality, not recommended**

A robust sitemap generator would be difficult to complete without many test-cases. I've added support for my own basic requirements, but **if you have a request feel free to open an issue** for that request. I'm happy to support more use-cases.


----------------------------------------
### usage

```javascript
const sitezoo = require('sitezoo');

sitezoo({
  urls: ['http://chris.bumblehead.com:8585/'],
  // do not include matched urls
  preventurl: url => /[^\/]$/.test(url)
}, (err, urllist, graph) => {
  console.log(err || urllist);
});
// [ 'http://chris.bumblehead.com:8585/',
//   'http://chris.bumblehead.com:8585/about/',
//   'http://chris.bumblehead.com:8585/blog/',
//   'http://chris.bumblehead.com:8585/blog/2008.08.31-tape-out/',
//   'http://chris.bumblehead.com:8585/blog/2008.09.27-pyramid/',
//   'http://chris.bumblehead.com:8585/doc/addemo/',
//   'http://chris.bumblehead.com:8585/doc/addemo/benchmark/',
//   'http://chris.bumblehead.com:8585/doc/cssstyleconventions/',
//   'http://chris.bumblehead.com:8585/doc/fsdnav/',
//   'http://chris.bumblehead.com:8585/gallery/',
//   'http://chris.bumblehead.com:8585/links/',
//   'http://chris.bumblehead.com:8585/media/' ]
```

The returned graph is an [immutable.js][1] object, the record of incoming and outgoing links for each page 'node'.

For example, a node is shown below.

```javascript
graph.get('http://chris.bumblehead.com:8585/about/').toJS();
// { url: 'http://chris.bumblehead.com:8585/about/',
//   uid: 'http://chris.bumblehead.com:8585/about/',
//   inarr: 
//    [ { refname: 'http://chris.bumblehead.com:8585/',
//        uid: 'http://chris.bumblehead.com:8585/' },
//      { refname: 'http://chris.bumblehead.com:8585/blog/',
//        uid: 'http://chris.bumblehead.com:8585/blog/' },
//      { refname: 'http://chris.bumblehead.com:8585/gallery/',
//        uid: 'http://chris.bumblehead.com:8585/gallery/' },
//      { refname: 'http://chris.bumblehead.com:8585/media/',
//        uid: 'http://chris.bumblehead.com:8585/media/' },
//      { refname: 'http://chris.bumblehead.com:8585/links/',
//        uid: 'http://chris.bumblehead.com:8585/links/' },
//      { refname: 'http://chris.bumblehead.com:8585/about/',
//        uid: 'http://chris.bumblehead.com:8585/about/' },
//      { refname: 'http://chris.bumblehead.com:8585/doc/cssstyleconventions/',
//        uid: 'http://chris.bumblehead.com:8585/doc/cssstyleconventions/' } ],
//   outarr: 
//    [ { refname: 'http://chris.bumblehead.com:8585/about/',
//        uid: 'http://chris.bumblehead.com:8585/about/' },
//      { refname: 'http://chris.bumblehead.com:8585/about/',
//        uid: 'http://chris.bumblehead.com:8585/links/' },
//      { refname: 'http://chris.bumblehead.com:8585/about/',
//        uid: 'http://chris.bumblehead.com:8585/media/' },
//      { refname: 'http://chris.bumblehead.com:8585/about/',
//        uid: 'http://chris.bumblehead.com:8585/gallery/' },
//      { refname: 'http://chris.bumblehead.com:8585/about/',
//        uid: 'http://chris.bumblehead.com:8585/blog/2008.09.27-pyramid/' },
//      { refname: 'http://chris.bumblehead.com:8585/about/',
//        uid: 'http://chris.bumblehead.com:8585/blog/2008.08.31-tape-out/' },
//      { refname: 'http://chris.bumblehead.com:8585/about/',
//        uid: 'http://chris.bumblehead.com:8585/blog/' } ] }
```


[0]: http://www.bumblehead.com                            "bumblehead"
[1]: http://facebook.github.io/immutable-js             "immutable-js"
