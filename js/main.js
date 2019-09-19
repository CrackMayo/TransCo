function userDataLogin(userId) {
    let lista = document.getElementById("listaCamiones");
    lista.innerHTML = "";

    db.collection('accounts').doc(userId).get().then(snap => {
        var rol = snap.data().rol;

        if (rol === "Conductor") {
            var navElements = [document.getElementById("generalBalance2"), document.getElementById("generalBalance1"),
            document.getElementById("createTruck2"), document.getElementById("createTruck1")];

            for (let i = 0; i < navElements.length; i++) {
                navElements[i].classList.add("invisible","font-invisible");
            }

        } else {
            var navElements = [document.getElementById("generalBalance2"), document.getElementById("generalBalance1"),
            document.getElementById("createTruck2"), document.getElementById("createTruck1")];

            for (let i = 0; i < navElements.length; i++) {
                navElements[i].classList.remove("invisible","font-invisible");
            }
        }

    });

}

function openNav(section) {
    document.getElementById("mySidenav_" + section).style.width = "250px";
}

/* Set the width of the side navigation to 0 */
function closeNav(section) {
    document.getElementById("mySidenav_" + section).style.width = "0";
} 

/* Set the width of the side navigation to 250px and the left margin of the page content to 250px */
function openNav(section) {
    document.getElementById("mySidenav_" + section).style.width = "250px";
    // document.getElementById("main_" + section).style.marginLeft = "450px";
}

/* Set the width of the side navigation to 0 and the left margin of the page content to 0 */
function closeNav(section) {
    document.getElementById("mySidenav_" + section).style.width = "0";
    // document.getElementById("main_" + section).style.marginLeft = "0";
}

function changePage(idIn, idOut) {
    document.getElementById(idOut).classList.add("invisible");
    document.getElementById(idIn).classList.remove("invisible");
}

document.addEventListener('DOMContentLoaded', function () {
    var modals = document.querySelectorAll('.modal');
    M.Modal.init(modals);

    var items = document.querySelectorAll('.collapsible');
    M.Collapsible.init(items);
});

function dropdownRegister(text) {
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
    var emailConductor = document.getElementById("emailConductor").value.toLowerCase();
    var km = document.getElementById("input-create-truck-kilometraje").value;

    const usersRef = db.collection('accounts').doc(emailConductor);
    console.log(emailConductor);
    usersRef.get()
        .then((docSnapshot) => {
            if (docSnapshot.exists && docSnapshot.data().conVehiculo === false) {

                const truck = {
                    placaCabezote: placa,
                    marcaCabezote: marca,
                    numeroEjes: numEjes,
                    capacidadCarga: numMaxToneladas,
                    placaTrailer: matriculaTrailer,
                    conductorActual: emailConductor,
                    kilometraje: km,

                }

                //Create Truck Owner
                db.collection('accounts').doc(idUsuario).collection('camiones').doc(placa).set(truck).then(function () {

                    uploadImageTruck(imagen, placa);


                }).catch(function (error) {
                    console.error("Error: ", error);
                });

                //Update Trucks drivers

                dataDrivers = {
                    conVehiculo: true,
                    vehiculo: truck.placaCabezote,
                    jefe: idUsuario


                }

                console.log(dataDrivers);

                db.collection('accounts').doc(emailConductor).update(dataDrivers).then(function () {

                    uploadImageTruck(imagen, placa);


                }).catch(function (error) {
                    console.error("Error: ", error);
                });

            } else {
                console.log("Conductor no disponible");
            }
        })



}


