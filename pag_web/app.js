$(document).ready(function() {

    console.log("hola");

    //firebase.auth().signInWithEmailAndPassword("diego@gmail.com", "123456").catch(function(error) {
        // Handle Errors here.
        //var errorCode = error.code;
        //var errorMessage = error.message;
        // ...
      //});
});

$("#loginAceptar").click((function () {

    var email = $("#loginEmail").val();
    var password = $("#loginPassword").val();

    console.log("hola");

    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
      });

      alert(email + password);

     console.log("melapelas"); 

    firebase.auth().onAuthStateChanged(user => {
        if(user) {
            console.log("hola");
            $("#navComunidad").removeClass("hidden");
            $("#navIniciarSesion").addClass("hidden");
            $("#prueba").append(" loggeado");
            $("#formLogin").addClass("hidden");
        } else {
            $("#prueba").append(" no loggeado");
        }
    });
    
}));

$("#cerrar").click((function () {
    firebase.auth().signOut().then(function() {
        // Sign-out successful.
      }).catch(function(error) {
        // An error happened.
      });

      location.reload();

}));


$("#revisar").click((function() {

    //Handle Account Status
    firebase.auth().onAuthStateChanged(user => {
        if(user) {
            $("#prueba").append(" loggeado");
            $("#navComunidad").removeClass("hidden");
            $("#navIniciarSesion").addClass("hidden");
        } else {
            $("#prueba").append(" no loggeado");
        }
    });
}));