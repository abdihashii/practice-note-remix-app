// Remix and React
import type { MetaFunction } from "@remix-run/node";
import { ReactNode } from "react";

// First party components
import Header from "~/components/common/Header";

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
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow flex flex-col">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-6 flex flex-col gap-4">
          {children}
        </div>
      </main>
    </div>
  );
};
