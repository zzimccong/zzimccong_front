import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../utils/axiosConfig";
import "./MyReservations.css";
import { AuthContext } from "../../context/AuthContext";

function MyReservations() {
  const { user } = useContext(AuthContext);
  const [reservations, setReservations] = useState([]);
  const [restaurantDetails, setRestaurantDetails] = useState({});
  const [reviewedReservations, setReviewedReservations] = useState([]);
  const [tab, setTab] = useState("upcoming");
  const [activeMainTab, setActiveMainTab] = useState("reservations");

  const navigate = useNavigate(); 

  useEffect(() => {
    if (user) {
      const token = localStorage.getItem("token"); 
      const userString = localStorage.getItem("user");
      const user = JSON.parse(userString);
      let userId = user.id;
      let userType = user.role;

      if (!token || !userId) {
        console.error("JWT 토큰이나 User ID가 설정되어 있지 않습니다.");
        return;
      }

      axios
        .get("/api/reservations/user", {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
          params: {
            userId: userId, 
            userType: userType
          },
        })
        .then((response) => {
          setReservations(response.data);
          response.data.forEach((reservation) => {
            fetchRestaurantDetails(reservation.restaurantId);
            checkIfReviewed(reservation.id);
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

  const checkIfReviewed = (reservationId) => {
    axios
      .get(`/api/reviews/reservation/${reservationId}`) 
      .then((response) => {
        if (response.data.reviewExists) { 
          setReviewedReservations((prevReviewed) => [...prevReviewed, reservationId]);
        }
      })
      .catch((error) => {
        console.error("Error checking review status:", error);
      });
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

  const handleWriteReviewClick = (reservationId) => {
    navigate(`/review/create?reservationId=${reservationId}`);
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
          <p>찜꽁플랜을 통해 맛있는 식사를 예약해 보세요!</p>
        </div>
      );
    }

    return (
      <div className="reservations-list">
        {filteredReservations.map((reservation) => (
          <div key={reservation.id} className="reservation-card">
            <div className="reservation-card-content">
              <img
                src={restaurantDetails[reservation.restaurantId]?.photo1Url}
                alt="restaurant"
                className="reservation-image"
              />
              <div className="reservation-details">
                <p className="reservation-text-name">
                  {restaurantDetails[reservation.restaurantId]?.name}
                </p>
                <p className="reservation-text">
                  {formatReservationTime(reservation.reservationTime)}
                </p>
                <p className="reservation-text">예약 인원: {reservation.count}명</p>
                <p className="reservation-text">예약 상태: {reservation.state}</p>
                
                {status === "completed" && (
                  reviewedReservations.includes(reservation.id) ? (
                    <button className="review-completed-button" disabled>
                      리뷰 등록 완료
                    </button>
                  ) : (
                    <button
                      className="write-review-button"
                      onClick={() => handleWriteReviewClick(reservation.id)}
                    >
                      리뷰 작성
                    </button>
                  )
                )}
              </div>
            </div>
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

        </div>
        {renderContent()}
      </div>
    </div>
  );
}

export default MyReservations;
