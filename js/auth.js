
var idUsuario;

function cargarDepartamentos() {

    var departamentos = document.getElementById("departamentos");


    db.collection('departments').get().then(snapshot => {

        snapshot.forEach(function (child) {
            var departamento = child.id;
            departamentos.options[departamentos.options.length] = new Option(departamento, departamento);

        });
    })



}

function cities(departamento) {


    var ciudades = document.getElementById("ciudades");
    ciudades.options.length = 0;
    db.collection('departments').doc(departamento.value).get().then(snap => {

        var ciudad = snap.data();
        for (let i in ciudad) {
            ciudades.options[ciudades.options.length] = new Option(ciudad[i], ciudad[i]);

        }

    });

}

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
    const email = document.getElementById("input-register-email").value;
    const nombreUsuario = document.getElementById("input-register-name").value;
    const cedulaUsuario = document.getElementById("input-register-nip").value;
    const numeroCelular = document.getElementById("input-register-phone").value;
    const tipoUsuario = document.getElementById("dropdown-register-text").innerHTML;
    const password1 = document.getElementById("input-register-password1").value;
    const password2 = document.getElementById("input-register-password2").value;
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



            db.collection('accounts').doc(userUid).set(account).then(function () {
                console.log("Creado");
            }).catch(function (error) {
                console.error("Error: ", error);
            });

            alert("Usuario Creado!");
            data.user.sendEmailVerification();
            change_page('section-initial-page', 'register');
            userDataLogin(userUid);

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
    change_page('sign-in','section-initial-page');
}

//Password Recovery
function passwordRecovery() {
    change_page('sign-in', 'account-recovery');
    const email = document.getElementById("input-account-recovery-username").value;
    console.log(firebase.auth().sendPasswordResetEmail(email));
}



//SignIn

function singIn() {


    //Get user info
    const email = document.getElementById("input-sign-in-username").value;
    const password = document.getElementById("input-sign-in-password").value;


    //Sing up the user

    auth.signInWithEmailAndPassword(email, password).then(function (data) {

        const userUid = data.user.uid;
        idUsuario = userUid;
        if (data.user.emailVerified) {

            userDataLogin(userUid);
            change_page('section-initial-page', 'sign-in');
           
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

async function writeDocument(obj) {
    var writeOperation = await db.collection("cities").doc("LA").set(obj);
    //now this code is reached after that async write
}