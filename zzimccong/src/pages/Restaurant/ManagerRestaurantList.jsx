import React, { useEffect, useState, useContext } from 'react';
import axios from '../../utils/axiosConfig';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './ManagerRestaurantList.css';

function ManagerRestaurantList() {
  const { isLoggedIn, user } = useContext(AuthContext);
  const [restaurants, setRestaurants] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
 
    if (isLoggedIn === null) return; 

    if (!isLoggedIn) {
      alert('로그인이 필요합니다.');
      navigate('/account');
      return;
    }

  
    if (user?.role !== 'MANAGER') {
      alert('접근 권한이 없습니다.');
      navigate('/'); 
      return;
    }
    

    console.log(restaurants);
    
    axios.get(`/api/restaurants/user/${user.id}`)
      .then(response => {
        console.log('Fetched restaurants:', response.data); 

        setRestaurants(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the restaurant data!', error);
      });
  }, [isLoggedIn, user, navigate]);

  const navigateToStoreDetails = (storeId) => {
    navigate(`/restaurant/${storeId}`);  
  };
  
  const getShortAddress = (address) => {
    const parts = address.split(' ');  
    return parts.slice(0, 2).join(' ');  
  };

  if (!isLoggedIn || user?.role !== 'MANAGER') {
    return null; 
  }

  return (
    <div>
      <div className="header">
        <div className="ManagerRestaurantList-title">나의 가게 목록</div>
      </div>
      { restaurants.map((restaurant, index) => (
        <div key={index} className="SearchResults-store-item" onClick={() => navigateToStoreDetails(restaurant.id)}>
        <div className="SearchResults-store-item-content">
          <img src={restaurant.photo1Url} alt={`${restaurant.name} 사진`} />
          <div className="SearchResults-store-details">
            <h3>{restaurant.name}</h3>
            <p>{restaurant.category} / {getShortAddress(restaurant.roadAddress)}</p>
          </div>
        </div>
        <hr className="SearchResults-store-divider" />
      </div>
      ))}
    </div>
  );
}

export default ManagerRestaurantList;
