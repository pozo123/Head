//https://datatables.net/examples/api/add_row.html
//AQUI

/*https://code.jquery.com/jquery-3.3.1.js
https://cdn.datatables.net/1.10.19/js/jquery.dataTables.min.js
https://cdn.datatables.net/buttons/1.5.2/js/dataTables.buttons.min.js
https://cdn.datatables.net/buttons/1.5.2/js/buttons.colVis.min.js*/

//Aquí sólo asistencia y horas_extra
    //En otra app meter diversos
    //En otra app meter totales pagados (post-pagadora)
var id_semana_ddl_asistencia = "semanaDdlAsistencia";
var id_year_ddl_asistencia = "yearDdlAsistencia";
var id_obra_ddl_asistencia = "obraDdlAsistencia";
var id_guardar_button_asistencia = "guardarButtonAsistencia";
var id_terminar_button_asistencia = "terminarButtonAsistencia";

var id_datatable_asistencia = "dataTableAsistencia";

var id_lista_div_asistencia = "divAsistencia";

var id_tab_asistencia = "tabAsistencia";

var rama_bd_pagos_nomina = "produccion/pagos_nomina";
var rama_bd_obras_prod = "produccion/obras";
var rama_bd_trabajadores = "produccion/trabajadores";

var nuevo;
var trabajadores = [];

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

    nuevo = document.createElement('div');
    nuevo.id = "nuevo_trabajador";
    document.getElementById(id_lista_div_asistencia).appendChild(nuevo);
});

