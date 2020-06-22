import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, number } from '@storybook/addon-knobs';
import { withInfo } from '@storybook/addon-info';
import { action } from '@storybook/addon-actions';
import { ConsumerMessages, ProducerMessages } from './index.js';
import MessagesReadme from './README.md';

const defaultMessages = [
  {
    status: 'SUCCESS',
    index: 14,
    topic: 'mock_topic',
    partition: 0,
    offset: 13,
    timestamp: 1592578829809,
    value: 'Content!',
  },
  {
    status: 'ERROR',
    index: 15,
    message: 'Failed!',
  },
  {
    status: 'SUCCESS',
    index: 16,
    topic: 'mock_topic',
    partition: 1,
    offset: 13,
    timestamp: 1592578830809,
    value: 'Content!',
  },
  {
    status: 'SUCCESS',
    index: 17,
    topic: 'mock_topic',
    partition: 0,
    offset: 14,
    timestamp: 1592578831809,
    value: 'Content!',
  },
  {
    status: 'SUCCESS',
    index: 18,
    topic: 'mock_topic',
    partition: 0,
    offset: 15,
    timestamp: 1592578832809,
    value: 'Content!',
  },
  {
    status: 'ERROR',
    index: 19,
    message: 'Failed!',
  },
];

const renderHelper = (
  Component,
  messages = defaultMessages,
  defaultClassName
) => () => {
  const className = text('Custom CSS classname', defaultClassName);
  let props = {
    messages,
    className,
    onInteraction: action('onInteraction'),
  };

  return <Component {...props} />;
};

storiesOf('Groups/Messages', module)
  .addDecorator(withKnobs)
  .addDecorator(withInfo)
  .addParameters({
    readme: {
      sidebar: MessagesReadme,
    },
  })
  .add(
    'ConsumerMessage component (default props)',
    renderHelper(ConsumerMessages)
  )
  .add(
    'ProducerMessage component (default props)',
    renderHelper(ProducerMessages)
  )
  .add(
    'ConsumerMessage component with empty messages list',
    renderHelper(ConsumerMessages, [])
  )
  .add(
    'ProducerMessage component with empty messages list',
    renderHelper(ProducerMessages, [])
  );
