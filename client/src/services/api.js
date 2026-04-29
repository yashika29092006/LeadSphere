
import axios from 'axios';

//Create Axios Instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

//before every api call it will runs
api.interceptors.request.use((config) => {
  // Get user
  const savedUserData = localStorage.getItem('crm_user');

  if (savedUserData) {
    //Convert string → object
    const user = JSON.parse(savedUserData);

    //Attach token
    if (user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
  }

  //Continue request
  return config;
},
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
