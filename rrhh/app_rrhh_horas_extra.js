var id_semana_ddl_horasExtra = "semanaDdlHorasExtra";
var id_year_ddl_horasExtra = "yearDdlHorasExtra";
var id_obra_ddl_horasExtra = "obraDdlHorasExtra";

var id_guardar_button_horasExtra = "guardarButtonHorasExtra";

var id_datatable_horasExtra = "dataTableHorasExtra";
var id_table_horasExtra = "tableHorasExtra";
var id_tab_horasExtra = "tabHorasExtra";

var rama_bd_pagos_nomina = "produccion/pagos_nomina";
var rama_bd_obras_prod = "produccion/obras";
var rama_bd_trabajadores = "produccion/trabajadores";

var nuevo;
var entradas = 0;
var tableHorasExtra = document.getElementById(id_table_horasExtra)

$('#' + id_tab_horasExtra).click(function(){
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

    nuevo = tableHorasExtra.insertRow(0);
    nuevo.id = "nuevo_trabajador";
});

$('#' + id_year_ddl_horasExtra).change(function(){
    $('#' + id_datatable_horasExtra).empty();
    $('#' + id_datatable_horasExtra).addClass('hidden');
    $('#' + nuevo.id).empty();
    $('#' + id_table_horasExtra).empty();
});

$('#' + id_semana_ddl_horasExtra).change(function(){
    $('#' + id_datatable_horasExtra).empty();
    $('#' + id_datatable_horasExtra).addClass('hidden');
    $('#' + nuevo.id).empty();
    $('#' + id_table_horasExtra).empty();
});

