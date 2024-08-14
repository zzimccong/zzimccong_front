import React, { useState, useContext } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "./../../utils/axiosConfig";
import "./ReservationCalendar.css";
import { AuthContext } from "./../../context/AuthContext"; // AuthContext 가져오기

function ReservationCalendar({ restaurantId }) {
  const { user } = useContext(AuthContext); // 현재 로그인한 사용자 정보 가져오기
  const [date, setDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(null);
  const [count, setCount] = useState(2);
  const [request, setRequest] = useState("");

  const times = ["17:00", "17:30", "18:00", "18:30", "19:00", "19:30"];

  const handleDateChange = (date) => {
    setDate(date);
    setSelectedTime(null);
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
    console.log("Submitting reservation with restaurantId:", restaurantId);
    if (!selectedTime) {
      alert("예약 시간을 선택하세요.");
      return;
    }

    const token = localStorage.getItem("token"); // JWT 토큰 가져오기
    if (!token) {
      alert("로그인이 필요합니다."); // 토큰이 없을 경우 로그인 요청
      return;
    }

    const reservationTime = new Date(date);
    const [hours, minutes] = selectedTime.split(":");
    reservationTime.setHours(parseInt(hours, 10));
    reservationTime.setMinutes(parseInt(minutes, 10));
    reservationTime.setSeconds(0, 0); // 초와 밀리초를 0으로 설정

    const reservationRegistrationTime = new Date();

    // 로컬 타임존을 고려하여 시간을 UTC로 변환
    const utcReservationTime = new Date(
      reservationTime.getTime() - reservationTime.getTimezoneOffset() * 60000
    );
    const utcReservationRegistrationTime = new Date(
      reservationRegistrationTime.getTime() -
        reservationRegistrationTime.getTimezoneOffset() * 60000
    );

    const reservation = {
      restaurant: { id: restaurantId }, // restaurantId 포함
      user: { id: user.id }, // UserId 포함
      reservationTime: utcReservationTime,
      reservationRegistrationTime: utcReservationRegistrationTime,
      count: count,
      state: "예약 대기",
      request: request,
    };

    axios
      .post("/api/reservations", reservation, {
        headers: {
          Authorization: `Bearer ${token}`, // JWT 토큰을 Authorization 헤더에 추가
          'Content-Type': 'application/json', // Content-Type 헤더 추가
        },
      })
      .then((response) => {
        alert(`예약 성공: ${response.data}`);
      })
      .catch((error) => {
        console.error("예약 실패", error);
      });
  };

  return (
    <div className="container">
      <h2>예약하기</h2>
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
      <button onClick={handleReservation} className="reservation">
        예약하기
      </button>
    </div>
  );
}

export default ReservationCalendar;
