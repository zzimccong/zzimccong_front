import { useState } from "react";
import { initializeApp } from "firebase/app";
import { getMessaging, getToken as getFCMToken } from "firebase/messaging";
import axios from "../utils/axiosConfig";

// Firebase 설정
const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);

const useFirebaseMessaging = () => {
    const [messaging, setMessaging] = useState(null);

    const initializeFirebaseMessaging = async () => {
        console.log("FCM 초기화 중...");

        const isSupportedBrowser = "serviceWorker" in navigator && "PushManager" in window;
        console.log("브라우저 지원 여부:", isSupportedBrowser);

        if (isSupportedBrowser) {
            try {
                const registration = await navigator.serviceWorker
                    .register("/firebase-messaging-sw.js?timestamp=" + new Date().getTime());
                console.log("서비스 워커가 등록되었습니다. 스코프:", registration.scope);

                const messagingInstance = getMessaging(app);
                setMessaging(messagingInstance);

                console.log("토큰을 가져오는 중...");

                const currentToken = await getFCMToken(messagingInstance, {
                    vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY,
                    serviceWorkerRegistration: registration,
                });

                if (currentToken) {
                    console.log("FCM 토큰:", currentToken);  // FCM 토큰 로그 출력
                    saveFcmToken(currentToken);  // FCM 토큰을 서버로 저장
                } else {
                    console.warn("등록된 토큰이 없습니다.");
                }
            } catch (error) {
                console.error("FCM 초기화 중 오류 발생:", error);
            }
        } else {
            console.warn("이 브라우저는 FCM을 지원하지 않습니다.");
        }
    };

    // 서버에 FCM 토큰을 저장하는 함수
    const saveFcmToken = async (token) => {
        try {
            const response = await axios.post("/api/alarm/save-token", { token });
            console.log("FCM 토큰이 서버에 저장되었습니다:", response.data);
        } catch (error) {
            console.error("FCM 토큰을 서버에 저장하는 중 오류 발생:", error);
        }
    };

    return { messaging, initializeFirebaseMessaging };
};

export { useFirebaseMessaging, app };
