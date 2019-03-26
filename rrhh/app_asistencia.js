var id_semana_ddl_asistencia = "semanaDdlAsistencia";
var id_year_ddl_asistencia = "yearDdlAsistencia";
var id_obra_ddl_asistencia = "obraDdlAsistencia";
var id_guardar_button_asistencia = "guardarButtonAsistencia";
var id_terminar_button_asistencia = "terminarButtonAsistencia";

var id_datatable_asistencia = "dataTableAsistencia";

var id_lista_table_asistencia = "divAsistencia";

var id_tab_asistencia = "tabAsistencia";

var rama_bd_pagos_nomina = "produccion/pagos_nomina";
var rama_bd_obras_prod = "produccion/obras";
var rama_bd_trabajadores = "produccion/trabajadores";

var nuevo;
var trabajadores = [];

var tableAsistencia = document.getElementById(id_lista_table_asistencia)

$('#' + id_tab_asistencia).click(function(){
    $('#' + id_datatable_asistencia).empty();
    $('#' + id_datatable_asistencia).addClass('hidden');
    $('#' + id_lista_table_asistencia).empty();
    trabajadores = [];
    $('#' + id_semana_ddl_asistencia).empty();
    $('#' + id_year_ddl_asistencia).empty();
    $('#' + id_obra_ddl_asistencia).empty();
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
    
    nuevo = tableAsistencia.insertRow(0);
    nuevo.id = "nuevo_trabajadorasistencia";
    
});

$('#' + id_year_ddl_asistencia).change(function(){
    $('#' + id_datatable_asistencia).empty();
    $('#' + id_datatable_asistencia).addClass('hidden');
    $('#' + nuevo.id).empty();
    $('#' + id_lista_table_asistencia).empty();
    trabajadores = [];
    var year = $('#' + id_year_ddl_asistencia + " option:selected").val();
    if(year < getWeek(new Date().getTime())[1]){
        var ult_sem = getWeek(new Date(year-1,12,31).getTime())[0];
        var select = document.getElementById(id_semana_ddl_asistencia);
        for(i=ult_sem;i>0;i--){
            var option = document.createElement('option');
            option.text = option.value = i;
            select.appendChild(option);
        }
    }
});

$('#' + id_semana_ddl_asistencia).change(function(){
    $('#' + id_datatable_asistencia).empty();
    $('#' + id_datatable_asistencia).addClass('hidden');
    $('#' + nuevo.id).empty();
    $('#' + id_lista_table_asistencia).empty();
    trabajadores = [];
});

