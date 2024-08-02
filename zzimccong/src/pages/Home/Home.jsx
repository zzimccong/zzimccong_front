import { useState } from 'react';
import Carousel from './Carousel';


export default function Home() {
  const [visible, setVisible] = useState(false);

  function onBottomSheet () {
    setVisible(!visible);
  };

  function getVisible(value) {
    setVisible(value);
  }

  return (
    <main className="main">
 
      {/* 바텀시트 */}
      {/* { visible && <BottomSheet visible={visible} getVisible={getVisible}/> } */}
      {/* 캐러셀 */}
      <Carousel />
      <section className='gap'></section>
      {/* 숏컷 */}
      {/* <ShortCut /> */}
      <section className='gap shortcut-gap'></section>
      {/* 어디로 가시나요? */}
      <section className='section pb-[45px]'>
        <div className="px-[20px]">
          <div className="section-header">
            <h3 className="font-bold">어디로 가시나요?</h3>
          </div>
          <div className="section-body">
            <div className="v-scroll">
              <div className='v-scroll-inner'>
                {/* <QuickSearch /> */}
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* 웨이팅 핫플레이스 BEST */}
      <section className='section pb-[45px]'>
        <div className="px-[20px]">
          <div className="section-header section-header-v">
            <h3 className="font-bold">웨이팅 핫플레이스 BEST</h3>
            <p>핫 한 웨이팅 라인업, 이제 캐치테이블에서!</p>
            <a className="btn-more">전체보기</a>
          </div>
          <div className="section-body">
            <div className="v-scroll">
              <div className='v-scroll-inner'>
                {/* <Restaurants /> */}
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* 유저의 리얼리뷰 Pick */}
      <section className='section pb-[45px]'>
        <div className="px-[20px]">
          <div className="section-header section-header-v">
            <h3 className="font-bold">유저의 리얼리뷰 Pick</h3>
            <p>방문자들이 남긴 솔직한 리뷰를 만나보세요</p>
          </div>
          <div className="section-body">
            <div className="v-scroll">
              <div className='v-scroll-inner'>
                {/* <Restaurants /> */}
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* 유저 이름님이 좋아할 매장 */}
      <section className='section pb-[45px]'>
        <div className="px-[20px]">
          <div className="section-header section-header-v">
            <h3 className="font-bold">님이 좋아할 매장</h3>
            <p>마음에 들 만한 곳을 모아봤어요</p>
            <a className="btn-more">전체보기</a>
          </div>
          <div className="section-body">
            <div className="v-scroll">
              <div className='v-scroll-inner'>
                {/* <Restaurants /> */}
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* 놓치면 안되는 혜택 가득! */}
      <section className='section pb-[45px]'>
        <div className="px-[20px]">
          <div className="section-header section-header-v">
            <h3 className="font-bold">놓치면 안되는 혜택 가득!</h3>
            <p>미식생활을 더욱 스마트하게 즐겨보세요</p>
            <a className="btn-more">전체보기</a>
          </div>
          <div className="section-body">
            <div className="v-scroll">
              <div className='v-scroll-inner'>
                {/* <Restaurants /> */}
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* 캐치테이블 on! */}
      <section className='section pb-[45px]'>
        <div className="px-[20px]">
          <div className="section-header section-header-v">
            <h3 className="font-bold">캐치테이블 ON!</h3>
            <p>편리한 캐치테이블 에약이 오픈되었어요</p>
            <a className="btn-more">전체보기</a>
          </div>
          <div className="section-body">
            <div className="v-scroll">
              <div className='v-scroll-inner'>
                {/* <Restaurants /> */}
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* 미쉐린 가이드 2024 */}
      <section className='section pb-[45px]'>
        <div className="px-[20px]">
          <div className="section-header section-header-v">
            <h3 className="font-bold">미쉐린 가이드 2024</h3>
            <p>미쉐린 맛집도 이제 캐치테이블에서!</p>
            <a className="btn-more">전체보기</a>
          </div>
          <div className="section-body">
            <div className="v-scroll">
              <div className='v-scroll-inner'>
                {/* <Restaurants /> */}
              </div>
            </div>
          </div>
        </div>
      </section>
      <section>
        광고 배너
      </section>
      {/* 음식 종류별 BEST */}
      <section className='section pb-[45px]'>
        <div className="px-[20px]">
          <div className="section-header">
            <h3 className="font-bold">음식종류별 BEST</h3>
          </div>
          <div className="section-body">
            <div className="v-scroll">
              <div className='v-scroll-inner'>
                {/* <BestFoodList/> */}
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* 가격대별 BEST */}
      <section className='section pb-[45px]'>
        <div className="px-[20px]">
          <div className="section-header">
            <h3 className="font-bold">가격대별 BEST</h3>
          </div>
          <div className="section-body">
            
          </div>
        </div>
      </section>
      <section>
        상황별, 주제별 BEST
      </section>
      <section>
        내일 예약 가능한 레스토랑
      </section>
      <section>
        브랜드관
      </section>
      <section>
        다이닝 매거진
      </section>
      <section>
        푸터
      </section>
    </main>
  );
}
