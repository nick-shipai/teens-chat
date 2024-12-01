import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-database.js";

// Your Firebase project configuration
const firebaseConfig = {
    apiKey: "AIzaSyBqgNC5BXxtHMnc-oMhQ0QhLYg18oAG3QA",
    authDomain: "teens-f3fc7.firebaseapp.com",
    projectId: "teens-f3fc7",
    storageBucket: "teens-f3fc7.appspot.com",
    messagingSenderId: "828565874604",
    appId: "1:828565874604:web:83ce3266202b4cd4b1fc09"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// Check user authentication status
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is logged in, perform actions
        console.log("User logged in:", user.uid);
        // Example: Get user data from Firebase Realtime Database
        const userRef = ref(db, 'users/' + user.uid);
        get(userRef).then((snapshot) => {
            if (snapshot.exists()) {
                console.log("User data:", snapshot.val());
                // You can now use the user's data (e.g., display in the chat)
            } else {
                console.log("No data available for user");
            }
        }).catch((error) => {
            console.error("Error getting user data:", error);
        });
    } else {
        // User is not logged in, handle appropriately
        console.log("No user logged in");
    }
});