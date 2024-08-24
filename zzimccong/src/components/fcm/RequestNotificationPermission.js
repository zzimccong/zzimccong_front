import { useEffect } from "react";
import { useFirebaseMessaging } from "../../firebase/Firebase";
import { onMessage } from "firebase/messaging";

const RequestNotificationPermission = ({ accessToken, refreshToken }) => {
  const { messaging } = useFirebaseMessaging({ accessToken, refreshToken });

  useEffect(() => {
    if (!messaging) {
      console.warn("Messaging is not initialized, possibly due to unsupported browser.");
      return;
    }

    // 포그라운드 메시지 처리 코드 (클라이언트에서 푸시 알림을 받는 경우에만 필요)
    onMessage(messaging, (payload) => {
      console.log("Message received in foreground:", payload);

      const notification = payload.notification || {};
      const notificationTitle = notification.title || "Default Title";
      const notificationOptions = {
        body: notification.body || "Default Body",
        icon: notification.icon || "/default-icon.png",
      };

      new Notification(notificationTitle, notificationOptions);
    });
  }, [messaging]);

  return null;
};

export default RequestNotificationPermission;
