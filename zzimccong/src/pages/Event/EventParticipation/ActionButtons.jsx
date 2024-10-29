import React from 'react';
import './css/ActionButtons.css';

function ActionButtons({
    spinning,
    handleParticipate,
    handleGenerateParticipants,
    couponCount,
    setCouponCount,
    loading
}) {
    const handleParticipateClick = () => {
        console.log("참여 버튼 클릭됨");
        handleParticipate(); // 기존 응모 로직 실행
        window.location.reload(); // 페이지 새로고침
    };

    const handleGenerateClick = () => {
        console.log("임의의 참여자 생성 버튼 클릭됨");
        handleGenerateParticipants();
    };

    return (
        <div className="action-buttons-container">
            <div className="participation-section">
                <label>사용할 추첨권 수: 
                <select 
                    value={couponCount} 
                    onChange={(e) => setCouponCount(parseInt(e.target.value))} 
                    className="coupon-select"
                    disabled={spinning}
                >
                    {[...Array(5)].map((_, index) => (
                        <option key={index + 1} value={index + 1}>
                            {index + 1}장
                        </option>
                    ))}
                </select>
                <button 
                    onClick={handleParticipateClick} 
                    className="participate-button"
                    disabled={spinning}
                > 
                     응모하기
                </button>
                </label>
            </div>

            <div className="generate-participants-section">
                <button 
                    onClick={handleGenerateClick} 
                    className="generate-button" 
                    disabled={loading || spinning}
                >
                    {loading ? '생성 중...' : '임의의 참여자 생성'}
                </button>
            </div>
        </div>
    );
}

export default ActionButtons;
