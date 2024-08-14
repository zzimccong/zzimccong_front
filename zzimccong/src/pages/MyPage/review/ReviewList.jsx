import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ReviewList.css';

export default function ReviewList() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const userString = localStorage.getItem('user');
        let userId, userRole;

        if (userString) {
            try {
                const user = JSON.parse(userString);
                userId = user.id;
                userRole = user.role;
            } catch (error) {
                console.error('Failed to parse user from localStorage', error);
                setError('사용자 정보를 불러오는 데 실패했습니다.');
                setLoading(false);
                return;
            }
        } else {
            console.error('User not logged in or user data not found');
            setError('사용자 정보가 없습니다.');
            setLoading(false);
            return;
        }

        const fetchReviews = async () => {
            try {
                let response;
                if (userRole === 'USER') {
                    response = await axios.get(`/app/api/reviews/user/${userId}`);
                } else if (userRole === 'CORP') {
                    response = await axios.get(`/app/api/reviews/corp/${userId}`);
                }

                console.log("API Response:", response);

                setReviews(response.data);
            } catch (err) {
                console.error('Failed to fetch reviews', err);
                setError('리뷰를 불러오는 데 실패했습니다.');
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, []);

    if (loading) {
        return <div>Review Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="review-list-container">
            <h1>리뷰 관리</h1>
            <div className="review-list">
                {reviews.map(review => (
                    <div key={review.id} className="review-item">
                        <div className="review-header">
                            {/* <p className="restaurant-name">{review.reservation.restaurant.name}</p> */}
                            <p className="review-rate">평점: {review.rate}</p>
                        </div>
                        <div className="review-content">
                            {review.content}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
