//app_reporte_obras
var id_button_generar_reporte_obras = "buttonGenerarRepObras"; //Botón
var id_inges_ddlcheck_reporte_obras = "ingesRepObras"; //DropDown Checklist
var id_obras_ddlcheck_reporte_obras = "obrasRepObras"; //DropDown Checklist
var id_fecha_inicio_reporte_obras = "fechaInicioRepObras"; //Datepicker
var id_fecha_final_reporte_obras = "fechaFinalRepObras"; //Datepicker

var id_ctx1_reporte_obras = "divGraph1RepObras"; //Div
var id_ctx2_reporte_obras = "divGraph2RepObras"; //Div
var id_ctxObra_reporte_obras = "divGraphObraRepObras"; //Div

var rama_bd_inges = "proyectos/inges";
var rama_bd_obras = "proyectos/obras";
var rama_bd_registros = "proyectos/registros";

$('#tabReporteObra').click(function() {
	//datePickers
	jQuery('#' + id_fecha_inicio_reporte_obras).datetimepicker(
        {timepicker:false, weeks:true,format:'m.d.Y'}
    );
    jQuery('#' + id_fecha_final_reporte_obras).datetimepicker(
        {timepicker:false, weeks:true,format:'m.d.Y'},
    );
	//dropDownCheckBox de colabs y obras, default todos seleccionados
	firebase.database().ref(rama_bd_inges).orderByChild('nombre').on('child_added',function(snapshot){
        var inge = snapshot.val();
        //myData.push({id: req.nombre, label: req.nombre});        
        //$('#' + id_reqs_ddlcheck_presupuesto).dropdownCheckbox("reset",myData);
        $('#' + id_inges_ddlcheck_reporte_obras).dropdownCheckbox("append",{
            id: inge.uid, label: inge.nombre, isChecked: true
        });
    });

	firebase.database().ref(rama_bd_obras).orderByChild('nombre').on('child_added',function(snapshot){
        var obra = snapshot.val();
        //myData.push({id: req.nombre, label: req.nombre});        
        //$('#' + id_reqs_ddlcheck_presupuesto).dropdownCheckbox("reset",myData);
        $('#' + id_obras_ddlcheck_reporte_obras).dropdownCheckbox("append",{
            id: obra.nombre, label: obra.nombre, isChecked: true
        });
    });

});
//Botón generar en pag
$('#' + id_button_generar_reporte_obras).click(function() {
	var datos = new Array();
	var labels = new Array();
	var labels_pptos = new Array();
	var datos_pptos = new Array();
	var otros = 0;
	var fecha_i;
    var fecha_i_timestamp;// = fecha_i.getTime();
    var fecha_f;
    var fecha_f_timestamp;

    if($('#' + id_fecha_final_reporte_obras).val() === ""){
    	if($('#' + id_fecha_inicio_reporte_obras).val() === ""){
    		//Si no se selecciona ninguna fecha se hacen los reportes con todos los valores
    		fecha_i = new Date(2018,8,1);
    		fecha_i_timestamp = fecha_i.getTime();
    		fecha_f = new Date();
    		fecha_f_timestamp = fecha_f.getTime();
    	} else {
    		//Si sólo se selecciona un día se utiliza la info de ese día en particular
    		fecha_i = new Date($('#' + id_fecha_inicio_reporte_obras).val());
    		fecha_i_timestamp = fecha_i.getTime();
	        fecha_f = "";
	        fecha_f_timestamp = fecha_i_timestamp + (24*3600*1000);
    	}
    } else {
    	fecha_i = new Date($('#' + id_fecha_inicio_reporte_obras).val());
    	fecha_i_timestamp = fecha_i.getTime();
        fecha_f = new Date($('#' + id_fecha_final_reporte_obras).val());
        fecha_f_timestamp = fecha_f.getTime() + (24*3600*1000); 
    }

    var inges_lista = $('#' + id_inges_ddlcheck_reporte_obras).dropdownCheckbox("checked");
    var obras_lista = $('#' + id_obras_ddlcheck_reporte_obras).dropdownCheckbox("checked");
    
    for(i=0;i<obras_lista.length;i++){
        labels[i] = obras_lista[i].label;
        datos[i] = 0;
        //labels_pptos y datos_pptos corresponden a los pptos de la obra cuyo nombre esta en labels[i]
        labels_pptos[i] = new Array();
        datos_pptos[i] = new Array();
    }
    
    firebase.database().ref(rama_bd_obras).once('value').then(function(snapshot){
        snapshot.forEach(function(childSnapshot){
        	for(i=0;i<obras_lista.length;i++){
        		if(childSnapshot.val().nombre == obras_lista[i].label){
            		childSnapshot.child("presupuestos").forEach(function(presu_snapshot){
            			labels_pptos[i].push(presu_snapshot.val().nombre);
            			datos_pptos[labels_pptos.length - 1] = 0;
            		});
        		}
        	}
        });

		firebase.database().ref(rama_bd_registros).once('value').then(function(snapshot){
	        snapshot.forEach(function(childSnapshot){
	        	var reg = childSnapshot.val();
	        	var filtro_inges = false;
	        	var filtro_obras = false;
	        	
	        	//Revisa si el registro pertenece al rango de fecha deseado. Sólo se revisan los demás filtros si el primero pasa
	        	if(fecha_i_timestamp < reg.checkin && reg.checkin < fecha_f_timestamp){
		        	var i = 0;
		        	//Revisa si el registro pertenece a un inge seleccionado
		        	while(i < inges_lista.length && filtro_inges == false){
		        		if(reg.inge == inges_lista[i].label)
		        			filtro_inges = true;
		        		else
		        			i++;
		        	}
		        	//Sólo revisa los demás filtros si el primero se pasa, para evitar búsquedas innecesarias
		        	if(filtro_inges){
		        		//Si el reg es de Otros (o misc por el tiempo antes de que lo cambiaramos) se guarda pero en una variable aparte
		        		if(reg.obra == "Otros" || reg.obra == "Miscelaneo"){
		        			otros += reg.horas/3600000;
		        		} else {
			        		var j = 0;
			        		//Revisa si el registro pertenece a una obra seleccionada
			        		while(j < obras_lista.length && filtro_obras == false){
			        			if(reg.obra == obras_lista[i].label)
			        				filtro_obras = true;
			        			else
			        				j++;
			        		}
			        		if(filtro_obras){
			        			datos[j] += reg.horas/3600000;
			        			var flag = false;
			        			var k = 0;
			        			while(k < labels_pptos[j].length && flag == false){
			        				if(labels_pptos[j][k] == reg.presupuesto){
			        					datos_pptos[j][k] += reg.horas/3600000;
			        					flag = true;
			        				} else{
			        					k++;
			        				}

			        			}
			        		}	
		        		}
		        	}
	        	}

	        });

			//<canvas id="myChart" width="400" height="400"></canvas>
			//var ctx = document.getElementById("myChart");
			var ctx1 = document.createElement('canvas');
			ctx1.id = 'ctx1RepCol';
			document.getElementById(id_ctx1_reporte_obras).appendChild(ctx1);

			var ctx2 = document.createElement('canvas');
			ctx2.id = 'ctx2RepCol';
			document.getElementById(id_ctx2_reporte_obras).appendChild(ctx2);

	        //Grafica de horas trabajadas en cada obra, sin contar Otros
	        var data1 = {
    			datasets: [{
    			    data: datos
    			}],

			    // These labels appear in the legend and in the tooltips when hovering different arcs
			    labels: labels
			}

	        var grafica1 = new Chart(ctx1, {
			    type: 'doughnut',
			    data: data1,
			    options: {
        			title: {
    				    display: true,
    				    text: 'Horas trabajadas por obra'
    				}
    			}
			});

			//Gráficas de horas por ppto de cada obra
			for(i = 0; i < labels.length; i++){

				var ctxObra = document.createElement('canvas');
				ctxObra.id = 'ctxObraRepCol';
				document.getElementById(id_ctxObra_reporte_obras).appendChild(ctxObra);

				var dataObra = {
					datasets: [{
						data: datos_pptos[i]
					}],
					labels: labels_pptos[i]
				}

				var graficaObra = new Chart(ctxObra, {
					type: 'doughnut',
					data: dataObra,
					options: {
        				title: {
    					    display: true,
    					    text: labels[i]
    					}
    				}
				})

			}

    		labels.push("Otros");
    		datos.push(otros);
    		//Grafica de horas trabajadas en cada obra, contando Otros
	        var data2 = {
    			datasets: [{
    			    data: datos
    			}],

			    // These labels appear in the legend and in the tooltips when hovering different arcs
			    labels: labels
			}

	        var grafica2 = new Chart(ctx2, {
			    type: 'doughnut',
			    data: data2,
			    options: {
        			title: {
    				    display: true,
    				    text: 'Horas trabajadas por obra ("Otros" incluidos)'
    				}
    			}
			});

		});
    });

});

//Botón generar en pdf
