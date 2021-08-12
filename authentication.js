const myModel= document.querySelectorAll(".modal");

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
        displayName: "User"
      })
      await result.user.sendEmailVerification()
      M.toast({html: `welcome ${result.user.email}`, classes:"green"})
    
      console.log(result);
    
  } catch (error) {
      console.log(error)
      M.toast({html: error.message, classes:"red" })
  }
  email.value="";
  email.password="";
  M.Modal.getInstance(myModel[0]).close();
}
 

async function login(e) {
    e.preventDefault();
    const email = document.querySelector("#loginEmail");
    const password = document.querySelector("#loginPassword");
   // console.log(email.value,password.value)
    try {
      const result = await firebase.auth().signInWithEmailAndPassword(email.value, password.value)
        M.toast({html: `welcome ${result.user.email}`, classes:"green" })
      console.log(result);
      
    } catch (error) {
        console.log(error)
        M.toast({html: error.message, classes:"red" })
    }

    email.value="";
  email.password="";
  M.Modal.getInstance(myModel[1]).close();
  } 
  
  function logout() {
      firebase.auth().signOut();
  }
  const unsubscribe= firebase.auth().onAuthStateChanged((user)=>{
    if (user) {
    console.log(user)
    }
    else{
        console.log("SignOut Successfully!!");
        M.toast({html: "SignOut Successfully!!", classes:"blue" })
    }
  });