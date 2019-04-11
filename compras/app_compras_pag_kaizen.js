var id_obra_ddl_pag_suministros_kaizen = "obraDdlPagSum";
var id_group_subp_pag_suministros_kaizen = "groupSubpPagSum"
var id_subp_ddl_pag_suministros_kaizen = "subpDdlPagSum";
var id_group_proc_pag_suministros_kaizen = "groupProcPagSum"
var id_proc_ddl_pag_suministros_kaizen = "procDdlPagSum";
var id_fecha_pag_suministros_kaizen = "fechaPagSum";
var id_odec_ddl_pag_suministros_kaizen = "clavePagSum";
var id_cantidad_pag_suministros_kaizen = "cantidadPagSum";
var id_actualizar_valor_pag_suministros_kaizen = "actualizarPagSum";

var tab_pag_suministros_kaizen = "tabPagSum";
var rama_bd_obras_magico = "obras";
var rama_bd_obras_compras = "compras/obras";
var caso;
var obra_global;

$('#' + tab_pag_suministros_kaizen).click(function(){
	$('#' + id_obra_ddl_pag_suministros_kaizen).empty();
    $('#' + id_proc_ddl_pag_suministros_kaizen).empty();
    $('#' + id_subp_ddl_pag_suministros_kaizen).empty();
    $('#' + id_group_proc_pag_suministros_kaizen).addClass('hidden');
    $('#' + id_group_subp_pag_suministros_kaizen).addClass('hidden');
	jQuery('#' + id_fecha_pag_suministros_kaizen).datetimepicker(
        {timepicker:false, weeks:true,format:'m.d.Y'}
    );
	$('#' + id_obra_ddl_pag_suministros_kaizen).empty();
    var select = document.getElementById(id_obra_ddl_pag_suministros_kaizen);
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

$("#" + id_obra_ddl_pag_suministros_kaizen).change(function(){
    $('#' + id_proc_ddl_pag_suministros_kaizen).empty();
    $('#' + id_subp_ddl_pag_suministros_kaizen).empty();
    $('#' + id_group_subp_pag_suministros_kaizen).addClass('hidden');
    firebase.database().ref(rama_bd_obras_magico + "/" + $('#' + id_obra_ddl_pag_suministros_kaizen + " option:selected").val()).once('value').then(function(snapshot){
	    var obra = snapshot.val();
	    obra_global = obra;
	    if(obra.num_procesos == 0){
	    	$('#' + id_group_proc_pag_suministros_kaizen).addClass('hidden');
	    	caso = "obra";
	    } else {
	    	$('#' + id_group_proc_pag_suministros_kaizen).removeClass('hidden');

		    var select = document.getElementById(id_proc_ddl_pag_suministros_kaizen);
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

	$('#' + id_odec_ddl_pag_suministros_kaizen).empty();
	var select2 = document.getElementById(id_odec_ddl_pag_suministros_kaizen);
	var option3 = document.createElement('option');
	option3.style = "display:none";
	option3.text = option3.value = "";
	select2.appendChild(option3);

	firebase.database().ref(rama_bd_obras_compras + "/" + $('#' + id_obra_ddl_pag_suministros_kaizen + " option:selected").val()).once('value').then(function(snapshot){
		snapshot.child('OdeC').forEach(function(yearSnap){
			yearSnap.forEach(function(weekSnap){
				weekSnap.forEach(function(odecSnap){
					var option4 = document.createElement('OPTION');
			        option4.text = odecSnap.key;
			        option4.value = yearSnap.key + "/" + weekSnap.key + "/" + odecSnap.key;
			        select.appendChild(option4);
				});
			});
		});
	});
});

$("#" + id_proc_ddl_pag_suministros_kaizen).change(function(){
    $('#' + id_subp_ddl_pag_suministros_kaizen).empty();
    firebase.database().ref(rama_bd_obras_compras + "/" + $('#' + id_obra_ddl_pag_suministros_kaizen + " option:selected").val() + "/procesos/" + $('#' + id_proc_ddl_pag_suministros_kaizen + " option:selected").val()).once('value').then(function(snapshot){
        var proc = snapshot.val();
	    if(obra_global["procesos"][snapshot.key]["num_subprocesos"] == 0){
	    	$('#' + id_group_subp_pag_suministros_kaizen).addClass('hidden');
	    	caso = "proc";

	    	$('#' + id_odec_ddl_pag_suministros_kaizen).empty();
			var select2 = document.getElementById(id_odec_ddl_pag_suministros_kaizen);
			var option3 = document.createElement('option');
			option3.style = "display:none";
			option3.text = option3.value = "";
			select2.appendChild(option3);

			snapshot.child('OdeC').forEach(function(yearSnap){
                console.log(yearSnap)
				yearSnap.forEach(function(weekSnap){
                    console.log(weekSnap)
					weekSnap.forEach(function(odecSnap){
                        console.log(odecSnap)
						var option4 = document.createElement('OPTION');
				        option4.text = odecSnap.key;
				        option4.value = yearSnap.key + "/" + weekSnap.key + "/" + odecSnap.key;
				        select2.appendChild(option4);
					});
				});
			});
	    } else {
	    	caso = "subp";
	    	$('#' + id_group_subp_pag_suministros_kaizen).removeClass('hidden');
	    	$('#' + id_subp_ddl_pag_suministros_kaizen).empty();
		    var select = document.getElementById(id_subp_ddl_pag_suministros_kaizen);
		    var option = document.createElement('option');
		    option.style = "display:none";
		    option.text = option.value = "";
		    select.appendChild(option);
		    snapshot.child('subprocesos').forEach(function(childSnap){
		    	var subp = childSnap.val();
		    	var option2 = document.createElement('OPTION');
		        option2.text = subp.key;
		        option2.value = subp.key;
		        select.appendChild(option2);

		        $('#' + id_odec_ddl_pag_suministros_kaizen).empty();
				var select2 = document.getElementById(id_odec_ddl_pag_suministros_kaizen);
				var option3 = document.createElement('option');
				option3.style = "display:none";
				option3.text = option3.value = "";
				select2.appendChild(option);

				childSnap.child('OdeC').forEach(function(yearSnap){
					yearSnap.forEach(function(weekSnap){
						weekSnap.forEach(function(odecSnap){
							var option4 = document.createElement('OPTION');
					        option4.text = odecSnap.key;
					        option4.value = yearSnap.key + "/" + weekSnap.key + "/" + odecSnap.key;
					        select2.appendChild(option4);
						});
					});
				});
		    });
	    }
    });
});

$('#' + id_actualizar_valor_pag_suministros_kaizen).click(function(){
	if($('#' + id_odec_ddl_pag_suministros_kaizen + " option:selected").val() == "" || $('#' + id_cantidad_pag_suministros_kaizen).val() == "" || $('#' + id_fecha_pag_suministros_kaizen).val() == "" || $('#' + id_obra_ddl_pag_suministros_kaizen + " option:selected").val() == "" || (caso != "obra" && $('#' + id_proc_ddl_pag_suministros_kaizen + " option:selected").val() == "") || (caso == "subp" && $('#' + id_subp_ddl_pag_suministros_kaizen + " option:selected").val() == "")){
		alert("Llena todos los campos requeridos");
	} else {
		var hoy = getWeek(new Date().getTime()); //hoy[0] = week, hoy[1] = year
		var pag_suministros = {
			precio_pag: $('#' + id_cantidad_pag_suministros_kaizen).val(),
			pagada: true,
			timestamps: {
				pago: new Date($('#' + id_fecha_pag_suministros_kaizen).val()).getTime(),
				registro_pago: new Date().getTime(),
			},
		}
		var query;
		var query_o = $('#' + id_obra_ddl_pag_suministros_kaizen + " option:selected").val();
		var query_p = $('#' + id_obra_ddl_pag_suministros_kaizen + " option:selected").val() + "/procesos/" + $('#' + id_proc_ddl_pag_suministros_kaizen + " option:selected").val();
		var query_s = $('#' + id_obra_ddl_pag_suministros_kaizen + " option:selected").val() + "/procesos/" + $('#' + id_proc_ddl_pag_suministros_kaizen + " option:selected").val() + "/subprocesos/" + $('#' + id_subp_ddl_pag_suministros_kaizen + " option:selected").val();
		sumaSumPagKaizen(query_o);
		if(caso == "obra"){
			query = query_o;
		} else if(caso == "proc"){
			query = query_p;
			sumaSumPagKaizen(query_p);
		} else if(caso == "subp"){
			query = query_s;
			sumaSumPagKaizen(query_p);
			sumaSumPagKaizen(query_s);
		}
		var string_path = $('#' + id_odec_ddl_pag_suministros_kaizen + " option:selected").val();
		var path = string_path.split("/");;
		var year = path[0];
		var week = path [1];
		var odec = (string_path).substring(path[0].length + path[1].length + 2, string_path.length);//+2 por el / entre year y week y el / entre week y odec
		firebase.database().ref(rama_bd_obras_compras + "/" + query + "/OdeC/" + year + "/" + week + "/" + odec + "/pagos").push(pag_suministros);
		firebase.database().ref(rama_bd_obras_compras + "/" + query + "/OdeC/" + year + "/" + week + "/" + odec).once('value').then(function(snapshot){
			var odec_snap = snapshot.val();
			var valor_nuevo = parseFloat(odec_snap.precio_pag) + parseFloat($('#' + id_cantidad_pag_suministros_kaizen).val());
			firebase.database().ref(rama_bd_obras_compras + "/" + query + "/OdeC/" + year + "/" + week + "/" + odec + "/precio_pag").set(valor_nuevo);
		});
		alert("Actualizado");
	}
});

function sumaSumPagKaizen(query){
	firebase.database().ref(rama_bd_obras_magico + "/" + query + "/kaizen/PRODUCCION/SUMINISTROS/PAG").once('value').then(function(snapshot){
		var anterior = snapshot.val();
		var nuevo = parseFloat(anterior) + parseFloat($('#' + id_cantidad_pag_suministros_kaizen).val());
		firebase.database().ref(rama_bd_obras_magico + "/" + query + "/kaizen/PRODUCCION/SUMINISTROS/PAG").set(nuevo);
	});
}
