var id_obras_ddl_desplegar_kaizen = "obrasDdlDesplegarKaizen";
var id_datatable_desplegar_kaizen = "dataTableDesplegarKaizen";
var id_precio_score_desplegar_kaizen = "precioScoreDesplegarKaizen";//Nuevo!
var id_actualizar_button_kaizen = "actualizarKaizenButton";
var id_desplegar_subprocesos_button_kaizen = "desplegarSubButtonDesplegarKaizen";
var id_colapsar_subprocesos_button_kaizen = "colapsarSubButtonDesplegarKaizen";
var rama_bd_personal = "personal";
var rama_bd_colaboradores_prod = "produccion/colaboradores";

var json_kaizen = {};
var json_kaizen_obra = {};
var editable = "editMe";
var obra_clave;
var duracion_obra;

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
	$('.celda').remove();
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
		if(isNaN(parseFloat(element.newValue))){
			console.log(element.oldValue);
			document.getElementById(element.element.id).innerHTML = element.oldValue;
			alert("El valor ingresado debe ser un numero");
		} else { 
			var nV = element.newValue;
			var id_elem = element.element.id;
			var pointer = json_kaizen;
			var path = id_elem.split("_");
			var clave_elem;
			var pointer_kaiz = json_kaizen;
			var pointer_obra = json_kaizen_obra;
			var sub = false;
			var pointer_kaiz_padre;
			var clave_proc;
			if(path[0] == "sub"){
				sub = true;
				clave_proc = path[1].split("-")[0];
				var pointer_kaiz_padre = json_kaizen[clave_proc]["kaizen"];
				clave_elem = path[0] + "_" + path[1];
				if(id_elem == clave_elem + "_PROYECTOS_PAG" || id_elem == clave_elem + "_PROYECTOS_PPTO"){
					nV = parseFloat(nV) * parseFloat($('#' + id_precio_score_desplegar_kaizen).val());
					console.log("Nv: " + nV)
					document.getElementById(id_elem).innerHTML = parseFloat(nV);
				}
				var pointer_proc = json_kaizen[clave_proc]["kaizen"];
				pointer = pointer[clave_proc]["subprocesos"][path[1]]["kaizen"];
				pointer_kaiz = pointer_kaiz[clave_proc]["subprocesos"][path[1]]["kaizen"];
				for(i=2;i<path.length-1;i++){
					pointer_proc = pointer_proc[path[i]];
					pointer_obra = pointer_obra[path[i]];
					pointer = pointer[path[i]];
				}
				pointer_proc[path[path.length - 1]] = parseFloat(pointer_proc[path[path.length - 1]]) - parseFloat(element.oldValue) + parseFloat(nV);
				document.getElementById(clave_proc + id_elem.substring(clave_elem.length, id_elem.length)).innerHTML = parseFloat(document.getElementById(clave_proc + id_elem.substring(clave_elem.length, id_elem.length)).innerHTML) - parseFloat(element.oldValue) + parseFloat(nV);
			} else {
				clave_elem = path[0];
				if(id_elem == clave_elem + "_PROYECTOS_PAG" || id_elem == clave_elem + "_PROYECTOS_PPTO"){
					nV = parseFloat(nV) * parseFloat($('#' + id_precio_score_desplegar_kaizen).val());
					console.log("Nv: " + nV)
					document.getElementById(id_elem).innerHTML = parseFloat(nV);
				}
				pointer = pointer[path[0]];
				pointer = pointer["kaizen"];
				pointer_kaiz = pointer_kaiz[path[0]]["kaizen"];
				for(i=1;i<path.length-1;i++){
					pointer_obra = pointer_obra[path[i]];
					pointer = pointer[path[i]];
				}
			}
			pointer[path[path.length - 1]] = nV;
			pointer_obra[path[path.length - 1]] = parseFloat(pointer_obra[path[path.length - 1]]) - parseFloat(element.oldValue) + parseFloat(nV);
			document.getElementById(obra_clave + "_" + id_elem.substring(clave_elem.length + 1, id_elem.length)).innerHTML = parseFloat(document.getElementById(obra_clave + "_" + id_elem.substring(clave_elem.length + 1, id_elem.length)).innerHTML) - parseFloat(element.oldValue) + parseFloat(nV);
			
			if(id_elem == clave_elem + "_PRODUCCION_COPEO_PAG" || id_elem == clave_elem + "_PRODUCCION_COPEO_COPEO"){
				calculaAvance("pag",pointer_kaiz,clave_elem);
				calculaAvance("pag",json_kaizen_obra,obra_clave);
				if(sub){
					calculaAvance("pag",pointer_kaiz_padre,clave_proc);
				}
			} else if(id_elem == clave_elem + "_ADMINISTRACION_ESTIMACIONES_EST" || id_elem == clave_elem + "_ADMINISTRACION_ESTIMACIONES_PPTO"){
				calculaAvance("real",pointer_kaiz,clave_elem);	
				calculaAvance("real",json_kaizen_obra,obra_clave);
				if(sub){
					calculaAvance("real",pointer_kaiz_padre,clave_proc);	
				}
			}
			if(id_elem == clave_elem + "_PROYECTOS_PPTO" || id_elem == clave_elem + "_PRODUCCION_SUMINISTROS_CUANT" || id_elem == clave_elem + "_PRODUCCION_SUMINISTROS_OdeC" || id_elem == clave_elem + "_PRODUCCION_COPEO_PREC" || id_elem == clave_elem + "_PRODUCCION_COPEO_COPEO" || id_elem == clave_elem + "_ADMINISTRACION_ESTIMACIONES_PPTO" || id_elem == clave_elem + "_ADMINISTRACION_ANTICIPOS_PPTO"){
				console.log("1");
				if(sub){
					calculaProfit("prog", pointer_kaiz_padre, clave_proc);
				}
				calculaProfit("prog", pointer_kaiz, clave_elem);//, "datos");
				calculaProfitProgGlobal(json_kaizen_obra,obra_clave)
			} else if(id_elem == clave_elem + "_PROYECTOS_PAG" || id_elem == clave_elem + "_PRODUCCION_SUMINISTROS_PAG" || id_elem == clave_elem + "_PRODUCCION_COPEO_PAG" || id_elem == clave_elem + "_ADMINISTRACION_ESTIMACIONES_PAG" || id_elem == clave_elem + "_ADMINISTRACION_ANTICIPOS_PAG"){
				console.log("2");
				if(sub){
					calculaProfit("prog", pointer_kaiz_padre, clave_proc);
				}
				calculaProfit("real", pointer_kaiz, clave_elem);//, "datos");
				calculaProfit("real", json_kaizen_obra, obra_clave);//, "datos");
			}
		}
	});
	//editor.constructor(tableId, tableCellEditorParams)
	//editor.SetEditable(element, cellEditorParams)
	//editor.SetEditableClass(className, cellEditorParams)

    //FALTA
    //Revisar BRUTOs
	firebase.database().ref(rama_bd_obras_magico + "/" + $('#' + id_obras_ddl_desplegar_kaizen + " option:selected").val()).once('value').then(function(snapshot){
		duracion_obra = parseFloat(snapshot.val().fechas.fecha_final_teorica) - parseFloat(snapshot.val().fechas.fecha_inicio_teorica);
		json_kaizen = snapshot.val().procesos;
        json_kaizen_obra = snapshot.val().kaizen;
		obra_clave = snapshot.val().clave;
		var table = document.getElementById(id_datatable_desplegar_kaizen);
		if(snapshot.val().num_procesos == 0){
			createRow(snapshot.val(),table,"obraSimple");
		} else {
			snapshot.child("procesos").forEach(function(childSnap){
				var proc = childSnap.val();
				if(proc.num_subprocesos == 0){
					createRow(proc,table,"procSimple");
				} else {
					createRow(proc,table,"procPadre");
					childSnap.child("subprocesos").forEach(function(grandChildSnap){
						var subproc = grandChildSnap.val();
						createRow(subproc,table,"subproc");
					});
				}
			});
			createRow(snapshot.val(),table,"obra");
		}
	});
});

