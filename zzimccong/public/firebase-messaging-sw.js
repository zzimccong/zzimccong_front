// firebase-messaging-sw.js

importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

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

self.addEventListener('install', (event) => {
    console.log('fcm sw install..');
    self.skipWaiting(); // 서비스 워커가 설치된 후 즉시 활성화
});

self.addEventListener('activate', (event) => {
    console.log('fcm sw activate..');
    self.clients.claim(); // 서비스 워커가 활성화된 후 바로 제어하도록 함
});

self.addEventListener('push', (event) => {
    if (!event.data) return;

    const payload = event.data.json();
    console.log('Received push payload:', payload);

    const notificationTitle = payload.notification.title || 'Default Title';
    const notificationOptions = {
        body: payload.notification.body || 'Default Body',
        icon: payload.notification.icon || './icons/logo.png',
        data: {
            click_action: payload.notification.click_action || '/',
        },
    };

    event.waitUntil(self.registration.showNotification(notificationTitle, notificationOptions));
});

self.addEventListener('notificationclick', (event) => {
    console.log('notification click');
    const url = event.notification.data.click_action || '/';
    event.notification.close();
    event.waitUntil(clients.openWindow(url));
});
