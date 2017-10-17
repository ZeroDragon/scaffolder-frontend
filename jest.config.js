const env = {
  development: {
    verbose: true,
    bail: false,
    notify: true
  },
  test: {
    verbose: false,
    bail: true,
    collectCoverage: true,
    collectCoverageFrom: [
      'src/**/*.js',
      '!src/logger.js',
      '!src/**/index.js',
      '!src/**/config.js'
    ],
    coverageDirectory: 'coverage',
    coverageThreshold: {
      global: {
        branches: 80,
        functions: 80,
        lines: 80,
        statements: 80
      }
    }
  }
};

const config = {
  setupFiles: ['./config/setupGlobalVars.js'],
  setupTestFrameworkScriptFile: './node_modules/jasmine-expect/index.js',
  unmockedModulePathPatterns: ['jasmine-expect']
};

module.exports = Object.assign({}, config, env[process.env.ENVIRONMENT]);
