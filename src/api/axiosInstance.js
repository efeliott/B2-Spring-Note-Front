import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080/api', // L'URL de votre back-end Spring Boot
    timeout: 5000, // Timeout pour les requêtes
});

export default axiosInstance;
