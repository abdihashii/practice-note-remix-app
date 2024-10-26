import Header from "~/components/common/layout/Header";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
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
}
