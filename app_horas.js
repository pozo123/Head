// JavaScript source code
var id_entrada = "entrada";
var id_salida = "salida";
var id_proy = "proy";
var id_registrar = "registrar";
var id_user = "inge";
var rama_bd_proys = "proys";
var rama_bd_inges = "inges";

var time = new Date();

var username = $('#' + id_user).val();

function loadDDL(){

    var select = document.getElementById(id_proy);
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
}

$('#' + id_registrar).click(function () {
    
    
    var nuevas_horas;
    firebase.database().ref('' + rama_bd_inges + "/" + username + "/" + $('#' + id_proy).val()).once("value").then(function(snapshot){
        var user = snapshot.val();
        var v_horas = 0;

        if(!user){
            if(document.getElementById(id_entrada).checked == true){
            var proyecto = {
                proyecto: $('#'+id_proy).val(),
                checkin: time.getTime(),
                horas: 0,
            }
            }
            else if(document.getElementById(id_salida).checked == true){
                var proyecto = {
                    proyecto: $('#'+id_proy).val(),
                    checkin: 0,
                    horas: 0,
                }
            }
        }
        else{
            if(!user.horas)
                v_horas = 0;
            else
                v_horas = user.horas;
    
            if(user.checkin == 0)
                nuevas_horas = v_horas;
            else
                nuevas_horas = v_horas + (time.getTime() - user.checkin);
            if(document.getElementById(id_entrada).checked == true){
                var proyecto = {
                    proyecto: $('#'+id_proy).val(),
                    checkin: time.getTime(),
                    horas: v_horas
                }
            }
            else if(document.getElementById(id_salida).checked == true){
                var proyecto = {
                    proyecto: $('#'+id_proy).val(),
                    checkin: 0,
                    horas: nuevas_horas,
                }
            }
        }
        
        firebase.database().ref(rama_bd_inges + "/" + username + "/" + $('#' + id_proy).val()).set(proyecto);

    });
    
});
