const repoName = "profile";

/** @type {import('next').NextConfig} */
const nextConfig = {
  agentRules: false,
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  // Served as a GitHub Pages project site (https://<user>.github.io/profile/),
  // so every asset/link needs the repo name prefixed in production.
  basePath: process.env.GITHUB_PAGES ? `/${repoName}` : "",
  assetPrefix: process.env.GITHUB_PAGES ? `/${repoName}/` : "",
};

export default nextConfig;
