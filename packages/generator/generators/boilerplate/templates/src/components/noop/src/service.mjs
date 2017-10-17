import { Service } from '@atlas.js/atlas'

class Noop extends Service {
  prepare() {
    this.log.info('noop service preparing nothing')
  }

  start() {
    this.log.info('noop service starting nothing')
  }

  stop() {
    this.log.info('noop service stopping nothing')
  }
}

export default Noop
