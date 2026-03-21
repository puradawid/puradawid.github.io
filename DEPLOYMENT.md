# Deployment

This repository can be deployed without Ruby or Jekyll on the server.

The intended production flow is:

1. GitHub Actions builds the site with Jekyll.
2. The generated `_site/` directory is uploaded to the server over SSH.
3. The server only serves static files from the target directory.

## Workflow

The workflow lives at `.github/workflows/deploy.yml`.

It runs on:

- push to `main`
- manual trigger from GitHub Actions (`workflow_dispatch`)

## Required GitHub secrets

Add these repository secrets before enabling the workflow:

- `SSH_HOST`: server hostname or IP
- `SSH_PORT`: SSH port, usually `22`
- `SSH_USER`: deployment user
- `SSH_TARGET_DIR`: absolute target directory served by your web server
- `SSH_PRIVATE_KEY`: private key for the deployment user
- `SSH_KNOWN_HOSTS`: output of `ssh-keyscan -p <port> <host>`

Example for `SSH_KNOWN_HOSTS`:

```bash
ssh-keyscan -p 22 example.com
```

## Server expectations

The remote machine only needs:

- an SSH server
- a directory writable by the deployment user
- a web server already configured to serve static files from `SSH_TARGET_DIR`

It does not need:

- Ruby
- Bundler
- Jekyll
- Node.js

## Notes

- The workflow deploys the generated `_site/` output directly.
- `rsync --delete` removes files from the target directory that no longer exist in the repo build output.
- The workflow currently runs `bundle exec jekyll build` without `--drafts`, so drafts stay out of production.
- If your default branch is not `main`, update the trigger in `.github/workflows/deploy.yml`.
