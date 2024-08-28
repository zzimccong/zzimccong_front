import { useState } from 'react';
import ShortCut from './shortCut';
import Carousel from './Carousel';
import Footer from '../../components/Footer';
import Restaurants from '../Restaurant/Restaurants';
import { Link } from 'react-router-dom';
import ChatBot from '../../components/chatbot/ChatBot';


export default function Home() {
  const [visible, setVisible] = useState(false);

  function onBottomSheet() {
    setVisible(!visible);
  }

  function getVisible(value) {
    setVisible(value);
  }

  return (
    <main className="main ">
      {/* 캐러셀 */}
      <ShortCut/>
      <section className="gap shortcut-gap"></section>
      {/* <Carousel className="carousel"/> */}
      <section className="gap shortcut-gap"></section>

      <section className="section pb-[45px]">
        <div className="px-[20px]">
          <div className="section-header section-header-v">
            <h3 className="font-bold">웨이팅 핫플레이스 BEST</h3>
            <p>핫 한 웨이팅 라인업, 이제 찜꽁플랜에서!</p>
            <Link to="/restaurants" className="btn-more">전체보기</Link>
          </div>
          <div className="section-body">
            <div className="v-scroll">
                <Restaurants />
            </div>
          </div>
        </div>
      </section>
      <ChatBot className="chat-bot"/>
      {/* 푸터 */}
      <Footer className="footer"/>
    </main>
  );
}
