var spendings = [];
var currentPlate;
var currentBoss;
var plateView;
var name;
var email;
var phone;
var nip;
var typeAccount;
var city;
var departament;
var imagenProfile;


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
        imagenProfile = snap.data().imagenPerfil;




        let conVehiculo = snap.data().conVehiculo;
        var navElements = [document.getElementById("generalBalance2"), document.getElementById("generalBalance1"),
        document.getElementById("createTruck2"), document.getElementById("createTruck1"),
        document.getElementById("createTravel1"), document.getElementById("createTravel2")];

        if (typeAccount === "Conductor") {

            currentBoss = snap.data().jefe;
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
        chargePage(false);
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
    var placa = document.getElementById("input-create-truck-placa").value.toUpperCase();
    var marca = document.getElementById("input-create-truck-marca").value;
    var numEjes = document.getElementById("input-create-ejes").value;
    var numMaxToneladas = document.getElementById("input-create-truck-capacidad-carga").value;
    var matriculaTrailer = document.getElementById("input-create-truck-matricula-trailer").value.toUpperCase();
    var emailConductor = document.getElementById("emailConductor").value.toLowerCase();
    var km = document.getElementById("input-create-truck-kilometraje").value;


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
                        alert("Conductor no disponible");
                    }
                })
        } else {
            alert("Se debe seleccionar un archivo tipo imagen.");
        }

    }




    return false;
}
function legalizationTolls() {
    var removeSVG = '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 22 22" style="enable-background:new 0 0 22 22;" xml:space="preserve"><rect class="noFill" width="22" height="22"/><g><g><path class="fill" d="M16.1,3.6h-1.9V3.3c0-1.3-1-2.3-2.3-2.3h-1.7C8.9,1,7.8,2,7.8,3.3v0.2H5.9c-1.3,0-2.3,1-2.3,2.3v1.3c0,0.5,0.4,0.9,0.9,1v10.5c0,1.3,1,2.3,2.3,2.3h8.5c1.3,0,2.3-1,2.3-2.3V8.2c0.5-0.1,0.9-0.5,0.9-1V5.9C18.4,4.6,17.4,3.6,16.1,3.6z M9.1,3.3c0-0.6,0.5-1.1,1.1-1.1h1.7c0.6,0,1.1,0.5,1.1,1.1v0.2H9.1V3.3z M16.3,18.7c0,0.6-0.5,1.1-1.1,1.1H6.7c-0.6,0-1.1-0.5-1.1-1.1V8.2h10.6L16.3,18.7L16.3,18.7z M17.2,7H4.8V5.9c0-0.6,0.5-1.1,1.1-1.1h10.2c0.6,0,1.1,0.5,1.1,1.1V7z"/></g><g><g><path class="fill" d="M11,18c-0.4,0-0.6-0.3-0.6-0.6v-6.8c0-0.4,0.3-0.6,0.6-0.6s0.6,0.3,0.6,0.6v6.8C11.6,17.7,11.4,18,11,18z"/></g><g><path class="fill" d="M8,18c-0.4,0-0.6-0.3-0.6-0.6v-6.8C7.4,10.2,7.7,10,8,10c0.4,0,0.6,0.3,0.6,0.6v6.8C8.7,17.7,8.4,18,8,18z"/></g><g><path class="fill" d="M14,18c-0.4,0-0.6-0.3-0.6-0.6v-6.8c0-0.4,0.3-0.6,0.6-0.6c0.4,0,0.6,0.3,0.6,0.6v6.8C14.6,17.7,14.3,18,14,18z"/></g></g></g></svg>';
    var img1 = document.getElementsByClassName('imageBasic');
    img1.src = "/img/basicImage.png";
    document.getElementById('add').addEventListener('click', function () {
        var value = document.getElementById('inputCount').value;
        var imgField = document.getElementById('file-tolls').files[0];
        if (isPositiveNumber(value)) {
            if (value && imgField) {
                if (isFileImage(imgField)) {
                    addItemAllCard(value);
                    addSpending('inputCount', 'Peaje', imgField);
                    var value = document.getElementById('inputCount').value = '';
                    document.getElementById('file-tolls').value = '';
                } else {
                    alert("Debe seleccionar un formato de archivo valido (imagenes)");
                    return;
                }

            } else {
                return;
            }
        } else {
            return;
        }




    });
    function removeItem() {
        var item = this.parentNode.parentNode;
        var parent = item.parentNode;
        parent.removeChild(item);
        spendings.splice(parseInt(item.id), 1);
        console.log(spendings);

    }
    function addItemAllCard(text) {
        var list = document.getElementById("allCard");
        var item = document.createElement('li');
        let id = spendings.length;
        item.setAttribute("id", "" + id);

        var card = document.createElement('div');
        card.classList.add('contentCard');



        var report = document.createElement('img');
        report.classList.add('imageBasic');
        report.innerHTML = img1;

        var valueTolls = document.createElement('span');
        valueTolls.classList.add('valueBasic');
        valueTolls.innerText = text;

        var buttons = document.createElement('div');
        buttons.classList.add('buttons');

        var remove = document.createElement('button');
        remove.classList.add('remove');
        remove.innerHTML = removeSVG;

        remove.addEventListener('click', removeItem);

        buttons.appendChild(remove);
        item.appendChild(buttons);
        card.appendChild(report);
        card.appendChild(valueTolls);
        item.appendChild(card);


        list.insertBefore(item, list.childNodes[0]);

    }
}

