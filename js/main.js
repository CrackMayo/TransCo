var name;
var email;
var phone;
var nip;
var typeAccount;
var city;
var departament;

function userDataLogin(userId) {
    let lista = document.getElementById("listaCamiones");
    lista.innerHTML = "";



    db.collection('accounts').doc(userId).get().then(snap => {
        name = snap.data().nombre;
        email = snap.id;
        phone = snap.data().celular;
        nip = snap.data().cedula;
        typeAccount = snap.data().rol;
        city = snap.data().municipio;
        departament = snap.data().departamento;

        console.log("name: " + name + " email: " + email + " phone: " + phone + " nip: " + nip + " typeAccount: " + typeAccount +
            " city: " + city + " departament: " + departament);

        let conVehiculo = snap.data().conVehiculo;
        let navElements = [document.getElementById("generalBalance2"), document.getElementById("generalBalance1"),
        document.getElementById("createTruck2"), document.getElementById("createTruck1"),
        document.getElementById("createTravel1"), document.getElementById("createTravel2")];

        if (typeAccount === "Conductor") {


            for (let i = 0; i < navElements.length - 1; i++) {
                navElements[i].classList.add("invisible", "font-invisible");
            }

            if (!conVehiculo) {
                navElements[4].classList.add("invisible", "font-invisible");
                navElements[5].classList.add("invisible", "font-invisible");
            }

        } else {

            for (let i = 0; i < navElements.length - 1; i++) {
                navElements[i].classList.remove("invisible", "font-invisible");
            }

            navElements[4].classList.add("invisible", "font-invisible");
            navElements[5].classList.add("invisible", "font-invisible");
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
    let modals = document.querySelectorAll('.modal');
    M.Modal.init(modals);

    let items = document.querySelectorAll('.collapsible');
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

function editAccount(ok) {
    if (ok) {
        document.getElementById("edit_account").classList.remove("invisible");
    } else {
        document.getElementById("edit_account").className += " invisible";
    }
}


function crearCamion() {

    let imagen = document.getElementById("files").files[0];
    let placa = document.getElementById("input-create-truck-placa").value.toUpperCase();
    let marca = document.getElementById("input-create-truck-marca").value;
    let numEjes = document.getElementById("input-create-ejes").value;
    let numMaxToneladas = document.getElementById("input-create-truck-capacidad-carga").value;
    let matriculaTrailer = document.getElementById("input-create-truck-matricula-trailer").value.toUpperCase();
    let emailConductor = document.getElementById("emailConductor").value.toLowerCase();
    let km = document.getElementById("input-create-truck-kilometraje").value;


    if (!isPlate(placa)) {
        alert("La placa del cabezote no cumple con su respectivo formato");
    } else if (!isPlate(matriculaTrailer)) {
        alert("La placa del trailer no cumple con su respectivo formato");
    } else {
        if (isFileImage(imagen)) {
            const usersRef = db.collection('accounts').doc(emailConductor);
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
                        const ownerRef = db.collection('accounts').doc(idUsuario).collection('camiones').doc(placa);
                        ownerRef.get()
                            .then((docSnapshot) => {
                                if (docSnapshot.exists) {
                                    alert("Ya existe un vehículo con la placa cabezote ingresada")
                                    return;
                                } else {
                                    ownerRef.set(truck).then(function () {

                                        if (imagen != null) {
                                            uploadImageTruck(imagen, placa);
                                        } else {
                                            setDefaultImagen(placa);
                                        }


                                    }).catch(function (error) {
                                        console.error("Error: ", error);
                                    });

                                    //Update Trucks drivers

                                    dataDrivers = {
                                        conVehiculo: true,
                                        vehiculo: truck.placaCabezote,
                                        jefe: idUsuario


                                    }

                                    db.collection('accounts').doc(emailConductor).update(dataDrivers).then(function () {


                                    }).catch(function (error) {
                                        console.error("Error: ", error);
                                    });
                                }
                            })



                    } else {
                        console.log("Conductor no disponible");
                    }
                })
        } else {
            alert("Se debe seleccionar un archivo tipo imagen.");
        }

    }




    return false;
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



    let url = 0;
    // Created a Storage Reference with root dir
    let storageRef = storage.ref();
    // Get the file from DOM
    let file = imagen;
    // console.log(file);

    //dynamically set reference to the file name
    let thisRef = storageRef.child('/' + idUsuario + '/camiones/' + placa + '/' + imagen.name);

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


    let updateElements = [document.getElementById("input-update-truck-placa"), document.getElementById("input-update-truck-marca"),
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
    let updateElements = [document.getElementById("input-update-truck-placa"), document.getElementById("input-update-truck-marca"),
    document.getElementById("input-update-ejes"), document.getElementById("input-update-truck-capacidad-carga")
        , document.getElementById("input-update-truck-matricula-trailer"), document.getElementById("input-update-truck-kilometraje")];


    if (!isPlate(updateElements[4].value)) {
        alert("La placa del trailer no cumple con su respectivo formato");
    } else {
        const truck = {
            marcaCabezote: updateElements[1].value,
            numeroEjes: updateElements[2].value,
            capacidadCarga: updateElements[3].value,
            placaTrailer: updateElements[4].value,
            kilometraje: updateElements[5].value,

        }



        db.collection('accounts').doc(idUsuario).collection('camiones').doc(updateElements[0].value)
            .update(truck).then(function () {
                console.log("Actualizado");
                changePage('section-initial-page', 'update-truck');
            }).catch(function (error) {
                console.error("Error: ", error);
            });

        alert("Datos Actualizado");

        changePage('section-initial-page', 'update-truck');

        obtenerCamion();


    }

    return false;

}


function setDefaultImagen(placa) {

    let url = "https://firebasestorage.googleapis.com/v0/b/transco-app.appspot.com/o/defaultImages%2FdefaultTruck.jpg?alt=media&token=693a652c-bfce-422d-a942-0daec69aab26";

    db.collection('accounts').doc(idUsuario).collection('camiones').doc(placa).update({ "imagenCamion": url })
        .then(function () {
            console.log("Document successfully updated!");
            changePage('section-initial-page', 'create-truck');
            obtenerCamion();

        }).catch(function (error) {

            console.log(error);
        });




}


function isFileImage(file) {

    if (!file) {
        return true;
    } else if (file['type'].split('/')[0] === 'image') {
        return true;
    } else {
        return false;
    }

}

function isPlate(placa) {
    let placaLetras = placa.substring(0, 3);
    let placaNumeros = placa.substring(3, 6);
    let letras = false;
    let numerosP = false;

    let letras_mayusculas = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ";
    let numeros = "0123456789";

    for (i = 0; i < placaLetras.length; i++) {
        if (letras_mayusculas.indexOf(placaLetras.charAt(i), 0) != -1) {
            letras = true;
        } else {
            letras = false;
            break;
        }
    }
    for (i = 0; i < placaNumeros.length; i++) {
        if (numeros.indexOf(placaNumeros.charAt(i), 0) != -1) {
            numerosP = true;
        } else {
            numerosP = false;
            break;
        }
    }

    if (!numerosP || !letras) {
        return false;
    } else {
        return true;
    }
}



function createSettlement() {

    let departOriginL = document.getElementById("input-create-travel-departmento").value;
    let cityOriginL = document.getElementById("input-create-travel-cityo").value;
    let departDestinL = document.getElementById("input-create-travel-departmentd").value;
    let cityDestinL = document.getElementById("input-create-travel-cityd").value;
    let dateTravelL = document.getElementById("input-create-travel-dateout").value;
    let companyL = document.getElementById("input-create-travel-description").value;
    let freightL = document.getElementById("input-create-travel-amoung").value;
    let advanceL = document.getElementById("input-create-travel-output").value;
    let nTonsL = document.getElementById("input-create-travel-weight").value;

    changePage('create-balance', 'create-travel');

    let city1Elem = document.getElementById("city1");
    let city2Elem = document.getElementById("city2");
    let date1Elem = document.getElementById("date1");
    let companyElem = document.getElementById("company");
    let advanceElem = document.getElementById("advance");
    let weigthElem = document.getElementById("weigth");

    city1Elem.innerHTML = city1Elem.innerHTML + cityOriginL;
    city2Elem.innerHTML = city2Elem.innerHTML + cityDestinL;
    date1Elem.innerHTML = date1Elem.innerHTML + dateTravelL;
    companyElem.innerHTML = companyElem.innerHTML + companyL;
    advanceElem.innerHTML = advanceElem.innerHTML + advanceL;
    weigthElem.innerHTML = weigthElem.innerHTML + nTonsL;



    return false;
}


function accountInfo() {

    let nameInfo = document.getElementById("nameInfo");
    let emailInfo = document.getElementById("emailInfo");
    let phoneInfo = document.getElementById("phoneInfo");
    let nipInfo = document.getElementById("nipInfo");
    let typeAccInfo = document.getElementById("typeAccInfo");
    let cityInfo = document.getElementById("cityInfo");
    let departamentInfo = document.getElementById("departamentInfo");
    let phoneUpdate = document.getElementById("input-account-phone");

    nameInfo.innerHTML = "Nombre: " + name;
    emailInfo.innerHTML = "Correo: " + email;
    phoneInfo.innerHTML = "Telefono: " + phone;
    nipInfo.innerHTML = "NIP: " + nip;
    typeAccInfo.innerHTML = "Tipo de cuenta: " + typeAccount;
    cityInfo.innerHTML = "Ciudad: " + city;
    departamentInfo.innerHTML = "Departamento: " + departament;

    phoneUpdate.value = phone;
}

function getAccountUpdateInfo(fase) {
    let selectDepartament = document.getElementById("select-account-departaments");
    let selectCitys = document.getElementById("select-account-municipality");
    if (fase === 1) {
        for (let i = 0; i < selectDepartament.length; i++) {
            if (departament === selectDepartament[i].value) {
                selectDepartament.selectedIndex = i;
                cargarMunicipios(selectDepartament, 'select-account-municipality');
            }
        }
    } else {
        for (let i = 0; i < selectCitys.length; i++) {
            if (city === selectCitys[i].value) {
                selectCitys.selectedIndex = i;
            }
        }
    }

}

function updateAccountInfo() {
    let phoneUpdate = document.getElementById("input-account-phone").value;
    let selectDepartamentUpdate = document.getElementById("select-account-departaments").value;
    let selectCitysUpdate = document.getElementById("select-account-municipality").value;

    console.log(" " + phoneUpdate + " " + selectDepartamentUpdate + " " + selectCitysUpdate);


    let user = {
        celular: phoneUpdate,
        departamento: selectDepartamentUpdate,
        municipio: selectCitysUpdate

    }



    db.collection('accounts').doc(idUsuario).update(user).then(function () {
        console.log("Datos de usuario actualizados");
        phone = phoneUpdate;
        departament = selectDepartamentUpdate;
        city = selectCitysUpdate;

        
        // userDataLogin(idUsuario);
        accountInfo();
        changePage('account', 'edit_account');
    }).catch(function (error) {
        console.error("Error: ", error);
    });






    

    return false;
}