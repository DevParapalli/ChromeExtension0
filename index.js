// Import the functions you need from the SDKs you need
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

async function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}

const tem = document.querySelector('#ol-item');
const content = document.querySelector('#prev-links');

async function getPreviousLinks(collection_id) {
    const querySnapshot = await getDocs(collection(firestore, collection_id));
    if (querySnapshot.empty) {
        content.innerHTML = 'No previous links found';
        return;
    }
    querySnapshot.forEach((docRef) => {
        // console.log(`${doc.id} => ${doc.data().url}`);

        const clone = tem.content.cloneNode(true);
        clone.querySelector('button').setAttribute('data-id', docRef.id);
        clone.querySelector('button').addEventListener('click', async (e) => {
            console.log(e.target.getAttribute('data-id'))
            await deleteDoc(doc(firestore, collection_id, e.target.getAttribute('data-id')))
            //a e.target.parentElement.remove(); // we don't do this to ensure that the UI is in complete sync with dB
            window.location.reload();
        })
        clone.querySelector('a').href = docRef.data().url;
        clone.querySelector('a').innerText = docRef.data().url;
        content.appendChild(clone);
    });
}


let collection_id = 'links'; // Backup incase something goes wrong

chrome.storage.sync.get('collection_id', function (data) {
    collection_id = data.collection_id;
    getPreviousLinks(collection_id)
    document.querySelector('#save-link').addEventListener('click',
        async () => {
            let tab;
            try {
                tab = await getCurrentTab();
            } catch (error) {
                // Error when the extension is not installed, and during testing
                tab = { url: window.location.href }
            }
            const url = tab.url;
            // console.log(url);
            await addDoc(collection(firestore, collection_id), {
                url: url,
            });
            window.location.reload();
        }
    )
    console.log(collection_id);
});




// document.querySelector('#content').innerHTML = (await getCurrentTab()).url 