$("#" + id_obra_ddl_asistencia).change(function(){
    $('#' + nuevo.id).empty();
    $('#' + id_datatable_asistencia).empty();
    $('#' + id_datatable_asistencia).addClass('hidden');
    $('#' + id_lista_table_asistencia).empty();
    trabajadores = [];
    headersAsistencia();
    nuevo = tableAsistencia.insertRow(1);
    nuevo.id = "nuevo_trabajador_asistencia";
    var year = $('#' + id_year_ddl_asistencia + " option:selected").val();
    var semana = $('#' + id_semana_ddl_asistencia + " option:selected").val();
    firebase.database().ref(rama_bd_pagos_nomina + "/" + year + "/" + semana + "/terminada").once('value').then(function(snapshot){
        var terminada = snapshot.val();//Revisar si jala porque chance json porque value
        if(terminada){
            //Cargar tabla con datos
            var datos_asistencia = [];
            firebase.database().ref(rama_bd_pagos_nomina + "/" + year + "/" + semana + "/" + $("#" + id_obra_ddl_asistencia + " option:selected").val() + "/trabajadores").once('value').then(function(snapshot){
                snapshot.forEach(function(trabSnap){
                    firebase.database().ref(rama_bd_trabajadores + "/" + trabSnap.key).once('value').then(function(childSnap){
                        var trabajador = childSnap.val();
                        var nom = trabajador.nomina[year][semana];
                        var chamba_lu = "-";
                        var chamba_ma = "-";
                        var chamba_mi = "-";
                        var chamba_ju = "-";
                        var chamba_vi = "-";
                        if(nom.jueves.obra == $('#' + id_obra_ddl_asistencia + " option:selected").val()){
                            chamba_ju = nom.jueves.proceso;
                        }
                        if(nom.viernes.obra == $('#' + id_obra_ddl_asistencia + " option:selected").val()){
                            chamba_vi = nom.viernes.proceso;
                        }
                        if(nom.lunes.obra == $('#' + id_obra_ddl_asistencia + " option:selected").val()){
                            chamba_lu = nom.lunes.proceso;
                        }
                        if(nom.martes.obra == $('#' + id_obra_ddl_asistencia + " option:selected").val()){
                            chamba_ma = nom.martes.proceso;
                        }
                        if(nom.miercoles.obra == $('#' + id_obra_ddl_asistencia + " option:selected").val()){
                            chamba_mi = nom.miercoles.proceso;
                        }

                        datos_asistencia.push([trabajador.id_trabajador, trabajador.nombre, trabajador.jefe, trabajador.especialidad, chamba_ju, chamba_vi, chamba_lu, chamba_ma, chamba_mi, trabajador.sueldo_base,/*nom.horas_extra.total_horas,/* nom.diversos,//Hay que desplegarlos separados*/ nom.impuestos, nom.total]);
                        $('#' + id_datatable_asistencia).removeClass('hidden');
                        var tabla_procesos = $('#'+ id_datatable_asistencia).DataTable({
                            destroy: true,
                            data: datos_asistencia,
                            dom: 'Bfrtip',
                            buttons: ['excel'],//, 'colvis'],
                            //https://datatables.net/extensions/buttons/
                            //https://datatables.net/reference/button/colvis
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
                                //{title: "HORAS EXTRA",width: 70},
                                //{title: "DIVERSOS",width: 70},//hay que desplegarlos separados
                                {title: "IMPUESTOS",width: 70},
                                {title: "TOTAL",width: 70},
                            ],
                            language: idioma_espanol,
                        }); 
                    });
                });
            });
        } else {
            //Cargar matriz (no necesariamente tabla) con ddls y textfield
            firebase.database().ref(rama_bd_obras_prod).orderByChild("nombre").equalTo($('#' + id_obra_ddl_asistencia + " option:selected").val()).once('child_added').then(function(snapshot){
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
                //Carga todos los trabajadores
                firebase.database().ref(rama_bd_trabajadores).once('value').then(function(snapshot){
                    //revisa si tienen esta obra asignada
                    snapshot.forEach(function(childSnapshot){
                        childSnapshot.child("obra_asignada").forEach(function(obraSnap){
                            if(obraSnap.val() == $("#" + id_obra_ddl_asistencia + " option:selected").val()){
                                var trabajador = childSnapshot.val();
                                cargaRenglon(trabajador,count_proc,procesos,semana,year);
                            }
                        });
                    });
                });
                //Crea 2 textfields para añadir trabajadores que no tengan la obra registrada
                var cell_id = nuevo.insertCell(0);
                var t_id = document.createElement('input');
                t_id.id = "t_id";
                t_id.placeholder = "ID";
                cell_id.appendChild(t_id);
                $('#t_id').change(function(){
                    if($('#' + t_id.id).val() != ""){
                        var i = 0;
                        var existe = false;
                        while(i<trabajadores.length && !existe){
                            if($('#t_id').val() == trabajadores[i][0]){
                                existe = true;
                            }
                            i++;
                        }
                        if(!existe){
                            firebase.database().ref(rama_bd_trabajadores + "/" + $('#' + t_id.id).val()).once('value').then(function(snapshot){
                                var trabajador = snapshot.val();
                                if(trabajador != null){
                                    cargaRenglon(trabajador,count_proc,procesos,semana,year);
                                    $('#t_id').val("");
                                } else {
                                    alert("No existe un trabajador con ese ID");
                                }
                            });
                        } else {
                            alert("El trabajador ya está en la lista");
                            $('#t_id').val("");
                        }
                    }
                });
                var cell_nombre = nuevo.insertCell(1);
                var t_nombre = document.createElement('input');
                t_nombre.id = "t_nombre"
                t_nombre.placeholder = "Nombre";
                cell_nombre.appendChild(t_nombre);
                $('#t_nombre').change(function(){
                    if($('#' + t_nombre.id).val() != ""){
                        var i = 0;
                        var existe = false;
                        while(i<trabajadores.length && !existe){
                            if($('#t_nombre').val() == trabajadores[i][1]){
                                existe = true;
                            }
                            i++;
                        }
                        if(!existe){
                            firebase.database().ref(rama_bd_trabajadores).orderByChild("nombre").equalTo($('#' + t_nombre.id).val()).once('value').then(function(snapshot){
                                snapshot.forEach(function(childSnap){
                                    var trabajador = childSnap.val();
                                    console.log(trabajador)
                                    if(trabajador != null){
                                        cargaRenglon(trabajador,count_proc,procesos,semana,year);
                                        $('#t_nombre').val("");
                                    } else {
                                        alert("No existe un trabajador con ese nombre");
                                    }
                                });
                            });
                        } else {
                            alert("El trabajador ya está en la lista");
                            $('#t_nombre').val("");
                        }
                    }
                });
            });
        }
    });
});

