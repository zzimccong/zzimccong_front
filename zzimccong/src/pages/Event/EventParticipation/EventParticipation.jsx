import React, { useEffect } from 'react';
import { useEventParticipation } from './useEventParticipation';
import UserInfo from './UserInfo';
import { useParams } from 'react-router-dom';
import RouletteSection from './../Roulette/RouletteSection';
import ActionButtons from './ActionButtons';

function EventParticipation() {
    const { eventId } = useParams();

    useEffect(() => {
        console.log("eventId from useParams:", eventId);
    }, [eventId]);

    const {
        user,
        userCoupons,
        userCouponsUsedInEvent,
        userCouponsUsedInAllEvents,
        participantNames,
        totalCouponsUsed,
        spinning,
        winner,
        showParticipants,
        handleShowMyPosition,
        handleGenerateParticipants,
        handleParticipate,
        handleDrawLottery,
        userIndex,
        setShowParticipants,
        setCouponCount,
        couponCount,
        loading,
        winProbability,
        setSpinning,  // setSpinning 추가
        setWinner  // setWinner 추가
    } = useEventParticipation();

    return (
        <div>
            <div className="header-wrapper flex px-[20px]">
                <div className="header-left flex items-center">
                <h1 className="text-xl h-[47px] leading-[47px] font-bold" style={{ color: '#f55a5a' }}>
    추첨 이벤트
</h1>
                </div>
                <div className="header-right flex items-center ml-auto">
                    <button type="button" className="btn-icon alarm"></button>
                </div>
            </div>
            
            <div className="event-participation-container">
                <UserInfo
                    eventId={eventId} 
                    user={user} 
                    userCoupons={userCoupons} 
                    userCouponsUsedInEvent={userCouponsUsedInEvent} 
                    userCouponsUsedInAllEvents={userCouponsUsedInAllEvents}
                />

                <RouletteSection
                    participantNames={participantNames}
                    totalCouponsUsed={totalCouponsUsed}
                    spinning={spinning}
                    winner={winner}
                    userIndex={userIndex}
                    eventId={eventId}  
                    setSpinning={setSpinning}  // setSpinning 전달
                    setWinner={setWinner}  // setWinner 전달
                />

                <ActionButtons
                    participantNames={participantNames}
                    totalCouponsUsed={totalCouponsUsed}
                    spinning={spinning}
                    winner={winner}
                    showParticipants={showParticipants}
                    handleShowMyPosition={handleShowMyPosition}
                    handleGenerateParticipants={handleGenerateParticipants}
                    handleParticipate={handleParticipate}
                    handleDrawLottery={handleDrawLottery}
                    setShowParticipants={setShowParticipants}
                    setCouponCount={setCouponCount}
                    couponCount={couponCount}
                    loading={loading}
                    winProbability={winProbability}
                    
                />
            </div>
        </div>
    );
}

export default EventParticipation;
