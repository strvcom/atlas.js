/**
 * Dispatch an event to hooks
 *
 * This function takes variable number of events to be dispatched to hooks
 *
 * @private
 * @param     {String|Array}    events    The events' names
 * @param     {mixed}           subject   The thing that is related to the event (ie. a component)
 *                                        It is given to the event handler on input.
 * @this      Map
 * @return    {Promise<void>}
 */
async function dispatch(events, subject) {
  events = Array.isArray(events)
    ? events
    : [events]

  const tasks = []

  for (const [, hook] of this) {
    for (const event of events) {
      // Is this hook listening for the event being dispatched?
      if (typeof hook.component[event] === 'function') {
        hook.component.log.debug({ event }, 'hook:event')
        tasks.push(hook.component[event](subject))
      }
    }
  }

  await Promise.all(tasks)
}

export default dispatch
