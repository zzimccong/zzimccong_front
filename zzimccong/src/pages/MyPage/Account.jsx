import React, { useContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import LoginModal from "../../components/login/LoginModal";
import logo2 from '../../assets/icons/logo2.png';
import logo from '../../assets/icons/logo.png';
import '../../assets/css/style.css';
import { KAKAO_AUTH_URL } from '../../api/KakaoLoginAPI';
import MyPage from "./MyPage";
import ChatBot from '../../components/chatbot/ChatBot';

function Account() {
  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const redirectUrl = KAKAO_AUTH_URL();

  const handleKakaoLogin = useCallback(() => {
    window.location.href = redirectUrl;
  }, [redirectUrl]);

  useEffect(() => {
    const profile = window.localStorage.getItem('profile');
    if (isLoggedIn || profile) {
      navigate('/mypage');
    }
  }, [isLoggedIn, navigate]);

  const normalLogin = useCallback(() => {
    setShowModal(true);
  }, []);

  const closeModal = useCallback(() => {
    setShowModal(false);
  }, []);

  const handleSignup = useCallback(() => {
    navigate('/register');
  }, [navigate]);

  const zzimkongButtonStyle = {
    backgroundColor: '#f55a5a',
    color: 'white',
    width: '100%',
    height: '3rem',
    borderRadius: '0.5rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '0.625rem'
  };

  const separatorStyle = {
    width: '40%',
    borderTop: '1px solid #dcdcdc',
    margin: '20px 0'
  };

  const separatorContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  if (!isLoggedIn) {
    return (
      <section className="signin-wrapper pt-[15vh] px-[30px]">
        <h1 className="brand-title">
          <img className="w-[171px]" src={logo2} alt="Logo" />
        </h1>
        <div className="login-btn mt-[10vh]" onClick={handleKakaoLogin}>
          <span className="__quick relative w-[128px] h-[32px] block mb-[10px] mx-[auto]">
            <img src={"https://app.catchtable.co.kr/public/img/login/kakao_tooltip.svg"} alt="Kakao Tooltip" />
            <em className="text-xs font-bold text-loginText absolute text-nowrap top-[4px] left-[4px] bottom-[0] top-0">
              5초만에 빠른 회원가입
            </em>
          </span>
          <button className="__kakao w-[100%] h-12 rounded-lg bg-kakaoColor flex justify-center items-center gap-x-[10px]" type="button">
            <i className="w-[20px] h-[18px] block bg-[url('./assets/icons/kakao_button.svg')]"></i>
            <span className="">카카오로 시작</span>
          </button>
        </div>
        <div style={separatorContainerStyle}>
          <div style={separatorStyle}></div>
          <span style={{ margin: '0 10px' }}>또는</span>
          <div style={separatorStyle}></div>
        </div>
        <div className="login-btn mt-[40px]" onClick={normalLogin}>
          <button style={zzimkongButtonStyle} type="button">
            <img src={logo} alt="Zzimkong Button" className="w-[20px] h-[18px] block" />
            <span className="">찜꽁으로 시작</span>
          </button>
        </div>
        <LoginModal showModal={showModal} onClose={closeModal} />
        <div className="signup-link mt-[20px]" style={{ display: 'flex', justifyContent: 'center' }}>
          <span style={{ cursor: 'pointer', color: 'rgba(128, 128, 128, 0.7)'}} onClick={handleSignup}>
            회원가입
          </span>
        </div>
        <ChatBot/>
      </section>
    );
  } else {
    return <MyPage />;
  }
}

export default Account;
