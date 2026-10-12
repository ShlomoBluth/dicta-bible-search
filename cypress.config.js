const { defineConfig } = require('cypress')

module.exports = defineConfig({
  video: true,
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
  },
  reporter: 'cypress-multi-reporters',
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      require('./dicta-shared/videoCleanup')(on)
      return require('./cypress/plugins/index.js')(on, config)
    },
    baseUrl: 'https://dev--cranky-banach-377068.netlify.app/',
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
  },
})
