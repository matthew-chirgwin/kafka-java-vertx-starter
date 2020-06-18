import { useState, useRef, useEffect, useCallback } from 'react';
import { useWebSocket, STATUS } from 'ReactCustomHooks';
import { CONSTANTS } from 'Utils';
import { throttle } from 'lodash-es';

const onMessage = (messageBuffer, updateMetadata, triggerBufferFlush) => ({
  data = '{"empty": true}',
}) => {
  const content = JSON.parse(data);
  if (!content.empty) {
    // check if we have a metadata response
    if (
      content.tickRate &&
      (content.consumerStarted || content.producerStarted)
    ) {
      updateMetadata(content);
    } else {
      // must be a message response. As messages can happen very quickly, we throttle state updates, and store new messages in a buffer
      // we are modifying refs here - hence the .current
      messageBuffer.current.push(content);
      triggerBufferFlush();
    }
  }
};

const useManagedMessageState = (maxMessageNumber) => {
  const [messageState, updateMessageState] = useState({
    totalMessages: 0,
    totalSuccessMessages: 0,
    totalErrorMessages: 0,
    messages: [],
  });
  const messageStateRef = useRef(messageState);

  const updateMessageStateWithBuffer = (buffer) => {
    const {
      totalMessages,
      totalSuccessMessages,
      totalErrorMessages,
      messages,
    } = messageStateRef.current;
    // add a unique id based on the number of prior messages recived, plus a status. Status will be replaced with one from newMessage, if provided
    const processedMessages = buffer.map((newMessage, index) => ({
      status: CONSTANTS.VERTX_SUCCESS_STATUS,
      index: totalMessages + index + 1,
      ...newMessage,
    }));

    // now we have processed the new messages, determine the number of errors/totals
    const newTotalMessages = totalMessages + processedMessages.length;
    const newErrors = processedMessages.filter(
      (processedMessage) =>
        processedMessage.status === CONSTANTS.VERTX_ERROR_STATUS
    ).length;
    const newTotalOfSuccessMessages =
      totalSuccessMessages + processedMessages.length - newErrors;
    const newTotalOfErrorMessages = totalErrorMessages + newErrors;
    let newMessageSet = [].concat(messages).concat(processedMessages);
    // lastly, trim any messages over the limit - loosing the oldest
    newMessageSet =
      newMessageSet.length > maxMessageNumber
        ? newMessageSet.slice(
            newMessageSet.length - maxMessageNumber,
            newMessageSet.length
          )
        : newMessageSet;

    messageStateRef.current = {
      totalMessages: newTotalMessages,
      totalSuccessMessages: newTotalOfSuccessMessages,
      totalErrorMessages: newTotalOfErrorMessages,
      messages: newMessageSet,
    };
    updateMessageState(messageStateRef.current);
  };

  return [messageState, updateMessageStateWithBuffer];
};

const useKafkaVertxWebSocket = (
  getWebsocket,
  maxMessageNumber = 300,
  bufferDebouceTimeout = 1000,
  defaultStartContent = {}
) => {
  const [messageState, updateMessageStateWithBuffer] = useManagedMessageState(
    maxMessageNumber
  );
  const [hasStarted, toggleHasStarted] = useState(false);
  const messageBuffer = useRef([]);
  const [metadata, setMetadata] = useState({});
  const triggerBufferFlush = useCallback(
    throttle(() => {
      updateMessageStateWithBuffer(messageBuffer.current.slice(0)); // call the provided callback to process a copy of the buffer
      messageBuffer.current = []; // clear the buffer
    }, bufferDebouceTimeout)
  );

  useEffect(() => {
    return triggerBufferFlush.cancel; // clear the triggerBufferFlush function on unmount
  }, []);

  const { send, currentState } = useWebSocket(getWebsocket, {
    onMessage: onMessage(messageBuffer, setMetadata, triggerBufferFlush),
  });

  const stringifyAndSend = (content) => send(JSON.stringify(content));
  const isReady = currentState === STATUS.OPEN;

  const start = (additionalStartContent = {}) => {
    if (isReady) {
      stringifyAndSend({
        ...defaultStartContent,
        ...additionalStartContent,
        action: 'start',
      });
      toggleHasStarted(true);
    }
  };

  const stop = () => {
    if (isReady) {
      stringifyAndSend({ action: 'stop' });
      toggleHasStarted(false);
    }
  };

  return {
    start: start,
    stop: stop,
    isReady,
    isRunning: isReady && hasStarted,
    metadata,
    messages: messageState.messages,
    totalSuccessMessages: messageState.totalSuccessMessages,
    totalErrorMessages: messageState.totalErrorMessages,
  };
};

export { useKafkaVertxWebSocket };
