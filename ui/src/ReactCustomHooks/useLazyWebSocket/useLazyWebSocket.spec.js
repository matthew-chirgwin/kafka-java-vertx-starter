import { MockWebSocket } from '../../TestUtils/index.js';
import { useLazyWebSocket } from '../index.js';
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

    let {
      result: { current: socket },
    } = renderHook(() =>
      useLazyWebSocket(() => mockSocket, {
        onOpen: onOpenStub,
      })
    );

    act(() => {
      socket.open();
    });

    expect(onOpenStub).toBeCalledTimes(1);
  });
});