$("#" + id_obra_ddl_asistencia).change(function(){
    var year = $('#' + id_year_ddl_asistencia + " option:selected").val();
    var semana = $('#' + id_semana_ddl_asistencia + " option:selected").val();
    firebase.database.ref(rama_bd_pagos_nomina + "/" + year + "/" + semana + "/terminada").once('value').then(function(snapshot){
        var terminada = snapshot.val();//Revisar si jala porque chance json porque value
        if(terminada){
            //Cargar tabla con datos
            var datos_asistencia = [];
            firebase.database().ref(rama_bd_pagos_nomina + "/" + year + "/" + semana + "/" + $("#" + id_obra_ddl_asistencia + " option:selected").val()).once('value').then(function(snapshot){
                snapshot.forEach(function(trabSnap){
                    firebase.database().ref(rama_bd_trabajadores + "/" + trabSnap.key).once('child_added').then(function(childSnap){
                        var trabajador = childSnap.val();
                        //No se si el child de aqui abajo jale por lo de child_added/value AQUI
                        var nom = trabajador.nomina.child(year).child(semana);
                        datos_asistencia.push([trabajador.uid, trabajador.nombre, trabajador.jefe, trabajador.especialidad, nom.jueves.obra, nom.jueves.proceso, nom.viernes.obra, nom.viernes.proceso, nom.lunes.obra, nom.lunes.proceso, nom.martes.obra, nom.martes.proceso, nom.miercoles.obra, nom.miercoles.proceso, trabajador.sueldo_base,nom.horas_extra, /*nom.diversos,//Hay que desplegarlos separados*/ nom.impuestos, nom.total]);
                    });
                });
                var tabla_procesos = $('#'+ id_datatable_asistencia).DataTable({
                    destroy: true,
                    data: datos_procesos,
                    dom: 'Bfrtip',
                    buttons: ['excel', 'colvis'],
                    columns: [
                        {title: "ID",width: 70},
                        {title: "NOMBRE",width: 150},
                        {title: "EMPLEADOR",width: 70},
                        {title: "ESP",width: 70},
                        {title: "JUEVES",width: 70},
                        {title: "PROCESO", width: 70},
                        {title: "VIERNES",width: 70},
                        {title: "PROCESO", width: 70},
                        {title: "LUNES",width: 70},
                        {title: "PROCESO", width: 70},
                        {title: "MARTES",width: 70},
                        {title: "PROCESO", width: 70},
                        {title: "MIERCOLES",width: 70},
                        {title: "PROCESO", width: 70},
                        {title: "SUELDO BASE",width: 70},
                        {title: "HORAS EXTRA",width: 70},
                        //{title: "DIVERSOS",width: 70},//hay que desplegarlos separados
                        {title: "IMPUESTOS",width: 70},
                        {title: "TOTAL",width: 70},
                    ],
                    language: idioma_espanol,
                }); 
            });
        } else {
            //Cargar matriz (no necesariamente tabla) con ddls y textfield
            firebase.database().ref(rama_bd_obras_prod).orderByChild("nombre").equalTo($('#' + id_obra_ddl_asistencia + " option:selected").val()).once('child_added').then(function(snapshot){
        		var procesos = [];
        		var count_proc = 0;
        		snapshot.child("procesos").forEach(function(childSnapshot){
        			procesos[count_proc] = childSnapshot.val().clave;
                    count_proc++;
        		});
                //Carga todos los trabajadores con esta obra asignada
                firebase.database().ref(rama_bd_trabajadores).orderByChild("obra_asignada").equalTo($("#" + id_obra_ddl_asistencia + " option:selected").val()).once('value').then(function(snapshot){
                    //A cada uno créale ddls y un textfield
                    //Si ya hay registro de actividad el ddl se bloquea
                    snapshot.forEach(function(childSnapshot){
                        var trabajador = childSnapshot.val();
                        cargaRenglon(trabajador,count_proc,procesos,semana,year);
                    });
                });
                //Crea 2 textfields para añadir trabajadores que no tengan la obra registrada
                var t_id = document.createElement('input');
                t_id.change(function(){
                    firebase.database().ref(rama_bd_trabajadores + "/" + t_id.val()).once('value').then(function(snapshot){
                        var trabajador = snapshot.val();
                        if(trabajador != null){
                            cargaRenglon(trabajador,count_proc,procesos,semana,year);
                            t_id.empty();
                        } else {
                            alert("No existe un trabajador con esa ID");
                        }
                    });
                });
                nuevo.appendChild(t_id);
                var t_nombre = document.createElement('input');
                t_nombre.change(function(){
                    firebase.database().ref(rama_bd_trabajadores).orderByChild("nombre").equalTo(t_nombre.val()).once('value').then(function(snapshot){
                        var trabajador = snapshot.val();
                        if(trabajador != null){
                            cargaRenglon(trabajador,count_proc,procesos,semana,year);
                            t_nombre.empty();
                        } else {
                            alert("No existe un trabajador con ese nombre");
                        }
                    });
                });
                nuevo.appendChild(t_nombre);
            });
        }
    });
});

