import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../../../utils/axiosConfig';

export function useEventParticipation() {
    const { eventId } = useParams();
    const [couponCount, setCouponCount] = useState(1);
    const [participantNames, setParticipantNames] = useState([]);
    const [totalCouponsUsed, setTotalCouponsUsed] = useState(0);
    const [loading, setLoading] = useState(true);
    const [userCoupons, setUserCoupons] = useState(0);
    const [winner, setWinner] = useState(null);
    const [spinning, setSpinning] = useState(false);
    const [userCouponsUsedInEvent, setUserCouponsUsedInEvent] = useState(0);
    const [userCouponsUsedInAllEvents, setUserCouponsUsedInAllEvents] = useState(0);
    const [winProbability, setWinProbability] = useState(null);
    const [userIndex, setUserIndex] = useState(null);
    const [showParticipants, setShowParticipants] = useState(false);

    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?.id;

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                if (!userId || !eventId) {
                    setLoading(false);
                    return;
                }

                const [
                    participantsResponse,
                    totalCouponsUsedResponse,
                    userCouponsResponse,
                    userCouponsUsedInEventResponse,
                    userCouponsUsedInAllEventsResponse
                ] = await Promise.all([
                    axios.get(`/api/lottery-events/${eventId}/participants/names`),
                    axios.get(`/api/lottery-events/${eventId}/coupons/count`),
                    axios.get(`/api/coupons/${userId}/lottery/cnt`),
                    axios.get(`/api/lottery-events/${eventId}/users/${userId}/coupons/total-used`),
                    axios.get(`/api/lottery-events/users/${userId}/coupons/total-used`)
                ]);

                setParticipantNames(participantsResponse.data || []);
                setTotalCouponsUsed(totalCouponsUsedResponse.data || 0);
                setUserCoupons(userCouponsResponse.data || 0);
                setUserCouponsUsedInEvent(userCouponsUsedInEventResponse.data || 0);
                setUserCouponsUsedInAllEvents(userCouponsUsedInAllEventsResponse.data || 0);

            } catch (error) {
                console.error('데이터를 가져오는 중 오류가 발생했습니다:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [eventId, userId]);

    const handleParticipate = async () => {
        if (couponCount < 1 || couponCount > userCoupons) {
            return;
        }

        setLoading(true);
        const token = localStorage.getItem('token');
        const numericEventId = parseInt(eventId, 10);
        try {
            console.log('Sending participation request:', { couponCount, userId, numericEventId });

            await axios.post(`/api/lottery-events/${numericEventId}/participate`, {
                userId: userId,
                couponCount: couponCount
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const [
                participantsResponse,
                totalCouponsUsedResponse,
                userCouponsUsedInEventResponse,
                userCouponsUsedInAllEventsResponse,
                userCouponsResponse
            ] = await Promise.all([
                axios.get(`/api/lottery-events/${eventId}/participants/names`),
                axios.get(`/api/lottery-events/${eventId}/coupons/count`),
                axios.get(`/api/lottery-events/${eventId}/users/${userId}/coupons/total-used`),
                axios.get(`/api/lottery-events/users/${userId}/coupons/total-used`),
                axios.get(`/api/coupons/${userId}/lottery/cnt`)
            ]);

            setParticipantNames(participantsResponse.data || []);
            setTotalCouponsUsed(totalCouponsUsedResponse.data || 0);
            setUserCouponsUsedInEvent(userCouponsUsedInEventResponse.data || 0);
            setUserCouponsUsedInAllEvents(userCouponsUsedInAllEventsResponse.data || 0);
            setUserCoupons(userCouponsResponse.data || 0);

        } catch (error) {
            console.error('참여 중 오류가 발생했습니다:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDrawLottery = () => {
        if (totalCouponsUsed > 0) {
            const probability = (userCouponsUsedInEvent / totalCouponsUsed) * 100;
            setWinProbability(probability.toFixed(2));
        } else {
            setWinProbability(0);
        }
        setSpinning(true);
    };

    const handleCalculateWinProbability = () => {
        if (totalCouponsUsed > 0) {
            const probability = (userCouponsUsedInEvent / totalCouponsUsed) * 100;
            setWinProbability(probability.toFixed(2));
        } else {
            setWinProbability(0);
        }
    };

    const handleShowMyPosition = () => {
        const userName = user?.name;
        if (!userName) {
            alert("로그인한 사용자의 이름을 찾을 수 없습니다.");
            return;
        }

        const index = participantNames.findIndex(name => name === userName);
        if (index !== -1) {
            setUserIndex(index);
        } else {
            alert("현재 사용자 이름이 추첨 목록에 없습니다.");
        }
    };

    const handleGenerateParticipants = async () => {
        setLoading(true);
        try {
            const response = await axios.post(`/api/lottery-events/${eventId}/generate-random-participants`);
            console.log("임의의 참여자 생성 응답:", response.data);

            const participantsResponse = await axios.get(`/api/lottery-events/${eventId}/participants/names`);
            setParticipantNames(participantsResponse.data || []);

        } catch (error) {
            console.error('임의의 참여자 생성 중 오류가 발생했습니다:', error);
        } finally {
            setLoading(false);
        }
    };

    return {
        user,
        userCoupons,
        userCouponsUsedInEvent,
        userCouponsUsedInAllEvents,
        participantNames,
        totalCouponsUsed,
        spinning,
        winner,
        handleShowMyPosition,
        handleParticipate,
        handleDrawLottery,
        handleCalculateWinProbability,
        handleGenerateParticipants,
        userIndex,
        setCouponCount,
        couponCount,
        loading,
        winProbability,
        setSpinning,
        setWinner,
        showParticipants,
        setShowParticipants
    };
}
