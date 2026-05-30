import { withContentCollections } from "@content-collections/next";
import createMDX from "@next/mdx";

/** @type {import('next').NextConfig} */
const nextConfig = {
  logging: {
    // browserToTerminal: true,
  },
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
};

const withMDX = createMDX({
  options: {
    remarkPlugins: ["remark-frontmatter", "remark-mdx-frontmatter"],
    rehypePlugins: [],
  },
});

export default withContentCollections(withMDX(nextConfig));