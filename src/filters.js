import { debugRenderComponent } from "./debug.js";

/**
 * Add filters for the component system
 * @param {Object} eleventyConfig - Eleventy configuration object
 */
export function addFilters(eleventyConfig) {
  /**
   * Render Component Filter
   *
   * A component template resolver that matches content items to their corresponding
   * component templates based on type. This filter enables dynamic component rendering
   * by finding the appropriate template for a given content item.
   *
   * @filter renderComponent
   * @since 1.0.0
   *
   * @description
   * This filter takes a content item with a 'type' property and searches through
   * the components collection to find a matching component template. The matching
   * is performed by comparing the slugified version of the component's title
   * (from frontmatter) with the slugified version of the item's type.
   *
   * @param {Object|Array} items - The content item(s) to find component templates for
   * @param {string} items.type - Required. The component type identifier (e.g., "callout", "hero", "text-and-image")
   * @param {*} [...items.props] - Optional. Any additional properties that will be passed to the component when rendered
   * @param {string} templateLang - Optional. Template language to use for rendering ("liquid", "njk", "vto", etc.). Defaults to "liquid"
   *
   * @returns {string} The fully rendered HTML content of the matching component(s), or empty string if no match found
   *
   * @example
   * // Component file: src/assets/components/callout.njk
   * // ---
   * // title: Callout
   * // ---
   * // <div class="callout">{{ heading }}</div>
   *
   * // Content item:
   * const item = {
   *   type: "callout",
   *   heading: "Important Notice",
   *   description: "This is important"
   * };
   *
   * // Template usage with single item:
   * {{ item | renderComponent("njk") | safe }}
   *
   * @example
   * // Template usage with array (no loop needed):
   * {{ components | renderComponent("njk") | safe }}
   *
   * @workflow
   * 1. Validates input item has required 'type' property
   * 2. Accesses the Eleventy components collection
   * 3. Loops through all available component templates
   * 4. Compares slugified component title with slugified item type
   * 5. Renders the matching component template with item data
   * 6. Returns fully rendered HTML content
   *
   * @dependencies
   * - Requires components collection to be populated (handled by plugin)
   * - Requires Eleventy's built-in slugify filter
   * - Uses EleventyRenderPlugin's renderContent filter internally for rendering
   *
   * @matching-logic
   * Component matching uses case-insensitive, URL-safe slug comparison:
   * - Component title "Text and Image" → slug "text-and-image"
   * - Item type "text-and-image" → slug "text-and-image"
   * - Match found ✅
   *
   * @error-handling
   * - Returns empty string for invalid/missing input
   * - Returns empty string if no matching component found
   * - Gracefully handles missing collections or component data
   * - No exceptions thrown, fails silently for template safety
   *
   * @performance-notes
   * - O(n) complexity where n = number of component templates
   * - First match wins, stops searching after finding match
   * - Consider component organization if using many templates
   *
   * @see {@link https://www.11ty.dev/docs/filters/} Eleventy Filters Documentation
   * @see {@link https://www.11ty.dev/docs/plugins/render/} Eleventy Render Plugin Documentation
   */

  // Render components filter - returns matched component templates
  eleventyConfig.addFilter("renderComponent", async function (items, lang) {
    // Early return if no items provided
    if (!items) {
      debugRenderComponent({ phase: "no-items" });
      return "";
    }

    // Normalize input to always be an array for consistent processing
    const itemsArray = Array.isArray(items) ? items : [items];

    // Filter out any items that don't have a required 'type' property
    const validItems = itemsArray.filter(item => item && item.type);

    // Early return if no valid items after filtering
    if (validItems.length === 0) {
      debugRenderComponent({ phase: "no-items" });
      return "";
    }

    // Log warning if some items were filtered out due to missing 'type'
    if (validItems.length < itemsArray.length) {
      debugRenderComponent({
        phase: "filtered-items",
        filteredCount: itemsArray.length - validItems.length,
        validItems
      });
    }

    // Get the components collection from Eleventy's context
    const collections = this.ctx.collections || this.collections;
    if (!collections || !collections.components) {
      debugRenderComponent({ phase: "no-collections" });
      return "";
    }

    // Get required filters from Eleventy
    const slugifyFilter = eleventyConfig.getFilter("slugify");
    const renderFilter = eleventyConfig.getFilter("renderContent");

    // Determine template language: use provided lang, or auto-detect from current page
    const templateLang = lang || (this.page && this.page.templateSyntax);

    // Log discovered components once on first render (avoids spam in logs)
    if (!this._componentsDebugLogged) {
      debugRenderComponent({
        phase: "components-list",
        components: collections.components,
        slugifyFilter
      });
      this._componentsDebugLogged = true;
    }

    debugRenderComponent({ phase: "render-start", validItems, lang: templateLang });

    // Pre-build list of available component slugs for error reporting
    const availableComponents = collections.components
      .filter(c => c.data && c.data.title)
      .map(c => slugifyFilter(c.data.title));

    const renderedComponents = [];

    // Process each valid item
    for (let i = 0; i < validItems.length; i++) {
      const item = validItems[i];
      let matched = false;

      // Search through all components for a matching type
      for (const component of collections.components) {
        if (component.data && component.data.title) {
          // Slugify both the component title and item type for comparison
          const componentSlug = slugifyFilter(component.data.title);
          const itemSlug = slugifyFilter(item.type);

          // Check if this component matches the item's type
          if (componentSlug === itemSlug) {
            // Merge component's default data with item data (item overrides defaults)
            const mergedData = { ...component.data, ...item };

            debugRenderComponent({
              phase: "match",
              validItems,
              itemIndex: i + 1,
              itemType: item.type,
              componentPath: component.inputPath || component.page?.inputPath || "unknown path",
              mergedData
            });

            // Render the component template with merged data
            const rendered = await renderFilter.call(this, component.rawInput, templateLang, mergedData);
            renderedComponents.push(rendered);
            matched = true;
            break; // Stop searching once we find a match
          }
        }
      }

      // Log if no matching component was found for this item
      if (!matched) {
        debugRenderComponent({
          phase: "no-match",
          itemIndex: i + 1,
          itemType: item.type,
          availableComponents
        });
      }
    }

    // Join all rendered components with newlines and return
    return renderedComponents.join("\n");
  });
}
