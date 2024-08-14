import React, { useEffect, useState, useContext } from "react";
import axios from "../../utils/axiosConfig";
import "./MyReservations.css";
import { AuthContext } from "../../context/AuthContext";  // AuthContext를 가져옵니다.

function MyReservations() {
  const { user } = useContext(AuthContext); // 로그인된 사용자 정보를 가져옵니다.
  const [reservations, setReservations] = useState([]);
  const [restaurantDetails, setRestaurantDetails] = useState({});
  const [tab, setTab] = useState("upcoming"); // Default tab
  const [activeMainTab, setActiveMainTab] = useState("reservations"); // Default main tab

  useEffect(() => {
    if (user) {
      // Fetch reservations data for the logged-in user by userId
      axios
        .get(`/api/reservations/user/${user.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((response) => {
          setReservations(response.data);
          response.data.forEach((reservation) => {
            console.log(reservation);
            console.log("Fetched restaurantId:", reservation.restaurantId);  // 확인용 로그
            console.log("Fetched userId:", reservation.userId);  // 확인용 로그
            fetchRestaurantDetails(reservation.restaurantId);
          });
        })
        .catch((error) => {
          console.error("Error fetching reservations:", error);
        });
    }
  }, [user]);

  const fetchRestaurantDetails = (restaurantId) => {
    if (!restaurantDetails[restaurantId]) {
      axios
        .get(`/api/restaurant/${restaurantId}`)
        .then((response) => {
          setRestaurantDetails((prevDetails) => ({
            ...prevDetails,
            [restaurantId]: response.data,
          }));
        })
        .catch((error) => {
          console.error("Error fetching restaurant details:", error);
        });
    }
  };

  const formatReservationTime = (time) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    return new Intl.DateTimeFormat("ko-KR", options).format(new Date(time));
  };

  const getShortenedAddress = (address) => {
    if (!address) return "";
    const parts = address.split(" ");
    return parts.length > 2 ? `${parts[0]} ${parts[1]}` : address;
  };

  const renderReservations = (status) => {
    const filteredReservations = reservations.filter((reservation) => {
      if (status === "upcoming") {
        return (
          reservation.state === "예약 대기" || reservation.state === "예약 확정"
        );
      } else if (status === "completed") {
        return reservation.state === "방문 완료";
      } else if (status === "cancelled") {
        return reservation.state === "취소" || reservation.state === "노쇼";
      }
      return false;
    });

    if (filteredReservations.length === 0) {
      return (
        <div className="empty-state">
          <p>해당 상태의 예약이 없습니다.</p>
          <p>캐치테이블을 통해 편리하게 예약해 보세요!</p>
          <button className="explore-restaurants">레스토랑 둘러보기</button>
        </div>
      );
    }

    return (
       
      <div className="reservations-list ">
        {filteredReservations.map((reservation) => (
          <div key={reservation.id} className="reservation-card">
            <img
              src={restaurantDetails[reservation.restaurantId]?.photo1Url}
              alt="restaurant"
              className="reservation-image"
            />
            <p className="reservation-text">
              {restaurantDetails[reservation.restaurantId]?.name}
            </p>
            <p className="reservation-text">
              {restaurantDetails[reservation.restaurantId]?.category} •{" "}
              {getShortenedAddress(
                restaurantDetails[reservation.restaurantId]?.roadAddress
              )}
            </p>
            <p className="reservation-text">
              예약 시간: {formatReservationTime(reservation.reservationTime)}
            </p>
            <p className="reservation-text">인원 수: {reservation.count}명</p>
            <p className="reservation-text">{reservation.state}</p>
          </div>
        ))}
      </div>
    
    );
  };

  const renderContent = () => {
    if (activeMainTab === "reservations") {
      return (
        <>
        
          <div className="tabs">
            <button
              className={tab === "upcoming" ? "active" : ""}
              onClick={() => setTab("upcoming")}
            >
              방문예정
            </button>
            <button
              className={tab === "completed" ? "active" : ""}
              onClick={() => setTab("completed")}
            >
              방문완료
            </button>
            <button
              className={tab === "cancelled" ? "active" : ""}
              onClick={() => setTab("cancelled")}
            >
              취소/노쇼
            </button>
          </div>
          <div className="content">
            {tab === "upcoming" && renderReservations("upcoming")}
            {tab === "completed" && renderReservations("completed")}
            {tab === "cancelled" && renderReservations("cancelled")}
          </div>
          <div className="cta-section"></div>
        </>
      );
    } else if (activeMainTab === "notifications") {
      return <div>알림 페이지 내용</div>;
    }
  };

  return (
    <div className="main mt-[100px]">
    <div className="my-reservations-container">
      <div className="main-tabs">
        <button
          className={activeMainTab === "reservations" ? "active" : ""}
          onClick={() => setActiveMainTab("reservations")}
        >
          나의 예약
        </button>
        <button
          className={activeMainTab === "notifications" ? "active" : ""}
          onClick={() => setActiveMainTab("notifications")}
        >
          나의 알림
        </button>
      </div>
      <hr />
      {renderContent()}
    </div>
    </div>
  );
}

export default MyReservations;
