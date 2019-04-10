var id_semana_ddl_horasExtra = "semanaDdlHorasExtra";
var id_year_ddl_horasExtra = "yearDdlHorasExtra";
var id_obra_ddl_horasExtra = "obraDdlHorasExtra";

var id_guardar_button_horasExtra = "guardarButtonHorasExtra";
var id_terminar_button_horasExtra = "terminarButtonHorasExtra";

var id_datatable_horasExtra = "dataTableHorasExtra";
var id_table_horasExtra = "tableHorasExtra";
var id_tab_horasExtra = "tabHorasExtra";

var rama_bd_pagos_nomina = "produccion/pagos_nomina";
var rama_bd_obras_prod = "produccion/obras";
var rama_bd_trabajadores = "produccion/trabajadores";

var nuevo;
var entradas = 0;
var tableHorasExtra = document.getElementById(id_table_horasExtra)

var sueldos_base = [];

jQuery.datetimepicker.setLocale('es');

$('#' + id_tab_horasExtra).click(function(){
    sueldos_base = [];
    $('#' + id_datatable_horasExtra).empty();
    $('#' + id_datatable_horasExtra).addClass('hidden');
    $('#' + id_table_horasExtra).empty();
    entradas = 0;
    $('#' + id_semana_ddl_horasExtra).empty();
    $('#' + id_year_ddl_horasExtra).empty();
    $('#' + id_obra_ddl_horasExtra).empty();

    var semana_actual = getWeek(new Date().getTime())[0];
    var year_actual = getWeek(new Date().getTime())[1];

    var select = document.getElementById(id_semana_ddl_horasExtra);
    for(i=semana_actual;i>0;i--){
        var option = document.createElement('option');
        option.text = option.value = i;
        select.appendChild(option);
    }

    var select2 = document.getElementById(id_year_ddl_horasExtra);
    for(i=year_actual;i>2017;i--){
        var option2 = document.createElement('option');
        option2.text = option2.value = i;
        select2.appendChild(option2);
    }

    var select3 = document.getElementById(id_obra_ddl_horasExtra);
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

    var option5 = document.createElement('OPTION');
    option5.text = option5.value = "Atencion a Clientes";
    select3.appendChild(option5);
    
    nuevo = tableHorasExtra.insertRow(0);
    nuevo.id = "nuevo_trabajador_he";
    
});

$('#' + id_year_ddl_horasExtra).change(function(){
    document.getElementById(id_obra_ddl_horasExtra).selectedIndex = 0;
    sueldos_base = [];
    $('#' + id_semana_ddl_horasExtra).empty();
    $('#' + id_datatable_horasExtra).empty();
    $('#' + id_datatable_horasExtra).addClass('hidden');
    $('#' + nuevo.id).empty();
    $('#' + id_table_horasExtra).empty();
    entradas = 0;
    var select = document.getElementById(id_semana_ddl_horasExtra);
    var year = $('#' + id_year_ddl_horasExtra + " option:selected").val();
    if(year < getWeek(new Date().getTime())[1]){
        var ult_sem = getWeek(new Date(year,11,31).getTime())[0];
        for(i=ult_sem;i>0;i--){
            var option = document.createElement('option');
            option.text = option.value = i;
            select.appendChild(option);
        }
    } else {
        for(i=getWeek(new Date().getTime())[0];i>0;i--){
            var option = document.createElement('option');
            option.text = option.value = i;
            select.appendChild(option);
        }
    }
    
});

$('#' + id_semana_ddl_horasExtra).change(function(){
    sueldos_base = [];
    $('#' + id_datatable_horasExtra).empty();
    $('#' + id_datatable_horasExtra).addClass('hidden');
    $('#' + nuevo.id).empty();
    $('#' + id_table_horasExtra).empty();
    entradas = 0;
});

