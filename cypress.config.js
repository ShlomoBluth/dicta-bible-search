const { defineConfig } = require('cypress')

module.exports = defineConfig({
  projectId: 'y4wdqf',
  enableServiceWorkers: false,
  defaultCommandTimeout: 20000,
  reporterOptions: {
    configFile: 'searchShared/configure/reporter-config.json',
  },
  env: {
    DEV_URL: 'https://dev--cranky-banach-377068.netlify.app/',
    LIVE_URL: 'https://search.dicta.org.il',
    configFile: 'config',
    TOOL_TESTS: true,
    REQUESTS_TESTS: true,
    RECORD_KEY: 'f015ae7b-ed3d-4a35-a648-8c1428f03e3c',
  },
  reporter: 'cypress-multi-reporters',
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require('./cypress/plugins/index.js')(on, config)
    },
    baseUrl: 'https://dev--cranky-banach-377068.netlify.app/',
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
  },
})
