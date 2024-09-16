// Import with `import * as Sentry from "@sentry/node"` if you are using ESM
import * as SentryUpdates from "@sentry/browser";
const Sentry = require("@sentry/node");
const { nodeProfilingIntegration } = require("@sentry/profiling-node");

Sentry.init({
  dsn: "https://533babc71d639f0b928321d7900e796f@o4507854423916544.ingest.us.sentry.io/4507854430535680",
  integrations: [
    nodeProfilingIntegration(),
      SentryUpdates.replayIntegration(),
  ],
  // Tracing
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0,
  // Set sampling rate for profiling - this is relative to tracesSampleRate
  profilesSampleRate: 1.0,
});