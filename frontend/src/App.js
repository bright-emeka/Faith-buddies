// Main App component - handles routing and auth state
import React, { useState, useEffect } from 'react';
import { onAuthChange } from './services/auth';
import { setAuthToken } from './services/api';
import Login from './pages/Login';
import Chat from './pages/Chat';
import Header from './components/Header';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthChange(async (authUser) => {
      if (authUser) {
        // User is logged in
        setUser({
          uid: authUser.uid,
          email: authUser.email,
        });

        // Get and set auth token for API calls
        try {
          const token = await authUser.getIdToken();
          setAuthToken(token);
        } catch (error) {
          console.error('Error getting auth token:', error);
        }
      } else {
        // User is logged out
        setUser(null);
        setAuthToken(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  return (
    <div className="App">
      {user ? (
        <>
          <Header userName={user.email} onLogout={() => setUser(null)} />
          <Chat userName={user.email} />
        </>
      ) : (
        <Login onLoginSuccess={() => {}} />
      )}
    </div>
  );
}

export default App;
