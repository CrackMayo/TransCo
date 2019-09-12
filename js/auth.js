function cargarDepartamentos() {

    var departamentos = document.getElementById("departamentos");


    db.collection('departments').get().then(snapshot => {

        snapshot.forEach(function(child) {
            var departamento = child.id;
            departamentos.options[departamentos.options.length] = new Option(departamento, departamento);
        });
    })
}

function cargarMunicipios(departamento) {

    var municipios = document.getElementById("ciudades");
    municipios.options.length = 0;
    db.collection('departments').doc(departamento.value).get().then(snap => {

        var municipio = snap.data();
        for (let i in municipio) {
            municipios.options[municipios.options.length] = new Option(municipio[i], municipio[i]);
        }
    });
}

//listen for status changes user login
auth.onAuthStateChanged(user => {
    if (user) {
        console.log("Sesion Activa: " + user.email);
    } else {
        console.log("Sesion Finalizada");
    }
})

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
        auth.createUserWithEmailAndPassword(email, password1).then(function(data) {

                const userUid = data.user.uid;

                // set account  doc  
                const account = {
                    userId: userUid,
                    nombre: nombreUsuario,
                    cedula: cedulaUsuario,
                    celular: numeroCelular,
                    rol: tipoUsuario

                }

                db.collection('accounts').doc(userUid).set(account).then(function() {
                    console.log("Creado");
                }).catch(function(error) {
                    console.error("Error: ", error);
                });

                alert("Usuario Creado!");
                data.user.sendEmailVerification();
                changePage('section-initial-page', 'register');
                userDataLogin(userUid);

            })
            .catch(function(error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                if (errorMessage === "The email address is already in use by another account.") {
                    alert("Ya existe una cuenta de usuario asociada a ese correo electrónico");
                }
            });
    } else{
        alert("Las contraseñas no coinciden");
    }
       
}

function logOut() {
    auth.signOut();
    changePage('sign-in', 'section-initial-page');
}

function passwordRecovery() {
    changePage('sign-in', 'account-recovery');
    const email = document.getElementById("input-account-recovery-username").value;
    console.log(firebase.auth().sendPasswordResetEmail(email));
}

function singIn() {

    //Get user info
    const email = document.getElementById("input-sign-in-username").value;
    const password = document.getElementById("input-sign-in-password").value;


    //Sing up the user

    auth.signInWithEmailAndPassword(email, password).then(function(data) {

        const userUid = data.user.uid;

        if (data.user.emailVerified) {

            userDataLogin(userUid);
            changePage('section-initial-page', 'sign-in');

        } else{
            alert("Verifica tu correo");
        } 
    }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorMessage);
        if (errorCode === "auth/user-not-found") {
            alert("El usuario o contraseña no es correcto");
        } else{
            alert("El usuario o contraseña no es correcto");
        }
            
    });
}