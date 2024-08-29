import React from 'react';
import RouletteWheel from './RouletteWheel';
import './RouletteSection.css'; // 스타일 파일 추가

function RouletteSection({ participantNames, totalCouponsUsed, spinning, winner, userIndex, eventId, setSpinning, setWinner }) {
    return (
        <div className="roulette-section">
            <div className="roulette-wrapper">
                <h3 className='event-h3'>현재 응모티켓 {totalCouponsUsed}장</h3>
                <RouletteWheel 
                    userNames={participantNames}
                    spinning={spinning}
                    winner={winner}
                    userIndex={userIndex}
                    eventId={eventId}
                    setSpinning={setSpinning}
                    setWinner={setWinner}
                />
                <div className="roulette-buttons-container">
                    
                </div>
            </div>
        </div>
    );
}

export default RouletteSection;
