export default function mksequelizemock() {
  const model = {
    sync: () => Promise.resolve(model),
    findAll: () => Promise.resolve([]),
  }

  return {
    isDefined: () => true,
    model: () => model,
  }
}
