# LazyWebSocketHook

This hook in an abstraction of the [WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket).

## Usage

Create a new WebSocket:

```
const { open, close sendMessage, readyState } = useLazyWebSocket(
  url,
  {
    onError: func(error),
    onClose: func(),
    onOpen: func(),
    onMessage: func(message),
  }
);
```

Where `onError`, `onClose`, `onOpen`, `onMessage` are direct mappings of the WebSocket events.

To open the socket:

```
useEffect(() => {
  if (readyState !== WebSocket.OPEN) {
    open();
  }
})
```

Check the ready state, send a message, then close the socket:

```
useEffect(() => {
  if (readyState === WebSocket.OPEN) {
    sendMessage();

    close();
  }
})
```

### Providing a custom WebSocket

Instead of providing a URL to the hook, a function that returns a WebSocket can be used instead. For example:

```
useWebSocket(() => {
  const url = myURLGetter();

  return new WebSocket(url)
});
```
