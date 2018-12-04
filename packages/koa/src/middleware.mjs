/**
 * @typedef   {import("koa")}   Koa
 */

/**
  * @typedef    {Object}    Handlers
  * @property   {function}  name    The handler function associated with a name through the object
  *                                 key
  */

/**
 * Register the given middleware functions into the given Koa-compatible instance
 *
 * @param     {Koa}       instance        Koa-compatible instance. Must implement `.use()`.
 * @param     {Handlers}  handlers        Object where keys are the middlewares' names and the
 *                                        values are the actual middleware functions.
 * @param     {Object=}   config          Configuration for individual middlewares. The keys should
 *                                        match the middleware names.
 * @return    {void}
 */
export default function middleware(instance, handlers, config = {}) {
  for (const [name, handler] of Object.entries(handlers)) {
    instance.use(handler(config[name]))
  }
}
