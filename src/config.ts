// API Configuration
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const config = {
  apiUrl: API_URL,
  auth0: {
    domain: import.meta.env.VITE_AUTH0_DOMAIN || '',
    clientId: import.meta.env.VITE_AUTH0_CLIENT_ID || '',
    audience: import.meta.env.VITE_AUTH0_AUDIENCE || '',
  },
};
