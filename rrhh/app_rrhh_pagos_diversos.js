var id_semana_ddl_diversos = "semanaDdlDiversos";
var id_year_ddl_diversos = "yearDdlDiversos";
var id_diverso_ddl_diversos = "diversoDdlDiversos";

var id_guardar_button_diversos = "guardarButtonDiversos";
var id_terminar_button_diversos = "terminarButtonDiversos";

var id_datatable_diversos = "dataTableDiversos";
var id_table_diversos = "tableDiversos";
var id_tab_diversos = "tabDiversos";

var rama_bd_pagos_nomina = "produccion/pagos_nomina";
var rama_bd_obras_prod = "produccion/obras";
var rama_bd_trabajadores = "produccion/trabajadores";
var rama_bd_diversos = "rrhh/diversos";
var rama_bd_obras_magico = "obras";
var nuevo;
var entradas = 0;
var tableDiversos = document.getElementById(id_table_diversos)

$('#' + id_tab_diversos).click(function(){
    $('#' + id_semana_ddl_diversos).empty();
    $('#' + id_year_ddl_diversos).empty();
    $('#' + id_diverso_ddl_diversos).empty();
    $('#' + id_datatable_diversos).empty();
    $('#' + id_datatable_diversos).addClass('hidden');
    $('#' + id_table_diversos).empty();
    entradas = 0;

    var semana_actual = getWeek(new Date().getTime())[0];
    var year_actual = getWeek(new Date().getTime())[1];

    var select = document.getElementById(id_semana_ddl_diversos);
    for(i=semana_actual;i>0;i--){
        var option = document.createElement('option');
        option.text = option.value = i;
        select.appendChild(option);
    }

    var select2 = document.getElementById(id_year_ddl_diversos);
    for(i=year_actual;i>2017;i--){
        var option2 = document.createElement('option');
        option2.text = option2.value = i;
        select2.appendChild(option2);
    }

    var select3 = document.getElementById(id_diverso_ddl_diversos);
    var option3 = document.createElement('option');
    option3.style = "display:none";
    option3.text = option3.value = "";
    select3.appendChild(option3);

    firebase.database().ref(rama_bd_diversos).orderByChild('nombre').on('child_added',function(snapshot){
        var diverso = snapshot.val();
        var option4 = document.createElement('OPTION');
        option4.text = diverso.nombre;
        option4.value = diverso.nombre;
        select3.appendChild(option4);
    });
    
    nuevo = tableDiversos.insertRow(0);
    nuevo.id = "nuevo_trabajador_diversos";
    
});

