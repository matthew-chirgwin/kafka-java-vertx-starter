# WebSocketHook

This hook in an abstraction of the [WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket).

## Usage

Create a new websocket:

```
const { sendMessage, readyState } = useWebSocket(
  url,
  {
    onError: func(error),
    onClose: func(),
    onOpen: func(),
    onMessage: func(message),
  }
);
```

Where `onError`, `onClose`, `onOpen`, `onMessage` are direct mappings of the WebSocket events. Using the hook will automatically open up the WebSocket.

Check the ready state and send a message:

```
if (readyState === WebSocket.OPEN) {
  sendMessage(message);
}
```

### Providing a custom WebSocket

Instead of providing a URL to the hook, a function that returns a WebSocket can be used instead. For example:

```
useWebSocket(() => {
  const url = myURLGetter();

  return new WebSocket(url)
});
```
