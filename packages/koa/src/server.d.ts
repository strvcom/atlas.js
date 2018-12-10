import * as Koa from 'koa'
import * as Pino from 'pino'
import { Atlas } from '@atlas.js/atlas'
import AtlasService from '@atlas.js/service'

type MiddlewareConfig = object

/**
 * The Server service which manages a Koa instance
 *
 * Use this service to start a Koa server as part of Atlas.
 */
declare class Server extends AtlasService {
  config: Server.Config

  prepare(): Promise<Koa>
  start(service: Koa): Promise<Koa>
  stop(service: Koa): Promise<void>
}

declare namespace Server {
  /**
   * A Koa Context, enhanced with some extra properties to make it easy to interact with Atlas from
   * within a route handler
   */
  interface Context extends Koa.Context {
    atlas: Atlas
    log: Pino.Logger
  }

  /** Configuration schema available to this service */
  type Config = {
    /** Configuration for the middleware loader */
    middleware: {
      /**
       * The middleware loader will load the middleware to register with this Koa instance at this
       * module location, relative to `atlas.root`.
       * @default   middleware
       */
      module: string
      /**
       * Configuration options for the individual middleware. The key should match the name of the
       * middleware under which it was exported from the module you specified in the `module`
       * configuration. The value will be passed directly to the middleware function.
       */
      config: {
        [key: string]: MiddlewareConfig
      }
    }

    // @TODO(semver-major): change this to match `net.ListenOptions`.
    /** Configuration options specifying where to listen for incoming requests */
    listen: {
      /**
       * Port to listen on
       * @default   3000
       */
      port: number
      /**
       * Hostname to listen on
       * @default   127.0.0.1
       */
      hostname: string
    }

    /** Configuration options applied to the `http.Server` instance using `Object.assign()` */
    server: {
      maxHeadersCount: number;
      timeout: number;
      keepAliveTimeout: number;
    }

    /** Settings applied to the `Koa` instance directly using `Object.assign()` */
    koa: {
      proxy: boolean
    }
  }
}

export default Server
