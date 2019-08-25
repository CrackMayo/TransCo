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
 document.addEventListener('DOMContentLoaded', function(){
    var modals=document.querySelectorAll('.modal');
    M.Modal.init(modals);

    var items=document.querySelectorAll('.collapsible');
    M.Collapsible.init(items);
});