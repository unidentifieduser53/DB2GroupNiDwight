// Shared client-side script for the Facebook clone front end.
//
// IMPORTANT: set this to your deployed backend URL (Render) once you
// deploy it. Locally it points at your local backend on port 5000.
//
//   Local dev:    http://localhost:5000/api
//   Production:   https://YOUR-BACKEND-NAME.onrender.com/api
const API_BASE_URL = 'https://db2groupnidwight.onrender.com';

function apiBaseUrl() {
  return API_BASE_URL;
}
