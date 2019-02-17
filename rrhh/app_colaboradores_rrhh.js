// JavaScript source code
var id_nombre_colaborador_rrhh = "colaboradorNombreRRHH";
var id_nickname_colaborador_rrhh = "colaboradorNicknameRRHH";
var id_email_colaborador_rrhh = "colaboradorEmailRRHH";
var id_password_colaborador_rrhh = "colaboradorPwdRRHH";

var id_registrar_button_colaborador_rrhh = "registrarColaboradorRRHH";

var rama_bd_colaboradores_rrhh = "rrhh/colaboradores";
var rama_bd_personal = "personal";

$(document).ready(function(){
});

$('#' + id_registrar_button_colaborador_rrhh).click(function () {
    if(!$('#' + id_nombre_colaborador_rrhh).val() || !$('#' + id_email_colaborador_rrhh).val() || !$('#' + id_password_colaborador_rrhh).val() || !$('#' + id_nickname_colaborador_rrhh).val()){
        alert("Llena todos los campos requeridos");
    } else {
        secondaryApp.auth().createUserWithEmailAndPassword($('#' + id_email_colaborador_rrhh).val(), $('#' + id_password_colaborador_rrhh).val())
            .then(function (result) {
                guardaDatosColRRHH(result.user);
                guardaDatosPersonalRRHH(result.user, $('#' + id_nombre_colaborador).val(), $('#' + id_nickname_colaborador).val());
                secondaryApp.auth().signOut();
            }, function(error){
                var errorCode = error.code;
                var errorMessage = error.message;
                if (errorCode == 'auth/email-already-in-use') {
                    firebase.database().ref(rama_bd_personal).orderByChild('email').equalTo($('#' + id_email_colaborador_rrhh).val()).once('value').then(function(snapshot){
                        var pers = snapshot.val();
                        guardaDatosCol(pers.uid);
                        var tru = true;
                        firebase.database().ref(rama_bd_personal + "/" + pers.uid + "/areas/rrhh").set(tru);
                    });
                } else {
                    alert(errorMessage);
                }
            });
    }
});

function guardaDatosPersonalRRHH(user, nombre, nickname) {
    var areas = {
        //proyectos: true,
        //produccion: true,
        rrhh: true,
        //administracion: false,
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

function guardaDatosColRRHH(user) {
    var colaborador = {
        uid: user.uid,
        nombre: $('#' + id_nombre_colaborador_rrhh).val(),
        email: user.email,
        nickname: $('#' + id_nickname_colaborador_rrhh).val(),
    }

    firebase.database().ref(rama_bd_colaboradores_rrhh + "/" + user.uid).set(colaborador);
    alert("¡Alta exitosa!")
}
