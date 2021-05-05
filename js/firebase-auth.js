let contentContainer = document.querySelector(".my-content-container");
let signInButtonDiv = document.querySelector("#signinbuttonDiv");
let signOutButton = document.querySelector("#signoutbutton");
let userName = document.querySelector("#userName");
let welcomeMessegeDiv = document.querySelector("#welcomeMessege");
let myFooter = document.querySelector(".my-footer");
let toggleButton = document.querySelector("#myToggleButton");

let user = {};

signOutButton.style.display = "none";
signInButtonDiv.style.display = "none";
// contentContainer.style.display = "none";
toggleButton.style.visibility = "hidden";

//TODO    userName.style.display = "none";

let provider = new firebase.auth.GoogleAuthProvider();
console.log(provider);

loading = document.querySelector("#loadingSpinners");
mainContainer = document.querySelector(".main-container");

// mainContainer.style.display = "none";
// myNavigationBar

setTimeout(() => {
    var currentUser = firebase.auth().currentUser;
    console.log("this is", firebase.auth().currentUser);

    if (currentUser) {

        user = currentUser;
        signInButtonDiv.style.display = "none";
        contentContainer.style.display = "block";
        toggleButton.style.visibility = "visible"

        console.log("displayed cotent");
        userName.innerText = user.displayName;
        myFooter.classList.remove("fixed-bottom");
        //TODO    userName.style.display = "inline-block";    
        signOutButton.style.display = "inline-block";
        document.getElementById("task-title").focus();
        readTask();

        loading.style.display = "none";
        welcomeMessegeDiv.style.display = "none";
    } else {
        signInButtonDiv.style.display = "inline-block";
        loading.style.display = "none";
        welcomeMessegeDiv.style.display = "block";

    }

}, 3000);

function googleSignIn() {

    firebase.auth().signInWithPopup(provider)
        .then(function (result) {
            // This gives you a Google Access Token. You can use it to access the Google API.
            var token = result.credential.accessToken;
            // The signed-in user info.
            user = result.user;
            // ...

            myFooter.classList.remove("fixed-bottom");
            signInButtonDiv.style.display = "none";
            toggleButton.style.visibility = "visible"
            contentContainer.style.display = "block";
            welcomeMessegeDiv.style.display = "none";

            userName.style.display = "inline-block";
            signOutButton.style.display = "inline-block";
            userName.innerText = user.displayName;
            document.getElementById("task-title").focus();
            readTask();

            console.log("token", token);
            console.log("user", user);
        }).catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
            console.log("error code", errorCode);
            console.log("error messege", errorMessage);
        });
}

function googleSignOut() {
    firebase.auth().signOut()
        .then(() => {
            // Sign-out successful.

            signInButtonDiv.style.display = "inline-block";
            contentContainer.style.display = "none";
            userName.style.display = "none";
            signOutButton.style.display = "none";
            welcomeMessegeDiv.style.display = "block";
            myFooter.classList.add("fixed-bottom");
            toggleButton.style.visibility = "hidden"

            console.log("Successful signout");
        }).catch((error) => {
            // An error happened.
            console.log("Fail to signout");
        });
}