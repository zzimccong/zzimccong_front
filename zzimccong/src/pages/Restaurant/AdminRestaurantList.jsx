import React, { useEffect, useState, useContext } from 'react';
import axios from '../../utils/axiosConfig';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom'; 
import logo from '../../assets/icons/logo.png';
import "./AdminRestaurantList.css"

function AdminRestaurantList() {
  const { isLoggedIn, user } = useContext(AuthContext); 
  const [restaurants, setRestaurants] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // 검색어 상태 추가
  const navigate = useNavigate(); 

  useEffect(() => {
    if (isLoggedIn === null) return;  

    if (!isLoggedIn) {
      alert('로그인이 필요합니다.');
      navigate('/account');
      return;
    }

    if (user?.role !== 'ADMIN') {
      alert('접근 권한이 없습니다.');
      navigate('/'); 
      return;
    }

    axios.get('/api/restaurants')
      .then(response => {
        setRestaurants(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the restaurant data!', error);
      });
  }, [isLoggedIn, user, navigate]);

  const handleStateChange = (id, newState) => {
    axios.put(`/api/restaurant/${id}/state`, { state: newState })
      .then(response => {
        setRestaurants(prevRestaurants => 
          prevRestaurants.map(restaurant =>
            restaurant.id === id ? { ...restaurant, state: newState } : restaurant
          )
        );
      })
      .catch(error => {
        console.error('There was an error updating the restaurant state!', error);
      });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredRestaurants = restaurants.filter(restaurant =>
    restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    restaurant.state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isLoggedIn || user?.role !== 'ADMIN') {
    return null; 
  }

  return (
    <div>
      <div className="header">
        <img src={logo} className="logo" />
        <div className="AdminRestaurantList-title">가게 목록</div>
      </div>
      <div className="AdminRestaurantList-input-container">
        <input
          type="text"
          className="AdminRestaurantList-input"
          placeholder="가게 이름 또는 상태 입력"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        
        <table className="AdminRestaurantList-table">
          <thead>
            <tr>
              <th className="AdminRestaurantList-th">가게 이름</th>
              <th className="AdminRestaurantList-th">가게 상태</th>
            </tr>
          </thead>
          <tbody>
            {filteredRestaurants.map((restaurant, index) => (
              <tr key={index} className="AdminRestaurantList-tr">
                <td className="AdminRestaurantList-td">{restaurant.name}</td>
                <td className="AdminRestaurantList-td">
                  <select
                    className="AdminRestaurantList-select"
                    value={restaurant.state}
                    onChange={(e) => handleStateChange(restaurant.id, e.target.value)}
                  >
                    <option value="승인 대기 중">승인 대기 중</option>
                    <option value="영업 중">영업 중</option>
                    <option value="휴업">휴업</option>
                    <option value="폐업">폐업</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminRestaurantList;
