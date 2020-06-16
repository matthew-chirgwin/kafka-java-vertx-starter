const baseJest = require('./jest.config.base.js');

module.exports = {
  ...baseJest,
  preset: 'jest-playwright-preset',
  testRegex: '.*\\.(test|spec)\\.e2e\\.js',
};
