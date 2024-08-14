import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom"; // Link 컴포넌트 추가

export default function MyPage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false); // 드롭다운 상태
  const navigate = useNavigate();

  useEffect(() => {
    const profile = localStorage.getItem('profile');
    const userString = localStorage.getItem('user');

    if (!profile && !userString) {
      setShouldRedirect(true);
      setLoading(false);
    } else if (userString) {
      try {
        const parsedUser = JSON.parse(userString);
        setUser(parsedUser);
        setLoading(false);
      } catch (error) {
        console.error("Failed to parse user from localStorage", error);
        setShouldRedirect(true);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (shouldRedirect) {
      window.location.href = '/account';
    }
  }, [shouldRedirect]);

  const handleLogout = useCallback(() => {
    localStorage.clear();
    window.location.href = '/account';
  }, []);

  const handleEdit = useCallback(() => {
    const profile = localStorage.getItem('profile');
    const userString = localStorage.getItem('user');

    if (profile) {
      window.location.href = '/kakao-user';
    } else if (userString) {
      const parsedUser = JSON.parse(userString);
      if (parsedUser.corpId) {
        window.location.href = '/corporation/edit';
      } else if (parsedUser.loginId) {
        window.location.href = '/users/edit';
      }
    }
  }, []);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown); // 드롭다운 상태 토글
  };

    // 쿠폰 페이지로 이동하는 함수
    const handleCouponClick = useCallback(() => {
      navigate('/user/coupon');
    }, [navigate]);
  

  if (loading) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="main mt-[100px]">
      {user?.role === 'ADMIN' ? (
        <div>
          
          <div className="menu-container">
            <button className="btn-dropdown menu-option" onClick={toggleDropdown}>
                사용자 관리
              <span className="arrow">&gt;</span>
              
              {showDropdown && (
                    <div className="dropdown-menu">
                      <br/>
                      <div><Link to="/user-management">&gt; 유저 관리</Link></div>
                      <div><Link to="/corp-management">&gt; 기업 관리</Link></div>
                      <div><Link to="/store-management">&gt; 점주 관리</Link></div>
                    </div>
              )}
            </button>
            <hr/>
            <button className="menu-option" >
                쿠폰 관리
              <span className="arrow">&gt;</span>
            </button>
            <hr/>
            <button className="menu-option">
                통계
              <span className="arrow">&gt;</span>
            </button>
            <hr/>
            <button className="menu-option btn-logout" onClick={handleLogout} >
                로그아웃
            </button>
          </div>
        </div>
      ) : (
        <div>
          
          <div className="menu-container">
            <button className="menu-option" onClick={handleEdit}>
                내 정보 수정
              <span className="arrow">&gt;</span>
            </button>
            <hr/>
            <button className="menu-option" >
                나의 찜 리스트
              <span className="arrow">&gt;</span>
            </button>
            <hr/>
            <button className="menu-option" onClick={handleCouponClick}>
                쿠폰
              <span className="arrow">&gt;</span>
            </button>
            <hr/>
            <button className="menu-option" >
                1:1 문의
              <span className="arrow">&gt;</span>
            </button>
            <hr/>
            <button className="menu-option btn-logout" onClick={handleLogout} >
                로그아웃
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
