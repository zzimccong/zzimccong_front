import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CouponMenu.css';
import { useCallback } from 'react';

const ReservationCoupon = () => {

  const navigate = useNavigate();


  const handleCouponClick = useCallback(() => {
    navigate('/user/coupon/discount');
  }, [navigate]);

  return (

    <div>
      <hr className="hr-border"/>
      <div className="menu-container">
        <button className="menu-option" onClick={handleCouponClick}>
          할인 쿠폰
          <span className="arrow">&gt;</span>
        </button>
        <hr/>
        <button className="menu-option" >
          사용 내역
          <span className="arrow">&gt;</span>
        </button>
        <hr/>
        <button className="menu-option" onClick={() => navigate('/paymenthistory')}>
          결제 내역
          <span className="arrow">&gt;</span>
        </button>
      </div>
    </div>
    
    
  );
};

export default ReservationCoupon;