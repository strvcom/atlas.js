/**
 * Atlas.js aliases
 *
 * Aliases are a way for components to use other components. Usually, a component will declare that
 * it needs a particular component, like `service:sequelize`. In this file, you can tell Atlas.js
 * that this component is your `database` component.
 *
 * For example, to bind your migrations hook to a database component, you can do the following:
 *
 * ```js
 * const hooks = {
 *   migrations: {
 *     'service:sequelize': 'database',
 *   },
 * },
 * export {
 *   hooks,
 * }
 * ```
 */

export {
}
