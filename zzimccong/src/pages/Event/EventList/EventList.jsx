import React, { useEffect, useState } from 'react';
import axios from './../../../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';
import './EventList.css';
import { format, differenceInMilliseconds } from 'date-fns';

function EventList() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('/api/events/all')
            .then(response => {
                setEvents(response.data.map(event => ({ ...event, isExpanded: false })));
                setLoading(false);
            })
            .catch(error => {
                setError('이벤트 목록을 가져오는 중 오류가 발생했습니다.');
                setLoading(false);
            });

        const interval = setInterval(() => {
            setEvents(events => 
                events.map(event => {
                    const { status, timeLeft } = calculateStatusAndTimeLeft(event.startDate, event.endDate);
                    return { ...event, status, timeLeft };
                })
            );
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return format(date, 'MM/dd HH:mm');
    }

    const calculateStatusAndTimeLeft = (startDateString, endDateString) => {
        const now = new Date();
        const startDate = new Date(startDateString);
        const endDate = new Date(endDateString);

        if (now < startDate) {
            const timeLeft = differenceInMilliseconds(startDate, now);
            return {
                status: "준비중",
                timeLeft: formatTimeLeft(timeLeft)
            };
        } else if (now >= startDate && now <= endDate) {
            return {
                status: "진행중",
                timeLeft: null
            };
        } else {
            return {
                status: "종료됨",
                timeLeft: null
            };
        }
    };

    const formatTimeLeft = (milliseconds) => {
        const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24));
        const hours = Math.floor((milliseconds / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((milliseconds / (1000 * 60)) % 60);
        const seconds = Math.floor((milliseconds / 1000) % 60);

        return `${days}일 ${hours}시간 ${minutes}분 ${seconds}초 남음`;
    };

    const handleDrawClick = (status, eventId) => {
        if (status === "준비중") {
            setMessage("추첨 시간이 아닙니다.");
        } else if (status === "진행중") {
            navigate(`/event-participation/${eventId}`);
        } else if (status === "종료됨") {
            setMessage("이벤트가 종료되었습니다.");
            navigate(`/event-participation/${eventId}`); // 종료된 이벤트도 이동 가능
        }
    };

    const handleDeleteEvent = (eventId) => {
        if (window.confirm("이 이벤트를 삭제하시겠습니까?")) {
            axios.delete(`/api/events/${eventId}`)
                .then(() => {
                    setMessage("이벤트 삭제가 완료되었습니다.");
                    setEvents(events.filter(event => event.id !== eventId));
                })
                .catch(error => {
                    setMessage('이벤트 삭제 중 오류가 발생했습니다.');
                });
        }
    };

    const toggleExpand = (index) => {
        setEvents(events.map((event, i) => i === index ? { ...event, isExpanded: !event.isExpanded } : event));
    };

    if (loading) {
        return <div>로딩 중...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="event-card-list-container mt-[100px]">
            {events.map((event, index) => {
                const { status, timeLeft } = calculateStatusAndTimeLeft(event.startDate, event.endDate);

                return (
                    <div key={event.id} className="event-card">
                        <div className="event-image-wrapper">
                            <img 
                                src={event.photo1Url} 
                                alt={event.name} 
                                className="event-photo"
                            />
                        </div>
                        <div className="event-details">
                            <div className="event-header">
                                <p className="event-datetime">{formatDate(event.startDate)} ~ {formatDate(event.endDate)}</p>
                                <p className={`event-status ${status.toLowerCase()}`}>{status}</p>
                            </div>
                            <h2 className="event-name">{event.restaurantName}</h2>
                            <p className="event-category">{event.category}</p>
                            <p className={`event-info ${event.isExpanded ? 'expanded' : ''}`}>
                                <span className="event-detailInfo">{event.detailInfo}</span>
                                <span className="event-roadAddress">({event.roadAddress})</span>
                            </p>
                            {!event.isExpanded && (
                                <button className="more-button" onClick={() => toggleExpand(index)}>
                                    더보기
                                </button>
                            )}
                            {event.isExpanded && (
                                <button className="more-button" onClick={() => toggleExpand(index)}>
                                    접기
                                </button>
                            )}
                            {timeLeft && <p className="time-left">{timeLeft}</p>}
                            <div className="event-buttons">
                                <button 
                                    className="event-delete-button" 
                                    onClick={() => handleDeleteEvent(event.id)}
                                >
                                    삭제하기
                                </button>
                                <button 
                                    className="event-button" 
                                    onClick={() => handleDrawClick(status, event.id)}
                                >
                                    추첨하기
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })}
            {message && <div className="message">{message}</div>}
        </div>
    );
}

export default EventList;
