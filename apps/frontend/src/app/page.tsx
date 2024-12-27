// React and Next
import Link from "next/link";

export default function Home() {
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
          href="/notes"
          className="inline-block rounded-lg bg-primary px-6 py-3 text-lg font-semibold text-primary-foreground transition-colors hover:bg-primary/90 sm:text-xl"
        >
          Get Started
        </Link>
      </div>
    </main>
  );
}
