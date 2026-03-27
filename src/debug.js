const PLUGIN_NAME = "eleventy-plugin-reusable-components";
let DEBUG_ENABLED = false;

/**
 * Enable or disable debug output
 * @param {boolean} enabled - Whether debug is enabled
 */
export function setDebugEnabled(enabled) {
  DEBUG_ENABLED = enabled;
}

/**
 * Debug logging utilities for the plugin
 * Uses Eleventy's standard debug format
 */

/**
 * Log a debug message with the plugin prefix
 * @param {string} message - The message to log
 * @param {number} indent - Indentation level (0-2)
 */
export function debug(message, indent = 0) {
  if (!DEBUG_ENABLED) return;

  const prefix = "[11ty]";
  const pluginPrefix = `[${PLUGIN_NAME}]`;
  const indentation = "  ".repeat(indent);
  console.log(`${prefix} ${pluginPrefix} ${indentation}${message}`);
}

/**
 * Log plugin initialization with options
 * @param {Object} options - Plugin options
 */
export function debugInit(options) {
  debug("Plugin initialized with options:");
  debug(`componentsDir: "${options.componentsDir}"`, 1);
  debug(`collectionName: "${options.collectionName}"`, 1);
  debug(`enableRenderPlugin: ${options.enableRenderPlugin}`, 1);
  debug(`output: ${options.output}`, 1);
  debug(`ELEVENTY_ENV: "${process.env.ELEVENTY_ENV || "development"}"`, 1);
}

/**
 * Log production mode detection
 * @param {string} componentsDir - The components directory pattern
 */
export function debugProductionMode(componentsDir) {
  debug("Production mode detected");
  debug(`Ignoring components directory: ${componentsDir}`, 1);
}

/**
 * Log discovered components
 * @param {Array} components - Array of component objects
 * @param {Function} slugifyFilter - Eleventy's slugify filter
 */
export function debugComponents(components, slugifyFilter) {
  debug(`Found ${components.length} component${components.length !== 1 ? "s" : ""}:`);

  if (components.length === 0) {
    debug("⚠ No components found", 1);
    return;
  }

  components.forEach(component => {
    if (component.data && component.data.title) {
      const title = component.data.title;
      const slug = slugifyFilter(title);
      const path = component.inputPath || component.page?.inputPath || "unknown path";
      debug(`✓ ${title} (${slug}) → ${path}`, 1);
    }
  });
}

/**
 * Log renderComponent filter call
 * @param {Array} items - Array of items to render
 * @param {string} lang - Template language
 */
export function debugRenderStart(items, lang) {
  debug("renderComponent called:");
  debug(`Items: ${items.length}`, 1);
  debug(`Template language: ${lang || "auto-detect"}`, 1);
  debug("", 1); // Empty line for readability
}

/**
 * Log warning when no items provided
 */
export function debugNoItems() {
  debug("⚠ Warning: No items provided");
  debug("Returning empty string", 1);
}

/**
 * Log warning when items are filtered out
 * @param {number} filteredCount - Number of items filtered out
 * @param {number} validCount - Number of valid items remaining
 */
export function debugFilteredItems(filteredCount, validCount) {
  debug(`⚠ Warning: ${filteredCount} item${filteredCount !== 1 ? "s" : ""} without 'type' property ${filteredCount !== 1 ? "were" : "was"} filtered out`);
  debug(`Valid items: ${validCount}`, 1);
}

/**
 * Log component match success
 * @param {number} itemIndex - Index of the item (1-based)
 * @param {string} type - Component type
 * @param {string} componentPath - Path to component file
 * @param {Object} mergedData - Merged data object
 */
export function debugMatchSuccess(itemIndex, type, componentPath, mergedData) {
  debug(`Item ${itemIndex}:`, 1);
  debug(`Type: ${type}`, 2);
  debug(`Match: ✓ ${type}`, 2);
  debug(`Component: ${componentPath}`, 2);
  debug(`Merged data keys: ${Object.keys(mergedData).join(", ")}`, 2);
}

/**
 * Log component match success (simplified for multiple items)
 * @param {number} itemIndex - Index of the item (1-based)
 * @param {string} type - Component type
 */
export function debugMatchSuccessSimple(itemIndex, type) {
  debug(`Item ${itemIndex}:`, 1);
  debug(`Type: ${type}`, 2);
  debug(`Match: ✓ ${type}`, 2);
}

/**
 * Log component match failure
 * @param {number} itemIndex - Index of the item (1-based)
 * @param {string} type - Component type that wasn't found
 * @param {Array} availableComponents - Array of available component slugs
 */
export function debugMatchFailure(itemIndex, type, availableComponents) {
  debug(`Item ${itemIndex}:`, 1);
  debug(`Type: ${type}`, 2);
  debug("Match: ✗ No matching component found", 2);
  if (availableComponents.length > 0) {
    debug(`Available: ${availableComponents.join(", ")}`, 2);
  }
}

/**
 * Log warning when collections are missing
 */
export function debugNoCollections() {
  if (!DEBUG_ENABLED) return;
  debug("⚠ Warning: Collections not available or components collection is empty");
  debug("Returning empty string", 1);
}

/**
 * Debug wrapper for renderComponent filter
 * Handles all debug logging for the filter lifecycle
 */
export function debugRenderComponent(context) {
  if (!DEBUG_ENABLED) return;

  const {
    phase,
    validItems,
    filteredCount,
    lang,
    itemIndex,
    itemType,
    componentPath,
    mergedData,
    availableComponents,
    components,
    slugifyFilter
  } = context;

  switch (phase) {
  case "no-items":
    debugNoItems();
    break;

  case "filtered-items":
    debugFilteredItems(filteredCount, validItems.length);
    break;

  case "no-collections":
    debugNoCollections();
    break;

  case "components-list":
    debugComponents(components, slugifyFilter);
    break;

  case "render-start":
    debugRenderStart(validItems, lang);
    break;

  case "match":
    if (validItems.length === 1) {
      debugMatchSuccess(itemIndex, itemType, componentPath, mergedData);
    } else {
      debugMatchSuccessSimple(itemIndex, itemType);
    }
    break;

  case "no-match":
    debugMatchFailure(itemIndex, itemType, availableComponents);
    break;
  }
}
