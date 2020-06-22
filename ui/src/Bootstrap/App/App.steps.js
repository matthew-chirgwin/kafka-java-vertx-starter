import { render } from 'TestUtils';
import React from 'react';
import { App } from './App.view.js';

const stepDefs = (cucumber) => {
  cucumber.defineRule('I have an instance of App', (world) => {
    const { props } = world;
    world.rendered = render(<App {...props} />);
  });
};

export { stepDefs };
