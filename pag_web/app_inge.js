// JavaScript source code
var id_nombre_inge = "ingeNombre";
var id_email_inge = "ingeEmail";
var id_password_inge = "ingePwd";
var id_elec_checkbox_inge = "checkboxElectricidad";
var id_plom_checkbox_inge = "checkboxPlomeria";
var id_admin_radio_inge = "inlineRadio1";
var id_lider_radio_inge = "inlineRadio2";
var id_proyectoAsignado_ddl_inge = "proyectoAsignado";
var id_proyectista_radio_inge = "inlineRadio3";
var id_registrar_button_inge = "registrarIngeniero";
var rama_bd_inges = "inges";
var rama_bd_proys = "proys";

//var id_imprimir_button_inge = "imprimir";
//var id_uid_inge = "uid";

$(document).ready(function(){
    var select = document.getElementById(id_proyectoAsignado_ddl_inge);
    var option = document.createElement('option');
    option.style = "display:none";
    option.text = option.value = "";
    select.appendChild(option);
    
    firebase.database().ref(rama_bd_proys).orderByChild('nombre').on('child_added',function(snapshot){
        var proy = snapshot.val();
        var option2 = document.createElement('option');
        option2.text = option2.value = proy.nombre; 
        select.appendChild(option2);
    });
});

$('#' + id_registrar_button_inge).click((function () {
    firebase.auth().createUserWithEmailAndPassword($('#' + id_email_inge).val(), $('#' + id_password_inge).val())
        .then(function (result) {
            guardaDatos(result.user);
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

// $('#' + id_imprimir_button_inge).click((function () {
//     if ($('#' + id_nombre_inge).val() != "") {
//         firebase.database().ref('' + rama_bd_inges).orderByChild('nombre').equalTo($('#' + id_nombre_inge).val()).on("child_added", function (snapshot) {
//             var user = snapshot.val();
//             //console.log(user.nombre);
//             $('#' + id_email_inge).val(user.email);
//             $('#' + id_password_inge).val(user.password);
//             if(user.especialidad == 1)
//                 document.getElementById(id_elec_checkbox_inge).checked = true;
//             else if(user.especialidad == 2)
//                 document.getElementById(id_plom_checkbox_inge).checked = true;
//             else if(user.especialidad == 3){
//                 document.getElementById(id_elec_checkbox_inge).checked = true;
//                 document.getElementById(id_plom_checkbox_inge).checked = true;
//             }
                
//             //$('#' + id_proyectoAsignado_ddl_inge).val(user.proyecto);
            
//             if(user.credenciales == 1)
//                 document.getElementById(id_admin_radio_inge).checked = true;
//             else if(user.credenciales == 2)
//                 document.getElementById(id_lider_radio_inge).checked = true;
//             else if(user.credenciales == 3)
//                 document.getElementById(id_proyectista_radio_inge).checked = true;
                
//             $('#' + id_uid_inge).val(user.uid);
//         })
//     }
//     else if ($('#' + id_email_inge).val() != "") {
//         firebase.database().ref('' + rama_bd_inges).orderByChild('email').equalTo($('#' + id_email_inge).val()).on("child_added", function (snapshot) {
//             var user = snapshot.val();
//             //console.log(user.nombre);
//             $('#' + id_nombre_inge).val(user.nombre);
//             $('#' + id_password_inge).val(user.password);
//             if(user.especialidad == 1)
//                 document.getElementById(id_elec_checkbox_inge).checked = true;
//             else if(user.especialidad == 2)
//                 document.getElementById(id_plom_checkbox_inge).checked = true;
//             else if(user.especialidad == 3){
//                 document.getElementById(id_elec_checkbox_inge).checked = true;
//                 document.getElementById(id_plom_checkbox_inge).checked = true;
//             }
                
//             //$('#' + id_proyectoAsignado_ddl_inge).val(user.proyecto);
            
//             if(user.credenciales == 1)
//                 document.getElementById(id_admin_radio_inge).checked = true;
//             else if(user.credenciales == 2)
//                 document.getElementById(id_lider_radio_inge).checked = true;
//             else if(user.credenciales == 3)
//                 document.getElementById(id_proyectista_radio_inge).checked = true;
            
//             $('#' + id_uid_inge).val(user.uid);
//         })
//     }
//     else if ($('#' + id_uid_inge).val() != "") {
//         firebase.database().ref('' + rama_bd_inges).orderByChild('uid').equalTo($('#' + id_uid_inge).val()).on("child_added", function (snapshot) {
//             var user = snapshot.val();
//             //console.log(user.nombre);
//             $('#' + id_nombre_inge).val(user.nombre);
//             $('#' + id_email_inge).val(user.email);
//             $('#' + id_password_inge).val(user.password);
//             if(user.especialidad == 1)
//                 document.getElementById(id_elec_checkbox_inge).checked = true;
//             else if(user.especialidad == 2)
//                 document.getElementById(id_plom_checkbox_inge).checked = true;
//             else if(user.especialidad == 3){
//                 document.getElementById(id_elec_checkbox_inge).checked = true;
//                 document.getElementById(id_plom_checkbox_inge).checked = true;
//             }
                
//             //$('#' + id_proyectoAsignado_ddl_inge).val(user.proyecto);
            
//             if(user.credenciales == 1)
//                 document.getElementById(id_admin_radio_inge).checked = true;
//             else if(user.credenciales == 2)
//                 document.getElementById(id_lider_radio_inge).checked = true;
//             else if(user.credenciales == 3)
//                 document.getElementById(id_proyectista_radio_inge).checked = true;
//         })
//     }
// }))

function guardaDatos(user) {
    var espec;
    var creden;
    if(document.getElementById(id_elec_checkbox_inge).checked == true){
        if(document.getElementById(id_plom_checkbox_inge).checked == true){
            espec = 3; //especialidad ambas
        }
        else
            espec = 1; //especialidad elec
    }
    else if(document.getElementById(id_plom_checkbox_inge).checked == true)
        espec = 2; //especialidad plom
    else espec = -1; //no ingresada

    if(document.getElementById(id_admin_radio_inge).checked == true)
        creden = 1;
    else if(document.getElementById(id_lider_radio_inge).checked == true)
        creden = 2;
    else if(document.getElementById(id_proyectista_radio_inge).checked == true)
        creden = 3;
    else creden = 4; //No ingresada
    
    var usuario = {
        uid: user.uid,
        nombre: $('#' + id_nombre_inge).val(),
        email: user.email,
        password: $('#' + id_password_inge).val(),
        especialidad: espec,
        proyecto_asignado: $('#' + id_proyectoAsignado_ddl_inge + " option:selected").val(),
        credenciales: creden,
        status: false,
        //Imagen
    }

    firebase.database().ref(rama_bd_inges+"/" + user.uid).set(usuario);
}