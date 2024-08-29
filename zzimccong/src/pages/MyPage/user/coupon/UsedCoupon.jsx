import React, { useEffect, useState } from "react";
import axios from '../../../../utils/axiosConfig.js';
import logo from '../../../../assets/icons/logo.png';
import "./UsedCoupon.css"; // 스타일을 위한 CSS 파일

const UsedCoupon = () => {
  const [reservations, setReservations] = useState([]);
  const [restaurantNames, setRestaurantNames] = useState({}); // 레스토랑 이름을 저장할 상태

  useEffect(() => {
    const userString = localStorage.getItem("user");
    let userId;
    let userType;

    if (userString) {
      try {
        const user = JSON.parse(userString);
        userId = user.id;
        userType = user.role; // userType (role)도 가져옴
      } catch (error) {
        console.error("Failed to parse user from localStorage", error);
        return;
      }
    } else {
      console.error("User not logged in or user data not found");
      return;
    }

    if (userId && userType) {
      axios
        .get(`/api/reservations/user`, {
          params: {
            userId: userId,
            userType: userType, // userType (role)을 쿼리 파라미터로 추가
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((response) => {
          setReservations(response.data);
          // 각 예약에 대해 레스토랑 이름을 조회
          response.data.forEach((reservation) => {
            fetchRestaurantName(reservation.restaurantId);
          });
        })
        .catch((error) => {
          console.error("Error fetching reservations:", error);
        });
    }
  }, []);

  // 레스토랑 이름을 가져오는 함수
  const fetchRestaurantName = (restaurantId) => {
    // 이미 레스토랑 이름이 캐시된 경우 추가 요청하지 않음
    if (!restaurantNames[restaurantId]) {
      axios
        .get(`/api/restaurant/${restaurantId}`)
        .then((response) => {
          setRestaurantNames((prevNames) => ({
            ...prevNames,
            [restaurantId]: response.data.name,
          }));
        })
        .catch((error) => {
          console.error("Error fetching restaurant name:", error);
        });
    }
  };

  // 날짜 포맷팅 함수 (시간을 제외하고 날짜만 반환, 마지막의 '.' 제거)
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    let formattedDate = new Intl.DateTimeFormat("ko-KR", options).format(new Date(dateString));
    
    // 마지막에 있는 '.' 제거
    if (formattedDate.endsWith(".")) {
      formattedDate = formattedDate.slice(0, -1);
    }

    return formattedDate;
  };

  return (
    <div>
      <div className="header">
        <img src={logo} className="logo" />
        <div className="searchcomponent_title">쿠폰 사용 내역</div>
      </div>
      <div className="UsedCoupon-container">
        {reservations.length > 0 ? (
          reservations.map((reservation) => (
            <div key={reservation.id} className="UsedCoupon-item">
              <div className="UsedCoupon-details">
                <p className="UsedCoupon-restaurantName">
                  {restaurantNames[reservation.restaurantId] || "레스토랑 이름 불러오는 중..."}
                </p>
                <p className="UsedCoupon-visitDate">{formatDate(reservation.reservationTime)}</p>
              </div>
              <div className="UsedCoupon-amount">
                <span className="UsedCoupon-negativeAmount">-2개</span>
              </div>
            </div>
          ))
        ) : (
          <p>예약 쿠폰 사용 내역이 없습니다.</p>
        )}
      </div>
    </div>
    
  );
};

export default UsedCoupon;
