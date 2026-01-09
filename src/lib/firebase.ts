// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC2jBLeTgNI7wIwtWzHbnRv15GewwHyj98",
    authDomain: "nandha-blogger.firebaseapp.com",
    projectId: "nandha-blogger",
    storageBucket: "nandha-blogger.firebasestorage.app",
    messagingSenderId: "437307073846",
    appId: "1:437307073846:web:1361cc55202720e6f43f97",
    measurementId: "G-EB4HVQFLQS"
};

// Initialize Firebase
// Use getApps() to prevent re-initialization errors during hot-reload in Next.js
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

let analytics;

// Initialize Analytics only on the client side
if (typeof window !== "undefined") {
    isSupported().then((supported) => {
        if (supported) {
            analytics = getAnalytics(app);
        }
    });
}

export { app, analytics };
