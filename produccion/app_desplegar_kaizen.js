var id_obras_ddl_desplegar_kaizen = "obrasDdlDesplegarKaizen";
var id_datatable_desplegar_kaizen = "dataTableDesplegarKaizen";
var id_precio_score_desplegar_kaizen = "precioScoreDesplegarKaizen";//Nuevo!
var id_actualizar_button_kaizen = "actualizarKaizenButton";
var rama_bd_personal = "personal";
var rama_bd_colaboradores_prod = "produccion/colaboradores";

var json_kaizen = {};
var json_kaizen_obra = {};
var editable = "editMe";

$(document).ready(function(){
	var select = document.getElementById(id_obras_ddl_desplegar_kaizen);
    var option = document.createElement('option');
    option.style = "display:none";
    option.text = option.value = "";
    select.appendChild(option);
    $('#' + id_precio_score_desplegar_kaizen).val(1300);
	firebase.auth().onAuthStateChanged(function(user){
		if(user){
			username = user.uid;
			firebase.database().ref(rama_bd_personal).orderByKey().equalTo(username).once('child_added').then(function(snapshot){
				var pers = snapshot.val();
				if(pers.areas.administracion == true){
					aut = "gerente";
				} else {
					firebase.database().ref(rama_bd_colaboradores_prod).orderByKey().equalTo(username).once('child_added').then(function(snapshot){
						var col = snapshot.val();
						if(col.tipo == "supervisor"){
							snapshot.child("obras").forEach(function(childSnap){
								obra = childSnap.val();
								if(obra.activa == true){
									var option2 = document.createElement('option');
			        				option2.text = option2.value = obra.nombre; 
			        				select.appendChild(option2);
								}
								aut = "supervisor";
							});
						} else if(col.tipo == "gerente"){
							aut = "gerente";
						} else {
							aut = "nope";
							alert("Usuario sin autorización");
						}
					});
				}
				if(aut == "gerente"){
					firebase.database().ref(rama_bd_obras_magico).once('value').then(function(snapshot){
						snapshot.forEach(function(obraSnap){
							var obra = obraSnap.val();
							var option2 = document.createElement('option');
			        		option2.text = option2.value = obra.nombre; 
			        		select.appendChild(option2);
						});
					});
				}
			});
		}
	});
});