//Jala trabajador de rama_bd_trabajadores, procesos es el array con los procesos de la obra, count_proc es el length de procesos, y semana es un int
//Chance hay que ponerles diferentes nomvres a los option de cada dia
function cargaRenglon(trabajador, count_proc, procesos, semana, year){
    var nom;
    var bool_nom;

    if(!trabajador["nomina"]){
        nom = "";
        bool_nom = false;
    } else if(!trabajador["nomina"][year]) {
        nom = "";
        bool_nom = false;
    } else if(!trabajador["nomina"][year][semana]){
        nom = "";
        bool_nom = false;
    } else {
        nom = trabajador["nomina"][year][semana];
        bool_nom = true;
    }
    var row = tableAsistencia.insertRow(1);
    var cell_id = row.insertCell(0);
    var cell_nombre = row.insertCell(1);
    var cell_ju = row.insertCell(2);
    var cell_vi = row.insertCell(3);
    var cell_lu = row.insertCell(4);
    var cell_ma = row.insertCell(5);
    var cell_mi = row.insertCell(6);
    //----LABELS----
    var id_label = document.createElement('label');
    id_label.innerHTML = trabajador.id_trabajador;
    var nombre_label = document.createElement('label');
    nombre_label.innerHTML = trabajador.nombre;
    cell_id.appendChild(id_label);
    cell_nombre.appendChild(nombre_label);

    ddlDia("jueves",cell_ju,trabajador.id_trabajador,bool_nom,nom,count_proc,procesos);
    ddlDia("viernes",cell_vi,trabajador.id_trabajador,bool_nom,nom,count_proc,procesos);
    ddlDia("lunes",cell_lu,trabajador.id_trabajador,bool_nom,nom,count_proc,procesos);
    ddlDia("martes",cell_ma,trabajador.id_trabajador,bool_nom,nom,count_proc,procesos);
    ddlDia("miercoles",cell_mi,trabajador.id_trabajador,bool_nom,nom,count_proc,procesos);

    trabajadores[trabajadores.length] = [trabajador.id_trabajador, trabajador.nombre];
}

function ddlDia(dia,row,id_trabajador,bool_nom,nom,count_proc,procesos){
    var dia_corto = dia.substring(0,2);
    var ddl = document.createElement('select');
    ddl.id = "chamba_" + id_trabajador + "_" + dia_corto;
    var obra = $('#' + id_obra_ddl_asistencia + " option:selected").val();
    var otra_obra = false;
    var asistencia = false;
    if(bool_nom){
        if(nom[dia]){
            if(nom[dia].obra == obra || nom[dia].proceso == "NA"){
                asistencia = true;
            } else {
                otra_obra = true
            }
        }
    }
    if(otra_obra){
        var option = document.createElement('option');
        option.text = "Otra obra";
        option.value = 0;
        ddl.appendChild(option);
        ddl.disabled = true;
    } else {
        var option = document.createElement('option');
        option.text = "Falta";
        option.value = 0;
        ddl.appendChild(option);
        var option3 = document.createElement('option');
        option3.text = "Parado";
        option3.value = 0.2;
        ddl.appendChild(option3);
        for(i=0;i<count_proc;i++){
            var option2 = document.createElement('OPTION');
            option2.text = procesos[i];
            option2.value = 0.2;
            ddl.appendChild(option2);
        }
        if(asistencia){
            for(var i = 0; i < ddl.length; i++){
                if(ddl[i].text == nom[dia].proceso){
                    ddl.selectedIndex = i;
                }
            }
        }
    }
    row.appendChild(ddl);
}

