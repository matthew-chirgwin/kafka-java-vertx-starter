import translations from './Consumer.i18n.json';
import { CONSTANTS } from 'Utils';
import { mockWebsocket } from 'DevUtils/MockWebsocket';

export { translations };

export const consumerMockWebsocket = () => mockWebsocket(CONSTANTS.CONSUMER);

export const consumerMockWebsocketForTest = (
  errorRate = 0,
  intitalBacklog = 0
) => () =>
  mockWebsocket(CONSTANTS.CONSUMER, errorRate, 100, 100, intitalBacklog);
