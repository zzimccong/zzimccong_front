import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import logo2 from "../../src/assets/icons/logo2.png";

// 헤더 메뉴 항목 배열
const HeaderItem = [
  {
    id: 0,
    name: "home",
    to: "/",
  },
  {
    id: 1,
    name: "search",
    to: "/search",
  },
  {
    id: 3,
    name: "mydining/my",
    to: "/mydining/my",
  },
  {
    id: 4,
    name: "mydining",
    to: "/mydining",
  },
  {
    id: 5,
    name: "account",
    to: "/account",
  },
];

const Header = () => {
  // 현재 경로를 얻기 위해 useLocation 훅 사용
  const location = useLocation().pathname;

  // 경로가 변경될 때마다 실행되는 빈 useEffect 훅
  useEffect(() => {}, [location]);

  // 현재 경로가 "/ct/shop"인지 콘솔에 출력
  console.log(useLocation().pathname === "/ct/shop");

  // 뒤로가기 버튼 클릭 핸들러
  const onClickBack = () => {
    window.history.back();
  }

  // 현재 경로에 따라 다른 헤더 콘텐츠를 반환하는 함수
  const headerContent = () => {
    switch (location) {
      case "/":
        return (
          <div className="header-wrapper flex flex-col items-center w-full px-[20px]">
            {/* 로고와 상단 요소들 */}
            <div className="flex justify-between items-center w-full mb-[10px]">
              <div className="header-left items-center">
                <h1 className="w-[30px] h-[30px] bg-main bg-[30px] bg-no-repeat mr-[8px]"></h1>
              </div>

              <div className="logo-container flex justify-center">
                <img src={logo2} alt="Logo" style={{ height: '60px' }} />
              </div>

              <div className="header-right flex">
                <a className="bg-no-repeat ml-[8px]"></a>
                <button className="w-[30px] h-[30px] bg-alert bg-[30px] bg-no-repeat ml-[8px]"></button>
              </div>
            </div>

            {/* 검색창 */}
            <form className="keyword-search keyword-search-main w-full mb-[10px]">
              <input
                className="pl-[44px] pr-[15px] text-xs h-[36px] w-full"
                type="text"
                placeholder="지역, 음식, 매장명 검색"
              />
            </form>
          </div>
        );
      case "/ct/shop":
        return (
          <div className="header-tp-wrapper flex justify-between w-full px-[20px] items-center opacity-100 h-[48px]">
            <div className="header-left items-center flex gap-[12px]">
              <a className="back header-icon" onClick={onClickBack}>뒤로</a>
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
            <h1 className="text-xl h-[47px] leading-[47px] font-bold px-[20px]">
              검색하기
            </h1>
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
                마이페이지
              </h1>
            </div>
            <div className="header-right flex items-center ml-auto">
              <button type="button" className="btn-icon alarm"></button>
              <button type="button" className="btn-icon setting"></button>
            </div>
          </div>
        );
      case "/account":
        return localStorage.getItem("token") !== null ? (
          <div className="header-wrapper flex px-[20px]">
            <div className="header-left flex items-center">
              <h1 className="text-xl h-[47px] leading-[47px] font-bold">
                마이페이지
              </h1>
            </div>
            <div className="header-right flex items-center ml-auto">
              <button type="button" className="btn-icon alarm"></button>
              <button type="button" className="btn-icon setting"></button>
            </div>
          </div>
        ) : (
          ""
        );
      default:
        break;
    }
  };

  // 현재 경로에 따라 헤더의 배경 색상 결정 및 헤더 콘텐츠 렌더링
  return (
    <header className={`${location === "/ct/shop" ? "bg-transparent" : "bg-white"} w-full fixed top-0 left-0 right-0 z-50`}>
      {headerContent()}
    </header>
  );
};

export default Header;
