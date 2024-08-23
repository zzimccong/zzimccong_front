import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from '../../../utils/axiosConfig';
import './KakaoRegister.css';

const KakaoRegister = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // userDTO가 없을 경우 기본값 설정
  const { email, name: nickname } = location.state?.userDTO || { email: '', name: '' };

  useEffect(() => {
    if (!location.state?.userDTO) {
      console.error('userDTO 데이터가 없습니다. 이전 페이지로 리디렉션합니다.');
    //   navigate('/account'); // 혹은 오류 메시지 페이지로 리디렉션
    }
  }, [location.state, navigate]);

  const [formData, setFormData] = useState({
    loginId: email, // 로그인 아이디는 카카오 이메일로 설정
    password: null, // OAuth라 비밀번호는 null로 설정
    name: nickname, // 이름은 카카오 닉네임으로 설정
    birth: '', // 빈 문자열로 초기화
    email: email, // 이메일은 카카오 이메일로 설정 (수정 불가)
    phone: '', // 빈 문자열로 초기화
    role: 'USER',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value || '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 회원가입 요청을 백엔드로 보냄
      const response = await axios.post('/api/oauth/kakao-register', formData);
      const { token, user } = response.data;

      // 회원가입 후 로그인 처리 및 마이페이지로 이동
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      navigate('/');
      window.location.reload(); // 새로고침
    } catch (error) {
      console.error('회원가입 실패:', error);
      alert('회원가입에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <h2 className="register-title">추가 정보 입력</h2>
      <form className="register-form" onSubmit={handleSubmit}>
        <div className="register-form-section">
          <label htmlFor="loginId">아이디:</label>
          <input
            type="text"
            id="loginId"
            name="loginId"
            value={formData.loginId}
            className="register-input"
            disabled // 카카오 이메일로 설정된 로그인 아이디는 수정 불가
          />
        </div>
        <div className="register-form-section">
          <label htmlFor="name">이름 :</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            className="register-input"
            disabled // 카카오 닉네임으로 설정된 이름은 수정 불가
          />
        </div>
        <div className="register-form-section">
          <label htmlFor="birth">생년월일:</label>
          <input 
            type="date" 
            id="birth" 
            name="birth" 
            value={formData.birth} 
            onChange={handleChange} 
            required 
            className="register-input" 
          />
        </div>
        <div className="register-form-section">
          <label htmlFor="email">이메일:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            className="register-input"
            disabled // 카카오 이메일로 설정된 이메일은 수정 불가
          />
        </div>
        <div className="register-form-section">
          <label htmlFor="phone">전화번호:</label>
          <input
            type="text"
            id="phone"
            name="phone"
            placeholder="전화번호"
            value={formData.phone}
            onChange={handleChange}
            required
            className="register-input"
          />
        </div>
        <button type="submit" disabled={loading} className="register-submit-button">
          {loading ? '회원가입 중...' : '회원가입'}
        </button>
      </form>
    </div>
  );
};

export default KakaoRegister;
