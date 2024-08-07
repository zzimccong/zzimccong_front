import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Modal from 'react-modal';
import axios from './../../utils/axiosConfig';
import './RestaurantDetail.css';
import ReservationCalendar from '../Calendar/ReservationCalendar'; // 추가
import "react-responsive-carousel/lib/styles/carousel.min.css"; // 스타일 추가
import { Carousel } from 'react-responsive-carousel';

Modal.setAppElement('#root'); // AppElement 설정

function RestaurantDetail() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false); // 모달 상태 추가
  const [isDetailInfoOpen, setIsDetailInfoOpen] = useState(false); // 상세 정보 접기 상태 추가
  const [todayBusinessHours, setTodayBusinessHours] = useState(''); // 오늘의 영업 시간 상태 추가
  const [allBusinessHours, setAllBusinessHours] = useState(''); // 모든 영업 시간 상태 추가
  const [showAllBusinessHours, setShowAllBusinessHours] = useState(false); // 모든 영업 시간 표시 상태 추가

  useEffect(() => {
    axios.get(`/api/restaurant/${id}`)
      .then(response => {
        const facilities = response.data.facilities ? response.data.facilities.replace(/<svg/g, '<svg class="facility-svg"') : '';
        const parkingInfo = response.data.parkingInfo ? response.data.parkingInfo.replace(/<svg/g, '<svg class="parking-svg"') : '';
        const modifiedData = {
          ...response.data,
          facilities: facilities,
          parkingInfo: parkingInfo
        };
        setRestaurant(modifiedData);

        // 영업 시간 객체 생성
        const businessHours = {
          '일': '',
          '월': '',
          '화': '',
          '수': '',
          '목': '',
          '금': '',
          '토': '',
          '매일': ''
        };

        const parseBusinessHours = (hoursString) => {
          const lines = hoursString.split('\n');
          const customHours = {};
          lines.forEach(line => {
            const [day, hours] = line.split(': ');
            if (day && hours) {
              customHours[day] = hours;
            } else if (hours) {
              customHours['기타'] = hours;
            }
          });
          return customHours;
        };

        const businessHoursParsed = parseBusinessHours(response.data.businessHours);
        setAllBusinessHours(businessHoursParsed);

        // 현재 요일 계산
        const days = ['일', '월', '화', '수', '목', '금', '토'];
        const today = days[new Date().getDay()];
        setTodayBusinessHours(`${today}: ${businessHoursParsed[today] || businessHoursParsed['매일'] || businessHoursParsed['기타']}`);

      })
      .catch(error => {
        console.error('Error fetching restaurant details:', error);
      });
  }, [id]);

  if (!restaurant) return <div>Loading...</div>;

  const handleShowAllBusinessHours = () => {
    setShowAllBusinessHours(!showAllBusinessHours);
  };

  return (
    <div className="restaurant-detail-container">
      <Carousel showThumbs={false}>
        {restaurant.photo1Url && <div><img src={restaurant.photo1Url} alt={restaurant.name} /></div>}
        {restaurant.photo2Url && <div><img src={restaurant.photo2Url} alt={restaurant.name} /></div>}
        {restaurant.photo3Url && <div><img src={restaurant.photo3Url} alt={restaurant.name} /></div>}
        {restaurant.photo4Url && <div><img src={restaurant.photo4Url} alt={restaurant.name} /></div>}
        {restaurant.photo5Url && <div><img src={restaurant.photo5Url} alt={restaurant.name} /></div>}
      </Carousel>
      <p className="category">{restaurant.category}</p>
      <div className="name">{restaurant.name}</div>
      <br/>
      <p>{restaurant.phoneNumber} 전화버튼 </p>
      <p className="rating">★ {restaurant.rating}</p>
      <br/>
      <p>{restaurant.description}</p>
      <p className="location">{restaurant.location}</p>
      <h1>주소</h1>
      <p>{restaurant.roadAddress}</p>
      <br/>
      <h1>상세 정보</h1>
      <div className="detail-info">
        {restaurant.detailInfo && (
          <>
            <p className={isDetailInfoOpen ? "open" : "closed"}>
              {restaurant.detailInfo}
            </p>
            <button onClick={() => setIsDetailInfoOpen(!isDetailInfoOpen)}>
              {isDetailInfoOpen ? "접기" : "더 보기"}
            </button>
          </>
        )}
      </div>
      <br/>
      <h2>영업 시간</h2>
      <p className="operation-time">{todayBusinessHours}</p>
      <button onClick={handleShowAllBusinessHours} className="show-all-hours-btn">
        {showAllBusinessHours ? "간략히 보기" : "모든 영업 시간 보기"}
      </button>
      {showAllBusinessHours && (
        <div className="all-business-hours">
          {Object.keys(allBusinessHours).map(day => (
            <p key={day}>{day}: {allBusinessHours[day]}</p>
          ))}
        </div>
      )}
      <div className="facilities-section">
        <h2>편의시설</h2>
        {restaurant.facilities && <div dangerouslySetInnerHTML={{ __html: restaurant.facilities }} />}
        <br />
        <h2>주차정보</h2>
        {restaurant.parkingInfo && <div dangerouslySetInnerHTML={{ __html: restaurant.parkingInfo }} />}
      </div>

      <div className="menu-section">
        <h2>메뉴</h2>
        {restaurant.menus && restaurant.menus.map((menu, index) => (
          <div key={index} className="menu-item">
            <div className="menu-item-info">
              <p className="menu-item-name">{menu.name}</p>
              <p className="menu-item-description">{menu.description}</p>
              <p className="menu-item-price">{menu.price}</p>
            </div>
            <div className="menu-item-image">
              <img src={menu.photoUrl} alt={menu.name} />
            </div>
          </div>
        ))}
      </div>

      <div className="reservation-section">
        <button onClick={() => setModalIsOpen(true)} className="reservation">
          예약하기
        </button>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        className="Modal"
        overlayClassName="Overlay"
      >
        <ReservationCalendar restaurantId={id} />
        <button onClick={() => setModalIsOpen(false)} className="close-modal">
          닫기
        </button>
      </Modal>
    </div>
  );
}

export default RestaurantDetail;
