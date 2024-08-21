import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom"; // 페이지 이동을 위한 useNavigate 훅
import axios from "../../utils/axiosConfig";
import "./MyReservations.css";
import { AuthContext } from "../../context/AuthContext";

function MyReservations() {
  const { user } = useContext(AuthContext);
  const [reservations, setReservations] = useState([]);
  const [restaurantDetails, setRestaurantDetails] = useState({});
  const [reviewedReservations, setReviewedReservations] = useState([]); // 이미 리뷰된 예약 목록
  const [tab, setTab] = useState("upcoming");
  const [activeMainTab, setActiveMainTab] = useState("reservations");

  const navigate = useNavigate(); // useNavigate 훅 사용

  useEffect(() => {
    if (user) {
      const token = localStorage.getItem("token"); // JWT 토큰 가져오기
      const userString = localStorage.getItem("user");
      const user=JSON.parse(userString);
      let userId=user.id;
      let userType=user.role;

      if (!token || !userId) {
        console.error("JWT 토큰이나 User ID가 설정되어 있지 않습니다.");
        return;
      }

      // 백엔드로 userId를 params로 전달
      axios
        .get("/api/reservations/user", {
          headers: {
            Authorization: `Bearer ${token}`, // JWT 토큰을 Authorization 헤더에 추가
          },
          params: {
            userId: userId, // userId를 params로 전달
            userType: userType
          },
        })
        .then((response) => {
          setReservations(response.data);
          response.data.forEach((reservation) => {
            fetchRestaurantDetails(reservation.restaurantId);
            checkIfReviewed(reservation.id); // 예약마다 리뷰 존재 여부 확인
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
      .get(`/api/reviews/reservation/${reservationId}`) // 리뷰가 있는지 확인하는 API 호출
      .then((response) => {
        if (response.data.reviewExists) { // 리뷰가 있으면 상태 업데이트
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
          <p>해당 상태의 예약이 없습니다.</p>
          <p>캐치테이블을 통해 편리하게 예약해 보세요!</p>
          <button className="explore-restaurants">레스토랑 둘러보기</button>
        </div>
      );
    }

    return (
      <div className="reservations-list">
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

            {/* 예약이 '방문 완료' 상태일 때 리뷰 버튼 표시 */}
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
