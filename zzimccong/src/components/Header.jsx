import React, { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"; // AuthContext import
import Search from "../pages/Search/Searchcomponent";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation().pathname;
  const { isLoggedIn, user } = useContext(AuthContext); // AuthContext에서 user 정보 가져오기

  const onClickBack = () => {
    window.history.back();
  };

  const onClickAlarmIcon = () => {
    navigate('/alram-history'); // 알람 아이콘 클릭 시 /alarm-history로 이동
  };

  // 로컬 스토리지에서 'profile' 키의 값 가져오기
  const profileData = window.localStorage.getItem('profile');
  let displayName = 'Guest'; // 기본값 설정

  // 프로필 데이터가 있을 경우 파싱하고 닉네임 추출하기
  if (profileData) {
    try {
      const profile = JSON.parse(profileData);
      displayName = profile.nickname || displayName; // 프로필에서 nickname 추출
    } catch (error) {
      console.error('프로필 데이터를 로컬 스토리지에서 파싱하는 데 실패했습니다.', error);
    }
  }

  // user 정보가 있을 경우 닉네임을 우선적으로 설정 (기본값으로 설정)
  displayName = (user && (user.corpName || user.name)) || displayName

  const headerContent = () => {
    switch (location) {
      case "/":
        return (
          <div className="header-wrapper flex justify-between w-full px-[20px] items-center">
            <div className="header-left items-center">
              <h1 className="w-[30px] h-[30px] bg-main bg-[30px] bg-no-repeat mr-[8px]"></h1>
            </div>
            <form className="keyword-search keyword-search-main">
              <input
                className="pl-[44px] pr-[15px] text-xs h-[30px]"
                type="text"
                placeholder="지역, 음식, 매장명 검색"
                onClick={() => navigate("/search")}
              ></input>
            </form>
            <div className="header-right flex">
              <a className=" bg-no-repeat ml-[8px]"></a>
              <button className="w-[30px] h-[30px] bg-alert bg-[30px] bg-no-repeat ml-[8px]" onClick={onClickAlarmIcon}></button> {/* 알람 아이콘 클릭 시 이동 */}
            </div>
          </div>
        
        );
      case "/ct/shop":
        return (
          <div className="header-tp-wrapper flex justify-between w-full px-[20px] items-center opacity-100 h-[48px]">
            <div className="header-left items-center flex gap-[12px]">
              <button className="back header-icon" onClick={onClickBack}>
                뒤로
              </button>
              <a className="tohome header-icon">홈</a>
            </div>
            <div className="header-right flex gap-[12px]">
              <button className="bookmark header-icon">저장</button>
              <a className="share header-icon">공유</a>
            </div>
          </div>
        );
      case "/search":
        return (
          <div className="">
            {/* <h1 className="text-xl h-[47px] leading-[47px] font-bold px-[20px]">
              검색하기
            </h1> */}
            <Search />
          </div>
        );
      case "/dialog":
        return (
          <div className="">
            <h1 className="text-xl h-[47px] leading-[47px] font-bold px-[20px]">
              채팅하기
            </h1>
          </div>
        );
      case "/mydining/my":
        return (
          <div className="">
            <h1 className="text-xl h-[47px] leading-[47px] font-bold px-[20px]">
              마이다이닝
            </h1>
          </div>
        );
      case "/mypage":
        return (
          <div className="header-wrapper flex px-[20px]">
            <div className="header-left flex items-center">
              <h1 className="text-xl h-[47px] leading-[47px] font-bold">
                {displayName} 님의 마이페이지
              </h1>
            </div>
            <div className="header-right flex items-center ml-auto">
              <button type="button" className="btn-icon alarm"></button>
              <button type="button" className="btn-icon setting"></button>
            </div>
          </div>
        );
      case "/event-list":
        return (
          <div className="header-wrapper flex px-[20px]">
            <div className="header-left flex items-center">
              <h1 className="text-xl h-[47px] leading-[47px] font-bold">
                추첨 이벤트 목록
              </h1>
            </div>
            <div className="header-right flex items-center ml-auto">
              <button type="button" className="btn-icon alarm"></button>
              <button type="button" className="btn-icon setting"></button>
            </div>
          </div>
        );
      case "/restaurants":
        return (
          <div className="header-wrapper flex px-[20px]">
            <div className="header-left flex items-center">
              <h1 className="text-xl h-[47px] leading-[47px] font-bold">
                가게 목록
              </h1>
            </div>
            <div className="header-right flex items-center ml-auto">
              <button type="button" className="btn-icon alarm"></button>
              <button type="button" className="btn-icon setting"></button>
            </div>
          </div>
        );
        case "/myReservation":
        return (
          <div className="header-wrapper flex px-[20px]">
            <div className="header-left flex items-center">
              <h1 className="text-xl h-[47px] leading-[47px] font-bold">
                가게 목록
              </h1>
            </div>
            <div className="header-right flex items-center ml-auto">
              <button type="button" className="btn-icon alarm"></button>
              <button type="button" className="btn-icon setting"></button>
            </div>
          </div>
        );
      case "/account":
        return isLoggedIn ? (
          <div className="header-wrapper flex px-[20px]">
            <div className="header-left flex items-center">
              <button className="back header-icon mr-[8px]" onClick={onClickBack}>
                뒤로
              </button>
              <h1 className="text-xl h-[47px] leading-[47px] font-bold">
                {displayName} 님의 마이페이지
              </h1>
            </div>
            <div className="header-right flex items-center ml-auto">
              <button type="button" className="btn-icon alarm"></button>
              <button type="button" className="btn-icon setting"></button>
            </div>
          </div>
        ) : null;
      case "/corporation/edit":
      case "/users/edit":
        case "/kakao/edit":
        return isLoggedIn ? (
          <div className="header-wrapper flex px-[20px]">
            <div className="header-left flex items-center">
              <button className="back header-icon mr-[8px]" onClick={onClickBack}>
                뒤로
              </button>
              <h1 className="text-xl h-[47px] leading-[47px] font-bold  pb-[45px]">
                {displayName} 님의 내 정보 보기
              </h1>
            </div>
            <div className="header-right flex items-center ml-auto">
              <button type="button" className="btn-icon alarm"></button>
              <button type="button" className="btn-icon setting"></button>
            </div>
          </div>
        ) : null;
        case "/kakao-register":
          return (
            <div className="header-wrapper flex justify-between w-full px-[20px] items-center">
              <div className="header-left items-center">
                <h1 className="text-xl h-[47px] leading-[47px] font-bold">
                  회원가입
                </h1>
              </div>
              <div className="header-right flex">
                <button className="w-[30px] h-[30px] bg-alert bg-[30px] bg-no-repeat ml-[8px]"></button>
              </div>
            </div>
          );
  
      case "/register":
        return (
          <div className="header-wrapper flex justify-between w-full px-[20px] items-center">
            <div className="header-left items-center">
              <h1 className="text-xl h-[47px] leading-[47px] font-bold">
                회원가입
              </h1>
            </div>
            <div className="header-right flex">
              <button className="w-[30px] h-[30px] bg-alert bg-[30px] bg-no-repeat ml-[8px]"></button>
            </div>
          </div>
        );
      default:
        return null; // default case에서 null 반환
    }
  };

  return (
    <header className={`${location === "/ct/shop" ? "bg-transparent" : ""} `}>
      {headerContent()}
    </header>
  );
};

export default Header;
