// jest.config.js
module.exports = {
  moduleDirectories: [
    'node_modules',
    'Utils',
    __dirname
  ],
  transform: {
    "^.+\\.js$": "babel-jest"
  },
  collectCoverage: true
}