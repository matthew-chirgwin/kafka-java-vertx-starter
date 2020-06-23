// used in storybook to emulate a socket/the backend behind it
import { CONSTANTS } from 'Utils';

const successShape = (custom = 'Storybook!') => ({
  topic: 'my_topic',
  partition: 0,
  offset: 0,
  timestamp: Date.now(),
  value: custom,
});

const errorShape = { status: CONSTANTS.VERTX_ERROR_STATUS };

const producerMetadata = {
  topic: 'my_topic',
  tickRate: 2000,
  producerStarted: true,
};

const consumerMetadata = {
  topic: 'my_topic',
  tickRate: 2000,
  consumerStarted: true,
};

const returnErrorOrResponse = (errChance = 0, successResponse = {}) =>
  Math.floor(Math.random() * 100) > errChance ? successResponse : errorShape;

const mockConsumer = (sendFn, errRate = 0) => () =>
  sendFn(returnErrorOrResponse(errRate, successShape()));

const mockProducer = (sendFn, errRate = 0, custom) => () =>
  sendFn(returnErrorOrResponse(errRate, successShape(custom)));

const sendMessage = (sendFn) => (content) =>
  sendFn({ data: JSON.stringify(content) });

export const mockWebsocket = (
  responseType = CONSTANTS.PRODUCER,
  errorRate = 5,
  openingDelay = 200,
  msgEvery = 500,
  intitalBacklog = 0
) => {
  let eventListeners = {};
  let intervalId;

  return {
    send: (evt) => {
      const parsedEvt = JSON.parse(evt);
      if (parsedEvt.action === 'start' && !intervalId) {
        const sendMessageFn = sendMessage(eventListeners.message);
        let dataFn;
        if (responseType === CONSTANTS.PRODUCER) {
          //send the metadata event
          sendMessageFn(producerMetadata);
          dataFn = mockProducer(sendMessageFn, errorRate, parsedEvt.custom);
        } else if (responseType === CONSTANTS.CONSUMER) {
          //send the metadata event
          sendMessageFn(consumerMetadata);
          dataFn = mockConsumer(sendMessageFn, errorRate);
        }
        for (let i = 0; i < intitalBacklog; i++) {
          dataFn();
        }
        intervalId = setInterval(dataFn, msgEvery);
      } else if (parsedEvt.action === 'stop') {
        intervalId = clearInterval(intervalId);
      }
    },
    close: () => {
      if (intervalId !== null) {
        intervalId = clearInterval(intervalId);
      }
    },
    addEventListener: (evt, handler) => {
      eventListeners = { ...eventListeners, [evt]: handler };
      if (evt === 'open') {
        setTimeout(handler, openingDelay);
      }
    },
  };
};
