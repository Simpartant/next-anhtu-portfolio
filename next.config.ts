import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin({
  experimental: {
    createMessagesDeclaration: "./messages/en.json",
  },
});

const config: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/:locale/api/:path*",
        destination: "/api/:path*",
      },
    ];
  },
  // images: {
  //   domains: ["storage.googleapis.com"],
  // },
};

export default withNextIntl(config);
