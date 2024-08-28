import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../../../utils/axiosConfig';
import './GenerateParticipants.css';

function GenerateParticipants() {
    const { eventId } = useParams(); // URL에서 eventId를 가져옴
    const [message, setMessage] = useState(null); // 결과 메시지 상태
    const [loading, setLoading] = useState(false); // 로딩 상태

    const handleGenerateParticipants = () => {
        setLoading(true);
        axios.post(`/api/lottery-events/${eventId}/generate-random-participants`)
            .then(response => {
                setMessage(response.data); // 성공 메시지 설정
            })
            .catch(error => {
                setMessage(error.response?.data || '임의의 참여자 생성 중 오류가 발생했습니다.'); // 오류 메시지 설정
            })
            .finally(() => {
                setLoading(false); // 로딩 상태 해제
            });
    };

    return (
        <div className="generate-participants-container">
            <h2>임의의 참여자 생성</h2>
            <button 
                onClick={handleGenerateParticipants} 
                disabled={loading} 
                className="generate-button"
            >
                {loading ? '생성 중...' : '100명의 임의의 참여자 생성'}
            </button>
            {message && <p className="message">{message}</p>}
        </div>
    );
}

export default GenerateParticipants;
