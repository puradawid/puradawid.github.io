# Architecture

This repository is a static blog built with Jekyll and served as pre-rendered HTML, CSS, JS, RSS, and assets. Content lives mostly in Markdown files, but the site structure, styling, and build flow are driven by a small Liquid/Sass theme customized in-repo.

## Stack

- Static site generator: Jekyll
- Templating: Liquid layouts and includes
- Styling: Sass compiled from `css/main.scss` and `_sass/*.scss`
- Client-side JS: small jQuery-based enhancements plus plain JS analytics tracking
- Local development: Docker Compose preview, with a legacy Vagrant setup still present

## Local development flow

The preferred preview path is now Docker Compose:

- `docker compose up --build`
- preview at `http://localhost:4000`
- on Windows with Docker available in WSL: `.\preview-wsl.ps1`

The container runs `bundle exec jekyll serve` with `_config.yml,_config_dev.yml`, live reload, future posts enabled, and polling-based file watching for reliable host-mounted updates.

Bundler-managed dependencies are defined in `Gemfile`, and the preview image is described by `Dockerfile`. `docker-compose.yml` mounts the repository into the container so Sass, layouts, and Markdown changes rebuild immediately during design work.

### Legacy Vagrant flow

`Vagrantfile` provisions a `generic/ubuntu1804` VM, forwards guest port `80` to host port `8080`, and syncs the repo into `/vagrant` using `rsync`.

`bootstrap.sh` installs the runtime dependencies directly in the VM:

- Ruby, Bundler, Jekyll, `jekyll-sitemap`
- Node.js and npm
- `http-server`

After provisioning it starts two background processes with `screen`:

- `jekyll build --config _config.yml,_config_dev.yml --future --force_polling --watch`
- `http-server -p 80 _site`

This means development is based on a watched `jekyll build` into `_site`, with a separate static file server exposing the generated output. It does not use `jekyll serve`.

## Site structure

The rendering model is simple:

- `_layouts/default.html` provides the page shell
- `_includes/head.html` defines metadata, canonical URLs, OG/Twitter tags, and CSS loading
- `_includes/header.html` and `_includes/footer.html` provide global navigation and footer chrome
- `_layouts/post.html`, `_layouts/page.html`, and `_layouts/category.html` define the main page types
- `index.html` lists posts using Liquid iteration over `site.posts`

Posts are generated from `_posts/*` using the permalink pattern from `_config.yml`:

`/:categories/:title:output_ext`

The site config is intentionally small. `_config.yml` defines site metadata and the production URL, while `_config_dev.yml` overrides the URL/host for local use on `http://localhost:4000`.

## Styling system

The styling pipeline starts at `css/main.scss`, which defines shared variables and imports:

- `_sass/_fonts.scss`
- `_sass/_base.scss`
- `_sass/_layout.scss`
- `_sass/_syntax-highlighting.scss`
- `_sass/_my_overrides.scss`

Technically, this is a customized Jekyll/Minima-style Sass structure:

- `_base.scss` contains resets, typography, wrappers, tables, code blocks, and shared primitives
- `_layout.scss` defines header, footer, page, list, and post layout rules, including mobile nav behavior
- `_my_overrides.scss` applies site-specific presentation choices such as Roboto typography, centered post lists, newsletter form states, rounded profile images, and responsive title switching
- `_fonts.scss` self-hosts the Roboto font family from `assets/fonts`

Styling is mostly traditional global CSS with a few responsive breakpoints driven by Sass variables and a `media-query` mixin. There is no component-scoped CSS, bundler, or modern frontend framework involved.

## Client-side behavior and integrations

JavaScript is loaded from `_includes/scripts.html`:

- jQuery from CDN
- `assets/js/main.js`
- `assets/js/monitor.js`

These scripts are lightweight and mainly support analytics/engagement tracking:

- GA/gtag events for menu opens, scroll depth, newsletter signup, and contact clicks
- paragraph visibility tracking on article pages
- AJAX submit for the newsletter form to `/signup`

Third-party integrations are directly embedded in templates:

- Google Analytics via `_includes/analytics.html`
- Disqus comments via `_includes/disqs.html`
- Twitter widgets for follow/share buttons

## Deployment model

`_do/deploy.sh` builds the site and copies `_site` over `scp` to a remote host. That reinforces the core architecture: the site is generated fully ahead of time and deployed as static files rather than run as an application server.
