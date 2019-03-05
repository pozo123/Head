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


var existe = false;
$("#" + id_email_colaborador_admin).change(function(){
    existe = false;
    firebase.database().ref(rama_bd_personal).once('value').then(function(snapshot){
        var nombre = "";
        var nickname = "";
        snapshot.forEach(function(child_snap){
            var pers = child_snap.val();
            if(pers.email == $("#" + id_email_colaborador_admin).val()){
                existe = true;
                nombre = pers.nombre;
                nickname = pers.nickname;
            }
        });
        if(existe){
            $('#' + id_nombre_colaborador_admin).val(nombre);
            $('#' + id_nickname_colaborador_admin).val(nickname);
            document.getElementById(id_nombre_colaborador_admin).disabled = true;
            document.getElementById(id_nickname_colaborador_admin).disabled = true;
            document.getElementById(id_password_colaborador_admin).disabled = true;
        } else {
            if(document.getElementById(id_nombre_colaborador_admin).disabled == true){
                $('#' + id_nombre_colaborador_admin).val("");
                $('#' + id_nickname_colaborador_admin).val("");
            }
            document.getElementById(id_nombre_colaborador_admin).disabled = false;
            document.getElementById(id_nickname_colaborador_admin).disabled = false;
            document.getElementById(id_password_colaborador_admin).disabled = false;
        }
    });
});

$('#' + id_registrar_button_colaborador_admin).click(function () {
    if(!$('#' + id_nombre_colaborador_admin).val() || !$('#' + id_email_colaborador_admin).val() || (document.getElementById(id_password_colaborador_admin).disabled == false && !$('#' + id_password_colaborador_admin).val()) || !$('#' + id_nickname_colaborador_admin).val()){
        alert("Llena todos los campos requeridos");
    } else {
        if(existe){
            firebase.database().ref(rama_bd_personal).orderByChild('email').equalTo($('#' + id_email_colaborador_admin).val()).once('child_added').then(function(snapshot){
                var pers = snapshot.val();
                guardaDatosColAdmin(pers);
                var tru = true;
                firebase.database().ref(rama_bd_personal + "/" + pers.uid + "/areas/administracion").set(tru);
            });
        } else {
            secondaryApp.auth().createUserWithEmailAndPassword($('#' + id_email_colaborador_admin).val(), $('#' + id_password_colaborador_admin).val())
                .then(function (result) {
                    guardaDatosColAdmin(result.user);
                    guardaDatosPersonalAdmin(result.user, $('#' + id_nombre_colaborador_admin).val(), $('#' + id_nickname_colaborador_admin).val());
                    secondaryApp.auth().signOut();
                }
            );
        }
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
