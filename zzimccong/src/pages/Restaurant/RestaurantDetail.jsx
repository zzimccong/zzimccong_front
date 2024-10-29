import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import axios from '../../utils/axiosConfig';
import './RestaurantDetail.css';
import ReservationCalendar from '../Calendar/ReservationCalendar';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import { AuthContext } from '../../context/AuthContext';
import location from '../../assets/icons/RestaurantDetail_location.png';
import clock from '../../assets/icons/RestaurantDetail_clock.png';
import grade from '../../assets/icons/grade.png';
import { FaStar, FaAngleDown, FaAngleUp } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

Modal.setAppElement('#root');

function RestaurantDetail() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isDetailInfoOpen, setIsDetailInfoOpen] = useState(false);
  const [todayBusinessHours, setTodayBusinessHours] = useState('');
  const [allBusinessHours, setAllBusinessHours] = useState('');
  const [showAllBusinessHours, setShowAllBusinessHours] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [lotteryMessage, setLotteryMessage] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [reviews, setReviews] = useState([]);
  const [userAverageRating, setUserAverageRating] = useState(null);
  const [corpAverageRating, setCorpAverageRating] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedReviews, setExpandedReviews] = useState({});

  const navigate = useNavigate();
  const { isLoggedIn } = useContext(AuthContext);

  useEffect(() => {
    axios.get(`/api/restaurant/${id}`)
      .then(response => {
        const facilities = response.data.facilities ? response.data.facilities.replace(/<svg/g, '<svg class="RestaurantDetail-facility-svg"') : '';
        const parkingInfo = response.data.parkingInfo ? response.data.parkingInfo.replace(/<svg/g, '<svg class="RestaurantDetail-parking-svg"') : '';
        const modifiedData = {
          ...response.data,
          facilities: facilities,
          parkingInfo: parkingInfo
        };
        setRestaurant(modifiedData);

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

  useEffect(() => {
    if (!id) {
      setError("가게 ID를 찾을 수 없습니다.");
      setLoading(false);
      return;
    }

    Promise.all([
      axios.get(`/api/reviews/restaurant`, { params: { restaurantId: id } }),
      axios.get(`/api/reviews/average-rates`, { params: { restaurantId: id } })
    ])
      .then(([reviewsResponse, ratingsResponse]) => {
        setReviews(reviewsResponse.data);
        setUserAverageRating(ratingsResponse.data.USER);
        setCorpAverageRating(ratingsResponse.data.CORP);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, [id]);

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

  const handleAddToCart = async () => {
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;

    if (isLoggedIn && user) {
      const response = await axios.get(`/api/cart/${user.id}`);
      const alreadyInCart = response.data.some(item => item.restaurant.id === Number(id));

      if (alreadyInCart) {
        alert("장바구니에 담긴 가게입니다.");
        return;
      }

      const cartItem = {
        userId: user.id,
        restaurantId: id,
      };

      try {
        const response = await axios.post('/api/cart/add', cartItem, {
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
        const tzOffset = date.getTimezoneOffset() * 60000;
        const localISOTime = new Date(date - tzOffset).toISOString().slice(0, -1);
        return localISOTime;
      };

      const eventDTO = {
        restaurantId: id,
        restaurantName: restaurant.name,
        description: restaurant.detailInfo,
        roadAddress: restaurant.roadAddress,
        status: "진행중",
        startDate: formatDateToLocalISOString(startDate),
        endDate: formatDateToLocalISOString(endDate),
        category: restaurant.category,
        mainPhotoUrl: restaurant.mainPhotoUrl
      };

      const response = await axios.post('/api/events/create', eventDTO);
      setLotteryMessage(`추첨 이벤트가 성공적으로 생성되었습니다.`);
      alert("추첨 이벤트가 성공적으로 생성되었습니다.");

    } catch (error) {
      setLotteryMessage('추첨 이벤트 생성 중 오류가 발생했습니다.');
      alert("추첨 이벤트 생성 중 오류가 발생했습니다.");
      console.error('추첨 이벤트 생성 중 오류 발생:', error);
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const calculateRatingDistribution = (reviews) => {
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach(review => {
      const rating = Math.floor(review.rate);
      if (distribution[rating] !== undefined) {
        distribution[rating]++;
      }
    });
    return distribution;
  };

  const ratingDistribution = calculateRatingDistribution(reviews);
  const maxRatingCount = Math.max(...Object.values(ratingDistribution));

  const toggleReview = (reservationId) => {
    setExpandedReviews(prevState => ({
      ...prevState,
      [reservationId]: !prevState[reservationId]
    }));
  };

  const renderStars = (score) => {
    const totalStars = 5;
    return (
      <div className="user-stars">
        {Array.from({ length: totalStars }, (_, index) => (
          <FaStar
            key={index}
            className={index < score ? 'user-star filled' : 'user-star'}
          />
        ))}
      </div>
    );
  };

  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;
  const isManager = user?.role === 'MANAGER';
  const isOwner = user?.name === restaurant?.name;
  console.log("restaurant: ", restaurant);

  if (!restaurant) return <div>Loading...</div>;

  return (
    <div className="RestaurantDetail-container mb-[30px]">
      <Carousel showThumbs={false} className="RestaurantDetail-carousel">
        {restaurant.photo1Url && <div><img src={restaurant.photo1Url} alt={restaurant.name} /></div>}
        {restaurant.photo2Url && <div><img src={restaurant.photo2Url} alt={restaurant.name} /></div>}
        {restaurant.photo3Url && <div><img src={restaurant.photo3Url} alt={restaurant.name} /></div>}
        {restaurant.photo4Url && <div><img src={restaurant.photo4Url} alt={restaurant.name} /></div>}
        {restaurant.photo5Url && <div><img src={restaurant.photo5Url} alt={restaurant.name} /></div>}
      </Carousel>
      <div className="RestaurantDetail-info-row">
        <p className="RestaurantDetail-category">{restaurant.category}</p>
        <a className="RestaurantDetail-phoneNumber" href={`tel:${restaurant.phoneNumber}`}>{restaurant.phoneNumber}</a>
      </div>
      <div className="RestaurantDetail-name">{restaurant.name}</div>
      <br />
      <div className='RestaurantDetail-location-row'>
        <img src={grade} alt="RestaurantDetail_image" className="RestaurantDetail_image" />
        <p className='grade_p'>개인 평점: {userAverageRating !== null ? userAverageRating.toFixed(1) : '0.0'} / 기업 평점: {corpAverageRating !== null ? corpAverageRating.toFixed(1) : '0.0'}</p>
      </div>
      <div className='RestaurantDetail-location-row'>
        <img src={location} alt="RestaurantDetail_image" className="RestaurantDetail_image" />
        <p>{restaurant.roadAddress}</p>
      </div>
      <div className='RestaurantDetail-location-row'>
        <img src={clock} alt="RestaurantDetail_image" className="RestaurantDetail_image" />
        <p>오늘 {todayBusinessHours}</p>
      </div>

      <hr className="RestaurantDetail-hr" />

      {/* 이벤트 생성 섹션: MANAGER이면서 소유자일 경우에만 표시 */}
      {isManager && isOwner && (
        <div className="lottery-event-section">
          <div className="lottery-dates">
            <div className="lottery-date-item">
              <label>시작 날짜</label>
              <DatePicker
                selected={startDate}
                onChange={date => setStartDate(date)}
                dateFormat="yyyy/MM/dd HH:mm"
                showTimeSelect
                className="date-picker"
                popperPlacement="top-end"
              />
            </div>
            <div className="lottery-date-item">
              <label>종료 날짜</label>
              <DatePicker
                selected={endDate}
                onChange={date => setEndDate(date)}
                dateFormat="yyyy/MM/dd HH:mm"
                showTimeSelect
                className="date-picker"
                popperPlacement="top-end"
              />
            </div>
          </div>
          <button onClick={handleCreateLotteryEvent} className="create-lottery">
            추첨 이벤트 생성
          </button>
        </div>
      )}

      <hr className="RestaurantDetail-hr" />

      <div className="RestaurantDetail-tabs">
        <button
          onClick={() => handleTabClick('home')}
          className={`RestaurantDetail-tab-item ${activeTab === 'home' ? 'active' : ''}`}
        >
          홈
        </button>
        <button
          onClick={() => handleTabClick('menu')}
          className={`RestaurantDetail-tab-item ${activeTab === 'menu' ? 'active' : ''}`}
        >
          메뉴
        </button>
        <button
          onClick={() => handleTabClick('reviews')}
          className={`RestaurantDetail-tab-item ${activeTab === 'reviews' ? 'active' : ''}`}
        >
          리뷰
        </button>
      </div>

      <div className="RestaurantDetail-tab-content">
        {activeTab === 'home' ? (
          <div className="RestaurantDetail-home-section">
            <div className="RestaurantDetail-home-section">
              {restaurant.roadAddress && (
                <>
                  <h2 className="RestaurantDetail-section-title">주소</h2>
                  <p>{restaurant.roadAddress}</p>
                  <br />
                </>
              )}

              {restaurant.detailInfo && (
                <>
                  <h2 className="RestaurantDetail-section-title">운영 정보</h2>
                  <div className="RestaurantDetail-detail-info">
                    <p className={isDetailInfoOpen ? "RestaurantDetail-open" : "RestaurantDetail-closed"}>
                      {restaurant.detailInfo}
                    </p>
                    <button onClick={() => setIsDetailInfoOpen(!isDetailInfoOpen)}>
                      {isDetailInfoOpen ? "접기" : "더보기"}
                    </button>
                  </div>
                  <br />
                </>
              )}

              {todayBusinessHours && (
                <>
                  <h2 className="RestaurantDetail-section-title">영업 시간</h2>
                  <p className="RestaurantDetail-operation-time">{todayBusinessHours}</p>
                  <button onClick={handleShowAllBusinessHours} className="RestaurantDetail-show-all-hours-btn">
                    {showAllBusinessHours ? "간략히 보기" : "모든 영업 시간 보기"}
                  </button>
                  {showAllBusinessHours && (
                    <div className="RestaurantDetail-all-business-hours">
                      {Object.keys(allBusinessHours).map(day => (
                        <p key={day}>{day}: {allBusinessHours[day]}</p>
                      ))}
                    </div>
                  )}
                  <br />
                </>
              )}

              {(restaurant.facilities || restaurant.parkingInfo) && (
                <div className="RestaurantDetail-facilities-section">
                  {restaurant.facilities && (
                    <>
                      <h2 className="RestaurantDetail-section-title">편의시설</h2>
                      <div className="facilities-grid">
                        {restaurant.facilities.split(',').map((facility, index) => (
                          <div key={index} className="facility-item">
                            <div dangerouslySetInnerHTML={{ __html: facility.trim() }} />
                          </div>
                        ))}
                      </div>
                      <br />
                    </>
                  )}

                  {restaurant.parkingInfo && (
                    <>
                      <h2 className="RestaurantDetail-section-title">주차정보</h2>
                      <div className="parking-info-text" dangerouslySetInnerHTML={{ __html: restaurant.parkingInfo }} />
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : activeTab === 'menu' ? (
          <div className="RestaurantDetail-menu-section">
            {restaurant.menus && restaurant.menus.map((menu, index) => (
              <div key={index} className="RestaurantDetail-menu-item">
                <div className="RestaurantDetail-menu-item-info">
                  <p className="RestaurantDetail-menu-item-name">{menu.name}</p>
                  <p className="RestaurantDetail-menu-item-description">{menu.description}</p>
                  <p className="RestaurantDetail-menu-item-price">{menu.price}</p>
                </div>
                <div className="RestaurantDetail-menu-item-image">
                  <img src={menu.photoUrl} alt={menu.name} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="RestaurantDetail-user-reviews-container">
            <div className="RestaurantDetail-user-reviews-container-row">
              <div className="RestaurantDetail-average-ratings-distribution">
                <div className="RestaurantDetail-rating-section">
                  <p className="RestaurantDetail-rating-label">개인 평균 별점</p>
                  <div className="RestaurantDetail-average-rating">
                    <FaStar className="filled" />
                    <span>{userAverageRating !== null ? userAverageRating.toFixed(1) : '0.0'}</span>
                  </div>
                </div>
                <div className="RestaurantDetail-rating-section">
                  <p className="RestaurantDetail-rating-label">기업 평균 별점</p>
                  <div className="RestaurantDetail-average-rating">
                    <FaStar className="filled" />
                    <span>{corpAverageRating !== null ? corpAverageRating.toFixed(1) : '0.0'}</span>
                  </div>
                </div>
              </div>

              <div className="RestaurantDetail-rating-distribution">
                {Object.entries(ratingDistribution).reverse().map(([rating, count]) => (
                  <div key={rating} className="RestaurantDetail-rating-row">
                    <span>{rating}점</span>
                    <div className="RestaurantDetail-rating-bar">
                      <div
                        className="RestaurantDetail-rating-bar-fill"
                        style={{ width: `${(count / maxRatingCount) * 100}%` }}
                      ></div>
                    </div>
                    <span>{count}</span>
                  </div>

                ))}
              </div>
            </div>
            <hr className="RestaurantDetail-hr" />

            {reviews.length > 0 ? (
              <ul className="RestaurantDetail-user-reviews-list">
                {reviews.map((review, index) => (
                  <React.Fragment key={review.reservationId}>
                    <div className="RestaurantDetail-user-review-item">
                      <div className="RestaurantDetail-user-review-box">
                        <div className="RestaurantDetail-review-header">
                          <p><strong>작성자:　</strong> {review.userName ? review.userName : review.corpName}</p>
                          <div className="RestaurantDetail-review-stars-row">
                            <span className="RestaurantDetail-review-rating"><FaStar className="filled" /> {review.rate.toFixed(1)}</span>
                            <button onClick={() => toggleReview(review.reservationId)} className="RestaurantDetail-toggle-button">
                              {expandedReviews[review.reservationId] ? <FaAngleUp /> : <FaAngleDown />}
                            </button>
                          </div>
                        </div>
                        {expandedReviews[review.reservationId] && (
                          <div className="RestaurantDetail-detailed-ratings-row">
                            <div className="RestaurantDetail-detailed-rating-item">
                              맛 <FaStar className="filled" /> <p>{review.taste}</p>
                            </div>
                            <div className="RestaurantDetail-detailed-rating-item">
                              분위기 <FaStar className="filled" /> <p>{review.mood}</p>
                            </div>
                            <div className="RestaurantDetail-detailed-rating-item">
                              편리함 <FaStar className="filled" /> <p>{review.convenient}</p>
                            </div>
                          </div>
                        )}
                        <div className="RestaurantDetail-review-content-box">
                          <p>{review.content}</p>
                        </div>
                      </div>
                    </div>
                    {index < reviews.length - 1 && <hr className="RestaurantDetail-review-divider" />}
                  </React.Fragment>
                ))}
              </ul>
            ) : (
              <p>작성된 리뷰가 없습니다.</p>
            )}
          </div>
        )}
      </div>

      <div className="RestaurantDetail-reservation-section">
        <button onClick={handleReservationClick} className="RestaurantDetail-reservation">
          예약하기
        </button>
        {isLoggedIn && user?.role === 'CORP' && (
          <button onClick={handleAddToCart} className="RestaurantDetail-reservation">
            장바구니
          </button>
        )}
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        className="RestaurantDetail-Modal"
        overlayClassName="RestaurantDetail-Overlay"
      >
        <ReservationCalendar
          restaurantId={id}
          closeModal={() => setModalIsOpen(false)}
        />
      </Modal>
    </div>
  );
}

export default RestaurantDetail;
