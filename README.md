# Posts API UI

A minimal, dependency-free web UI to interact with a REST API for posts.

Supported endpoints:

- GET `/api/posts` — list all posts
- GET `/api/posts/:id` — get one post by ID
- POST `/api/posts` — create a new post
- PUT `/api/posts/:id` — full update
- PATCH `/api/posts/:id` — partial update
- DELETE `/api/posts/:id` — delete a post

## Run

This is a static site. You can open `index.html` directly or serve it locally.

- Same-origin (recommended): host this UI from the same origin/domain as your API so calls like `/api/posts` just work.
- Cross-origin: set the "API Base URL" at the top of the page (e.g., `http://localhost:3000`). Ensure your API allows CORS.

### Options

- Use VS Code's Live Server extension to serve the folder.
- Or use a simple static server. For example, with Node installed:

```bash
npx http-server -p 8080 .
```

Then visit http://localhost:8080.

## Notes

- The PATCH form sends only fields you fill (non-empty). Leave a field empty to omit it from the patch payload.
- The PUT form requires both title and body (full replacement).
- The UI expects post objects to have at least `id`, `title`, and `body` (or `content`). Adjust `js/app.js` if your schema differs.
