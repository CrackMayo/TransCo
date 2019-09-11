//getUserData
function userDataLogin(userId) {

    db.collection('accounts').doc(userId).get().then(snap => {
        var nombre = snap.data().nombre;
        var cedula = snap.data().cedula;
        var celular = snap.data().celular;
        var rol = snap.data().rol;

        if (rol === "Conductor") {
            var navElements = [document.getElementById("generalBalance2"), document.getElementById("generalBalance1"),
            document.getElementById("createTruck2"), document.getElementById("createTruck1")];

            for (let i = 0; i < navElements.length; i++) {
                navElements[i].classList.add("invisible");
            }
        }

    });

}

function change_page(idIn, idOut) {
    document.getElementById(idOut).classList.add("invisible");
    document.getElementById(idIn).classList.remove("invisible");
}

document.addEventListener('DOMContentLoaded', function () {
    var modals = document.querySelectorAll('.modal');
    M.Modal.init(modals);

    var items = document.querySelectorAll('.collapsible');
    M.Collapsible.init(items);
});

function dropdown_register(text) {
    document.getElementById("dropdown-register-text").innerHTML = text;
}

function btnLook(id, span) {
    if (document.getElementById(id).type == "password") {
        document.getElementById(id).type = "text";
        document.getElementById(span).classList.add("fa-eye-slash");
        document.getElementById(span).classList.remove("fa-eye");
    } else {
        document.getElementById(id).type = "password";
        document.getElementById(span).classList.remove("fa-eye-slash");
        document.getElementById(span).classList.add("fa-eye");
    }
}


function crearCamion() {

    var imagen = document.getElementById("files").files[0];
    var placa = document.getElementById("input-create-truck-placa").value;
    var marca = document.getElementById("input-create-truck-marca").value;
    var numEjes = document.getElementById("input-create-ejes").value;
    var numMaxToneladas = document.getElementById("input-create-truck-capacidad-carga").value;
    var matriculaTrailer = document.getElementById("input-create-truck-matricula-trailer").value;
    var km = document.getElementById("input-create-truck-kilometraje").value;

    const truck = {
        placaCabezote: placa,
        marcaCabezote: marca,
        numeroEjes: numEjes,
        capacidadCarga: numMaxToneladas,
        placaTrailer: matriculaTrailer,
        kilometraje: km,

    }


    db.collection('accounts').doc(idUsuario).collection('camiones').doc(placa).set(truck).then(function () {

         uploadImageTruck(imagen, placa);
        
    }).catch(function (error) {
        console.error("Error: ", error);
    });
}



function obtenerCamion() {

    var label1 = document.getElementById("truck1");

    var label2 = document.getElementById("truck2");

    var label3 = document.getElementById("truck3");


    db.collection('accounts').doc(idUsuario).collection('camiones').get().then(snapshot => {

        snapshot.forEach(function (child) {
            label1.innerHTML = "Placa: " + child.id + "<input type='button' value='modificar' onclick='loadTruck(" + '"TRF551"' + ")'></input>";
            label2.innerHTML = "Marca: " + child.data().marcaCabezote;
            label3.innerHTML = "Capacidad Max: " + child.data().capacidadCarga;


        });
    })
}

function uploadImageTruck(imagen, placa) {

    var url = 5;
    // Created a Storage Reference with root dir
    var storageRef = storage.ref();
    // Get the file from DOM
    var file = imagen;
    // console.log(file);

    //dynamically set reference to the file name
    var thisRef = storageRef.child('/' + idUsuario + '/camiones/' + placa + '/' + imagen.name);

    //put request upload file to firebase storage
    thisRef.put(file).then(function (snapshot) {
        alert("File Uploaded");
        console.log('Uploaded a blob or file!');

        snapshot.ref.getDownloadURL().then(function (DownloadURL) {
            url = DownloadURL;

            db.collection('accounts').doc(idUsuario).collection('camiones').doc(placa).update({ "imagenCamion": url })
                .then(function () {
                    console.log("Document successfully updated!");
                    console.log(url);

                }).catch(function (error) {

                    console.log(error);
                });



        });

    
    });

}

function loadTruck(placa) {
    change_page('update-truck', 'section-initial-page');


    var updateElements = [document.getElementById("input-update-truck-placa"), document.getElementById("input-update-truck-marca"),
    document.getElementById("input-update-ejes"), document.getElementById("input-update-truck-capacidad-carga")
        , document.getElementById("input-update-truck-matricula-trailer"), document.getElementById("input-update-truck-kilometraje")];

    updateElements[0].disabled = true;

    db.collection('accounts').doc(idUsuario).collection('camiones').doc(placa).get().then(snapshot => {


        updateElements[0].value = snapshot.id;
        updateElements[1].value = snapshot.data().marcaCabezote;
        updateElements[2].value = snapshot.data().numeroEjes;
        updateElements[3].value = snapshot.data().capacidadCarga;
        updateElements[4].value = snapshot.data().placaTrailer;
        updateElements[5].value = snapshot.data().kilometraje;



    })

}


function updateTruck() {
    var updateElements = [document.getElementById("input-update-truck-placa"), document.getElementById("input-update-truck-marca"),
    document.getElementById("input-update-ejes"), document.getElementById("input-update-truck-capacidad-carga")
        , document.getElementById("input-update-truck-matricula-trailer"), document.getElementById("input-update-truck-kilometraje")];




    const truck = {
        marcaCabezote: updateElements[1].value,
        numeroEjes: updateElements[2].value,
        capacidadCarga: updateElements[3].value,
        placaTrailer: updateElements[4].value,
        kilometraje: updateElements[5].value,

    }



    db.collection('accounts').doc(idUsuario).collection('camiones').doc(updateElements[0].value).update(truck).then(function () {
        console.log("Actualizado");
    }).catch(function (error) {
        console.error("Error: ", error);
    });

    alert("Datos Actualizado");

    obtenerCamion();



}