$("#" + id_obras_ddl_desplegar_kaizen).change(function(){
    $(".row_data").remove();
	const editor = new SimpleTableCellEditor(id_datatable_desplegar_kaizen);
	editor.SetEditableClass(editable);
	$('#' + id_datatable_desplegar_kaizen).on("cell:cell:onEditEnter", function (element, oldValue) {  
		var id_elem = element.element.id;
		if(id_elem.substring(id_elem.length - 14,id_elem.length) == "_PROYECTOS_PAG" || id_elem.substring(id_elem.length - 15,id_elem.length) == "_PROYECTOS_PPTO"){
			$('#' + id_elem).attr("placeholder", "Ingresa valor en horas");
		}
	});
	$('#' + id_datatable_desplegar_kaizen).on("cell:edited", function (element, oldValue, newValue) {  
        var id_elem = element.element.id;
        console.log(element.element.id);
        var pointer = json_kaizen;
        var path = id_elem.split("_");
        var clave_elem;
        var pointer_kaiz;
        var pointer_obra = json_kaizen_obra;
        if(path[0] == "sub"){
        	//Meter código para guardar en json y poner en la tabla el newValue si es subproceso
        	//Necesito conocer la clave del proceso papá 
        	clave_elem = path[0] + path[1];
        	var clave_proc = path[1].split("-")[0];
        	var pointer_proc = json_kaizen[clave_proc]["kaizen"];
        	pointer = pointer[clave_proc]["subprocesos"][path[1]]["kaizen"];
        	pointer_kaiz = pointer[clave_proc]["subprocesos"][path[1]]["kaizen"];
        	for(i=2;i<path.length-1;i++){
        		pointer_proc = pointer_proc[path[i]];
        		pointer_obra = pointer_obra[path[i]];
	            pointer = pointer[path[i]];
	        }
	        pointer_proc[path[path.length - 1]] = parsefloat(pointer_proc[path[path.length - 1]]) - parseFloat(element.oldValue) + parseFloat(element.newValue);
	        $('#' + clave_proc + id_elem.substring(clave_elem.length + 1, id_elem.length)).innerHTML = parsefloat($('#' + clave_proc + id_elem.substring(clave_elem.length + 1, id_elem.length)).innerHTML) - parseFloat(element.oldValue) + parseFloat(element.newValue);
        } else {
        	clave_elem = path[0];
	        pointer = pointer[path[0]];
	        pointer = pointer["kaizen"];
	        pointer_kaiz = pointer["kaizen"];
	        for(i=1;i<path.length-1;i++){
	        	pointer_obra = pointer_obra[path[i]];
	            pointer = pointer[path[i]];
	        }
        }
        console.log("NUEVO:");
        console.log(json_kaizen);
        if(id_elem == clave_elem + "_PROYECTOS_PAG" || id_elem == clave_elem + "_PROYECTOS_PPTO"){
        	element.innerHTML = parseFloat(newValue) * parseFloat($('#' + id_precio_score_desplegar_kaizen).val());
        	pointer[path[path.length - 1]] = parseFloat(element.newValue) * parseFloat($('#' + id_precio_score_desplegar_kaizen).val());
        } else {
	        pointer[path[path.length - 1]] = element.newValue;
			element.innerHTML = newValue;
        }
        pointer_obra[path[path.length - 1]] = parsefloat(pointer_obra[path[path.length - 1]]) - parseFloat(element.oldValue) + parseFloat(element.newValue);
        $('#' + obra_clave + id_elem.substring(clave_elem.length + 1, id_elem.length)).innerHTML = parsefloat($('#' + obra_clave + id_elem.substring(clave_elem.length + 1, id_elem.length)).innerHTML) - parseFloat(element.oldValue) + parseFloat(element.newValue);

        if(id_elem == clave_elem + "_PRODUCCION_COPEO_PAG" || id_elem == clave_elem + "_PRODUCCION_COPEO_COPEO"){
			var av_p = 0;
			if(parseFloat(pointer_kaiz["PRODUCCION"]["COPEO"]["COPEO"]) != 0){
				av_p = 100 * parseFloat(proc.kaizen.PRODUCCION.COPEO.PAG) / parseFloat(proc.kaizen.PRODUCCION.COPEO.COPEO);
			}
			$('#' + clave_elem + '_avance_prog').innerHTML = "%" + av_p;//Revisar si sí se actualiza
        } else if(id_elem == clave_elem + "_ADMINISTRACION_ESTIMACIONES_EST" || id_elem == clave_elem + "_ADMINISTRACION_ESTIMACIONES_PPTO"){
        	var av_r = 0;
        	if(parseFloat(pointer_kaiz["ADMINISTRACION"]["ESTIMACIONES"]["PPTO"]) != 0){
        	 	av_r = 100 * parseFloat(proc.kaizen.ADMINISTRACION.ESTIMACIONES.EST) / parseFloat(proc.kaizen.ADMINISTRACION.ESTIMACIONES.PPTO)
        	}
        	$('#' + clave_elem + '_avance_real').innerHTML = "%" + av_r;//Revisar si sí se actualiza
        }
        if(id_elem == clave_elem + "_PROYECTOS_PPTO" || id_elem == clave_elem + "_PRODUCCION_SUMINISTROS_CUANT" || id_elem == clave_elem + "_PRODUCCION_SUMINISTROS_OdeC" || id_elem == clave_elem + "_PRODUCCION_COPEO_PREC" || id_elem == clave_elem + "_PRODUCCION_COPEO_COPEO" || id_elem == clave_elem + "_ADMINISTRACION_ESTIMACIONES_PPTO" || id_elem == clave_elem + "_ADMINISTRACION_ANTICIPOS_PPTO"){
        	calculaProfit("prog", pointer_kaiz);//, "datos");
        } else if(id_elem == clave_elem + "_PROYECTOS_PAG" || id_elem == clave_elem + "_PRODUCCION_SUMINISTROS_PAG" || id_elem == clave_elem + "_PRODUCCION_COPEO_PAG" || id_elem == clave_elem + "_ADMINISTRACION_ESTIMACIONES_PAG" || id_elem == clave_elem + "_ADMINISTRACION_ANTICIPOS_PAG"){
        	calculaProfit("real", pointer_kaiz);//, "datos");
        }
        /*
	        pointer = pointer[path[0]];
	        pointer = pointer["kaizen"];
	        for(i=1;i<path.length-1;i++){
	            pointer = pointer[path[i]];
	        }
	        console.log("NUEVO:");
	        console.log(json_kaizen);
	        if(id_elem == path[0] + "_PROYECTOS_PAG" || id_elem == path[0] + "_PROYECTOS_PPTO"){
	        	element.innerHTML = parseFloat(newValue) * parseFloat($('#' + id_precio_score_desplegar_kaizen).val());
	        	pointer[path[path.length - 1]] = parseFloat(element.newValue) * parseFloat($('#' + id_precio_score_desplegar_kaizen).val());
	        } else {
		        pointer[path[path.length - 1]] = element.newValue;
				element.innerHTML = newValue;
	        }

	        if(id_elem == path[0] + "_PRODUCCION_COPEO_PAG" || id_elem == path[0] + "_PRODUCCION_COPEO_COPEO"){
				var av_p = 0;
				if(parseFloat(json_kaizen[path[0]]["kaizen"]["PRODUCCION"]["COPEO"]["COPEO"]) != 0){
					av_p = 100 * parseFloat(proc.kaizen.PRODUCCION.COPEO.PAG) / parseFloat(proc.kaizen.PRODUCCION.COPEO.COPEO);
				}
				$('#' + path[0] + '_avance_prog').innerHTML = "%" + av_p;//Revisar si sí se actualiza
	        } else if(id_elem == path[0] + "_ADMINISTRACION_ESTIMACIONES_EST" || id_elem == path[0] + "_ADMINISTRACION_ESTIMACIONES_PPTO"){
	        	var av_r = 0;
	        	if(parseFloat(json_kaizen[path[0]]["kaizen"]["ADMINISTRACION"]["ESTIMACIONES"]["PPTO"]) != 0){
	        	 	av_r = 100 * parseFloat(proc.kaizen.ADMINISTRACION.ESTIMACIONES.EST) / parseFloat(proc.kaizen.ADMINISTRACION.ESTIMACIONES.PPTO)
	        	}
	        	$('#' + path[0] + '_avance_real').innerHTML = "%" + av_r;//Revisar si sí se actualiza
	        }
	        if(id_elem == path[0] + "_PROYECTOS_PPTO" || id_elem == path[0] + "_PRODUCCION_SUMINISTROS_CUANT" || id_elem == path[0] + "_PRODUCCION_SUMINISTROS_OdeC" || id_elem == path[0] + "_PRODUCCION_COPEO_PREC" || id_elem == path[0] + "_PRODUCCION_COPEO_COPEO" || id_elem == path[0] + "_ADMINISTRACION_ESTIMACIONES_PPTO" || id_elem == path[0] + "_ADMINISTRACION_ANTICIPOS_PPTO"){
	        	calculaProfit("prog", path[0]);//, "datos");
	        } else if(id_elem == path[0] + "_PROYECTOS_PAG" || id_elem == path[0] + "_PRODUCCION_SUMINISTROS_PAG" || id_elem == path[0] + "_PRODUCCION_COPEO_PAG" || id_elem == path[0] + "_ADMINISTRACION_ESTIMACIONES_PAG" || id_elem == path[0] + "_ADMINISTRACION_ANTICIPOS_PAG"){
	        	calculaProfit("real", path[0]);//, "datos");
	        }/* else if(id_elem == path[0] + "_PROFIT_PROG"){
	        	calculaProfit("prog", path[0], "profit");
	        } else if(id_elem == path[0] + "_PROFIT_PAG"){
	        	calculaProfit("real", path[0], "profit");
	        }*/
	});
	//editor.constructor(tableId, tableCellEditorParams)
	//editor.SetEditable(element, cellEditorParams)
	//editor.SetEditableClass(className, cellEditorParams)

    //FALTA
    //Revisar BRUTOs
	firebase.database().ref(rama_bd_obras_magico + "/" + $('#' + id_obras_ddl_desplegar_kaizen + " option:selected").val()).once('value').then(function(snapshot){
        json_kaizen = snapshot.val().procesos;
        json_kaizen_obra = snapshot.val().kaizen;
        console.log(json_kaizen);
		var table = document.getElementById(id_datatable_desplegar_kaizen);
		snapshot.child("procesos").forEach(function(childSnap){
			var proc = childSnap.val();
			if(proc.num_subprocesos == 0){
				createRow(proc,table,"procSimple");
			} else {
				createRow(proc,table,"procPadre");
				childSnap.child("subprocesos").forEach(function(grandChildSnap){
					var subproc = grandChildSnap.val();
					//Hay que ver cómo hacer que con estos el editable sea diferente. 
					//createRow(subproc,table,"subproc");
				});
			}
		});
		createRow(snapshot.val(),table,"obra");
	});
});

