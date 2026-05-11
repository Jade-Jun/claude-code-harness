export default function HeaderLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <nav className="w-60 border-r">
        {/* GNB */}
      </nav>
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
