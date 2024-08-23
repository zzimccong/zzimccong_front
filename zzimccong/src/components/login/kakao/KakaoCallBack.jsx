import axios from 'axios';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CLIENT_ID = process.env.REACT_APP_REST_API_KEY;
const REDIRECT_URI = process.env.REACT_APP_REDIRECT_URL;
const GRANT_TYPE = "authorization_code";

function KakaoCallback() {
  const code = new URL(window.location.href).searchParams.get("code");
  const navigate = useNavigate();

  useEffect(() => {
    const handleKakaoLogin = async () => {
      try {
        console.log('Step 1: 카카오 인증 코드:', code);

        // Step 1: 카카오로부터 액세스 토큰을 받아옴
        const res = await axios.post(
          'https://kauth.kakao.com/oauth/token',
          new URLSearchParams({
            grant_type: GRANT_TYPE,
            client_id: CLIENT_ID,
            redirect_uri: REDIRECT_URI,
            code: code,
          }),
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
            },
          }
        );

        const { access_token } = res.data;
        console.log('Step 2: 카카오 액세스 토큰:', access_token);

        // Step 2: 백엔드로 액세스 토큰 전송 및 사용자 정보 확인
        const response = await axios.post(
          'http://localhost:8090/app/api/oauth/token',
          { access_token },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        console.log('Step 3: 백엔드 응답 상태:', response.status);
        console.log('Step 3: 백엔드 응답 데이터:', response.data);

        if (response.status === 200) {
          const { token, user } = response.data;
          console.log('기존 사용자 로그인 성공. token:', token, 'user:', user);

          window.localStorage.setItem("token", token);
          window.localStorage.setItem("user", JSON.stringify(user));
          navigate('/mypage');
          window.location.reload();
        } else if (response.status === 401) {
          const userDTO = response.data;
          console.log('회원가입이 필요한 사용자. userDTO:', userDTO);

          if (userDTO) {
            console.log('회원가입 페이지로 이동합니다.');
            navigate('/kakao-register', { state: { userDTO } });
          } else {
            // console.error('userDTO 데이터가 없습니다. 이전 페이지로 리디렉션합니다.');
            // navigate('/account');
          }
        }
      } catch (error) {
        console.error('카카오 로그인 실패:', error.response?.data);

        if (error.response?.status === 401 && error.response?.data) {
          // 여기서 userDTO가 포함되어 있는지 확인
          console.log('받은 UserDTO:', error.response.data);

          // userDTO가 포함된 경우
          if (error.response.data) {
            navigate('/kakao-register', { state: { userDTO: error.response.data } });
          } else {
            // navigate('/account');
          }
        } else {
          navigate('/account'); // 로그인 실패 시 로그인 페이지로 리디렉션
        }
      }
    };

    if (code) {
      handleKakaoLogin();
    }
  }, [code, navigate]);

  return <div>Loading...</div>;
}

export default KakaoCallback;
