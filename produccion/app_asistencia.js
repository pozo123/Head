//https://datatables.net/examples/api/add_row.html
//AQUI

var id_semana_ddl_asistencia = "semanaDdlAsistencia";
var id_year_ddl_asistencia = "yearDdlAsistencia";
var id_obra_ddl_asistencia = "obraDdlAsistencia";

//var id_lista_div_asistencia = "divAsistencia";

var id_tab_asistencia = "tabAsistencia";

var rama_bd_pagos_nomina = "produccion/pagos_nomina";
var rama_bd_obras_prod = "produccion/obras";
var rama_bd_trabajadores = "produccion/trabajadores";

$('#' + id_tab_asistencia).click(function(){
	//getWeek() definido en app_funciones
	var semana_actual = getWeek(new Date().getTime())[0];
	var year_actual = getWeek(new Date().getTime())[1];

	var select = document.getElementById(id_semana_ddl_asistencia);
    for(i=semana_actual;i>0;i--){
    	var option = document.createElement('option');
	    option.text = option.value = i;
	    select.appendChild(option);
    }

    var select2 = document.getElementById(id_year_ddl_asistencia);
    for(i=year_actual;i>2017;i--){
    	var option2 = document.createElement('option');
	    option2.text = option2.value = i;
	    select2.appendChild(option2);
    }

    var select3 = document.getElementById(id_obra_ddl_asistencia);
    var option3 = document.createElement('option');
    option3.style = "display:none";
    option3.text = option3.value = "";
    select3.appendChild(option3);

	firebase.database().ref(rama_bd_obras_prod).orderByChild('nombre').on('child_added',function(snapshot){
        var obra = snapshot.val();
        var option4 = document.createElement('OPTION');
        option4.text = obra.nombre;
        option4.value = obra.nombre;
        select3.appendChild(option4);
    });
});

