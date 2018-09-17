// JavaScript source code
var id_entrada = "entrada";
var id_salida = "salida";
var id_proys = "proys";
var id_registrar = "registrar";
var rama_bd_proys = "proys";
var rama_bd_inges = "inges";



function loadDDL(){

    var select = document.getElementById(id_proys);
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
    var proyecto = {      
        nombre: $('#' + id_nombre).val(),
        lider: $('#' + id_lider + " option:selected").val(),
        requisitos: reqs,
        asignados: asignados,
        horas: 0,        
        startedAt: new Date().toDateString(),
        startedAtTimestamp: firebase.database.ServerValue.TIMESTAMP,
    }
    firebase.database().ref("" + rama_bd_inges + "/" + $('#' + id_nombre).val()).set(proyecto)
});
