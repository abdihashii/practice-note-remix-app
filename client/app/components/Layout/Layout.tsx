import Header from "./Header";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow flex flex-col">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
