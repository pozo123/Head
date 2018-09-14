// JavaScript source code
var id_nombre = "nombre";
var id_email = "email";
var id_password = "password";
var id_especialidad = "especialidad";
var id_proyecto = "proyecto";
var id_credenciales = "credenciales";
var id_uid = "uid";
var id_registrar = "registrar";
var id_imprimir = "imprimir";
var rama_bd = "inges";


$('#' + id_registrar).click((function () {

    firebase.auth().createUserWithEmailAndPassword($('#' + id_email).val(), $('#' + id_password).val())
        .then(function (result) {
            guardaDatos(result.user);
            $('#' + id_uid).val(result.user.uid);
        });

    /*Para imprimir errores, .catch en vez de .then
     * .catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            if (errorCode == 'auth/weak-password') {
                alert('The password is too weak.');
            } else {
                alert(errorMessage);
            }
            console.log(error);
            
        });*/
}));

$('#' + id_imprimir).click((function () {
    if ($('#' + id_nombre).val() != "") {
        firebase.database().ref('' + rama_bd).orderByChild('nombre').equalTo($('#' + id_nombre).val()).on("child_added", function (snapshot) {
            var user = snapshot.val();
            //console.log(user.nombre);
            $('#' + id_email).val(user.email);
            $('#' + id_password).val(user.password);
            $('#' + id_especialidad).val(user.especialidad);
            $('#' + id_proyecto).val(user.proyecto);
            $('#' + id_credenciales).val(user.credenciales);
            $('#' + id_uid).val(user.uid);
        })
    }
    else if ($('#' + id_email).val() != "") {
        firebase.database().ref('' + rama_bd).orderByChild('email').equalTo($('#' + id_email).val()).on("child_added", function (snapshot) {
            var user = snapshot.val();
            //console.log(user.nombre);
            $('#' + id_nombre).val(user.nombre);
            $('#' + id_password).val(user.password);
            $('#' + id_especialidad).val(user.especialidad);
            $('#' + id_proyecto).val(user.proyecto);
            $('#' + id_credenciales).val(user.credenciales);
            $('#' + id_uid).val(user.uid);
        })
    }
    else if ($('#' + id_uid).val() != "") {
        firebase.database().ref('' + rama_bd).orderByChild('uid').equalTo($('#' + id_uid).val()).on("child_added", function (snapshot) {
            var user = snapshot.val();
            //console.log(user.nombre);
            $('#' + id_nombre).val(user.nombre);
            $('#' + id_email).val(user.email);
            $('#' + id_password).val(user.password);
            $('#' + id_especialidad).val(user.especialidad);
            $('#' + id_proyecto).val(user.proyecto);
            $('#' + id_credenciales).val(user.credenciales);
        })
    }
}))

function guardaDatos(user) {
    var usuario = {
        uid: user.uid,
        nombre: $('#' + id_nombre).val(),
        email: user.email,
        password: $('#' + id_password).val(),
        especialidad: $('#' + id_especialidad).val(),
        proyecto: $('#' + id_proyecto).val(),
        credenciales: $('#' + id_credenciales).val()
    }
    console.log(user.displayName);
    firebase.database().ref(""+rama_bd+"/" + user.uid).set(usuario)
}