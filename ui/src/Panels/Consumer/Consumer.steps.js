import React from 'react';
import { render, waitFor, fireEvent, act } from 'TestUtils';
import { Consumer } from './index.js';
import { consumerMockWebsocketForTest } from './Consumer.assets.js';

const topicName = 'test';

export const stepDefs = (cucumber) => {
  cucumber.defineRule('I have a Consumer panel', async (world) => {
    world.component = render(
      <Consumer
        getConsumerWebsocket={consumerMockWebsocketForTest()}
        topic={topicName}
      />
    );
    const { getByTestId } = world.component;
    // wait for the websocket to be come live
    await waitFor(() => {
      expect(getByTestId('consumer_button')).toBeInTheDocument();
      expect(getByTestId('consumer_button')).not.toBeDisabled();
    });
  });

  cucumber.defineRule(
    'I have a Consumer panel which experiences consumption errors',
    async (world) => {
      world.component = render(
        <Consumer
          getConsumerWebsocket={consumerMockWebsocketForTest(100, 0)}
          topic={topicName}
        />
      );
      const { getByTestId } = world.component;
      // wait for the websocket to be come live
      await waitFor(() => {
        expect(getByTestId('consumer_button')).toBeInTheDocument();
        expect(getByTestId('consumer_button')).not.toBeDisabled();
      });
    }
  );

  cucumber.defineRule(
    'I have a Consumer panel which has received {string} messages already',
    async (world, count) => {
      world.component = render(
        <Consumer
          getConsumerWebsocket={consumerMockWebsocketForTest(0, count)}
          topic={topicName}
        />
      );
      const { getByTestId, getAllByTestId } = world.component;
      // wait for the websocket to be come live
      await waitFor(() => {
        expect(getByTestId('consumer_button')).toBeInTheDocument();
        expect(getByTestId('consumer_button')).not.toBeDisabled();
        fireEvent.click(getByTestId('consumer_button'));
      });
      await waitFor(() => {
        expect(getAllByTestId('consumer_consumed_message').length).toBe(count);
        fireEvent.click(getByTestId('consumer_button'));
      });
    }
  );

  cucumber.defineRule('the consumer is running', (world) => {
    const { getByText } = world.component;
    expect(getByText('Stop consuming')).toBeInTheDocument();
  });

  cucumber.defineRule('the consumer is not running', (world) => {
    const { getByText } = world.component;
    expect(getByText('Start consuming')).toBeInTheDocument();
  });

  cucumber.defineRule('I start the consumer', async (world) => {
    await act(async () => {
      const { getByTestId, getByText } = world.component;
      expect(getByTestId('consumer_button')).toBeInTheDocument();
      expect(getByText('Start consuming')).toBeInTheDocument();
      fireEvent.click(getByTestId('consumer_button'));
      // wait for the websocket to start
      await waitFor(() => {
        expect(getByText('Stop consuming')).toBeInTheDocument();
      });
    });
  });

  cucumber.defineRule('I stop the consumer', async (world) => {
    await act(async () => {
      const { getByTestId, getByText } = world.component;
      expect(getByTestId('consumer_button')).toBeInTheDocument();
      expect(getByText('Stop consuming')).toBeInTheDocument();
      fireEvent.click(getByTestId('consumer_button'));
      // wait for the websocket to stop
      await waitFor(() => {
        expect(getByText('Start consuming')).toBeInTheDocument();
      });
    });
  });

  cucumber.defineRule(
    'it should display statistics about what has been consumed',
    async (world) => {
      await act(async () => {
        const { getByTestId, getByText, getAllByTestId } = world.component;
        expect(getByTestId('consumer_stats')).toBeInTheDocument();
        expect(getByText('Messages consumed')).toBeInTheDocument();
        expect(getByText(`from topic: ${topicName}`)).toBeInTheDocument();
        // wait for the count string to update/that we have that many messages
        await waitFor(() => {
          expect(getAllByTestId('consumer_consumed_message').length).toBe(1);
          expect(getByText('01')).toBeInTheDocument();
        });
      });
    }
  );

  cucumber.defineRule(
    'I should be shown error messages for those consumption failures',
    async (world) => {
      await act(async () => {
        const { getByText, getAllByTestId } = world.component;
        // wait for the number of messages to increase, but the count (of successful consumption remains the same)
        await waitFor(() => {
          expect(
            getAllByTestId('consumer_consumed_message').length
          ).toBeGreaterThan(0);
          expect(getByText('00')).toBeInTheDocument();
        });
      });
    }
  );
};
