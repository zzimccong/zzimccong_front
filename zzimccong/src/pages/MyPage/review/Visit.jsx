import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReviewModal from './ReviewModal';
import './Visit.css';

export default function Visit() {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedReservation, setSelectedReservation] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const userString = localStorage.getItem('user');
        let userId;

        if (userString) {
            try {
                const user = JSON.parse(userString);
                userId = user.id;
            } catch (error) {
                console.error('Failed to parse user from localStorage', error);
                return;
            }
        } else {
            console.error('User not logged in or user data not found');
            return;
        }

        const fetchReservations = async () => {
            try {
                const response = await axios.get(`/app/api/reservations/${userId}/visited`);
                console.log('Fetched reservations:', response.data);
                setReservations(response.data);
            } catch (err) {
                console.error('Failed to fetch reservations or restaurant', err);
                setError('예약 데이터를 불러오는 데 실패했습니다.');
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchReservations();
        }
    }, []);

    const handleReviewButtonClick = (reservation) => {
        setSelectedReservation(reservation);
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedReservation(null);
    };

    const handleReviewSubmit = async (reviewData) => {
        try {
            const userString = localStorage.getItem('user');
            const user = JSON.parse(userString);
            const userId = user.id;
            const userType = user.role;
    
            // userId와 corpId를 올바르게 설정
            const postData = {
                ...reviewData,
                reservationId: selectedReservation.id,
                userId: userType === 'USER' ? userId : null,
                corpId: userType === 'CORP' ? userId : null,
                rate: parseFloat(reviewData.rate)  // rate를 Double 타입으로 변환
            };
    
            console.log('Sending POST data:', postData);  // 전송할 데이터 확인
    
            await axios.post('/app/api/reviews', postData, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            alert('리뷰가 성공적으로 등록되었습니다!');
            setIsModalOpen(false);
        } catch (error) {
            console.error('Failed to submit review', error);
            alert('리뷰 등록에 실패했습니다.');
        }
    };
    
    

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    const formatDate = (datetime) => {
        const date = new Date(datetime);
        const formattedDate = date.toLocaleDateString();
        const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        return `${formattedDate} ${formattedTime}`;
    };

    return (
        <div className="visit-container">
            <h1>방문 내역</h1>

            <ul className="reservation-list">
                {reservations.map((reservation) => (
                    <li key={reservation.id} className="reservation-item">
                        <div className="reservation-info">
                            <div className="reservation-image">
                                <img 
                                    src={reservation.restaurant.mainPhotoUrl} 
                                    className="restaurant-photo" 
                                    alt="Restaurant"
                                />
                            </div>
                            <div className="reservation-details">
                                <p className="restaurant-name">{reservation.restaurant.name}</p>
                                <p className="reservation-time">{formatDate(reservation.reservationTime)}</p>
                            </div>
                        </div>
                        <button 
                            className="review-button" 
                            onClick={() => handleReviewButtonClick(reservation)}
                        >
                            리뷰 쓰기
                        </button>
                    </li>
                ))}
            </ul>

            {isModalOpen && (
                <ReviewModal 
                    onClose={handleModalClose} 
                    onSubmit={handleReviewSubmit} 
                />
            )}
        </div>
    );
}
