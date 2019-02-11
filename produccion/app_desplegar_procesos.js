var id_datatable_procesos = "dataDesplegarProcesos";
var id_tab_procesos = "tabDesplegarProcesos";
/*http://live.datatables.net/bodanole/4053/edit
<div class="container">
    <table id="tabDesplegarProcesos" class="display" width="100%">
</table>*/
var nombre_seleccionado;

var rama_bd_obras_magico = "obras";

$('#' + id_tab_procesos).click(function(){
	loadTablaProcesos();
});

function loadTablaProcesos(){
    var datos_procesos = [];
    firebase.database().ref(rama_bd_obras_magico).once("value").then(function(snapshot){
        snapshot.forEach(function(obraSnap){
            obraSnap.child("procesos").forEach(function(childSnapshot){
                var proc = childSnapshot.val();
                if(proc.num_subprocesos == 0){
                    datos_procesos.push([obraSnap.val().nombre, proc.clave, proc.alcance, "-", "-"]);
                } else { 
                    childSnapshot.child("subprocesos").forEach(function(subSnap){
                        var subproceso = subSnap.val();
                        datos_procesos.push([obraSnap.val().nombre, proc.clave, proc.alcance, subproceso.clave, subproceso.alcance]);
                    });
                }
                var tabla_procesos = $('#'+ id_datatable_procesos).DataTable({
                    destroy: true,
                    data: datos_procesos,
                    dom: 'Bfrtip',
                    buttons: ['excel'],
                    columns: [
                        {title: "Obra",name: "Obra",width: 150},
                        {title: "Clave",width: 70},
                        {title: "Alcance",width: 70},
                        {title: "Subproceso"}
                        {title: "Alcance"}
                    ],
                    rowsGroup: [0,1,2],
                    language: idioma_espanol,
                });
            });            
        });
    });
}
