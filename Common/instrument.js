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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Sentry = __importStar(require("@sentry/browser"));
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
        if (error && (error === null || error === void 0 ? void 0 : error.status) === 404) {
            return null; // Ignore 404 errors
        }
        return event;
    },
    beforeBreadcrumb(breadcrumb) {
        var _a;
        if (breadcrumb.category === 'http' && ((_a = breadcrumb.data) === null || _a === void 0 ? void 0 : _a.url.includes('/health-check'))) {
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
    }
    catch (error) {
        Sentry.captureException(error);
        console.log("Test error captured and sent to Sentry");
    }
};
simulateError();
// Default export for Cloudflare Worker compatibility
exports.default = {
    fetch(request) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Worker logic here
                return new Response("Hello from Cloudflare Worker!", { status: 200 });
            }
            catch (error) {
                Sentry.captureException(error);
                return new Response("An error occurred", { status: 500 });
            }
        });
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
//# sourceMappingURL=instrument.js.map