import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, deleteDoc, addDoc, doc } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB-H9RJc7VqC9q15DjIiSMZEZc3LJ_gQ_Y",
    authDomain: "chromeextension0.firebaseapp.com",
    projectId: "chromeextension0",
    storageBucket: "chromeextension0.appspot.com",
    messagingSenderId: "768872001179",
    appId: "1:768872001179:web:36cc4fa37569f84b7de03e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app)



chrome.runtime.onInstalled.addListener(
    async ({ reason }) => {
        if (reason == "install") {
            await chrome.identity.clearAllCachedAuthTokens();
            await chrome.identity.getAuthToken({interactive: true});
            chrome.identity.getProfileUserInfo(async function (userInfo) {
                console.log(userInfo);
                await chrome.storage.sync.set({ collection_id: userInfo.id });
                // addDoc(doc(firestore, userInfo.id, { url: 'https://www.google.com' }))
                const docRef = await addDoc(collection(firestore, userInfo.id), {
                    url: 'https://www.google.com'
                });
                console.log("Document written with ID: ", docRef.id);
            });
        }
    }
);