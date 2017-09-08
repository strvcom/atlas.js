/**
 * Dispatch an event to all registered hooks
 *
 * This function takes variable number of events to be dispatched to hooks
 *
 * @private
 * @param     {String|Array}    events    The events' names
 * @param     {mixed}           subject   The thing that is related to the event (ie. a component)
 *                                        It is given to the event handler on input.
 * @param     {Object[]}        hooks     The hooks to which the event should be dispatched
 * @return    {Promise<void>}
 */
async function dispatch(events, subject, hooks) {
  events = Array.isArray(events)
    ? events
    : [events]

  const tasks = []

  for (const [alias, hook] of hooks) {
    for (const event of events) {
      // Is this hook listening for the event being dispatched?
      if (typeof hook.component[event] === 'function') {
        this.log.debug({ hook: alias, event }, 'hook:event')
        tasks.push(hook.component[event](subject))
      }
    }
  }

  await Promise.all(tasks)
}

export default dispatch
