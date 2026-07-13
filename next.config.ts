import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_PAGES === 'true';

const nextConfig: NextConfig = {
  output: isGithubPages ? 'export' : 'standalone',
  basePath: isGithubPages ? '/hello-park-invite' : '',
  assetPrefix: isGithubPages ? '/hello-park-invite/' : undefined,
  images: {
    unoptimized: isGithubPages, // Required for next export
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