$("#" + id_obra_ddl_horasExtra).change(function(){
    sueldos_base = [];
    $('#' + nuevo.id).empty();
    $('#' + id_datatable_horasExtra).empty();
    $('#' + id_datatable_horasExtra).addClass('hidden');
    $('#' + id_table_horasExtra).empty();
    entradas = 0;
    headersHorasExtra();
    nuevo = tableHorasExtra.insertRow(1);
    nuevo.id = "nuevo_trabajador_he";
    var year = $('#' + id_year_ddl_horasExtra + " option:selected").val();
    var semana = $('#' + id_semana_ddl_horasExtra + " option:selected").val();
    firebase.database().ref(rama_bd_pagos_nomina + "/" + year + "/" + semana).once('value').then(function(snapshot){
        var nomina = snapshot.val();
        var terminada = snapshot.val().horas_extra_terminadas;
        var obra = nomina[$("#" + id_obra_ddl_horasExtra + " option:selected").val()];
        console.log(nomina)
        console.log($("#" + id_obra_ddl_horasExtra + " option:selected").val())
        console.log(obra)
        if(terminada){
            //Cargar tabla con datos
            var datos_horasExtra = [];
            snapshot.child(year + "/" + semana + "/" + $("#" + id_obra_ddl_horasExtra + " option:selected").val() + "/trabajadores").forEach(function(trabSnap){
                trabSnap.child("horas_extra").forEach(function(childSnap){
                    var entrada = childSnap.val();
                    datos_horasExtra.push([trabSnap.key,trabSnap.val().nombre,entrada.fecha,entrada.proceso,entrada.horas]);
                });
                //Asincronía? :S
                $('#' + id_datatable_horasExtra).removeClass('hidden');
                var tabla_procesos = $('#'+ id_datatable_horasExtra).DataTable({
                    destroy: true,
                    data: datos_horasExtra,
                    dom: 'Bfrtip',
                    buttons: ['excel'],
                    columns: [
                        {title: "ID",width: 70},
                        {title: "NOMBRE",width: 150},
                        {title: "FECHA",width: 70},
                        {title: "PROCESO",width: 70},
                        {title: "HORAS",width: 70}
                    ],
                    language: idioma_espanol,
                }); 
            });
        } else {
            if($('#' + id_obra_ddl_horasExtra + " option:selected").val() == "Atencion a Clientes"){
                loadHorasExtra(year,semana,[],0);
            } else {
                //Cargar matriz (no necesariamente tabla) con ddls y textfield
                firebase.database().ref(rama_bd_obras_prod).orderByChild("nombre").equalTo($('#' + id_obra_ddl_horasExtra + " option:selected").val()).once('child_added').then(function(snapshot){
                    var procesos = [];
                    var count_proc = 0;
                    if(snapshot.child("num_procesos").val() == 0){
                        procesos[0] = snapshot.child("nombre").val();
                    } else {
                        snapshot.child("procesos").forEach(function(childSnapshot){
                            var proc = childSnapshot.val();
                            if(proc.num_subprocesos == 0){
                                procesos[count_proc] = childSnapshot.val().clave;
                                count_proc++;
                            } else {
                                childSnapshot.child("subprocesos").forEach(function(grandChildSnapshot){
                                    procesos[count_proc] = grandChildSnapshot.val().clave;
                                    count_proc++;
                                });
                            }
                        });
                    }
                    loadHorasExtra(year,semana,procesos,count_proc);                    
                });
            }
        }
    });
});