function legalizationFuel() {
    var removeSVG = '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 22 22" style="enable-background:new 0 0 22 22;" xml:space="preserve"><rect class="noFill" width="22" height="22"/><g><g><path class="fill" d="M16.1,3.6h-1.9V3.3c0-1.3-1-2.3-2.3-2.3h-1.7C8.9,1,7.8,2,7.8,3.3v0.2H5.9c-1.3,0-2.3,1-2.3,2.3v1.3c0,0.5,0.4,0.9,0.9,1v10.5c0,1.3,1,2.3,2.3,2.3h8.5c1.3,0,2.3-1,2.3-2.3V8.2c0.5-0.1,0.9-0.5,0.9-1V5.9C18.4,4.6,17.4,3.6,16.1,3.6z M9.1,3.3c0-0.6,0.5-1.1,1.1-1.1h1.7c0.6,0,1.1,0.5,1.1,1.1v0.2H9.1V3.3z M16.3,18.7c0,0.6-0.5,1.1-1.1,1.1H6.7c-0.6,0-1.1-0.5-1.1-1.1V8.2h10.6L16.3,18.7L16.3,18.7z M17.2,7H4.8V5.9c0-0.6,0.5-1.1,1.1-1.1h10.2c0.6,0,1.1,0.5,1.1,1.1V7z"/></g><g><g><path class="fill" d="M11,18c-0.4,0-0.6-0.3-0.6-0.6v-6.8c0-0.4,0.3-0.6,0.6-0.6s0.6,0.3,0.6,0.6v6.8C11.6,17.7,11.4,18,11,18z"/></g><g><path class="fill" d="M8,18c-0.4,0-0.6-0.3-0.6-0.6v-6.8C7.4,10.2,7.7,10,8,10c0.4,0,0.6,0.3,0.6,0.6v6.8C8.7,17.7,8.4,18,8,18z"/></g><g><path class="fill" d="M14,18c-0.4,0-0.6-0.3-0.6-0.6v-6.8c0-0.4,0.3-0.6,0.6-0.6c0.4,0,0.6,0.3,0.6,0.6v6.8C14.6,17.7,14.3,18,14,18z"/></g></g></g></svg>';
    var img2 = document.getElementsByClassName('imageBasic1');
    img2.src = "/img/basicImage.png";
    document.getElementById('add1').addEventListener('click', function () {
        var value1 = document.getElementById('inputCount1').value;
        var imgField = document.getElementById('file-tolls1').files[0];
        if (isPositiveNumber(value1)) {
            if (value1 && imgField) {
                if (isFileImage(imgField)) {
                    addItemAllCard(value1);
                    addSpending('inputCount1', 'Combustible', imgField);
                    var value1 = document.getElementById('inputCount1').value = '';
                    document.getElementById('file-tolls1').value = '';
                } else {
                    alert("Debe seleccionar un formato de archivo valido (imagenes)");
                    return;
                }

            } else {
                return;
            }
        } else {
            return;
        }


    });
    function removeItem1() {
        var item1 = this.parentNode.parentNode;
        var parent1 = item1.parentNode;
        parent1.removeChild(item1);
        spendings.splice(parseInt(item1.id), 1);
        console.log(spendings);

    }
    function addItemAllCard(text1) {
        var list1 = document.getElementById('allCard1');
        var item1 = document.createElement('li');
        let id = spendings.length;
        item1.setAttribute("id", "" + id);
        var card1 = document.createElement('div');
        card1.classList.add('contentCard1');


        var report1 = document.createElement('img');
        report1.classList.add('imageBasic1');
        report1.innerHTML = img2;

        var valueTolls1 = document.createElement('span');
        valueTolls1.classList.add('valueBasic1');
        valueTolls1.innerText = text1;

        var buttons1 = document.createElement('div');
        buttons1.classList.add('buttons1');

        var remove1 = document.createElement('button');
        remove1.classList.add('remove1');
        remove1.innerHTML = removeSVG;

        remove1.addEventListener('click', removeItem1);

        buttons1.appendChild(remove1);
        item1.appendChild(buttons1);
        card1.appendChild(report1);
        card1.appendChild(valueTolls1);
        item1.appendChild(card1);


        list1.insertBefore(item1, list1.childNodes[0]);
    }
}

function legalizationParking() {
    var removeSVG = '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 22 22" style="enable-background:new 0 0 22 22;" xml:space="preserve"><rect class="noFill" width="22" height="22"/><g><g><path class="fill" d="M16.1,3.6h-1.9V3.3c0-1.3-1-2.3-2.3-2.3h-1.7C8.9,1,7.8,2,7.8,3.3v0.2H5.9c-1.3,0-2.3,1-2.3,2.3v1.3c0,0.5,0.4,0.9,0.9,1v10.5c0,1.3,1,2.3,2.3,2.3h8.5c1.3,0,2.3-1,2.3-2.3V8.2c0.5-0.1,0.9-0.5,0.9-1V5.9C18.4,4.6,17.4,3.6,16.1,3.6z M9.1,3.3c0-0.6,0.5-1.1,1.1-1.1h1.7c0.6,0,1.1,0.5,1.1,1.1v0.2H9.1V3.3z M16.3,18.7c0,0.6-0.5,1.1-1.1,1.1H6.7c-0.6,0-1.1-0.5-1.1-1.1V8.2h10.6L16.3,18.7L16.3,18.7z M17.2,7H4.8V5.9c0-0.6,0.5-1.1,1.1-1.1h10.2c0.6,0,1.1,0.5,1.1,1.1V7z"/></g><g><g><path class="fill" d="M11,18c-0.4,0-0.6-0.3-0.6-0.6v-6.8c0-0.4,0.3-0.6,0.6-0.6s0.6,0.3,0.6,0.6v6.8C11.6,17.7,11.4,18,11,18z"/></g><g><path class="fill" d="M8,18c-0.4,0-0.6-0.3-0.6-0.6v-6.8C7.4,10.2,7.7,10,8,10c0.4,0,0.6,0.3,0.6,0.6v6.8C8.7,17.7,8.4,18,8,18z"/></g><g><path class="fill" d="M14,18c-0.4,0-0.6-0.3-0.6-0.6v-6.8c0-0.4,0.3-0.6,0.6-0.6c0.4,0,0.6,0.3,0.6,0.6v6.8C14.6,17.7,14.3,18,14,18z"/></g></g></g></svg>';
    var img3 = document.getElementsByClassName('imageBasic2');
    img3.src = "/img/basicImage.png";
    document.getElementById('add2').addEventListener('click', function () {
        var value2 = document.getElementById('inputCount2').value;
        var imgField = document.getElementById('file-tolls2').files[0];
        if (isPositiveNumber(value2)) {
            if (value2 && imgField) {
                if (isFileImage(imgField)) {
                    addItemAllCard(value2);
                    addSpending('inputCount2', 'Parqueadero', imgField);
                    var value2 = document.getElementById('inputCount2').value = '';
                    document.getElementById('file-tolls2').value = '';
                } else {
                    alert("Debe seleccionar un formato de archivo valido (imagenes)");
                    return;
                }

            } else {
                return;
            }
        } else {

            return;
        }


    });
    function removeItem2() {
        var item2 = this.parentNode.parentNode;
        var parent2 = item2.parentNode;
        parent2.removeChild(item2);
        spendings.splice(parseInt(item2.id), 1);
        console.log(spendings);
    }
    function addItemAllCard(text2) {
        var list2 = document.getElementById('allCard2');

        var item2 = document.createElement('li');
        let id = spendings.length;
        item2.setAttribute("id", "" + id);

        var card2 = document.createElement('div');
        card2.classList.add('contentCard2');


        var report2 = document.createElement('img');
        report2.classList.add('imageBasic2');
        report2.innerHTML = img3;

        var valueTolls2 = document.createElement('span');
        valueTolls2.classList.add('valueBasic2');
        valueTolls2.innerText = text2;

        var buttons2 = document.createElement('div');
        buttons2.classList.add('buttons2');

        var remove2 = document.createElement('button');
        remove2.classList.add('remove2');
        remove2.innerHTML = removeSVG;

        remove2.addEventListener('click', removeItem2);

        buttons2.appendChild(remove2);
        item2.appendChild(buttons2);
        card2.appendChild(report2);
        card2.appendChild(valueTolls2);
        item2.appendChild(card2);


        list2.insertBefore(item2, list2.childNodes[0]);
    }
}

