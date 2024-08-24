import React, { useState, useContext, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "./../../utils/axiosConfig";
import "./ReservationCalendar.css";
import { AuthContext } from "./../../context/AuthContext";

function ReservationCalendar({ restaurantId }) {
  const { user } = useContext(AuthContext);
  const [date, setDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(null);
  const [count, setCount] = useState(2);
  const [request, setRequest] = useState("");
  const [availableSeats, setAvailableSeats] = useState(0); // 남은 좌석 수를 관리하기 위한 상태

  const times = ["17:00", "17:30", "18:00", "18:30", "19:00", "19:30"];

  useEffect(() => {
    // 컴포넌트가 렌더링될 때 해당 레스토랑의 좌석 수 정보를 가져옴
    axios.get(`/api/restaurant/${restaurantId}`)
      .then((response) => {
        setAvailableSeats(response.data.reservationSeats); // 좌석 수를 상태로 설정
      })
      .catch((error) => {
        console.error("좌석 정보를 불러오는 중 오류가 발생했습니다.", error);
      });
  }, [restaurantId]);

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
        restaurant: { id: restaurantId },
        user: { id: user.id },
        corporation: null,
        reservationTime: utcReservationTime,
        reservationRegistrationTime: utcReservationRegistrationTime,
        count: count,
        state: "예약 대기",
        request: request,
      };
    } else if (user.role === "CORP") {
      reservation = {
        restaurant: { id: restaurantId },
        user: null,
        corporation: { id: user.id },
        reservationTime: utcReservationTime,
        reservationRegistrationTime: utcReservationRegistrationTime,
        count: count,
        state: "예약 대기",
        request: request,
      };
    }

    axios
      .post("/api/reservations", JSON.stringify(reservation), {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        alert(`예약 성공: ${response.data}`);
      })
      .catch((error) => {
        console.error("예약 실패", error);
        alert("예약 중 오류가 발생했습니다.");
      });
  };

  return (
    <div className="container">
            <p>남은 좌석 수: {availableSeats}명</p>

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
