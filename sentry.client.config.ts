import * as Sentry from "@sentry/nextjs";

Sentry.init({
    dsn: process.env.SENTRY_DSN,

    // Performance Monitoring
    tracesSampleRate: 1.0, // Capture 100% of transactions in dev, reduce in production

    // Session Replay (optional)
    replaysSessionSampleRate: 0.1, // Sample 10% of sessions
    replaysOnErrorSampleRate: 1.0, // Sample 100% of sessions with errors

    // Release tracking
    release: process.env.VERCEL_GIT_COMMIT_SHA || 'development',

    // Environment
    environment: process.env.NODE_ENV,

    // Integrations
    integrations: [
        Sentry.replayIntegration({
            maskAllText: true,
            blockAllMedia: true,
        }),
    ],

    // Filter out noisy errors
    ignoreErrors: [
        // Common browser errors
        "ResizeObserver loop limit exceeded",
        "ResizeObserver loop completed with undelivered notifications",
        // Network errors
        "Failed to fetch",
        "NetworkError",
        "Load failed",
    ],
});
