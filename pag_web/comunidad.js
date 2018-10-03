// JavaScript source code
$(document).ready(function() {

});



firebase.auth().onAuthStateChanged(user => {
    if(user) {
        $('body').removeClass("hidden");
        userPrueba = user.uid;
        firebase.database().ref('inges').orderByChild('uid').equalTo(user.uid).on("child_added", function (snapshot) {
            var user_bd = snapshot.val();
            });
    } else {
        alert("Inicia sesión para entrar a comunidad");
        window.location.reload("index.html");
        window.location.assign("index.html");
    }
});





$('body').removeClass("hidden");



$("#cerrarSesion").click((function () {
    firebase.auth().signOut().then(function() {
        // Sign-out successful.
      }).catch(function(error) {
        // An error happened.
      });
      
      location.reload();
}));

$("#button_registro_entrada").click((function () {
    $("#button_registro_entrada").addClass("hidden");
    $("#button_registro_salida").removeClass("hidden");
}));

$("#button_registro_salida").click(function () {
    $("#button_registro_salida").addClass("hidden");
    $("#button_registro_entrada").removeClass("hidden");
});
