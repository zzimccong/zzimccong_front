import React, { useState } from 'react';
import axios from '../../../utils/axiosConfig';
import './Find.css';

const FindPassword = () => {
  const [loginId, setLoginId] = useState('');
  const [email, setEmail] = useState('');
  const [userType, setUserType] = useState('corporation'); // Default to 'corporation'
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let response;
      if (userType === 'corporation') {
        response = await axios.post('/api/corporations/find-password', {
          corpId: loginId,
          corpEmail: email,
        });
      } else if (userType === 'user') {
        response = await axios.post('/api/users/find-password', {
          loginId: loginId,
          email: email,
        });
      } else {
        setError('Please select a valid user type.');
        return;
      }
      setMessage(response.data);
      setError(null);
    } catch (err) {
      setError(err.response ? err.response.data : 'An error occurred');
      setMessage(null);
    }
  };

  return (
    <div className="find-password-container">
      <h1 className='main-text'>비밀번호 찾기</h1>
      <form onSubmit={handleSubmit} className="find-password-form">
        <div className="form-group">
          <label htmlFor="userType">구분:</label>
          <select
            id="userType"
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
            className="input"
          >
            <option value="corporation">기업 / 회사</option>
            <option value="user">일반 / 점주</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="loginId">로그인 ID:</label>
          <input
            type="text"
            id="loginId"
            value={loginId}
            onChange={(e) => setLoginId(e.target.value)}
            required
            className="input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">이메일:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input"
          />
        </div>
        <button
          type="submit"
          className="modal-button-find"
          style={{ display: 'block', visibility: 'visible', marginTop: '10px' }} // 인라인 스타일 추가
        >
          비밀번호 찾기
        </button>
      </form>
      {message && (
        <div className="result">
          <h2>{message}</h2>
        </div>
      )}
      {error && (
        <div className="error">
          <h2>Error:</h2>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default FindPassword;
