# Notes App Frontend

A Remix-based frontend for the Notes application.

## Setup

Install dependencies:

```sh
bun install
```

## Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Required variables:

- `VITE_API_URL`: Backend API URL (default: http://localhost:8787/api/v1)

## Development

Run the dev server:

```sh
npm run dev
```

To run Wrangler:

```sh
npm run build
npm run start
```

## Typegen

Generate types for your Cloudflare bindings in `wrangler.toml`:

```sh
npm run typegen
```

You will need to rerun typegen whenever you make changes to `wrangler.toml`.

## Deployment

First, build your app for production:

```sh
npm run build
```

Then, deploy your app to Cloudflare Pages:

```sh
npm run deploy
```

## Features

- Rich text editor with TipTap
- Code block support with syntax highlighting
- Dark mode support
- Responsive design
- Real-time preview

## Technology Stack

- [Remix](https://remix.run) for routing and server-side rendering
- [React Query](https://tanstack.com/query) for data fetching
- [TipTap](https://tiptap.dev) for rich text editing
- [Tailwind CSS](https://tailwindcss.com) for styling
- [Radix UI](https://www.radix-ui.com) for accessible components

## Build Output

The build process generates:

- `build/server`: Server-side code
- `build/client`: Client-side assets

For more information:

- [Remix docs](https://remix.run/docs)
- [Vite docs](https://vitejs.dev/guide)
