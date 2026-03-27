/**
 * Default configuration options
 */
export const defaultOptions = {
  componentsDir: "src/components/*.*",
  collectionName: "components",
  enableRenderPlugin: true,
  output: true,
  debug: process.env.DEBUG === "Eleventy:*" || process.env.DEBUG === "true"
};
