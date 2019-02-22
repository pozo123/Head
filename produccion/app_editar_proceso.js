var id_obra_ddl_editar_proceso = "obraDdlEditarProceso";
var id_proceso_ddl_editar_proceso = "procesoDdlEditarProceso";
var id_subproceso_ddl_editar_proceso = "subprocesoDdlEditarProceso";
var id_nombre_editar_proceso = "nombreEditarProceso";
var id_alcance_editar_proceso = "alcanceEditarProceso";
var id_fecha_inicio_editar_proceso = "fechaInicioEditarProceso";
var id_fecha_final_editar_proceso = "fechaFinalEditarProceso";
var id_actualizar_button_editar_proceso = "buttonEditarProceso";
var id_sub_group_editar_proceso = "groupSubEditarProceso";
var id_datos_editar_proceso = "groupDatosEditarProceso";

var rama_bd_obras_magico = "obras";
var rama_bd_obras_prod = "produccion/obras";

var f_i_obra_anterior = 0;
var f_f_obra_anterior = 0;

$('#tabEditarProceso').click(function(){
    jQuery('#' + id_fecha_inicio_editar_proceso).datetimepicker(
        {timepicker:false, weeks:true,format:'m.d.Y'}
    );
    jQuery('#' + id_fecha_final_editar_proceso).datetimepicker(
        {timepicker:false, weeks:true,format:'m.d.Y'},
    );

    $('#' + id_obra_ddl_editar_proceso).empty();
    var select = document.getElementById(id_obra_ddl_editar_proceso);
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

$("#" + id_obra_ddl_editar_proceso).change(function(){
    var obra = $('#' + id_obra_ddl_editar_proceso + " option:selected").text();

    $('#' + id_proceso_ddl_editar_proceso).empty();
    var select = document.getElementById(id_proceso_ddl_editar_proceso);
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
    firebase.database().ref(rama_bd_obras_magico + "/" + obra + "/fechas").once('value').then(function(snapshot){
	    var fechas = snapshot.val();
        f_i_obra_anterior = fechas.fecha_inicio_teorica;
        f_f_obra_anterior = fechas.fecha_final_teorica;
	    $("#" + id_fecha_inicio_editar_proceso).datepicker("setDate", new Date(f_i_obra_anterior));
	    $("#" + id_fecha_final_editar_proceso).datepicker("setDate", new Date(f_f_obra_anterior));
    });
});

$("#" + id_proceso_ddl_editar_proceso).change(function(){
    var obra = $('#' + id_obra_ddl_editar_proceso + " option:selected").text();
    var proc = $('#' + id_proceso_ddl_editar_proceso + " option:selected").text();

    $('#' + id_subproceso_ddl_editar_proceso).empty();
    var select = document.getElementById(id_subproceso_ddl_editar_proceso);
    var option = document.createElement('option');
    option.style = "display:none";
    option.text = option.value = "";
    select.appendChild(option);

    firebase.database().ref(rama_bd_obras_magico + "/" + obra + "/procesos/" + proc + "/subprocesos").orderByKey().once('value').then(function(snapshot){
        var subproc = snapshot.val();
        if(subproc != null){
            $('#' + id_subproceso_ddl_editar_proceso).removeClass("hidden");
            snapshot.forEach(function(childSnap){
                var sp = childSnap.val();
                var option2 = document.createElement('OPTION');
                option2.text = sp.clave;
                option2.value = sp.clave;
                select.appendChild(option2);
            });
        } else {
            $('#' + id_subproceso_ddl_editar_proceso).addClass("hidden");
        }
    });

    firebase.database().ref(rama_bd_obras_magico + "/" + obra + "/procesos/" + proc).once('value').then(function(snapshot){
        var proc = snapshot.val();
        var nom;
        if(proc.nombre == null){
            nom = "";
        } else {
            nom = proc.nombre;
        }
        $('#' + id_nombre_editar_proceso).val(nom);
        $('#' + id_alcance_editar_proceso).val(proc.alcance);
        var fechas = proc.fechas;
        f_i_obra_anterior = fechas.fecha_inicio_teorica;
        f_f_obra_anterior = fechas.fecha_final_teorica;
        $("#" + id_fecha_inicio_editar_proceso).datepicker("setDate", new Date(f_i_obra_anterior));
        $("#" + id_fecha_final_editar_proceso).datepicker("setDate", new Date(f_f_obra_anterior));
    });
});

$("#" + id_subproceso_ddl_editar_proceso).change(function(){
    var obra = $('#' + id_obra_ddl_editar_proceso + " option:selected").text();
    var proc = $('#' + id_proceso_ddl_editar_proceso + " option:selected").text();
    var subproc = $('#' + id_subproceso_ddl_editar_proceso + " option:selected").text();

    firebase.database().ref(rama_bd_obras_magico + "/" + obra + "/procesos/" + proc + "/subprocesos/" + subproc).once('value').then(function(snapshot){
        var subproc = snapshot.val();
        var nom;
        if(subproc.nombre == null){
            nom = "";
        } else {
            nom = subproc.nombre;
        }
        $('#' + id_nombre_editar_proceso).val(nom);
        $('#' + id_alcance_editar_proceso).val(subproc.alcance);
        var fechas = subproc.fechas;
        f_i_obra_anterior = fechas.fecha_inicio_teorica;
        f_f_obra_anterior = fechas.fecha_final_teorica;
        $("#" + id_fecha_inicio_editar_proceso).datepicker("setDate", new Date(f_i_obra_anterior));
        $("#" + id_fecha_final_editar_proceso).datepicker("setDate", new Date(f_f_obra_anterior));
    });
});

$('#' + id_actualizar_button_editar_proceso).click(function(){
    var obra = $('#' + id_obra_ddl_editar_proceso + " option:selected").text();
    var proc = $('#' + id_proceso_ddl_editar_proceso + " option:selected").text();
    var f_i = new Date($('#' + id_fecha_inicio_editar_proceso).val()).getTime();
    var f_f = new Date($('#' + id_fecha_final_editar_proceso).val()).getTime();
	if(proc == ""){
        firebase.database().ref(rama_bd_obras_magico + "/" + obra + "/fechas/fecha_inicio_teorica").set(f_i);
        firebase.database().ref(rama_bd_obras_magico + "/" + obra + "/fechas/fecha_final_teorica").set(f_f);
        firebase.database().ref(rama_bd_obras_prod + "/" + obra + "/fechas/fecha_inicio_teorica").set(f_i);
        firebase.database().ref(rama_bd_obras_prod + "/" + obra + "/fechas/fecha_final_teorica").set(f_f);

        firebase.database().ref(rama_bd_obras_magico + "/" + obra + "/procesos/MISC/fechas/fecha_inicio_teorica").set(f_i);
        firebase.database().ref(rama_bd_obras_magico + "/" + obra + "/procesos/MISC/fechas/fecha_final_teorica").set(f_f);
        firebase.database().ref(rama_bd_obras_prod + "/" + obra + "/procesos/MISC/fechas/fecha_inicio_teorica").set(f_i);
        firebase.database().ref(rama_bd_obras_prod + "/" + obra + "/procesos/MISC/fechas/fecha_final_teorica").set(f_f);

	} else { 
		firebase.database().ref(rama_bd_obras_magico + "/" + obra + "/procesos/" + proc + "/fechas/fecha_inicio_teorica").set(f_i);
		firebase.database().ref(rama_bd_obras_magico + "/" + obra + "/procesos/" + proc + "/fechas/fecha_final_teorica").set(f_f);
		firebase.database().ref(rama_bd_obras_prod + "/" + obra + "/procesos/" + proc + "/fechas/fecha_inicio_teorica").set(f_i);
		firebase.database().ref(rama_bd_obras_prod + "/" + obra + "/procesos/" + proc + "/fechas/fecha_final_teorica").set(f_f);
        if(f_i < f_i_obra_anterior){
            firebase.database().ref(rama_bd_obras_magico + "/" + obra + "/fechas/fecha_inicio_teorica").set(f_i);
            firebase.database().ref(rama_bd_obras_magico + "/" + obra + "/fechas/fecha_final_teorica").set(f_f);
            firebase.database().ref(rama_bd_obras_prod + "/" + obra + "/fechas/fecha_inicio_teorica").set(f_i);
            firebase.database().ref(rama_bd_obras_prod + "/" + obra + "/fechas/fecha_final_teorica").set(f_f);
        }
        if(f_f > f_f_obra_anterior){
            firebase.database().ref(rama_bd_obras_magico + "/" + obra + "/fechas/fecha_inicio_teorica").set(f_i);
            firebase.database().ref(rama_bd_obras_magico + "/" + obra + "/fechas/fecha_final_teorica").set(f_f);
            firebase.database().ref(rama_bd_obras_prod + "/" + obra + "/fechas/fecha_inicio_teorica").set(f_i);
            firebase.database().ref(rama_bd_obras_prod + "/" + obra + "/fechas/fecha_final_teorica").set(f_f);
        }
	}
});

