import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../../assets/css/style.css';
import './Coupon.css';
import axios from 'axios';
import { useEffect, useState, useCallback } from 'react';

const ReservationCoupon = ({setAmount, setCouponType}) => {

  const navigate = useNavigate();
  const [reservationCount, setReservationCount] = useState(0);

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

    // 예약권의 개수를 가져오는 함수
    const fetchReservationCount = async () => {
      try {
        const response = await axios.get(`/app/api/coupons/${userId}/reservation/cnt`);
        setReservationCount(response.data);
      } catch (error) {
        console.error('Error fetching reservation coupons:', error);
      }
    };

    if (userId) {
      fetchReservationCount();
    }
  }, []);

  const handleButtonClick = (event) => {
    const amount = Number(event.target.getAttribute('value1'));
    const type = String(event.target.getAttribute('value2'));
    setAmount(amount);
    setCouponType(type);
    navigate('/payment');
  };

  const handleCouponClick = useCallback(() => {
    navigate('/user/coupon/discount');
  }, [navigate]);

  return (

    <div>
      <div className="coupon-container">
        <div className="coupon-header">
          <span className="coupon-title">현재 보유중인 예약 쿠폰</span>
          <span className="coupon-count">{reservationCount} 개</span>
        </div>
        <div className="coupon-item">
          <span className="coupon-text">예약권 1개</span>
          <button className='button_pay' onClick={handleButtonClick} value1={1_000} value2="예약권 1개">
            1,000원
          </button>
        </div>
        <div className="coupon-item">
          <span className="coupon-text">예약권 5개</span>
          <button className='button_pay' onClick={handleButtonClick} value1={5_000} value2="예약권 5개">
            5,000원
          </button>
        </div>
        <div className="coupon-item">
          <span className="coupon-text">예약권 10개</span>
          <button className='button_pay' onClick={handleButtonClick} value1={10_000} value2="예약권 10개">
            10,000원
          </button>
        </div>
      </div>
      <br/>
      <hr className="hr-border"/>
      <div className="menu-container">
        <button className="menu-option" onClick={handleCouponClick}>
          할인 쿠폰
          <span className="arrow">&gt;</span>
        </button>
        <hr/>
        <button className="menu-option" >
          쿠폰 사용 내역
          <span className="arrow">&gt;</span>
        </button>
        <hr/>
        <button className="menu-option" onClick={() => navigate('/paymenthistory')}>
          쿠폰 결제 내역
          <span className="arrow">&gt;</span>
        </button>
      </div>
    </div>
    
    
  );
};

export default ReservationCoupon;