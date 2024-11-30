import { withContentlayer } from "next-contentlayer"

/**
 * 使用skip_env_validation“运行构建”或“ dev”，以跳过设想验证。这特别有用
*用于Docker构建。
 */
await import("./src/env.js")

/** @type {import("next").NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
      },
    ],
    unoptimized: true,
  },
  // Already doing linting and typechecking as separate tasks in CI
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
}

export default withContentlayer(nextConfig)
