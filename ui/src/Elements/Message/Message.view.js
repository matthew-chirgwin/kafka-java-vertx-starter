/* eslint-disable react/no-multi-comp */ // disabled as we have a hoc funtion in file
import React from 'react';
import PropTypes from 'prop-types';

import {
  ClickableTile,
  ExpandableTile,
  Tile,
  TileAboveTheFoldContent,
  TileBelowTheFoldContent,
} from 'carbon-components-react';
import { CheckmarkFilled16, ErrorFilled16 } from '@carbon/icons-react';
import { isEmpty, isFunction } from 'lodash-es';
import clsx from 'clsx';

import { Body } from '../Text/index.js';
import { useTranslate } from '../../ReactCustomHooks/index.js';
import { translations, CONSUMER, PRODUCER } from './Message.assets.js';

const Message = (props) => {
  const {
    usage,
    className,
    isFirst,
    message,
    error,
    onInteraction,
    ...others
  } = props;

  const classesToApply = clsx('Message', `Message--${usage}`, {
    [`Message--${usage}-first`]: isFirst,
    [`Message--${usage}-error`]: error,
    [className]: className,
  });

  let messageJSX;
  if (error) {
    messageJSX = renderErrorTile(error);
  } else if (usage === CONSUMER) {
    messageJSX = renderConsumerMessageTile(message, onInteraction);
  } else {
    messageJSX = renderProducerMessageTile(message, onInteraction);
  }

  return (
    <div {...others} className={classesToApply}>
      {messageJSX}
    </div>
  );
};

const renderConsumerMessageTile = (message, onInteraction) => {
  const { partition, offset, timestamp, value } = message;
  const translate = useTranslate(translations);
  const valueSize = isEmpty(value) ? '0' : value.length.toString();
  return (
    <ExpandableTile
      expanded={false}
      {...getInteractionHandler(onInteraction, CONSUMER, message)}
      className={'Message__tile--consumer'}
    >
      <TileAboveTheFoldContent>
        <div className={'Message__consumer-details'}>
          <div>
            {renderValueWithLabel(translate('PARTITION'), partition)}
            {renderValueWithLabel(translate('OFFSET'), offset)}
          </div>
          <div>
            <div>
              <Body>
                {translate('CONSUMED_AT', {
                  timestamp: new Date(timestamp).toLocaleString(),
                })}
              </Body>
            </div>
            <div>
              <Body>{translate('SIZE', { bytesCount: valueSize })}</Body>
            </div>
          </div>
        </div>
      </TileAboveTheFoldContent>
      <TileBelowTheFoldContent>
        <div className={'Message__consumer-payload'}>
          {renderValueWithLabel('Payload', value)}
        </div>
      </TileBelowTheFoldContent>
    </ExpandableTile>
  );
};

const renderProducerMessageTile = (message, onInteraction) => {
  const { partition, offset } = message;
  const translate = useTranslate(translations);

  return (
    <ClickableTile
      {...getInteractionHandler(onInteraction, PRODUCER, message)}
      className={'Message__tile--producer'}
    >
      <div>
        <CheckmarkFilled16 className={'Message__icon--checkmark'} />
        {renderValueWithLabel(translate('PARTITION'), partition)}
        {renderValueWithLabel(translate('OFFSET'), offset)}
      </div>
    </ClickableTile>
  );
};

const renderErrorTile = (error) => {
  const { message } = error;
  return (
    <Tile className={'Message__tile--error'}>
      <ErrorFilled16 className={'Message__icon--error'} />
      <div className={'Message__error-message'}>
        <Body>{message}</Body>
      </div>
    </Tile>
  );
};

const renderValueWithLabel = (label, value) => {
  return (
    <div className={'Message__labelled-value'}>
      <div className={'Message__label'}>
        <Body>{label}</Body>
      </div>
      <div className={'Message__value'}>{value}</div>
    </div>
  );
};

const getInteractionHandler = (onInteraction, usage, message) => {
  const handlerProps = {};

  if (isFunction(onInteraction)) {
    handlerProps.handleClick = (event) => onInteraction(event, usage, message);
  }
  return handlerProps;
};

const commonProps = {
  /** optional - add any specific styling classes to this component */
  className: PropTypes.string,
  /** optional - indicate the first message */
  isFirst: PropTypes.bool,
  /** optional - Kafka message */
  message: PropTypes.shape({
    topic: PropTypes.string.isRequired,
    partition: PropTypes.number.isRequired,
    offset: PropTypes.number.isRequired,
    timestamp: PropTypes.number.isRequired,
    value: PropTypes.string.isRequired,
  }),
  /** optional - Error details **/
  error: PropTypes.shape({
    message: PropTypes.string,
  }),
  /** optional - interaction handler function */
  onInteraction: PropTypes.func,
};

const commonDefaultProps = {
  className: '',
};

Message.propTypes = {
  /** required - the style applied to this component */
  usage: PropTypes.string.isRequired,
  ...commonProps,
};

Message.defaultProps = {
  usage: CONSUMER,
  ...commonDefaultProps,
};

// high order component for specific Message types
const withMessageUsage = (usageChoice, name) => {
  // we want to set the type - so destructure and dont use type here
  // eslint-disable-next-line no-unused-vars
  const component = ({ usage, ...others }) => (
    <Message {...others} usage={usageChoice} />
  );
  component.displayName = name;
  component.propTypes = { ...commonProps };
  component.defaultProps = { ...commonDefaultProps };
  return component;
};

const ProducerMessage = withMessageUsage(PRODUCER, 'ProducerMessage');
const ConsumerMessage = withMessageUsage(CONSUMER, 'ConsumerMessage');

export { ProducerMessage, ConsumerMessage };
