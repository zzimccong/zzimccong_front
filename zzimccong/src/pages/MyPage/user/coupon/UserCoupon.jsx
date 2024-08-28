import React,{useState} from 'react';
import './UserCoupon.css';
import logo from '../../../../assets/icons/logo.png';
import ReservationCoupon from './ReservationCoupon';
import LotteryCoupon from './LotteryCoupon';

function UserCoupon({ setAmount, setCouponType }) {

  
  const [show, setShow] = useState('reservation');

  const getButtonClass = (buttonType) => {
    return `button_coupon ${show === buttonType ? 'active' : ''}`;
  };

  return (
    <div>
      <div className="header">
          <img src={logo} className="logo" />
          <div className="UserCoupon-title">쿠폰</div>
      </div>

      <div className="UserCoupon-buttons">
        <button onClick={() => setShow('reservation')} className={getButtonClass('reservation')}>
          예약쿠폰
        </button>
        <span className="UserCoupon-divider"></span>
        <button onClick={() => setShow('lottery')} className={getButtonClass('lottery')}>
          추첨권
        </button>
      </div>


      <div className="info">
        {show === 'reservation' && (
          <div className="coupon-info">
            <ReservationCoupon setAmount={setAmount} setCouponType={setCouponType}/>
          </div>
        )}
        {show === 'lottery' && (
          <div className="coupon-info">
            <LotteryCoupon setAmount={setAmount} setCouponType={setCouponType}/>
          </div>
        )}
      </div>
    </div>
    
    
  );
  
}


export default UserCoupon;