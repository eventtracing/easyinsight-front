// interface WebSocketClientDto {}
export default class WebSocketClient {
  public url: string
  public ws: {
    onopen: (this: WebSocket, ev: Event) => any
    onmessage: (msg: { data: string }) => void
    onclose: (evt: any) => void
    onerror: (evt: any) => void
    send: (message: string) => void
    close: (code: any) => void
  }

  public onOpen: () => void
  public onMessage: (msg: { data: string }) => void
  public onClose: (evt: any) => void
  public onError: (evt: any) => void

  public constructor(url) {
    this.ws = null
    this.url = url
    this.onOpen = null
    this.onMessage = null
    this.onClose = null
    this.onError = null
  }

  connect() {
    this.ws = new WebSocket(this.url)

    this.ws.onopen = () => {
      if (typeof this.onOpen === 'function') {
        this.onOpen()
      }
    }

    this.ws.onmessage = (msg) => {
      if (typeof this.onMessage === 'function') {
        this.onMessage(msg)
      }
    }

    this.ws.onclose = (evt) => {
      if (typeof this.onClose === 'function') {
        this.onClose(evt)
      }

      // 关闭重连
      // if (!evt.wasClean) {
      //   this.reconnect()
      // }
    }

    this.ws.onerror = (evt) => {
      if (typeof this.onError === 'function') {
        this.onError(evt)
      }
    }
  }

  public reconnect() {
    delete this.ws
    setTimeout(() => {
      this.connect()
    }, 1000)
  }

  public send(message) {
    this.ws.send(message)
  }

  public sendObj(data) {
    this.ws.send(JSON.stringify(data))
  }

  public close(code) {
    this.ws.close(code)
  }

  public removeListeners() {
    this.onOpen = null
    this.onMessage = null
    this.onClose = null
    this.onError = null
  }
}
