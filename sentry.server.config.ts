import * as Sentry from "@sentry/nextjs";

Sentry.init({
    dsn: process.env.SENTRY_DSN,

    // Performance Monitoring
    tracesSampleRate: 1.0, // Capture 100% of transactions in dev, reduce in production

    // Release tracking
    release: process.env.VERCEL_GIT_COMMIT_SHA || 'development',

    // Environment
    environment: process.env.NODE_ENV,

    // Filter out noisy errors
    ignoreErrors: [
        "NEXT_NOT_FOUND",
        "NEXT_REDIRECT",
    ],
});
