import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from './../../utils/axiosConfig';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Pagination, Navigation } from 'swiper/modules';
import './Restaurants.css';
import { AuthContext } from './../../context/AuthContext'; // AuthContext 가져오기

function Restaurants() {
  const { user } = useContext(AuthContext); // 현재 로그인한 사용자 정보 가져오기
  const [restaurants, setRestaurants] = useState([]);
  const [favoritedRestaurants, setFavoritedRestaurants] = useState({});

  useEffect(() => {
    axios.get('/api/restaurants')
      .then(response => {
        setRestaurants(response.data);
      })
      .catch(error => {
        console.error('Error fetching restaurants:', error);
      });

    // 사용자가 이미 찜한 레스토랑 목록 가져오기
    if (user) {
      axios.get(`/api/zzim/user/${user.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        params: {
          userType: user.role  // userType을 쿼리 파라미터로 추가
        }
      })
      .then(response => {
        const favorited = {};
        response.data.forEach(zzim => {
          favorited[zzim.restaurantId] = true;
        });
        setFavoritedRestaurants(favorited);
      })
      .catch(error => {
        console.error('Error fetching favorited restaurants:', error);
      });
    }
  }, [user]);

  const getShortenedAddress = (address) => {
    const parts = address.split(' ');
    return parts.length > 2 ? `${parts[0]} ${parts[1]}` : address;
  };

  const toggleFavorite = (restaurantId) => {
    const isFavorited = favoritedRestaurants[restaurantId];
    const userType = user.role;
  
    if (isFavorited) {
      axios.delete(`/api/zzim/${user.id}/${restaurantId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        params: {
          userType: userType,
        }
      })
      .then(() => {
        setFavoritedRestaurants(prevState => ({
          ...prevState,
          [restaurantId]: false
        }));
      })
      .catch(error => {
        console.error('Error removing favorite:', error);
      });
    } else {
      const zzimData = {
        restaurant: { id: restaurantId },
      };
  
      if (userType === "CORP") {
        zzimData.corporation = { id: user.id };
      } else {
        zzimData.user = { id: user.id };
      }
  
      axios.post('/api/zzim', zzimData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          'Content-Type': 'application/json',
        },
        params: {
          userType: userType,
        }
      })
      .then(response => {
        setFavoritedRestaurants(prevState => ({
          ...prevState,
          [restaurantId]: true
        }));
      })
      .catch(error => {
        console.error('Error adding favorite:', error);
      });
    }
  };
  

  return (
    <div className="restaurants-container">
      <div className="swiper-container-wrappers">
        <Swiper
          grabCursor={true}
          centeredSlides={false}
          loop={true}
          slidesPerView={2} // 두 개의 슬라이드가 보이도록 설정
          spaceBetween={30} // 슬라이드 사이의 간격 설정
          pagination={{ clickable: true, el: '.swiper-pagination' }}
          navigation={{ nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' }}
          modules={[Pagination, Navigation]}
          className="swiper_containers"
        >
          {restaurants.map(restaurant => (
            <SwiperSlide key={restaurant.id}>
              <Link to={`/restaurant/${restaurant.id}`} className="restaurant-card">
                <img src={restaurant.mainPhotoUrl} alt={restaurant.name} className="restaurant-image" />
                <div className="restaurant-title">
                  <h3>{restaurant.name}</h3>
                  {/* <div className="restaurant-details-row"> */}
                    <svg
                      onClick={(e) => {
                        e.preventDefault(); // Prevent navigation when clicking the SVG
                        toggleFavorite(restaurant.id);
                      }}
                      width="20px"
                      height="20px"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      style={{
                        cursor: 'pointer',
                        fill: favoritedRestaurants[restaurant.id] ? 'red' : 'none', // Change color when favorited
                        stroke: favoritedRestaurants[restaurant.id] ? 'red' : '#000000',
                      }}
                    >
                      <g id="ic-folder-heart">
                        <path className="cls-1" d="M16.41,13.1a2.88,2.88,0,0,1,4.08,4.08l-.74-.74h0L15.67,22h0l-4.07-4.08h0l-.75-.74a2.88,2.88,0,0,1,4.08-4.08l.75.74Z" />
                        <path className="cls-2" d="M8,20.3H4a2,2,0,0,1-2-2V7.3H20a2,2,0,0,1,2,2" />
                        <path className="cls-2" d="M2,11.1v-6a1,1,0,0,1,.91-1h8.86a.89.89,0,0,1,.64.29L14,7.3" />
                      </g>
                    </svg>
                    <p className="category">{restaurant.category}</p>
                  {/* </div> */}
                </div>
                <p className="address">{getShortenedAddress(restaurant.roadAddress)}</p>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
        
        <div className="swiper-pagination"></div>
      </div>
      <div className="swiper-buttons">
        {/* <div className="swiper-button-prev"></div> */}
        {/* <div className="swiper-button-next"></div> */}
      </div>
    </div>
  );
}

export default Restaurants;
