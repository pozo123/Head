var id_semana_ddl_pago_nomina = "semanaDdlPagoNomina";
var id_year_ddl_pago_nomina = "yearDdlPagoNomina";
var id_terminar_button_pago_nomina = "terminarButtonPagoNomina";

var id_datatable_pago_nomina = "dataTablePagoNomina";
var id_table_pago_nomina = "tablePagoNomina";

var id_tab_pago_nomina = "tabPagoNomina";

var rama_bd_pagos_nomina = "produccion/pagos_nomina";
var rama_bd_trabajadores = "produccion/trabajadores";
var rama_bd_obras_magico = "obras";

var tablePagoNomina = document.getElementById(id_table_pago_nomina);

var trabajadores = [];

$('#' + id_table_pago_nomina).click(function(){
	$('#' + id_semana_ddl_pago_nomina).empty();
    $('#' + id_year_ddl_pago_nomina).empty();
    $('#' + id_datatable_pago_nomina).empty();
    $('#' + id_datatable_pago_nomina).addClass('hidden');
    $('#' + id_table_pago_nomina).empty();

    var year_actual = getWeek(new Date().getTime())[1];

    var select = document.getElementById(id_year_ddl_pago_nomina);
    for(i=year_actual;i>2017;i--){
        var option = document.createElement('option');
        option.text = option.value = i;
        select.appendChild(option);
    }

    loadSemanasPagoNomina(year_actual);

});

$('#' + id_year_ddl_pago_nomina).change(function(){
	trabajadores = [];
	$('#' + id_datatable_pago_nomina).empty();
    $('#' + id_datatable_pago_nomina).addClass('hidden');
    $('#' + id_table_pago_nomina).empty();
	loadSemanasPagoNomina($('#' + id_year_ddl_pago_nomina + " option:selected").val());
});

function loadSemanasPagoNomina(year){
    var semana_actual = getWeek(new Date().getTime())[0];
    var select = document.getElementById(id_semana_ddl_pago_nomina);
    for(i=semana_actual;i>0;i--){
    	firebase.database().ref(rama_bd_pagos_nomina + "/" + year + "/" + i).once('value').then(function(snapshot){
    		var semana = snapshot.val();
    		if(semana.diversos_terminados && semana.asistencias_terminadas && semana.horas_extra_terminadas){
		        var option = document.createElement('option');
		        option.text = i;
		        option.value = semana.terminada;
		        select.appendChild(option);
    		}
    	});
    }
}

$('#' + id_semana_ddl_pago_nomina).change(function(){
	trabajadores = [];
	if($('#' + id_semana_ddl_pago_nomina + " option:selected").val()){
		//DataTable AQUI falta
	} else {
		//Cargar tabla
		headersPagoNomina();
		var year = $('#' + id_year_ddl_pago_nomina + " option:selected").val();
		var week = $('#' + id_semana_ddl_pago_nomina + " option:selected").text();
		firebase.database().ref(rama_bd_pagos_nomina + "/" + year + "/" + week).once('value').then(function(snapshot){
			snapshot.forEach(function(obraSnap){
				if(obraSnap.key != "total" && obraSnap.key != "terminada" && obraSnap.key != "asistencias_terminadas" && obraSnap.key != "horas_extra_terminadas" && obraSnap.key != "diversos_terminados"){
					obraSnap.child("trabajadores").forEach(function(trabSnap){
						//Si no existe ya, crealo.
						if(!trabajadores[trabSnap.key]){
							cargaRenglonPagoNomina(trabSnap);
						}
					});
				}
			});
		});
	}
});

function cargaRenglonPagoNomina(trabSnap){
	var row = tablePagoNomina.insertRow(1);
	var cell_id = row.insertCell(0);
    var cell_nombre = row.insertCell(1);
    var cell_pago = row.insertCell(2);

    var id_label = document.createElement('label');
    id_label.innerHTML = trabSnap.key;
    var nombre_label = document.createElement('label');
    nombre_label.innerHTML = trabSnap.val().nombre;
    cell_id.appendChild(id_label);
    cell_nombre.appendChild(nombre_label);

    var cant = document.createElement('input');
    cant.type = "text";
    cant.id = "cant_pagada_" + trabajadores.length;
    cant.placeholder = "Cantidad pagada";
    cell_pago.appendChild(cant);

	trabajadores[trabSnap.key] = trabSnap.key;
}

