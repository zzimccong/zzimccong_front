import React, { useState, useEffect } from "react";
import { useFirebaseMessaging, unregisterServiceWorkers } from "../../firebase/Firebase";
import { clearFirebaseIndexedDB } from "../../utils/firebaseClear";
import axios from '../../utils/axiosConfig';
import "./ButtonClickFCM.css";

const ButtonClickFCM = () => {
    const [tokenSaved, setTokenSaved] = useState(false);
    const [tokenRemoved, setTokenRemoved] = useState(false);
    const [isToggled, setIsToggled] = useState(false);
    const { messaging, initializeFirebaseMessaging } = useFirebaseMessaging();

    useEffect(() => {
        const savedState = localStorage.getItem('fcmToggleState');
        if (savedState === 'true') {
            setIsToggled(true);
        }
    }, []);


    const handleToggleChange = async () => {
        const newState = !isToggled;
        setIsToggled(newState);
        localStorage.setItem('fcmToggleState', newState);

        if (newState) {
            console.log("FCM 메시징을 초기화하고 서비스 워커를 등록합니다...");

            try {
                await initializeFirebaseMessaging();
                setTokenSaved(true);
                setTokenRemoved(false);
                setTimeout(() => setTokenSaved(false), 2000);
            } catch (error) {
                console.error("서비스 워커 등록 및 FCM 초기화 중 오류가 발생했습니다.", error);
            }
        } else {
            clearFirebaseIndexedDB();
            setTokenSaved(false);
            setTokenRemoved(true);

            try {
                await unregisterServiceWorkers();  // 기존 서비스 워커를 제거
                console.log("모든 서비스 워커가 성공적으로 해제되었습니다.");
            } catch (error) {
                console.error("서비스 워커 해제 중 오류가 발생했습니다.", error);
            }

            setTimeout(() => setTokenRemoved(false), 2000);
        }
    };

    const deleteFcmToken = async () => {
        try {
            const currentToken = await messaging.getToken();
            if (currentToken) {
                const response = await axios.post('/api/alarm/delete-token', { token: currentToken });
                console.log('FCM 토큰 삭제 완료:', response.data);
            }
        } catch (error) {
            console.error('FCM 토큰 삭제 실패:', error);
        }
    };

    return (
        <div>
            <h1>푸시 알림 설정</h1>
            <div className="fcm-container">
                <label className="switch">
                    <input type="checkbox" checked={isToggled} onChange={handleToggleChange} />
                    <span className="ButtonClickFCM-slider round"></span>
                </label>
                {tokenSaved && <p className="token-status">허용됨</p>}
                {tokenRemoved && <p className="token-status">허용안함</p>}
            </div>
        </div>
    );
};

export default ButtonClickFCM;
