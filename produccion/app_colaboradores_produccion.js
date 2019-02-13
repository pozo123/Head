// JavaScript source code
var id_nombre_colaborador = "colaboradorNombre";
var id_nickname_colaborador = "colaboradorNickname";
var id_email_colaborador = "colaboradorEmail";
var id_password_colaborador = "colaboradorPwd";
var id_telefono_colaborador = "colaboradorTelefono";
var id_gerente_rb_colaborador = "checkboxGerente";
var id_supervisor_rb_colaborador = "checkboxSupervisor";

var id_registrar_button_colaborador = "registrarColaborador";

var rama_bd_colaboradores = "produccion/colaboradores";
var rama_bd_personal = "personal";

$(document).ready(function(){
    $("#" + id_supervisor_rb_colaborador).prop("checked", true);
});

$('#' + id_registrar_button_colaborador).click(function () {
    if(!$('#' + id_nombre_colaborador).val() || !$('#' + id_email_colaborador).val() || !$('#' + id_password_colaborador).val() || !$('#' + id_nickname_colaborador).val()){
        alert("Llena todos los campos requeridos");
    } else {
        secondaryApp.auth().createUserWithEmailAndPassword($('#' + id_email_colaborador).val(), $('#' + id_password_colaborador).val())
            .then(function (result) {
                guardaDatosCol(result.user);
                guardaDatosPersonalProd(result.user, $('#' + id_nombre_colaborador).val(), $('#' + id_nickname_colaborador).val());
                secondaryApp.auth().signOut();
            }, function(error){
                var errorCode = error.code;
                var errorMessage = error.message;
                if (errorCode == 'auth/email-already-in-use') {
                    firebase.database().ref(rama_bd_personal).orderByChild('email').equalTo($('#' + id_email_colaborador).val()).once('value').then(function(snapshot){
                        var pers = snapshot.val();
                        guardaDatosCol(pers.uid);
                        var tru = true;
                        firebase.database().ref(rama_bd_personal + "/" + pers.uid + "/areas/produccion").set(tru);
                    });
                } else {
                    alert(errorMessage);
                }
            });
    }
});

function guardaDatosPersonalProd(user, nombre, nickname) {
    var areas = {
        //proyectos: true,
        produccion: true,
        //compras: false,
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

function guardaDatosCol(user) {
    var colaborador;
    if($('#' + id_supervisor_rb_colaborador).is(':checked')){
        colaborador = {
            uid: user.uid,
            nombre: $('#' + id_nombre_colaborador).val(),
            email: user.email,
            nickname: $('#' + id_nickname_colaborador).val(),
            tipo: "supervisor",
            obras: "",//Chance las llenamos
        }
    } else {
        colaborador = {
            uid: user.uid,
            nombre: $('#' + id_nombre_colaborador).val(),
            email: user.email,
            nickname: $('#' + id_nickname_colaborador).val(),
            tipo: "gerente",
            obras: "NA",
        }
    }

    firebase.database().ref(rama_bd_colaboradores + "/" + user.uid).set(colaborador);
    alert("¡Alta exitosa!")
}
