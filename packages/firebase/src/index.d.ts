import * as firebase from 'firebase-admin'
import AtlasService from '@atlas.js/service'

/**
 * Start a Firebase instance from within Atlas
 *
 * This service allows you to configure a Firebase app and use all available Firebase services,
 * like the realtime database, Firestore etc.
 */
declare class Service extends AtlasService {
  /** Service runtime configuration values */
  config: Service.Config

  prepare(): Promise<firebase.app.App>
  start(service: firebase.app.App): Promise<firebase.app.App>
  stop(service: firebase.app.App): Promise<void>
}

declare namespace Service {
  /** Configuration schema available to this service */
  type Config = firebase.AppOptions & {
    /**
     * Define the Firebase App's name
     * @default   default
     */
    name?: string
    /**
     * Provide the credentials for Firebase
     *
     * This can optionally be a `string`, in which case the string will be treated as a module
     * location relative to `atlas.root` and the actual credentials will be `require()`d from that
     * module.
     */
    credential: firebase.credential.Credential | string
  }
}

export {
  Service,
  firebase,
}
