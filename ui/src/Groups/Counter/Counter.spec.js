import React from 'react';
import { Counter } from './index.js';
import { render } from 'TestUtils';

describe('Counter Group component', () => {
  const title = 'Test title here';
  const subtitle = 'Test subtitle here';
  const count = 123;
  const testClassName = 'testCssClass';

  const confirmHasContent = (contentExpected) => (content) =>
    content === contentExpected.toString(); // has the expected content

  const confirmHasClassName = (classNameExpected) => (content, node) =>
    node.classList.contains('Counter') && // has correct Block class
    node.classList.contains(classNameExpected); // has the expected classname

  it('renders the expected component', () => {
    const { getByText } = render(
      <Counter title={title} subtitle={subtitle} count={count} />
    );
    expect(getByText(confirmHasContent(title))).toBeInTheDocument();
    expect(getByText(confirmHasContent(subtitle))).toBeInTheDocument();
    expect(getByText(confirmHasContent(count))).toBeInTheDocument();
  });

  it('renders the expected component with a custom class name', () => {
    const { getByText } = render(
      <Counter
        title={title}
        subtitle={subtitle}
        count={count}
        className={testClassName}
      />
    );
    expect(getByText(confirmHasClassName(testClassName))).toBeInTheDocument();
    expect(getByText(confirmHasContent(title))).toBeInTheDocument();
    expect(getByText(confirmHasContent(subtitle))).toBeInTheDocument();
    expect(getByText(confirmHasContent(count))).toBeInTheDocument();
  });

  it('renders the expected component with a zero-padded count', () => {
    const { getByText } = render(
      <Counter title={title} subtitle={subtitle} count={5} />
    );
    expect(getByText(confirmHasContent(title))).toBeInTheDocument();
    expect(getByText(confirmHasContent(subtitle))).toBeInTheDocument();
    expect(getByText(confirmHasContent('05'))).toBeInTheDocument();
  });

  it('renders the expected component with a count greater than countLimit', () => {
    const { getByText } = render(
      <Counter title={title} subtitle={subtitle} count={101} countLimit={100} />
    );
    expect(getByText(confirmHasContent(title))).toBeInTheDocument();
    expect(getByText(confirmHasContent(subtitle))).toBeInTheDocument();
    expect(getByText(confirmHasContent('100+'))).toBeInTheDocument();
  });

  it('renders the expected component with a negative count', () => {
    const { getByText } = render(
      <Counter title={title} subtitle={subtitle} count={-5} />
    );
    expect(getByText(confirmHasContent(title))).toBeInTheDocument();
    expect(getByText(confirmHasContent(subtitle))).toBeInTheDocument();
    expect(getByText(confirmHasContent('00'))).toBeInTheDocument();
  });
});
