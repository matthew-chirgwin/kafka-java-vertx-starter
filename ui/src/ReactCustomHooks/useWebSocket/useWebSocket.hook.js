/* eslint-disable no-console */
import { useState, useEffect } from 'react';

const SOCKET_NOT_OPEN_ERROR = () => {
  console.error('Socket is not open yet');
};

const DEFAULT_HANDLERS = {
  onError: (error) => {
    console.error(`Unhandled error: ${error}`);
    console.error(
      `Please register 'onError' event handler on useWebSocket hook`
    );
  },
  onClose: () => {
    return;
  },
  onOpen: () => {
    return;
  },
  onMessage: () => {
    return;
  },
};

const DEFAULT_STATE = {
  send: SOCKET_NOT_OPEN_ERROR,
  readyState: 3, // Closed
};

const useWebSocket = (ws, handlers = {}) => {
  handlers = { ...DEFAULT_HANDLERS, ...handlers };

  let [socketState, updateSocketState] = useState(DEFAULT_STATE);

  let socket;

  useEffect(() => {
    if (socketState.readyState !== WebSocket.OPEN) {
      if (typeof ws === 'function') {
        socket = ws();
      } else {
        socket = new WebSocket(ws);
      }

      socket.onopen = () => {
        updateSocketState({
          send: socket.send.bind(socket),
          readyState: socket.readyState,
        });
        handlers.onOpen();
      };

      socket.onmessage = handlers.onMessage;
      socket.onclose = handlers.onClose;
      socket.onerror = handlers.onError;
    }
  });

  return {
    sendMessage: socketState.send,
    readyState: socketState.readyState,
  };
};

export default useWebSocket;
