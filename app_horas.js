// JavaScript source code
var id_entrada = "entrada";
var id_salida = "salida";
var id_proy = "proy";
var id_registrar = "registrar";
var id_user = "inge";
var rama_bd_proys = "proys";
var rama_bd_inges = "inges";

var time = new Date();



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
    
    var username = $('#' + id_user).val();
    var nuevas_horas;
    var nuevas_horas_invalidas;
    firebase.database().ref('' + rama_bd_inges + "/" + username + "/" + $('#' + id_proy).val()).once("value").then(function(snapshot){

        var registro = snapshot.val();
        var v_horas = 0;
        var v_horas_invalidas = 0;

        if(!registro){
            if(document.getElementById(id_entrada).checked == true){
            var proyecto = {
                proyecto: $('#'+id_proy).val(),
                checkin: time.getTime(),
                horas: 0,
                horas_invalidas: 0,
            }
            }
            else if(document.getElementById(id_salida).checked == true){
                var proyecto = {
                    proyecto: $('#'+id_proy).val(),
                    checkin: 0,
                    horas: 0,
                    horas_invalidas: 0,
                }
            }
            firebase.database().ref(rama_bd_inges + "/" + username + "/" + $('#' + id_proy).val()).set(proyecto);
        }
        else{
            if(!registro.horas)
                v_horas = 0;
            else
                v_horas = registro.horas;
            if(!registro.horas_invalidas)
                v_horas_invalidas = 0;
            else
                v_horas_invalidas = registro.horas_invalidas;

            
            firebase.database().ref('' + rama_bd_inges + "/" + username).once("value").then(function(snapshot){
                var ing = snapshot.val();
                if(registro.checkin == 0 || ing.proyecto != $('#' + id_proy).val())
                    nuevas_horas = v_horas;
                else
                    nuevas_horas = v_horas + (time.getTime() - registro.checkin);

                if(registro.checkin == 0 || ing.proyecto == $('#' + id_proy).val())
                    nuevas_horas_invalidas = v_horas_invalidas;
                else
                    nuevas_horas_invalidas = v_horas_invalidas + (time.getTime() - registro.checkin);
                if(document.getElementById(id_entrada).checked == true){
                    var proyecto = {
                        proyecto: $('#'+id_proy).val(),
                        checkin: time.getTime(),
                        horas: v_horas,
                        horas_invalidas: v_horas_invalidas,
                    }
                }
                else if(document.getElementById(id_salida).checked == true){
                    var proyecto = {
                        proyecto: $('#'+id_proy).val(),
                        checkin: 0,
                        horas: nuevas_horas,
                        horas_invalidas: nuevas_horas_invalidas,
                    }
                }
            firebase.database().ref(rama_bd_inges + "/" + username + "/" + $('#' + id_proy).val()).set(proyecto);
            })
            
            
        }
        

    });
    
});
