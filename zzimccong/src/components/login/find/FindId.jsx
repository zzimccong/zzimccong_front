import React, { useState } from 'react';
import axios from '../../../utils/axiosConfig';
import './Find.css'; 

const FindId = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [userType, setUserType] = useState('corporation'); // Default to 'corporation'
  const [foundId, setFoundId] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let response;
      if (userType === 'corporation') {
        response = await axios.post('/api/corporations/find-id', {
          corpName: name,
          corpEmail: email,
        });
      } else if (userType === 'user') {
        response = await axios.post('/api/users/find-id', {
          name,
          email,
        });
      } else {
        setError('Please select a valid user type.');
        return;
      }
      setFoundId(response.data);
      setError(null);
    } catch (err) {
      setError(err.response ? err.response.data : 'An error occurred');
      setFoundId(null);
    }
  };

  return (
    <div className="find-id-container">
      <h1 className='main-text'>아이디 찾기</h1>
      <form onSubmit={handleSubmit} className="find-id-form">
        <div className="form-group">
          <label htmlFor="userType">구분</label>
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
          <label htmlFor="name">기업 이름 / 사용자 이름</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
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
        >
          아이디 찾기
        </button>
      </form>
      {foundId && (
        <div className="result">
          <h2>Your ID:</h2>
          <p>{foundId}</p>
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

export default FindId;
