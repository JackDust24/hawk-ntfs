/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "export",
    reactStrictMode: true,
    images: {
        unoptimized: true,
    },
    swcMinify: true,
    webpack: (config) => {
        config.externals.push("pino-pretty", "lokijs", "encoding")
        return config
    },
    async rewrites() {
        return [
            {
                source: "/",
                destination: "/home",
            },
        ]
    },
}
module.exports = nextConfig
