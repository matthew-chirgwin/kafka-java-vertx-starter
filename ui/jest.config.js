module.exports = {
  moduleDirectories: ['node_modules', 'TestUtils', __dirname],
  transform: {
    '^.+\\.jsx$': 'babel-jest',
    '^.+\\.js$': 'babel-jest',
  },
  collectCoverage: true,
  coverageReporters: ['json', 'text', 'json-summary'],
  collectCoverageFrom: [
    '**/src/**/*.{js,jsx}',
    '!**/TestUtils/*.js',
    '!**/*.json',
    '!**/*.stories.js',
    '!**/src/index.js',
  ],
  coverageDirectory: './coverage/jest/',
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 92,
      lines: 94,
      statements: 94,
    },
  },
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/coverage/',
    '/public/',
  ],
};
