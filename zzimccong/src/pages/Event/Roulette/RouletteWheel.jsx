import React, { useRef, useEffect, useState } from 'react';
import './RouletteWheel.css';
import { useEventParticipation } from './../EventParticipation/useEventParticipation';
import axios from '../../../utils/axiosConfig';

export default function RouletteWheel({ eventId }) {
    const wheelRef = useRef(null);
    const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#33FFF2', '#F2FF33', '#FFC300', '#DAF7A6', '#581845', '#C70039'];
    const [activeContent, setActiveContent] = useState(null); 
    const [showWinProbability, setShowWinProbability] = useState(false);
    const [winnerMessage, setWinnerMessage] = useState(null);  // 추가: 당첨자 메시지 상태

    const {
        participantNames,
        spinning,
        setSpinning,
        winner,
        setWinner,
        userIndex,
        handleShowMyPosition,
        winProbability,
        handleDrawLottery,
        handleCalculateWinProbability,
        showParticipants,
        setShowParticipants
    } = useEventParticipation(eventId);

    useEffect(() => {
        const canvas = wheelRef.current;
        if (canvas) {
            drawRoulette(canvas, participantNames, colors, winner?.index, userIndex);
        }
    }, [participantNames, winner?.index, userIndex]);

    const drawRoulette = (canvas, userNames, colors, highlightIndex, userIndex) => {
        const ctx = canvas.getContext('2d');
        const [cw, ch] = [canvas.width / 2, canvas.height / 2];
        const arc = Math.PI * 2 / userNames.length;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < userNames.length; i++) {
            ctx.beginPath();
            ctx.fillStyle = colors[i % colors.length];
            ctx.moveTo(cw, ch);
            ctx.arc(cw, ch, cw, arc * i, arc * (i + 1));
            ctx.lineTo(cw, ch);
            ctx.fill();
            ctx.closePath();
        }

        ctx.textAlign = "center";
        ctx.fillStyle = "#fff";

        for (let i = 0; i < userNames.length; i++) {
            const angle = (arc * i) + (arc / 2);
            const name = userNames[i];

            ctx.save();
            ctx.translate(
                cw + Math.cos(angle) * (cw - 40),
                ch + Math.sin(angle) * (ch - 40),
            );
            ctx.rotate(angle + Math.PI / 2);

            const sectionHeight = cw * arc;
            let fontSize = Math.min(16, sectionHeight / name.length);

            if (i === highlightIndex || i === userIndex) {
                ctx.fillStyle = "#000000";
                fontSize += 10;
            }

            ctx.font = `${fontSize}px Pretendard`;

            for (let j = 0; j < name.length; j++) {
                ctx.fillText(name[j], 0, j * fontSize - (name.length * fontSize / 2));
            }

            if (i === userIndex) {
                ctx.fillStyle = "#000000";
                ctx.beginPath();
                ctx.moveTo(0, -fontSize - 10);
                ctx.lineTo(-10, -fontSize - 20);
                ctx.lineTo(10, -fontSize - 20);
                ctx.closePath();
                ctx.fill();
            }

            ctx.restore();
        }
    };

    const rotateRoulette = async () => {
        setSpinning(true);

        try {
            const response = await axios.post(`/api/lottery-events/${eventId}/lottery/draw`);
            const { winnerName, winnerIndex } = response.data;

            const canvas = wheelRef.current;
            const arc = 360 / participantNames.length;
            const rotate = (winnerIndex * arc) + 3600 + (arc / 2);

            canvas.style.transition = 'transform 4s ease-out';
            canvas.style.transform = `rotate(-${rotate}deg)`;

            setTimeout(() => {
                setWinner({ name: winnerName, index: winnerIndex });
                setWinnerMessage(`축하합니다! ${winnerName} 님이 당첨되었습니다!`); // 당첨자 메시지 설정
                setSpinning(false);
            }, 4000);

        } catch (error) {
            console.error('추첨 실패:', error);
            setSpinning(false);
        }
    };

    const handleContentToggle = (contentType) => {
        setActiveContent((prevContent) => (prevContent === contentType ? null : contentType));
    };

    return (
        <div className="roulette-container">
            <canvas ref={wheelRef} width="250" height="250" className="roulette-wheel"/>
            <div className="roulette-pointer"></div>
            <div className="roulette-buttons">
                <button onClick={rotateRoulette} disabled={spinning || participantNames.length === 0}>
                    {spinning ? '추첨 중...' : '추첨 돌리기'}
                </button>
                <button className="orange-button" onClick={handleShowMyPosition}>
                    내 위치 보기
                </button>
                <button 
                    className="orange-button" 
                    onClick={() => setShowParticipants(!showParticipants)}
                >
                    {showParticipants ? `참여자 목록 접기 (${participantNames.length})` : `참여자 목록 보기 (${participantNames.length})`}
                </button>
                <button 
                    onClick={() => {
                        handleCalculateWinProbability();  // 당첨 확률만 계산하고 표시
                        setShowWinProbability(!showWinProbability);  // 확률 표시 토글
                    }}  
                    className="draw-button"
                    disabled={spinning}
                >
                    내 당첨확률
                </button>
                {showWinProbability && (
                    <div className="win-probability-section modal-content">
                        {winProbability !== null ? (
                            <>
                                <h3>내 당첨확률</h3>
                                <p>{winProbability}%</p>
                            </>
                        ) : (
                            <p>응모 후 확인하실 수 있습니다.</p>
                        )}
                    </div>
                )}
                {showParticipants && (
                    <div className="modal-content participants-list open">
                        <ul>
                            참여자 목록
                            {participantNames.map((name, index) => (
                                <li key={index}>{name}</li>
                            ))}
                        </ul>
                    </div>
                )}
                {winnerMessage && ( // 당첨자 메시지 표시
                    <div className="winner-announcement">
                        {winnerMessage}
                    </div>
                )}
            </div>
        </div>
    );
}
