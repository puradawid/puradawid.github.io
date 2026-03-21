# Post Writing Guide

This repository is a Jekyll blog. New posts live in [`_posts/`](./_posts/) and are written as Markdown files with YAML front matter.

This guide explains the structure used in the existing posts so new articles can be added without guessing.

## Filename

Use this format:

```text
YYYY-MM-DD-slug.md
```

Examples:

```text
2025-07-19-managing-stress-is-managing-productivity.md
2022-01-09-discovering-aem-instances-in-public-internet.md
```

The filename date and slug matter because the permalink pattern in [`_config.yml`](./_config.yml) is:

```yaml
permalink: /:categories/:title:output_ext
```

That means the final URL is driven by the post title and categories, not by the raw filename alone.

## Minimum Front Matter

At minimum, use:

```yaml
---
layout: post
title: "Your post title"
date: 2026-03-21 08:00:00 +0100
image: /assets/your-image.png
seo_description: "One-sentence description for search and social preview."
categories: working
---
```

These fields are the practical baseline:

- `layout`
  Must be `post`.
- `title`
  Used in the page title, homepage cards, social metadata, and the post header.
- `date`
  Used for publishing and display.
- `image`
  Used for Open Graph / Twitter previews and usually also rendered manually at the top of the post body.
- `seo_description`
  Used in the meta description and social preview text.
- `categories`
  Used in URLs, homepage/category grouping, and article metadata.

## Recommended Front Matter

The more complete modern pattern in this repo looks like this:

```yaml
---
layout: post
title: "Your post title"
date: 2026-03-21 08:00:00 +0100
author: "Dawid Pura"
categories:
  - working
  - architecture
tags:
  - delivery
  - java
image: /assets/your-image.png
image_alt: "Short description of the image"
seo_description: "One-sentence description for search and social preview."
---
```

Notes:

- `author`
  Recommended. The post layout displays it if present.
- `categories`
  Can be a single string or a YAML list.
  If you use multiple categories, the first one is the most important in practice because:
  - it drives the category label on homepage cards
  - category archive pages currently filter by `post.categories.first`
- `tags`
  Safe to include, but currently not used by the visible templates.
- `image_alt`
  Good practice, but currently not wired into the templates automatically.

## Fields Supported By Templates

These fields are explicitly supported by the current templates in [`_includes/head.html`](./_includes/head.html):

- `title`
- `date`
- `seo_description`
- `categories`
- `image`
- `author`
- `modified`
- `ogimage`
- `ogimagenull`
- `vertical`

In practice:

- `modified`
  Adds `article:modified_time` metadata.
- `ogimage`
  Overrides the default social preview image.
- `ogimagenull`
  Suppresses OG image output.
- `vertical`
  Maps to `article:section`, but is not used consistently in existing posts.

If you do not need these advanced fields, skip them.

## Body Structure

The existing posts follow a simple and effective structure:

1. hero image
2. short introduction
3. excerpt separator
4. main body with headings, paragraphs, quotes, code blocks, and images

Typical example:

```md
![Image description](/assets/your-image.png)

Opening paragraph that explains the topic and gives the reader a reason to continue.

<!-- more -->

## First section

Main content starts here.
```

## The `<!-- more -->` Marker

This is important.

The site config in [`_config.yml`](./_config.yml) sets:

```yaml
excerpt_separator: "<!-- more -->"
```

That means everything before `<!-- more -->` becomes the excerpt used on listing pages.

Practical rule:

- Put the hero image and 1-3 strong introductory paragraphs before `<!-- more -->`.
- Do not place too much content before it, or the homepage cards become noisy.

## Recommended Post Template

Use this as the default starting point:

```md
---
layout: post
title: "Your post title"
date: 2026-03-21 08:00:00 +0100
author: "Dawid Pura"
categories:
  - working
tags:
  - example
image: /assets/your-image.png
image_alt: "Describe the image briefly"
seo_description: "One-sentence description for search and social preview."
---

![Describe the image](/assets/your-image.png)

Opening paragraph that sets the context.

Second paragraph that explains the problem, idea, or question behind the post.

<!-- more -->

## Why this matters

Expand the problem in practical terms.

## Main idea

Explain the core argument clearly.

## Example

Add examples, code, diagrams, or screenshots when helpful.

## Conclusion

Close with the main takeaway.
```

## Category Guidance

Use categories that already fit the blog structure where possible.

Existing visible category pages include:

- `java`
- `working`

Other categories already present in posts include:

- `blogging`
- `craftsmanship`
- `javascript`
- `management`
- `remote_tools`
- `scrum`
- `software-development`
- `well-being`

Recommendation:

- Reuse existing categories unless there is a strong reason to create a new one.
- Put the most important category first.
- Prefer stable, broad categories over highly specific one-off labels.

## Writing Conventions From Existing Posts

The current blog style tends to work best when posts:

- start with a direct problem or observation
- use clear section headings
- mix practical engineering judgment with personal experience
- avoid very short, fragmentary sections
- include images or diagrams when they add context

This repo already contains both older and newer posts, so the style is not perfectly uniform. If you want consistency, prefer the newer pattern:

- richer front matter
- cleaner SEO description
- explicit author
- multi-category classification when helpful

## Before Publishing

Before considering a post done:

1. make sure the filename follows the date-slug format
2. check that `title`, `date`, `image`, `seo_description`, and `categories` are present
3. confirm the lead section before `<!-- more -->` reads well on its own
4. verify the image path exists under [`assets/`](./assets/)
5. preview locally and check the homepage card, post header, and social metadata

## Practical Summary

If you want the shortest rule set:

- create a file in [`_posts/`](./_posts/)
- use `layout: post`
- add `title`, `date`, `image`, `seo_description`, and `categories`
- place the lead image and intro before `<!-- more -->`
- keep the first category as the main one
- write the rest in normal Markdown