$('#' + id_guardar_button_asistencia).click(function(){
    var year = $('#' + id_year_ddl_asistencia + " option:selected").val();
    var semana = $('#' + id_semana_ddl_asistencia + " option:selected").val();
    var obra = $('#' + id_obra_ddl_asistencia + " option:selected").val();
    for(i=0;i<trabajadores.length;i++){
        var id_trabajador = trabajadores[i][0];
        updateDia(id_trabajador,"jueves",semana,year);
        updateDia(id_trabajador,"viernes",semana,year);
        updateDia(id_trabajador,"lunes",semana,year);
        updateDia(id_trabajador,"martes",semana,year);
        updateDia(id_trabajador,"miercoles",semana,year); 

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
                if($("#chamba_" + id_trabajador + "_lu option:selected").text() != "Falta" && $("#chamba_" + id_trabajador + "_ma option:selected").text() != "Falta" && $("#chamba_" + id_trabajador + "_mi option:selected").text() != "Falta" && $("#chamba_" + id_trabajador + "_ju option:selected").text() != "Falta" && $("#chamba_" + id_trabajador + "_vi option:selected").text() != "Falta"){
                    firebase.database().ref(rama_bd_trabajadores + "/" + id_trabajador + "/obras_asignadas/" + i).set(obra);
                }
            }
        });
    }
    alert("Cambios realizados");
});

function updateDia(id_trabajador,dia,semana,year){
    var dia_corto = dia.substring(0,2);
    var proceso = $("#chamba_" + id_trabajador + "_" + dia_corto + " option:selected").text();
        var asis;
        if(proceso == "Falta" || proceso == "Otra obra" || proceso == ""){
            asis = {
                asistencia: false,
                proceso: "NA",
            }
            if(proceso == "Falta"){
                //Si es falta automaticamente lo tengo que subir como falta, porque si está en otra obra va a decir "Otra obra", no falta
                //firebase.database().ref(rama_bd_trabajadores + "/" + id_trabajador + "/nomina/" + year + "/" + semana + "/" + dia + "/obra").once('value').then(function(snapshot){
                //    var obra = snapshot.val();
                //    if(obra == $('#' + id_obra_ddl_asistencia + " option:selected").val()){
                var asis_tra = {
                    obra: "NA",
                    proceso: "NA",
                    asistencia: false,
                }
                firebase.database().ref(rama_bd_trabajadores + "/" + id_trabajador + "/nomina/" + year + "/" + semana + "/" + dia).set(asis_tra);
                //    }
                //});
            }
        } else {
            asis = {
                asistencia: true,
                proceso: proceso,
            }
            var asis_tra = {
                obra: $('#' + id_obra_ddl_asistencia + " option:selected").val(),
                proceso: proceso,
                asistencia: true,
            }
            firebase.database().ref(rama_bd_trabajadores + "/" + id_trabajador + "/nomina/" + year + "/" + semana + "/" + dia).set(asis_tra);
        }
        firebase.database().ref(rama_bd_pagos_nomina + "/" + year + "/" + semana + "/" + $('#' + id_obra_ddl_asistencia + " option:selected").val() + "/trabajadores/" + id_trabajador + "/dias/" + dia).set(asis);   
}

$('#' + id_terminar_button_asistencia).click(function(){
//PARA LOS BOTONES USA EL ARREGLO DE TRABAJADORES EN EL QUE ESTAN SUS IDs
//Terminar debería estar en otra pestaña, y jalar año y semana de ddls
    //var fecha = getWeek(new Date().getTime());
    //firebase.database().ref(rama_bd_pagos_nomina + "/" + fecha[1] + "/" + fecha[0] + "/" + terminada).set(true);

//Button terminar
    //Sumar horas en todas direcciones
        //en trabajadores
        //en nomina
        //en kaizen
    //Revisar y anotar faltas
    //Reasignar obras
    //Actualizar obra/terminada = true
});

function headersAsistencia() {
  var row = tableAsistencia.insertRow(0);
  var cell1 = row.insertCell(0);
  var cell2 = row.insertCell(1);
  var cell3 = row.insertCell(2);
  var cell4 = row.insertCell(3);
  var cell5 = row.insertCell(4);
  var cell6 = row.insertCell(5);
  var cell7 = row.insertCell(6);
  cell1.innerHTML = "ID";
  cell2.innerHTML = "NOMBRE";
  cell3.innerHTML = "JUEVES";
  cell4.innerHTML = "VIERNES";
  cell5.innerHTML = "LUNES";
  cell6.innerHTML = "MARTES";
  cell7.innerHTML = "MIERCOLES";
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
