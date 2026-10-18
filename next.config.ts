import type { NextConfig } from "next";
import { getSanityEnvironment } from './src/sanity/env';

const sanity = getSanityEnvironment();

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    remotePatterns: sanity.configured ? [{ protocol: 'https', hostname: 'cdn.sanity.io', port: '', pathname: `/images/${sanity.value.projectId}/${sanity.value.dataset}/**` }] : [],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
