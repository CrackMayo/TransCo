//getUserData
function userDataLogin(userId) {

    db.collection('accounts').doc(userId).get().then(snap => {
         console.log("entra");
         var nombre = snap.data().nombre;
         var cedula = snap.data().cedula;
         var celular = snap.data().celular;
         var rol = snap.data().rol;
         alert("nombre: " + nombre + " cedula: " + cedula + " celular: " + celular + " rol: " + rol);    
        });
        
 }

function change_page(idIn, idOut){
    document.getElementById(idOut).classList.add("invisible");
    document.getElementById(idIn).classList.remove("invisible");
}

 document.addEventListener('DOMContentLoaded', function(){
    var modals=document.querySelectorAll('.modal');
    M.Modal.init(modals);

    var items=document.querySelectorAll('.collapsible');
    M.Collapsible.init(items);
});

function dropdown_register(text) {
    document.getElementById("dropdown-register-text").innerHTML = text;
}

function btnLook(id, span){
    if(document.getElementById(id).type=="password"){
        document.getElementById(id).type = "text";
        document.getElementById(span).classList.add("fa-eye-slash");
        document.getElementById(span).classList.remove("fa-eye");
    }else{
        document.getElementById(id).type = "password";
        document.getElementById(span).classList.remove("fa-eye-slash");
        document.getElementById(span).classList.add("fa-eye");
    }
}