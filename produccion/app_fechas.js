var id_obra_ddl_fechas = "obraDdlFechas";
var id_proceso_ddl_fechas = "procesoDdlFechas";
var id_fecha_inicio_fechas = "fechaInicioFechas";
var id_fecha_final_fechas = "fechaFinalFechas";
var id_actualizar_button_fechas = "fechasButton";

var rama_bd_obras_magico = "obras";
var rama_bd_obras_prod = "produccion/obras";

var f_i_obra_anterior = 0;
var f_f_obra_anterior = 0;

$('#tabFechas').click(function(){
    jQuery('#' + id_fecha_inicio_fechas).datetimepicker(
        {timepicker:false, weeks:true,format:'m.d.Y'}
    );
    jQuery('#' + id_fecha_final_fechas).datetimepicker(
        {timepicker:false, weeks:true,format:'m.d.Y'},
    );

    $('#' + id_obra_ddl_fechas).empty();
    var select = document.getElementById(id_obra_ddl_fechas);
    var option = document.createElement('option');
    option.style = "display:none";
    option.text = option.value = "";
    select.appendChild(option);

    firebase.database().ref(rama_bd_obras_magico).orderByChild('nombre').on('child_added',function(snapshot){
        var obra = snapshot.val();
        var option2 = document.createElement('OPTION');
        option2.text = obra.nombre;
        option2.value = obra.clave;
        select.appendChild(option2);
    });
});

$("#" + id_obra_ddl_fechas).change(function(){
    var obra = $('#' + id_obra_ddl_fechas + " option:selected").text();

    $('#' + id_proceso_ddl_fechas).empty();
    var select = document.getElementById(id_proceso_ddl_fechas);
    var option = document.createElement('option');
    option.style = "display:none";
    option.text = option.value = "";
    select.appendChild(option);

    firebase.database().ref(rama_bd_obras_magico + "/" + obra + "/procesos").orderByKey().on('child_added',function(snapshot){
        var proc = snapshot.val();
        var option2 = document.createElement('OPTION');
        option2.text = proc.clave;
        option2.value = proc.clave;
        select.appendChild(option2);
    });
    firebase.database().ref(rama_bd_obras_magico + "/" + obra + "/fechas").once('value').then(function(function){
	    var fechas = snapshot.val();
        f_i_obra_anterior = fechas.fecha_inicio_teorica;
        f_f_obra_anterior = fechas.fecha_final_teorica;
	    $("#" + id_fecha_inicio_fechas).datepicker("setDate", new Date(f_i_obra_anterior));
	    $("#" + id_fecha_final_fechas).datepicker("setDate", new Date(f_f_obra_anterior));
    });
});

$("#" + id_proceso_ddl_fechas).change(function(){
    var obra = $('#' + id_obra_ddl_fechas + " option:selected").text();
    var proc = $('#' + id_proceso_ddl_fechas + " option:selected").text();
    firebase.database().ref(rama_bd_obras_magico + "/" + obra + "/procesos/" + proc + "/fechas").once('value').then(function(function){
	    var fechas = snapshot.val();
	    $("#" + id_fecha_inicio_fechas).datepicker("setDate", new Date(fechas.fecha_inicio_teorica));
	    $("#" + id_fecha_final_fechas).datepicker("setDate", new Date(fechas.fecha_final_teorica));
    });
});

$('#' + id_actualizar_button_fechas).click(function(){
	var proc = $('#' + id_proceso_ddl_fechas + " option:selected").text();
	var f_i = new Date($('#' + id_fecha_inicio_fechas).val()).getTime();
	var f_f = new Date($('#' + id_fecha_final_fechas).val()).getTime();
	if(proc == ""){
		firebase.database().ref(rama_bd_obras_magico + "/" obra + "/fechas/fecha_inicio_teorica").set(f_i);
		firebase.database().ref(rama_bd_obras_magico + "/" obra + "/fechas/fecha_final_teorica").set(f_f);
		firebase.database().ref(rama_bd_obras_prod + "/" obra + "/fechas/fecha_inicio_teorica").set(f_i);
		firebase.database().ref(rama_bd_obras_prod + "/" obra + "/fechas/fecha_final_teorica").set(f_f);
	} else { 
		firebase.database().ref(rama_bd_obras_magico + "/" obra + "/procesos/" + proc + "/fechas/fecha_inicio_teorica").set(f_i);
		firebase.database().ref(rama_bd_obras_magico + "/" obra + "/procesos/" + proc + "/fechas/fecha_final_teorica").set(f_f);
		firebase.database().ref(rama_bd_obras_prod + "/" obra + "/procesos/" + proc + "/fechas/fecha_inicio_teorica").set(f_i);
		firebase.database().ref(rama_bd_obras_prod + "/" obra + "/procesos/" + proc + "/fechas/fecha_final_teorica").set(f_f);
		if(f_i < f_i_obra_anterior){
		    firebase.database().ref(rama_bd_obras_magico + "/" obra + "/fechas/fecha_inicio_teorica").set(f_i);
		    firebase.database().ref(rama_bd_obras_magico + "/" obra + "/fechas/fecha_final_teorica").set(f_f);
		    firebase.database().ref(rama_bd_obras_prod + "/" obra + "/fechas/fecha_inicio_teorica").set(f_i);
		    firebase.database().ref(rama_bd_obras_prod + "/" obra + "/fechas/fecha_final_teorica").set(f_f);
		}
		if(f_f > f_f_obra_anterior){
		    firebase.database().ref(rama_bd_obras_magico + "/" obra + "/fechas/fecha_inicio_teorica").set(f_i);
		    firebase.database().ref(rama_bd_obras_magico + "/" obra + "/fechas/fecha_final_teorica").set(f_f);
		    firebase.database().ref(rama_bd_obras_prod + "/" obra + "/fechas/fecha_inicio_teorica").set(f_i);
		    firebase.database().ref(rama_bd_obras_prod + "/" obra + "/fechas/fecha_final_teorica").set(f_f);
		}
	}
});

