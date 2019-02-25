var class_table_datatable_procesos = "dataDesplegarProcesos";
var class_tab_procesos = "tabCatalogoProceso";
//http://live.datatables.net/bodanole/4053/edit
var nombre_seleccionado;

//cdn.datatables.net/colvis/1.1.2/css/dataTables.colVis.css
//cdn.datatables.net/colvis/1.1.2/css/dataTables.colvis.jqueryui.css
//cdn.datatables.net/colvis/1.1.2/css/dataTables.colVis.min.css

//cdn.datatables.net/colvis/1.1.2/js/dataTables.colVis.js
//cdn.datatables.net/colvis/1.1.2/js/dataTables.colVis.min.js

var rama_bd_obras_magico = "obras";

$('.' + class_tab_procesos).click(function(){
    //console.log("1")
    loadTablaProcesos();
});

function loadTablaProcesos(){
    var datos_procesos = [];
    firebase.database().ref(rama_bd_obras_magico).once("value").then(function(snapshot){
        snapshot.forEach(function(obraSnap){
            if(obraSnap.val().nombre != "ZObra Prueba"){
                obraSnap.child("procesos").forEach(function(childSnapshot){
                    var proc = childSnapshot.val();
                    if(proc.num_subprocesos == 0){
                        var nombre;
                        if(proc.nombre == undefined){
                            nombre = "NA";
                        } else {
                            nombre = proc.nombre; 
                        }
                        if(proc.tipo != "adicional"){
                            datos_procesos.push([obraSnap.val().clave, proc.clave, nombre,proc.alcance, "-", "-"]);
                        }
                    } else { 
                        childSnapshot.child("subprocesos").forEach(function(subSnap){
                            var subproceso = subSnap.val();
                            var nombre;
                            if(subproceso.nombre == undefined){
                                nombre = "NA";
                            } else {
                                nombre = subproceso.nombre; 
                            }
                            datos_procesos.push([obraSnap.val().clave, proc.clave, nombre, proc.alcance, subproceso.clave, subproceso.alcance]);
                        });
                    }
                    var tabla_procesos = $('.' + class_table_datatable_procesos).DataTable({
                        destroy: true,
                        data: datos_procesos,
                        dom: 'Bfrtip',
                        buttons: ['excel'],
                        columns: [
                            {title: "Clave-Obra",name: "Obra",width: 70},
                            {title: "Proceso (clave)",width: 70},
                            {title: "Proceso (nombre)",width: 70},
                            {title: "Alcance",width: 250},
                            {title: "Subproceso"},
                            {title: "Alcance"},
                        ],
                        rowsGroup: [0,1,2],
                        language: idioma_espanol,
                    });
                }); 
            }           
        });
    });
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
