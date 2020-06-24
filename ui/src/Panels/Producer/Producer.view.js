/* eslint-disable react/jsx-no-bind */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { debounce, get } from 'lodash-es';

import { translations } from './Producer.assets.js';
import { CONSTANTS, idAttributeGenerator } from 'Utils';
import { Counter, ProducerMessages } from 'Groups';
import { ProducerMessage } from 'Elements';
import {
  useTranslate,
  useToggle,
  useKafkaVertxWebSocket,
} from 'ReactCustomHooks';
import { Button, TextInput } from 'carbon-components-react';

const Producer = (props) => {
  const {
    getProducerWebsocket,
    topic,
    maxNumberOfMessages,
    className,
    ...others
  } = props;
  const classesToApply = clsx('Producer', { [className]: className });

  const translate = useTranslate(translations);
  const [producerRunning, toggleProducerRunning] = useToggle(false);
  const {
    start,
    stop,
    isReady,
    isRunning,
    messages,
    totalSuccessMessages,
  } = useKafkaVertxWebSocket(getProducerWebsocket, maxNumberOfMessages);
  const [messageValue, setMessageValue] = useState(
    translate('MESSAGE_VALUE_DEFAULT', {}, true)
  );
  const debouncedSetMessageValue = debounce(setMessageValue, 100);

  const onButtonClick = () => {
    if (producerRunning) {
      stop();
    } else {
      start({ value: messageValue });
    }
    toggleProducerRunning();
  };

  const onMessageValueChange = (event) => {
    const value = get(event, 'target.value', '');
    debouncedSetMessageValue(value);
  };

  return (
    <div {...others} className={classesToApply}>
      <Counter
        {...idAttributeGenerator('producer_stats')}
        title={translate('MESSAGES_PRODUCED', {}, true)}
        subtitle={translate('FROM_TOPIC', { topic }, true)}
        count={totalSuccessMessages}
        className={'Producer__count'}
      />
      <div className={'Producer__control'}>
        <TextInput
          {...idAttributeGenerator('producer_value_input')}
          defaultValue={translate('MESSAGE_VALUE_DEFAULT', {}, true)}
          size={'xl'}
          id={'producer_value_input'}
          labelText={translate('MESSAGE_VALUE_LABEL')}
          hideLabel
          light
          disabled={isRunning}
          onChange={onMessageValueChange}
          placeholder={translate('MESSAGE_VALUE_PLACEHOLDER', {}, true)}
        />
        <Button
          disabled={!isReady}
          onClick={onButtonClick}
          {...idAttributeGenerator('producer_button')}
        >
          {isRunning
            ? translate('STOP_PRODUCING')
            : translate('START_PRODUCING')}
        </Button>
      </div>
      <ProducerMessages>
        {messages.map((msg, index) => (
          <ProducerMessage
            className={clsx('Producer__Message', {
              ['Producer__Message--first']: index === 0,
            })}
            {...idAttributeGenerator('producer_produced_message')}
            key={`produced-message-${index}:${msg.index}`}
            isFirst={index === 0}
            error={
              msg.status === CONSTANTS.VERTX_ERROR_STATUS
                ? { message: translate('ERROR_PRODUCING', {}, true) }
                : undefined
            }
            message={
              msg.status !== CONSTANTS.VERTX_ERROR_STATUS ? msg : undefined
            }
          />
        ))}
      </ProducerMessages>
    </div>
  );
};

Producer.propTypes = {
  /** required - a function which returns a Websocket object
      which is configured to connect to the backend producer */
  getProducerWebsocket: PropTypes.func.isRequired,
  /** required - the topic this producer is producing to. */
  topic: PropTypes.string.isRequired,
  /** optional - the max number of messages to render. Defaults to 10. */
  maxNumberOfMessages: PropTypes.number,
  /** optional - any additional desired styling. Applied to parent element. */
  className: PropTypes.string,
};

Producer.defaultProps = {
  maxNumberOfMessages: 5,
  topic: 'PROVIDE_ME',
};

export { Producer };
