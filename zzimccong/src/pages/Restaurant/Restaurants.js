import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from './../../utils/axiosConfig';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Pagination, Navigation } from 'swiper/modules';
import './Restaurant.css';

function Restaurants() {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    axios.get('/api/restaurants')
      .then(response => {
        setRestaurants(response.data);
      })
      .catch(error => {
        console.error('Error fetching restaurants:', error);
      });
  }, []);

  const getShortenedAddress = (address) => {
    const parts = address.split(' ');
    return parts.length > 2 ? `${parts[0]} ${parts[1]}` : address;
  };

  return (
    <div className="container">
      <h1 className="heading">Restaurant Gallery</h1>
      <div className="swiper-container-wrapper">
        <Swiper
          grabCursor={true}
          centeredSlides={false}
          loop={true}
          slidesPerView={2} // 두 개의 슬라이드가 보이도록 설정
          spaceBetween={30} // 슬라이드 사이의 간격 설정
          pagination={{ clickable: true, el: '.swiper-pagination' }}
          navigation={{ nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' }}
          modules={[Pagination, Navigation]}
          className="swiper_container"
        >
          {restaurants.map(restaurant => (
            <SwiperSlide key={restaurant.id}>
              <Link to={`/restaurant/${restaurant.id}`} className="restaurant-card">
                <img src={restaurant.photo1Url} alt={restaurant.name} className="restaurant-image" />
                <h3>{restaurant.name}</h3>
                <p className="category">{restaurant.category}</p>
                <p className="address">{getShortenedAddress(restaurant.roadAddress)}</p>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="swiper-pagination"></div>
      </div>
        <div className="swiper-buttons">
          <div className="swiper-button-prev"></div>
          <div className="swiper-button-next"></div>
        </div>
    </div>
  );
}

export default Restaurants;
