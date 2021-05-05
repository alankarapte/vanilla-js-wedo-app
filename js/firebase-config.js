// web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional



// NOTE: as this config is confidential I made it hide and just used placeholders ( <.> ) here! (mine is in my secret code-source repo)

var firebaseConfig = {
    apiKey: "<apikey>",
    authDomain: "<authDomain>",
    databaseURL: "<db url>",
    projectId: "<projectid>",
    storageBucket: "<storageBucket>",
    messagingSenderId: "<messagingSenderId>",
    appId: "<appId>",
    measurementId: "<measurementId>"
};

// Initialize Firebase
app = firebase.initializeApp(firebaseConfig);   //mi app assign karun ghetlay
mydb = firebase.firestore(app);
firebase.analytics();