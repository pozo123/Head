$(document).ready(function() {
    firebase.auth().onAuthStateChanged(user => {
        if(user) {
            $('body').removeClass("hidden");
        } else {
            alert("Inicia sesión para entrar a comunidad");
            window.location.reload("index.html");
            window.location.assign("index.html");
        }
    });

    var divListClone = $("#ListaReqs").clone();

    $('body').removeClass("hidden");

});

$("#cerrarSesion").click((function () {
    firebase.auth().signOut().then(function() {
        // Sign-out successful.
      }).catch(function(error) {
        // An error happened.
      });
      
      location.reload();
}));
