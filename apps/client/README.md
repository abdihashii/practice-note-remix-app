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

- `VITE_API_URL`: Backend API URL (default: http://localhost:8000)

## Development

Run the dev server:

```sh
bun run dev
```

The app will be available at [http://localhost:5173](http://localhost:5173)

## Deployment

First, build your app for production:

```sh
bun run build
```

Then run the app in production mode:

```sh
bun run start
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
