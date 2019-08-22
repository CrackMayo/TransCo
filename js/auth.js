//SignUp
const signUpForm = document.querySelector("#signUpForm");
signUpForm.addEventListener('submit', (e) => {
    e.preventDefault();

    //Get user info
    const email = signUpForm['e-mail'].value;
    const password = signUpForm['contrasena'].value;

    //Sing up the user
    auth.createUserWithEmailAndPassword(email, password).then(cred => {


        alert("Usuario Creado!");
        signUpForm.reset();



    });





});

//LogOut
// const logOut = document.querySelector("#id");
// logOut.addEventListener('click', (e) => {
//     e.preventDefault();
//     auth.signOut().then(() => {
//         alert("Sesion Cerrada!");


//     });


// });


//SignIn

const logInForm = document.querySelector("#signInForm");
logInForm.addEventListener('submit', (e) => {
    e.preventDefault();

    //Get user info
    const email = signInForm['email'].value;
    const password = signInForm['password'].value;

    //Sing up the user
    auth.signInWithEmailAndPassword(email, password).then(cred => {


        alert("Sesion Iniciada");
        signUpForm.reset();



    });





});
