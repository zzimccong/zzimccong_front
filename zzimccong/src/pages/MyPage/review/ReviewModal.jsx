import React, { useState } from 'react';
import './ReviewModal.css';

export default function ReviewModal({ onClose, onSubmit }) {
    const [taste, setTaste] = useState(0);
    const [mood, setMood] = useState(0);
    const [convenient, setConvenient] = useState(0);
    const [content, setContent] = useState('');

    const handleStarClick = (setter, value) => {
        setter(value);
    };

    const calculateRate = () => {
        return ((taste + mood + convenient) / 3).toFixed(1);
    };

    const handleSubmit = () => {
        const rate = calculateRate();
        onSubmit({ taste, mood, convenient, rate, content });
    };

    return (
        <div className="modal">
            <div className="modal-content">

                <div className="rating-section">
                    <div className="rating-item">
                        <p>맛</p>
                        {[1, 2, 3, 4, 5].map((num) => (
                            <span
                                key={num}
                                className={`star ${taste >= num ? 'selected' : ''}`}
                                onClick={() => handleStarClick(setTaste, num)}
                            >
                                ★
                            </span>
                        ))}
                    </div>
                    <div className="rating-item">
                        <p>분위기</p>
                        {[1, 2, 3, 4, 5].map((num) => (
                            <span
                                key={num}
                                className={`star ${mood >= num ? 'selected' : ''}`}
                                onClick={() => handleStarClick(setMood, num)}
                            >
                                ★
                            </span>
                        ))}
                    </div>
                    <div className="rating-item">
                        <p>편의시설</p>
                        {[1, 2, 3, 4, 5].map((num) => (
                            <span
                                key={num}
                                className={`star ${convenient >= num ? 'selected' : ''}`}
                                onClick={() => handleStarClick(setConvenient, num)}
                            >
                                ★
                            </span>
                        ))}
                    </div>
                </div>

                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="음식과 가게에 대한 솔직한 리뷰를 남겨주세요."
                />

                

                <button className="submit-button" onClick={handleSubmit}>
                    리뷰 등록
                </button>
                <button className="cancel-button" onClick={onClose}>
                    취소
                </button>
            </div>
        </div>
    );
}
