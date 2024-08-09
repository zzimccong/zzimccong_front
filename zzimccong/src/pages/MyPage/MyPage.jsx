import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function MyPage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const profile = localStorage.getItem('profile');
    const userString = localStorage.getItem('user');
    let parsedUser;

    if (!profile && !userString) {
      navigate('/account');
      return;
    }

    if (userString) {
      try {
        parsedUser = JSON.parse(userString);
        console.log("Parsed user from localStorage:", parsedUser); // user 객체 로그 출력
        setUser(parsedUser);
      } catch (error) {
        console.error("Failed to parse user from localStorage", error);
        navigate('/account');
        return;
      }
    }

    setLoading(false); // 로딩 상태를 false로 설정
  }, [navigate]);

  const handleLogout = useCallback(() => {
    window.localStorage.removeItem('profile');
    window.localStorage.removeItem('user');
    navigate('/account');
  }, [navigate]);

  const handleEdit = useCallback(() => {
    const profile = localStorage.getItem('profile');
    const userString = localStorage.getItem('user');
    let parsedUser;

    if (profile) {
      navigate('/kakao-user');
      return;
    }

    if (userString) {
      try {
        parsedUser = JSON.parse(userString);
      } catch (error) {
        console.error("Failed to parse user from localStorage", error);
        return;
      }
      
      if (parsedUser.corpId) {
        navigate('/corporation/edit');
      } else if (parsedUser.loginId) {
        navigate('/users/edit');
      } else {
        console.error('User ID not found');
      }
    }
  }, [navigate]);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  console.log("Current user:", user); // 추가된 로그 출력

  return (
    <div className="main mt-[100px]">
      {user?.role === 'admin' ? (
        <div>
          <h1>관리자 페이지</h1>
          <ul>
            <li>유저 관리</li>
            <li>콘텐츠 관리</li>
            <li>통계</li>
            <li>
              <button onClick={handleLogout} className="btn-logout">
                로그아웃
              </button>
            </li>
          </ul>
        </div>
      ) : (
        <div>
          <h1>내 정보 수정 페이지</h1>
          <ul>
            <li>
              <button onClick={handleEdit}>내 정보 수정</button>
            </li>
            <li>나의 찜 리스트</li>
            <li><Link to="/user/coupon">쿠폰</Link></li>
            <li>1:1 문의</li>
            <li>
              <button onClick={handleLogout} className="btn-logout">
                로그아웃
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
