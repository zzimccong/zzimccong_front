import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "../../utils/axiosConfig";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import './UserAnalysis.css';  // CSS 파일 임포트

ChartJS.register(ArcElement, Tooltip, Legend);

function UserAnalysis() {
  const location = useLocation();
  const { userId, role, userName, corpName } = location.state; 
  const [reservationCount, setReservationCount] = useState(0);
  const [noShowCount, setNoShowCount] = useState(0);
  const [noShowRate, setNoShowRate] = useState(0);

  useEffect(() => {
    axios
      .get(`/api/analysis/reservation/count?id=${userId}&role=${role}`)
      .then((response) => {
        setReservationCount(response.data);
      })
      .catch((error) => {
        console.error("Error fetching reservation count:", error);
      });

    axios
      .get(`/api/analysis/noshow/count?id=${userId}&role=${role}`)
      .then((response) => {
        setNoShowCount(response.data);
      })
      .catch((error) => {
        console.error("Error fetching no-show count:", error);
      });

    axios
      .get(`/api/analysis/noshow/rate?id=${userId}&role=${role}`)
      .then((response) => {
        setNoShowRate(response.data);
      })
      .catch((error) => {
        console.error("Error fetching no-show rate:", error);
      });
  }, [userId, role]);

  const data = {
    labels: ["노쇼", "정상 예약"],
    datasets: [
      {
        label: "노쇼 확률",
        data: [noShowRate, 100 - noShowRate],
        backgroundColor: ["#FF6384", "#36A2EB"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB"],
      },
    ],
  };

  return (
    <div className="UserAnalysis-container">
      <div className="UserAnalysis-card">
        <h2 className="UserAnalysis-title">
          {role === "USER" ? userName : role === "CORP" ? corpName : "이름을 불러올 수 없습니다"} 님의 노쇼 통계
        </h2>
        
        <div className="UserAnalysis-stats-container">
          <p className="UserAnalysis-stats">총 예약 횟수: {reservationCount}</p>
          <p className="UserAnalysis-stats">총 노쇼 횟수: {noShowCount}</p>
        </div>

        <div className="UserAnalysis-chart-container">
          <Doughnut data={data} />
        </div>

        <p className="UserAnalysis-noshow-rate">노쇼 확률: {noShowRate}%</p>
      </div>
    </div>
  );
}

export default UserAnalysis;
