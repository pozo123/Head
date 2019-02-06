var id_datatable_procesos = "dataDesplegarProcesos";
var id_tab_procesos = "tabDesplegarProcesos";
var nombre_seleccionado;

var rama_bd_obras_prod = "produccion/colaboradores";

$('#' + id_tab_procesos).click(function(){
	loadTablaProcesos();
});

function loadTablaProcesos(){
    var datos_procesos = [];
    firebase.database().ref(rama_bd_obras_prod).once("value").then(function(snapshot){
        snapshot.forEach(function(obraSnap){
            obraSnap.child("procesos").forEach(function(childSnapshot){
                var proc = childSnapshot.val();
                datos_procesos.push([obraSnap.val().nombre, proc.clave, proc.nombre]);
                var tabla_procesos = $('#'+ id_datatable_procesos).DataTable({
                    destroy: true,
                    data: datos_procesos,
                    dom: 'Bfrtip',
                    buttons: ['excel'],
                    columns: [
                        {title: "Obra",width: 150},
                        {title: "Clave",width: 70},
                        {title: "Proceso",width: 70},
                    ],
                    language: idioma_espanol,
                });
            });            
        });
    });
}
