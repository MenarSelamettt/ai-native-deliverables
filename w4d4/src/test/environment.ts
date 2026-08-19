import { builtinEnvironments, type Environment } from 'vitest/environments'

const environment: Environment = {
  name: 'jsdom-native-abort',
  transformMode: 'web',
  async setup(global, options) {
    const NativeAbortController = global.AbortController
    const NativeAbortSignal = global.AbortSignal
    const result = await builtinEnvironments.jsdom.setup(global, options)

    global.AbortController = NativeAbortController
    global.AbortSignal = NativeAbortSignal

    return result
  },
}

export default environment
