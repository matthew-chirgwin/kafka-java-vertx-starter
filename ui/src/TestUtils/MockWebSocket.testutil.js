class MockWebSocket {
  constructor(
    readyState,
    sendFunc = () => {
      return;
    }
  ) {
    this.readyState = readyState;
    this.send = sendFunc;
  }

  open() {
    this.onopen();
  }

  close() {
    this.onclose();
  }

  message(message) {
    this.onmessage(message);
  }

  error(error) {
    this.onerror(error);
  }
}

module.exports = { MockWebSocket };
