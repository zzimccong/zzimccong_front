import axios from 'axios';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const REST_API_KEY = process.env.REACT_APP_REST_API_KEY;
const REDIRECT_URI = process.env.REACT_APP_REDIRECT_URL;

console.log('REST_API_KEY:', REST_API_KEY); // 환경 변수를 확인합니다.
console.log('REDIRECT_URI:', REDIRECT_URI);

const kakao_auth_path = 'https://kauth.kakao.com/oauth/authorize';

export const KAKAO_AUTH_URL = () => {
    return `${kakao_auth_path}?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;
};

const KakaoLoginAPI = () => {
  const code = new URL(window.location.href).searchParams.get("code");
  console.log('Authorization Code:', code); // 인가 코드를 확인합니다.




  return (
    <div className="KaKaoBtn">
      <a href={KAKAO_AUTH_URL()}>카카오로 시작하기</a>
    </div>
  );
};

export default KakaoLoginAPI;