//proc es algo que tiene kaizen
function createRow(proc,table,tipo){
	var editClass;
	var profitProgClass = " profit_prog";
	var cl = proc.clave;
	var row = document.createElement('tr');
	row.className = "row_data";
	row.id = "row_" + cl;	
	if(tipo == "obra" || tipo == "obraSimple"){
		var titulo = document.createElement('td');
		titulo.innerHTML = "TOTAL";
		titulo.colSpan = 2;
		row.appendChild(titulo);
		profitProgClass = "";
		if(tipo == "obra"){
			editClass = "";
		} else {
			editClass = editable;
		}
	} else {
		var proc_clave = document.createElement('td');
		proc_clave.innerHTML = cl;
		row.appendChild(proc_clave);
		var proc_nombre = document.createElement('td');
		proc_nombre.innerHTML = proc.nombre;
		row.appendChild(proc_nombre);
		profitProgClass = " profit_prog";
		if(tipo == "procSimple"){
			editClass = editable;
		} else if(tipo == "procPadre"){
			editClass = "";
		} else if(tipo == "subproc"){
			cl = "sub_" + cl;
			editClass = editable;
			row.className = "row_data subproc_row hidden";
		}
	}

	var proy_ppto = document.createElement('td');
	proy_ppto.id = cl + "_PROYECTOS_PPTO";
	proy_ppto.innerHTML = proc.kaizen.PROYECTOS.PPTO;
	proy_ppto.className = "celda " + editClass;
	row.appendChild(proy_ppto);
	var proy_pag = document.createElement('td');
	proy_pag.id = cl + "_PROYECTOS_PAG";
	proy_pag.innerHTML = proc.kaizen.PROYECTOS.PAG;
	proy_pag.className = "celda " + editClass;
	row.appendChild(proy_pag);
	var prod_sum_cuant = document.createElement('td');
	prod_sum_cuant.id = cl + "_PRODUCCION_SUMINISTROS_CUANT";
	prod_sum_cuant.innerHTML = proc.kaizen.PRODUCCION.SUMINISTROS.CUANT;
	prod_sum_cuant.className = "celda " + editClass;
	row.appendChild(prod_sum_cuant);
	var prod_sum_odec = document.createElement('td');
	prod_sum_odec.id = cl + "_PRODUCCION_SUMINISTROS_OdeC";
	prod_sum_odec.innerHTML = proc.kaizen.PRODUCCION.SUMINISTROS.OdeC;
	prod_sum_odec.className = "celda " + editClass;
	row.appendChild(prod_sum_odec);
	var prod_sum_pag = document.createElement('td');
	prod_sum_pag.id = cl + "_PRODUCCION_SUMINISTROS_PAG";
	prod_sum_pag.innerHTML = proc.kaizen.PRODUCCION.SUMINISTROS.PAG;
	prod_sum_pag.className = "celda " + editClass;
	row.appendChild(prod_sum_pag);
	var prod_cop_pre = document.createElement('td');
	prod_cop_pre.id = cl + "_PRODUCCION_COPEO_PREC";
	prod_cop_pre.innerHTML = proc.kaizen.PRODUCCION.COPEO.PREC;
	prod_cop_pre.className = "celda " + editClass;
	row.appendChild(prod_cop_pre);
	var prod_cop_cop = document.createElement('td');
	prod_cop_cop.id = cl + "_PRODUCCION_COPEO_COPEO";
	prod_cop_cop.innerHTML = proc.kaizen.PRODUCCION.COPEO.COPEO;
	prod_cop_cop.className = "celda " + editClass;
	row.appendChild(prod_cop_cop);
	var prod_cop_pag = document.createElement('td');
	prod_cop_pag.id = cl + "_PRODUCCION_COPEO_PAG";
	prod_cop_pag.innerHTML = proc.kaizen.PRODUCCION.COPEO.PAG;
	prod_cop_pag.className = "celda " + editClass;
	row.appendChild(prod_cop_pag);
	var avance_pag = document.createElement('td');
	avance_pag.id = cl + "_avance_pag";
	avance_pag.className = "celda";
	var av_p = 0;
	if(parseFloat(proc.kaizen.PRODUCCION.COPEO.COPEO) != 0){
		av_p = 100 * parseFloat(proc.kaizen.PRODUCCION.COPEO.PAG) / parseFloat(proc.kaizen.PRODUCCION.COPEO.COPEO);
	}
	avance_pag.innerHTML = (av_p).toFixed(2) + "%";
	row.appendChild(avance_pag);
	var avance_real = document.createElement('td');
	avance_real.id = cl + "_avance_real";
	avance_real.className = "celda";
	var av_r = 0;
	if(parseFloat(proc.kaizen.ADMINISTRACION.ESTIMACIONES.PPTO) != 0){
		av_r = 100 * parseFloat(proc.kaizen.ADMINISTRACION.ESTIMACIONES.EST) / parseFloat(proc.kaizen.ADMINISTRACION.ESTIMACIONES.PPTO);
	}
	avance_real.innerHTML = (av_r).toFixed(2) + "%";
	row.appendChild(avance_real);
	var admin_estim_ppto = document.createElement('td');
	admin_estim_ppto.id = cl + "_ADMINISTRACION_ESTIMACIONES_PPTO";
	admin_estim_ppto.innerHTML = proc.kaizen.ADMINISTRACION.ESTIMACIONES.PPTO;
	admin_estim_ppto.className = "celda " + editClass;
	row.appendChild(admin_estim_ppto);
	var admin_estim_est = document.createElement('td');
	admin_estim_est.id = cl + "_ADMINISTRACION_ESTIMACIONES_EST";
	admin_estim_est.innerHTML = proc.kaizen.ADMINISTRACION.ESTIMACIONES.EST;
	admin_estim_est.className = "celda " + editClass;
	row.appendChild(admin_estim_est);
	var admin_estim_pag = document.createElement('td');
	admin_estim_pag.id = cl + "_ADMINISTRACION_ESTIMACIONES_PAG";
	admin_estim_pag.innerHTML = proc.kaizen.ADMINISTRACION.ESTIMACIONES.PAG;
	admin_estim_pag.className = "celda " + editClass;
	row.appendChild(admin_estim_pag);
	var admin_anticipos_ppto = document.createElement('td');
	admin_anticipos_ppto.id = cl + "_ADMINISTRACION_ANTICIPOS_PPTO";
	admin_anticipos_ppto.innerHTML = proc.kaizen.ADMINISTRACION.ANTICIPOS.PPTO;
	admin_anticipos_ppto.className = "celda " + editClass;
	row.appendChild(admin_anticipos_ppto);
	var admin_anticipos_pag = document.createElement('td');
	admin_anticipos_pag.id = cl + "_ADMINISTRACION_ANTICIPOS_PAG";
	admin_anticipos_pag.innerHTML = proc.kaizen.ADMINISTRACION.ANTICIPOS.PAG;
	admin_anticipos_pag.className = "celda " + editClass;
	row.appendChild(admin_anticipos_pag);
	var profit_prog = document.createElement('td');
	profit_prog.id = cl + "_PROFIT_PROG_BRUTO";
	profit_prog.innerHTML = proc.kaizen.PROFIT.PROG.BRUTO;
	profit_prog.className = "celda " + profitProgClass;
	row.appendChild(profit_prog);
	var profit_real = document.createElement('td');
	profit_real.id = cl + "_PROFIT_REAL_BRUTO";
	profit_real.innerHTML = proc.kaizen.PROFIT.REAL.BRUTO;
	profit_real.className =  "celda";
	row.appendChild(profit_real);
	table.appendChild(row);
}

