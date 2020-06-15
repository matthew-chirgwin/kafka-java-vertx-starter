import { MockWebSocket } from '../../TestUtils/index.js';
import { useWebSocket } from '../index.js';
import { renderHook, act } from '@testing-library/react-hooks';

describe('useWebSocket tests', () => {
  let mockSocket;

  beforeEach(() => {
    mockSocket = new MockWebSocket(1);
  });

  afterEach(() => {
    mockSocket = null;
  });

  it('Calls onOpen callback on open', () => {
    let onOpenStub = jest.fn();

    renderHook(() =>
      useWebSocket(() => mockSocket, {
        onOpen: onOpenStub,
      })
    );

    act(() => {
      mockSocket.open();
    });

    expect(onOpenStub).toBeCalledTimes(1);
  });

  it('Calls onClose callback on close', () => {
    let onCloseStub = jest.fn();

    renderHook(() =>
      useWebSocket(() => mockSocket, {
        onClose: onCloseStub,
      })
    );

    act(() => {
      mockSocket.close();
    });

    expect(onCloseStub).toBeCalledTimes(1);
  });

  it('Calls onMessage callback on message', () => {
    let onMessageStub = jest.fn();
    const testMessage = 'hello world!';

    renderHook(() =>
      useWebSocket(() => mockSocket, {
        onMessage: onMessageStub,
      })
    );

    act(() => {
      mockSocket.message(testMessage);
    });

    expect(onMessageStub).toBeCalledTimes(1);
    expect(onMessageStub).toBeCalledWith(testMessage);
  });

  it('Calls onError callback on error', () => {
    let onErrorStub = jest.fn();
    const testError = 'uh oh';

    renderHook(() =>
      useWebSocket(() => mockSocket, {
        onError: onErrorStub,
      })
    );

    act(() => {
      mockSocket.error(testError);
    });

    expect(onErrorStub).toBeCalledTimes(1);
    expect(onErrorStub).toBeCalledWith(testError);
  });

  it('sendMessage trigger websocket send', () => {
    const sendFunc = jest.fn();
    const testMessage = 'hello';

    mockSocket = new MockWebSocket(1, sendFunc);
    let {
      result: { current: socket },
    } = renderHook(() => useWebSocket(() => mockSocket));

    act(() => {
      mockSocket.open();
    });

    socket.sendMessage(testMessage);

    expect(mockSocket.send).toBeCalledTimes(1);
    expect(mockSocket.send).toBeCalledWith(testMessage);
  });

  it('readyState represents websocket readystate', () => {
    const readyState = 12;

    mockSocket = new MockWebSocket(readyState);
    let {
      result: { current: socket },
    } = renderHook(() => useWebSocket(() => mockSocket));

    act(() => {
      mockSocket.open();
    });

    expect(socket.readyState).toBe(readyState);
  });
});
