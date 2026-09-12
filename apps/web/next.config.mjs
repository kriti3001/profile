const repoName = "profile";

/** @type {import('next').NextConfig} */
const nextConfig = {
  agentRules: false,
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  // Served as a GitHub Pages project site (https://<user>.github.io/profile/),
  // so every asset/link needs the repo name prefixed in production.
  //
  // Azure Static Web Apps is served from its own domain root, so its deploy
  // workflow must NOT set GITHUB_PAGES — leaving it unset resolves
  // basePath/assetPrefix to empty strings, which is correct for that target.
  basePath: process.env.GITHUB_PAGES ? `/${repoName}` : "",
  assetPrefix: process.env.GITHUB_PAGES ? `/${repoName}/` : "",
};

export default nextConfig;
