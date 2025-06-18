// import { playwrightLauncher } from '@web/test-runner-playwright';
import { puppeteerLauncher } from '@web/test-runner-puppeteer';

export default {
  files: 'test/**/*.test.js',
  nodeResolve: true,
  browsers: [
    puppeteerLauncher({
      executablePath:
        '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      launchOptions: {
        headless: true,
        args: ['--no-sandbox'],
      },
    }),
  ],
};

/** Compile JS for older browsers. Requires @web/dev-server-esbuild plugin */
// esbuildTarget: 'auto',

/** Confgure bare import resolve plugin */
// nodeResolve: {
//   exportConditions: ['browser', 'development']
// },

/** Amount of browsers to run concurrently */
// concurrentBrowsers: 2,

/** Amount of test files per browser to test concurrently */
// concurrency: 1,

/** Browsers to run tests on */
// browsers: [
//   playwrightLauncher({ product: 'chromium' }),
//   playwrightLauncher({ product: 'firefox' }),
//   playwrightLauncher({ product: 'webkit' }),
// ],

// See documentation for all available options
