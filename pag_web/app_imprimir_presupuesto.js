var id_obra_ddl_activar = "DDL_obra";
var id_presupuestos_ddl_activar = "DDL_presupuesto";
// Esconder este a menos que se haga click en presu Y haya más de uno
//var id_consecutivo_ddl_activar = "DDL_consecutivo";
var id_activar_button_activar = "activar_button";

var rama_bd_obras = "obras";

//var multiples_consecutivos = false;

$(document).ready(function() {

    var select = document.getElementById(id_obra_ddl_activar);
    var option = document.createElement('option');
    option.style = "display:none";
    option.text = option.value = "";
    select.appendChild(option);
    //var option2 = document.createElement('option');
    //option2.text = option2.value = "Miscelaneo";
    //select.appendChild(option2);

    firebase.database().ref(rama_bd_obras).orderByChild('nombre').on('child_added',function(snapshot){
        
        var obra = snapshot.val();
        var option3 = document.createElement('option');
        option3.text = option3.value = obra.nombre; 
        select.appendChild(option3);

    });    
});

//Agregar esta en onChange de ddlobras
function loadDDLPresupuestosActivar(){
    $('#' + id_presupuestos_ddl_activar).empty();
    var select = document.getElementById(id_presupuestos_ddl_activar);
    var option = document.createElement('option');
    option.style = "display:none";
    option.text = option.value = "";
    select.appendChild(option);
    firebase.database().ref(rama_bd_obras + "/" + $('#' + id_obra_ddl_activar + " option:selected").val() + "/presupuestos").orderByKey().on('child_added',function(snapshot){
        var presu = snapshot.key;
        var option2 = document.createElement('option');
        option2.text = option2.value = presu; 
        select.appendChild(option2);
    });

};

//Agregar esta en onChange de presupuesto
/*function loadDDLConsecutivosActivar(){
    firebase.database().ref(rama_bd_obras + "/" + ('#' + id_obra_ddl_activar + " option:selected").val() + "/presupuestos" + $('#' + id_presupuestos_ddl_activar + " option:selected").val() + "/consecutivos").orderByKey().once('value',function(snapshot){
        var cons = snapshot;
        if(cons.numChildren() > 1){
            $('#' + id_consecutivo_ddl_activar).removeClass("hidden");
            multiples_consecutivos = true;
            var select = document.getElementById(id_consecutivo_ddl_activar);
            var option = document.createElement('option');
            option.style = "display:none";
            option.text = option.value = "";
            select.appendChild(option);
            cons.forEach(function(child){
                var option2 = document.createElement('option');
                option2.text = option2.value = child.key;
                select.appendChild(option2);                
            });
        }
        else{
            $('#' + id_consecutivo_ddl_activar).addClass("hidden");
            multiples_consecutivos = false;
        }
    })
}*/

$('#' + id_activar_button_activar).click(function () {
//Chance falta un orderBy?
    var activado = true;
    firebase.database().ref(rama_bd_obras + "/" + $('#' + id_obra_ddl_activar + " option:selected").val() + "/presupuestos/" + $('#' + id_presupuestos_ddl_activar + " option:selected").val() + "/contrato").set(activado);
})