function getDriverTruck() {
    let lista = document.getElementById("listaCamiones");
    lista.innerHTML = "";
    db.collection('accounts').doc(idUsuario).get().then(snap => {
        let boss = snap.data().jefe;
        let truck = snap.data().vehiculo;
        db.collection('accounts').doc(boss).collection('camiones').doc(truck).get().then(child => {

                lista.innerHTML = lista.innerHTML + "<li id='" + child.id + "'>" + "<div class='tab-content' id='myTabContent'>" +
                    "<div class='tab-pane fade show active' id='home' role='tabpanel' aria-labelledby='home-tab'>" +
                    "<div class='container-fluid'>" +
                    "<div class='card post mt-4'>" +
                    "<div class='card-footer'>" +
                    "<center>" + "<p id='placaCabezote' class='post-text'>" + "<span class='ht'>" + "Placa Cabezote: " + "</span>"
                    + "" + child.id + "" + "</p>" + "</center>"
                    + "</div>" +
                    "<img class='post-img card-img' src='" + child.data().imagenCamion + "'>" +
                    "<div class='card-body'>" +
                    "<div class='action-btns'>" +
                    "<center>" + "<span>" +
                    "<i onclick='loadTruck(" + '"' + child.id + '"' + ");' class='material-icons'>" + "share" + "</i>" + "<span class='val'>" + "View" + "</span>" +
                    "</span>" + "</center>" +
                    "</div>" +
                    "</div>" +
                    "<div class='card-footer'>" +
                    "<p id='capacidadCarga' class='post-text'>" + "<span class='ht'>" + "Capacidad de Carga: " + "</span>"
                    + "" + child.data().capacidadCarga + "" + "</p>" +
                    "<p id='km' class='post-text'>" + "<span class='ht'>" + "Kilometraje: " + "</span>" + "" + child.data().kilometraje + "" + "</p>"
                    + "<p id='marca' class='post-text'>" + "<span class='ht'>" + "Marca Cabezote: " + "</span>" + "" + child.data().marcaCabezote + "" + "</p>" +
                    "<p id='numEjes' class='post-text'>" + "<span class='ht'>" + "Numero de Ejes: " + "</span>" + "" + child.data().numeroEjes + "" + "</p>" +
                    "<p id='placaTrailer' class='post-text'>" + "<span class='ht'>" + "Placa Trailer: " + "</span>" + "" + child.data().placaTrailer + "" + "</p>" +
                    "</div>" +
                    "</div>" +
                    "</li>"

        })
    });

}

function obtenerCamion() {
    let lista = document.getElementById("listaCamiones");
    lista.innerHTML = "";

    db.collection('accounts').doc(idUsuario).collection('camiones').get().then(snapshot => {



        snapshot.forEach(function (child) {



            lista.innerHTML = lista.innerHTML + "<li id='" + child.id + "'>" + "<div class='tab-content' id='myTabContent'>" +
                "<div class='tab-pane fade show active' id='home' role='tabpanel' aria-labelledby='home-tab'>" +
                "<div class='container-fluid'>" +
                "<div class='card post mt-4'>" +
                "<div class='card-footer'>" +
                "<center>" + "<p id='placaCabezote' class='post-text'>" + "<span class='ht'>" + "Placa Cabezote: " + "</span>"
                + "" + child.id + "" + "</p>" + "</center>"
                + "</div>" +
                "<img class='post-img card-img' src='" + child.data().imagenCamion + "'>" +
                "<div class='card-body'>" +
                "<div class='action-btns'>" +
                "<center>" + "<span>" +
                "<i onclick='loadTruck(" + '"' + child.id + '"' + ");' class='material-icons'>" + "share" + "</i>" + "<span class='val'>" + "View" + "</span>" +
                "</span>" + "</center>" +
                "</div>" +
                "</div>" +
                "<div class='card-footer'>" +
                "<p id='capacidadCarga' class='post-text'>" + "<span class='ht'>" + "Capacidad de Carga: " + "</span>"
                + "" + child.data().capacidadCarga + "" + "</p>" +
                "<p id='km' class='post-text'>" + "<span class='ht'>" + "Kilometraje: " + "</span>" + "" + child.data().kilometraje + "" + "</p>"
                + "<p id='marca' class='post-text'>" + "<span class='ht'>" + "Marca Cabezote: " + "</span>" + "" + child.data().marcaCabezote + "" + "</p>" +
                "<p id='numEjes' class='post-text'>" + "<span class='ht'>" + "Numero de Ejes: " + "</span>" + "" + child.data().numeroEjes + "" + "</p>" +
                "<p id='placaTrailer' class='post-text'>" + "<span class='ht'>" + "Placa Trailer: " + "</span>" + "" + child.data().placaTrailer + "" + "</p>" +
                "</div>" +
                "</div>" +
                "</li>"

        });
    })
}

function uploadImageTruck(imagen, placa) {



    var url = 0;
    // Created a Storage Reference with root dir
    var storageRef = storage.ref();
    // Get the file from DOM
    var file = imagen;
    // console.log(file);

    //dynamically set reference to the file name
    var thisRef = storageRef.child('/' + idUsuario + '/camiones/' + placa + '/' + imagen.name);

    console.log(thisRef);

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
                    changePage('section-initial-page', 'create-truck');
                    obtenerCamion();

                }).catch(function (error) {

                    console.log(error);
                });



        });


    });

}

function loadTruck(placa) {

    console.log(placa);
    changePage('update-truck', 'section-initial-page');


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

    changePage('section-initial-page', 'update-truck');

    obtenerCamion();



}


