import React, { useState } from 'react';
import AddMovieForm from './AddMovieForm';

export default function AdminDashboardPage() {
  const adminToken = localStorage.getItem('adminToken');
  const [showAddMovie, setShowAddMovie] = useState(false);

  if (!adminToken) {
    return <div style={{ maxWidth: 600, margin: '40px auto', padding: 24, background: '#fff', borderRadius: 8 }}>You are not authorized.</div>;
  }

  return (
    <div style={{ display: 'flex', minHeight: '80vh', background: '#f5f6fa' }}>
      <aside style={{ width: 220, background: '#222', color: '#fff', padding: '32px 0', minHeight: '100%' }}>
        <nav>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li>
              <button
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#fff',
                  fontSize: 18,
                  padding: '12px 32px',
                  width: '100%',
                  textAlign: 'left',
                  cursor: 'pointer'
                }}
                onClick={() => setShowAddMovie(true)}
              >
                ➕ Add Movie
              </button>
            </li>
            {/* Add more admin links here */}
          </ul>
        </nav>
      </aside>
      <main style={{ flex: 1, padding: 40 }}>
        {showAddMovie ? (
          <AddMovieForm onClose={() => setShowAddMovie(false)} />
        ) : (
          <div>
            <h2>Welcome, <b>admin</b>!</h2>
            <p>Select an option from the left menu.</p>
          </div>
        )}
      </main>
    </div>
  );
}
