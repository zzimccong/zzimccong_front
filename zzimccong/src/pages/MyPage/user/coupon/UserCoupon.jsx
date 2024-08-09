import React from 'react';
import { useNavigate } from 'react-router-dom';

const UserCoupon = ({setAmount}) => {

  const navigate = useNavigate();

  const handleButtonClick = (event) => {
    const value = Number(event.target.value);
    setAmount(value);
    navigate('/payment');
  };


  return (
    <button style={buttonStyle} onClick={handleButtonClick} value={1_000}>
      1000원
    </button>
  );
};

const buttonStyle = {
  padding: '10px 20px',
  fontSize: '16px',
  backgroundColor: '#FF8D4E', 
  color: 'white', 
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  outline: 'none'
};

export default UserCoupon;