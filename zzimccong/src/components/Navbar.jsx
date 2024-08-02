import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";

// 네비게이션 아이템 배열
const navItem = [
  {
    id: 0,
    name: "home",
    to: "/",
    image: "dock-home",
    imageOn: "dock-home-on",
    selectItem: false,
  },
  {
    id: 1,
    name: "search",
    to: "/search",
    image: "dock-search",
    imageOn: "dock-search-on",
    selectItem: false,
  },
  {
    id: 2,
    name: "dialog",
    to: "/dialog",
    image: "dock-review",
    imageOn: "dock-review-on",
    selectItem: false,
  },
  {
    id: 3,
    name: "mydining",
    to: "/mydining/my",
    image: "dock-mydining",
    imageOn: "dock-mydining-on",
    selectItem: false,
  },
  {
    id: 4,
    name: "account",
    to: "/account",
    image: "dock-account",
    imageOn: "dock-account-on",
    selectItem: false,
  },
];

const Navbar = () => {
  // 현재 경로를 얻기 위해 useLocation 훅 사용
  const location = useLocation().pathname;
  
  // 경로가 변경될 때마다 실행되는 useEffect 훅
  useEffect(() => {
    console.log(`${location}`);
  }, [location]);

  return (
    // 특정 경로에서는 네비게이션 바를 숨기기 위한 조건부 클래스 설정
    <NavbarContents className={`${location === "/ct/shop" ? " hidden" : " block"}`}>
      <NavbarWrap>
        {/* 네비게이션 아이템을 순회하면서 Link 컴포넌트 생성 */}
        {navItem.map((item) => {
          return (
            <Link to={item.to} key={item.id}>
              <i>
                {/* 현재 경로와 아이템의 경로가 일치하면 활성화된 아이콘 사용 */}
                {item.to === location ? (
                  <img src={require("../assets/icons/" + item.imageOn + ".svg")} />
                ) : (
                  <img src={require("../assets/icons/" + item.image + ".svg")} />
                )}
              </i>
            </Link>
          );
        })}
      </NavbarWrap>
    </NavbarContents>
  );
};

export default Navbar;

// styled-components를 사용하여 스타일 정의
const NavbarContents = styled.div`
  position: fixed;
  bottom: 0;
  right: 0;
  border-top: 1px solid #f9f9f9;
  margin: 0 auto;
  width: 100%;
  max-width: 480px;
  left: 0;
`;

const NavbarWrap = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  height: 48px;
  background-color: #fff;
  && i,
  a {
    width: 100%;
    display: block;
    height: 48px;
  }
  && i {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  && img {
    width: 32px;
    height: 32px;
  }
`;
