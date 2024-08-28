import axios from 'axios';

// 로컬호스트 여부를 확인합니다.
const isLocalhost = window.location.hostname === 'localhost';

// axios 인스턴스를 생성합니다.
const instance = axios.create({
    baseURL: isLocalhost ? 'http://localhost:8090/app' : 'http://10.10.10.227:8090/app',
    headers: {
        'Content-Type': 'application/json'
    }
});

// 요청 인터셉터를 설정합니다.
instance.interceptors.request.use(
    config => {
        // 로컬 스토리지에서 토큰을 가져옵니다.
        const token = localStorage.getItem('token');
        if (token) {
            // 토큰이 있으면 Authorization 헤더에 추가합니다.
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        console.error('요청 에러:', error); // 에러 로깅
        return Promise.reject(error);
    }
);

// 응답 인터셉터를 설정합니다.
// 응답 인터셉터에서 리프레시 토큰 요청 로그 찍기
instance.interceptors.response.use(
    response => response,
    async error => {
        console.error('응답 에러:', error); // 에러 로깅

        const originalRequest = error.config;

        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            // 로그: 401 오류와 원래 요청 URL
            console.log('401 오류 발생, 리프레시 토큰 요청 시도. 원래 요청 URL:', originalRequest.url);

            const refreshToken = localStorage.getItem('refreshToken');
            if (!refreshToken) {
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login';
                return Promise.reject(error);
            }

            try {
                // 리프레시 토큰 엔드포인트와 요청 데이터 로그 찍기
                const endpoint = getRefreshTokenEndpoint(originalRequest.url);
                console.log('리프레시 토큰 요청 엔드포인트:', endpoint);
                console.log('리프레시 토큰 요청 데이터:', { refreshToken });

                const response = await axios.post(endpoint, { refreshToken });

                // 새 액세스 토큰 로그 찍기
                console.log('새 액세스 토큰 응답:', response.data);

                const newAccessToken = response.data.token;
                localStorage.setItem('token', newAccessToken);
                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

                return instance(originalRequest);
            } catch (refreshError) {
                console.error('리프레시 토큰 요청 중 에러 발생:', refreshError); // 로그 추가
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

// 요청 URL에 따라 적절한 리프레시 토큰 엔드포인트를 반환합니다.
const getRefreshTokenEndpoint = (url) => {
    if (url.includes('api/corporation')) {
        return '/api/corporation/refresh-token';
    } else if (url.includes('api/users')) {
        return '/api/users/refresh-token';
    }
    return '/api/users/refresh-token';
};


export default instance;
