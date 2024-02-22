import createNextIntlPlugin from "next-intl/plugin";
import { InjectManifest } from "workbox-webpack-plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    if (!isServer) {
      config.plugins.push(
        new InjectManifest({
          swSrc: "./sw.ts",
          swDest: "../public/sw.js",
          include: ["__nothing__"],
        })
      );
    }

    return config;
  },
};

export default withNextIntl(nextConfig);
