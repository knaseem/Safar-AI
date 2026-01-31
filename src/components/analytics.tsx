"use client"

import Script from "next/script"

/**
 * Google Analytics 4 Integration
 * Add NEXT_PUBLIC_GA_MEASUREMENT_ID to your environment variables
 */
export function Analytics() {
    const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

    // Don't render anything if GA ID is not set
    if (!GA_ID) return null

    return (
        <>
            <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
                strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
                {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${GA_ID}', {
                        page_path: window.location.pathname,
                    });
                `}
            </Script>
        </>
    )
}

/**
 * Track custom events
 * Usage: trackEvent('button_click', { button_name: 'book_now' })
 */
export function trackEvent(action: string, params?: Record<string, any>) {
    if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', action, params)
    }
}

/**
 * Track page views (useful for SPAs)
 * Usage: trackPageView('/dashboard')
 */
export function trackPageView(url: string) {
    if (typeof window !== 'undefined' && (window as any).gtag) {
        const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
        if (GA_ID) {
            (window as any).gtag('config', GA_ID, {
                page_path: url,
            })
        }
    }
}
