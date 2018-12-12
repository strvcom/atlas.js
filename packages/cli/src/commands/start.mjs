import * as cluster from 'cluster'
import Command from '../command'

class Start extends Command {
  static command = 'start'
  static description = 'Start the Atlas.js app'
  static options = [
    // @TODO: Implement clustering
    // ['--cluster <size>', 'Start the app clustered with <size> worker processes', caporal.INT],
  ]

  doExit = () => this.exit()

  async run() {
    process.once('SIGINT', this.doExit)
    process.once('SIGTERM', this.doExit)
    process.once('beforeExit', this.doExit)
    await this.atlas.start()
      .catch(fatal)
  }

  /**
   * Cleanly shut down the Atlas instance so that the process may exit
   *
   * @private
   * @return    {Promise}
   */
  exit() {
    // Prevent calling this.atlas.stop() multiple times when repeatedly pressing ctrl-c. Next time
    // you press ctrl+c, we'll just brute-force-quit the whole thing. 🔥
    process.removeListener('SIGINT', this.doExit)
    process.removeListener('SIGTERM', this.doExit)
    process.removeListener('beforeExit', this.doExit)
    process.once('SIGINT', forcequit)
    process.once('SIGTERM', forcequit)

    return this.atlas.stop()
      .then(() => {
        process.removeListener('SIGINT', forcequit)
        process.removeListener('SIGTERM', forcequit)

        // If this is a clusterised worker, disconnect the worker from the master once we are done
        // here so the process can exit gracefully without the master having to do anything special.
        if (cluster.isWorker) {
          cluster.worker.disconnect()
        }
      })
      .catch(fatal)
  }
}


/**
 * Cause the process to forcefully shut down by throwing an uncaught exception
 *
 * @private
 * @return    {void}
 */
function forcequit() {
  process.removeListener('SIGINT', forcequit)
  process.removeListener('SIGTERM', forcequit)

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

export default Start
