import React, { useEffect, useState } from "react";
import axios from "../../utils/axiosConfig";
import "./EditReservationStatus.css";
import logo from '../../assets/icons/logo.png';
import { useNavigate } from "react-router-dom";

function EditReservationStatus() {
  const [reservations, setReservations] = useState([]);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [view, setView] = useState("대기"); 
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/api/reservations")
      .then((response) => {
        setReservations(response.data);
      })
      .catch((error) => {
        console.error("Error fetching reservations:", error);
      });
  }, []);

  const handleStatusChange = (e) => {
    setNewStatus(e.target.value);
  };

  console.log(selectedReservation);
  const handleUpdateStatus = () => {
    if (selectedReservation && newStatus) {
      axios
        .put(`/api/reservations/${selectedReservation.id}/status`, newStatus, {
          headers: { "Content-Type": "text/plain" },
        })
        .then((response) => {
          alert("예약 변경이 완료되었습니다.");
          setReservations((prevReservations) =>
            prevReservations.map((reservation) =>
              reservation.id === selectedReservation.id
                ? { ...reservation, state: newStatus }
                : reservation
            )
          );
          setSelectedReservation(null);
          setNewStatus("");
        })
        .catch((error) => {
          console.error("Error updating reservation status:", error);
        });
    } else {
      alert("예약 상태를 변경해주세요.");
    }
  };

  const pendingReservations = reservations.filter(
    (reservation) => reservation.state === "예약 대기"
  );

  const otherReservations = reservations.filter(
    (reservation) => reservation.state !== "예약 대기"
  );

  const handleShowAnalysis = () => {
    if (selectedReservation) {
      const role = selectedReservation.userId ? "USER" : "CORP";
      const userId = selectedReservation.userId || selectedReservation.corpId;
      const userName=selectedReservation.userName;
      const corpName=selectedReservation.corpName;

      navigate(`/analysis/${userId}`, {
        state: { userId, role, userName, corpName },
      });
    }
  };

  return (
    <div>
      <div className="header">
        <img src={logo} className="logo" />
        <div className="edit-reservaion-status-title">나의 가게 예약 현황</div>
      </div>
      <div className="edit-reservaion-status-button-container">
        <button onClick={() => setView("대기")} className={view === "대기" ? "active" : ""}>예약 대기</button>
        <span className="edit-reservaion-status-divider"></span>
        <button onClick={() => setView("현황")} className={view === "현황" ? "active" : ""}>예약 현황</button>
      </div>
      <div className="edit-reservaion-status-container">
        {view === "대기" ? (
          <div className="edit-reservaion-status-reservations-list">
            {pendingReservations.map((reservation) => (
              <div
                key={reservation.id}
                className={`edit-reservaion-status-reservation-card ${
                  selectedReservation && selectedReservation.id === reservation.id
                    ? "edit-reservaion-status-reservation-card selected"
                    : "edit-reservaion-status-reservation-card"
                }`}
                onClick={() => setSelectedReservation(reservation)}
              >
                <p>{reservation.restaurant?.name}</p>
                <p>
                  예약 시간:{" "}
                  {new Date(reservation.reservationTime).toLocaleString()}
                </p>
                <p>인원 수: {reservation.count}명</p>
                <p>상태: {reservation.state}</p>
                {reservation.corpName == null ? (
                    <p>예약자명: {reservation.userName}</p>
                  ) : reservation.userName == null ? (
                    <p>예약자명: {reservation.corpName}</p>
                  ) : null}
                  <button className="EditReservationStatus-analysis" onClick={handleShowAnalysis}>예약자 정보</button>
              </div>
            ))}
          </div>
        ) : (
          <div className="edit-reservaion-status-reservations-list">
            {otherReservations.map((reservation) => (
              <div
                key={reservation.id}
                className={`edit-reservaion-status-reservation-card ${
                  selectedReservation && selectedReservation.id === reservation.id
                    ? "edit-reservaion-status-reservation-card selected"
                    : "edit-reservaion-status-reservation-card"
                }`}
                onClick={() => setSelectedReservation(reservation)}
              >
                <p>{reservation.restaurant?.name}</p>
                <p>
                  예약 시간:{" "}
                  {new Date(reservation.reservationTime).toLocaleString()}
                </p>
                <p>인원 수: {reservation.count}명</p>
                <p>상태: {reservation.state}</p>
                {reservation.corpName == null ? (
                    <p>예약자명: {reservation.userName}</p>
                  ) : reservation.userName == null ? (
                    <p>예약자명: {reservation.corpName}</p>
                  ) : null}
              </div>
            ))}
          </div>
        )}

        {selectedReservation && (
          <div className="edit-reservaion-status-update-status">
            <select value={newStatus} onChange={handleStatusChange}>
              <option value="">예약상태</option>
              <option value="예약 대기">예약 대기</option>
              <option value="예약 확정">예약 확정</option>
              <option value="방문 완료">방문 완료</option>
              <option value="취소됨">취소됨</option>
              <option value="노쇼">노쇼</option>
            </select>
            <button onClick={handleUpdateStatus}>변경</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default EditReservationStatus;
