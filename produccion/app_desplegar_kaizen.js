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
	const editor = new SimpleTableCellEditor(id_datatable_desplegar_kaizen);
	editor.SetEditableClass("editMe",{
	  // method used to vali<a href="https://www.jqueryscript.net/time-clock/">date</a> new value
	  validation : null,
	  // method used to format new value
	  formatter : null,
	  // key codes
	  keys : {
	    validation: [13],
	    cancellation: [27]
	  }
	});
	editor.on("cell:edited", function (element, oldValue, newValue) {  
		console.log(element);           
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
			row.id = "row_" + proc.clave;
			var proc_clave = document.createElement('td');
			proc_clave.InnerHTML = proc.clave;
			row.appendChild(proc_clave);
			var proc_nombre = document.createElement('td');
			proc_nombre.InnerHTML = proc.nombre;
			row.appendChild(proc_nombre);
			var proy_ppto = document.createElement('td');
			proy_ppto.id = "proy_ppto_" + proc.clave;
			proy_ppto.InnerHTML = proc.kaizen.PROYECTOS.PPTO;
			proy_ppto.className("editMe");
			row.appendChild(proy_ppto);
			table.appendChild(row);
		});
	});
});
