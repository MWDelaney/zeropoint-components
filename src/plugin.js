import { EleventyRenderPlugin } from "@11ty/eleventy";
import { defaultOptions } from "./config.js";
import { addCollections } from "./collections.js";
import { addFilters } from "./filters.js";
import { setDebugEnabled, debugInit, debugProductionMode } from "./debug.js";

/**
 * Universal Components for Eleventy Plugin
 *
 * A configurable plugin for adding universal components to your Eleventy project.
 *
 * @param {Object} options - Configuration options for the plugin
 * @param {string} [options.componentsDir="src/assets/components/*.njk"] - Glob pattern for component files
 * @param {string} [options.collectionName="components"] - Name of the components collection
 * @param {boolean} [options.enableRenderPlugin=true] - Whether to enable the Eleventy Render Plugin
 * @param {boolean} [options.excludeFromProduction=true] - Whether to exclude components from production builds
 * @param {boolean} [options.debug=false] - Whether to enable debug output
 *
 * Collections:
 * - `components` (or custom name): A collection of components sourced from the components directory.
 *
 * Plugins:
 * - `EleventyRenderPlugin`: A plugin for advanced rendering capabilities in Eleventy.
 *
 */
export function reusableComponents(eleventyConfig, userOptions = {}) {
  // Merge user options with defaults
  const options = { ...defaultOptions, ...userOptions };

  // Configure debug output
  setDebugEnabled(options.debug);
  debugInit(options);

  /**
   * Add the Eleventy Render Plugin.
   * Check if the plugin is already enabled before enabling it.
   */
  if (options.enableRenderPlugin && (!eleventyConfig.plugins || !eleventyConfig.plugins.includes(EleventyRenderPlugin))) {
    eleventyConfig.addPlugin(EleventyRenderPlugin);
  }

  /**
   * Exclude components from builds
   */
  if (options.output == false) {
    eleventyConfig.ignores.add(options.componentsDir);
    debugProductionMode(options.componentsDir);
  }

  // Add collections
  addCollections(eleventyConfig, options);

  // Add filters
  addFilters(eleventyConfig, options);
}
