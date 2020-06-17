/* eslint-disable react/no-multi-comp */ // disabled as we have a hoc funtion in file
import React from 'react';
import PropTypes from 'prop-types';

import { Body, BODY, Subheading, Text } from '../../Elements/Text/index.js';

const Counter = (props) => {
  const { title, subtitle, count, countLimit, className, ...others } = props;
  const classesToApply = `Counter${className ? ` ${className}` : ''}`;

  let countValue = count;
  if (count < 0) {
    countValue = '00';
  } else if (count < 10) {
    countValue = '0' + count;
  } else if (count > countLimit) {
    countValue = countLimit + '+';
  }

  return (
    <div {...others} className={classesToApply}>
      <div className={'Counter--title'}>
        <Subheading>{title}</Subheading>
      </div>
      <div className={'Counter--subtitle'}>
        <Body>{subtitle}</Body>
      </div>
      <div className={'Counter--count'}>
        <Text type={BODY} className={'Counter--countValue'}>
          {countValue}
        </Text>
      </div>
    </div>
  );
};

Counter.propTypes = {
  /** required - the Counter title  */
  title: PropTypes.string.isRequired,
  /** required - the Counter subtitle  */
  subtitle: PropTypes.string.isRequired,
  /** required - the Counter value. A non-negative integer */
  count: PropTypes.number.isRequired,
  /** optional - add any specific styling classes to this component */
  className: PropTypes.string,
  /** optional - the maximum limit of the Counter value that is displayed, defaults to 9999 */
  countLimit: PropTypes.number,
};

Counter.defaultProps = {
  className: '',
  countLimit: 9999,
};

export { Counter };
