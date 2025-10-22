import { glob } from "fs/promises";
import matter from "gray-matter";
import { readFileSync } from "fs";
import path from "path";

/**
 * Add components collection to Eleventy
 * @param {Object} eleventyConfig - Eleventy configuration object
 * @param {Object} options - Plugin options
 */
export function addCollections(eleventyConfig, options) {
  /**
   * Components Collection
   * This collection includes all components from the configured components directory.
   * Uses manual globbing to allow components outside the Eleventy input directory.
   */
  eleventyConfig.addCollection(options.collectionName, async function() {
    // Manually glob files from the components directory using Node's fs.glob (Node 20+)
    const componentFiles = await Array.fromAsync(glob(options.componentsDir));

    // Process each component file to extract frontmatter and content
    const components = componentFiles.map(filePath => {
      const fileContent = readFileSync(filePath, "utf-8");
      const { data, content } = matter(fileContent);

      return {
        data: data,
        rawInput: content,
        inputPath: filePath,
        page: {
          inputPath: filePath,
          fileSlug: path.basename(filePath, path.extname(filePath))
        }
      };
    });

    return components;
  });
}
