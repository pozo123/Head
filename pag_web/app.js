$(document).ready(function() {

    firebase.auth().onAuthStateChanged(user => {
        if(user) {
            $("#navComunidad").removeClass("hidden");
            $("#navIniciarSesion").addClass("hidden");
            $("#formLogin").addClass("hidden");
        } else {
        }
    }); 
        
});

$("#loginAceptar").click(function () { 

    var userEmail = document.getElementById("loginEmail").value;
    var userPass = document.getElementById("loginPassword").value;

    firebase.auth().signInWithEmailAndPassword(userEmail, userPass).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...

        window.alert("Error: " + errorMessage);
    });

    firebase.auth().onAuthStateChanged(user => {
        if(user) {
            $("#navComunidad").removeClass("hidden");
            $("#navIniciarSesion").addClass("hidden");
            $("#formLogin").addClass("hidden");
        } else {
        }
    }); 
});

$("#cerrar").click((function () {
    firebase.auth().signOut().then(function() {
        // Sign-out successful.
      }).catch(function(error) {
        // An error happened.
      });

      location.reload();

}));
