var id_obra_ddl_cuant_kaizen = "obraDdlCuant";

var id_group_proc_cuant_kaizen = "groupProcCuant"
var id_proc_ddl_cuant_kaizen = "procDdlCuant";//TIENEN QUE IR HIDDEN


var id_group_subp_cuant_kaizen = "groupSubpCuant"
var id_subp_ddl_cuant_kaizen = "subpDdlCuant";//TIENEN QUE IR HIDDEN


var id_valor_anterior_cuant_kaizen = "anteriorCuant";
var id_cantidad_cuant_kaizen = "cantidadCuant";
var id_valor_nuevo_cuant_kaizen = "nuevoCuant";
var id_actualizar_valor_cuant_kaizen = "actualizarCuant";

var tab_cuant_kaizen = "tabCuant";
var rama_bd_obras_magico = "obras";
var caso;

$('#' + tab_cuant_kaizen).click(function(){
	$('#' + id_obra_ddl_cuant_kaizen).empty();
    var select = document.getElementById(id_obra_ddl_cuant_kaizen);
    var option = document.createElement('option');
    option.style = "display:none";
    option.text = option.value = "";
    select.appendChild(option);

    firebase.database().ref(rama_bd_obras_magico).orderByChild('nombre').on('child_added',function(snapshot){
        var obra = snapshot.val();
        var option2 = document.createElement('OPTION');
        option2.text = obra.nombre;
        option2.value = obra.nombre;
        select.appendChild(option2);
    });
});

$("#" + id_obra_ddl_cuant_kaizen).change(function(){
	$('#' + id_proc_ddl_cuant_kaizen).empty();

    firebase.database().ref(rama_bd_obras_magico + "/" + $('#' + id_obra_ddl_cuant_kaizen + " option:selected").val()).once('value').then(function(snapshot){
	    var obra = snapshot.val();
	    $('#' + id_valor_anterior_cuant_kaizen).text("$" + formatMoney(obra.kaizen.PRODUCCION.SUMINISTROS.CUANT));
	    $('#' + id_valor_nuevo_cuant_kaizen).text(obra.kaizen.PRODUCCION.SUMINISTROS.CUANT);
	    if(obra.num_procesos == 0){
	    	$('#' + id_group_proc_cuant_kaizen).addClass('hidden');
	    	caso = "obra";
	    } else {
	    	$('#' + id_group_proc_cuant_kaizen).removeClass('hidden');

		    var select = document.getElementById(id_proc_ddl_cuant_kaizen);
		    var option = document.createElement('option');
		    option.style = "display:none";
		    option.text = option.value = "";
		    select.appendChild(option);

		    snapshot.child('procesos').forEach(function(childSnap){
		    	var proc = childSnap.val();
		    	var option2 = document.createElement('OPTION');
		        option2.text = proc.clave + " (" + proc.nombre + ")";
		        option2.value = proc.clave;
		        select.appendChild(option2);
		    });
	    }
    });
});

$("#" + id_proc_ddl_cuant_kaizen).change(function(){
	$('#' + id_subp_ddl_cuant_kaizen).empty();

    firebase.database().ref(rama_bd_obras_magico + "/" + $('#' + id_obra_ddl_cuant_kaizen + " option:selected").val() + "/procesos/" + $('#' + id_proc_ddl_cuant_kaizen + " option:selected").val()).once('value').then(function(snapshot){
	    var proc = snapshot.val();
	    $('#' + id_valor_anterior_cuant_kaizen).text("$" + formatMoney(proc.kaizen.PRODUCCION.SUMINISTROS.CUANT));
	    $('#' + id_valor_nuevo_cuant_kaizen).text(proc.kaizen.PRODUCCION.SUMINISTROS.CUANT);
	    if(proc.num_subprocesos == 0){
	    	$('#' + id_group_subp_cuant_kaizen).addClass('hidden');
	    	caso = "proc";
	    } else {
	    	caso = "subp";
	    	$('#' + id_group_subp_cuant_kaizen).removeClass('hidden');
	    	$('#' + id_subp_ddl_cuant_kaizen).empty();
		    var select = document.getElementById(id_subp_ddl_cuant_kaizen);
		    var option = document.createElement('option');
		    option.style = "display:none";
		    option.text = option.value = "";
		    select.appendChild(option);
		    snapshot.child('subprocesos').forEach(function(childSnap){
		    	var subp = childSnap.val();
		    	var option2 = document.createElement('OPTION');
		        option2.text = subp.clave + " (" + subp.nombre + ")";
		        option2.value = subp.clave;
		        select.appendChild(option2);
		    });
	    }
    });
});

$("#" + id_subp_ddl_cuant_kaizen).change(function(){
    firebase.database().ref(rama_bd_obras_magico + "/" + $('#' + id_obra_ddl_cuant_kaizen + " option:selected").val() + "/procesos/" + $('#' + id_proc_ddl_cuant_kaizen + " option:selected").val() + "/subprocesos/" + $('#' + id_subp_ddl_cuant_kaizen + " option:selected").val()).once('value').then(function(snapshot){
        var subp = snapshot.val();
	    $('#' + id_valor_anterior_cuant_kaizen).text("$" + formatMoney(subp.kaizen.PRODUCCION.SUMINISTROS.CUANT));
	    $('#' + id_valor_nuevo_cuant_kaizen).text(subp.kaizen.PRODUCCION.SUMINISTROS.CUANT);
    });
});

$('#' + id_cantidad_cuant_kaizen).change(function(){
	nuevo = parseFloat($('#' + id_valor_nuevo_cuant_kaizen).text()) + parseFloat($('#' + id_cantidad_cuant_kaizen).val());
	$('#' + id_valor_nuevo_cuant_kaizen).text(nuevo);
});

$('#' + id_actualizar_valor_cuant_kaizen).click(function(){
	nuevo = parseFloat($('#' + id_valor_nuevo_cuant_kaizen).text());
	var query;
	if(caso == "obra"){
		query = rama_bd_obras_magico + "/" + $('#' + id_obra_ddl_cuant_kaizen + " option:selected").val();
	} else if(caso == "proc"){
		query = rama_bd_obras_magico + "/" + $('#' + id_obra_ddl_cuant_kaizen + " option:selected").val() + "/procesos/" + $('#' + id_proc_ddl_cuant_kaizen + " option:selected").val();
	} else if(caso == "subp"){
		query = rama_bd_obras_magico + "/" + $('#' + id_obra_ddl_cuant_kaizen + " option:selected").val() + "/procesos/" + $('#' + id_proc_ddl_cuant_kaizen + " option:selected").val() + "/subprocesos/" + $('#' + id_subp_ddl_cuant_kaizen + " option:selected").val();
	}
	firebase.database().ref(query + "/kaizen/PRODUCCION/SUMINISTROS/CUANT").set(nuevo);
	$('#' + id_valor_anterior_cuant_kaizen).text(nuevo);
	$('#' + id_cantidad_cuant_kaizen).val("");
	alert("Actualizado");
});
