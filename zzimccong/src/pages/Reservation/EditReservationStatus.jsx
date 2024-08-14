import React, { useEffect, useState } from "react";
import axios from "../../utils/axiosConfig";
import "./EditReservationStatus.css";

function EditReservationStatus() {
  const [reservations, setReservations] = useState([]);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  useEffect(() => {
    // Fetch reservations data
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

  const handleUpdateStatus = () => {
    if (selectedReservation && newStatus) {
      axios
        .put(`/api/reservations/${selectedReservation.id}/status`, newStatus, {
          headers: { "Content-Type": "text/plain" },
        })
        .then((response) => {
          alert("Reservation status updated successfully!");
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
      alert("Please select a reservation and status.");
    }
  };

  return (
    <div className="edit-reservation-status-container">
      <h2>Update Reservation Status</h2>
      <div className="reservations-list">
        {reservations.map((reservation) => (
          <div
            key={reservation.id}
            className={`reservation-card ${
              selectedReservation && selectedReservation.id === reservation.id
                ? "selected"
                : ""
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
          </div>
        ))}
      </div>
      {selectedReservation && (
        <div className="update-status">
          <h3>Update Status for Reservation ID: {selectedReservation.id}</h3>
          <select value={newStatus} onChange={handleStatusChange}>
            <option value="">Select Status</option>
            <option value="예약 대기">예약 대기</option>
            <option value="예약 확정">예약 확정</option>
            <option value="취소됨">취소됨</option>
            <option value="노쇼">노쇼</option>
          </select>
          <button onClick={handleUpdateStatus}>Update Status</button>
        </div>
      )}
    </div>
  );
}

export default EditReservationStatus;
