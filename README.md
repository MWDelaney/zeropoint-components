![components-logo](https://github.com/user-attachments/assets/cbf508d8-2d83-4d4c-bc86-17af45c626f7)

# ZeroPoint Reusable Components 

[![npm version](https://img.shields.io/npm/v/eleventy-plugin-reusable-components.svg)](https://www.npmjs.com/package/eleventy-plugin-reusable-components)
[![Tests](https://github.com/MWDelaney/eleventy-plugin-components/workflows/🧪%20Run%20Tests/badge.svg)](https://github.com/MWDelaney/eleventy-plugin-components/actions) 

A configurable [BuildAwesome](https://www.11ty.dev/) plugin that enables a powerful component system for building dynamic, reusable HTML components across your static site.

👉 Build your components once and use them anywhere.

## Features

- 🧩 **Dynamic Component Rendering** - Render components based on content data
- 🎨 **Template Language Agnostic** - Works with Nunjucks, Liquid, WebC, Vento, and more
- 🏗️ **Flexible Configuration** - Customizable directories and options
- 🚀 **Output Control** - Choose whether components are written to their own output files
- 🔧 **Developer Friendly** - Comprehensive error handling and debugging

## Installation

```bash
npm install zeropoint-components
```

## Quick Start

### 1. Add the Plugin

Add the plugin to your configuration file.

<details open>
<summary>View configuration code</summary>

```javascript
import reusableComponents from "zeropoint-components";

export default function(eleventyConfig) {
  eleventyConfig.addPlugin(reusableComponents);
}
```

</details>

### 2. Create a Component

Create a component file at `src/components/callout.liquid`:

<details open>
<summary>View Liquid component template</summary>

```liquid
---
title: Callout

# Default values
heading: Lorem ipsum dolor sit
description: A callout component to highlight important information.
links:
  - linkUrl: "#"
    linkText: Learn more
background: light
---

<div class="callout callout--{{ background }}">
  <h3 class="callout__heading">{{ heading }}</h3>
  <p class="callout__description">{{ description }}</p>
  {% if links %}
    <div class="callout__links">
      {% for link in links %}
        <a href="{{ link.linkUrl }}" class="callout__link">{{ link.linkText }}</a>
      {% endfor %}
    </div>
  {% endif %}
</div>
```

</details>

<details>
<summary>View Nunjucks component template</summary>

```njk
---
title: Callout

# Default values
heading: Lorem ipsum dolor sit
description: A callout component to highlight important information.
links:
  - linkUrl: "#"
    linkText: Learn more
background: light
---

<div class="callout callout--{{ background }}">
  <h3 class="callout__heading">{{ heading }}</h3>
  <p class="callout__description">{{ description }}</p>
  {% if links %}
    <div class="callout__links">
      {% for link in links %}
        <a href="{{ link.linkUrl }}" class="callout__link">{{ link.linkText }}</a>
      {% endfor %}
    </div>
  {% endif %}
</div>
```

</details>

<details>
<summary>View WebC component template</summary>

```html
---
title: Callout

# Default values
heading: Lorem ipsum dolor sit
description: A callout component to highlight important information.
links:
  - linkUrl: "#"
    linkText: Learn more
background: light
---

<div :class="`callout callout--${background}`">
  <h3 class="callout__heading" @text="heading"></h3>
  <p class="callout__description" @text="description"></p>
  <div class="callout__links" webc:if="links">
    <a 
      :href="link.linkUrl" 
      class="callout__link" 
      @text="link.linkText"
      webc:for="link of links">
    </a>
  </div>
</div>
```

</details>

<details>
<summary>View Vento component template</summary>

```vento
---
title: Callout

# Default values
heading: Lorem ipsum dolor sit
description: A callout component to highlight important information.
links:
  - linkUrl: "#"
    linkText: Learn more
background: light
---

<div class="callout callout--{{ background }}">
  <h3 class="callout__heading">{{ heading }}</h3>
  <p class="callout__description">{{ description }}</p>
  {{ if links }}
    <div class="callout__links">
      {{ for link of links }}
        <a href="{{ link.linkUrl }}" class="callout__link">{{ link.linkText }}</a>
      {{ /for }}
    </div>
  {{ /if }}
</div>
```

</details>

### 3. Use the Component

In any template, use the `renderComponent` filter:

<details open>
<summary>View Liquid usage example</summary>

```liquid
{{-
  {
    "type": "callout",
    "heading": "Build sites statically!",
    "description": "A callout component to highlight important information.",
    "links": [
      {
        "linkUrl": "https://getzeropoint.com/",
        "linkText": "You don't need all that infrastructure"
      }
    ],
    "background": "warning"
  } | renderComponent
-}}
```

Or from frontmatter:

```liquid
---
title: My Page

# Callout component data
callout:
  type: callout
  heading: Build sites statically!
  description: A callout component to highlight important information.
  links:
    - linkUrl: https://getzeropoint.com/
      linkText: You don't need all that infrastructure
  background: warning
---

{{ callout | renderComponent }}
```

</details>

<details>
<summary>View Nunjucks usage example</summary>

```njk
{{-
  {
    "type": "callout",
    "heading": "Build sites statically!",
    "description": "A callout component to highlight important information.",
    "links": [
      {
        "linkUrl": "https://getzeropoint.com/",
        "linkText": "You don't need all that infrastructure"
      }
    ],
    "background": "warning"
  } | renderComponent | safe
-}}
```

Or from frontmatter:

```njk
---
title: My Page

# Callout component data
callout:
  type: callout
  heading: Build sites statically!
  description: A callout component to highlight important information.
  links:
    - linkUrl: https://getzeropoint.com
      linkText: You don't need all that infrastructure
  background: warning
---

{{ callout | renderComponent | safe }}
```

</details>

<details>
<summary>View WebC usage example</summary>

```html
<template @html="{
  'type': 'callout',
  'heading': 'Build sites statically!',
  'description': 'A callout component to highlight important information.',
  'links': [
    {
      'linkUrl': 'https://getzeropoint.com',
      'linkText': 'You don't need all that infrastructure'
    }
  ],
  'background': 'warning'
} | renderComponent"></template>
```

Or from frontmatter:

```html
---
title: My Page

# Callout component data
callout:
  type: callout
  heading: Build sites statically!
  description: A callout component to highlight important information.
  links:
    - linkUrl: https://getzeropoint.com
      linkText: You don't need all that infrastructure
  background: warning
---

<template @html="callout | renderComponent"></template>
```

</details>

<details>
<summary>View Vento usage example</summary>

```vento
{{-
  {
    "type": "callout",
    "heading": "Build sites statically!",
    "description": "A callout component to highlight important information.",
    "links": [
      {
        "linkUrl": "https://getzeropoint.com",
        "linkText": "You don't need all that infrastructure"
      }
    ],
    "background": "warning"
  } |> renderComponent |> safe
-}}
```

Or from frontmatter:

```vento
---
title: My Page

# Callout component data
callout:
  type: callout
  heading: Build sites statically!
  description: A callout component to highlight important information.
  links:
    - linkUrl: https://getzeropoint.com
      linkText: You don't need all that infrastructure
  background: warning
---

{{ callout |> renderComponent |> safe }}
```

</details>

### 4. Render Multiple Components
You can render multiple components by passing an array of component data:

<details open>
<summary>View Liquid multiple components example</summary>

```liquid
---
title: My Page

# Mixed component data
components:
  - type: callout
    heading: Build sites statically!
    description: A callout component to highlight important information.
    links:
      - linkUrl: https://getzeropoint.com
        linkText: You don't need all that infrastructure
    background: warning

  - type: text-and-image
    heading: About Our Community
    description: Join thousands of developers building amazing things with Eleventy.
    image: /assets/images/community.jpg
    imageAlt: Community members collaborating
    layout: image-right
---

{{ components | renderComponent }}
```

</details>

<details>
<summary>View Nunjucks multiple components example</summary>

```njk
---
title: My Page

# Mixed component data
components:
  - type: callout
    heading: Build sites statically!
    description: A callout component to highlight important information.
    links:
      - linkUrl: https://getzeropoint.com
        linkText: You don't need all that infrastructure
    background: warning

  - type: text-and-image
    heading: About Our Community
    description: Join thousands of developers building amazing things with Eleventy.
    image: /assets/images/community.jpg
    imageAlt: Community members collaborating
    layout: image-right
---

{{ components | renderComponent | safe }}
```

</details>

<details>
<summary>View WebC multiple components example</summary>

```html
---
title: My Page

# Mixed component data
components:
  - type: callout
    heading: Build sites statically!
    description: A callout component to highlight important information.
    links:
      - linkUrl: https://getzeropoint.com
        linkText: You don't need all that infrastructure
    background: warning

  - type: text-and-image
    heading: About Our Community
    description: Join thousands of developers building amazing things with Eleventy.
    image: /assets/images/community.jpg
    imageAlt: Community members collaborating
    layout: image-right
---

<template @html="components | renderComponent"></template>
```

</details>

<details>
<summary>View Vento multiple components example</summary>

```vento
---
title: My Page

# Mixed component data
components:
  - type: callout
    heading: Build sites statically!
    description: A callout component to highlight important information.
    links:
      - linkUrl: https://getzeropoint.com
        linkText: You don't need all that infrastructure
    background: warning

  - type: text-and-image
    heading: About Our Community
    description: Join thousands of developers building amazing things with Eleventy.
    image: /assets/images/community.jpg
    imageAlt: Community members collaborating
    layout: image-right
---

{{ components |> renderComponent |> safe }}
```

</details>

> **Note:** The `renderComponent` filter accepts a template language parameter (`"njk"`, `"liquid"`, `"webc"`, `"vto"`, etc.) and can process both single components and arrays of components. The filter automatically merges component default values with your provided data - any missing fields will use the defaults from the component file.

## Configuration

### Default Options

<details open>
<summary>View default options</summary>

```javascript
const defaultOptions = {
  componentsDir: "src/components/*.*",
  collectionName: "components",
  enableRenderPlugin: true,
  output: true
};
```

</details>

## Usage Examples

### Method 1: From Frontmatter

Define components directly in your page's frontmatter:

<details open>
<summary>View Liquid frontmatter example</summary>

```liquid
---
title: My Page
components:
  - type: callout
    heading: Welcome!
    description: Thanks for visiting our site
    background: primary

  - type: text-and-image
    heading: About Us
    description: Learn more about our company
    image: /assets/images/about.jpg
    imageAlt: About our company
---

<main>
  {{ components | renderComponent }}
</main>
```

</details>

<details>
<summary>View Nunjucks frontmatter example</summary>

```njk
---
title: My Page
components:
  - type: callout
    heading: Welcome!
    description: Thanks for visiting our site
    background: primary

  - type: text-and-image
    heading: About Us
    description: Learn more about our company
    image: /assets/images/about.jpg
    imageAlt: About our company
---

<main>
  {{ components | renderComponent | safe }}
</main>
```

</details>

<details>
<summary>View WebC frontmatter example</summary>

```html
---
title: My Page
components:
  - type: callout
    heading: Welcome!
    description: Thanks for visiting our site
    background: primary

  - type: text-and-image
    heading: About Us
    description: Learn more about our company
    image: /assets/images/about.jpg
    imageAlt: About our company
---

<main>
  <template @html="components | renderComponent"></template>
</main>
```

</details>

<details>
<summary>View Vento frontmatter example</summary>

```vento
---
title: My Page
components:
  - type: callout
    heading: Welcome!
    description: Thanks for visiting our site
    background: primary

  - type: text-and-image
    heading: About Us
    description: Learn more about our company
    image: /assets/images/about.jpg
    imageAlt: About our company
---

<main>
  {{ components |> renderComponent |> safe }}
</main>
```

</details>

### Method 2: Inline

Define components inline within your template:

<details open>
<summary>View Liquid inline definition example</summary>

```liquid
{% assign heroComponent = {
  type: "hero",
  heading: "Welcome to Our Site",
  description: "Thanks for visiting! We're excited to share our content with you.",
  background: "primary"
} %}

{% assign features = [
  {
    type: "callout",
    heading: "Fast Performance",
    description: "Built for speed and efficiency.",
    background: "success"
  },
  {
    type: "callout", 
    heading: "Easy to Use",
    description: "Simple and intuitive interface.",
    background: "info"
  }
] %}

<main>
  {{ heroComponent | renderComponent }}
  
  <section class="features">
  {{ features | renderComponent }}
  </section>
</main>
```

</details>

<details>
<summary>View Nunjucks inline definition example</summary>

```njk
{%- set heroComponent = {
  type: "hero",
  heading: "Welcome to Our Site",
  description: "Thanks for visiting! We're excited to share our content with you.",
  background: "primary"
} -%}

{%- set features = [
  {
    type: "callout",
    heading: "Fast Performance",
    description: "Built for speed and efficiency.",
    background: "success"
  },
  {
    type: "callout",
    heading: "Easy to Use", 
    description: "Simple and intuitive interface.",
    background: "info"
  }
] -%}

<main>
  {{ heroComponent | renderComponent | safe }}
  
  <section class="features">
  {{ features | renderComponent | safe }}
  </section>
</main>
```

</details>

<details>
<summary>View WebC inline definition example</summary>

```html
<script webc:setup>
const heroComponent = {
  type: "hero",
  heading: "Welcome to Our Site",
  description: "Thanks for visiting! We're excited to share our content with you.",
  background: "primary"
};

const features = [
  {
    type: "callout",
    heading: "Fast Performance",
    description: "Built for speed and efficiency.",
    background: "success"
  },
  {
    type: "callout",
    heading: "Easy to Use",
    description: "Simple and intuitive interface.",
    background: "info"
  }
];
</script>

<main>
  <template @html="heroComponent | renderComponent"></template>
  
  <section class="features">
    <template @html="features | renderComponent"></template>
  </section>
</main>
```

</details>

<details>
<summary>View Vento inline definition example</summary>

```vento
{{ set heroComponent = {
  type: "hero",
  heading: "Welcome to Our Site",
  description: "Thanks for visiting! We're excited to share our content with you.",
  background: "primary"
} }}

{{ set features = [
  {
    type: "callout",
    heading: "Fast Performance",
    description: "Built for speed and efficiency.",
    background: "success"
  },
  {
    type: "callout",
    heading: "Easy to Use",
    description: "Simple and intuitive interface.",
    background: "info"
  }
] }}

<main>
  {{ heroComponent |> renderComponent |> safe }}
  
  <section class="features">
  {{ features |> renderComponent |> safe }}
  </section>
</main>
```

</details>

### Method 3: From Data Files

Store component data in separate JSON files for better organization:

#### Data File: `src/_data/homepage.json`

<details open>
<summary>View data file example</summary>

```json
{
  "hero": {
    "type": "hero",
    "heading": "Welcome to Our Site",
    "subheading": "Building amazing experiences",
    "image": "/assets/images/hero-bg.jpg",
    "ctaText": "Learn More",
    "ctaUrl": "/about/"
  },
  "sections": [
    {
      "type": "text-and-image",
      "heading": "Our Mission",
      "description": "We strive to create exceptional digital experiences that make a difference.",
      "image": "/assets/images/mission.jpg",
      "imageAlt": "Our mission in action",
      "layout": "image-right"
    },
    {
      "type": "callout",
      "heading": "Ready to Get Started?",
      "description": "Join thousands of satisfied customers today.",
      "background": "primary",
      "links": [
        {
          "linkText": "Sign Up Now",
          "linkUrl": "/signup/"
        },
        {
          "linkText": "Learn More",
          "linkUrl": "/features/"
        }
      ]
    },
    {
      "type": "stats-grid",
      "stats": [
        { "number": "10k+", "label": "Happy Customers" },
        { "number": "99.9%", "label": "Uptime" },
        { "number": "24/7", "label": "Support" },
        { "number": "50+", "label": "Countries" }
      ]
    }
  ]
}
```

</details>

#### Template Usage

<details open>
<summary>View Liquid template usage</summary>

```liquid
---
title: Homepage
---

<main>
  {{ homepage.hero | renderComponent }}
  
  {{ homepage.sections | renderComponent }}
</main>
```

</details>

<details>
<summary>View Nunjucks template usage</summary>

```njk
---
title: Homepage
---

<main>
  {{ homepage.hero | renderComponent | safe }}
  
  {{ homepage.sections | renderComponent | safe }}
</main>
```

</details>

<details>
<summary>View WebC template usage</summary>

```html
---
title: Homepage
---

<main>
  <template @html="homepage.hero | renderComponent"></template>
  
  <template @html="homepage.sections | renderComponent"></template>
</main>
```

</details>

<details>
<summary>View Vento template usage</summary>

```vento
---
title: Homepage
---

<main>
  {{ homepage.hero |> renderComponent |> safe }}
  
  {{ homepage.sections |> renderComponent |> safe }}
</main>
```

</details>

## Component Structure

Components should follow this structure:

<details open>
<summary>View component structure example</summary>

```liquid
---
title: ComponentName

# Default values
heading: "default heading"
description: "default description"
---

<!-- Component template here -->
<div class="component-name">
  <h2>{{ heading }}</h2>
  <p>{{ description }}</p>
</div>
```

</details>

### Required Frontmatter

- `title`: Used for component matching (gets slugified)

### Component Matching

The plugin matches components by comparing:
- Component's `title` (from frontmatter) → slugified
- Content item's `type` property → slugified

**Examples:**
- Component: `title: "Text and Image"` → slug: `"text-and-image"`
- Content: `type: "text-and-image"` → **Match!** ✅
- Component: `title: "Callout"` → slug: `"callout"`  
- Content: `type: "callout"` → **Match!** ✅

### Default Values & Data Merging

Components automatically merge their default values with the data you provide. This means you only need to specify the fields you want to override - any missing fields will use the defaults from the component file.

**Example:**

If your component has these defaults:
```yaml
---
title: Callout

# Default values
heading: "Default Heading"
description: "Default description"
background: "light"
links:
  - linkUrl: "#"
    linkText: "Default Link"
---
```

And you use it with partial data:
```liquid
{% assign myCallout = {
  type: "callout",
  heading: "Custom Heading"
} %}

{{ myCallout | renderComponent: "liquid" }}
```

The component will render with:
- `heading`: "Custom Heading" *(from your data)*
- `description`: "Default description" *(from component default)*
- `background`: "light" *(from component default)*  
- `links`: Default links array *(from component default)*

This ensures components always have complete data to work with, even when you only provide a subset of the required fields.

## Error Handling

The plugin handles errors gracefully:

- **Missing component**: Returns empty string
- **Invalid data**: Returns empty string  
- **Missing collections**: Returns empty string
- **Template errors**: Logged to console, returns fallback

## Troubleshooting

### Component Not Rendering

1. **Check component title matches type**:

<details open>
<summary>View component title matching example</summary>

```liquid
<!-- Component file -->
title: "My Component"  <!-- becomes "my-component" -->

<!-- Usage -->
type: "my-component"  <!-- must match! -->
```

</details>

2. **Verify component collection**:

<details>
<summary>View component collection debug example</summary>

```liquid
<!-- Debug: List all components -->
{% for component in collections.components %}
  <p>{{ component.data.title }} → {{ component.data.title | slugify }}</p>
{% endfor %}
```

</details>

3. **Check file location**:
   - Default: `src/components/*.njk`
   - Custom: Set via `componentsDir` option

### Template Language Issues

Make sure to specify the correct template language parameter for your template engine:


- **Liquid**: `{{ item | renderComponent }}` (auto-escaped by default)
- **Nunjucks**: `{{ item | renderComponent | safe }}`
- **WebC**: `<template @html="item | renderComponent"></template>`
- **Vento**: `{{ item |> renderComponent |> safe }}`

If no template language is specified, the filter will use the calling template's language by default.

## API Reference

### Plugin Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `componentsDir` | `string` | `"src/components/*.*"` | Glob pattern for component files |
| `collectionName` | `string` | `"components"` | Name of components collection |
| `enableRenderPlugin` | `boolean` | `true` | Enable Eleventy Render Plugin |
| `output` | `boolean` | `true` | Whether components are written to their own output files/endpoints |

### Filters

#### `renderComponent`

Matches content items to component templates and renders them with automatic default value merging.

**Parameters:**

- `item` (Object|Array): Content item(s) with `type` property
- `templateLang` (string): Optional. Template language ("njk", "liquid", "webc", "vto", etc.). If not specified, defaults to the calling template's language.

**Returns:**

- `string`: Fully rendered HTML content or empty string

**Behavior:**

The filter automatically merges component default values with your provided data. Any fields not specified in your data will use the default values from the component's frontmatter. This ensures components always have complete data to render properly.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
