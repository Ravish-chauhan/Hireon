/* eslint-disable no-undef */

// ✅ Use compat version for React/Firebase v9+
importScripts("https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js");

// ✅ Initialize Firebase inside SW
firebase.initializeApp({
  apiKey: "AIzaSyDZmjiNNuivrwJgX1c_gqcWerSGExvlof8",
  authDomain: "myeduniaa.firebaseapp.com",
  projectId: "myeduniaa",
  storageBucket: "myeduniaa.appspot.com",
  messagingSenderId: "687017403569",
  appId: "1:687017403569:web:948c4a4f998ad6a43f2e90",
  measurementId: "G-596HWQ2RBH",
});

// ✅ Retrieve messaging instance
const messaging = firebase.messaging();

// ✅ Handle background messages (when tab closed)
messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] 📩 Received background message:", payload);

  const notification = payload.notification || {};
  const title = notification.title || "New Notification";
  const body = notification.body || "You have a new message.";
  const icon = notification.icon || "/logo192.png";

  const notificationOptions = {
    body,
    icon,
    badge: "/logo192.png",
    vibrate: [100, 50, 100],
    data: { url: "/" }, // open site on click
  };

  // ✅ Show the notification explicitly
  self.registration.showNotification(title, notificationOptions);
});

// ✅ Handle notification click to open tab
self.addEventListener("notificationclick", (event) => {
  console.log("🖱️ Notification click received:", event);
  event.notification.close();

  // Open EduNiaa tab or focus existing one
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes("localhost:3000") && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow("/");
      }
    })
  );
});
