import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import './App.css';

function App() {
  const { 
    user, 
    isAuthenticated, 
    isLoading, 
    loginWithRedirect, 
    logout 
  } = useAuth0();

  if (isLoading) {
    return (
      <div style={{ 
        padding: '50px', 
        textAlign: 'center',
        backgroundColor: '#282c34',
        color: 'white',
        minHeight: '100vh'
      }}>
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '50px', 
      textAlign: 'center',
      backgroundColor: '#282c34',
      color: 'white',
      minHeight: '100vh'
    }}>
      {!isAuthenticated ? (
        // Not logged in - Show login screen
        <div>
          <h1 style={{ color: '#61dafb', fontSize: '3rem' }}>
            Welcome to ScholarLed
          </h1>
          <p style={{ fontSize: '1.2rem', marginBottom: '30px' }}>
            Decentralized Academic Publishing
          </p>
          <button 
            onClick={() => loginWithRedirect()}
            style={{
              padding: '15px 30px',
              fontSize: '1.2rem',
              backgroundColor: '#61dafb',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              margin: '10px'
            }}
          >
            Log In
          </button>
          <button 
            onClick={() => loginWithRedirect({
              authorizationParams: {
                screen_hint: 'signup'
              }
            })}
            style={{
              padding: '15px 30px',
              fontSize: '1.2rem',
              backgroundColor: 'transparent',
              border: '2px solid #61dafb',
              borderRadius: '5px',
              cursor: 'pointer',
              color: '#61dafb',
              margin: '10px'
            }}
          >
            Sign Up
          </button>
        </div>
      ) : (
        // Logged in - Show user dashboard
        <div>
          <h1 style={{ color: '#61dafb', fontSize: '3rem' }}>
            Welcome to XRPotato, {user.name}!
          </h1>
          
          <div style={{
            background: 'rgba(255,255,255,0.1)',
            padding: '20px',
            borderRadius: '10px',
            margin: '20px auto',
            maxWidth: '400px'
          }}>
            <img 
              src={user.picture} 
              alt={user.name}
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                marginBottom: '15px'
              }}
            />
            <h3>{user.name}</h3>
            <p>{user.email}</p>
          </div>

          <div style={{ marginTop: '30px' }}>
            <button 
              onClick={() => logout({ 
                logoutParams: { returnTo: window.location.origin } 
              })}
              style={{
                padding: '10px 20px',
                fontSize: '1rem',
                backgroundColor: '#ff6b6b',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                color: 'white'
              }}
            >
              Log Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;