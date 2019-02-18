// JavaScript source code
var id_nombre_colaborador_admin = "colaboradorNombreAdmin";
var id_nickname_colaborador_admin = "colaboradorNicknameAdmin";
var id_email_colaborador_admin = "colaboradorEmailAdmin";
var id_password_colaborador_admin = "colaboradorPwdAdmin";

var id_registrar_button_colaborador_admin = "registrarColaboradorAdmin";

var rama_bd_colaboradores_admin = "administracion/colaboradores";
var rama_bd_personal = "personal";

$(document).ready(function(){
});

$('#' + id_registrar_button_colaborador_admin).click(function () {
    if(!$('#' + id_nombre_colaborador_admin).val() || !$('#' + id_email_colaborador_admin).val() || !$('#' + id_password_colaborador_admin).val() || !$('#' + id_nickname_colaborador_admin).val()){
        alert("Llena todos los campos requeridos");
    } else {
        secondaryApp.auth().createUserWithEmailAndPassword($('#' + id_email_colaborador_admin).val(), $('#' + id_password_colaborador_admin).val())
            .then(function (result) {
                guardaDatosColAdmin(result.user);
                guardaDatosPersonalAdmin(result.user, $('#' + id_nombre_colaborador_admin).val(), $('#' + id_nickname_colaborador_admin).val());
                secondaryApp.auth().signOut();
            }, function(error){
                var errorCode = error.code;
                var errorMessage = error.message;
                if (errorCode == 'auth/email-already-in-use') {
                    firebase.database().ref(rama_bd_personal).orderByChild('email').equalTo($('#' + id_email_colaborador_admin).val()).once('value').then(function(snapshot){
                        var pers = snapshot.val();
                        guardaDatosColAdmin(pers);
                        var tru = true;
                        firebase.database().ref(rama_bd_personal + "/" + pers.uid + "/areas/administracion").set(tru);
                    });
                } else {
                    alert(errorMessage);
                }
            });
    }
});

function guardaDatosPersonalAdmin(user, nombre, nickname) {
    var areas = {
        //proyectos: true,
        //produccion: true,
        //rrhh: true,
        administracion: true,
    }

    var persona = {
        uid: user.uid,
        nombre: nombre,
        email: user.email,
        nickname: nickname,
        areas: areas,
    }

    firebase.database().ref(rama_bd_personal + "/" + user.uid).update(persona);
    alert("¡Alta exitosa!")
}

function guardaDatosColAdmin(user) {
    var colaborador = {
        uid: user.uid,
        nombre: $('#' + id_nombre_colaborador_admin).val(),
        email: user.email,
        nickname: $('#' + id_nickname_colaborador_admin).val(),
    }

    firebase.database().ref(rama_bd_colaboradores_admin + "/" + user.uid).set(colaborador);
    alert("¡Alta exitosa!")
}
