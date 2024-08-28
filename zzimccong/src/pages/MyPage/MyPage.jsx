import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import axios from '../../utils/axiosConfig';
import { clearFirebaseIndexedDB } from "../../utils/firebaseClear";
import ButtonClickFCM from "../../components/fcm/ButtonClickFCM";

export default function MyPage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false); 
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

  const handleLogout = useCallback(async () => {
    try {
      const userString = localStorage.getItem('user');
      const parsedUser = userString ? JSON.parse(userString) : null;

      if (parsedUser && parsedUser.id) {
        let logoutUrl = '';

        if (parsedUser.corpId) {
          logoutUrl = '/api/corporations/logout';
        } else if (parsedUser.loginId) {
          logoutUrl = '/api/users/logout';
        }

        if (logoutUrl) {
          await axios.post(logoutUrl, null, {
            params: { id: parsedUser.id },
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            }
          });
        }
      }

      clearFirebaseIndexedDB();

      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (let registration of registrations) {
          await registration.unregister();
        }
        console.log("서비스 워커가 성공적으로 해제되었습니다.");
      }

      localStorage.clear();
      window.location.href = '/account';
    } catch (error) {
      console.error("로그아웃 중 오류가 발생했습니다.", error);
      localStorage.clear();
      window.location.href = '/account';
    }
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
        if (parsedUser.loginId.includes('@')) { 
          window.location.href = '/kakao/edit';
        } else {
          window.location.href = '/users/edit';
        }
      }
    }
  }, []);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown); 
  };

  const handleCouponClick = useCallback(() => {
    navigate('/user/coupon');
  }, [navigate]);

  const handleCartClick = useCallback(() => {
    navigate('/corp/cart');
  }, [navigate]);

  const handleReviewClick=useCallback(()=>{
    navigate('/user/reviews');
  }, [navigate]);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="main mt-[120px]">
      {user?.role === 'ADMIN' ? (
        <div>

          <div className="menu-container">
            <button className="btn-dropdown menu-option" onClick={toggleDropdown}>
              사용자 관리
              <span className="arrow">&gt;</span>

              {showDropdown && (
                <div className="dropdown-menu">
                  <br />
                  <div><Link to="/user-management">&gt; 유저 관리</Link></div>
                  <div><Link to="/corp-management">&gt; 기업 관리</Link></div>
                  <div><Link to="/store-management">&gt; 점주 관리</Link></div>
                </div>
              )}
            </button>
            <hr />
            <button className="menu-option" >
              쿠폰 관리
              <span className="arrow">&gt;</span>
            </button>
            <ButtonClickFCM />
            <hr />
            <button className="menu-option">
              통계
              <span className="arrow">&gt;</span>
            </button>
            <hr />
            <button className="menu-option btn-logout" onClick={handleLogout} >
              로그아웃
            </button>
          </div>
        </div>
      ) : user?.role === 'CORP' ? (
        <div>

          <div className="menu-container">
            <button className="menu-option" onClick={handleEdit}>
              내 정보 수정
              <span className="arrow">&gt;</span>
            </button>
            <hr />
            <button className="menu-option" >
              나의 찜 리스트
              <span className="arrow">&gt;</span>
            </button>
            <hr />
            <button className="menu-option" onClick={handleCartClick}>
              장바구니
              <span className="arrow">&gt;</span>
            </button>
            <hr />
            <button className="menu-option" onClick={handleReviewClick}>
              리뷰관리
              <span className="arrow">&gt;</span>
            </button>
            <hr />

            <ButtonClickFCM />
            <hr />
            <button className="menu-option btn-logout" onClick={handleLogout} >
              로그아웃
            </button>
          </div>
        </div>
      ) : (<div>

        <div className="menu-container">
          <button className="menu-option" onClick={handleEdit}>
            내 정보 수정
            <span className="arrow">&gt;</span>
          </button>
          <hr />
          <button className="menu-option" >
            나의 찜 리스트
            <span className="arrow">&gt;</span>
          </button>
          <hr />
          <button className="menu-option" onClick={handleCouponClick}>
            쿠폰
            <span className="arrow">&gt;</span>
          </button>
          <hr />
          <button className="menu-option" onClick={handleReviewClick}>
            리뷰관리
            <span className="arrow">&gt;</span>
          </button>
          <hr />

          <ButtonClickFCM />
          <hr />
          <button className="menu-option btn-logout" onClick={handleLogout} >
            로그아웃
          </button>
        </div>
      </div>
      )}
    </div>
  );
}
