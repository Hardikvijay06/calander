import { type ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100vh', padding: '40px 20px', display: 'flex', justifyContent: 'center' }}>
      {/* Background Animated Blobs */}
      <div className="bg-blob bg-blob-1" />
      <div className="bg-blob bg-blob-2" />
      <div className="bg-blob bg-blob-3" />
      
      {/* Main Content constraints */}
      <div className="fade-in" style={{ width: '100%', maxWidth: '1000px', zIndex: 1 }}>
        <header style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.05em' }}>
            Calendar
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '8px', fontSize: '1.1rem' }}>
            Plan your days with clarity
          </p>
        </header>

        <main>
          {children}
        </main>
      </div>
    </div>
  );
}
