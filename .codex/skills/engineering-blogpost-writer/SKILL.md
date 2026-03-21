---
name: engineering-blogpost-writer
description: Write or revise software-engineering blog posts for this Jekyll blog. Use when Codex needs to draft a new article, reshape rough notes into a polished post, improve structure or readability, add code examples, or align a post with the repository's front matter and excerpt conventions for an audience of developers, architects, and experienced engineers.
---

# Engineering Blogpost Writer

## Overview

Draft posts that are technically credible, readable, and useful to practicing engineers. Keep the article grounded in software engineering reality, not generic content marketing language.

Read `references/blog-writing.md` before drafting or heavily revising an article. Use it for the repo-specific front matter, post structure, and audience expectations.

## Workflow

1. Identify the article goal.
   Determine whether the user wants a new post, an outline, a rewrite, or a polish pass over an existing draft.
2. Establish the core argument.
   Reduce the post to one clear thesis, tradeoff, lesson, or technical observation. If the draft wanders, tighten around that central point.
3. Shape the article for this blog.
   Follow the repository conventions for filename, front matter, hero image, intro, and `<!-- more -->` excerpt split.
4. Plan the hero image as part of the post.
   Produce at least 3 candidate image-generation prompts that fit the article thesis and the blog's technical constraints before finalizing the draft.
5. Write for experienced engineers.
   Assume the audience understands code, systems, tradeoffs, and delivery pain. Explain ideas clearly without flattening them into beginner-level material.
6. Use examples to carry the explanation.
   Prefer concrete examples, small code snippets, architecture sketches in prose, or failure scenarios over abstract claims.
7. Finish with a useful takeaway.
   End with a conclusion that leaves the reader with a decision rule, lesson, or mental model.

## Writing Rules

- Open with a real engineering problem, observation, or tension.
- Keep the first section strong because it becomes the excerpt on listing pages.
- Prefer direct, opinionated prose over hedging and filler.
- Use section headings that carry meaning, not vague labels.
- Treat the hero image as part of the deliverable, not an afterthought.
- Add code only when it clarifies the point. Keep snippets short and easy to scan.
- Explain why the code matters; do not drop examples without commentary.
- Avoid marketing tone, motivational fluff, and generic productivity advice.
- Favor practical tradeoffs, edge cases, and consequences.
- If a claim comes from the author's experience, write it as experience rather than pretending it is universal truth.

## Image Prompt Guidance

When drafting a new post, include at least 3 candidate prompts for generating the hero image unless the user already provided a final image.

- Match the prompt to the article's thesis, not just its keywords.
- Make prompts compatible with the blog's post image usage and social sharing crop.
- Default technical target: horizontal composition, aspect ratio `1.91:1`, recommended output `1200x630`.
- Keep key visual elements away from the edges so the image survives article and social crops.
- Do not include visible text, code screenshots, editor UIs, logos, or watermarks unless the user explicitly asks for them.
- Prefer a serious editorial or technical illustration style over generic stock-photo language.
- Keep prompts specific about subject, mood, composition, and exclusions.

Suggested prompt structure:

1. Subject and concept
2. Visual style and mood
3. Composition and cropping safety
4. Explicit exclusions
5. Output size and ratio

## Code Example Guidance

When code helps, keep it minimal but realistic.

- Show the smallest example that demonstrates the idea.
- Prefer examples that illustrate maintainability, design tradeoffs, performance implications, delivery risks, or operational behavior.
- Surround the snippet with a short setup and interpretation.
- Use fenced code blocks with an info string when the language is clear.

Example pattern:

~~~md
## A small example

This is where the design starts to fail:

```java
class InvoiceService {
    void save(Invoice invoice) { ... }
    void send(Invoice invoice) { ... }
    void retryFailedPayments() { ... }
}
```

The issue is not syntax. The issue is that one class now owns unrelated operational paths, which makes testing and change isolation worse.
~~~

## Output Shape

Unless the user asks for something else, produce:

- a proposed filename in `YYYY-MM-DD-slug.md` format
- complete YAML front matter
- the article body in Markdown
- at least 3 candidate image-generation prompts suitable for the post and blog constraints

If the user asks only for ideation or an outline, keep the output at that stage instead of forcing a full draft.

## Revision Mode

When revising an existing draft:

- preserve the author's core point unless the user asks to change it
- remove repetition and weaker paragraphs first
- sharpen headings and transitions
- add or improve code examples only where they materially help
- keep the final tone consistent across the whole post
