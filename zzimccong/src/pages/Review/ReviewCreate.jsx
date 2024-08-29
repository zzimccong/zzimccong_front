import React, { useState } from "react";
import axios from "../../utils/axiosConfig";
import { useNavigate, useLocation } from "react-router-dom";
import "./ReviewCreate.css"; 

function ReviewCreate() {
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const reservationId = queryParams.get("reservationId");

  const [content, setContent] = useState("");
  const [taste, setTaste] = useState(0);
  const [mood, setMood] = useState(0);
  const [convenient, setConvenient] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post(
        "/api/reviews",
        {
          reservationId,
          content,
          taste,
          mood,
          convenient,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        alert("리뷰가 성공적으로 작성되었습니다.");
        navigate("/myReservation");
      })
      .catch((error) => {
        console.error("리뷰 작성 중 오류가 발생했습니다:", error);
      });
  };

  const handleStarClick = (setter) => (rating) => {
    setter(rating); 
  };

  const renderStars = (rating, setter) => {
    return [...Array(5)].map((_, index) => (
      <span
        key={index}
        className={index < rating ? "star selected" : "star"}
        onClick={() => handleStarClick(setter)(index + 1)}
      >
        ★
      </span>
    ));
  };

  return (
    <div className="review-create-container">
      <h2>리뷰 작성</h2>
      <form onSubmit={handleSubmit}>
        <div className="rating-group">
          <label>맛</label>
          <div>{renderStars(taste, setTaste)}</div>
        </div>
        <div className="rating-group">
          <label>분위기</label>
          <div>{renderStars(mood, setMood)}</div>
        </div>
        <div className="rating-group">
          <label>편의시설</label>
          <div>{renderStars(convenient, setConvenient)}</div>
        </div>

        <div className="form-group">
          <textarea
            placeholder="음식과 가게에 대한 솔직한 리뷰를 남겨주세요."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>

        <div className="disclaimer">
          <p>고객님이 작성해주신 리뷰는 가게를 방문하는 분들께 큰 도움이 됩니다</p>
        </div>

        <button type="submit" className="submit-review-button">
          리뷰 등록
        </button>
      </form>
    </div>
  );
}

export default ReviewCreate;
