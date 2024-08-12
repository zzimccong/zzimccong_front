import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../../assets/css/style.css';
import './Coupon.css';
import axios from 'axios';

const LotteryCoupon = ({setAmount, setCouponType}) => {

  const navigate = useNavigate();
  const [lotteryCount, setLotteryCount] = useState(0);

  useEffect(() => {
    const userString = localStorage.getItem('user');
    let userId;

    if (userString) {
      try {
        const user = JSON.parse(userString);
        userId = user.id;
      } catch (error) {
        console.error('Failed to parse user from localStorage', error);
        return;
      }
    } else {
      console.error('User not logged in or user data not found');
      return;
    }

    // 추첨권의 개수를 가져오는 함수
    const fetchLotteryCount = async () => {
      try {
        const response = await axios.get(`/app/api/coupons/${userId}/lottery/cnt`);
        setLotteryCount(response.data);
      } catch (error) {
        console.error('Error fetching lottery coupons:', error);
      }
    };

    if (userId) {
      fetchLotteryCount();
    }
  }, []);

  const handleButtonClick = (event) => {
    const amount = Number(event.target.getAttribute('value1'));
    const type = String(event.target.getAttribute('value2'));
    setAmount(amount);
    setCouponType(type);
    navigate('/payment');
  };


  return (
    
    <div>
      
      <div className="coupon-container">
        <div className="coupon-header">
          <span className="coupon-title">현재 보유중인 추첨 쿠폰</span>
          <span className="coupon-count">{lotteryCount} 개</span>
        </div>
        <div className="coupon-item">
          <span className="coupon-text">추첨권 1개</span>
          <button className='button_pay' onClick={handleButtonClick} value1={1_000} value2="추첨권 1개">
            500원
          </button>
        </div>
        <div className="coupon-item">
          <span className="coupon-text">추첨권 11개</span>
          <button className='button_pay' onClick={handleButtonClick} value1={5_000} value2="추첨권 11개">
            5000원
          </button>
        </div>
        <div className="coupon-item">
          <span className="coupon-text">추첨권 22개</span>
          <button className='button_pay' onClick={handleButtonClick} value1={10_000} value2="추첨권 22개">
            10000원
          </button>
        </div>
      </div>
      <br/>
      <hr className="hr-border"/>
      <div className="menu-container">
        <button className="menu-option" >
          추첨권 사용 내역
          <span className="arrow">&gt;</span>
        </button>
        <hr/>
        <button className="menu-option" onClick={() => navigate('/paymenthistory')}>
          추첨권 결제 내역
          <span className="arrow">&gt;</span>
        </button>
      </div>
    </div>
    
    
  );
};



export default LotteryCoupon;