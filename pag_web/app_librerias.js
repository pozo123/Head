var rama_bd_tipos_presupuesto = "tipos_presupuesto";
var rama_bd_generos = "generos";
var rama_bd_obras = "obras";
var rama_bd_reqs = "reqs";
var rama_bd_exclusiones = "exclusiones";
var rama_bd_clientes = "clientes";
var rama_bd_inges = "inges";

var id_datatable_clientes_librerias = "dataTableClientes";
var id_datatable_exclusiones_librerias = "dataTableExclusiones";
var id_datatable_generos_librerias = "dataTableGeneros";
var id_datatable_tipos_presupuesto_librerias = "dataTableTipos";
var id_datatable_reqs_librerias = "dataTableReqs";
var id_datatable_obras_librerias = "dataTableObras";
var id_datatable_inges_librerias = "dataTableInges";

$(document).ready(function() {
	
	var datos_clientes = [];
	firebase.database().ref(rama_bd_clientes).orderByChild("nombre").on("child_added",function(snapshot){
		var cliente = snapshot.val();
		datos_clientes.push([cliente.nombre, cliente.clave, cliente.telefono]);
		$('#'+ id_datatable_clientes_librerias).dataTable({
            destroy: true,
			data: datos_clientes,
			columns: [
				{title: "Nombre"},
				{title: "Clave"},
				{title: "Telefono"},
				{defaultContent: "<button type='button' class='editar btn btn-primary'><i class='fas fa-edit'></i></button>"},
			],
            language: idioma_espanol,
		});
	});

	var datos_exclusiones = [];
	firebase.database().ref(rama_bd_exclusiones).orderByChild("nombre").on("child_added",function(snapshot){
		var exc = snapshot.val();
		datos_exclusiones.push([exc.nombre]);
		$('#'+ id_datatable_exclusiones_librerias).dataTable({
            destroy: true,
			data: datos_exclusiones,
			columns: [
				{title: "Nombre"},
				{defaultContent: "<button type='button' class='editar btn btn-primary'><i class='fas fa-edit'></i></button> <button type='button' class='editar btn btn-danger'><i class='fas fa-trash'></i></button>"},
			],
            language: idioma_espanol,
		});
	});

	var datos_generos = [];
	firebase.database().ref(rama_bd_generos).orderByChild("nombre").on("child_added",function(snapshot){
		var gen = snapshot.val();
		datos_generos.push([gen.nombre, gen.codigo]);
		$('#'+ id_datatable_generos_librerias).dataTable({
            destroy: true,
			data: datos_generos,
			columns: [
				{title: "Nombre"},
				{title: "Codigo"},
				{defaultContent: "<button type='button' class='editar btn btn-primary'><i class='fas fa-edit'></i></button> <button type='button' class='editar btn btn-danger'><i class='fas fa-trash'></i></button>"},
			],
            language: idioma_espanol,
		});
	});

	var datos_tipos_presupuesto = [];
	firebase.database().ref(rama_bd_tipos_presupuesto).orderByChild("nombre").on("child_added",function(snapshot){
		var tipo = snapshot.val();
		datos_tipos_presupuesto.push([tipo.nombre, tipo.codigo]);
		$('#'+ id_datatable_tipos_presupuesto_librerias).dataTable({
            destroy: true,
			data: datos_tipos_presupuesto,
			columns: [
				{title: "Nombre"},
				{title: "Codigo"},
				{defaultContent: "<button type='button' class='editar btn btn-primary'><i class='fas fa-edit'></i></button> <button type='button' class='editar btn btn-danger'><i class='fas fa-trash'></i></button>"},
			],
            language: idioma_espanol,
		});
	});

	var datos_reqs = [];
	firebase.database().ref(rama_bd_reqs).orderByChild("nombre").on("child_added",function(snapshot){
		var req = snapshot.val();
		datos_reqs.push([req.nombre, req.esencial]);
		$('#'+ id_datatable_reqs_librerias).dataTable({
            destroy: true,
			data: datos_reqs,
			columns: [
				{title: "Nombre"},
				{title: "Esencial"},
				{defaultContent: "<button type='button' class='editar btn btn-primary'><i class='fas fa-edit'></i></button> <button type='button' class='editar btn btn-danger'><i class='fas fa-trash'></i></button>"},
			],
            language: idioma_espanol,
		});
	});

	var datos_obras = [];
	firebase.database().ref(rama_bd_obras).orderByChild("nombre").on("child_added",function(snapshot){
		var obra = snapshot.val();
		datos_obras.push([obra.nombre, obra.clave, obra.cliente, obra.direccion.calle + ", No. " + obra.direccion.numero + " Col. " + obra.direccion.colonia + ", " + obra.direccion.delegacion + ", " + obra.direccion.ciudad]);
		$('#'+ id_datatable_obras_librerias).dataTable({
            destroy: true,
			data: datos_obras,
			columns: [
				{title: "Nombre"},
				{title: "Clave"},
				{title: "Cliente"},
				{title: "Direccion", width: 500},
				{defaultContent: "<button type='button' class='editar btn btn-primary'><i class='fas fa-edit'></i></button> <button type='button' class='editar btn btn-danger'><i class='fas fa-trash'></i></button>"},
			],
            language: idioma_espanol,
		});
	});

	var datos_inges = [];
	firebase.database().ref(rama_bd_inges).orderByChild("nombre").on("child_added",function(snapshot){
		var inge = snapshot.val();
		var esp;
		if(inge.especialidad === 1)
			esp = "Electricidad";
		else if(inge.especialidad === 2)
			esp = "Plomeria";
		else if(inge.especialidad === 3)
			esp = "Electricidad y plomeria";
		else 
			esp = "NA";
		datos_inges.push([inge.nombre, inge.email, esp]);
		$('#'+ id_datatable_inges_librerias).dataTable({
            destroy: true,
			data: datos_inges,
			columns: [
				{title: "Nombre"},
				{title: "Email"},
				{title: "Especialidad"},
				{defaultContent: "<button type='button' class='editar btn btn-primary'><i class='fas fa-edit'></i></button> <button type='button' class='editar btn btn-danger'><i class='fas fa-trash'></i></button>"},
            ],
            language: idioma_espanol,
		});
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