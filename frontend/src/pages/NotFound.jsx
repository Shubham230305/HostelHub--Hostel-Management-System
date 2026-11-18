import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <main style={{ padding: '40px' }}>
      <h1>404 - Page not found</h1>
      <Link to="/">Return to home</Link>
    </main>
  );
}