function calculaProfitProgGlobal(pointer_kaiz,clave_elem){
	var sum = 0;
	$('.profit_prog').each(function(){
	    sum += parseFloat(this.innerHTML);
	});
	var new_profit = sum;
	var new_profit_neto = new_profit * 0.6;
	pointer_kaiz["PROFIT"]["PROG"]["BRUTO"] = new_profit;
	pointer_kaiz["PROFIT"]["PROG"]["NETO"] = new_profit_neto;
	document.getElementById(clave_elem + "_PROFIT_PROG_BRUTO").innerHTML = (new_profit).toFixed(2);
}

function calculaProfit(tipo, pointer_kaiz, clave_elem/*, cambio*/){
	console.log("3")
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
		pointer_kaiz["PROFIT"]["PROG"]["BRUTO"] = new_profit;
		pointer_kaiz["PROFIT"]["PROG"]["NETO"] = new_profit_neto;
		document.getElementById(clave_elem + "_PROFIT_PROG_BRUTO").innerHTML = (new_profit).toFixed(2);
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
		pointer_kaiz["PROFIT"]["REAL"]["BRUTO"] = new_profit;
		document.getElementById(clave_elem + "_PROFIT_REAL_BRUTO").innerHTML = (new_profit).toFixed(2);
	}
}