function loadHorasExtra(year,semana,procesos,count_proc){
    //Carga todos los registros hechos
    firebase.database().ref(rama_bd_pagos_nomina + "/" + year + "/" + semana + "/" + $("#" + id_obra_ddl_horasExtra + " option:selected").val()).once('value').then(function(snapshot){  
        snapshot.child("trabajadores").forEach(function(childSnapshot){
            childSnapshot.child('horas_extra').forEach(function(horasSnap){
                //AQUI asincronia?
                firebase.database().ref(rama_bd_trabajadores + "/" + childSnapshot.key).once('value').then(function(trabSnap){
                    cargaRenglonHorasExtra(trabSnap.val(), procesos, false, horasSnap.val().fecha, horasSnap.val().horas, horasSnap.val().proceso);
                });
            });
        });
    })

    var cell_id = nuevo.insertCell(0);
    var t_id = document.createElement('input');
    t_id.id = "t_id_he";
    t_id.placeholder = "ID";
    cell_id.appendChild(t_id);
    $('#' + t_id.id).change(function(){
        if($('#' + t_id.id).val() != ""){
            firebase.database().ref(rama_bd_trabajadores + "/" + $('#' + t_id.id).val()).once('value').then(function(snapshot){
                var trabajador = snapshot.val();
                if(trabajador != null){
                    cargaRenglonHorasExtra(trabajador, procesos, true,"","","");
                    $('#' + t_id.id).val("");
                } else {
                    alert("No existe un trabajador con ese ID");
                }
            });
        }
    });
    var cell_nombre = nuevo.insertCell(1);
    var t_nombre = document.createElement('input');
    t_nombre.id = "t_nombre_he"
    t_nombre.placeholder = "Nombre";
    cell_nombre.appendChild(t_nombre);
    $('#' + t_nombre.id).change(function(){
        if($('#' + t_nombre.id).val() != ""){
            firebase.database().ref(rama_bd_trabajadores).orderByChild("nombre").equalTo($('#' + t_nombre.id).val()).once('value').then(function(snapshot){
                snapshot.forEach(function(childSnap){
                    var trabajador = childSnap.val();
                    if(trabajador != null){
                        cargaRenglonHorasExtra(trabajador, procesos, true,"","","");
                        $('#' + t_nombre.id).val("");
                    } else {
                        alert("No existe un trabajador con ese nombre");
                    }
                });
            });
        }
    });
}

function cargaRenglonHorasExtra(trabajador,procesos,nuevo,fecha_in,horas_in,proc_in){
    var row = tableHorasExtra.insertRow(1);
    var cell_id = row.insertCell(0);
    var cell_nombre = row.insertCell(1);
    var cell_fecha = row.insertCell(2);
    var cell_horas = row.insertCell(3);
    var cell_proc = row.insertCell(4);

    var id_label = document.createElement('label');
    id_label.innerHTML = trabajador.id_trabajador;
    id_label.id = "id_" + entradas;
    cell_id.appendChild(id_label);
    var nombre_label = document.createElement('label');
    nombre_label.innerHTML = trabajador.nombre;
    nombre_label.id = "nombre_" + entradas;
    cell_nombre.appendChild(nombre_label);

    var fecha = document.createElement('input');
    fecha.className = "form-control";
    fecha.type = "text";
    fecha.readOnly = "readonly";//Sí?
    fecha.id = "fecha_" + entradas;
    cell_fecha.appendChild(fecha);//chance con append antes de llamarlo jala
    jQuery('#' + fecha.id).datetimepicker(
        {timepicker:false, weeks:true,format:'m.d.Y'}
    );
    
    var horas = document.createElement('input');
    horas.type = "text";
    horas.id = "horas_" + entradas;
    horas.placeholder = "Horas trabajadas";
    cell_horas.appendChild(horas);

    sueldos_base[entradas] = parseFloat(trabajador.sueldo_base);
    if($('#' + id_obra_ddl_horasExtra + " option:selected").val() == "Atencion a Clientes"){
        var textField = document.createElement('input');
        textField.type = "text";
        textField.id = "proc_" + entradas;
        cell_proc.appendChild(textField);
    } else {
        var proc = document.createElement('select');
        var option2 = document.createElement('option');
        option2.style = "display:none";
        option2.text = option2.value = "";
        proc.appendChild(option2);
        for(i=0;i<procesos.length;i++){
            var option = document.createElement('OPTION');
            option.text = procesos[i];
            option.value = procesos[i];
            proc.appendChild(option);
        }
        proc.id = "proc_" + entradas;
        cell_proc.appendChild(proc);
    }

    if(!nuevo){
        var date = new Date(fecha_in);
        $("#" + fecha.id).val((date.getMonth() + 1) + "." + date.getDate() + "." + date.getFullYear());
        $('#' + horas.id).val(parseFloat(horas_in));
        for(var i = 0; i<proc.length;i++){
            if(proc[i].text == proc_in){
                proc.selectedIndex = i;
            }
        }     
    }

    entradas++;
}

