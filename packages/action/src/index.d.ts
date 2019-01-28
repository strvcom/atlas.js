import Component from '@atlas.js/component'

/**
 * Use this class to implement custom high-level "actions" or "operations" in your code
 *
 * An action could be thought of as a controller of sorts in the MVC architecture. The general
 * idea of actions is that each class represents a group of releated operations which yield a
 * specific end result. They should be callable from anywhere and should not be tied to a
 * particular interface (ie. an HTTP server or a REPL session) - in other words, the idea is to
 * make them as reusable as possible.
 *
 * Actions can be completely standalone or they might call other, lower-level actions or interact
 * with services to manipulate external resources. Generally actions are called from some kind of
 * externally available entry point, like an HTTP interface, a REPL session, a custom socket etc.
 *
 * Actions are intended to encapsulate "business-specific" or re-usable code/behaviour.
 *
 * @abstract
 */
export default abstract class Action extends Component {
  /** @private */
  static type: 'action'
}
