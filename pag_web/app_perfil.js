// JavaScript source code

var id_entrada_button_perfil = "button_registro_entrada";
var id_salida_button_perfil = "button_registro_salida";
var id_cambiarpassword_button_perfil = "button_cambio_contraseña";
var id_obra_ddl_perfil = "DDL_obraAsignado";
var id_presupuestos_ddl_perfil = "DDL_presupuestoAsignado";
var id_newpassword_perfil = "newpass";
var id_confirmpass_perfil = "confirm";
var id_misc_perfil = "misc";
var id_miscgroup_perfil = "misc_group";
var id_presupuestosgroup_perfil = "presAsignado_form";
var rama_bd_obras = "obras";
var rama_bd_inges = "inges";
var rama_bd_registros = "registros";


$(document).ready(function() {

    var select = document.getElementById(id_obra_ddl_perfil);
    var option = document.createElement('option');
    option.style = "display:none";
    option.text = option.value = "";
    select.appendChild(option);
    var option2 = document.createElement('option');
    option2.text = option2.value = "Miscelaneo";
    select.appendChild(option2);

    firebase.database().ref(rama_bd_obras).orderByChild('nombre').on('child_added',function(snapshot){
        
        var obra = snapshot.val();
        var option3 = document.createElement('option');
        option3.text = option3.value = obra.nombre; 
        select.appendChild(option3);

    });
});

function loadDDLPresupuestos(){
    $('#' + id_presupuestos_ddl_perfil).empty();
    var select = document.getElementById(id_presupuestos_ddl_perfil);
    var option = document.createElement('option');
    option.style = "display:none";
    option.text = option.value = "";
    select.appendChild(option);

    if($('#' + id_obra_ddl_perfil + " option:selected").val() === "Miscelaneo"){
        $('#' + id_presupuestosgroup_perfil).addClass("hidden");
        $('#' + id_miscgroup_perfil).removeClass("hidden");
    }
    else{
        $('#' + id_presupuestosgroup_perfil).removeClass("hidden");
        $('#' + id_miscgroup_perfil).addClass("hidden");
        firebase.database().ref(rama_bd_obras + "/" + $('#' + id_obra_ddl_perfil + " option:selected").val() + "/presupuestos").orderByKey().on('child_added',function(snapshot){
            var presu = snapshot.key;
            var option2 = document.createElement('option');
            option2.text = option2.value = presu; 
            select.appendChild(option2);
        });
    }
    
}

$('#' + id_entrada_button_perfil).click(function () {
    var chamba;
    if($('#' + id_obra_ddl_perfil + " option:selected").val() === "Miscelaneo"){
        chamba = $('#' + id_misc_perfil).val();
    }
    else{
        chamba = $('#' + id_presupuestos_ddl_perfil).val();
    }
    firebase.auth().onAuthStateChanged(user => {
        if(user) {
            var username = user.uid;
            firebase.database().ref(rama_bd_inges + "/" + username + "/obras/"  + $('#' + id_obra_ddl_perfil).val()).once("value").then(function(snapshot){
                
            firebase.database().ref(rama_bd_inges + "/" + username + "/status").set(true);

            var obra_trabajada = snapshot.val();
            //Si no existe registro de ese obra para este inge
            if(!obra_trabajada){
                var obra = {
                    obra: $('#'+id_obra_ddl_perfil).val(),
                }
                var presupuesto = {
                    presupuesto: chamba,
                    checkin: new Date().getTime(),
                    horas_trabajadas: 0,
                    horas_invalidas: 0,
                }
                firebase.database().ref(rama_bd_inges + "/" + username + "/obras/"  + $('#' + id_obra_ddl_perfil).val()).set(obra);
                firebase.database().ref(rama_bd_inges + "/" + username + "/obras/"  + $('#' + id_obra_ddl_perfil).val() + "/" + chamba).set(presupuesto);
            }
            else{
                firebase.database().ref(rama_bd_inges + "/" + username + "/obras/"  + $('#' + id_obra_ddl_perfil).val() + "/" + chamba).once("value").then(function(snapshot){
                    var presupuesto_trabajado = snapshot.val();

                    //Si no existe registro de ese presupuesto para este inge
                    if(!presupuesto_trabajado){
                        var presupuesto = {
                            presupuesto: chamba,
                            checkin: new Date().getTime(),
                            horas_trabajadas: 0,
                            horas_invalidas: 0,
                        }

                        firebase.database().ref(rama_bd_inges + "/" + username + "/obras/"  + $('#' + id_obra_ddl_perfil).val() + "/" + chamba).set(presupuesto);
                    }
                    else{
                        var presupuesto = {
                            presupuesto: chamba,
                            checkin: new Date().getTime(),
                            horas_trabajadas: presupuesto_trabajado.horas_trabajadas,
                            horas_invalidas: presupuesto_trabajado.horas_invalidas, 
                        }
                        firebase.database().ref(rama_bd_inges + "/" + username + "/obras/"  + $('#' + id_obra_ddl_perfil).val() + "/" + chamba).update(presupuesto);
                    }
                });
            }
        });
        } else {
            alert("No jalo");
        }
    });
});

