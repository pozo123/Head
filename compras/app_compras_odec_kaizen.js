var id_obra_ddl_odec_kaizen = "obraDdlOdeC";
var id_group_proc_odec_kaizen = "groupProcOdec"
var id_proc_ddl_odec_kaizen = "procDdlOdeC";//TIENEN QUE IR HIDDEN
var id_group_subp_odec_kaizen = "groupSubpOdec"
var id_subp_ddl_odec_kaizen = "subpDdlOdeC";//TIENEN QUE IR HIDDEN
var id_fecha_odec_kaizen = "fechaOdeC";
var id_clave_odec_kaizen = "claveOdeC";
var id_cantidad_odec_kaizen = "cantidadOdeC";
var id_proveedor_odec_kaizen = "proveedorOdeC";
var id_actualizar_valor_odec_kaizen = "actualizarOdeC";

var tab_odec_kaizen = "tabOdeC";
var rama_bd_obras_magico = "obras";
var rama_bd_obras_compras = "compras/obras";
var caso;

$('#' + tab_odec_kaizen).click(function(){
	jQuery('#' + id_fecha_odec_kaizen).datetimepicker(
        {timepicker:false, weeks:true,format:'m.d.Y'}
    );
	$('#' + id_obra_ddl_odec_kaizen).empty();
    var select = document.getElementById(id_obra_ddl_odec_kaizen);
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

$("#" + id_obra_ddl_odec_kaizen).change(function(){
	$('#' + id_proc_ddl_odec_kaizen).empty();

    firebase.database().ref(rama_bd_obras_magico + "/" + $('#' + id_obra_ddl_odec_kaizen + " option:selected").val()).once('value').then(function(snapshot){
	    var obra = snapshot.val();
	    if(obra.num_procesos == 0){
	    	$('#' + id_group_proc_odec_kaizen).addClass('hidden');
	    	caso = "obra";
	    } else {
	    	$('#' + id_group_proc_odec_kaizen).removeClass('hidden');

		    var select = document.getElementById(id_proc_ddl_odec_kaizen);
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

$("#" + id_proc_ddl_odec_kaizen).change(function(){
	$('#' + id_subp_ddl_odec_kaizen).empty();

    firebase.database().ref(rama_bd_obras_magico + "/" + $('#' + id_obra_ddl_odec_kaizen + " option:selected").val() + "/procesos/" + $('#' + id_proc_ddl_odec_kaizen + " option:selected").val()).once('value').then(function(snapshot){
	    var proc = snapshot.val();
	    if(proc.num_subprocesos == 0){
	    	$('#' + id_group_subp_odec_kaizen).addClass('hidden');
	    	caso = "proc";
	    } else {
	    	caso = "subp";
	    	$('#' + id_group_subp_odec_kaizen).removeClass('hidden');
	    	$('#' + id_subp_ddl_odec_kaizen).empty();
		    var select = document.getElementById(id_subp_ddl_odec_kaizen);
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

$('#' + id_actualizar_valor_odec_kaizen).click(function(){
	if($('#' + id_clave_odec_kaizen).val() == "" || $('#' + id_cantidad_odec_kaizen).val() == "" || $('#' + id_proveedor_odec_kaizen).val() == "" || $('#' + id_fecha_odec_kaizen).val() == "" || $('#' + id_obra_ddl_odec_kaizen + " option:selected").val() == "" || (caso != "obra" && $('#' + id_proc_ddl_odec_kaizen + " option:selected").val() == "") || (caso == "subp" && $('#' + id_subp_ddl_odec_kaizen + " option:selected").val() == "")){
		alert("Llena todos los campos requeridos");
	} else {
		var hoy = getWeek(new Date().getTime()); //hoy[0] = week, hoy[1] = year
		var odec = {
			precio_ppto: $('#' + id_cantidad_odec_kaizen).val(),
			clave: $('#' + id_clave_odec_kaizen).val(),
			precio_pag: 0,
			pagada: false,
			proveedor: $('#' + id_proveedor_odec_kaizen).val(),
			timestamps: {
				OdeC: new Date($('#' + id_fecha_odec_kaizen).val()).getTime(),
				registro_OdeC: new Date().getTime(),
				pago: "",
				registro_pago: "",
			},
		}
		var query;
		if(caso == "obra"){
			query = $('#' + id_obra_ddl_odec_kaizen + " option:selected").val();
		} else if(caso == "proc"){
			query = $('#' + id_obra_ddl_odec_kaizen + " option:selected").val() + "/procesos/" + $('#' + id_proc_ddl_odec_kaizen + " option:selected").val();
		} else if(caso == "subp"){
			query = $('#' + id_obra_ddl_odec_kaizen + " option:selected").val() + "/procesos/" + $('#' + id_proc_ddl_odec_kaizen + " option:selected").val() + "/subprocesos/" + $('#' + id_subp_ddl_odec_kaizen + " option:selected").val();
		}
		firebase.database().ref(rama_bd_obras_compras + "/" + query + "/OdeC/" + hoy[1] + "/" + hoy[0] + "/" + $('#' + id_clave_odec_kaizen).val()).set(odec);
		firebase.database().ref(rama_bd_obras_magico + "/" + query + "/kaizen/PRODUCCION/SUMINISTROS/OdeC").once('value').then(function(snapshot){
			var anterior = snapshot.val();
			var nuevo = parseFlaot(anterior) + parseFloat($('#' + id_cantidad_odec_kaizen).val());
			firebase.database().ref(rama_bd_obras_magico + "/" + query + "/kaizen/PRODUCCION/SUMINISTROS/OdeC").set(nuevo);
		});
		alert("Actualizado");
	}
});