function legalizationWashed() {
    var removeSVG = '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 22 22" style="enable-background:new 0 0 22 22;" xml:space="preserve"><rect class="noFill" width="22" height="22"/><g><g><path class="fill" d="M16.1,3.6h-1.9V3.3c0-1.3-1-2.3-2.3-2.3h-1.7C8.9,1,7.8,2,7.8,3.3v0.2H5.9c-1.3,0-2.3,1-2.3,2.3v1.3c0,0.5,0.4,0.9,0.9,1v10.5c0,1.3,1,2.3,2.3,2.3h8.5c1.3,0,2.3-1,2.3-2.3V8.2c0.5-0.1,0.9-0.5,0.9-1V5.9C18.4,4.6,17.4,3.6,16.1,3.6z M9.1,3.3c0-0.6,0.5-1.1,1.1-1.1h1.7c0.6,0,1.1,0.5,1.1,1.1v0.2H9.1V3.3z M16.3,18.7c0,0.6-0.5,1.1-1.1,1.1H6.7c-0.6,0-1.1-0.5-1.1-1.1V8.2h10.6L16.3,18.7L16.3,18.7z M17.2,7H4.8V5.9c0-0.6,0.5-1.1,1.1-1.1h10.2c0.6,0,1.1,0.5,1.1,1.1V7z"/></g><g><g><path class="fill" d="M11,18c-0.4,0-0.6-0.3-0.6-0.6v-6.8c0-0.4,0.3-0.6,0.6-0.6s0.6,0.3,0.6,0.6v6.8C11.6,17.7,11.4,18,11,18z"/></g><g><path class="fill" d="M8,18c-0.4,0-0.6-0.3-0.6-0.6v-6.8C7.4,10.2,7.7,10,8,10c0.4,0,0.6,0.3,0.6,0.6v6.8C8.7,17.7,8.4,18,8,18z"/></g><g><path class="fill" d="M14,18c-0.4,0-0.6-0.3-0.6-0.6v-6.8c0-0.4,0.3-0.6,0.6-0.6c0.4,0,0.6,0.3,0.6,0.6v6.8C14.6,17.7,14.3,18,14,18z"/></g></g></g></svg>';
    var img4 = document.getElementsByClassName('imageBasic3');
    img4.src = "/img/basicImage.png";
    document.getElementById('add3').addEventListener('click', function () {
        var value3 = document.getElementById('inputCount3').value;
        var imgField = document.getElementById('file-tolls3').files[0];
        if (isPositiveNumber(value3)) {
            if (value3 && imgField) {
                if (isFileImage(imgField)) {
                    addItemAllCard(value3);
                    addSpending('inputCount3', 'Lavada', imgField);
                    var value3 = document.getElementById('inputCount3').value = '';
                    document.getElementById('file-tolls3').value = '';
                } else {
                    alert("Debe seleccionar un formato de archivo valido (imagenes)");
                    return;
                }

            } else {
                return;
            }
        } else {
            return;
        }

    });
    function removeItem3() {
        var item3 = this.parentNode.parentNode;
        var parent3 = item3.parentNode;
        parent3.removeChild(item3);
        spendings.splice(parseInt(item3.id), 1);
        console.log(spendings);
    }
    function addItemAllCard(text3) {
        var list3 = document.getElementById('allCard3');

        var item3 = document.createElement('li');
        let id = spendings.length;
        item3.setAttribute("id", "" + id);

        var card3 = document.createElement('div');
        card3.classList.add('contentCard3');


        var report3 = document.createElement('img');
        report3.classList.add('imageBasic3');
        report3.innerHTML = img4;

        var valueTolls3 = document.createElement('span');
        valueTolls3.classList.add('valueBasic3');
        valueTolls3.innerText = text3;

        var buttons3 = document.createElement('div');
        buttons3.classList.add('buttons3');

        var remove3 = document.createElement('button');
        remove3.classList.add('remove3');
        remove3.innerHTML = removeSVG;

        remove3.addEventListener('click', removeItem3);

        buttons3.appendChild(remove3);
        item3.appendChild(buttons3);
        card3.appendChild(report3);
        card3.appendChild(valueTolls3);
        item3.appendChild(card3);


        list3.insertBefore(item3, list3.childNodes[0]);
    }
}

