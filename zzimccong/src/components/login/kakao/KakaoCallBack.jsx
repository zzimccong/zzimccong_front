import axios from 'axios';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CLIENT_ID = process.env.REACT_APP_REST_API_KEY;
const REDIRECT_URI = process.env.REACT_APP_REDIRECT_URL;
const GRANT_TYPE = "authorization_code";

console.log('CLIENT_ID:', CLIENT_ID);
console.log('REDIRECT_URI:', REDIRECT_URI);

function KakaoCallback() {
  const code = new URL(window.location.href).searchParams.get("code");
  console.log('Authorization Code:', code);
  const navigate = useNavigate();

  useEffect(() => {
    if (code) {
      axios.post(
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
      ).then(res => {
        console.log(res);
        const { access_token } = res.data;

        // 백엔드로 액세스 토큰 전송
        axios.post(
          'http://localhost:8090/app/api/oauth/token',
          { access_token },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        ).then(response => {
          console.log("User info from backend:", response.data);
          window.localStorage.setItem("profile", JSON.stringify(response.data));
          navigate("/");
        }).catch(error => {
          console.error("Failed to send access token to backend:", error);
        });

      }).catch(error => {
        console.error("Failed to fetch access token:", error);
      });
    }
  }, [code, navigate]);

  return <div>Loading...</div>;
}

export default KakaoCallback;
