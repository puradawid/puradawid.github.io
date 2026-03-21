# Blog Writing Reference

## Purpose

Write for readers interested in coding, software engineering, and architecture. Assume a technically literate audience that values clarity, practical judgment, and examples that map to real engineering work.

## Repo-Specific Structure

New posts live in `_posts/` and use a Markdown file named:

```text
YYYY-MM-DD-slug.md
```

Minimum front matter:

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

Recommended front matter:

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

Typical body structure:

1. Hero image
2. Short introduction
3. `<!-- more -->`
4. Main body with headings, examples, and conclusion

Default pattern:

```md
![Describe the image](/assets/your-image.png)

Opening paragraph that frames the topic.

Second paragraph that explains the engineering problem or question.

<!-- more -->

## Why this matters

Explain the practical consequences.

## Main idea

Develop the core argument.

## Example

Add code, diagrams, or scenarios that make the point concrete.

## Conclusion

Close with the main takeaway.
```

## Excerpt Rule

Everything before `<!-- more -->` becomes the excerpt. Put the hero image and one to three strong intro paragraphs there. Do not waste that space on vague setup.

## Audience Standard

Write as if the reader is a thoughtful developer, architect, or senior engineer.

- Respect the reader's technical literacy.
- Avoid explaining basic concepts unless they are central to the point.
- Focus on tradeoffs, failure modes, maintainability, architecture, delivery, debugging, operations, or engineering judgment.
- Use examples that feel like real production code or real team problems.

## Style Guidance

- Start with a concrete issue, observation, or thesis.
- Keep paragraphs purposeful and moderately compact.
- Prefer strong declarative sentences over hedged language.
- Use headings that advance the argument.
- Keep the tone personal enough to feel authored, but technical enough to feel useful.
- If code is included, explain what the snippet proves.

## Category Guidance

Prefer existing categories. Common ones include:

- `java`
- `working`
- `blogging`
- `craftsmanship`
- `javascript`
- `remote_tools`
- `well-being`

Put the most important category first.

## Before Finishing

Check that:

1. the filename matches the date-slug convention
2. the front matter includes the required fields
3. the intro before `<!-- more -->` works as a standalone excerpt
4. the chosen image path exists under `assets/`
5. the conclusion leaves the reader with a practical takeaway
