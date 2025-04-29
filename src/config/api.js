const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://giangthuymobile-server-production.up.railway.app/api'
  : 'http://localhost:3000/api';
 
export default API_URL; 