function headersPagoNomina() {
  var row = tablePagoNomina.insertRow(0);
  var cell1 = row.insertCell(0);
  var cell2 = row.insertCell(1);
  var cell3 = row.insertCell(2);
  cell1.innerHTML = "ID";
  cell2.innerHTML = "NOMBRE";
  cell3.innerHTML = "CANTIDAD PAGADA";
}

$('#' + id_terminar_button_pago_nomina).click(function(){
	var year = $('#' + id_year_ddl_pago_nomina + " option:selected").val();
	var week = $('#' + id_semana_ddl_pago_nomina + " option:selected").text();
	$('[id^=cant_pagada_]').each(function(){
		var split = this.id.split("_");
		var id_trabajador = split[split.length - 1];
		firebase.database().ref(rama_bd_trabajadores + "/" + id_trabajador).once('value').then(function(snapshot){
			var sueldo_base = parseFloat(snapshot.val().sueldo_base);
			var total = parseFloat($(this).val());
			if(week == 1 && new Date(year,0,1).getDay() != 4){
				distribuyeEnAsistenciasPagoNomina(total,week,year,snapshot,"first");
				distribuyeEnAsistenciasPagoNomina(total,getWeek(new Date(year-1,11,31).getTime())[0],year - 1,snapshot,"last");
			} else {
				distribuyeEnAsistenciasPagoNomina(total,week,year,snapshot,"NA");
			}
		});
	});
	
	sumaTotalesPN(week,year);
   	if(week == 1 && new Date(year,0,1).getDay() != 4){
   		sumaTotalesPN(getWeek(new Date(year-1,11,31).getTime())[0],year-1);
   	}

	var tru = true;
	firebase.database().ref(rama_bd_pagos_nomina + "/" + year + "/" + week + "/terminada").set(tru);
	alert("Operación exitosa");
});

function sumaTotalesPN(week, year){
	firebase.database().ref(rama_bd_pagos_nomina + "/" + year + "/" + week).once('value').then(function(snapshot){
		var total_week = 0;
		snapshot.forEach(function(childSnap){
			if(childSnap.key != "terminada" || childSnap.key != "total" || childSnap.key != "diversos_terminados" || childSnap.key != "horas_extra_terminadas" || childSnap.key != "asistencias_terminadas"){
				var total_obra = 0;
				childSnap.child("trabajadores").forEach(function(trabSnap){
					var trab = trabSnap.val();
					var total_trab = parseFloat(trab.total_horas_extra) + parseFloat(trab.total_asistencia) + parseFloat(trab.total_diversos) + parseFloat(trab.impuestos.impuestos_asistencia_obra) + parseFloat(trab.impuestos.impuestos_diversos) + parseFloat(trab.impuestos.impuestos_horas_extra);
					total_obra = total_obra + total_trab;
					firebase.database().ref(rama_bd_pagos_nomina + "/" + year + "/" + week + "/" + childSnap.key + "/trabajadores/" + trabSnap.key + "/total").set(total_trab);
				});
				firebase.database().ref(rama_bd_pagos_nomina + "/" + year + "/" + week + "/" + childSnap.key + "/total").set(total_obra);
				total_week = total_week + total_obra;
			}
		});
		firebase.database().ref(rama_bd_pagos_nomina + "/" + year + "/" + week + "/total").set(total_week);
	});
}
function distribuyeEnAsistenciasPagoNomina(total,week,year,snapshot,semanaQuebrada){
	semSnap = snapshot.child("nomina/" + year + "/" + week);
	var sem_trab = semSnap.val();
	var asis = 0;
	var asistencias = {};

	if(semanaQuebrada == "first"){
		var year_anterior = year - 1;
		var lastWeek = snapshot.child("nomina/" + year_anterior + "/" + getWeek(new Date(year_anterior,11,31))[0]).val();
		sumaAsistenciasPN(lastWeek,asis);
	} else if (semanaQuebrada == "last"){
		var year_siguiente = year + 1;
		var nextWeek = snapshot.child("nomina/" + year_siguiente + "/1").val();
		sumaAsistenciasPN(nextWeek,asis);
	}

	asistenciaDiaPN(sem_trab.lunes,asistencias,asis);
	asistenciaDiaPN(sem_trab.martes,asistencias,asis);
	asistenciaDiaPN(sem_trab.miercoles,asistencias,asis);
	asistenciaDiaPN(sem_trab.jueves,asistencias,asis);
	asistenciaDiaPN(sem_trab.viernes,asistencias,asis);

	//Guardo valores en rama trabajadores
	var total_asistencia = asis * sueldo_base;
	var impuestos_asistencia = total - total_asistencia - sem_trab.total_diversos - sem_trab.total_horas_extra - sem_trab.impuestos.impuestos_diversos - sem_trab.impuestos.impuestos_horas_extra;

	firebase.database().ref(rama_bd_trabajadores + "/" + id_trabajador + "/nomina/" + year + "/" + week + "/total_asistencia").set(total_asistencia);
	firebase.database().ref(rama_bd_trabajadores + "/" + id_trabajador + "/nomina/" + year + "/" + week + "/impuestos/impuestos_asistencia").set(impuestos_asistencia);
	firebase.database().ref(rama_bd_trabajadores + "/" + id_trabajador + "/nomina/" + year + "/" + week + "/total").set(total);
	
	for(key in asistencias){
		if(key != "total"){
			var keyObra = key;

            var total_asistencia_obra = (total_asistencia * asistencias[keyObra]["total"] / asis).toFixed(2);
            var impuestos_asistencia_obra = (impuestos_asistencia_obra * asistencias[keyObra]["total"] / asis).toFixed(2);
            var cant = total_asistencia_obra + impuestos_asistencia;

            firebase.database().ref(rama_bd_pagos_nomina + "/" + year + "/" + week + "/" + keyObra + "/trabajadores/" + id_trabajador + "/total_asistencia").set(total_asistencia_obra);
            firebase.database().ref(rama_bd_pagos_nomina + "/" + year + "/" + week + "/" + keyObra + "/trabajadores/" + id_trabajador + "/impuestos/impuestos_asistencia").set(impuestos_asistencia_obra);
            if(keyObra != "Atencion a Clientes"){
                sumaMOKaizenPN(keyObra,cant);

				if(asistencias[keyObra]["procesos"]){
					//Obra no simple
	                for(key in asistencias[keyObra]["procesos"]){
	                    var path = key.split("-");
	                    sumaMOKaizenPN(keyObra + "/procesos/" + path[0],cant);
	                    if(path.length > 1){
	                    	//subproceso
	                        sumaMOKaizenPN(keyObra + "/procesos/" + path[0] + "/subprocesos/" + key,cant);
	                    }
	                }
	            }
            }
		}
	}
}

