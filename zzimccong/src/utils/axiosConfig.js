import axios from 'axios';

const isLocalhost = window.location.hostname === 'localhost';

const instance = axios.create({
    baseURL: isLocalhost ? 'http://localhost:8090/app' : 'http://10.10.10.164:8090/app',
    headers: {
        'Content-Type': 'application/json'
    }
});

export default instance;