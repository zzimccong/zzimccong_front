import React, { useState, useEffect } from "react";
import { useFirebaseMessaging } from "../../firebase/Firebase";
import { clearFirebaseIndexedDB } from "../../utils/firebaseClear"; // Firebase 관련 IndexedDB 삭제 함수 import
import axios from '../../utils/axiosConfig'; 
import "./ButtonClickFCM.css"; // 슬라이드 버튼 스타일을 정의하는 CSS 파일

const ButtonClickFCM = () => {
    const [tokenSaved, setTokenSaved] = useState(false);
    const [tokenRemoved, setTokenRemoved] = useState(false); // "허용안함" 메시지를 위한 상태
    const [isToggled, setIsToggled] = useState(false); // 슬라이드 버튼 상태
    const { messaging, initializeFirebaseMessaging } = useFirebaseMessaging();

    // 컴포넌트가 마운트될 때 슬라이드 버튼 상태를 로컬 스토리지에서 가져옴
    useEffect(() => {
        const savedState = localStorage.getItem('fcmToggleState');
        if (savedState === 'true') {
            setIsToggled(true);
        }
    }, []);

    const handleToggleChange = async () => {
        const newState = !isToggled;
        setIsToggled(newState);
        localStorage.setItem('fcmToggleState', newState); // 토글 상태를 로컬 스토리지에 저장

        if (newState) { // 토글이 켜졌을 때
            if (messaging) {
                console.log("이미 FCM 메시징이 활성화되었습니다.");
            } else {
                console.log("FCM 메시징을 초기화합니다...");
                
                await initializeFirebaseMessaging(); // FCM 메시징 초기화 및 토큰 발급
                
            }
            setTokenSaved(true);
            setTokenRemoved(false); // 허용안함 메시지를 숨김
            setTimeout(() => setTokenSaved(false), 2000); // 메시지를 2초 동안만 표시
        } else { // 토글이 꺼졌을 때
            clearFirebaseIndexedDB(); // Firebase 관련 IndexedDB 삭제
            setTokenSaved(false); // 허용됨 메시지를 숨김
            setTokenRemoved(true);

            // FCM 토큰 삭제 API 호출
            await deleteFcmToken();
            
            setTimeout(() => setTokenRemoved(false), 2000); // 메시지를 2초 동안만 표시
        }
    };

    const deleteFcmToken = async () => {
        try {
            const response = await axios.post('/api/alarm/delete-token', { token: messaging.getToken() });
            console.log('FCM 토큰 삭제 완료:', response.data);
        } catch (error) {
            console.error('FCM 토큰 삭제 실패:', error);
        }
    };

    return (
        <div>
    
            <div className="fcm-container">
                <label className="switch">
                    <input type="checkbox" checked={isToggled} onChange={handleToggleChange} />
                    <span className="slider round"></span>
                </label>
                {tokenSaved && <p className="token-status">허용됨</p>}
                {tokenRemoved && <p className="token-status">허용안함</p>}
            </div>
        </div>
    );
};

export default ButtonClickFCM;
