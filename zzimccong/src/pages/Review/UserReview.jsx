import React, { useEffect, useState } from 'react';
import './UserReview.css'; 
import { FaStar, FaAngleDown, FaAngleUp } from 'react-icons/fa'; 
import axios from 'axios';

const UserReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedReviewIds, setExpandedReviewIds] = useState({});

  useEffect(() => {
    const userString = localStorage.getItem("user");
    let userId;
    let role;
    const user = JSON.parse(userString);
    userId = user.id;
    role = user.role;

    if (!userId) {
      setError("사용자 ID를 찾을 수 없습니다.");
      setLoading(false);
      return;
    }

    const apiUrl = `http://localhost:8090/app/api/reviews/myreviews?userId=${userId}&role=${role}`;

    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error("리뷰를 불러오는 데 실패했습니다.");
        }
        return response.json();
      })
      .then((data) => {
        setReviews(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  const handleDelete = (reservationId) => {
    const isConfirmed = window.confirm("리뷰를 삭제하시겠습니까?");

    if (isConfirmed) {
      const deleteUrl = `http://localhost:8090/app/api/reviews/${reservationId}`;

      axios.delete(deleteUrl)
        .then(() => {
          setReviews(reviews.filter(review => review.reservationId !== reservationId));
        })
        .catch((error) => {
          setError("리뷰를 삭제하는 데 실패했습니다.");
        });
    }
  };

  const renderStars = (score) => {
    const totalStars = 5;
    return (
      <div className="user-stars">
        {Array.from({ length: totalStars }, (_, index) => (
          <FaStar
            key={index}
            className={index < score ? 'user-star filled' : 'user-star'}
          />
        ))}
      </div>
    );
  };

  const toggleReviewDetails = (reservationId) => {
    setExpandedReviewIds(prevState => ({
      ...prevState,
      [reservationId]: !prevState[reservationId] 
    }));
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>에러: {error}</div>;
  }

  return (
    <div className="user-reviews-container">
      <h2 className="user-reviews-title">내가 쓴 리뷰</h2>
      {reviews.length > 0 ? (
        <ul className="user-reviews-list">
          {reviews.map((review) => (
            <li className="user-review-item" key={review.reservationId}>
              <div className="user-review-box">
                <div className="name-rating-toggle-row">
                  <p><strong>상호명:</strong> {review.restaurantName}</p>
                  <div className="rating-toggle">
                    <p><strong>평점:</strong> {review.rate}</p>
                    <button 
                      className="toggle-button" 
                      onClick={() => toggleReviewDetails(review.reservationId)}
                    >
                      {expandedReviewIds[review.reservationId] ? <FaAngleUp /> : <FaAngleDown />}
                    </button>
                  </div>
                </div>
                {expandedReviewIds[review.reservationId] && (
                  <>
                    <div className="user-review-rating-row">
                      {renderStars(review.taste)}
                      <p>맛</p>
                    </div>
                    <div className="user-review-rating-row">
                      {renderStars(review.mood)}
                      <p>분위기</p>
                    </div>
                    <div className="user-review-rating-row">
                      {renderStars(review.convenient)}
                      <p>편리함</p>
                    </div>
                  </>
                )}
                <div className='UserReview-user-content-box'>
                  <p>{review.content}</p>
                </div>
                <button className='UserReview-button' onClick={() => handleDelete(review.reservationId)}>삭제</button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>작성한 리뷰가 없습니다.</p>
      )}
    </div>
  );
};

export default UserReviews;