function sumaMOKaizenPN(query,cantidad){
    firebase.database().ref(rama_bd_obras_magico + "/" + query + "/kaizen/PRODUCCION/COPEO/PAG").once('value').then(function(snapshot){
        var anterior = snapshot.val();
        var nuevo = (parseFloat(anterior) + parseFloat(cantidad)).toFixed(2);
        firebase.database().ref(rama_bd_obras_magico + "/" + query + "/kaizen/PRODUCCION/COPEO/PAG").set(nuevo);
    });
}

function sumaAsistenciasPN(week,asis){
	if(week.lunes.asistencia){
		asis += 0.2;
	}
	if(week.martes.asistencia){
		asis += 0.2;
	}
	if(week.miercoles.asistencia){
		asis += 0.2;
	}
	if(week.jueves.asistencia){
		asis += 0.2;
	}
	if(week.viernes.asistencia){
		asis += 0.2;
	}
}

function asistenciaDiaPN(dia, asistencias, asis){
    var proc = dia.proceso;
    if(proc == "Parado"){
        proc = "MISC";
    }
    if(dia.asistencia){
        asis += 0.2;
    	if(asistencias[dia.obra]["total"]) {
            asistencias[dia.obra]["total"] = asistencias[dia.obra]["total"] + 0.2;
        } else {
            asistencias[dia.obra]["total"] = 0.2;
        }
        if(dia.obra != proc){ 
            if(asistencias[dia.obra]){
                if(!asistencias[dia.obra]["procesos"]){
                    asistencias[dia.obra]["procesos"] = {};
                }
                if(asistencias[dia.obra]["procesos"][proc]){
                    asistencias[dia.obra]["procesos"][proc] = asistencias[dia.obra]["procesos"][proc] + 0.2;
                } else {
                    asistencias[dia.obra]["procesos"][proc] = 0.2;
                }
            } else {
                asistencias[dia.obra] = {};
                asistencias[dia.obra]["procesos"] = {};
                asistencias[dia.obra]["procesos"][proc] = 0.2;
            }
        }
    }
}