$('#' + id_salida_button_perfil).click(function () {
    var chamba;
    if($('#' + id_obra_ddl_perfil + " option:selected").val() === "Miscelaneo"){
        chamba = $('#' + id_misc_perfil).val();
    }
    else{
        chamba = $('#' + id_presupuestos_ddl_perfil).val();
    }
    firebase.auth().onAuthStateChanged(user => {
        if(user) {
            var username = user.uid;
            var horas_registro = 0;

            firebase.database().ref(rama_bd_inges + "/" + username + "/status").set(false);

            firebase.database().ref('' + rama_bd_inges + "/" + username + "/obras/"  + $('#' + id_obra_ddl_perfil).val()).once("value").then(function(snapshot){
                var obra_trabajada = snapshot.val();
                firebase.database().ref('' + rama_bd_inges + "/" + username + "/obras/"  + $('#' + id_obra_ddl_perfil).val() + "/" + chamba).once("value").then(function(snapshot){

                    var presupuesto_trabajado = snapshot.val();
                    firebase.database().ref('' + rama_bd_inges + "/" + username).once("value").then(function(snapshot){
                        var ing = snapshot.val();
                        
                        horas_registro = new Date().getTime() - presupuesto_trabajado.checkin;
                        
                        var registro = {
                            inge: ing.nombre,
                            checkin: new Date().getTime(),
                            horas: horas_registro,
                            obra: $('#' + id_obra_ddl_perfil).val(),
                            presupuesto: chamba,
                        }

                        //if(obra_trabajada == ing.proyecto_asignado){
                            var presupuesto = {
                                presupuesto: chamba,
                                checkin: 0,
                                horas_trabajadas: presupuesto_trabajado.horas_trabajadas + horas_registro,
                                horas_invalidas: presupuesto_trabajado.horas_invalidas, 
                            }
                        //}
                        //else{
                        //    var presupuesto = {
                        //        presupuesto: chamba,
                        //        checkin: 0,
                        //        horas_trabajadas: presupuesto_trabajado.horas_trabajadas,
                        //        horas_invalidas: presupuesto_trabajado.horas_invalidas + horas_registro, 
                        //    }
                        //}
                        
                        firebase.database().ref(rama_bd_inges + "/" + username + "/obras/"  + $('#' + id_obra_ddl_perfil).val() + "/" + chamba).update(presupuesto);
                        firebase.database().ref(rama_bd_registros).push(registro);

                    });
                });
                

            });
        } else {
        }
    });
});

$('#' + id_cambiarpassword_button_perfil).click(function () {
    if($('#' + id_newpassword_perfil).val() != $('#' + id_confirmpass_perfil).val())
        alert("Password doesn't match");
    else{
        var user = firebase.auth().currentUser;
        var username = user.uid;
        var newPassword = $('#' + id_newpassword_perfil).val();
        user.updatePassword(newPassword).then(function(){
            firebase.database().ref(rama_bd_inges + "/" + username + "/password").setValue(newPassword);
            alert("Cambio exitoso");
        }).catch(function(error){
            alert(error);
        });
    }

});
