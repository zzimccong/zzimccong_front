import React, { useState, useContext, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "../../utils/axiosConfig";
import "./ReservationCalendar.css";
import { AuthContext } from "../../context/AuthContext";

function ReservationCalendar({ restaurantId, closeModal }) {
  const { user } = useContext(AuthContext);
  const [date, setDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(null);
  const [count, setCount] = useState(2);
  const [request, setRequest] = useState("");
  const [availableSeats, setAvailableSeats] = useState(0);
  const [couponCount, setCouponCount] = useState(0); 
  const [loading, setLoading] = useState(false);

  const times = ["17:00", "17:30", "18:00", "18:30", "19:00", "19:30"];

  useEffect(() => {
    if (selectedTime) {
      const reservationTime = new Date(date);
      const [hours, minutes] = selectedTime.split(":");
      reservationTime.setHours(parseInt(hours, 10));
      reservationTime.setMinutes(parseInt(minutes, 10));
      reservationTime.setSeconds(0, 0);

      setLoading(true);
      axios
        .get(`/api/restaurant/${restaurantId}/availability`, {
          params: {
            date: reservationTime.toISOString().split("T")[0],
            time: selectedTime,
          },
        })
        .then((response) => {
          setAvailableSeats(response.data.availableSeats);
        })
        .catch((error) => {
          console.error("남은 좌석 수 조회 중 오류가 발생했습니다.", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [date, selectedTime, restaurantId]);

  useEffect(() => {
    if (user) {
      axios
        .get(`/api/coupons/${user.id}/reservation/cnt`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((response) => {
          setCouponCount(response.data);
        })
        .catch((error) => {
          console.error("쿠폰 수 조회 중 오류가 발생했습니다.", error);
        });
    }
  }, [user]);

  const handleDateChange = (date) => {
    setDate(date);
    setSelectedTime(null);
    setAvailableSeats(0); 
  };

  const handleTimeClick = (time) => {
    setSelectedTime(time);
  };

  const handleCountChange = (num) => {
    setCount(num);
  };

  const handleRequestChange = (e) => {
    setRequest(e.target.value);
  };

  const handleReservation = () => {
    if (!selectedTime) {
      alert("예약 시간을 선택하세요.");
      return;
    }

    if (count > availableSeats) {
      alert(`남은 좌석 수(${availableSeats}명)보다 많은 인원으로 예약할 수 없습니다.`);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    if (user.role === "USER" || user.role === "MANAGER") {
      axios
        .get(`/api/coupons/${user.id}/reservation/cnt`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          console.log('Coupon Count:', response.data); 
          const couponCnt = response.data;
          if (couponCnt < 2 || couponCnt === 0) {
            alert("예약권이 부족하여 예약이 불가합니다.");
            return;
          }

          proceedReservation(token);
        })
        .catch((error) => {
          console.error("예약 실패", error);
          alert("예약 중 오류가 발생했습니다.");
        });
    } else if (user.role === "CORP") {
      proceedReservation(token);
    }
  };

  const proceedReservation = (token) => {
    const reservationTime = new Date(date);
    const [hours, minutes] = selectedTime.split(":");
    reservationTime.setHours(parseInt(hours, 10));
    reservationTime.setMinutes(parseInt(minutes, 10));
    reservationTime.setSeconds(0, 0);

    const reservationRegistrationTime = new Date();

    const utcReservationTime = new Date(
      reservationTime.getTime() - reservationTime.getTimezoneOffset() * 60000
    );
    const utcReservationRegistrationTime = new Date(
      reservationRegistrationTime.getTime() -
      reservationRegistrationTime.getTimezoneOffset() * 60000
    );

    let reservation;
    if (user.role === "USER" || user.role === "MANAGER") {
      reservation = {
        restaurantId: restaurantId,
        userId: user.id,
        corporationId: null,
        reservationTime: utcReservationTime,
        reservationRegistrationTime: utcReservationRegistrationTime,
        count: count,
        state: "예약 대기",
        request: request,
      };
    } else if (user.role === "CORP") {
      reservation = {
        restaurantId: restaurantId,
        userId: null,
        corporationId: user.id,
        reservationTime: utcReservationTime,
        reservationRegistrationTime: utcReservationRegistrationTime,
        count: count,
        state: "예약 대기",
        request: request,
      };
    }

    console.log("Reservation Data being sent:", reservation);

    axios
      .post("/api/reservations", reservation, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      })
      .then((response) => {
        console.log("Reservation Response:", response.data); 
        alert(`예약되었습니다.`);
        setAvailableSeats((prevSeats) => prevSeats - count);

        axios
          .get(`/api/coupons/${user.id}/reservation/cnt`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            setCouponCount(response.data);
          })
          .catch((error) => {
            console.error("최신 쿠폰 수 조회 중 오류가 발생했습니다.", error);
          });
      })
      .catch((error) => {
        if (error.response) {
          console.error("예약 실패: ", error.response.data);
        } else {
          console.error("예약 실패: ", error.message); 
        }
        alert("예약 실패했습니다.");
      });
  };

  return (
    <div className="container">


      <p className="ReservationCalendar-seat">남은 좌석 수: {loading ? "조회 중..." : `${availableSeats}명`}</p>
      <p>현재 예약권 수: {couponCount}개</p>

      <div className="calendar">
        <Calendar
          onChange={handleDateChange}
          value={date}
          minDate={new Date()}
          className="react-calendar"
        />
      </div>

      <div className="button-group">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
          <button
            key={num}
            onClick={() => handleCountChange(num)}
            className={count === num ? "selected" : ""}
          >
            {num}명
          </button>
        ))}
      </div>
      <div className="button-group">
        {times.map((time) => (
          <button
            key={time}
            onClick={() => handleTimeClick(time)}
            className={selectedTime === time ? "selected" : ""}
          >
            {time}
          </button>
        ))}
      </div>
      <div className="request-input">
        <textarea
          placeholder="요청 사항을 입력하세요"
          value={request}
          onChange={handleRequestChange}
        />
      </div>

      <div className="button-row">
        <button onClick={handleReservation} className="reservation">
          예약하기
        </button>
        <button onClick={closeModal} className="close-button">
          닫기
        </button>
      </div>
    </div>
  );
}

export default ReservationCalendar;