//proc es algo que tiene kaizen
function createRow(proc,table,tipo){
		var editClass;
		var cl = proc.clave;
		var row = document.createElement('tr');
		row.className = "row_data";
		row.id = "row_" + cl;
		if(tipo == "obra"){
			editClass = "";
			var titulo = document.createElement('td');
			titulo.innerHTML = "TOTAL";
			titulo.colspan = 2;
			row.appendChild(titulo);
		} else {
			var proc_clave = document.createElement('td');
			proc_clave.innerHTML = cl;
			row.appendChild(proc_clave);
			var proc_nombre = document.createElement('td');
			proc_nombre.innerHTML = proc.nombre;
			row.appendChild(proc_nombre);
			if(tipo == "procSimple"){
				editClass = editable;
			} else if(tipo == "procPadre"){
				editClass = "";
			} else if(tipo == "subproc"){
				cl = "sub_" + cl;
				editClass = editable;
			}
		}

		var proy_ppto = document.createElement('td');
		proy_ppto.id = cl + "_PROYECTOS_PPTO";
		proy_ppto.innerHTML = proc.kaizen.PROYECTOS.PPTO;
		proy_ppto.className = editClass;
		row.appendChild(proy_ppto);
		var proy_pag = document.createElement('td');
		proy_pag.id = cl + "_PROYECTOS_PAG";
		proy_pag.innerHTML = proc.kaizen.PROYECTOS.PAG;
		proy_pag.className = editClass;
		row.appendChild(proy_pag);
		var prod_sum_cuant = document.createElement('td');
		prod_sum_cuant.id = cl + "_PRODUCCION_SUMINISTROS_CUANT";
		prod_sum_cuant.innerHTML = proc.kaizen.PRODUCCION.SUMINISTROS.CUANT;
		prod_sum_cuant.className = editClass;
		row.appendChild(prod_sum_cuant);
		var prod_sum_odec = document.createElement('td');
		prod_sum_odec.id = cl + "_PRODUCCION_SUMINISTROS_OdeC";
		prod_sum_odec.innerHTML = proc.kaizen.PRODUCCION.SUMINISTROS.OdeC;
		prod_sum_odec.className = editClass;
		row.appendChild(prod_sum_odec);
		var prod_sum_pag = document.createElement('td');
		prod_sum_pag.id = cl + "_PRODUCCION_SUMINISTROS_PAG";
		prod_sum_pag.innerHTML = proc.kaizen.PRODUCCION.SUMINISTROS.PAG;
		prod_sum_pag.className = editClass;
		row.appendChild(prod_sum_pag);
		var prod_cop_pre = document.createElement('td');
		prod_cop_pre.id = cl + "_PRODUCCION_COPEO_PREC";
		prod_cop_pre.innerHTML = proc.kaizen.PRODUCCION.COPEO.PREC;
		prod_cop_pre.className = editClass;
		row.appendChild(prod_cop_pre);
		var prod_cop_cop = document.createElement('td');
		prod_cop_cop.id = cl + "_PRODUCCION_COPEO_COPEO";
		prod_cop_cop.innerHTML = proc.kaizen.PRODUCCION.COPEO.COPEO;
		prod_cop_cop.className = editClass;
		row.appendChild(prod_cop_cop);
		var prod_cop_pag = document.createElement('td');
		prod_cop_pag.id = cl + "_PRODUCCION_COPEO_PAG";
		prod_cop_pag.innerHTML = proc.kaizen.PRODUCCION.COPEO.PAG;
		prod_cop_pag.className = editClass;
		row.appendChild(prod_cop_pag);
		var avance_prog = document.createElement('td');
		avance_prog.id = cl + "_avance_prog";
		var av_p = 0;
		if(parseFloat(proc.kaizen.PRODUCCION.COPEO.COPEO) != 0){
			av_p = 100 * parseFloat(proc.kaizen.PRODUCCION.COPEO.PAG) / parseFloat(proc.kaizen.PRODUCCION.COPEO.COPEO);
		}
		avance_prog.innerHTML = "%" + av_p;
		row.appendChild(avance_prog);
		var avance_real = document.createElement('td');
		avance_real.id = cl + "_avance_real";
		var av_r = 0;
		if(parseFloat(proc.kaizen.ADMINISTRACION.ESTIMACIONES.PPTO) != 0){
			av_r = 100 * parseFloat(proc.kaizen.ADMINISTRACION.ESTIMACIONES.EST) / parseFloat(proc.kaizen.ADMINISTRACION.ESTIMACIONES.PPTO);
		}
		avance_real.innerHTML = "%" + av_r;
		row.appendChild(avance_real);
		var admin_estim_ppto = document.createElement('td');
		admin_estim_ppto.id = cl + "_ADMINISTRACION_ESTIMACIONES_PPTO";
		admin_estim_ppto.innerHTML = proc.kaizen.ADMINISTRACION.ESTIMACIONES.PPTO;
		admin_estim_ppto.className = editClass;
		row.appendChild(admin_estim_ppto);
		var admin_estim_est = document.createElement('td');
		admin_estim_est.id = cl + "_ADMINISTRACION_ESTIMACIONES_EST";
		admin_estim_est.innerHTML = proc.kaizen.ADMINISTRACION.ESTIMACIONES.EST;
		admin_estim_est.className = editClass;
		row.appendChild(admin_estim_est);
		var admin_estim_pag = document.createElement('td');
		admin_estim_pag.id = cl + "_ADMINISTRACION_ESTIMACIONES_PAG";
		admin_estim_pag.innerHTML = proc.kaizen.ADMINISTRACION.ESTIMACIONES.PAG;
		admin_estim_pag.className = editClass;
		row.appendChild(admin_estim_pag);
		var admin_anticipos_ppto = document.createElement('td');
		admin_anticipos_ppto.id = cl + "_ADMINISTRACION_ANTICIPOS_PPTO";
		admin_anticipos_ppto.innerHTML = proc.kaizen.ADMINISTRACION.ANTICIPOS.PPTO;
		admin_anticipos_ppto.className = editClass;
		row.appendChild(admin_anticipos_ppto);
		var admin_anticipos_pag = document.createElement('td');
		admin_anticipos_pag.id = cl + "_ADMINISTRACION_ANTICIPOS_PAG";
		admin_anticipos_pag.innerHTML = proc.kaizen.ADMINISTRACION.ANTICIPOS.PAG;
		admin_anticipos_pag.className = editClass;
		row.appendChild(admin_anticipos_pag);
		var profit_prog = document.createElement('td');
		profit_prog.id = cl + "_PROFIT_PROG";//_BRUTO";
		profit_prog.innerHTML = proc.kaizen.PROFIT.PROG;//.BRUTO;
		profit_prog.className = editClass;
		row.appendChild(profit_prog);
		var profit_real = document.createElement('td');
		profit_real.id = cl + "_PROFIT_REAL";//_BRUTO";
		profit_real.innerHTML = proc.kaizen.PROFIT.REAL;//.BRUTO;
		profit_real.className = editClass;
		row.appendChild(profit_real);
		table.appendChild(row);
}

