//getUserData
function userDataLogin(userId) {

    db.collection('accounts').doc(userId).get().then(snap => {
        var nombre = snap.data().nombre;
        var cedula = snap.data().cedula;
        var celular = snap.data().celular;
        var rol = snap.data().rol;
        
        if( rol === "Conductor"){
            var navElements  =[document.getElementById("generalBalance2"),document.getElementById("generalBalance1"),
            document.getElementById("createTruck2"),document.getElementById("createTruck1")] ;

            for(let i = 0; i<= navElements.length;i++){
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
        console.log("Creado");
        var url = uploadImageTruck(imagen, placa);

        console.log(url);
        db.collection('accounts').doc(idUsuario).collection('camiones').doc(placa).update({ "imagenCamion": url }).then(function () {
            console.log("Document successfully updated!");
        });

    }).catch(function (error) {
        console.error("Error: ", error);
    });
}



function obtenerCamion() {

    
  

    db.collection('accounts').doc(idUsuario).collection('camiones').get().then(snapshot => {
        let lista = document.getElementById("listaCamiones");

        snapshot.forEach(function (child) {
            
            lista.innerHTML = lista.innerHTML + "<li>" + "<div class='tab-content' id='myTabContent'>" +
                "<div class='tab-pane fade show active' id='home' role='tabpanel' aria-labelledby='home-tab'>" +
                    "<div class='container-fluid'>" +
                      "<div class='card post mt-4'>"+
                            "<div class='card-footer'>" +
                                    "<center>" + "<p id='placaCabezote' class='post-text'>"+"<span class='ht'>" +  "Placa Cabezote" + "</span>"
                                    + "TN345" + "</p>" + "</center>"
                            +"</div>" +
                          "<img class='post-img card-img' src='img/fotoviascamiones_2.png'>" +
                          "<div class='card-body'>"+
                             "<div class='action-btns'>" +
                               "<center>" + "<span>" +                         
                                    "<i class='material-icons'>" + "share" + "</i>" +"<span class='val'>" +  "View" + "</span>" +
                            "</span>" + "</center>"+ 
                             "</div>" +
                          "</div>" +
                          "<div class='card-footer'>"+
                               "<p id='capacidadCarga' class='post-text'>" + "<span class='ht'>" + "Capacidad de Carga" + "</span>" 
                               +"345"+"</p>" +
                               "<p id='km' class='post-text'>" + "<span class='ht'>" + "Kilometraje"+"</span>"+" 345" + "</p>"
                               +"<p id='marca' class='post-text'>" + "<span class='ht'>"+"Marca Cabezote"+"</span>"+"345"+"</p>"+
                               "<p id='numEjes' class='post-text'>" +"<span class='ht'>" +"Numero de Ejes"+"</span>"+ "345"+"</p>"+
                               "<p id='placaTrailer' class='post-text'>"+"<span class='ht'>"+"Placa Trailer"+"</span>"+ "345"+"</p>"+
                          "</div>"+
                      "</div>"+
        "</li>"

        });
    })
}

function uploadImageTruck(imagen, placa) {

    // Created a Storage Reference with root dir
    var storageRef = storage.ref();
    // Get the file from DOM
    var file = imagen;
    console.log(file);

    //dynamically set reference to the file name
    var thisRef = storageRef.child('/' + idUsuario + '/camiones/' + placa + '/' + imagen.name);

    //put request upload file to firebase storage
    thisRef.put(file).then(function (snapshot) {
        alert("File Uploaded");
        console.log('Uploaded a blob or file!');
        thisRef.getDownloadURL().then(function (url) {
            console.log(thisRef.fullPath);
            return url;
        }).catch(function (error) {

            console.log(error);
        });


    });
}