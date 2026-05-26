import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0f0f0f', color: '#e0e0e0' }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: '#00d4ff' }}>404</h1>
      <p style={{ fontSize: '1.25rem', marginBottom: '2rem' }}>Page not found</p>
      <Link href="/" style={{ color: '#00d4ff', textDecoration: 'none' }}>
        Return home
      </Link>
    </div>
  );
}