$("#" + id_obra_ddl_horasExtra).change(function(){
    $('#' + nuevo.id).empty();
    $('#' + id_datatable_horasExtra).empty();
    $('#' + id_datatable_horasExtra).addClass('hidden');
    $('#' + id_table_horasExtra).empty();
    nuevo = tableHorasExtra.insertRow(0);
    var year = $('#' + id_year_ddl_horasExtra + " option:selected").val();
    var semana = $('#' + id_semana_ddl_horasExtra + " option:selected").val();
    firebase.database().ref(rama_bd_pagos_nomina + "/" + year + "/" + semana).once('value').then(function(snapshot){
        var nomina = snapshot.val();
        var terminada = snapshot.val().terminada;
        if(terminada){//AQUI redefinir tabla
            //Cargar tabla con datos
            var datos_horasExtra = [];
            var obra = nomina[$("#" + id_obra_ddl_horasExtra + " option:selected").val()];
            obra.child("trabajadores").forEach(function(trabSnap){
                firebase.database().ref(rama_bd_trabajadores + "/" + trabSnap.key).once('value').then(function(childSnap){
                    var trabajador = childSnap.val();
                    var nom = trabajador.nomina[year][semana];
                    var chamba_lu = "-";
                    var chamba_ma = "-";
                    var chamba_mi = "-";
                    var chamba_ju = "-";
                    var chamba_vi = "-";
                    if(nom.jueves.obra == $('#' + id_obra_ddl_horasExtra + " option:selected").val()){
                        chamba_ju = nom.jueves.proceso;
                    }
                    if(nom.viernes.obra == $('#' + id_obra_ddl_horasExtra + " option:selected").val()){
                        chamba_vi = nom.viernes.proceso;
                    }
                    if(nom.lunes.obra == $('#' + id_obra_ddl_horasExtra + " option:selected").val()){
                        chamba_lu = nom.lunes.proceso;
                    }
                    if(nom.martes.obra == $('#' + id_obra_ddl_horasExtra + " option:selected").val()){
                        chamba_ma = nom.martes.proceso;
                    }
                    if(nom.miercoles.obra == $('#' + id_obra_ddl_horasExtra + " option:selected").val()){
                        chamba_mi = nom.miercoles.proceso;
                    }

                    datos_horasExtra.push([trabajador.id_trabajador, trabajador.nombre, trabajador.jefe, trabajador.especialidad, chamba_ju, chamba_vi, chamba_lu, chamba_ma, chamba_mi, trabajador.sueldo_base,/*nom.horas_extra.total_horas,/* nom.diversos,//Hay que desplegarlos separados*/ nom.impuestos, nom.total]);
                    $('#' + id_datatable_horasExtra).removeClass('hidden');
                    var tabla_procesos = $('#'+ id_datatable_horasExtra).DataTable({
                        destroy: true,
                        data: datos_horasExtra,
                        dom: 'Bfrtip',
                        buttons: ['excel'],
                        columns: [
                            {title: "ID",width: 70},
                            {title: "NOMBRE",width: 150},
                            {title: "EMPLEADOR",width: 70},
                            {title: "ESP",width: 70},
                            {title: "JUEVES",width: 70},
                            {title: "VIERNES",width: 70},
                            {title: "LUNES",width: 70},
                            {title: "MARTES",width: 70},
                            {title: "MIERCOLES",width: 70},
                            {title: "SUELDO BASE",width: 70},
                            {title: "IMPUESTOS",width: 70},
                            {title: "TOTAL",width: 70},
                        ],
                        language: idioma_espanol,
                    }); 
                });
            });
        } else {
            //Cargar matriz (no necesariamente tabla) con ddls y textfield
            firebase.database().ref(rama_bd_obras_prod).orderByChild("nombre").equalTo($('#' + id_obra_ddl_horasExtra + " option:selected").val()).once('child_added').then(function(snapshot){
                var procesos = [];
                var count_proc = 0;
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
                //Carga todos los registros hechos
                obra.child('trabajadores').forEach(function(childSnapshot){
                    childSnapshot.child('horas_extra').forEach(function(horasSnap){
                        if(horasSnap.key != "total_horas"){
                            cargaRenglonHorasExtra(childSnapshot.val(), procesos);
                        }
                    });
                });

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
                                cargaRenglonHorasExtra(trabajador, procesos);
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
                                    cargaRenglonHorasExtra(trabajador, procesos);
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


function cargaRenglonHorasExtra(trabajador,procesos,nuevo,fecha,horas,proc){
    //If !nuevo, fecha, horas y proc se bloquean, y meter parámetros nuevos cada que llamo la funcion AQUI
    var row = tableHorasExtra.insertRow(0);
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

    var fecha = "";
    fecha_label.id = "fecha_" + entradas;
    cell_fecha.appendChild(fecha);

    var horas = document.createElement('input');
    horas.type = "text";
    horas_label.id = "horas_" + entradas;
    horas.placeholder = "Horas trabajadas";
    cell_horas.appendChild(horas);

    var proc = document.createElement('select');
    for(i=0;i<procesos.length;i++){
        var option = document.createElement('OPTION');
        option.text = procesos[i];
        option.value = procesos[i];
        proc.appendChild(option);
    }
    proc_label.id = "proc_" + entradas;
    cell_proc.appendChild(proc);

    entradas++;
}

$('#' + id_guardar_button_horasExtra).click(function(){
    var year = $('#' + id_year_ddl_horasExtra + " option:selected").val();
    var semana = $('#' + id_semana_ddl_horasExtra + " option:selected").val();
    var obra = $('#' + id_obra_ddl_horasExtra + " option:selected").val();
    var total_horas = 0;
    for(i=0;i<entradas;i++){
        var id_trabajador = document.getElementById("id_" + i).innerHTML;
        
        var he = {
            horas: $('#horas_' + i).val(),
            proceso: $('#proc_' + i + " option:selected").val(), 
            fecha: new Date($('#fecha_' + i).val()).getTime(),
        }
        var he_con_obra = {
            horas: $('#horas_' + i).val(),
            proceso: $('#proc_' + i + " option:selected").val(), 
            fecha: new Date($('#fecha_' + i).val()).getTime(),
            obra: obra,
        }
        //Checar asincronía
        total_horas += parseFloat($('#horas_' + i).val());
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
    }
    //Sumar total_horas a lo que ya está en total horas en la base de datos (nomina y trabajadores)
    //Checar asincronia
    firebase.database().ref(rama_bd_pagos_nomina + "/" + year + "/" + semana + "/" + obra + "/trabajadores/" + id_trabajador + "/horas_extra/total_horas").once('value').then(function(snapshot){
        var horas_previas = snapshot.val();
        var horas_nuevas = parseFloat(horas_previas) + total_horas;
        firebase.database().ref(rama_bd_pagos_nomina + "/" + year + "/" + semana + "/" + obra + "/trabajadores/" + id_trabajador + "/horas_extra/total_horas").set(horas_nuevas)
    });
    firebase.database().ref(rama_bd_trabajadores + "/" + id_trabajador + "/nomina/" + year + "/" + semana + "/horas_extra/total_horas").once('value').then(function(snapshot){
        var horas_previas = snapshot.val();
        var horas_nuevas = parseFloat(horas_previas) + total_horas;
        firebase.database().ref(rama_bd_trabajadores + "/" + id_trabajador + "/nomina/" + year + "/" + semana + "/horas_extra/total_horas").set(horas_nuevas)
    });
});

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
