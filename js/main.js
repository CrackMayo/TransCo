//getUserData
function userDataLogin(userId) {

    db.collection('accounts').doc(userId).get().then(snap => {
        var nombre = snap.data().nombre;
        var cedula = snap.data().cedula;
        var celular = snap.data().celular;
        var rol = snap.data().rol;
        alert("nombre: " + nombre + " cedula: " + cedula + " celular: " + celular + " rol: " + rol);
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
        kilometraje: km
    }


    db.collection('accounts').doc(idUsuario).collection('camiones').doc(placa).set(truck).then(function () {
        console.log("Creado");
    }).catch(function (error) {
        console.error("Error: ", error);
    });
}



function obtenerCamion(){

    var label1 = document.getElementById("truck1");
    
    var label2 = document.getElementById("truck2");
    
    var label3 = document.getElementById("truck3");
    console.log("1");

    db.collection('accounts').doc(idUsuario).collection('camiones').get().then(snapshot => {
        console.log("2");
        snapshot.forEach(function (child) {
            label1.innerHTML = "Placa: " + child.id;
            label2.innerHTML = "Marca: " + child.data().marcaCabezote;
            label3.innerHTML = "Capacidad Max: " + child.data().capacidadCarga;
            console.log("3");
            
        });
    })




}