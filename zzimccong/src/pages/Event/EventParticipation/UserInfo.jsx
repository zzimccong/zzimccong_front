import React, { useEffect, useState } from 'react';
import axios from '../../../utils/axiosConfig';
import './css/UserInfo.css';

function UserInfo({ eventId, user, userCoupons, userCouponsUsedInEvent, userCouponsUsedInAllEvents }) {
    const [restaurant, setRestaurant] = useState(null);

    useEffect(() => {
        if (eventId) {
            axios.get(`/api/events/${eventId}`)
                .then(response => {
                    const event = response.data;
                    const restaurantInfo = {
                        mainPhotoUrl: event.photo1Url,
                        name: event.restaurantName,
                        reservationTime: event.reservationTime,
                    };
                    setRestaurant(restaurantInfo);
                })
                .catch(error => {
                    console.error('Error fetching event details:', error);
                });
        }
    }, [eventId]);

    return (
        <div className="user-info-container">
            <div className="event-info">
                {restaurant ? (
                    <>
                        <img src={restaurant.mainPhotoUrl} alt={restaurant.name} className="store-image" />
                        <div className="event-details">
                            <p><strong>가게 이름:</strong> {restaurant.name}</p>
                            <p><strong>예약 시간:</strong> {restaurant.reservationTime}</p>
                        </div>
                    </>
                ) : (
                    <p>레스토랑 정보를 가져오는 중입니다...</p>
                )}
            </div>
            <div className="user-info">
                <p><strong>{user?.name}</strong> 님의 보유 추첨권: {userCoupons}장</p>
                <p><strong>해당 이벤트에서 사용한 추첨권:</strong> {userCouponsUsedInEvent}장</p>
                <p><strong>모든 이벤트에서 사용한 추첨권:</strong> {userCouponsUsedInAllEvents}장</p>
            </div>
        </div>
    );
}

export default UserInfo;