function calculaProfit(tipo, pointer_kaiz/*, cambio*/){
	if(tipo == "prog"){
		var proy = parseFloat(pointer_kaiz["PROYECTOS"]["PPTO"]);
		var cop;
		var sum;
		if(pointer_kaiz["PRODUCCION"]["SUMINISTROS"]["OdeC"] != 0){
			sum = parseFloat(pointer_kaiz["PRODUCCION"]["SUMINISTROS"]["OdeC"]);
		}
		else{
			sum = parseFloat(pointer_kaiz["PRODUCCION"]["SUMINISTROS"]["CUANT"]);
		}
		if(pointer_kaiz["PRODUCCION"]["COPEO"]["COPEO"] != 0){
			cop = parseFloat(pointer_kaiz["PRODUCCION"]["COPEO"]["COPEO"]);
		}
		else{
			cop = parseFloat(pointer_kaiz["PRODUCCION"]["COPEO"]["PREC"]);
		}
		var costos = proy + cop + sum;
		var venta_anticipo = parseFloat(pointer_kaiz["ADMINISTRACION"]["ANTICIPOS"]["PPTO"]);
		var venta_estimaciones = parseFloat(pointer_kaiz["ADMINISTRACION"]["ESTIMACIONES"]["PPTO"]);
		var venta =  venta_estimaciones + venta_anticipo;
		//if(cambio == "datos");{
		var new_profit = venta * 0.8 - costos;
		var new_profit_neto = new_profit * 0.6;
		pointer_kaiz["PROFIT"]["PROG"]/*["BRUTO"]*/ = new_profit;
		//pointer_kaiz["PROFIT"]["PROG"]["NETO"] = new_profit_neto;//BRUTO
		$('#' + proc + "_PROFIT_PROG"/*_BRUTO*/).innerHTML = new_profit;//Checar que sí
		/*} else if(cambio == "profit"){
			var new_venta = costos/(0.8-parseFloat(pointer_kaiz["PROFIT"]["PROG"]["BRUTO"])/100);
			var new_venta_ant = new_venta * venta_anticipo / venta;
			var new_venta_est = new_venta * venta_estimaciones / venta;
			json_kaizen["kaizen"]["ADMINISTRACION"]["ANTICIPOS"]["PPTO"]
		}*/
	} else if(tipo == "real"){
		var proy = parseFloat(pointer_kaiz["PROYECTOS"]["PAG"]);
		var sum = parseFloat(pointer_kaiz["PRODUCCION"]["SUMINISTROS"]["PAG"]);
		var cop = parseFloat(pointer_kaiz["PRODUCCION"]["COPEO"]["PAG"]);
		var venta = parseFloat(pointer_kaiz["ADMINISTRACION"]["ESTIMACIONES"]["PAG"]) + parseFloat(pointer_kaiz["ADMINISTRACION"]["ANTICIPOS"]["PAG"]);
		var new_profit = venta * 0.8 - proy - sum - cop;
		pointer_kaiz["PROFIT"]["REAL"]/*["BRUTO"]*/ = new_profit;
		$('#' + proc + "_PROFIT_PAG"/*_BRUTO*/).innerHTML = new_profit;//Checar que sí
	}
}

$('#' + id_actualizar_button_kaizen).click(function(){
	console.log("Updating " + rama_bd_obras_magico + "/" + $('#' + id_obras_ddl_desplegar_kaizen + " option:selected").val() + "/procesos:");
	console.log(json_kaizen);
	console.log("Updating " + rama_bd_obras_magico + "/" + $('#' + id_obras_ddl_desplegar_kaizen + " option:selected").val() + "/kaizen:");
	console.log(json_kaizen_obra);
	//firebase.database().ref(rama_bd_obras_magico + "/" + $('#' + id_obras_ddl_desplegar_kaizen + " option:selected").val() + "/procesos").update(json_kaizen);
	//firebase.database().ref(rama_bd_obras_magico + "/" + $('#' + id_obras_ddl_desplegar_kaizen + " option:selected").val() + "/kaizen").update(json_kaizen_obra);
});
