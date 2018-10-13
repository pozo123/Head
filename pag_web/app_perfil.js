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
var id_entradagroup_perfil = "entrada_form";
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
    loadPerfil();
    
});

function loadPerfil(){
    firebase.auth().onAuthStateChanged(user => {
        if(user) {
            var username = user.uid;
            firebase.database().ref(rama_bd_inges).orderByKey().equalTo(username).once('child_added').then(function(snapshot){
                var ing = snapshot.val();
                if(ing.status === true){
                    $('#' + id_entradagroup_perfil).addClass("hidden");
                    $('#' + id_salida_button_perfil).removeClass("hidden");
                }
                else{
                    $('#' + id_entradagroup_perfil).removeClass("hidden");
                    $('#' + id_salida_button_perfil).addClass("hidden");
                }
            });

        }
    });
} 


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
            var p = snapshot.val();
            if(p.contrato === true){
                var presu = snapshot.key;
                var option2 = document.createElement('option');
                option2.text = option2.value = presu; 
                select.appendChild(option2);
            }
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
                firebase.database().ref(rama_bd_inges + "/" + username + "/status").set(true).then(() => {
                    loadPerfil();
                });
                

                var obra_trabajada = snapshot.val();
                //Si no existe registro de ese obra para este inge
                if(!obra_trabajada){
                    var obra = {
                        obra: $('#'+id_obra_ddl_perfil).val(),
                    }
                    var presupuesto = {
                        presupuesto: chamba,
                        horas_trabajadas: 0,
                        //horas_invalidas: 0,
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
                                horas_trabajadas: 0,
                                //horas_invalidas: 0,
                            }

                            firebase.database().ref(rama_bd_inges + "/" + username + "/obras/"  + $('#' + id_obra_ddl_perfil).val() + "/" + chamba).set(presupuesto);
                        }
                        else{
                            var presupuesto = {
                                presupuesto: chamba,
                                horas_trabajadas: presupuesto_trabajado.horas_trabajadas,
                                //horas_invalidas: presupuesto_trabajado.horas_invalidas, 
                            }
                            firebase.database().ref(rama_bd_inges + "/" + username + "/obras/"  + $('#' + id_obra_ddl_perfil).val() + "/" + chamba).update(presupuesto);
                        }
                    });
                }

                firebase.database().ref(rama_bd_inges + "/" + username).once("value").then(function(snapshot){
                    var ing = snapshot.val();

                    var registro = {
                            inge: ing.nombre,
                            checkin: new Date().getTime(),
                            horas: 0,
                            obra: $('#' + id_obra_ddl_perfil).val(),
                            presupuesto: chamba,
                            status: false,
                            cu: 0
                    }
                    var ref_cu = firebase.database().ref(rama_bd_registros).push(registro);
                    var cu = ("" + ref_cu).substring(("" + ref_cu).length - 20, (""+ref_cu).length);
                    firebase.database().ref(rama_bd_registros + "/" + cu + "/cu").set(cu);

                });
            });
        } else {
        }
    });
});

$('#' + id_salida_button_perfil).click(function () {
    var clicked = true;
    firebase.auth().onAuthStateChanged(user => {
        if(user) {
            var chamba; // cambié a .text pq pide el equalsTo un strings
            if($('#' + id_obra_ddl_perfil + " option:selected").val() === "Miscelaneo"){
                chamba = $('#' + id_misc_perfil).text();
            }
            else{
                chamba = $('#' + id_presupuestos_ddl_perfil).text();
            }
            var username = user.uid;
            firebase.database().ref(rama_bd_inges + "/" + username + "/status").set(false);
            loadPerfil();
            firebase.database().ref(rama_bd_inges).orderByChild("uid").equalTo(username).once('child_added').then(function(snapshot){
                var ing = snapshot.val();
                firebase.database().ref(rama_bd_registros).orderByChild("inge").equalTo(ing.nombre).on('child_added',function(snapshot){
                    var regis = snapshot.val();
                    if(regis.status === false && clicked === true){
                        var horas_registro = new Date().getTime() - regis.checkin;
                        firebase.database().ref(rama_bd_registros + "/" + regis.cu + "/status").set(true);
                        firebase.database().ref(rama_bd_registros + "/" + regis.cu + "/horas").set(horas_registro);
                        firebase.database().ref(rama_bd_inges + "/" + username + "/obras/"  + $('#' + id_obra_ddl_perfil).val()).orderByKey().equalTo(chamba).on('child_added',function(snapshot){
                            var aux = snapshot.val();
                            horas_previas = aux.horas_trabajadas;
                            firebase.database().ref(rama_bd_inges + "/" + username + "/obras/"  + $('#' + id_obra_ddl_perfil).val() + "/" + chamba + "/horas_trabajadas").set(horas_registro + horas_previas);
                        });
                        clicked = false;
                    }
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
            firebase.database().ref(rama_bd_inges + "/" + username + "/password").set(newPassword);
            alert("Cambio exitoso");
        }).catch(function(error){
            alert(error);
        });
    }

});
