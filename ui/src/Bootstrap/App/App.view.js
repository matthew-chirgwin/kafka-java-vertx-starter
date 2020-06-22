//Disable while stubbing out the panels
/* eslint-disable react/no-multi-comp */
import React from 'react';
import { useTranslate } from 'ReactCustomHooks/useTranslate/useTranslate.hook.js';
import { Body, Subheading, Heading } from 'Elements/Text';
import translations from './i18n.json';
import { PropTypes } from 'prop-types';
import clsx from 'clsx';

const Producer = () => <div>Example Producer</div>;
const Consumer = () => <div>Example Consumer</div>;

const App = (props) => {
  const translate = useTranslate(translations);
  const { consumer, producer, className } = props;
  return (
    <div className={clsx('App', className)}>
      <img alt={translate('logo_alt', {}, true)} />
      <div>
        <Subheading>{translate('subheading')}</Subheading>
      </div>
      <div>
        <Heading>{translate('heading')}</Heading>
      </div>
      <div>
        <Body>{translate('body')}</Body>
      </div>
      {producer && <Producer />}
      {consumer && <Consumer />}
    </div>
  );
};

App.propTypes = {
  consumer: PropTypes.bool,
  producer: PropTypes.bool,
  className: PropTypes.string,
};

App.defaultProps = {
  consumer: false,
  producer: false,
};

export { App };
