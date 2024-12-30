import { Link } from "react-router";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export function loader({ context }: Route.LoaderArgs) {
  return { message: context.VALUE_FROM_CLOUDFLARE };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return (
    <main className="flex h-screen w-full items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="mb-6 text-4xl font-bold sm:text-5xl md:text-6xl">
          Welcome to Notes App
        </h1>
        <p className="mb-8 text-lg text-muted-foreground sm:text-xl md:text-2xl">
          Your personal space for organizing thoughts and ideas
        </p>
        <Link
          to="/notes"
          className="inline-block rounded-lg bg-primary px-6 py-3 text-lg font-semibold text-primary-foreground transition-colors hover:bg-primary/90 sm:text-xl"
        >
          Get Started
        </Link>
      </div>
    </main>
  );
}
