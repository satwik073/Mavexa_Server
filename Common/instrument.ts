
import * as SentryUpdates from "@sentry/browser";
const Sentry = require("@sentry/node");
const { nodeProfilingIntegration } = require("@sentry/profiling-node");

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [
    nodeProfilingIntegration(),
      SentryUpdates.replayIntegration(),
  ],
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  profilesSampleRate: 1.0,
  environment: process.env.NODE_ENV || 'development',
  release: process.env.RELEASE || 'v1.0.0',
  beforeSend(event: any, hint: { originalException: any; }) {
    const error = hint.originalException;
    if (error && error.status === 404) {
      return null; 
    }
    return event;
  },
  beforeBreadcrumb(breadcrumb: { category: string; data: { url: string | string[]; }; }, hint: any) {
    if (breadcrumb.category === 'http' && breadcrumb.data.url.includes('/health-check')) {
      return null;
    }
    return breadcrumb;
  },
  autoSessionTracking: true, 
  attachStacktrace: true,
  debug: process.env.NODE_ENV === 'development'
});

const simulateError = () => {
  try {
    throw new Error("Simulated advanced error for Sentry testing");
  } catch (error) {
    Sentry.captureException(error);
    console.log("Test error captured and sent to Sentry");
  }
};

simulateError();
process.on("unhandledRejection", (reason, promise) => {
  console.log("Unhandled Rejection:", reason);
  Sentry.captureException(reason); 
});
console.log("✅ Sentry initialized with advanced options for profiling, tracing, and error filtering");
