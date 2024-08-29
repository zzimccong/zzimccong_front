import React from 'react';
import './Footer.css'; // CSS 파일을 따로 관리하기 위해 import

function Footer() {
    return (
        <footer>
            <div className="footer-content">
                <p><strong>(주)찜꽁플랜</strong></p>
                {/* <p>대표: 도권재</p> */}
                {/* <p>주소: 경기도 성남시 분당구 대왕판교로 660, 유스페이스1 A동 605호</p> */}
                {/* <p>사업자등록번호: 614-88-00597</p> */}
                {/* <p>통신판매업 신고번호: 2017-성남분당-0933호</p> */}
                {/* <p>개인정보보호책임자: service@catchtable.co.kr</p> */}
                {/* <p>대표번호: 070-7917-1211</p> */}
            </div>
            <div className="footer-links">
                <a href="#">서비스 이용약관</a>
                <a href="#">개인정보 처리방침</a>
                <a href="#">위치정보 이용약관</a> <br/> 
                <a href="#">인재 채용</a>
                <a href="/restaurantCreate">입점 문의</a>
                <a href="#">광고/제휴 문의</a>
            </div>
            <div className="footer-global">
                {/* <a href="#">CATCHTABLE Global for foreigners</a> */}
            </div>
        </footer>
    );
}

export default Footer;
