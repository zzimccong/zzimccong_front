import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../../assets/css/style.css';
import './Coupon.css';
import axios from '../../../../utils/axiosConfig.js';
import CouponMenu from './CouponMenu.jsx';

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
        const response = await axios.get(`/api/coupons/${userId}/lottery/cnt`);
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
      
      <div className="Coupon-container">
        <div className="Coupon-header">
          <span className="Coupon-title">현재 보유중인 추첨권</span>
          <span className="Coupon-count">{lotteryCount} 개</span>
        </div>
        <div className="Coupon-item">
          <span className="Coupon-text">추첨권 1개</span>
          <button className='Coupon-button_pay' onClick={handleButtonClick} value1={1_000} value2="추첨권 1개">
            500원
          </button>
        </div>
        <div className="Coupon-item">
          <span className="Coupon-text">추첨권 11개</span>
          <button className='Coupon-button_pay' onClick={handleButtonClick} value1={5_000} value2="추첨권 11개">
            5,000원
          </button>
        </div>
        <div className="Coupon-item">
          <span className="Coupon-text">추첨권 22개</span>
          <button className='Coupon-button_pay' onClick={handleButtonClick} value1={10_000} value2="추첨권 22개">
            10,000원
          </button>
        </div>
      </div>
      <br/>
      <CouponMenu/>
    </div>
    
    
  );
};



export default LotteryCoupon;