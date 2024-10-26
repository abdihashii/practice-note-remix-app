// Remix and React
import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { ReactNode } from "react";

export const meta: MetaFunction = () => {
  return [
    { title: "Notes App" },
    { name: "description", content: "Notes App" },
  ];
};

export default function Index() {
  return (
    <Layout>
      <div className="relative flex-grow space-y-4"></div>
    </Layout>
  );
}

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <main className="w-full h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
          Welcome to Notes App
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl mb-8 text-muted-foreground">
          Your personal space for organizing thoughts and ideas
        </p>
        <Link
          to="/notes"
          className="inline-block text-lg sm:text-xl font-semibold px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          Get Started
        </Link>
      </div>
    </main>
  );
};
