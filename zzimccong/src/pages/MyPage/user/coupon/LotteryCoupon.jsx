import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../../assets/css/style.css';


const LotteryCoupon = ({setAmount, setCouponType}) => {

  const navigate = useNavigate();

  const handleButtonClick = (event) => {
    const amount = Number(event.target.getAttribute('value1'));
    const type = String(event.target.getAttribute('value2'));
    setAmount(amount);
    setCouponType(type);
    navigate('/payment');
  };


  return (
    
    <div>
      <h1>추첨권이란?</h1>
      <br/>
      <div className="coupon-container">
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