//Jala trabajador de rama_bd_trabajadores, procesos es el array con los procesos de la obra, count_proc es el length de procesos, y semana es un int
//Chance hay que ponerles diferentes nomvres a los option de cada dia
function cargaRenglon(trabajador, count_proc, procesos, semana, year){
    var nom = trabajador.nomina.child(year).child(semana);//Ver si sí jala AQUI
    var row = document.createElement('div');
    //----JUEVES----
    var ddl_ju = document.createElement('select');
    var obra = $('#' + id_obra_ddl_asistencia + " option:selected").val();
    ddl_ju.id = "chamba_" + trabajador.uid + "_ju";
    if(nom.jueves.asistencia.val()){
        if(nom.jueves.obra.val() == obra){
            var option = document.createElement('option');
            option.text = nom.jueves.proceso;
            option.value = .2;
            ddl_ju.appendChild(option);
            ddl_ju.disabled = true;
        } else {
            var option = document.createElement('option');
            option.text = "Otra obra";
            option.value = 0;
            ddl_ju.appendChild(option);
            ddl_ju.disabled = true;
        }
    } else {
        var option = document.createElement('option');
        option.text = "Falta";
        option.value = 0;
        ddl_ju.appendChild(option);
        var option3 = document.createElement('option');
        option3.text = "Parado";
        option3.value = 0.2;
        ddl_ju.appendChild(option);
        for(i=0;i<count_proc;i++){
            var option2 = document.createElement('OPTION');
            option2.text = procesos[i];
            option2.value = 0.2;
            ddl_ju.appendChild(option2);
        }
    }
    row.appendChild(ddl_ju);
    //----VIERNES----
    var ddl_vi = document.createElement('select');
    ddl_vi.id = "chamba_" + trabajador.uid + "_vi";
    if(nom.viernes.asistencia.val()){
        if(nom.viernes.obra.val() == obra){
            var option = document.createElement('option');
            option.text = nom.viernes.proceso;
            option.value = .2;
            ddl_vi.appendChild(option);
            ddl_vi.disabled = true;
        } else {
            var option = document.createElement('option');
            option.text = "Otra obra";
            option.value = 0;
            ddl_vi.appendChild(option);
            ddl_vi.disabled = true;
        }
    } else {
        var option = document.createElement('option');
        option.text = "Falta";
        option.value = 0;
        ddl_vi.appendChild(option);
        var option3 = document.createElement('option');
        option3.text = "Parado";
        option3.value = 0.2;
        ddl_vi.appendChild(option);
        for(i=0;i<count_proc;i++){
            var option2 = document.createElement('OPTION');
            option2.text = procesos[i];
            option2.value = 0.2;
            ddl_vi.appendChild(option2);
        }
    }
    row.appendChild(ddl_vi);
    //----LUNES----
    var ddl_lu = document.createElement('select');
    ddl_lu.id = "chamba_" + trabajador.uid + "_lu";
    if(nom.lunes.asistencia.val()){
        if(nom.lunes.obra.val() == obra){
            var option = document.createElement('option');
            option.text = nom.lunes.proceso;
            option.value = .2;
            ddl_lu.appendChild(option);
            ddl_lu.disabled = true;
        } else {
            var option = document.createElement('option');
            option.text = "Otra obra";
            option.value = 0;
            ddl_lu.appendChild(option);
            ddl_lu.disabled = true;
        }
    } else {
        var option = document.createElement('option');
        option.text = "Falta";
        option.value = 0;
        ddl_lu.appendChild(option);
        var option3 = document.createElement('option');
        option3.text = "Parado";
        option3.value = 0.2;
        ddl_lu.appendChild(option);
        for(i=0;i<count_proc;i++){
            var option2 = document.createElement('OPTION');
            option2.text = procesos[i];
            option2.value = 0.2;
            ddl_lu.appendChild(option2);
        }
    }
    row.appendChild(ddl_lu);
    //----MARTES----
    var ddl_ma = document.createElement('select');
    ddl_ma.id = "chamba_" + trabajador.uid + "_ma";
    if(nom.martes.asistencia.val()){
        if(nom.martes.obra.val() == obra){
            var option = document.createElement('option');
            option.text = nom.martes.proceso;
            option.value = .2;
            ddl_ma.appendChild(option);
            ddl_ma.disabled = true;
        } else {
            var option = document.createElement('option');
            option.text = "Otra obra";
            option.value = 0;
            ddl_ma.appendChild(option);
            ddl_ma.disabled = true;
        }
    } else {
        var option = document.createElement('option');
        option.text = "Falta";
        option.value = 0;
        ddl_ma.appendChild(option);
        var option3 = document.createElement('option');
        option3.text = "Parado";
        option3.value = 0.2;
        ddl_ma.appendChild(option);
        for(i=0;i<count_proc;i++){
            var option2 = document.createElement('OPTION');
            option2.text = procesos[i];
            option2.value = 0.2;
            ddl_ma.appendChild(option2);
        }
    }
    row.appendChild(ddl_ma);
    //----MIERCOLES----
    var ddl_mi = document.createElement('select');
    ddl_mi.id = "chamba_" + trabajador.uid + "_mi";
    if(nom.miercoles.asistencia.val()){
        if(nom.miercoles.obra.val() == obra){
            var option = document.createElement('option');
            option.text = nom.miercoles.proceso;
            option.value = .2;
            ddl_mi.appendChild(option);
            ddl_mi.disabled = true;
        } else {
            var option = document.createElement('option');
            option.text = "Otra obra";
            option.value = 0;
            ddl_mi.appendChild(option);
            ddl_mi.disabled = true;
        }
    } else {
        var option = document.createElement('option');
        option.text = "Falta";
        option.value = 0;
        ddl_mi.appendChild(option);
        var option3 = document.createElement('option');
        option3.text = "Parado";
        option3.value = 0.2;
        ddl_mi.appendChild(option);
        for(i=0;i<count_proc;i++){
            var option2 = document.createElement('OPTION');
            option2.text = procesos[i];
            option2.value = 0.2;
            ddl_mi.appendChild(option2);
        }
    }
    row.appendChild(ddl_mi);
    //----HORAS EXTRA----
    var horas_extra = document.createElement('input');
    horas_extra.type = "text";
    horas_extra.id = "he_" + trabajador.uid;
    horas_extra.value = nom.horas_extra.val();
    row.appendChild(horas_extra);

    trabajadores[trabajadores.length] = trabajador.uid;

    document.getElementById(id_lista_div_asistencia).insertBefore(row, nuevo);
}

