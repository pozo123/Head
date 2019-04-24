// JavaScript source code
var id_nombre_col_admin = "colaboradorNombreAdmin";
var id_nickname_col_admin = "colaboradorNicknameAdmin";
var id_email_col_admin = "colaboradorEmailAdmin";
var id_password_col_admin = "colaboradorPwdAdmin";
var id_areas_admin_checkbox_col_admin = "adminAreasCheckboxColAdmin";
var id_areas_prod_checkbox_col_admin = "prodAreasCheckboxColAdmin";
var id_areas_proy_checkbox_col_admin = "proyAreasCheckboxColAdmin";
var id_areas_compras_checkbox_col_admin = "comprasAreasCheckboxColAdmin";
var id_areas_rrhh_checkbox_col_admin = "rrhhAreasCheckboxColAdmin";
var id_lider_checkbox_col_admin = "liderCheckboxColAdmin";
var id_ie_rb_col_admin = "ieRbColAdmin";//Estos dos de la misma familia
var id_ihs_rb_col_admin = "ihsRbColAdmin";//Estos dos de la misma familia
//Si areas.proyectos then radiobuttons de esp, y ponerle status = false
//activo = true

var id_registrar_button_col_admin = "registrarColaboradorAdmin";
var id_editar_button_col_admin = "editarButtonColAdmin";

var rama_bd_personal = "personal";

$(document).ready(function(){
});

var existe_uid;

$("#" + id_email_col_admin).change(function(){
    var existe = false;
    firebase.database().ref(rama_bd_personal).once('value').then(function(snapshot){
        //Poner tooooodos los campos y llenarlos con la info AQUI
        var nombre = "";
        var nickname = "";
        snapshot.forEach(function(child_snap){
            var pers = child_snap.val();
            if(pers.email == $("#" + id_email_col_admin).val()){
                existe = true;
                existe_uid = child_snap.key;
                //Poner tooooodos los campos y llenarlos con la info AQUI
                nombre = pers.nombre;
                nickname = pers.nickname;
            }
        });
        if(existe){
            //Poner tooooodos los campos y llenarlos con la info AQUI
            $('#' + id_nombre_col_admin).val(nombre);
            $('#' + id_nickname_col_admin).val(nickname);

            $('#' + id_editar_button_col_admin).removeClass('hidden');
            $('#' + id_registrar_button_col_admin).addClass('hidden');
            document.getElementById(id_password_col_admin).disabled = true;
        } else {
            $('#' + id_editar_button_col_admin).addClass('hidden');
            $('#' + id_registrar_button_col_admin).removeClass('hidden');
            document.getElementById(id_password_col_admin).disabled = false;
        }
    });
});

$("#" + id_areas_proy_checkbox_col_admin).change(function(){
    if(this.checked){
        $('#' + id_ie_rb_col_admin).removeClass('hidden');
        $('#' + id_ihs_rb_col_admin).removeClass('hidden');
    } else {
        $('#' + id_ie_rb_col_admin).addClass('hidden');
        $('#' + id_ihs_rb_col_admin).addClass('hidden');
    }
});

$('#' + id_registrar_button_col_admin).click(function () {
    if(($('#' + id_areas_proy_checkbox_col_admin).prop('checked') && document.getElementById(id_ie_rb_col_admin).checked == false && document.getElementById(id_ihs_rb_col_admin).checked == false) || !$('#' + id_nombre_col_admin).val() || !$('#' + id_email_col_admin).val() || !$('#' + id_password_col_admin).val() || !$('#' + id_nickname_col_admin).val()){
        alert("Llena todos los campos requeridos");
    } else {
        secondaryApp.auth().createUserWithEmailAndPassword($('#' + id_email_col_admin).val(), $('#' + id_password_col_admin).val())
            .then(function (result) {
                guardaDatosPersonalAdmin(result.user);
                secondaryApp.auth().signOut();
            }
        );
    }
});

function guardaDatosPersonalAdmin(user) {
    var areas = {
        proyectos: $('#' + id_areas_proy_checkbox_col_admin).prop('checked'),
        produccion: $('#' + id_areas_prod_checkbox_col_admin).prop('checked'),
        compras: $('#' + id_areas_compras_checkbox_col_admin).prop('checked'),
        administracion: $('#' + id_areas_admin_checkbox_col_admin).prop('checked'),
        rrhh: $('#' + id_areas_rrhh_checkbox_col_admin).prop('checked'),
    }

    var persona = {
        uid: user.uid,
        nombre: $('#' + id_nombre_col_admin).val(),
        email: user.email,
        nickname: $('#' + id_nickname_col_admin).val(),
        areas: areas,
        credenciales: $('#' + id_lider_checkbox_col_admin).prop('checked') ? 2:3,
        activo: true,
    }

    if($('#' + id_areas_proy_checkbox_col_admin).prop('checked')){
        persona["status"] = false;
        if(document.getElementById(id_ie_rb_col_admin).checked){
            persona["esp"] = "ie";
        } else {
            persona["esp"] = "ihs";
        }
    }

    firebase.database().ref(rama_bd_personal + "/" + user.uid).update(persona);
    alert("¡Alta exitosa!")
}

$('#' + id_editar_button_col_admin).click(function(){
    if(($('#' + id_areas_proy_checkbox_col_admin).prop('checked') && document.getElementById(id_ie_rb_col_admin).checked == false && document.getElementById(id_ihs_rb_col_admin).checked == false) || !$('#' + id_nombre_col_admin).val() || !$('#' + id_email_col_admin).val() || !$('#' + id_nickname_col_admin).val()){
        alert("Llena todos los campos requeridos");
    } else {
        var areas = {
            proyectos: $('#' + id_areas_proy_checkbox_col_admin).prop('checked'),
            produccion: $('#' + id_areas_prod_checkbox_col_admin).prop('checked'),
            compras: $('#' + id_areas_compras_checkbox_col_admin).prop('checked'),
            administracion: $('#' + id_areas_admin_checkbox_col_admin).prop('checked'),
            rrhh: $('#' + id_areas_rrhh_checkbox_col_admin).prop('checked'),
        }

        var persona = {
            nombre: $('#' + id_nombre_col_admin).val(),
            email: user.email,
            nickname: $('#' + id_nickname_col_admin).val(),
            areas: areas,
            credenciales: $('#' + id_lider_checkbox_col_admin).prop('checked') ? 2:3,
            activo: true,
        }

        if($('#' + id_areas_proy_checkbox_col_admin).prop('checked')){
            persona["status"] = false;
            if(document.getElementById(id_ie_rb_col_admin).checked){
                persona["esp"] = "ie";
            } else {
                persona["esp"] = "ihs";
            }
        }

        firebase.database().ref(rama_bd_personal + "/" + existe_uid).update(persona);
        alert("Edición exitosa");
    }
});