function legalizationOthers() {
    var removeSVG = '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 22 22" style="enable-background:new 0 0 22 22;" xml:space="preserve"><rect class="noFill" width="22" height="22"/><g><g><path class="fill" d="M16.1,3.6h-1.9V3.3c0-1.3-1-2.3-2.3-2.3h-1.7C8.9,1,7.8,2,7.8,3.3v0.2H5.9c-1.3,0-2.3,1-2.3,2.3v1.3c0,0.5,0.4,0.9,0.9,1v10.5c0,1.3,1,2.3,2.3,2.3h8.5c1.3,0,2.3-1,2.3-2.3V8.2c0.5-0.1,0.9-0.5,0.9-1V5.9C18.4,4.6,17.4,3.6,16.1,3.6z M9.1,3.3c0-0.6,0.5-1.1,1.1-1.1h1.7c0.6,0,1.1,0.5,1.1,1.1v0.2H9.1V3.3z M16.3,18.7c0,0.6-0.5,1.1-1.1,1.1H6.7c-0.6,0-1.1-0.5-1.1-1.1V8.2h10.6L16.3,18.7L16.3,18.7z M17.2,7H4.8V5.9c0-0.6,0.5-1.1,1.1-1.1h10.2c0.6,0,1.1,0.5,1.1,1.1V7z"/></g><g><g><path class="fill" d="M11,18c-0.4,0-0.6-0.3-0.6-0.6v-6.8c0-0.4,0.3-0.6,0.6-0.6s0.6,0.3,0.6,0.6v6.8C11.6,17.7,11.4,18,11,18z"/></g><g><path class="fill" d="M8,18c-0.4,0-0.6-0.3-0.6-0.6v-6.8C7.4,10.2,7.7,10,8,10c0.4,0,0.6,0.3,0.6,0.6v6.8C8.7,17.7,8.4,18,8,18z"/></g><g><path class="fill" d="M14,18c-0.4,0-0.6-0.3-0.6-0.6v-6.8c0-0.4,0.3-0.6,0.6-0.6c0.4,0,0.6,0.3,0.6,0.6v6.8C14.6,17.7,14.3,18,14,18z"/></g></g></g></svg>';
    var img5 = document.getElementsByClassName('imageBasic4');
    img5.src = "/img/basicImage.png";
    console.log("other Plate" + currentPlate);
    document.getElementById('add4').addEventListener('click', function () {
        var value4 = document.getElementById('inputCount4').value;
        var imgField = document.getElementById('file-tolls4').files[0];

        if (isPositiveNumber(value4)) {
            if (value4 && imgField) {
                if (isFileImage(imgField)) {
                    addItemAllCard(value4);
                    addSpending('inputCount4', '', imgField);
                    var value4 = document.getElementById('inputCount4').value = '';
                    document.getElementById('file-tolls4').value = '';
                } else {
                    alert("Debe seleccionar un formato de archivo valido (imagenes)");
                    return;
                }

            } else {
                return;
            }
        } else {
            return;
        }

    });
    function removeItem4() {
        var item4 = this.parentNode.parentNode;
        var parent4 = item4.parentNode;
        parent4.removeChild(item4);
        spendings.splice(parseInt(item4.id), 1);
        console.log(spendings);
    }
    function addItemAllCard(text4) {
        var list4 = document.getElementById('allCard4');

        var item4 = document.createElement('li');
        let id = spendings.length;
        item4.setAttribute("id", "" + id);
        var card4 = document.createElement('div');
        card4.classList.add('contentCard4');


        var report4 = document.createElement('img');
        report4.classList.add('imageBasic4');
        report4.innerHTML = img5;

        var valueTolls4 = document.createElement('span');
        valueTolls4.classList.add('valueBasic4');
        valueTolls4.innerText = text4;

        var buttons4 = document.createElement('div');
        buttons4.classList.add('buttons4');

        var remove4 = document.createElement('button');
        remove4.classList.add('remove4');
        remove4.innerHTML = removeSVG;

        remove4.addEventListener('click', removeItem4);

        buttons4.appendChild(remove4);
        item4.appendChild(buttons4);
        card4.appendChild(report4);
        card4.appendChild(valueTolls4);
        item4.appendChild(card4);


        list4.insertBefore(item4, list4.childNodes[0]);
    }
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
                "</span>" + "<span>" +
                "<i onclick='viewTruck(" + '"' + child.id + '"' + ");' class='fas fa-eye'>" + "</i>" + "<span class='val'>" + " Ver Camión" + "</span>" +
                "</span>" + "</center>" +
                "</div>" +
                "</div>" +
                "<div class='card-footer'>" +
                "<p id='capacidadCarga' class='post-text'>" + "<span class='ht'>" + "Capacidad de Carga: " + "</span>"
                + "" + child.data().capacidadCarga + " Toneladas" + "</p>" +
                "<p id='km' class='post-text'>" + "<span class='ht'>" + "Kilometraje: " + "</span>" + "" + child.data().kilometraje + "" + "</p>"
                + "<p id='marca' class='post-text'>" + "<span class='ht'>" + "Marca Cabezote: " + "</span>" + "" + child.data().marcaCabezote + "" + "</p>" +
                "<p id='numEjes' class='post-text'>" + "<span class='ht'>" + "Número de Ejes: " + "</span>" + "" + child.data().numeroEjes + "" + "</p>" +
                "<p id='placaTrailer' class='post-text'>" + "<span class='ht'>" + "Placa Trailer: " + "</span>" + "" + child.data().placaTrailer + "" + "</p>" +
                "</div>" +
                "</div>" +
                "</li>"

        })
        chargePage(false);
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
                "<i onclick='viewTruck(" + '"' + child.id + '"' + ");' class='fas fa-eye'>" + "</i>" + "<span class='val'>" + " Ver Camión" + "</span>" +
                "</span>" + "</center>" +
                "</div>" +
                "</div>" +
                "<div class='card-footer'>" +
                "<p id='capacidadCarga' class='post-text'>" + "<span class='ht'>" + "Capacidad de Carga: " + "</span>"
                + "" + child.data().capacidadCarga + " Toneladas" + "</p>" +
                "<p id='km' class='post-text'>" + "<span class='ht'>" + "Kilometraje: " + "</span>" + "" + child.data().kilometraje + "" + "</p>"
                + "<p id='marca' class='post-text'>" + "<span class='ht'>" + "Marca Cabezote: " + "</span>" + "" + child.data().marcaCabezote + "" + "</p>" +
                "<p id='numEjes' class='post-text'>" + "<span class='ht'>" + "Número de Ejes: " + "</span>" + "" + child.data().numeroEjes + "" + "</p>" +
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

    //put request upload file to firebase storage
    thisRef.put(file).then(function (snapshot) {
        alert("Se ha creado un nuevo vehículo");
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
function viewTruck(Plate) {
    let btnUpdate = document.getElementById("btnUpdate");
    btnUpdate.setAttribute("onclick", "loadTruck('" + Plate + "');");
    console.log(Plate);

    plateView = Plate;
    loadSettlementsListOwner(Plate);

    currentPlate = Plate;
    let labelPLate = document.getElementById("placaCabezoteVT");
    let driverName = document.getElementById("nombreConductorVT");

    db.collection('accounts').doc(idUsuario).get().then(snap => {
        if (snap.data().rol === "Propietario") {
            db.collection('accounts').doc(idUsuario).collection("camiones").doc(currentPlate).get().then(snap => {
                let mailDriver = snap.data().conductorActual;
                db.collection('accounts').doc(mailDriver).get().then(snap => {
                    driverName.innerHTML = driverName.innerHTML + snap.data().nombre;


                });

            });


        } else {
            db.collection('accounts').doc(idUsuario).get().then(snap => {


                driverName.innerHTML = driverName.innerHTML + snap.data().nombre;




            });



        }

    });

    labelPLate.innerHTML = labelPLate.innerHTML + currentPlate;

    changePage('view-truck', 'section-initial-page');

    console.log("current Boss" + currentBoss);
}
function changeLegalization() {
    changePage('create-travel', 'view-truck');
}

function loadTruck(placa) {

    console.log(placa);
    changePage('update-truck', 'view-truck');


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



        db.collection('accounts').doc(idUsuario).collection('camiones').doc(updateElements[0].value).update(truck).then(function () {
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

    var letras_mayusculas = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ";
    var numeros = "0123456789";

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

    let departOrigin = document.getElementById("input-create-travel-departmento").value;
    let cityOrigin = document.getElementById("input-create-travel-cityo").value;
    let departDestin = document.getElementById("input-create-travel-departmentd").value;
    let cityDestin = document.getElementById("input-create-travel-cityd").value;
    let dateTravel = document.getElementById("input-create-travel-dateout").value;
    let company = document.getElementById("input-create-travel-description").value;
    let freight = document.getElementById("input-create-travel-amoung").value;
    let advance = document.getElementById("input-create-travel-output").value;
    let nTons = document.getElementById("input-create-travel-weight").value;

    changePage('legalization-tolls', 'create-travel');

    // let city1Elem = document.getElementById("city1");
    // let city2Elem = document.getElementById("city2");
    // let date1Elem = document.getElementById("date1");
    // let companyElem = document.getElementById("company");
    // let advanceElem = document.getElementById("advance");
    // let weigthElem = document.getElementById("weigth");

    // city1Elem.innerHTML = city1Elem.innerHTML + cityOrigin;
    // city2Elem.innerHTML = city2Elem.innerHTML + cityDestin;
    // date1Elem.innerHTML = date1Elem.innerHTML + dateTravel;
    // companyElem.innerHTML = companyElem.innerHTML + companyL;
    // advanceElem.innerHTML = advanceElem.innerHTML + advance;
    // weigthElem.innerHTML = weigthElem.innerHTML + nTons;


    spendings.push(new spendingHeader(departOrigin, cityOrigin, departDestin,
        cityDestin, dateTravel, company, freight, advance, nTons));


    console.log(spendings);

    return false;
}

function spending(value, image, type) {

    this.value = value;
    this.image = image;
    this.type = type;
}

function spendingHeader(departOrigin, cityOrigin, departDestin, cityDestin, dateTravel, company, freight, advance, nTons) {
    this.departOrigin = departOrigin;
    this.cityOrigin = cityOrigin;
    this.departDestin = departDestin;
    this.cityDestin = cityDestin;
    this.dateTravel = dateTravel;
    this.company = company;
    this.freight = freight;
    this.advance = advance;
    this.nTons = nTons;

}



function addSpending(idInput, typeSpend, imgSpend) {

    if (idInput === "inputCount4") {
        typeSpend = document.getElementById("inputOption").value;

    }

    let spendingInput = document.getElementById(idInput);

    spendings.push(new spending(spendingInput.value, imgSpend, typeSpend));

    console.log(spendings);

    return false;
}


function uploadSettlement() {
    let numberSettlemet;

    console.log(spendings);
    let spendingsLength = spendings.length;

    let spendingH = {
        departamentoOrigen: spendings[0].departOrigin,
        municipioOrigen: spendings[0].cityOrigin,
        departamentoDestino: spendings[0].departDestin,
        municipioDestino: spendings[0].cityDestin,
        fechaManifiesto: spendings[0].dateTravel,
        empresa: spendings[0].company,
        flete: spendings[0].freight,
        anticipo: spendings[0].advance,
        numeroToneladas: spendings[0].nTons,
        totalCombustible: spendings[spendingsLength - 1].totalCombustible,
        totalPeajes: spendings[spendingsLength - 1].totalPeajes,
        totalParqueadero: spendings[spendingsLength - 1].totalParqueadero,
        totalLavadas: spendings[spendingsLength - 1].totalLavada,
        totalOtros: spendings[spendingsLength - 1].totalOtros

    }

    console.log(spendingH);
    db.collection('accounts').doc(currentBoss).collection("camiones").doc(currentPlate).collection("liquidaciones").get().then(snapshot => {
        numberSettlemet = snapshot.size + 1;

        db.collection('accounts').doc(currentBoss).collection("camiones").doc(currentPlate).collection("liquidaciones").doc(numberSettlemet.toString()).set(spendingH).then(function () {

            for (let i = 1; i <= spendings.length - 2; i++) {

                var spendingN = {
                    valor: spendings[i].value,
                    // imagen: spendings[i].image,
                    categoria: spendings[i].type

                }


                db.collection('accounts').doc(currentBoss).collection("camiones").doc(currentPlate).collection("liquidaciones").doc(numberSettlemet.toString()).collection("gastos").doc(i.toString()).set(spendingN).then(function () {

                    uploadImageSettlement(spendings[i].image, currentPlate, numberSettlemet, i);


                }).catch(function (error) {
                    console.error("Error: ", error);
                });
            }

            alert("Legalización creada correctamente.");

        }).catch(function (error) {
            console.error("Error: ", error);
        });



    }).catch(function (error) {
        console.error("Error: ", error);
    });

    loadSettlementsListOwner(plateView);
    changePage('view-truck', 'summarySpendings');
    
}


function uploadImageSettlement(imagen, plate, size, count) {



    var url = 0;
    var storageRef = storage.ref();
    var file = imagen;
    //dynamically set reference to the file name
    var thisRef = storageRef.child('/' + currentBoss + '/camiones/' + plate + '/' + ' liquidaciones/' + size.toString() + '/' + count.toString());

    //put request upload file to firebase storage
    thisRef.put(file).then(function (snapshot) {
        console.log('Uploaded a blob or file!');

        snapshot.ref.getDownloadURL().then(function (DownloadURL) {
            url = DownloadURL;

            db.collection('accounts').doc(currentBoss).collection('camiones').doc(plate).collection('liquidaciones').doc(size.toString()).collection('gastos').doc(count.toString()).update({ "imagenSettlement": url })
                .then(function () {
                    console.log("Document successfully updated!");
                    console.log(url);


                }).catch(function (error) {

                    console.log(error);
                });



        });


    });

}


function summarySpendings() {

    changePage('summarySpendings', 'legalization-others');
    let spendingsList = document.getElementById("spendingsList");

    let fuelTotal = 0;
    let tollsTotal = 0;
    let parkingTotal = 0;
    let washesTotal = 0;
    let othersTotal = 0;

    for (let i = 1; i <= spendings.length - 1; i++) {

        if (spendings[i].type === "Combustible") {
            fuelTotal += parseFloat(spendings[i].value);
        } else if (spendings[i].type === "Peaje") {
            tollsTotal += parseFloat(spendings[i].value);
        } else if (spendings[i].type === "Parqueadero") {
            parkingTotal += parseFloat(spendings[i].value);
        } else if (spendings[i].type === "Lavada") {
            washesTotal += parseFloat(spendings[i].value);
        } else {
            othersTotal += parseFloat(spendings[i].value);
        }
        spendingsList.innerHTML = spendingsList.innerHTML + "<li>Gasto ( " + spendings[i].type + ")" + i + ": " + spendings[i].value + "</li>"
        console.log(spendings);

    }

    let spendingsTotal = {
        totalCombustible: fuelTotal,
        totalPeajes: tollsTotal,
        totalParqueadero: parkingTotal,
        totalLavada: washesTotal,
        totalOtros: othersTotal
    }


    spendings.push(spendingsTotal);

    console.log(spendingsTotal);

}


function isPositiveNumber(number) {

    if (Math.sign(number) > 0) {
        return true;
    } else {
        return false;
    }

}


var openPopup = document.getElementById('btnOpen');
overlay = document.getElementById('overlay');
popup = document.getElementById('popup');
btnClosePopup = document.getElementById('btnClosePopup');
openPopup.addEventListener('click', function () {
    overlay.classList.add('active');
});
btnClosePopup.addEventListener('click', function () {
    overlay.classList.remove('active');
});

var openPopupacepted = document.getElementById('btnaccept');
overlay1 = document.getElementById('overlayAccepted');
popup1 = document.getElementById('popupAcepted');
btnClosePopup = document.getElementById('btnClosePopup1');
openPopupacepted.addEventListener('click', function () {
    overlay1.classList.add('active');
});
btnClosePopup.addEventListener('click', function () {
    overlay1.classList.remove('active');
});

// var openNote = document.getElementById('openNote');
// overlayObservations = document.getElementById('overlayObservations');
// popupObservations = document.getElementById('popupObservations');
// btnClosePopupObservations = document.getElementById('btnClosePopupObservations');
// openNote.addEventListener('click', function () {
//     overlayObservations.classList.add('active');
// });
// btnClosePopupObservations.addEventListener('click', function () {
//     overlayObservations.classList.remove('active');
// });

function loadSettlementsListOwner(plate) {

    let listSettlements = document.getElementById("listSettlements");
    listSettlements.innerHTML = "";
    console.log(idUsuario);
    db.collection('accounts').doc(idUsuario).get().then(snapshot => {
        let user;
        if (snapshot.data().rol === "Propietario") {
            user = idUsuario;

        } else {
            user = snapshot.data().jefe;
        }


        db.collection('accounts').doc(user).collection("camiones").doc(plate).collection("liquidaciones").get().then(snapshot => {


            var numDeparture;
            var numArrive;
            var date;
            var change = "'create-balance','view-truck'";

            snapshot.forEach(function (child) {
                id = child.id;
                numArrive = child.data().municipioDestino;
                numDeparture = child.data().municipioOrigen;
                date = child.data().fechaManifiesto;
                console.log(numArrive);
                console.log(numDeparture);



                listSettlements.innerHTML = listSettlements.innerHTML + "<li><span>" + numDeparture + "</span><span>-</span><span>" + numArrive + "</span><br><span>" + date + "</span>" +
                    "<div class='buttons'>" + "<button id='" + child.id + "' class='report' onclick='changeToSettlement(this);'>" + "<svg version='1.1' id='Layer_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 482.2 482.2'style='enable-background:new 0 0 482.2 482.2;' xml:space='preserve'><circle style='fill:#FFD05B;' cx='241.1' cy='241.1' r='241.1'/><polygon style='fill:#ACB3BA;'points='180.9,103.1 180.9,159.1 124.9,159.1 124.9,402.2 378.2,402.2 378.2,103.1 ' />"
                "+<polygon style='fill:#FFFFFF;'points='160,379.1 160,323.1 104,323.1 104,80 357.3,80 357.3,379.1 ' /><g><polygon style='fill:#CED5E0;' points='160,379.1 104,323.1 160,323.1 ' /><rect x='141.2' y='198.2' style='fill:#CED5E0;' width='178.8' height='10.7' /><rect x='141.2' y='226.5' style='fill:#CED5E0;' width='178.8' height='10.7' /><rect x='141.2' y='254.9' style='fill:#CED5E0;' width='178.8' height='10.7' /><rect x='141.2' y='283.3' style='fill:#CED5E0;' width='106.6' height='10.7' /></g>"
                    + "<g><path style='fill:#54C0EB;'d='M164.9,131.2c0,5-2,8.2-5.9,9.7l7.9,11.1h-8.5l-6.9-9.9h-4.8v9.9h-6.9v-31.1h11.8c4.8,0,8.3,0.8,10.3,2.4C163.8,124.9,164.9,127.6,164.9,131.2z M156.5,134.9c0.9-0.8,1.3-2,1.3-3.7s-0.4-2.8-1.3-3.4c-0.9-0.6-2.4-0.9-4.7-0.9h-5.2v9.2h5.1C154,136,155.7,135.6,156.5,134.9z' /><path style='fill:#54C0EB;'d='M194.4,120.9v6.2h-15.5v6.4h13.9v5.9h-13.9v6.4h16v6.1H172v-31.1h22.4V120.9z' /><path style='fill:#54C0EB;'d='M222.5,123.6c2.2,1.9,3.3,4.7,3.3,8.5s-1.1,6.6-3.4,8.4c-2.2,1.8-5.7,2.7-10.3,2.7H208v8.7h-6.9v-31.1h11C216.8,120.9,220.3,121.8,222.5,123.6z M217.4,135.9c0.8-0.9,1.2-2.3,1.2-4.1s-0.5-3.1-1.6-3.8c-1.1-0.8-2.8-1.1-5-1.1h-4v10.5h4.7C215,137.3,216.6,136.8,217.4,135.9z' /><path style='fill:#54C0EB;'d='M257.3,147.7c-3.1,3.1-7,4.6-11.6,4.6s-8.5-1.5-11.6-4.6s-4.7-6.9-4.7-11.5s1.6-8.4,4.7-11.5c3.1-3.1,7-4.6,11.6-4.6s8.5,1.5,11.6,4.6s4.7,6.9,4.7,11.5C262,140.8,260.5,144.6,257.3,147.7z M255,136.2c0-2.8-0.9-5.1-2.7-7.1c-1.8-2-4-2.9-6.6-2.9s-4.8,1-6.6,2.9c-1.8,2-2.7,4.3-2.7,7.1s0.9,5.1,2.7,7.1c1.8,1.9,4,2.9,6.6,2.9s4.8-1,6.6-2.9C254.1,141.4,255,139,255,136.2z' /><path style='fill:#54C0EB;'d='M293.1,131.2c0,5-2,8.2-5.9,9.7l7.9,11.1h-8.5l-6.9-9.9h-4.8v9.9H268v-31.1h11.8c4.8,0,8.3,0.8,10.3,2.4C292.1,124.9,293.1,127.6,293.1,131.2z M284.8,134.9c0.9-0.8,1.3-2,1.3-3.7s-0.4-2.8-1.3-3.4c-0.9-0.6-2.4-0.9-4.7-0.9h-5.2v9.2h5.1C282.3,136,283.9,135.6,284.8,134.9z' /><path style='fill:#54C0EB;' d='M312.8,126.9V152h-6.9v-25.1h-8.8v-6h24.5v6H312.8z'/></g>"
                    + "<g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg></button>"
                    + "<button class='statistics'>"
                    + "<svg version='1.1' id='Capa_1' xmlns='http://www.w3.org/2000/svg'" +
                    "xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 512 512'" +
                    "style='enable-background:new 0 0 512 512;' xml:space='preserve'>" +
                    "<g>" +
                    "<path style='fill:#29485A;' d='M42.667,51.182H153.6v17.067H42.667V51.182z' />" +
                    "<path style='fill:#29485A;' d='M42.667,85.316H153.6v17.067H42.667V85.316z' />" +
                    "<path style='fill:#29485A;' d='M42.667,119.449h76.8v17.067h-76.8V119.449z' />" +
                    "<path style='fill:#29485A;' d='M42.667,153.582h76.8v17.067h-76.8V153.582z' />" +
                    "<path style='fill:#29485A;' d='M0,494.916h512v17.067H0V494.916z'/>" +
                    "</g>" +
                    "<g>" +
                    "<path style='fill:#ED1C24;'" +
                    "d='M34.859,383.982l-1.451-17.067c178.321-15.454,331.059-133.931,390.357-302.814L444.245,5.7l16.111,5.632l-20.48,58.402C378.377,244.983,219.895,367.948,34.859,383.982z'/>" +
                    "<path style='fill:#ED1C24;' d='M42.667,418.116H102.4v51.2H42.667V418.116z' />" +
                    "</g>" +
                    "<path style='fill:#FBB03B;' d='M136.533,392.516h59.733v76.8h-59.733V392.516z' />" +
                    "<path style='fill:#F8CF26;' d='M230.4,349.849h59.733v119.467H230.4V349.849z' />" +
                    "<path style='fill:#39B54A;' d='M324.267,290.116H384v179.2h-59.733V290.116z' />" +
                    "<path style='fill:#0071BC;' d='M418.133,170.649h59.733v298.667h-59.733V170.649z' />" +
                    "<path style='fill:#ED1C24;'" +
                    "d='M486.4,85.316c-3.251,0.017-6.229-1.809-7.68-4.719L448.41,20.01l-60.595,30.319c-4.215,2.108-9.344,0.393-11.452-3.823c-2.108-4.215-0.393-9.344,3.823-11.452l68.267-34.133c4.215-2.108,9.344-0.401,11.452,3.814v0.009l34.133,68.267c2.082,4.224,0.341,9.344-3.883,11.426C488.986,85.008,487.706,85.316,486.4,85.316z' />" +
                    "<g></g>" +
                    "<g></g>" +
                    "<g></g>" +
                    "<g></g>" +
                    "<g></g>" +
                    "<g></g>" +
                    "<g></g>" +
                    "<g></g>" +
                    "<g></g>" +
                    "<g></g>" +
                    "<g></g>" +
                    "<g></g>" +
                    "<g></g>" +
                    "<g></g>" +
                    "<g></g>" +
                    "</svg>" +
                    "</button>" +
                    "</div>" +
                    "</li>"



            });
        });

    });

}


function changeToSettlement(settlementId) {

    changePage('create-balance', 'view-truck')
    let settlementHeader = document.getElementById("settlementHeaderView");
    let listSpendings = document.getElementById("listSpendings")
    let settlementSummary = document.getElementById("settlementSummary");
    settlementSummary.innerHTML = "";
    listSpendings.innerHTML = "";
    settlementHeader.innerHTML = "";



    db.collection('accounts').doc(idUsuario).get().then(snapshot => {
        let user;
        if (snapshot.data().rol === "Propietario") {
            user = idUsuario;

        } else {
            user = snapshot.data().jefe;
        }


        db.collection('accounts').doc(user).collection("camiones").doc(plateView).collection("liquidaciones").doc(settlementId.id).get().then(snapshot => {





            settlementHeader.innerHTML = settlementHeader.innerHTML +
                "<div id='container-legalization-aceept'>" +
                "<center><span id='title-register'>Legalización de Gastos</span></center>" +
                "<br>" +
                "<div class='headerContent'>" +
                "<div class='balnceHeader'>" +
                "<div><img src='img/fotoviascamiones_2.png' class='profile-pic' alt=''></div>" +
                "<div class='detail-legalization'>" +
                "<p class='name'>Ciudad Origen: <span>" + snapshot.data().municipioOrigen + "</span></p>" +
                "<p class='name'>Ciudad Destino: <span>" + snapshot.data().municipioDestino + "</span></p>" +
                "<p class='name'><span>Fecha de Manifiesto: </span>" + snapshot.data().fechaManifiesto + "</p>" +
                "</div>" +
                "</div>" +
                "</div>" +
                "<div class='headerCompanyHeigth'>" +
                "<div class='balnceHeaderCompanyHeigth'>" +
                "<div class='detail-legalization'>" +
                "<span class='name'>Empresa: <span>" + snapshot.data().empresa + "</span></span>" +
                "<span class='moveRight'>Flete: <span>" + snapshot.data().flete + "</span></span>" +
                "</div>" +
                "</div>" +
                "</div>" +
                "<br>" +
                "<div class='headerTonsAdvancement'>" +
                "<div class='balnceHeaderTonsAdvancement'>" +
                "<div class='detail-legalization'>" +
                "<span class='name'>Toneladas: <span>" + snapshot.data().numeroToneladas + "</span><span> T</span></span>" +
                "<span class='moveRight'>Anticipo: <span></span>" + snapshot.data().anticipo + "</span>" +
                "</div>" +
                "</div>" +
                "</div>" +
                "<br>" +
                "</div>"

            db.collection('accounts').doc(user).collection("camiones").doc(plateView).collection("liquidaciones").doc(settlementId.id).collection("gastos").get().then(snapshot2 => {

                snapshot2.forEach(function (child) {
                    id = child.id;
                    
                    console.log(id);
               


                    listSpendings.innerHTML = listSpendings.innerHTML + "<li>"+
                    "<div class='contentCardOwnerLeg'>"+
                        "<img alt='' src='" + child.data().imagenSettlement + "' class='imageOwnerLeg'>"+
                        "<span class='valueOwnerLeg'>Categoría: <span>"+ child.data().categoria +"</span></span>"+
                        "<br>"+
                        "<span class='valueOwnerLeg'>Valor: <span>"+ child.data().valor +"</span></span>"+
                    "</div>"+
                "</li>"

                });
            });



            settlementSummary.innerHTML = settlementSummary.innerHTML +  "<div class='listTotal'>"+
            "<div class='contentValueTotal'>"+
                "<div class='headerValueTotal'>"+
                    "<div class='detailLiguidation'>"+
                        "<p class='name'>Total Peajes:         <span class='valueDetail'>"+ snapshot.data().totalPeajes+"</span></p>"+
                        "<p class='name'>Total Combustible:    <span class='valueDetail'>"+ snapshot.data().totalCombustible+"</span></p>"+
                        "<p class='name'>Total Parqueadero:    <span class='valueDetail'>"+ snapshot.data().totalParqueadero+"</span></p>"+
                        "<p class='name'>Total Lavadas:        <span class='valueDetail'>"+ snapshot.data().totalLavadas+"</span></p>"+
                        "<p class='name'>Total Otros:          <span class='valueDetail'>"+ snapshot.data().totalOtros+"</span></p>"+
                        "<hr class='lineTotal'>"+
                        "<p class='name'>Valor Total de Gatos: <span class='valueDetail'> 15000</span></p>"+
                    "</div>"+
                "</div>"+
                "<br>"+
                "<div class='footerOptionOwner'>"+
                    "<div id='btnaccept' class='accepted'>"+
                        "<i class='fas fa-check-circle'></i>"+
                        "<span>Aprobar</span>"+
                    "</div>"+
                    "<div  id='btnOpen' class='error'>"+
                        "<i class='fas fa-times'></i>"+
                        "<span>Rechazar</span>"+
                    "</div>"+
                    "<div class='back' onclick='changeToTruckview()'>"+
                        "<i class='fas fa-arrow-left'></i>"+
                        "<span>Atras</span>"+
                    "</div>"+
                "</div>"+
            "</div>"+
        "</div>"

        });
    });
}

function changeToTruckview() {
    changePage('view-truck', 'create-balance');
}

function chargePage(ok){
    if(ok){
        document.getElementById("charge-section").classList.remove("invisible");        
    }else{
        document.getElementById("charge-section").className += " invisible";
    }
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
    let imagen = document.getElementById('img_profile_account');

    nameInfo.innerHTML = "Nombre: " + name;
    emailInfo.innerHTML = "Correo: " + email;
    phoneInfo.innerHTML = "Telefono: " + phone;
    nipInfo.innerHTML = "NIP: " + nip;
    typeAccInfo.innerHTML = "Tipo de cuenta: " + typeAccount;
    cityInfo.innerHTML = "Ciudad: " + city;
    departamentInfo.innerHTML = "Departamento: " + departament;
    imagen.src = imagenProfile;

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
    let imagen = document.getElementById('imgProfileAccount').files[0];

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

        if(imagen!=null){
            uploadImageProfile(imagen);
        }

        
        // userDataLogin(idUsuario);
        accountInfo();
        changePage('div_account', 'edit_account');
    }).catch(function (error) {
        console.error("Error: ", error);
    });






    

    return false;
}


function uploadImageProfile(imagen) {



    let url = 0;
    // Created a Storage Reference with root dir
    let storageRef = storage.ref();
    // Get the file from DOM
    let file = imagen;
    // console.log(file);

    //dynamically set reference to the file name
    let thisRef = storageRef.child('/' + idUsuario + '/imagenPerfil/' + imagen.name);

    //put request upload file to firebase storage
    thisRef.put(file).then(function (snapshot) {
        alert("File Uploaded");
        console.log('Uploaded a blob or file!');

        snapshot.ref.getDownloadURL().then(function (DownloadURL) {
            url = DownloadURL;

            db.collection('accounts').doc(idUsuario).update({ "imagenPerfil": url })
                .then(function () {
                    console.log("Document successfully updated!");
                    console.log(url);
                }).catch(function (error) {

                    console.log(error);
                });



        });


    });

}

function editAccount(ok) {
    if (ok) {
        document.getElementById("edit_account").classList.remove("invisible");
    } else {
        document.getElementById("edit_account").className += " invisible";
    }
}