$('#' + id_guardar_button_asistencia).click(function(){
    var year = $('#' + id_year_ddl_asistencia + " option:selected").val();
    var semana = $('#' + id_semana_ddl_asistencia + " option:selected").val();
    var obra = $('#' + id_obra_ddl_asistencia + " option:selected").val();
    for(i=0;i<trabajadores.length;i++){
        var uid = trabajadores[i];
        updateDia(uid,"jueves",semana,year);
        updateDia(uid,"viernes",semana,year);
        updateDia(uid,"lunes",semana,year);
        updateDia(uid,"martes",semana,year);
        updateDia(uid,"miercoles",semana,year); 
        var he = $('#he_' + uid).val(); 
        firebase.database().ref(rama_bd_trabajadores + "/" + uid + "/nomina/" + year + "/" + semana + "/horas_extra").set(he);
        firebase.database().ref(rama_bd_pagos_nomina + "/" + year + "/" + semana + "/" + obra + "/" + uid + "/horas_extra").set(he);   
    }
});

function updateDia(uid,dia,semana,year){
    var dia_corto = dia.substring(0,2);
    var proceso = $("#chamba_" + trabajador.uid + "_" + dia_corto + " option:selected").val();
        var asis;
        if(proceso == "Falta" || proceso == "Otra obra"){
            asis = {
                asistencia: false,
                proceso: "NA",
            }
        } else {
            asis = {
                asistencia: true,
                proceso: proceso,
            }
            var asis_tra = {
                obra: obra,
                proceso: proceso,
                asistencia: true,
            }
            firebase.database().ref(rama_bd_trabajadores + "/" + uid + "/nomina/" + year + "/" + semana + "/" + dia).set(asis_tra);
        }
        firebase.database().ref(rama_bd_pagos_nomina + "/" + year + "/" + semana + "/" + obra + "/" + uid + "/dias/" + dia).set(asis);   
}

$('#' + id_terminar_button_asistencia).click(function(){
//PARA LOS BOTONES USA EL ARREGLO DE TRABAJADORES EN EL QUE ESTAN SUS IDs
//Button terminar
    //Sumar horas en todas direcciones
        //en trabajadores
        //en nomina
        //en kaizen
    //Revisar y anotar faltas
    //Reasignar obras
    //Actualizar obra/terminada = true
});


/*function addNewWey(dt){
    var tabla_procesos = $('#'+ id_datatable_asistencia).DataTable();
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
}*/

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