$("#" + id_obra_ddl_asistencia).change(function(){
    var datos_asistencia = [];
    firebase.database().ref(rama_bd_obras_prod).orderByChild("nombre").equalTo($('#' + id_obra_ddl_asistencia + " option:selected").val()).once('child_added').then(function(snapshot){
		var procesos = [""];
		var i = 1;
		snapshot.child("procesos").forEach(function(childSnapshot){
			procesos[i] = childSnapshot.val().clave;
		});

    	firebase.database().ref(rama_bd_pagos_nomina + "/" + $('#' + id_year_ddl_asistencia + " option:selected").val() + "/" + $('#' + id_semana_ddl_asistencia + " option:selected").val() + "/" + obra.nombre).once("value").then(function(snapshot){
    		if(snapshot.val().total != null){
	   	     	snapshot.forEach(function(trabajadorSnap){
	   	     		var trabajador = trabajadorSnap.val();
	   	     		var ddl_proc = document.createElement('select');
	   	     		//----JUEVES----
					var check_ju = document.createElement('input');
        			check_ju.type = "checkbox";
        			//checkbox_lunes.className = "checkbox_lunes";
        			check_ju.value = 0.2;
        			check_ju.id = "check_" + trabajador.uid + "_jueves";
        			if(trabajador.jueves.asistencia)
    					$("#check_" + trabajador.uid + "_jueves").prop("checked", true);
    				//----VIERNES----
					var check_vi = document.createElement('input');
        			check_vi.type = "checkbox";
        			//checkbox_lunes.className = "checkbox_lunes";
        			check_vi.value = 0.2;
        			check_vi.id = "check_" + trabajador.uid + "_viernes";
        			if(trabajador.viernes.asistencia)
    					$("#check_" + trabajador.uid + "_viernes").prop("checked", true);
    				//----LUNES----
					var check_lu = document.createElement('input');
        			check_lu.type = "checkbox";
        			//checkbox_lunes.className = "checkbox_lunes";
        			check_lu.value = 0.2;
        			check_lu.id = "check_" + trabajador.uid + "_lunes";
        			if(trabajador.lunes.asistencia)
    					$("#check_" + trabajador.uid + "_lunes").prop("checked", true);
    				//----MARTES----
					var check_ma = document.createElement('input');
        			check_ma.type = "checkbox";
        			//checkbox_lunes.className = "checkbox_lunes";
        			check_ma.value = 0.2;
        			check_ma.id = "check_" + trabajador.uid + "_martes";
        			if(trabajador.martes.asistencia)
    					$("#check_" + trabajador.uid + "_martes").prop("checked", true);
    				//----MIERCOLES----
					var check_mi = document.createElement('input');
        			check_mi.type = "checkbox";
        			//checkbox_lunes.className = "checkbox_lunes";
        			check_mi.value = 0.2;
        			check_mi.id = "check_" + trabajador.uid + "_miercoles";
        			if(trabajador.miercoles.asistencia)
    					$("#check_" + trabajador.uid + "_miercoles").prop("checked", true);

	   	     		//faltan horas extra y diversos ¡(>_<)¡ AQUI
	   	         	datos_asistencia.push([trabajador.uid, trabajador.nombre, trabajador.jefe, trabajador.especialidad, ddl_proc, check_ju, check_vi, check_lu, check_ma, check_mi]);
	   	         	var tabla_procesos = $('#'+ id_datatable_procesos).DataTable({
	   	            	destroy: true,
	   	            	data: datos_procesos,
	   	            	dom: 'Bfrtip',
	   	            	buttons: ['excel'],
	   	            	columns: [
	   	            	    {title: "ID",width: 150},
	   	            	    {title: "NOMBRE",width: 70},
	   	            	    {title: "EMPLEADOR",width: 70},
	   	            	    {title: "ESP",width: 70},
	   	            	    {title: "PROCESO",width: 70},
	   	            	    {title: "JUEVES",width: 70},
	   	            	    {title: "VIERNES",width: 70},
	   	            	    {title: "LUNES",width: 70},
	   	            	    {title: "MARTES",width: 70},
	   	            	    {title: "MIERCOLES",width: 70},

	   	            	],
	   	            	language: idioma_espanol,
	   	         	});            
		        });
    		} else {
    		firebase.database().ref(rama_bd_trabajadores).orderByChild("obra_asignada").equalTo($('#' + id_obra_ddl_asistencia + " option:selected").val()).once('value').then(function(trabajadorSnap){

    			});
    		}
    	});
    });
});

