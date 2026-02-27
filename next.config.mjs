/** @type {import('next').NextConfig} */
const nextConfig = {
    // Enable response compression
    compress: true,
    // Enable experimental features for better performance
    experimental: {
        optimizePackageImports: ['recharts', 'framer-motion'],
    },
    env: {
        NEXT_PUBLIC_BUILD_TIME: new Date().toISOString(),
    },
    headers: async () => [
        {
            source: '/(.*)',
            headers: [
                { key: 'X-Frame-Options', value: 'DENY' },
                { key: 'X-Content-Type-Options', value: 'nosniff' },
                { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
                { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
                { key: 'X-XSS-Protection', value: '1; mode=block' },
                { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
                {
                    key: 'Content-Security-Policy',
                    value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com; frame-src 'self' https://accounts.google.com;"
                },
            ]
        }
    ]
};

export default nextConfig;
