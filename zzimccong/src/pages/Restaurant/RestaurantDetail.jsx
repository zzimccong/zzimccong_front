import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import DatePicker from 'react-datepicker';
import axios from '../../utils/axiosConfig';
import './RestaurantDetail.css';
import ReservationCalendar from '../Calendar/ReservationCalendar';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import { AuthContext } from '../../context/AuthContext'; // AuthContext 추가

Modal.setAppElement('#root');

function RestaurantDetail() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isDetailInfoOpen, setIsDetailInfoOpen] = useState(false);
  const [todayBusinessHours, setTodayBusinessHours] = useState('');
  const [allBusinessHours, setAllBusinessHours] = useState('');
  const [showAllBusinessHours, setShowAllBusinessHours] = useState(false);
  const [lotteryMessage, setLotteryMessage] = useState(''); // 이벤트 생성 결과 메시지 상태
  const [startDate, setStartDate] = useState(new Date()); // 시작 날짜 상태
  const [endDate, setEndDate] = useState(new Date()); // 종료 날짜 상태

  const navigate = useNavigate();

  const { isLoggedIn } = useContext(AuthContext); // 로그인 상태 확인

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

  const handleReservationClick = () => {
    if (isLoggedIn) {
      setModalIsOpen(true);
    } else {
      alert('로그인 이후 예약 이용 부탁드립니다.');
    }
  };

  //장바구니
  const handleAddToCart = async () => {
    const userString = localStorage.getItem('user');
    const user = JSON.parse(userString);
    console.log("user  ", user);

    if (isLoggedIn) {

      const response = await axios.get(`api/cart/${user.id}`);
      const alreadyInCart = response.data.some(item => item.restaurant.id === Number(id));

      if(alreadyInCart){
        alert("이미 장바구니에 있습니다.");
        return;
      }

      const cartItem = {
        userId: user.id,
        restaurantId: id,
      };
      console.log("전송객체: ", cartItem);
  
      try {
        const response = await axios.post('api/cart/add', cartItem, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (response.status === 200) {
          const userConfirmed = window.confirm('장바구니에 추가되었습니다.\n장바구니로 이동하시겠습니까?');

          if (userConfirmed) {
             navigate('/corp/cart');
          }
        } else {
          alert('장바구니 추가 중 문제가 발생했습니다.');
        }
      } catch (err) {
        console.error('장바구니 추가 중 오류 발생: ', err);
        alert('장바구니 추가 중 오류가 발생했습니다.');
      }
    } else {
      alert('로그인 후 장바구니를 이용해 주세요.');
    }
  };

  const handleCreateLotteryEvent = async () => {
    try {
        const formatDateToLocalISOString = (date) => {
            const tzOffset = date.getTimezoneOffset() * 60000; // 오프셋(밀리초)
            const localISOTime = new Date(date - tzOffset).toISOString().slice(0, -1); // 밀리초 제거
            return localISOTime;
        };

        const eventDTO = {
            restaurantId: id,
            restaurantName: restaurant.name,
            description: restaurant.detailInfo,
            roadAddress: restaurant.roadAddress,
            status: "진행중",  // 기본 상태
            startDate: formatDateToLocalISOString(startDate),  // 사용자가 선택한 시작 날짜
            endDate: formatDateToLocalISOString(endDate),  // 사용자가 선택한 종료 날짜
            category: restaurant.category,
            mainPhotoUrl: restaurant.mainPhotoUrl
        };

        const response = await axios.post('/api/events/create', eventDTO);
        setLotteryMessage(`추첨 이벤트 '${response.data.name}'가 성공적으로 생성되었습니다.`);
    
    } catch (error) {
        setLotteryMessage('추첨 이벤트 생성 중 오류가 발생했습니다.');
        console.error('추첨 이벤트 생성 중 오류 발생:', error);
    }
};

if (!restaurant) return <div>로딩 중...</div>;

  return (
    <div className="restaurant-detail-container mb-[30px]">
      <Carousel showThumbs={false}>
        {restaurant.photo1Url && <div><img src={restaurant.photo1Url} alt={restaurant.name} /></div>}
        {restaurant.photo2Url && <div><img src={restaurant.photo2Url} alt={restaurant.name} /></div>}
        {restaurant.photo3Url && <div><img src={restaurant.photo3Url} alt={restaurant.name} /></div>}
        {restaurant.photo4Url && <div><img src={restaurant.photo4Url} alt={restaurant.name} /></div>}
        {restaurant.photo5Url && <div><img src={restaurant.photo5Url} alt={restaurant.name} /></div>}
      </Carousel>
      <p className="category">{restaurant.category}</p>
      <div className="name">{restaurant.name}</div>

      {/* 이벤트 생성  */}
      <div className="lottery-event-section">
          <label>시작 날짜:</label>
          <DatePicker
            selected={startDate}
            onChange={date => setStartDate(date)}
            dateFormat="yyyy/MM/dd HH:mm"
            showTimeSelect
            className="date-picker"
          />
          <label>종료 날짜:</label>
          <DatePicker
            selected={endDate}
            onChange={date => setEndDate(date)}
            dateFormat="yyyy/MM/dd HH:mm"
            showTimeSelect
            className="date-picker"
          />
          <button onClick={handleCreateLotteryEvent} className="create-lottery">
            이벤트 생성
          </button>
        </div>


      <br/>
      {/* <p>{restaurant.phoneNumber} 전화버튼 </p> */}
      <a href={`tel:${restaurant.phoneNumber}`}>{restaurant.phoneNumber}</a>
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
        <button onClick={handleReservationClick} className="reservation">
          예약하기
        </button>
        
        {isLoggedIn && JSON.parse(localStorage.getItem('user')).role === 'CORP' && (
          <button onClick={handleAddToCart} className="reservation">
            장바구니
          </button>
        )}
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