function calculaAvance(tipo, pointer_kaiz, clave_elem){
	if(tipo == "pag"){
		var av_p = 0;
		if(parseFloat(pointer_kaiz["PRODUCCION"]["COPEO"]["COPEO"]) != 0){
			av_p = 100 * parseFloat(pointer_kaiz["PRODUCCION"]["COPEO"]["PAG"]) / parseFloat(pointer_kaiz["PRODUCCION"]["COPEO"]["COPEO"]);
		}
		document.getElementById(clave_elem + '_avance_pag').innerHTML = (av_p).toFixed(2) + "%";
	} else if(tipo == "real"){
		var av_r = 0;
		if(parseFloat(pointer_kaiz["ADMINISTRACION"]["ESTIMACIONES"]["PPTO"]) != 0){
			av_r = 100 * parseFloat(pointer_kaiz["ADMINISTRACION"]["ESTIMACIONES"]["EST"]) / parseFloat(pointer_kaiz["ADMINISTRACION"]["ESTIMACIONES"]["PPTO"])
		}
		document.getElementById(clave_elem + '_avance_real').innerHTML = (av_r).toFixed(2) + "%"
	}
}

$('#' + id_desplegar_subprocesos_button_kaizen).on('click', function(){
    $('.subproc_row').removeClass('hidden');
});

