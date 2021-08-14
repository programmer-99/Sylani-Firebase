const myModel = document.querySelectorAll(".modal");
const userDetails = document.querySelector(".userDetails");
const editProfile= document.querySelector("#editProfile")

//creation of user collection in firestore
function createUserCollection(user) {
  firebase.firestore().collection("users").doc(user.uid).set({
    uid: user.uid,
    name: user.displayName,
    email: user.email,
    phone: "",
    specialty: "",
    portfolioUrl: "",
    experience: "",
  });
}

async function getuserInfo(userID) {
  if (userID) {
    const userInfoSnapShot = await firebase
      .firestore()
      .collection("users")
      .doc(userID)
      .get();

    const userInfo = userInfoSnapShot.data();
    if (userInfo) {
      userDetails.innerHTML = `
    <h3>${userInfo.name}</h3>
    <h3>${userInfo.email}</h3>
    <h3>${userInfo.phone}</h3>
    `;
    }
  } else {
    userDetails.innerHTML = `<h3> please login </h3>`;
  }
}

async function getuserInfoRealTime(userID) {
  if (userID) {
    const userdocRefrence = await firebase
      .firestore()
      .collection("users")
      .doc(userID)
      userdocRefrence.onSnapshot((doc) => {
        if (doc.exists) {
          const userInfo = doc.data();
          if (userInfo) {
            userDetails.innerHTML = `
                <h3>${userInfo.name}</h3>
                <h3>${userInfo.email}</h3>
                <h3>${userInfo.phone}</h3>
                <h3>${userInfo.specialty}</h3>
                <h3>${userInfo.portfolioUrl}</h3>
                <h3>${userInfo. experience}</h3>

              
                <button class="btn waves-effect #0d47a1 blue darken-4 modal-trigger" href="#modal3" type="submit">Edit</button>`;

                editProfile["name"].value=userInfo.name
                editProfile["profileEmail"].value=userInfo.email
                editProfile["phone#"].value=userInfo.phone
                editProfile["specialty"].value=userInfo.specialty
                editProfile["portfolioUrl"].value=userInfo.portfolioUrl
                editProfile["experience"].value=userInfo.experience
                
          }
        }
      });
  }
   else {
    userDetails.innerHTML = 
    `<h3> please login </h3>`;
  }
}





function updateUserProfile(e){
  e.preventDefault();
  const userDocRef= firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid)


  userDocRef.update({
    name:editProfile["name"].value,
    email:editProfile["profileEmail"].value,
    phone:editProfile["phone#"].value,
    specialty:editProfile["specialty"].value,
    portfolioUrl:editProfile["portfolioUrl"].value,
    experience:editProfile["experience"].value

})
M.Modal.getInstance(myModel[2]).close();

}

//new user sign up in == data store in firebase Authentication

async function signup(e) {
  e.preventDefault();
  const email = document.querySelector("#signUpEmail");
  const password = document.querySelector("#signUpPassword");
  //console.log(email.value,password.value)
  try {
    const result = await firebase
      .auth()
      .createUserWithEmailAndPassword(email.value, password.value);
    await result.user.updateProfile({
      displayName: "User",
    });
    createUserCollection(result.user);

    //await result.user.sendEmailVerification();
    M.toast({ html: `welcome ${result.user.email}`, classes: "green" });

    console.log(result);
  } catch (error) {
    console.log(error);
    M.toast({ html: error.message, classes: "red" });
  }
  email.value = "";
  password.value = "";
  M.Modal.getInstance(myModel[0]).close();
}

async function login(e) {
  e.preventDefault();
  const email = document.querySelector("#loginEmail");
  const password = document.querySelector("#loginPassword");
  // console.log(email.value,password.value)
  try {
    const result = await firebase
      .auth()
      .signInWithEmailAndPassword(email.value, password.value);
    M.toast({ html: `welcome ${result.user.email}`, classes: "green" });
    console.log(result);
  } catch (error) {
    console.log(error);
    M.toast({ html: error.message, classes: "red" });
  }

  email.value = "";
  password.value = "";
  M.Modal.getInstance(myModel[1]).close();
}

function logout() {
  firebase.auth().signOut();
}
const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    console.log(user);
   // getuserInfo(user.uid);
   getuserInfoRealTime(user.uid)
  } else {
    //getuserInfo(null);
    getuserInfoRealTime(null)
    console.log("SignOut Successfully!!");
    M.toast({ html: "SignOut Successfully!!", classes: "blue" });
  }
});
