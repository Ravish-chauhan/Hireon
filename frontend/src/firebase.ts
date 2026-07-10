import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getMessaging } from "firebase/messaging";


const firebaseConfig = {
  apiKey: "AIzaSyDZmjiNNuivrwJgX1c_gqcWerSGExvlof8",
  authDomain: "myeduniaa.firebaseapp.com",
  projectId: "myeduniaa",
  storageBucket: "myeduniaa.appspot.com",
  messagingSenderId: "687017403569",
  appId: "1:687017403569:web:948c4a4f998ad6a43f2e90",
  measurementId: "G-596HWQ2RBH"
};


export const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const messaging = getMessaging(app);