$('#' + id_colapsar_subprocesos_button_kaizen).on('click', function(){
    $('.subproc_row').addClass('hidden');
});
$('#' + id_actualizar_button_kaizen).click(function(){
	var utilidad_semanal = parseFloat(json_kaizen_obra["PROFIT"]["PROG"]["BRUTO"]) / (duracion_obra/604800000)
	console.log("Updating " + rama_bd_obras_magico + "/" + $('#' + id_obras_ddl_desplegar_kaizen + " option:selected").val() + "/procesos:");
	console.log(json_kaizen);
	console.log("Updating " + rama_bd_obras_magico + "/" + $('#' + id_obras_ddl_desplegar_kaizen + " option:selected").val() + "/kaizen:");
	console.log(json_kaizen_obra);
	firebase.database().ref(rama_bd_obras_magico + "/" + $('#' + id_obras_ddl_desplegar_kaizen + " option:selected").val() + "/utilidad_semanal").update(utilidad_semanal);
	firebase.database().ref(rama_bd_obras_magico + "/" + $('#' + id_obras_ddl_desplegar_kaizen + " option:selected").val() + "/procesos").update(json_kaizen);
	firebase.database().ref(rama_bd_obras_magico + "/" + $('#' + id_obras_ddl_desplegar_kaizen + " option:selected").val() + "/kaizen").update(json_kaizen_obra);
	alert("Operación exitosa");
});
//FALTA
//Falta matar todos los td dentro del tr al cambiar en ddl
