/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "export", // So that we can do static export
    reactStrictMode: true,
    images: {
        unoptimized: true,
    },
    swcMinify: true,
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
