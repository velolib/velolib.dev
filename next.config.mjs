import { withContentCollections } from "@content-collections/next";
import createMDX from "@next/mdx";

/** @type {import('next').NextConfig} */
const nextConfig = {
  logging: {
    // browserToTerminal: true,
  },
  allowedDevOrigins: ["localhost", "127.0.0.1"],
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  serverExternalPackages: ["@takumi-rs/core"],
  redirects: async () => [
    {
      source: "/socials/github",
      destination: "https://github.com/velolib",
      permanent: false
    },
    {
      source: "/socials/x",
      destination: "https://x.com/vlocitize",
      permanent: false
    },
    {
      source: "/socials/discord",
      destination: "https://discord.com/users/689289283286466573",
      permanent: false
    },
    {
      source: "/socials/instagram",
      destination: "https://instagram.com/vlocitize",
      permanent: false
    },
    {
      source: "/socials/email",
      destination: "mailto:vlocitize@gmail.com",
      permanent: false
    },
    {
      source: "/socials/spotify",
      destination: "https://open.spotify.com/user/le2sdqta7f8158vtb62wc1nve",
      permanent: false
    },
  ]
};

const withMDX = createMDX({
  options: {
    remarkPlugins: ["remark-frontmatter", "remark-mdx-frontmatter"],
    rehypePlugins: [],
  },
});

export default withContentCollections(withMDX(nextConfig));