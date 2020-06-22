import React from 'react';
import { ProducerMessages, ConsumerMessages } from './index.js';
import { fireEvent, render } from 'TestUtils';

describe('Messages Element component', () => {
  const testClassName = 'testCssClass';
  const testMessage = {
    status: 'SUCCESS',
    index: 15,
    topic: 'demo',
    partition: 2,
    offset: 1000,
    timestamp: new Date().getTime(),
    value: 'Test value data',
  };
  const testError = {
    message: 'Test error',
    status: 'ERROR',
    index: 17,
  };
  const testMessages = [
    {
      ...testMessage,
    },
    {
      ...testMessage,
      offset: 1001,
      status: 'SUCCESS',
      index: 16,
    },
    {
      ...testError,
    },
  ];

  const confirmHasClassNames = (...classNamesExpected) => (content, node) =>
    classNamesExpected.every((className) => node.classList.contains(className)); // has all the expected classnames

  describe('ConsumerMessages component', () => {
    it('renders the expected component', () => {
      const { getAllByText, getByText } = render(
        <ConsumerMessages messages={testMessages} />
      );
      expect(
        getByText(confirmHasClassNames('Messages', 'Messages--consumer'))
      ).toBeInTheDocument();
      expect(
        getAllByText(confirmHasClassNames('Message', 'Message--consumer'))
          .length
      ).toBe(3);
      expect(
        getByText(
          confirmHasClassNames(
            'Message',
            'Message--consumer',
            'Message--consumer-first'
          )
        )
      ).toBeInTheDocument();
      expect(
        getByText(
          confirmHasClassNames(
            'Message',
            'Message--consumer',
            'Message--consumer-error'
          )
        )
      ).toBeInTheDocument();
    });

    it('renders the expected component with a custom class name', () => {
      const { getByText } = render(
        <ConsumerMessages messages={testMessages} className={testClassName} />
      );
      expect(
        getByText(
          confirmHasClassNames('Messages', 'Messages--consumer', testClassName)
        )
      ).toBeInTheDocument();
    });

    it('renders the expected component with an interaction handler function', () => {
      const testOnInteraction = jest.fn();
      const { getAllByText } = render(
        <ConsumerMessages
          messages={testMessages}
          onInteraction={testOnInteraction}
        />
      );

      expect(testOnInteraction).toHaveBeenCalledTimes(0);
      fireEvent.click(
        getAllByText(confirmHasClassNames('Message__tile--consumer'))[0]
      );
      expect(testOnInteraction).toHaveBeenCalledTimes(1);
      expect(testOnInteraction).toHaveBeenCalledWith(
        expect.anything(),
        'consumer',
        testMessage
      );
    });

    it('renders the expected component with an empty messages list', () => {
      const { getByText } = render(<ConsumerMessages messages={[]} />);
      expect(
        getByText(
          confirmHasClassNames(
            'Messages',
            'Messages--consumer',
            'Messages--consumer-empty'
          )
        )
      ).toBeInTheDocument();
      expect(
        getByText(
          confirmHasClassNames('Messages__empty', 'Messages__empty--consumer')
        )
      ).toBeInTheDocument();
    });
  });

  describe('ProducerMessages component', () => {
    it('renders the expected component', () => {
      const { getAllByText, getByText } = render(
        <ProducerMessages messages={testMessages} />
      );
      expect(
        getByText(confirmHasClassNames('Messages', 'Messages--producer'))
      ).toBeInTheDocument();
      expect(
        getAllByText(confirmHasClassNames('Message', 'Message--producer'))
          .length
      ).toBe(3);
      expect(
        getByText(
          confirmHasClassNames(
            'Message',
            'Message--producer',
            'Message--producer-first'
          )
        )
      ).toBeInTheDocument();
      expect(
        getByText(
          confirmHasClassNames(
            'Message',
            'Message--producer',
            'Message--producer-error'
          )
        )
      ).toBeInTheDocument();
    });

    it('renders the expected component with a custom class name', () => {
      const { getByText } = render(
        <ProducerMessages messages={testMessages} className={testClassName} />
      );
      expect(
        getByText(
          confirmHasClassNames('Messages', 'Messages--producer', testClassName)
        )
      ).toBeInTheDocument();
    });

    it('renders the expected component with an interaction handler function', () => {
      const testOnInteraction = jest.fn();
      const { getAllByText } = render(
        <ProducerMessages
          messages={testMessages}
          onInteraction={testOnInteraction}
        />
      );

      expect(testOnInteraction).toHaveBeenCalledTimes(0);
      fireEvent.click(
        getAllByText(confirmHasClassNames('Message__tile--producer'))[0]
      );
      expect(testOnInteraction).toHaveBeenCalledTimes(1);
      expect(testOnInteraction).toHaveBeenCalledWith(
        expect.anything(),
        'producer',
        testMessage
      );
    });

    it('renders the expected component with an empty messages list', () => {
      const { getByText } = render(<ProducerMessages messages={[]} />);
      expect(
        getByText(
          confirmHasClassNames(
            'Messages',
            'Messages--producer',
            'Messages--producer-empty'
          )
        )
      ).toBeInTheDocument();
      expect(
        getByText(
          confirmHasClassNames('Messages__empty', 'Messages__empty--producer')
        )
      ).toBeInTheDocument();
    });
  });
});
