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
 