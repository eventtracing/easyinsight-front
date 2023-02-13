import { EventEmitter } from 'eventemitter3'

const emitter = new EventEmitter()
export default {
  // @ts-ignore
  $on: (...args) => emitter.on(...args),
  // @ts-ignore
  $once: (...args) => emitter.once(...args),
  // @ts-ignore
  $off: (...args) => emitter.off(...args),
  // @ts-ignore
  $emit: (...args) => emitter.emit(...args)
}
