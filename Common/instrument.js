"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const SentryUpdates = __importStar(require("@sentry/browser"));
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
    beforeSend(event, hint) {
        const error = hint.originalException;
        if (error && error.status === 404) {
            return null;
        }
        return event;
    },
    beforeBreadcrumb(breadcrumb, hint) {
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
    }
    catch (error) {
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
//# sourceMappingURL=instrument.js.map