$('#' + id_guardar_button_horasExtra).click(function(){
    var year = $('#' + id_year_ddl_horasExtra + " option:selected").val();
    var semana = $('#' + id_semana_ddl_horasExtra + " option:selected").val();
    var obra = $('#' + id_obra_ddl_horasExtra + " option:selected").val();
    var total_horas = {};
    for(i=0;i<entradas;i++){
        var id_trabajador = document.getElementById("id_" + i).innerHTML;
        var proc;
        if($('#' + id_obra_ddl_horasExtra + " option:selected").val() == "Atencion a Clientes"){
            proc = $('#proc_' + i).val()
        } else {
            proc = $('#proc_' + i + " option:selected").text();
        }
        var he = {
            horas: $('#horas_' + i).val(),
            proceso: proc, 
            fecha: new Date($('#fecha_' + i).val()).getTime(),
        }
        var he_con_obra = {
            horas: $('#horas_' + i).val(),
            proceso: proc, 
            fecha: new Date($('#fecha_' + i).val()).getTime(),
            obra: obra,
        }
        //Checar asincronía
        if(!total_horas[id_trabajador]){
            total_horas[id_trabajador] = parseFloat($('#horas_' + i).val()) * sueldos_base[i] * 2/48;//En $$ y no en horas
        } else {
            total_horas[id_trabajador] = total_horas[id_trabajador] + parseFloat($('#horas_' + i).val()) * sueldos_base[i] * 2/48;//En $$ y no en horas
        }
        firebase.database().ref(rama_bd_pagos_nomina + "/" + year + "/" + semana + "/" + obra + "/trabajadores/" + id_trabajador + "/horas_extra").push(he);   
        firebase.database().ref(rama_bd_trabajadores + "/" + id_trabajador + "/nomina/" + year + "/" + semana + "/horas_extra").push(he_con_obra);

        //Actualiza las obras asignadas para que siempre salga este trabajador en esta semana. 
        firebase.database().ref(rama_bd_trabajadores + "/" + id_trabajador + "/obras_asignadas").once('value').then(function(snapshot){
            var existe = false;
            var i = 0;
            snapshot.forEach(function(childSnap){
                i++;
                if(childSnap.val() == obra)
                    existe = true;
            });
            if(!existe){
                //si es nuevo pero no le metí ninguna chamba no lo guardo
                firebase.database().ref(rama_bd_trabajadores + "/" + id_trabajador + "/obras_asignadas/" + i).set(obra);
            }
        });
        //Sumar $$ a lo que ya está en total horas en la base de datos (trabajadores)
        //Checar asincronia
        firebase.database().ref(rama_bd_trabajadores + "/" + id_trabajador + "/nomina/" + year + "/" + semana + "/total_horas_extra").once('value').then(function(snapshot){
            var horas_previas = 0;
            if(snapshot.exists()){
                horas_previas = snapshot.val();
            }
            var horas_nuevas = parseFloat(horas_previas) + parseFloat($('#horas_' + i).val()) * sueldos_base[i] * 2/48;
            firebase.database().ref(rama_bd_trabajadores + "/" + id_trabajador + "/nomina/" + year + "/" + semana + "/total_horas_extra").set(horas_nuevas);
            var impuestos_horas = (horas_nuevas * 0.16).toFixed(2);
            firebase.database().ref(rama_bd_trabajadores + "/" + id_trabajador + "/nomina/" + year + "/" + semana + "/impuestos/impuestos_horas_extra").set(impuestos_horas);
        });
    }
    //Sumar total_horas a lo que ya está en total horas en la base de datos (nomina)
    //Checar asincronia
    for(key in total_horas){
        firebase.database().ref(rama_bd_pagos_nomina + "/" + year + "/" + semana + "/" + obra + "/trabajadores/" + key + "/total_horas_extra").once('value').then(function(snapshot){
            var horas_previas = 0;
            if(snapshot.exists()){
                horas_previas = snapshot.val();
            }
            var horas_nuevas = parseFloat(horas_previas) + total_horas[key];
            firebase.database().ref(rama_bd_pagos_nomina + "/" + year + "/" + semana + "/" + obra + "/trabajadores/" + key + "/total_horas_extra").set(horas_nuevas);
            var impuestos_horas = (horas_nuevas * 0.16).toFixed(2);
            firebase.database().ref(rama_bd_pagos_nomina + "/" + year + "/" + semana + "/" + obra + "/trabajadores/" + key + "/impuestos/impuestos_horas_extra").set(impuestos_horas);
        });
    }
    alert("Datos actualizados");
});

