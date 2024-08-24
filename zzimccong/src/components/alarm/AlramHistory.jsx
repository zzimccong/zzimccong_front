import React, { useEffect, useState } from 'react';
import axios from '../../utils/axiosConfig'; // axios 설정이 포함된 파일
import './AlramHistory.css'; // 스타일링 파일

const AlramHistory = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedItems, setSelectedItems] = useState({});
    const [sortOrder, setSortOrder] = useState('latest'); // 기본 정렬: 최신순
    const [dropdownOpen, setDropdownOpen] = useState(false);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const userString = localStorage.getItem('user');
                if (!userString) {
                    throw new Error('사용자 정보가 로컬 스토리지에 없습니다.');
                }

                const user = JSON.parse(userString);
                let response;

                if (user.corpId) {
                    response = await axios.get('/api/alarm/history/corp');
                } else if (user.loginId) {
                    response = await axios.get('/api/alarm/history/user');
                } else {
                    throw new Error('알 수 없는 사용자 유형입니다.');
                }

                const parsedHistory = response.data.map(item => {
                    const titleMatch = item.match(/^제목: (.+)$/m);
                    const messageMatch = item.match(/^내용: (.+)$/m);
                    const timeMatch = item.match(/^시간: (.+)$/m);
                    const isReadMatch = item.match(/^읽음: (.+)$/m);

                    const title = titleMatch ? titleMatch[1] : '제목 없음';
                    const message = messageMatch ? messageMatch[1] : '내용 없음';
                    const time = timeMatch ? new Date(timeMatch[1]) : new Date();
                    const isRead = isReadMatch ? isReadMatch[1] === 'true' : false;

                    return { title, message, time, isRead };
                });

                setHistory(parsedHistory);
                setLoading(false);
            } catch (error) {
                console.error("알림 기록을 불러오는 중 오류가 발생했습니다.", error);
                setError('알림 기록을 불러오는 중 오류가 발생했습니다.');
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    const handleSort = (order) => {
        setSortOrder(order);
        let sortedHistory;

        if (order === 'latest') {
            sortedHistory = [...history].sort((a, b) => b.time - a.time);
        } else if (order === 'unread') {
            sortedHistory = [...history].sort((a, b) => {
                if (a.isRead === b.isRead) {
                    return b.time - a.time;
                }
                return a.isRead ? 1 : -1;
            });
        } else if (order === 'top3') {
            sortedHistory = [...history].sort((a, b) => b.time - a.time).slice(0, 3);
        }

        setHistory(sortedHistory);
    };

    const handleSelect = (index) => {
        setSelectedItems((prevSelected) => ({
            ...prevSelected,
            [index]: !prevSelected[index],
        }));
    };

    const handleSelectAll = () => {
        const newSelectedItems = {};
        if (Object.keys(selectedItems).length !== history.length) {
            history.forEach((_, index) => {
                newSelectedItems[index] = true;
            });
        }
        setSelectedItems(newSelectedItems);
    };

    const handleMarkAsRead = () => {
        console.log('Mark as read for:', selectedItems);
        setSelectedItems({});
    };

    const handleDelete = (indexToDelete) => {
        const newHistory = history.filter((_, index) => index !== indexToDelete);
        setHistory(newHistory);
    };

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleSwipe = (index) => {
        const itemElement = document.getElementById(`notification-item-${index}`);
        itemElement.classList.toggle('show-actions');
    };

    if (loading) {
        return <div>로딩 중...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="notification-history">
            <h2>알림 기록</h2>
            <div className="notification-controls">
                <button onClick={handleSelectAll}>
                    {Object.keys(selectedItems).length === history.length ? '전체 선택 해제' : '전체 선택'}
                </button>
                <div className="dropdown">
                    <button onClick={toggleDropdown}>
                        정렬 옵션 {dropdownOpen ? '▲' : '▼'}
                    </button>
                    {dropdownOpen && (
                        <div className="dropdown-content">
                            <button onClick={() => handleSort('latest')}>최신순</button>
                            <button onClick={() => handleSort('unread')}>안읽은 순</button>
                            <button onClick={() => handleSort('top3')}>최신 알림 3개</button>
                        </div>
                    )}
                </div>
                <button onClick={handleMarkAsRead} disabled={Object.keys(selectedItems).length === 0}>
                    전체 읽음
                </button>
                <button onClick={() => handleDelete(selectedItems)} disabled={Object.keys(selectedItems).length === 0}>
                    전체 삭제
                </button>
            </div>
            <ul className="notification-list">
                {history.length > 0 ? (
                    history.map((item, index) => (
                        <li
                            key={index}
                            id={`notification-item-${index}`}
                            className={`notification-item ${item.isRead ? 'read' : 'unread'}`}
                            onTouchStart={() => handleSwipe(index)} // 모바일 터치 이벤트
                            onMouseDown={() => handleSwipe(index)}  // 마우스 클릭 이벤트
                        >
                            <input
                                type="checkbox"
                                checked={!!selectedItems[index]}
                                onChange={() => handleSelect(index)}
                            />
                            <div className="message-content">
                                <strong>{item.title}</strong><br />
                                {item.message}<br />
                                <small>{item.time.toLocaleString()}</small>
                            </div>
                            <div className="swipe-actions">
                                <button className="delete-button" onClick={() => handleDelete(index)}>삭제</button>
                            </div>
                        </li>
                    ))
                ) : (
                    <li className="notification-item empty">알림 기록이 없습니다.</li>
                )}
            </ul>
        </div>
    );
};

export default AlramHistory;
