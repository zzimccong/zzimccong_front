import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './DiscountCoupon.css'; // 스타일을 추가하기 위해 CSS 파일을 임포트합니다.

export default function DiscountCoupon() {
  const [coupon, setCoupon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const userId = getUserIdFromLocalStorage();

    if (!userId) {
      setError('User not logged in or user data not found');
      setLoading(false);
      return;
    }

    fetchDiscountCoupon(userId);
  }, []);

  const getUserIdFromLocalStorage = () => {
    const userString = localStorage.getItem('user');

    if (userString) {
      try {
        const user = JSON.parse(userString);
        return user.id;
      } catch (error) {
        console.error('Failed to parse user from localStorage', error);
      }
    }

    return null;
  };

  const fetchDiscountCoupon = async (userId) => {
    try {
      const response = await axios.get(`/app/api/coupons/${userId}/discount-coupon`);
      setCoupon(response.data);
    } catch (error) {
      console.error('Error fetching discount coupon:', error);
      setError('Failed to load discount coupon');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!coupon || coupon.cnt === 0) {
    return <div>보유하고 계신 할인쿠폰이 존재하지 않습니다.</div>;
  }

  return (
    <div className="coupon-container">
      <h1>할인쿠폰함</h1>
      <p>보유쿠폰 {coupon.cnt}장</p>
      {/* cnt 값만큼 쿠폰 카드를 반복하여 렌더링 */}
      {Array.from({ length: coupon.cnt }).map((_, index) => (
        <div key={index} className="coupon-card">
          <p className="coupon-price">{coupon.discountPrice.toLocaleString()}원</p>
          <p>결제 시 {coupon.discountPrice.toLocaleString()}원 할인</p>
        </div>
      ))}
      <div className="coupon-note">
        <ul>
          <li>추첨권 20장 사용 시 할인권을 제공합니다.</li>
          <li>할인권은 식사 후 결제할 때 제시해 주세요.</li>
        </ul>
      </div>
    </div>
  );
}
