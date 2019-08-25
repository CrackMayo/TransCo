//

//listen for status changes
auth.onAuthStateChanged(user => {
    if (user) {
        console.log("Sesion Activa: " + user.email);
    } else {
        console.log("Sesion Finalizada");
    }

})



//SignUp
function signUp() {
    //Get user info Form
    const email = signUpForm['e-mail'].value;
    const nombreUsuario = signUpForm['nombreUsuario'].value;
    const cedulaUsuario = signUpForm['cedulaUsuario'].value;
    const numeroCelular = signUpForm['numeroCelular'].value;
    const tipoUsuario = signUpForm['rolUsuario'].value;
    const password1 = signUpForm['contrasena1'].value;
    const password2 = signUpForm['contrasena2'].value;

    if (password1 === password2) {
        //Sing up the user
        auth.createUserWithEmailAndPassword(email, password1).then(function (data) {

            const userUid = data.user.uid;

            // set account  doc  
            const account = {
                userId: userUid,
                nombre: nombreUsuario,
                cedula: cedulaUsuario,
                celular: numeroCelular,
                rol: tipoUsuario

            }

            db.collection('accounts').doc(userUid).set(account);
            alert("Usuario Creado!");
            data.user.sendEmailVerification();
            logOut();
            signUpForm.reset();
        })
            .catch(function (error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                if (errorMessage === "The email address is already in use by another account.") {
                    alert("Ya existe una cuenta de usuario asociada a ese correo electrónico");
                }
            });






    } else
        alert("Las contraseñas no coinciden");



}

//LogOut
function logOut() {
    auth.signOut();
}

//Password Recovery
function passwordRecovery() {
    passwordRecovery = document.getElementById("passwordRecoveryForm");
    const email = passwordRecovery['emailRecovery'].value;
    console.log(email);
    firebase.auth().sendPasswordResetEmail(email);
}



//SignIn

function singIn() {
    

    //Get user info
    const email = signInForm['email'].value;
    const password = signInForm['password'].value;


    //Sing up the user

    auth.signInWithEmailAndPassword(email, password).then(function (data) {

        const userUid = data.user.uid;

        if (data.user.emailVerified) { 


            userDataLogin(userUid);


            signUpForm.reset();
        } else
            alert("Verifica tu correo");






    }).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorMessage);
        if (errorCode === "auth/user-not-found") {
            alert("El usuario o contraseña no es correcto");
        } else
            alert("El usuario o contraseña no es correcto");

        
    });




}
