# Agent Note

This file is the canonical place for Codex session handoff notes in this repository.

If the technical structure of the site changes, update [ARCHITECTURE.md](./ARCHITECTURE.md) first, then adjust this note if future agents need extra guidance.

Current canonical architecture reference:

- [ARCHITECTURE.md](./ARCHITECTURE.md)
- [POST_WRITING_GUIDE.md](./POST_WRITING_GUIDE.md) for the blog post structure, metadata, and authoring conventions

Current preferred local preview path:

- `docker compose up --build`
- open `http://localhost:4000`
- on Windows with Docker in WSL: `.\preview-wsl.ps1`

Expected use in future sessions:

- Read this file early when repo context matters.
- Treat `ARCHITECTURE.md` as the source of truth for stack, build flow, layout structure, styling, and integrations.
- Treat `POST_WRITING_GUIDE.md` as the source of truth for creating new posts.
- Extend `ARCHITECTURE.md` instead of creating duplicate architecture summaries unless the user asks for a separate document.
