import React, { useEffect, useState, useContext } from 'react';
import axios from '../../utils/axiosConfig';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom'; // useNavigate 훅 가져오기

function AdminRestaurantList() {
  const { isLoggedIn, user } = useContext(AuthContext); // isLoggedIn 상태 추가
  const [restaurants, setRestaurants] = useState([]);
  const navigate = useNavigate(); // useNavigate 훅 사용

  useEffect(() => {
    if (isLoggedIn === null) return;  // isLoggedIn이 null이면 아무 작업도 하지 않음

    // 로그인 상태가 아닐 경우 로그인 페이지로 리디렉션
    if (!isLoggedIn) {
      alert('로그인이 필요합니다.');
      navigate('/account');
      return;
    }

    // user가 null이 아닐 때만 권한을 검사
    if (user?.role !== 'ADMIN') {
      alert('접근 권한이 없습니다.');
      navigate('/'); // 메인 페이지로 리디렉션
      return;
    }

    // 서버에서 가게 목록을 가져옴
    axios.get('/api/restaurants')
      .then(response => {
        setRestaurants(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the restaurant data!', error);
      });
  }, [isLoggedIn, user, navigate]);

  const handleStateChange = (id, newState) => {
    // 서버에 상태 변경 요청을 보냄
    axios.put(`/api/restaurant/${id}/state`, { state: newState })
      .then(response => {
        // 상태가 성공적으로 변경되면, 로컬 상태도 업데이트
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

  if (!isLoggedIn || user?.role !== 'ADMIN') {
    return null; // 이미 리디렉션되므로 아무것도 렌더링하지 않음
  }

  return (
    <div>
      <h2>가게 목록 (관리자용)</h2>
      <table>
        <thead>
          <tr>
            <th>가게 이름</th>
            <th>가게 상태</th>
          </tr>
        </thead>
        <tbody>
          {restaurants.map((restaurant, index) => (
            <tr key={index}>
              <td>{restaurant.name}</td>
              <td>
                <select
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
  );
}

export default AdminRestaurantList;
