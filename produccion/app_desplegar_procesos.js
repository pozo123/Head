//http://live.datatables.net/bodanole/4053/edit
/*
<script src="http://code.jquery.com/jquery-1.11.3.min.js"></script>
<link href="https://nightly.datatables.net/css/jquery.dataTables.css" rel="stylesheet" type="text/css" />
<script src="https://nightly.datatables.net/js/jquery.dataTables.js"></script>
<meta charset=utf-8 />
*/
var class_table_datatable_procesos = "dataDesplegarProcesos";
var class_tab_procesos = "tabCatalogoProceso";
var class_button_colapsar_subprocesos_desplegarProcesos = "colapsarSubpClassDesplegarProcesos";
var class_button_desplegar_subprocesos_desplegarProcesos = "desplegarSubpClassDesplegarProcesos";
var nombre_seleccionado;

var rama_bd_obras_magico = "obras";

$('.' + class_tab_procesos).click(function(){
    loadTablaProcesos();
});

function loadTablaProcesos(){
    var datos_procesos = [];
    var head = document.createElement('thead');
    var foot = document.createElement('tfoot');
    var body = document.createElement('tbody');
    var row_head = document.createElement('tr');
    var row_foot = document.createElement('tr');

    var th_clave = document.createElement('th');
    th_clave.innerHTML = "Clave";
    row_head.appendChild(th_clave);
    row_foot.appendChild(th_clave);
    var th_nombre = document.createElement('th');
    th_nombre.innerHTML = "Nombre";
    row_head.appendChild(th_nombre);
    row_foot.appendChild(th_nombre);
    var th_alcance = document.createElement('th');
    th_alcance.innerHTML = "Alcance";
    row_head.appendChild(th_alcance);
    row_foot.appendChild(th_alcance);

    head.appendChild(row_head);
    foot.appendChild(row_foot);

    firebase.database().ref(rama_bd_obras_magico).once("value").then(function(snapshot){
        snapshot.forEach(function(obraSnap){
            if(obraSnap.val().nombre != "ZObra Prueba"){
                obraSnap.child("procesos").forEach(function(childSnapshot){
                    var proc = childSnapshot.val();
                    if(proc.num_subprocesos == 0){
                        if(proc.tipo != "adicional"){
                            var row = document.createElement('tr');
                            row.id = proc.clave + "_" + obraSnap.val().nombre;//Con los espacios chance truena
                            var clave = document.createElement('td') 
                            clave.innerHTML= proc.clave;
                            var nombre = document.createElement('td')
                            nombre.innerHTML = proc.nombre;
                            var alcance = document.createElement('td')
                            alcance.innerHTML = proc.alcance;
                            var nombreObra = document.createElement('td')
                            nombreObra.innerHTML = obraSnap.val().nombre
                            var consecPadre = document.createElement('td')
                            consecPadre.innerHTML = "-";
                            var consecProc = document.createElement('td')
                            consecProc.innerHTML = proc.clave.substring(proc.clave.length - 2,proc.clave.length)
                            row.appendChild(clave);
                            row.appendChild(nombre);
                            row.appendChild(alcance);
                            row.appendChild(nombreObra);
                            row.appendChild(consecProc);
                            row.appendChild(consecPadre);
                            body.appendChild(row);
                            //datos_procesos.push([obraSnap.val().clave, proc.clave, proc.alcance, "-", "-"]);
                        }
                    } else { 

                        var row = document.createElement('tr');
                        row.id = proc.clave + "_" + obraSnap.val().nombre;//Con los espacios chance truena
                        var clave = document.createElement('td') 
                        clave.innerHTML= proc.clave;
                        var nombre = document.createElement('td')
                        nombre.innerHTML = proc.nombre;
                        var alcance = document.createElement('td')
                        alcance.innerHTML = proc.alcance;
                        var nombreObra = document.createElement('td')
                        nombreObra.innerHTML = obraSnap.val().nombre
                        var consecPadre = document.createElement('td')
                        consecPadre.innerHTML = "-";
                        var consecProc = document.createElement('td')
                        consecProc.innerHTML = proc.clave.substring(proc.clave.length - 2,proc.clave.length)
                        row.appendChild(clave);
                        row.appendChild(nombre);
                        row.appendChild(alcance);
                        row.appendChild(nombreObra);
                        row.appendChild(consecProc);
                        row.appendChild(consecPadre);
                        body.appendChild(row);

                        childSnapshot.child("subprocesos").forEach(function(subSnap){
                            var subproceso = subSnap.val();
                            var row = document.createElement('tr');
                            row.id = subproceso.clave + "_" + obraSnap.val().nombre;//Con los espacios chance truena
                            var clave = document.createElement('td') 
                            clave.innerHTML= subproceso.clave;
                            var nombre = document.createElement('td')
                            nombre.innerHTML = subproceso.nombre;
                            var alcance = document.createElement('td')
                            alcance.innerHTML = subproceso.alcance;
                            var nombreObra = document.createElement('td')
                            nombreObra.innerHTML = obraSnap.val().nombre
                            var consecSubp = document.createElement('td')
                            consecSubp.innerHTML = subproceso.clave.substring(subproceso.clave.length - 2,subproceso.clave.length)
                            var consecProc = document.createElement('td')
                            consecProc.innerHTML = proc.clave.substring(proc.clave.length - 2,proc.clave.length)
                            row.appendChild(clave);
                            row.appendChild(nombre);
                            row.appendChild(alcance);
                            row.appendChild(nombreObra);
                            row.appendChild(consecSubp);
                            row.appendChild(consecProc);
                            body.appendChild(row);
                            //datos_procesos.push([obraSnap.val().clave, proc.clave, proc.alcance, subproceso.clave, subproceso.alcance]);
                        });
                    }
                }); 
            }           
        });
        var table = document.getElementById(class_table_datatable_procesos)
        table.appendChild(head);
        table.appendChild(body);
        table.appendChild(foot);

        var obra_colum = 3;
        var proc_consec_colum = 4;
        var subproc_consec_colum = 5;

        var tabla_procesos = $('.' + class_table_datatable_procesos).DataTable({
            "order": [[ obra_colum, 'asc' ], [ proc_consec_colum, 'asc' ],[ subproc_consec_colum, 'asc' ]],
            "columnDefs": [ 
                { "visible": false, "targets": [obra_colum, proc_consec_colum, subproc_consec_colum] }
            ],
            "lengthMenu": [[-1, 10, 25, 50], ["Todos", 10, 25, 50]],
            destroy: true,
            //data: datos_procesos,
            dom: 'Bfrtip',
            buttons: ['excel'],
            //https://datatables.net/extensions/buttons/
            //https://datatables.net/reference/button/colvis
        
            drawCallback: function ( settings ) {
                var api = this.api();
                var tableRows = api.rows( {page:'current'} ).nodes();
                var lastGroup = null;
                var lastSub = null;   
                var mySubGroup = null;
                $(tableRows).each( function () {
                    var clave_proc = this.id.split("_")[0];
                    groupName = this.id.substring(clave_proc.length + 1, this.id.length);
                    var proc = clave_proc.split("-")[0];
                    var cons = proc.substring(proc.length - 2,proc.length);
                    mySubGroup = cons;//this.cells[3].innerHTML;
                    if ( lastGroup !== groupName ) {
                        $(this).before('<tr class="group"><td colspan="3">' + groupName +'</td></tr>');
                        lastGroup = groupName;
                    }
                    if (lastSub !== mySubGroup) {
                        //console.log(this.id)
                        var father_row = document.getElementById(proc + "_" + groupName);
                        console.log(father_row)
                        console.log(this)
                        father_row.className = father_row.className + " subgroup";
                        //$(father_row).removeClass("subproceso_row");
                        $(this).before(father_row);          
                        lastSub = mySubGroup;  
                    }
                });
            },
            language: idioma_espanol,
        });
     
        // aqui
        $('.' + class_table_datatable_procesos +' tbody').on( 'click', 'tr.group', function () {
            var currentOrder = table.order()[0];
            if ( currentOrder[0] === groupColumn && currentOrder[1] === 'asc' ) {
                table.order( [ groupColumn, 'desc' ] ).draw();
            }
            else {
                table.order( [ groupColumn, 'asc' ] ).draw();
            }
        } );

    });
}

$('.' + class_button_colapsar_subprocesos_desplegarProcesos).on('click', function(){
    $('.subproceso_row').removeClass('hidden');
});

$('.' + class_button_desplegar_subprocesos_desplegarProcesos).on('click', function(){
    $('.subproceso_row').addClass('hidden');
});
//http://live.datatables.net/xovixoju/228/edit

var idioma_espanol = {
    "sProcessing":     "Procesando...",
    "sLengthMenu":     "Mostrar _MENU_ procesos",
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
