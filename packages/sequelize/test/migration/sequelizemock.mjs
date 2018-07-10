export default function mksequelizemock() {
  const model = {}

  return {
    isDefined: () => true,
    model: () => model,
  }
}
