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
    return (
        <div className="action-buttons-container">
            <div className="participation-section">
                <h3>응모하기</h3>
                <label>사용할 추첨권 수: </label>
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
                    onClick={handleParticipate} 
                    className="participate-button"
                    disabled={spinning}
                >
                    응모하기
                </button>
            </div>

            <div className="generate-participants-section">
                <button 
                    onClick={handleGenerateParticipants} 
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