$('#' + id_terminar_button_horasExtra).click(function(){
    firebase.database().ref(rama_bd_pagos_nomina + "/" + $('#' + id_year_ddl_horasExtra + " option:selected").val() + "/" + $('#' + id_semana_ddl_horasExtra + " option:selected").val()).once('value').then(function(snapshot){
        snapshot.forEach(function(obraSnap){
            if(obraSnap.key != "total" && obraSnap.key != "terminada" && obraSnap.key != "asistencias_terminadas" && obraSnap.key != "horas_extra_terminadas" && obraSnap.key != "diversos_terminados"){
                obraSnap.child("trabajadores").forEach(function(trabSnap){
                    trabSnap.child("horas_extra").forEach(function(heSnap){
                        var horas_extra = heSnap.val();
                        var proc = horas_extra.proceso;
                        var cantidad = horas_extra.horas * trabSnap.val().sueldo_base * (2/48) * 1.16;
                        var obra = obraSnap.val().nombre;
                        if(obra != "Atencion a Clientes"){
                            sumaMOKaizenHE(obra,cantidad);
                            if(proc != obra){
                                var path = proc.split("-");
                                if(path.length() > 1){
                                    sumaMOKaizenHE(obra + "/procesos/ " + path[0],cantidad);
                                    sumaMOKaizenHE(obra + "/procesos/ " + path[0] + "/subprocesos/" + proc,cantidad);
                                } else {
                                    sumaMOKaizenHE(obra + "/procesos/ " + proc,cantidad);
                                }
                            }
                        }
                    });
                });
            }
        });
    });
    var tru = true;
    firebase.database().ref(rama_bd_pagos_nomina + "/" + $('#' + id_year_ddl_horasExtra + " option:selected").val() + "/" + $('#' + id_semana_ddl_horasExtra + " option:selected").val() + "/horas_extra_terminadas").set(tru);
    alert("Registro de horas extra de esta semana terminado");
});

function sumaMOKaizenHE(query,cantidad){
    firebase.database().ref(rama_bd_obras_magico + "/" + query + "/kaizen/PRODUCCION/COPEO/PAG").once('value').then(function(snapshot){
        var anterior = snapshot.val();
        var nuevo = (parseFloat(anterior) + parseFloat(cantidad) * 1.16).toFixed(2);//se le agrega al impuesto para el kaizen
        firebase.database().ref(rama_bd_obras_magico + "/" + query + "/kaizen/PRODUCCION/COPEO/PAG").set(nuevo);
    });
}

function headersHorasExtra() {
  var row = tableHorasExtra.insertRow(0);
  var cell1 = row.insertCell(0);
  var cell2 = row.insertCell(1);
  var cell3 = row.insertCell(2);
  var cell4 = row.insertCell(3);
  var cell5 = row.insertCell(4);
  cell1.innerHTML = "ID";
  cell2.innerHTML = "NOMBRE";
  cell3.innerHTML = "FECHA";
  cell4.innerHTML = "HORAS";
  cell5.innerHTML = "PROCESO";
}

var idioma_espanol = {
    "sProcessing":     "Procesando...",
    "sLengthMenu":     "Mostrar _MENU_ registros",
    "sZeroRecords":    "No se encontraron resultados",
    "sEmptyTable":     "Ningún dato disponible en esta tabla",
    "sInfo":           "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
    "sInfoEmpty":      "Mostrando registros del 0 al 0 de un total de 0 registros",
    "sInfoFiltered":   "(filtrado de un total de _MAX_ registros)",
    "sInfoPostFix":    "",
    "sSearch":         "Buscar:",
    "sUrl":            "",
    "sInfoThousands":  ",",
    "sLoadingRecords": "Cargando...",
    "oPaginate": {
        "sFirst":    "Primero",
        "sLast":     "Último",
        "sNext":     "Siguiente",
        "sPrevious": "Anterior"
    },
    "oAria": {
        "sSortAscending":  ": Activar para ordenar la columna de manera ascendente",
        "sSortDescending": ": Activar para ordenar la columna de manera descendente"
    }
}
