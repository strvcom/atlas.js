declare module '@atlas.js/hook' {
  import Component from '@atlas.js/component'

  /**
   * Use this class to implement the "observer" pattern within Atlas
   *
   * A hook is capable of receiving "events" emitted from other components as method invocations.
   * If a hook observes a component "service:database", and that component emits a "didCreateRecord"
   * event with the record on input, you can declare a method on your hook like this and Atlas will
   * call it when the observing component emits that event:
   *
   * ```js
   * class MyHook extends Hook {
   *   async didCreaterecord(record) {
   *     // process the record somehow
   *   }
   * }
   * ```
   *
   * @abstract
   */
  export default abstract class Hook extends Component {
    /** @private */
    static type: 'hook'

    /**
     * The name of the component this hook wants to receive events from
     *
     * If `atlas` is specified, this hook will receive events from the Atlas instance itself.
     */
    static observes: string
  }
}
