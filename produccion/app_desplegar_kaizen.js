var id_obras_ddl_desplegar_kaizen = "obrasDdlDesplegarKaizen";
var id_datatable_desplegar_kaizen = "dataTableDesplegarKaizen";
var rama_bd_personal = "personal";
var rama_bd_colaboradores_prod = "produccion/colaboradores";

var json_kaizen = {};

$(document).ready(function(){
	var select = document.getElementById(id_obras_ddl_desplegar_kaizen);
    var option = document.createElement('option');
    option.style = "display:none";
    option.text = option.value = "";
    select.appendChild(option);

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
    $(".row").remove();
	const editor = new SimpleTableCellEditor(id_datatable_desplegar_kaizen);
	editor.SetEditableClass("editMe");
	$('#' + id_datatable_desplegar_kaizen).on("cell:edited", function (element, oldValue, newValue) {  
		console.log(element);
		element.innerHTML = newValue;          
	});
	//editor.constructor(tableId, tableCellEditorParams)
	//editor.SetEditable(element, cellEditorParams)
	//editor.SetEditableClass(className, cellEditorParams)

	firebase.database().ref(rama_bd_obras_magico + "/" + $('#' + id_obras_ddl_desplegar_kaizen + " option:selected").val()).once('value').then(function(snapshot){
		json_kaizen = snapshot.val();
		var table = document.getElementById(id_datatable_desplegar_kaizen);
		snapshot.child("procesos").forEach(function(childSnap){
			var proc = childSnap.val();
			var row = document.createElement('tr');
			row.className = "row";
			row.id = "row_" + proc.clave;
			var proc_clave = document.createElement('td');
			proc_clave.innerHTML = proc.clave;
			row.appendChild(proc_clave);
			var proc_nombre = document.createElement('td');
			proc_nombre.innerHTML = proc.nombre;
			row.appendChild(proc_nombre);
			var proy_ppto = document.createElement('td');
			proy_ppto.id = "proy_ppto_" + proc.clave;
			proy_ppto.innerHTML = proc.kaizen.PROYECTOS.PPTO;
			proy_ppto.className = "editMe";
			row.appendChild(proy_ppto);
			var proy_pag = document.createElement('td');
			proy_pag.id = "proy_pag_" + proc.clave;
			proy_pag.innerHTML = proc.kaizen.PROYECTOS.PAG;
			proy_pag.className = "editMe";
			row.appendChild(proy_pag);
			var prod_sum_cuant = document.createElement('td');
			prod_sum_cuant.id = "prod_sum_cuant" + proc.clave;
			prod_sum_cuant.innerHTML = proc.kaizen.PRODUCCION.SUMINISTROS.CUANT;
			prod_sum_cuant.className = "editMe";
			row.appendChild(prod_sum_cuant);
			var prod_sum_odec = document.createElement('td');
			prod_sum_odec.id = "prod_sum_odec" + proc.clave;
			prod_sum_odec.innerHTML = proc.kaizen.PRODUCCION.SUMINISTROS.OdeC;
			prod_sum_odec.className = "editMe";
			row.appendChild(prod_sum_odec);
			var prod_sum_pag = document.createElement('td');
			prod_sum_pag.id = "prod_sum_pag" + proc.clave;
			prod_sum_pag.innerHTML = proc.kaizen.PRODUCCION.SUMINISTROS.PAG;
			prod_sum_pag.className = "editMe";
			row.appendChild(prod_sum_pag);
			var prod_cop_pre = document.createElement('td');
			prod_cop_pre.id = "prod_cop_pre" + proc.clave;
			prod_cop_pre.innerHTML = proc.kaizen.PRODUCCION.COPEO.PRE;
			prod_cop_pre.className = "editMe";
			row.appendChild(prod_cop_pre);
			var prod_cop_cop = document.createElement('td');
			prod_cop_cop.id = "prod_cop_cop" + proc.clave;
			prod_cop_cop.innerHTML = proc.kaizen.PRODUCCION.COPEO.COPEO;
			prod_cop_cop.className = "editMe";
			row.appendChild(prod_cop_cop);
			var prod_cop_pag = document.createElement('td');
			prod_cop_pag.id = "prod_cop_pag" + proc.clave;
			prod_cop_pag.innerHTML = proc.kaizen.PRODUCCION.COPEO.PAG;
			prod_cop_pag.className = "editMe";
			row.appendChild(prod_cop_pag);
			var avance_prog = document.createElement('td');
			avance_prog.id = "avance_prog" + proc.clave;
			avance_prog.innerHTML = 100 * parseFloat(proc.kaizen.PRODUCCION.COPEO.PAG) / parseFloat(proc.kaizen.PRODUCCION.COPEO.COPEO);
			avance_prog.className = "editMe";
			row.appendChild(avance_prog);
			var avance_real = document.createElement('td');
			avance_real.id = "avance_real" + proc.clave;
			avance_real.innerHTML = 100 * parseFloat(proc.kaizen.ADMINISTRACION.ESTIMACIONES.EST) / parseFloat(proc.kaizen.ADMINISTRACION.ESTIMACIONES.PPTO);
			avance_real.className = "editMe";
			row.appendChild(avance_real);
			var admin_estim_ppto = document.createElement('td');
			admin_estim_ppto.id = "admin_estim_ppto" + proc.clave;
			admin_estim_ppto.innerHTML = proc.kaizen.ADMINISTRACION.ESTIMACIONES.PPTO;
			admin_estim_ppto.className = "editMe";
			row.appendChild(admin_estim_ppto);
			var admin_estim_est = document.createElement('td');
			admin_estim_est.id = "admin_estim_est" + proc.clave;
			admin_estim_est.innerHTML = proc.kaizen.ADMINISTRACION.ESTIMACIONES.EST;
			admin_estim_est.className = "editMe";
			row.appendChild(admin_estim_est);
			var admin_estim_pag = document.createElement('td');
			admin_estim_pag.id = "admin_estim_pag" + proc.clave;
			admin_estim_pag.innerHTML = proc.kaizen.ADMINISTRACION.ESTIMACIONES.PAG;
			admin_estim_pag.className = "editMe";
			row.appendChild(admin_estim_pag);
			var admin_anticipos_ppto = document.createElement('td');
			admin_anticipos_ppto.id = "admin_anticipos_ppto" + proc.clave;
			admin_anticipos_ppto.innerHTML = proc.kaizen.ADMINISTRACION.ANTICIPOS.PPTO;
			admin_anticipos_ppto.className = "editMe";
			row.appendChild(admin_anticipos_ppto);
			var admin_anticipos_pag = document.createElement('td');
			admin_anticipos_pag.id = "admin_anticipos_pag" + proc.clave;
			admin_anticipos_pag.innerHTML = proc.kaizen.ADMINISTRACION.ANTICIPOS.PAG;
			admin_anticipos_pag.className = "editMe";
			row.appendChild(admin_anticipos_pag);
			var profit_prog = document.createElement('td');
			profit_prog.id = "profit_prog" + proc.clave;
			profit_prog.innerHTML = proc.kaizen.PROFIT.PROG;
			profit_prog.className = "editMe";
			row.appendChild(profit_prog);
			var profit_real = document.createElement('td');
			profit_real.id = "profit_real" + proc.clave;
			profit_real.innerHTML = proc.kaizen.PROFIT.REAL;
			profit_real.className = "editMe";
			row.appendChild(profit_real);
			table.appendChild(row);
		});
	});
});
