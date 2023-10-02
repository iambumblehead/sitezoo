// Filename: sitezoo.js  
// Timestamp: 2017.07.22-18:02:58 (last modified)
// Author(s): bumblehead <chris@bumblehead.com>

import sitezoo_build from './sitezoo_build.js'
import sitezoo_opts from './sitezoo_opts.js'
import sitezoo_log from './sitezoo_log.js'

export default Object.assign((opts, fn) => (
  sitezoo_build(opts, fn)
), {
  build: sitezoo_build,
  opts: sitezoo_opts,
  log: sitezoo_log
})