$('#' + id_year_ddl_diversos).change(function(){
    document.getElementById(id_diverso_ddl_diversos).selectedIndex = 0;
    $('#' + id_semana_ddl_diversos).empty();
    $('#' + id_datatable_diversos).empty();
    $('#' + id_datatable_diversos).addClass('hidden');
    $('#' + nuevo.id).empty();
    $('#' + id_table_diversos).empty();

    entradas = 0;
    var year = $('#' + id_year_ddl_diversos + " option:selected").val();
    var select = document.getElementById(id_semana_ddl_diversos);
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

$('#' + id_semana_ddl_diversos).change(function(){
    $('#' + id_datatable_diversos).empty();
    $('#' + id_datatable_diversos).addClass('hidden');
    $('#' + nuevo.id).empty();
    $('#' + id_table_diversos).empty();
    entradas = 0;
});

$("#" + id_diverso_ddl_diversos).change(function(){
    $('#' + nuevo.id).empty();
    $('#' + id_datatable_diversos).empty();
    $('#' + id_datatable_diversos).addClass('hidden');
    $('#' + id_table_diversos).empty();
    entradas = 0;
    headersDiversos();
    nuevo = tableDiversos.insertRow(1);
    nuevo.id = "nuevo_trabajador_diversos";
    var year = $('#' + id_year_ddl_diversos + " option:selected").val();
    var semana = $('#' + id_semana_ddl_diversos + " option:selected").val();
    firebase.database().ref(rama_bd_pagos_nomina + "/" + year + "/" + semana).once('value').then(function(snapshot){
        var nomina = snapshot.val();
        var terminada = snapshot.val().diverosos_terminados;
        if(terminada){
            //Cargar tabla con datos
            var datos_diversos = [];
            snapshot.forEach(function(obraSnap){
                if(obraSnap.key != "terminada"){
                    obraSnap.child("trabajadores").forEach(function(trabSnap){
                        trabSnap.child("diversos").forEach(function(childSnap){
                            var entrada = childSnap.val();
                            datos_diversos.push([trabSnap.key,trabSnap.val().nombre,obraSnap.val().nombre,entrada.proceso,entrada.cantidad]);
                        });
                    });
                }
            });
            //Asincronía? :S
            $('#' + id_datatable_diversos).removeClass('hidden');
            var tabla_procesos = $('#'+ id_datatable_diversos).DataTable({
                destroy: true,
                data: datos_diversos,
                dom: 'Bfrtip',
                buttons: ['excel'],
                columns: [
                    {title: "ID",width: 70},
                    {title: "NOMBRE",width: 150},
                    {title: "OBRA",width: 70},
                    {title: "PROCESO",width: 70},
                    {title: "CANTIDAD",width: 70}
                ],
                language: idioma_espanol,
            }); 
        } else {
            //Carga todos los registros hechos
            firebase.database().ref(rama_bd_trabajadores).once('value').then(function(snapshot){
                snapshot.child('nomina/' + year + "/" + semana + "/diversos").forEach(function(diverSnap){
                    var diver = diverSnap.val();
                    console.log(diver);
                    console.log(diver.diverso);
                    if(diver.diverso == $('#' + id_diverso_ddl_diversos + " option:selected").val()){
                        cargaRenglonDiversos(snapshot.val(),false,diver.cantidad,diver.distribuible,diver.obra,diver.proceso);
                    }
                });
                var cell_id = nuevo.insertCell(0);
                var t_id = document.createElement('input');
                t_id.id = "t_id_diver";
                t_id.placeholder = "ID";
                cell_id.appendChild(t_id);
                $('#' + t_id.id).change(function(){
                    if($('#' + t_id.id).val() != ""){
                        firebase.database().ref(rama_bd_trabajadores + "/" + $('#' + t_id.id).val()).once('value').then(function(snapshot){
                            var trabajador = snapshot.val();
                            if(trabajador != null){
                                cargaRenglonDiversos(trabajador, true,"","","","");
                                $('#' + t_id.id).val("");
                            } else {
                                alert("No existe un trabajador con ese ID");
                            }
                        });
                    }
                });
                var cell_nombre = nuevo.insertCell(1);
                var t_nombre = document.createElement('input');
                t_nombre.id = "t_nombre_diver"
                t_nombre.placeholder = "Nombre";
                cell_nombre.appendChild(t_nombre);
                $('#' + t_nombre.id).change(function(){
                    if($('#' + t_nombre.id).val() != ""){
                        firebase.database().ref(rama_bd_trabajadores).orderByChild("nombre").equalTo($('#' + t_nombre.id).val()).once('value').then(function(snapshot){
                            snapshot.forEach(function(childSnap){
                                var trabajador = childSnap.val();
                                if(trabajador != null){
                                    cargaRenglonDiversos(trabajador, true,"","","","");
                                    $('#' + t_nombre.id).val("");
                                } else {
                                    alert("No existe un trabajador con ese nombre");
                                }
                            });
                        });
                    }
                });
            });
        }
    });
});

function cargaRenglonDiversos(trabajador,nuevo,cantidad_in,distribuible_in,obra_in,proc_in){
    var row = tableDiversos.insertRow(1);
    row.id = "row_" + entradas;
    var cell_id = row.insertCell(0);
    var cell_nombre = row.insertCell(1);
    var cell_cant = row.insertCell(2);
    var cell_distribuible = row.insertCell(3);

    var id_label = document.createElement('label');
    id_label.innerHTML = trabajador.id_trabajador;
    id_label.id = "id_" + entradas;
    cell_id.appendChild(id_label);

    var nombre_label = document.createElement('label');
    nombre_label.innerHTML = trabajador.nombre;
    nombre_label.id = "nombre_" + entradas;
    cell_nombre.appendChild(nombre_label);

    var cant = document.createElement('input');
    cant.type = "text";
    cant.id = "cant_" + entradas;
    cant.placeholder = "Cantidad pagada";
    cell_cant.appendChild(cant);

    var check = document.createElement('input');
    check.type = "checkbox";
    check.id = "check_" + entradas;
    //check.innerHTML = "Distribuible";
    check.checked = true;
    cell_distribuible.appendChild(check);

    $('#' + check.id).change(function(){
        if(this.checked != true){
            var cell_obra = row.insertCell(4);
            var consec = row.id.substring(row.id.length - 2, row.id.length);
            if(consec.substring(0,1) == "0"){
                consec = consec.substring(1,2);
            }
            cell_obra.id = "cell_obra_" + consec;
            var cell_proc = row.insertCell(5);
            generateDdls(cell_obra, cell_proc); 
        } else {
            row.deleteCell(4);
            row.deleteCell(4);
        }
    });

    if(!nuevo){
        $("#" + cant.id).val(cantidad_in);
        if(distribuible_in){
            check.checked = true;
        } else {
            check.checked = false;
            var cell_obra = row.insertCell(4);
            var cell_proc = row.insertCell(5);
            ddls = generateDdls(cell_obra, cell_proc);
            var obra = ddls[0];
            var proc = ddls[1];
            for(var i = 0; i<obra.length;i++){
                if(obra[i].text == obra_in){
                    obra.selectedIndex = i;
                }
            }
            if(obra_in == "Atencion a Clientes"){
                $('#' + proc.id).val(proc_in);
            } else {
                for(var i = 0; i<proc.length;i++){
                    if(proc[i].text == proc_in){
                        proc.selectedIndex = i;
                    }
                }
            }
        }
    }

    entradas++;
}

function generateDdls(cell_obra, cell_proc){
    var obra_ddl = document.createElement('select');
    var option2 = document.createElement('option');
    option2.style = "display:none";
    option2.text = option2.value = "";
    obra_ddl.appendChild(option2);
    var k = cell_obra.id.substring(cell_obra.id.length - 2, cell_obra.id.length);
    if(k.substring(0,1) == "0"){
        k = k.substring(1,2);
    }
    obra_ddl.id = "obra_" + k;
    firebase.database().ref(rama_bd_obras_prod).once('value').then(function(snapshot){
        snapshot.forEach(function(obraSnap){
            var obra = obraSnap.val();
            var option = document.createElement('OPTION');
            option.text = option.value = obra.nombre;
            obra_ddl.appendChild(option);
        });
        var option3 = document.createElement('option');
        option3.text = option3.value = "Atencion a Clientes";
        obra_ddl.appendChild(option3);
        cell_obra.appendChild(obra_ddl);
        var proc_input;

        $('#' + obra_ddl.id).change(function(){
            $('#' + cell_proc.id).empty();
            if($('#' + obra_ddl.id + " option:selected").val() == "Atencion a Clientes"){
                var proc_input = document.createElement('input');
                proc_input.type = "text";
                proc_input.id = "proc_" + k;
                cell_proc.appendChild(proc_input);
            } else {
                var proc_input = document.createElement('select');
                proc_input.id = "proc_" + k;
                var option2 = document.createElement('option');
                option2.style = "display:none";
                option2.text = option2.value = "";
                proc_input.appendChild(option2);
                var obra = snapshot.child($('#' + obra_ddl.id + " option:selected").val());
                if(obra.val().num_procesos == 0){
                    var option = document.createElement('OPTION');
                    option.text = obra.val().nombre;
                    option.value = obra.val().nombre;
                    proc_input.appendChild(option);
                } else {
                    obra.child("procesos").forEach(function(procSnap){
                        var proceso = procSnap.val();
                        if(proceso.num_subprocesos == 0){
                            var option = document.createElement('OPTION');
                            option.text = proceso.clave;// + " (" + proceso.nombre + ")";
                            option.value = proceso.clave;
                            proc_input.appendChild(option);
                        } else {
                            procSnap.child("subprocesos").forEach(function(subpSnap){
                                var subproc = subpSnap.val();
                                var option = document.createElement('OPTION');
                                option.text = subproc.clave;// + " (" + subproc.nombre + ")";
                                option.value = subproc.clave;
                                proc_input.appendChild(option);
                            });
                        }
                    });
                }
                cell_proc.appendChild(proc_input);
            }
        });
        return [obra_ddl, proc_input];
    });
}

$('#' + id_guardar_button_diversos).click(function(){
    var year = $('#' + id_year_ddl_diversos + " option:selected").val();
    var semana = $('#' + id_semana_ddl_diversos + " option:selected").val();
    var diverso = $('#' + id_diverso_ddl_diversos + " option:selected").val();
    var suma_diversos = {};

    for(i=0;i<entradas;i++){
        var id_trabajador = document.getElementById("id_" + i).innerHTML;
        if(!suma_diversos[id_trabajador]){
            suma_diversos[id_trabajador] = parseFloat($('#' + "cant_" + i).val());
        } else {
            suma_diversos[id_trabajador] = parseFloat($('#' + "cant_" + i).val()) + suma_diversos[id_trabajador];
        }
        var dist = true;
        var obr = "NA";
        var pro = "NA";
        console.log(!document.getElementById("check_" + i).checked)
        if(!document.getElementById("check_" + i).checked){
            dist = false;
            obr = $('#obra_' + i + " option:selected").val();
            if(obr == "Atencion a Clientes"){
                pro = $('#proc_' + i).val();
            } else {
                pro = $('#proc_' + i + " option:selected").val();
            }
            console.log(obr)
        }
        var div = {
            cantidad: $('#cant_' + i).val(),
            distribuilble: dist,
            obra: obr, 
            proceso: pro, 
            diverso: diverso,
        }
        firebase.database().ref(rama_bd_trabajadores + "/" + id_trabajador + "/nomina/" + year + "/" + semana + "/diversos").push(div);

        //Actualiza las obras asignadas para que siempre salga este trabajador en esta semana.
        if(obr != "NA"){
            firebase.database().ref(rama_bd_trabajadores + "/" + id_trabajador + "/obras_asignadas").once('value').then(function(snapshot){
                var existe = false;
                var i = 0;
                snapshot.forEach(function(childSnap){
                    i++;
                    if(childSnap.val() == obr)
                        existe = true;
                });
                if(!existe){
                    //si es nuevo pero no le metí ninguna chamba no lo guardo
                    firebase.database().ref(rama_bd_trabajadores + "/" + id_trabajador + "/obras_asignadas/" + i).set(obr);
                }
            });
        }
    }

    for(key in suma_diversos){
        firebase.database().ref(rama_bd_trabajadores + "/" + key + "/nomina/" + year + "/" + semana + "/total_diversos").once('value').then(function(snapshot){
            var diversos_nuevos = suma_diversos[key];
            if(snapshot.val() != null){
                diversos_nuevos += parseFloat(snapshot.val());
            }
            firebase.database().ref(rama_bd_trabajadores + "/" + key + "/nomina/" + year + "/" + semana + "/total_diversos").set(diversos_nuevos);
            var impuestos_diversos = (diversos_nuevos * 0.16).toFixed(2);
            firebase.database().ref(rama_bd_trabajadores + "/" + key + "/nomina/" + year + "/" + semana + "/impuestos/impuestos_diversos").set(impuestos_diversos);
        });
    }
    alert("Datos actualizados");
});

$('#' + id_terminar_button_diversos).click(function(){
    var year = $('#' + id_year_ddl_diversos + " option:selected").val();
    var week = $('#' + id_semana_ddl_diversos + " option:selected").val();
    firebase.database().ref(rama_bd_pagos_nomina + "/" + year + "/" + week + "/asistencias_terminadas").once('value').then(function(snapshot){
        if(snapshot.val()){
            //Entro a trabajadores y registro los diversos en pagos_nomina, tengo que esperar hasta acá por los distribuibles
            firebase.database().ref(rama_bd_trabajadores).once('value').then(function(snapshot){
                //checar si tienen esta semana
                snapshot.forEach(function(trabSnap){
                    var trab = trabSnap.val().nomina;
                    if(trab[year]){
                        if(trab[week]){
                            trabSnap.child("nomina/" + year + "/" + week + "/diversos").forEach(function(diversoSnap){
                                var diver = diversoSnap.val();
                                if(diver.distribuible){
                                    distribuyeEnAsistencias(diver.cantidad,trabSnap,year,week,diver.diverso);
                                } else {
                                    var diverso = {
                                        cantidad: diver.cantidad,
                                        diverso: diver.diverso,
                                        proceso: diver.proceso,
                                    }
                                    firebase.database().ref(rama_bd_pagos_nomina + "/" + year + "/" + week + "/" + diver.obra + "/trabajadores/" + trabSnap.key + "/diversos").push(diverso);
                                    var query = diver.obra;
                                    sumaMOKaizen(query,diver.cantidad);
                                    if(diver.obra != diver.proceso){
                                        var path = diver.proceso.split("-");
                                        query = query + "/procesos/" + path[0];
                                        sumaMOKaizen(query,diver.cantidad);
                                        if(path.length>1){
                                            query = query + "/procesos/" + path[0] + "/subprocesos/" + path[1];
                                            sumaMOKaizen(query,diver.cantidad);
                                        }
                                    }
                                    //AQUI checar asincronia
                                    firebase.database().ref(rama_bd_pagos_nomina + "/" + year + "/" + week + "/" + diver.obra + "/trabajadores/" + trabSnap.key + "/total_diversos").once('value').then(function(snapshot){
                                        var valor_anterior = snapshot.val();
                                        if(valor_anterior == null){
                                            valor_anterior = 0;
                                        }
                                        var nuevo_valor = valor_anterior + diver.cantidad;
                                        firebase.database().ref(rama_bd_pagos_nomina + "/" + year + "/" + week + "/" + diver.obra + "/trabajadores/" + trabSnap.key + "/total_diversos").set(nuevo_valor);
                                        var impuestos_diversos = (nuevo_valor * 0.16).toFixed(2);
                                        firebase.database().ref(rama_bd_pagos_nomina + "/" + year + "/" + week + "/" + diver.obra + "/trabajadores/" + trabSnap.key + "/impuestos/impuestos_diversos").set(impuestos_diversos);
                                    });
                                }
                            });
                        }
                    }
                });
            });

            var tru = true;
            firebase.database().ref(rama_bd_pagos_nomina + "/" + $('#' + id_year_ddl_diversos + " option:selected").val() + "/" + $('#' + id_semana_ddl_diversos + " option:selected").val() + "/diversos_terminados").set(tru);
            alert("Pagos diversos de esta semana terminados");
        } else {
            alert("No se han terminado las asistencias");
        }
    });
});

function distribuyeEnAsistencias(monto,trabSnap,year,week,diverso){
    var asistencias = {asistencias: 0};
    asistenciaDia(asistencias, trabSnap.child("nomina/" + year + "/" + week + "/lunes").val());
    asistenciaDia(asistencias, trabSnap.child("nomina/" + year + "/" + week + "/martes").val());
    asistenciaDia(asistencias, trabSnap.child("nomina/" + year + "/" + week + "/miercoles").val());
    asistenciaDia(asistencias, trabSnap.child("nomina/" + year + "/" + week + "/jueves").val());
    asistenciaDia(asistencias, trabSnap.child("nomina/" + year + "/" + week + "/viernes").val());
    console.log(asistencias);
    var totales = {};
    for(key in asistencias){
        if(key != "asistencias"){
            var keyObra = key;
            if(asistencias[keyObra]["procesos"]){
                if(!totales[keyObra]){
                    totales[keyObra] = 0;
                }
                for(key in asistencias[keyObra]["procesos"]){
                    var cant = (monto * asistencias[keyObra]["procesos"][key] / asistencias["asistencias"]).toFixed(2);
                    var diver = {
                        cantidad: cant,
                        proceso: key,
                        diverso: diverso,
                    }
                    firebase.database().ref(rama_bd_pagos_nomina + "/" + year + "/" + week + "/" + keyObra + "/trabajadores/" + trabSnap.key + "/diversos").push(diver);
                    //AQUI tiene que entrar al kaizen... pero me da miedo la asincronía
                    sumaMOKaizen(keyObra,cant);
                    var path = key.split("-");
                    if(path.length > 1){
                        sumaMOKaizen(keyObra + "/procesos/" + path[0],cant);
                        sumaMOKaizen(keyObra + "/procesos/" + path[0] + "/subprocesos/" + key,cant);
                    } else {
                        sumaMOKaizen(keyObra + "/procesos/" + key,cant);
                    }

                    console.log(keyObra + "/" + key + ": " + monto * asistencias[keyObra]["procesos"][key] / asistencias["asistencias"]);
                    totales[keyObra] = totales[keyObra] + cant;
                }
            } else {
                var cant = (monto * asistencias[keyObra] / asistencias["asistencias"]).toFixed(2);
                var diver = {
                    cantidad: cant,
                    proceso: keyObra,
                    diverso: diverso,
                }
                firebase.database().ref(rama_bd_pagos_nomina + "/" + year + "/" + week + "/" + keyObra + "/trabajadores/" + trabSnap.key + "/diversos").push(diver);
                //AQUI tiene que entrar al kaizen... pero me da miedo la asincronía
                sumaMOKaizen(keyObra,cant);
                console.log(keyObra + ": " + cant);
                totales[keyObra] = cant;
            }
        }
    }
    //AQUI aguas con la asincronía
    for(key in totales){
        firebase.database().ref(rama_bd_pagos_nomina + "/" + year + "/" + week + "/" + key + "/trabajadores/" + trabSnap.key + "/total_diversos").once('value').then(function(snapshot){
            var valor_anterior = snapshot.val();
            if(valor_anterior == null){
                valor_anterior = 0;
            }
            var nuevo_valor = valor_anterior + totales[key];
            firebase.database().ref(rama_bd_pagos_nomina + "/" + year + "/" + week + "/" + key + "/trabajadores/" + trabSnap.key + "/total_diversos").set(nuevo_valor);
            var impuestos_diversos = (nuevo_valor * 0.16).toFixed(2);
            firebase.database().ref(rama_bd_pagos_nomina + "/" + year + "/" + week + "/" + key + "/trabajadores/" + trabSnap.key + "/impuestos/impuestos_diversos").set(impuestos_diversos);
        });
    }
}

function sumaMOKaizen(query,cantidad){
    firebase.database().ref(rama_bd_obras_magico + "/" + query + "/kaizen/PRODUCCION/COPEO/PAG").once('value').then(function(snapshot){
        var anterior = snapshot.val();
        var nuevo = (parseFloat(anterior) + parseFloat(cantidad) * 1.16).toFixed(2);//se le agrega al impuesto para el kaizen
        firebase.database().ref(rama_bd_obras_magico + "/" + query + "/kaizen/PRODUCCION/COPEO/PAG").set(nuevo);
    });
}

function asistenciaDia(asistencias, dia){
    var proc = dia.proceso;
    if(dia.proceso == "Parado"){
        proc = "MISC";
    }
    if(dia.asistencia){
        if(asistencias["asistencias"]){
            asistencias["asistencias"] = asistencias["asistencias"] + 0.2;
        } else {
            asistencias["asistencias"] = 0.2;
        }
        if(dia.obra == proc){
            if(asistencias[dia.obra]) {
                asistencias[dia.obra] = asistencias[dia.obra] + 0.2;
            } else {
                asistencias[dia.obra] = 0.2;
            }
        } else { 
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

function headersDiversos() {
  var row = tableDiversos.insertRow(0);
  var cell1 = row.insertCell(0);
  var cell2 = row.insertCell(1);
  var cell3 = row.insertCell(2);
  var cell4 = row.insertCell(3);
  var cell5 = row.insertCell(4);
  var cell6 = row.insertCell(5);
  cell1.innerHTML = "ID";
  cell2.innerHTML = "NOMBRE";
  cell3.innerHTML = "CANTIDAD";
  cell4.innerHTML = "DISTRIBUIBLE";
  cell5.innerHTML = "OBRA";
  cell6.innerHTML = "PROCESO";
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
