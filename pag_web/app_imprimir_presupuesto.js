var id_obra_ddl_imprimir = "DDL_obra_imp";
var id_presupuestos_ddl_imprimir = "DDL_presupuesto_imp";
var id_consecutivo_ddl_imprimir = "DDL_consecutivo_imp";
var id_imprimir_button_imprimir = "imprimir_presu";

var rama_bd_obras = "obras";

//var multiples_consecutivos = false;

$(document).ready(function() {

    var select = document.getElementById(id_obra_ddl_imprimir);
    var option = document.createElement('option');
    option.style = "display:none";
    option.text = option.value = "";
    select.appendChild(option);

    firebase.database().ref(rama_bd_obras).orderByChild('nombre').on('child_added',function(snapshot){
        
        var obra = snapshot.val();
        var option3 = document.createElement('option');
        option3.text = option3.value = obra.nombre; 
        select.appendChild(option3);

    });    
});

//Agregar esta en onChange de ddlobras
function loadDDLPresupuestosImprimir(){
    $('#' + id_presupuestos_ddl_imprimir).empty();
    var select = document.getElementById(id_presupuestos_ddl_imprimir);
    var option = document.createElement('option');
    option.style = "display:none";
    option.text = option.value = "";
    select.appendChild(option);
    firebase.database().ref(rama_bd_obras + "/" + $('#' + id_obra_ddl_imprimir + " option:selected").val() + "/presupuestos").orderByKey().on('child_added',function(snapshot){
        var presu = snapshot.key;
        var option2 = document.createElement('option');
        option2.text = option2.value = presu; 
        select.appendChild(option2);
    });

};

//Agregar esta en onChange de ddlpresupuesto
function loadDDLConsecutivosImprimir(){
    
    firebase.database().ref(rama_bd_obras + "/" + ('#' + id_obra_ddl_imprimir + " option:selected").val() + "/presupuestos" + $('#' + id_presupuestos_ddl_imprimir + " option:selected").val() + "/consecutivos").orderByKey().once('value').then(function(snapshot){
        var cons = snapshot;
        if(cons.numChildren() > 1){
            $('#' + id_consecutivo_ddl_imprimir).removeClass("hidden");
            multiples_consecutivos = true;
            var select = document.getElementById(id_consecutivo_ddl_imprimir);
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
            $('#' + id_consecutivo_ddl_imprimir).addClass("hidden");
            multiples_consecutivos = false;
        }
    })
}

$('#' + id_imprimir_button_imprimir).click(function () {
    if(multiples_consecutivos === true){
        //firebase.database().ref(rama_bd_obras + "/" + $('#' + id_obra_ddl_imprimir + " option:selected").val() + "/presupuestos/" + $('#' + id_presupuestos_ddl_imprimir + " option:selected").val() + "/consecutivos/" + $('#' + id_consecutivos_ddl_imprimir + " option:selected").val()).once('child_added').then(function(snapshot){
    //});
    } else {
        //firebase.database().ref(rama_bd_obras + "/" + $('#' + id_obra_ddl_imprimir + " option:selected").val() + "/presupuestos/" + $('#' + id_presupuestos_ddl_imprimir + " option:selected").val() + "/consecutivos/1").once('child_added').then(function(snapshot){
    //});
    }
})
