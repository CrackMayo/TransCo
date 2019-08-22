//SignUp
const signUpForm = document.querySelector("#signUpForm");
signUpForm.addEventListener('submit', (e) => {
    e.preventDefault();

    //Get user info
    const email = signUpForm['e-mail'].value;
    const nombreUsuario = signUpForm['nombreUsuario'].value;
    const cedulaUsuario = signUpForm['cedulaUsuario'].value;
    const numeroCelular = signUpForm['numeroDeCelular'].value;
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
            signUpForm.reset();
        })
            .catch(function (error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                alert(errorMessage);
                // ...
            });






    } else
        alert("Las contraseñas no coinciden");



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
