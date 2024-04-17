/* eslint-disable */
export default {
  name: 'v-nodes',
  functional: true,
  props: {
    vnodes: {
      type: [Object, Array],
    }
  },
  render: (ctx: any) => {
    return ctx.vnodes
  }
}
