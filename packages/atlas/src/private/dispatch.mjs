/**
 * Dispatch an event to hooks
 *
 * Dispatch an event to all hooks listening on this component
 *
 * @private
 * @param     {String}    event     The event's name
 * @param     {mixed}     subject   The thing that is related to the event (ie. a component)
 *                                  It is given to the event handler on input.
 * @this      Map
 * @return    {Promise<void>}
 */
async function dispatch(event, subject) {
  const tasks = new Map()

  for (const [, hook] of this) {
    // Is this hook listening for the event being dispatched?
    if (typeof hook.component[event] === 'function') {
      hook.component.log.debug({ event }, 'hook:event')
      tasks.set(hook, Promise.resolve(hook.component[event](subject)))
    } else {
      hook.component.log.debug({ event }, 'hook:event:not-implemented')
    }
  }

  for (const [hook, task] of tasks) {
    task.catch(err => void hook.component.log.error({ err, event }, 'hook:event:failure'))
  }

  // Ensure no uncaught error escapes from this place
  await Promise.all(Array.from(tasks.values()))
    .catch(() => {})
}

export default dispatch
