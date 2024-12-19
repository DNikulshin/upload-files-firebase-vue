import { initializeApp } from 'firebase/app'
import { getStorage } from 'firebase/storage'

// https://firebase.google.com/docs/web/setup#available-libraries

const app = initializeApp({
    apiKey: "",
    authDomain: "upload-files-app.firebaseapp.com",
    projectId: "upload-files-app",
    storageBucket: "upload-files-app.appspot.com",
    messagingSenderId: "",
    appId: ""
})

export const storage = getStorage(app)
