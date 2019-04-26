import * as cluster from 'cluster'
import { heimdall } from '@strv/heimdall'
import Command from '../command'

class Start extends Command {
  static command = 'start'
  static description = 'Start the Atlas.js app'
  static options = [
    // @TODO: Implement clustering
    // ['--cluster <size>', 'Start the app clustered with <size> worker processes', caporal.INT],
  ]

  async run() {
    const atlas = this.atlas

    await heimdall({
      async execute() {
        await atlas.start()
      },
      async exit() {
        await atlas.stop()

        // If this is a clusterised worker, disconnect the worker from the master once we are done
        // here so the process can exit gracefully without the master having to do anything special.
        if (cluster.isWorker) {
          cluster.worker.disconnect()
        }
      },
    })
  }
}

export default Start
