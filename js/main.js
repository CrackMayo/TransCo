function userDataLogin(userId) {
    let lista = document.getElementById("listaCamiones");
    lista.innerHTML = "";

    db.collection('accounts').doc(userId).get().then(snap => {
        var rol = snap.data().rol;
        let conVehiculo = snap.data().conVehiculo;
        var navElements = [document.getElementById("generalBalance2"), document.getElementById("generalBalance1"),
        document.getElementById("createTruck2"), document.getElementById("createTruck1"),
        document.getElementById("createTravel1"),document.getElementById("createTravel2")];

        if (rol === "Conductor") {


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
                        console.log("Conductor no disponible");
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
        var value1 = document.getElementById('inputCount').value;
        if (value1) {
            addItemAllCard(value1);
            var value1 = document.getElementById('inputCount').value = '';
        }

    });
    function removeItem() {
        var item = this.parentNode.parentNode;
        var parent = item.parentNode;
        parent.removeChild(item);
    }
    function addItemAllCard(text) {
        var list = document.getElementById("allCard");

        var item = document.createElement('li');

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
        if (value1) {
            addItemAllCard(value1);
            var value1 = document.getElementById('inputCount1').value = '';
        }

    });
    function removeItem1() {
        var item1 = this.parentNode.parentNode;
        var parent1 = item1.parentNode;
        parent1.removeChild(item1);
    }
    function addItemAllCard(text1) {
        var list1 = document.getElementById('allCard1');

        var item1 = document.createElement('li');

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
        if (value2) {
            addItemAllCard(value2);
            var value2 = document.getElementById('inputCount2').value = '';
        }

    });
    function removeItem2() {
        var item2 = this.parentNode.parentNode;
        var parent2 = item2.parentNode;
        parent2.removeChild(item2);
    }
    function addItemAllCard(text2) {
        var list2 = document.getElementById('allCard2');

        var item2 = document.createElement('li');

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
        if (value3) {
            addItemAllCard(value3);
            var value3 = document.getElementById('inputCount3').value = '';
        }
    });
    function removeItem3() {
        var item3 = this.parentNode.parentNode;
        var parent3 = item3.parentNode;
        parent3.removeChild(item3);
    }
    function addItemAllCard(text3) {
        var list3 = document.getElementById('allCard3');

        var item3 = document.createElement('li');

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
    document.getElementById('add4').addEventListener('click', function () {
        var value4 = document.getElementById('inputCount4').value;
        if (value4) {
            addItemAllCard(value4);
            var value4 = document.getElementById('inputCount4').value = '';
        }
    });
    function removeItem4() {
        var item4 = this.parentNode.parentNode;
        var parent4 = item4.parentNode;
        parent4.removeChild(item4);
    }
    function addItemAllCard(text4) {
        var list4 = document.getElementById('allCard4');

        var item4 = document.createElement('li');

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
                "<i onclick='loadTruck(" + '"' + child.id + '"' + ");' class='material-icons'>" + "share" + "</i>" + "<span class='val'>" + "Modificar" + "</span>" +
                "</span>" + "<span>" +
                "<i onclick='viewTruck(" + '"' + child.id + '"' + ");' class='material-icons'>" + "share" + "</i>" + "<span class='val'>" + "Ver Camion" + "</span>" +
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
function viewTruck() {
    changePage('view-truck', 'section-initial-page');
}
function changeLegalization() {
    changePage('create-travel', 'view-truck');
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



function createSettlement(){

let departOriginL = document.getElementById("input-create-travel-departmento").value;
let cityOriginL = document.getElementById("input-create-travel-cityo").value;
let departDestinL = document.getElementById("input-create-travel-departmentd").value;
let cityDestinL = document.getElementById("input-create-travel-cityd").value;
let dateTravelL = document.getElementById("input-create-travel-dateout").value;
let companyL = document.getElementById("input-create-travel-description").value;
let freightL = document.getElementById("input-create-travel-amoung").value;
let advanceL = document.getElementById("input-create-travel-output").value;
let nTonsL = document.getElementById("input-create-travel-weight").value;

changePage('legalization-tolls','create-travel');

let city1Elem = document.getElementById("city1");
let city2Elem = document.getElementById("city2");
let date1Elem = document.getElementById("date1");
let companyElem = document.getElementById("company");
let advanceElem = document.getElementById("advance");
let weigthElem = document.getElementById("weigth");

city1Elem.innerHTML = city1Elem.innerHTML + cityOriginL;
city2Elem.innerHTML = city2Elem.innerHTML + cityDestinL;
date1Elem.innerHTML = date1Elem.innerHTML + dateTravelL;
// companyElem.innerHTML = companyElem.innerHTML + companyL;
advanceElem.innerHTML = advanceElem.innerHTML + advanceL;
weigthElem.innerHTML = weigthElem.innerHTML + nTonsL;

console.log(" "+departOriginL + " "+cityOriginL + " "+departDestinL+" "+cityDestinL+ " "+dateTravelL+" "+companyL+
" "+freightL+" "+advanceL+" "+nTonsL);

    return false;
}