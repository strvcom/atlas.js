/**
 * Expose a getter on the application instance under the specified collection (object)
 *
 * @private
 * @param     {String}    collection    The collection (object) onto which to attach the getter
 * @param     {String}    property      The getter's name/key
 * @param     {mixed}     value       The value to return from the getter
 * @return    {void}
 */
function expose(collection, property, value) {
  Object.defineProperty(this[collection], property, {
    enumerable: true,
    configurable: true,
    get: () => value,
  })
}

export default expose
