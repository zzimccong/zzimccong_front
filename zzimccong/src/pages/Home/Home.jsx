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
      <div className="mt-[70px]"></div>
      <section className="gap shortcut-gap"></section>
      <Carousel className="carousel"/>
      {/* <section className="gap shortcut-gap"></section> */}
      <ShortCut/>

      <section className="section pb-[45px]">
        <div className="px-[20px]">
          <div className="section-header section-header-v">
            <h3 className="font-bold">찜꽁 핫플레이스 BEST</h3>
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
