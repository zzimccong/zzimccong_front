import React, { useEffect, useState, useContext } from 'react';
import axios from '../../utils/axiosConfig';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function ManagerRestaurantList() {
  const { isLoggedIn, user } = useContext(AuthContext);
  const [restaurants, setRestaurants] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // 로그인 상태가 아닐 경우 로그인 페이지로 리디렉션
    if (isLoggedIn === null) return;  // isLoggedIn이 null이면 아무 작업도 하지 않음

    if (!isLoggedIn) {
      alert('로그인이 필요합니다.');
      navigate('/account');
      return;
    }

    // user가 null이 아닐 때만 권한을 검사
    if (user?.role !== 'MANAGER') {
      alert('접근 권한이 없습니다.');
      navigate('/'); // 메인 페이지로 리디렉션
      return;
    }
    // console.log(user.id);

    // 서버에서 사용자 ID에 연결된 가게 목록을 가져옴
    axios.get(`/api/restaurants/user/${user.id}`)
      .then(response => {
        console.log('Fetched restaurants:', response.data);  // 이 부분을 추가

        setRestaurants(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the restaurant data!', error);
      });
  }, [isLoggedIn, user, navigate]);

  if (!isLoggedIn || user?.role !== 'MANAGER') {
    return null; // 이미 리디렉션되므로 아무것도 렌더링하지 않음
  }

  return (
    <div>
      <h2>내 가게 목록 (매니저용)</h2>
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
              <td>{restaurant.state}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ManagerRestaurantList;
