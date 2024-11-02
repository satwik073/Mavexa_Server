import * as Sentry from "@sentry/browser";

// Initialize Sentry with Worker-compatible configurations
Sentry.init({
  dsn: process.env.SENTRY_DSN, // Replace with actual DSN or use a secure environment solution
  integrations: [], // Add Worker-compatible integrations if needed
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  environment: "production", // Adjust this manually or dynamically if feasible
  release: "v1.0.0", // Set release version manually

  beforeSend(event, hint) {
    const error = hint.originalException;
    if (error && error?.status === 404) {
      return null; // Ignore 404 errors
    }
    return event;
  },

  beforeBreadcrumb(breadcrumb) {
    if (breadcrumb.category === 'http' && breadcrumb.data?.url.includes('/health-check')) {
      return null;
    }
    return breadcrumb;
  },
  autoSessionTracking: true,
  attachStacktrace: true,
  debug: true, // Adjust based on environment
});

// Example function to trigger and capture an error
const simulateError = () => {
  try {
    throw new Error("Simulated error for Sentry testing");
  } catch (error) {
    Sentry.captureException(error);
    console.log("Test error captured and sent to Sentry");
  }
};

simulateError();

// Default export for Cloudflare Worker compatibility
export default {
  async fetch(request) {
    try {
      // Worker logic here
      return new Response("Hello from Cloudflare Worker!", { status: 200 });
    } catch (error) {
      Sentry.captureException(error);
      return new Response("An error occurred", { status: 500 });
    }
  },
};

// import * as SentryUpdates from "@sentry/browser";
// const Sentry = require("@sentry/node");
// const { nodeProfilingIntegration } = require("@sentry/profiling-node");

// Sentry.init({
//   dsn: process.env.SENTRY_DSN,
//   integrations: [
//     nodeProfilingIntegration(),
//       SentryUpdates.replayIntegration(),
//   ],
//   tracesSampleRate: 1.0,
//   replaysSessionSampleRate: 0.1,
//   replaysOnErrorSampleRate: 1.0,
//   profilesSampleRate: 1.0,
//   environment: process.env.NODE_ENV || 'development',
//   release: process.env.RELEASE || 'v1.0.0',
//   beforeSend(event: any, hint: { originalException: any; }) {
//     const error = hint.originalException;
//     if (error && error.status === 404) {
//       return null; 
//     }
//     return event;
//   },
//   beforeBreadcrumb(breadcrumb: { category: string; data: { url: string | string[]; }; }, hint: any) {
//     if (breadcrumb.category === 'http' && breadcrumb.data.url.includes('/health-check')) {
//       return null;
//     }
//     return breadcrumb;
//   },
//   autoSessionTracking: true, 
//   attachStacktrace: true,
//   debug: process.env.NODE_ENV === 'development'
// });

// const simulateError = () => {
//   try {
//     throw new Error("Simulated advanced error for Sentry testing");
//   } catch (error) {
//     Sentry.captureException(error);
//     console.log("Test error captured and sent to Sentry");
//   }
// };

// simulateError();
// process.on("unhandledRejection", (reason, promise) => {
//   console.log("Unhandled Rejection:", reason);
//   Sentry.captureException(reason); 
// });
// console.log("✅ Sentry initialized with advanced options for profiling, tracing, and error filtering");
