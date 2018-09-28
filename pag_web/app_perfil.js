// JavaScript source code

var id_entrada_button_perfil = "button_registro_entrada";
var id_salida_button_perfil = "button_registro_salida";
var id_cambiarpassword_button_perfil = "button_cambio_contraseña";
var id_proyecto_ddl_perfil = "DDL_proyectoAsignado";
var id_presupuestos_ddl_perfil = "DDL_presupuestoAsignado";
var id_newpassword_perfil = "newpass";
var id_confirmpass_perfil = "confirm";
var rama_bd_proys = "proys";
var rama_bd_inges = "inges";


$(document).ready(function() {

    var select = document.getElementById(id_proyecto_ddl_perfil);
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

function loadDDLPresupuestos(){
    $('#' + id_presupuestos_ddl_perfil).empty();
    var select = document.getElementById(id_presupuestos_ddl_perfil);
    var option = document.createElement('option');
    option.style = "display:none";
    option.text = option.value = "";
    select.appendChild(option);
    
    firebase.database().ref(rama_bd_proys + "/" + $('#' + id_proyecto_ddl_perfil + " option:selected").val() + "/presupuestos").orderByKey().on('child_added',function(snapshot){
        var presu = snapshot.key;
        var option2 = document.createElement('option');
        option2.text = option2.value = presu; 
        select.appendChild(option2);
    });
}

$('#' + id_entrada_button_perfil).click(function () {

    firebase.auth().onAuthStateChanged(user => {
        if(user) {
            var username = user.uid;
            firebase.database().ref('' + rama_bd_inges + "/" + username + "/proyectos/"  + $('#' + id_proyecto_ddl_perfil).val()).once("value").then(function(snapshot){
                
            firebase.database().ref(rama_bd_inges + "/" + username + "/status").set(true);

            var proyecto_trabajado = snapshot.val();

            //Si no existe registro de ese proyecto para este inge
            if(!proyecto_trabajado){
                var proyecto = {
                    proyecto: $('#'+id_proyecto_ddl_perfil).val(),
                }
                var presupuesto = {
                    presupuesto: $('#' + id_presupuestos_ddl_perfil).val(),
                    checkin: new Date().getTime(),
                    horas_trabajadas: 0,
                    horas_invalidas: 0,
                }
                firebase.database().ref(rama_bd_inges + "/" + username + "/proyectos/"  + $('#' + id_proyecto_ddl_perfil).val()).set(proyecto);
                firebase.database().ref(rama_bd_inges + "/" + username + "/proyectos/"  + $('#' + id_proyecto_ddl_perfil).val() + "/" + $('#' + id_presupuestos_ddl_perfil).val()).set(presupuesto);
            }
            else{
                firebase.database().ref('' + rama_bd_inges + "/" + username + "/proyectos/"  + $('#' + id_proyecto_ddl_perfil).val() + "/" + $('#' + id_presupuestos_ddl_perfil).val()).once("value").then(function(snapshot){

                    var presupuesto_trabajado = snapshot.val();

                    //Si no existe registro de ese presupuesto para este inge
                    if(!presupuesto_trabajado){
                        var presupuesto = {
                            presupuesto: $('#' + id_presupuestos_ddl_perfil).val(),
                            checkin: new Date().getTime(),
                            horas_trabajadas: 0,
                            horas_invalidas: 0,
                        }

                        firebase.database().ref(rama_bd_inges + "/" + username + "/proyectos/"  + $('#' + id_proyecto_ddl_perfil).val() + "/" + $('#' + id_presupuestos_ddl_perfil).val()).set(presupuesto);
                    }
                    else{
                        var presupuesto = {
                            presupuesto: $('#' + id_presupuestos_ddl_perfil).val(),
                            checkin: new Date().getTime(),
                            horas_trabajadas: presupuesto_trabajado.horas_trabajadas,
                            horas_invalidas: presupuesto_trabajado.horas_invalidas, 
                        }
                        firebase.database().ref(rama_bd_inges + "/" + username + "/proyectos/"  + $('#' + id_proyecto_ddl_perfil).val() + "/" + $('#' + id_presupuestos_ddl_perfil).val()).set(presupuesto);
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
    firebase.auth().onAuthStateChanged(user => {
        if(user) {
            var username = user.uid;
            var horas_registro = 0;

            firebase.database().ref(rama_bd_inges + "/" + username + "/status").set(false);

            firebase.database().ref('' + rama_bd_inges + "/" + username + "/proyectos/"  + $('#' + id_proyecto_ddl_perfil).val()).once("value").then(function(snapshot){

                var proyecto_trabajado = snapshot.val();
                firebase.database().ref('' + rama_bd_inges + "/" + username + "/proyectos/"  + $('#' + id_proyecto_ddl_perfil).val() + "/" + $('#' + id_presupuestos_ddl_perfil).val()).once("value").then(function(snapshot){

                    var presupuesto_trabajado = snapshot.val();
                    firebase.database().ref('' + rama_bd_inges + "/" + username).once("value").then(function(snapshot){
                        var ing = snapshot.val();
                        horas_registro = new Date().getTime() - presupuesto_trabajado.checkin;
                        var registro = {
                            checkin: presupuesto_trabajado.checkin,
                            horas: horas_registro,
                        }
                        var registro_pres = {
                            inge: ing.nombre,
                            checkin: new Date().getTime(),
                            horas: horas_registro,
                        }
                        if(proyecto_trabajado == ing.proyecto_asignado){
                            var presupuesto = {
                                presupuesto: $('#' + id_presupuestos_ddl_perfil).val(),
                                checkin: 0,
                                horas_trabajadas: presupuesto_trabajado.horas_trabajadas + horas_registro,
                                horas_invalidas: presupuesto_trabajado.horas_invalidas, 
                            }

                        }
                        else{
                            var presupuesto = {
                                presupuesto: $('#' + id_presupuestos_ddl_perfil).val(),
                                checkin: 0,
                                horas_trabajadas: presupuesto_trabajado.horas_trabajadas,
                                horas_invalidas: presupuesto_trabajado.horas_invalidas + horas_registro, 
                            }
                        }
                        
                        firebase.database().ref(rama_bd_inges + "/" + username + "/proyectos/"  + $('#' + id_proyecto_ddl_perfil).val() + "/" + $('#' + id_presupuestos_ddl_perfil).val()).set(presupuesto);
                        firebase.database().ref(rama_bd_inges + "/" + username + "/proyectos/"  + $('#' + id_proyecto_ddl_perfil).val() + "/" + $('#' + id_presupuestos_ddl_perfil).val() + "/registros").push(registro);

                    });
                });
                

            });
        } else {
            alert("No jalo");
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
