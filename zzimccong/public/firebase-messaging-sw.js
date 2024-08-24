// 서비스 워커 코드 (변경 없음)
importScripts(
    "https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js"
);
importScripts(
    "https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js"
);

const firebaseConfig = {
  apiKey: "AIzaSyCETpP2ps_sw_HrbHQH0-Mxes0ZGHDcg44",
  authDomain: "zzimccong-e7723.firebaseapp.com",
  projectId: "zzimccong-e7723",
  storageBucket: "zzimccong-e7723.appspot.com",
  messagingSenderId: "590190684282",
  appId: "1:590190684282:web:d934884847b112a7c033c3",
  measurementId: "G-82L7D1MQYH"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

self.addEventListener("install", function (e) {
  console.log("fcm sw install..");
  self.skipWaiting();
});

self.addEventListener("activate", function (e) {
  console.log("fcm sw activate..");
});

self.addEventListener("push", function (e) {
  if (!e.data) return;

  const payload = e.data.json();
  console.log("Received push payload:", payload);

  const resultData = payload.notification || {};
  console.log("Parsed notification data:", resultData);

  const notificationTitle = resultData.title || "Default Title";
  const notificationOptions = {
    body: resultData.body || "Default Body",
    icon: resultData.image || "./icons/logo.png",
    tag: resultData.tag || "",
    data: {
      click_action: resultData.click_action || "/",
      ...resultData,
    },
  };

  e.waitUntil(self.registration.showNotification(notificationTitle, notificationOptions));
});

self.addEventListener("notificationclick", function (event) {
  console.log("notification click");
  const url = event.notification.data.click_action || "/";
  event.notification.close();
  event.waitUntil(clients.openWindow(url));
});
