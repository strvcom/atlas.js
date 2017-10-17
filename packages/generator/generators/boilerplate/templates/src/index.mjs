/**
 * Application's main entry point.
 *
 * Since Atlas.js needs to be started and stopped, this script ensures these happen at the
 * Right Time™. If it does not suit you, just drop the whole thing and implement your own start/stop
 * mechanism.
 *
 * In the future, the goal is to have the majority of this functionality moved to a dedicated
 * package.
 */

import cluster from 'cluster'
import atlas from './atlas'

// We are the main entry point of a Node.js app or we are in a cluster worker -> start the atlas.
// Otherwise, someone require()d this file - let's leave the actual startup to the caller.
if (require.main === module || cluster.isWorker) {
  process.once('SIGINT', exit)
  process.once('SIGTERM', exit)

  atlas.start()
    .catch(fatal)
}

/**
 * Cleanly shut down the Atlas instance so that the process may exit
 *
 * @private
 * @return    {void}
 */
function exit() {
  // Prevent calling atlas.stop() multiple times when repeatedly pressing ctrl-c. Next time you
  // press ctrl+c, we'll just brute-force-quit the whole thing. 🔥
  process.removeListener('SIGINT', exit)
  process.removeListener('SIGTERM', exit)
  process.once('SIGINT', forcequit)
  process.once('SIGTERM', forcequit)

  atlas.stop()
    .catch(fatal)
}

/**
 * Cause the process to forcefully shut down by throwing an uncaught exception
 *
 * @private
 * @return    {void}
 */
function forcequit() {
  throw new Error('Forced quit')
}

/**
 * Handle a fatal error in the start/stop methods of the Atlas instance
 *
 * @private
 * @param     {Error}    err    The error object which caused the fatal error
 * @return    {void}
 */
function fatal(err) {
  process.exitCode = 1
  // eslint-disable-next-line no-console
  console.error(err.stack)

  // A fatal error occured. We have no guarantee that the instance will shut down properly. We will
  // wait 10 seconds to see if it manages to shut down gracefully, then we will use brute force to
  // stop the process. 💣
  // eslint-disable-next-line no-process-exit
  setTimeout(() => process.exit(), 10000)
    .unref()
}

export default atlas