function addNewWey(dt){
    var tabla_procesos = $('#'+ id_datatable_procesos).DataTable();
    tabla_procesos.row.add([
    	trabajador.uid, 
    	trabajador.nombre, 
    	trabajador.jefe, 
    	trabajador.especialidad, 
    	ddl_proc, 
    	check_ju, 
    	check_vi, 
    	check_lu, 
    	check_ma, 
    	check_mi
    ]).draw( false );
}
/* Creando los elementos dinámicamente
$("#" + id_obra_ddl_asistencia).change(function(){
	var div = document.getElementById(id_lista_div_asistencia);
	div.empty();
	//Ver cómo hacerle para que los títulos queden bien con los elementos
	var row_titles = document.createElement('div');
	var label_titles = document.createElement('label');
	label_titles.innerHTML = "ID";
	row_titles.appendChild(label_titles);
	var label_titles2 = document.createElement('label');
	label_titles2.innerHTML = "NOMBRE";
	row_titles.appendChild(label_titles2);
	var label_titles3 = document.createElement('label');
	label_titles3.innerHTML = "JUEVES";
	row_titles.appendChild(label_titles3);
	var label_titles4 = document.createElement('label');
	label_titles4.innerHTML = "VIERNES";
	row_titles.appendChild(label_titles4);
	var label_titles5 = document.createElement('label');
	label_titles5.innerHTML = "LUNES";
	row_titles.appendChild(label_titles5);
	var label_titles6 = document.createElement('label');
	label_titles6.innerHTML = "MARTES";
	row_titles.appendChild(label_titles6);
	var label_titles7 = document.createElement('label');
	label_titles7.innerHTML = "MIERCOLES";
	row_titles.appendChild(label_titles7);

	div.appendChild(row_titles);

	//Todo esto en un if(snapshot == null) en obras.child(semana). Si no, lo cargas de lo que haya guardado
	firebase.database().ref(rama_bd_trabajadores).orderByChild("obra_asignada").equalTo($('#' + id_obra_ddl_asistencia + " option:selected").val()).once('value').then(function(snapshot){
		snapshot.forEach(function(childSnapshot){
			var trabajador = childSnapshot.val();
			var row = document.createElement('div');
			row.id = "row_" + trabajador.uid;
			var label = document.createElement('label');
        	label.innerHTML = trabajador.uid;
        	row.appendChild(label);
        	var label2 = document.createElement('label');
        	label2.innerHTML = trabajador.nombre;
        	row.appendChild(label2);

        	//----- jueves -----
        	var checkbox_jueves = document.createElement('input');
        	checkbox_jueves.type = "checkbox";
        	//checkbox_lunes.className = "checkbox_lunes";
        	checkbox_jueves.value = 0.2;
        	checkbox_jueves.id = "check_" + trabajador.uid + "_jueves";
        	div.appendChild(checkbox_jueves);

        	var horas_extra_jueves = document.createElement('input');
        	horas_extra_jueves.type = "text";
        	horas_extra_jueves.id = "horas_extra_" + trabajador.uid + "_jueves";
        	div.appendChild(horas_extra_jueves);
        	//----- viernes -----
        	var checkbox_viernes = document.createElement('input');
        	checkbox_viernes.type = "checkbox";
        	//checkbox_lunes.className = "checkbox_lunes";
        	checkbox_viernes.value = 0.2;
        	checkbox_viernes.id = "check_" + trabajador.uid + "_viernes";
        	div.appendChild(checkbox_viernes);

        	var horas_extra_viernes = document.createElement('input');
        	horas_extra_viernes.type = "text";
        	horas_extra_viernes.id = "horas_extra_" + trabajador.uid + "_viernes";
        	div.appendChild(horas_extra_viernes);
        	//----- lunes -----
        	var checkbox_lunes = document.createElement('input');
        	checkbox_lunes.type = "checkbox";
        	//checkbox_lunes.className = "checkbox_lunes";
        	checkbox_lunes.value = 0.2;
        	checkbox_lunes.id = "check_" + trabajador.uid + "_lunes";
        	div.appendChild(checkbox_lunes);

        	var horas_extra_lunes = document.createElement('input');
        	horas_extra_lunes.type = "text";
        	horas_extra_lunes.id = "horas_extra_" + trabajador.uid + "_lunes";
        	div.appendChild(horas_extra_lunes);
        	//----- martes -----
        	var checkbox_martes = document.createElement('input');
        	checkbox_martes.type = "checkbox";
        	//checkbox_lunes.className = "checkbox_lunes";
        	checkbox_martes.value = 0.2;
        	checkbox_martes.id = "check_" + trabajador.uid + "_martes";
        	div.appendChild(checkbox_martes);

        	var horas_extra_martes = document.createElement('input');
        	horas_extra_martes.type = "text";
        	horas_extra_martes.id = "horas_extra_" + trabajador.uid + "_martes";
        	div.appendChild(horas_extra_martes);
        	//----- miercoles -----
        	var checkbox_miercoles = document.createElement('input');
        	checkbox_miercoles.type = "checkbox";
        	//checkbox_lunes.className = "checkbox_lunes";
        	checkbox_miercoles.value = 0.2;
        	checkbox_miercoles.id = "check_" + trabajador.uid + "_miercoles";
        	div.appendChild(checkbox_miercoles);

        	var horas_extra_miercoles = document.createElement('input');
        	horas_extra_miercoles.type = "text";
        	horas_extra_miercoles.id = "horas_extra_" + trabajador.uid + "_miercoles";
        	div.appendChild(horas_extra_miercoles);

        	div.appendChild(row);
		});
	});
});
*/
