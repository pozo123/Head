var rama_bd_tipos_presupuesto = "tipos_presupuesto";
var rama_bd_generos = "generos";
var rama_bd_obras = "obras";
var rama_bd_reqs = "reqs";
var rama_bd_exclusiones = "exclusiones";
var rama_bd_clientes = "clientes";
var rama_bd_inges = "inges";

var id_datatable_clientes_bibliotecas = "dataTableClientes";
var id_datatable_exclusiones_bibliotecas = "dataTableExclusiones";
var id_datatable_generos_bibliotecas = "dataTableGeneros";
var id_datatable_tipos_presupuesto_bibliotecas = "dataTableTipos";
var id_datatable_reqs_bibliotecas = "dataTableReqs";
var id_datatable_obras_bibliotecas = "dataTableObras";
var id_datatable_inges_bibliotecas = "dataTableInges";
var id_datatable_presupuestos_bibliotecas = "dataTablePresu";
var id_datatable_atn_bibliotecas = "dataTableAtn";

var id_tab_clientes_bibliotecas = "tabBibClientes"
var id_tab_colaborador_bibliotecas = "tabBibColaborador"
var id_tab_obras_bibliotecas = "tabBibObras"
var id_tab_presupuestos_bibliotecas = "tabBibPresupuestos"
var id_tab_atencion_bibliotecas = "tabBibAtencion"
var id_tab_reqsExcs_bibliotecas = "tabBibReqsExcs"
var id_tab_tiposGens_bibliotecas = "tabBibTiposGens"

var options_bibliotecas = { year: 'numeric', month: 'numeric', day: 'numeric' };

//_____POR MODAL______
var id_cliente_modal_editar_bibliotecas = "clienteModalEditar";

var id_clave_cliente_editar_bibliotecas = "claveClienteEditar";
var id_nombre_cliente_editar_bibliotecas = "nombreClienteEditar";
var id_tel_cliente_editar_bibliotecas = "telClienteEditar";
var id_dir_calle_cliente_editar_bibliotecas = "dir_calleClienteEditar";
var id_dir_numero_cliente_editar_bibliotecas = "dir_numeroClienteEditar";
var id_dir_colonia_cliente_editar_bibliotecas = "dir_coloniaClienteEditar";
var id_dir_delegacion_cliente_editar_bibliotecas = "dir_delegacionClienteEditar";
var id_dir_ciudad_cliente_editar_bibliotecas = "dir_ciudadClienteEditar";
var id_dir_cp_cliente_editar_bibliotecas = "dir_cpClienteEditar";

var id_editar_cliente_button_bibliotecas = "editarCliente";
//____TERMINA MODAL_____

var nombre_seleccionado;
// métodos para cargar las funciones cuando se den click en los tabs del panel lateral
$('#' + id_tab_clientes_bibliotecas).click(function(){
	loadTablaClientes();
});

$('#' + id_tab_reqsExcs_bibliotecas).click(function(){
	loadTablaExclusionesYReqs();
});

$('#' + id_tab_tiposGens_bibliotecas).click(function(){
	loadTablaGenerosYTipos();
});

$('#' + id_tab_obras_bibliotecas).click(function(){
	loadTablaObras();
});

$('#' + id_tab_colaborador_bibliotecas).click(function(){
	loadTablaInges();
});

$('#' + id_tab_presupuestos_bibliotecas).click(function(){
	loadTablaPresupuestos();
});

$('#' + id_tab_atencion_bibliotecas).click(function(){
	loadTablaAtn();
});

// -----------------------------------------------------------------------------------

function loadTablaClientes(){
	var datos_clientes = [];
	firebase.database().ref(rama_bd_clientes).orderByChild("nombre").on("child_added",function(snapshot){
		var cliente = snapshot.val();
		datos_clientes.push([cliente.nombre, cliente.clave, cliente.telefono, cliente.direccion.calle + ", No. " + cliente.direccion.numero + " Col. " + cliente.direccion.colonia + ", " + cliente.direccion.delegacion + ", " + cliente.direccion.ciudad + " CP " + cliente.direccion.cp]);
		var tabla_clientes = $('#'+ id_datatable_clientes_bibliotecas).DataTable({
            destroy: true,
			data: datos_clientes,
			columns: [
				{title: "Nombre"},
				{title: "Clave"},
				{title: "Telefono"},
				{title: "Direccion", width: 500},
				{defaultContent: "<button type='button' class='editar btn btn-primary'><i class='fas fa-edit'></i></button>"},
			],
            language: idioma_espanol,
		});
		editar_cliente("#" + id_datatable_clientes_bibliotecas + " tbody", tabla_clientes);
	});
}

function editar_cliente(tbody, table){
	$(tbody).on("click", "button.editar",function(){
		var data = table.row($(this).parents("tr")).data();
		if(data){
			console.log(data);
			firebase.database().ref(rama_bd_clientes).orderByChild("nombre").equalTo(data[0]).once('child_added').then(function(snapshot){
				var clien = snapshot.val();
				$('#' + id_clave_cliente_editar_bibliotecas).val(clien.clave);
				$('#' + id_nombre_cliente_editar_bibliotecas).val(clien.nombre);
				$('#' + id_tel_cliente_editar_bibliotecas).val(clien.telefono);
				$('#' + id_dir_calle_cliente_editar_bibliotecas).val(clien.direccion.calle);
				$('#' + id_dir_numero_cliente_editar_bibliotecas).val(clien.direccion.numero);
				$('#' + id_dir_colonia_cliente_editar_bibliotecas).val(clien.direccion.colonia);
				$('#' + id_dir_delegacion_cliente_editar_bibliotecas).val(clien.direccion,delegacion);
				$('#' + id_dir_ciudad_cliente_editar_bibliotecas).val(clien.direccion.ciudad);
				$('#' + id_dir_cp_cliente_editar_bibliotecas).val(clien.direccion.cp);
			});
		nombre_seleccionado = data[0];
		}
	});
}

$('#' + id_editar_cliente_button_bibliotecas).click(function(){
	var nom = $('#' + id_nombre_cliente_editar_bibliotecas).val();
	var cliente = {
		clave: $('#' + id_clave_cliente_editar_bibliotecas).val(),
		nombre: nom,
		telefono: $('#' + id_tel_cliente_editar_bibliotecas).val(),
		direccion: {
			calle: $('#' + id_dir_calle_cliente_editar_bibliotecas).val(),
			numero: $('#' + id_dir_numero_cliente_editar_bibliotecas).val(),
			colonia: $('#' + id_dir_colonia_cliente_editar_bibliotecas).val(),
			delegacion: $('#' + id_dir_delegacion_cliente_editar_bibliotecas).val(),
			ciudad: $('#' + id_dir_ciudad_cliente_editar_bibliotecas).val(),
			cp: $('#' + id_dir_cp_cliente_editar_bibliotecas).val(),
		}
	}
	if(nombre_seleccionado === nom){
		firebase.database().ref(rama_bd_clientes + "/" + nom).update(cliente);
	} else {
		firebase.database().ref(rama_bd_clientes).child(nombre_seleccionado).once('value').then(function(snapshot){
			var data = snapshot.val();
			data.nombre = nom;
			var update = {};
			update[nombre_seleccionado] = null;
			update[nom] = data;
			firebase.database().ref(rama_bd_clientes).update(update);
			firebase.database().ref(rama_bd_clientes + "/" + nom).update(cliente);
		});
	}
});

function loadTablaExclusionesYReqs(){
	var datos_exclusiones = [];
	firebase.database().ref(rama_bd_exclusiones).orderByChild("nombre").on("child_added",function(snapshot){
		var exc = snapshot.val();
		datos_exclusiones.push([exc.nombre]);
		var tabla_exclusiones = $('#'+ id_datatable_exclusiones_bibliotecas).DataTable({
            destroy: true,
			data: datos_exclusiones,
			columns: [
				{title: "Nombre"},
				{defaultContent: "<button type='button' class='editar btn btn-primary'><i class='fas fa-edit'></i></button> <button type='button' class='editar btn btn-danger'><i class='fas fa-trash'></i></button>"},
			],
            language: idioma_espanol,
		});
		editar_exclusion("#" + id_datatable_exclusiones_bibliotecas + " tbody", tabla_exclusiones);
	});

	var datos_reqs = [];
	firebase.database().ref(rama_bd_reqs).orderByChild("nombre").on("child_added",function(snapshot){
		var req = snapshot.val();
		datos_reqs.push([req.nombre, req.esencial]);
		var tabla_reqs = $('#'+ id_datatable_reqs_bibliotecas).DataTable({
            destroy: true,
			data: datos_reqs,
			columns: [
				{title: "Nombre"},
				{title: "Esencial"},
				{defaultContent: "<button type='button' class='editar btn btn-primary'><i class='fas fa-edit'></i></button> <button type='button' class='editar btn btn-danger'><i class='fas fa-trash'></i></button>"},
			],
            language: idioma_espanol,
		});
		editar_req("#" + id_datatable_reqs_bibliotecas + " tbody", tabla_reqs);
	});
}

function editar_exclusion(tbody, table){
	$(tbody).on("click", "button.editar",function(){
		var data = table.row($(this).parents("tr")).data();
		console.log(data);
	});
}

function editar_req(tbody, table){
	$(tbody).on("click", "button.editar",function(){
		var data = table.row($(this).parents("tr")).data();
		console.log(data);
	});
}

function loadTablaGenerosYTipos(){
	var datos_generos = [];
	firebase.database().ref(rama_bd_generos).orderByChild("nombre").on("child_added",function(snapshot){
		var gen = snapshot.val();
		datos_generos.push([gen.nombre, gen.codigo]);
		var tabla_generos = $('#'+ id_datatable_generos_bibliotecas).DataTable({
            destroy: true,
			data: datos_generos,
			columns: [
				{title: "Nombre"},
				{title: "Codigo"},
				{defaultContent: "<button type='button' class='editar btn btn-primary'><i class='fas fa-edit'></i></button> <button type='button' class='editar btn btn-danger'><i class='fas fa-trash'></i></button>"},
			],
            language: idioma_espanol,
		});
		editar_genero("#" + id_datatable_generos_bibliotecas + " tbody", tabla_generos);
	});

	var datos_tipos_presupuesto = [];
	firebase.database().ref(rama_bd_tipos_presupuesto).orderByChild("nombre").on("child_added",function(snapshot){
		var tipo = snapshot.val();
		datos_tipos_presupuesto.push([tipo.nombre, tipo.codigo]);
		var tabla_tipos = $('#'+ id_datatable_tipos_presupuesto_bibliotecas).DataTable({
            destroy: true,
			data: datos_tipos_presupuesto,
			columns: [
				{title: "Nombre"},
				{title: "Codigo"},
				{defaultContent: "<button type='button' class='editar btn btn-primary'><i class='fas fa-edit'></i></button> <button type='button' class='editar btn btn-danger'><i class='fas fa-trash'></i></button>"},
			],
            language: idioma_espanol,
		});
		editar_tipo("#" + id_datatable_tipos_presupuesto_bibliotecas + " tbody", tabla_tipos);
	});
}

function editar_genero(tbody, table){
	$(tbody).on("click", "button.editar",function(){
		var data = table.row($(this).parents("tr")).data();
		console.log(data);
	});
}

function editar_tipo(tbody, table){
	$(tbody).on("click", "button.editar",function(){
		var data = table.row($(this).parents("tr")).data();
		console.log(data);
	});
}

function loadTablaObras(){
	var datos_obras = [];
	firebase.database().ref(rama_bd_obras).orderByChild("nombre").on("child_added",function(snapshot){
		var obra = snapshot.val();
		datos_obras.push([obra.nombre, obra.clave, obra.cliente, obra.direccion.calle + ", No. " + obra.direccion.numero + " Col. " + obra.direccion.colonia + ", " + obra.direccion.delegacion + ", " + obra.direccion.ciudad + " CP " + obra.direccion.cp]);
		var tabla_obras = $('#'+ id_datatable_obras_bibliotecas).DataTable({
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
		editar_obra("#" + id_datatable_obras_bibliotecas + " tbody", tabla_obras);
	});
}

function editar_obra(tbody, table){
	$(tbody).on("click", "button.editar",function(){
		var data = table.row($(this).parents("tr")).data();
		console.log(data);
	});
}

function loadTablaInges(){
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
		var tabla_inges = $('#'+ id_datatable_inges_bibliotecas).DataTable({
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
		editar_inge("#" + id_datatable_inges_bibliotecas + " tbody", tabla_inges);
	});
}

function editar_inge(tbody, table){
	$(tbody).on("click", "button.editar",function(){
		var data = table.row($(this).parents("tr")).data();
		console.log(data);
	});
}

function loadTablaPresupuestos(){
	var datos_presupuestos = [];
	firebase.database().ref(rama_bd_obras).orderByChild("nombre").on("child_added",function(snapshot){
		var obr = snapshot.val();
		firebase.database().ref(rama_bd_obras + "/" + obr.nombre + "/presupuestos").orderByChild("nombre").on("child_added",function(snapshot){
			var presupuesto = snapshot.val();
			var contrato;
			if(presupuesto.contrato === true)
				contrato = "Activo";
			else
				contrato = "No activo";
			var atn = "";
			for(i=0;i<snapshot.child("atencion").numChildren();i++){
				atn = atn + snapshot.child("atencion/" +i).val().id + "\n";
			}
			var fecha_act;
			var cash = "$" + formatMoney(presupuesto.cash_presupuestado);
			if(presupuesto.timestamps.activacion === 0)
				fecha_act = "NA";
				else{
					fecha_act = new Date(presupuesto.timestamps.activacion).toLocaleDateString("es-ES", options_bibliotecas)
				}
				fecha_inicio = new Date(presupuesto.timestamps.startedAt).toLocaleDateString("es-ES", options_bibliotecas)
			//alert(atn);
			datos_presupuestos.push([presupuesto.nombre, obr.nombre, cash, presupuesto.clave, contrato, presupuesto.horas_programadas, fecha_inicio, fecha_act, atn]);
			var tabla_presupuestos = $('#'+ id_datatable_presupuestos_bibliotecas).DataTable({
				destroy: true,
				scrollX: true,
				data: datos_presupuestos,
				columns: [
					{title: "Nombre"},
					{title: "Obra"},
					{title: "Precio total"},
					{title: "Clave"},
					{title: "Estatus"},
					{title: "Horas programadas"},
					{title: "Fecha de creacion"},
					{title: "Fecha de activacion"},
					{title: "AT'N"},
					{defaultContent: "<button type='button' class='editar btn btn-primary'><i class='fas fa-edit'></i></button> <button type='button' class='editar btn btn-danger'><i class='fas fa-trash'></i></button>"},
				],
	            language: idioma_espanol,
			});
			editar_presupuesto("#" + id_datatable_presupuestos_bibliotecas + " tbody", tabla_presupuestos);
		});
	});
}

function editar_presupuesto(tbody, table){
	$(tbody).on("click", "button.editar",function(){
		var data = table.row($(this).parents("tr")).data();
		console.log(data);
	});
}

function loadTablaAtn(){
	var datos_atn = [];
	firebase.database().ref(rama_bd_clientes).orderByChild("nombre").on("child_added",function(snapshot){
		var clie = snapshot.val();
		firebase.database().ref(rama_bd_clientes + "/" + clie.nombre + "/atencion").orderByChild("nombre").on("child_added",function(snapshot){
			var atn = snapshot.val();
			datos_atn.push([atn.nombre, clie.nombre, atn.email, atn.area, atn.celular, atn.extension]);
			var tabla_atn = $('#'+ id_datatable_atn_bibliotecas).DataTable({
	            destroy: true,
				data: datos_atn,
				columns: [
					{title: "Nombre"},
					{title: "Cliente"},
					{title: "Email"},
					{title: "Area"},
					{title: "Celular"},
					{title: "Extension"},
					{defaultContent: "<button type='button' class='editar btn btn-primary'><i class='fas fa-edit'></i></button> <button type='button' class='editar btn btn-danger'><i class='fas fa-trash'></i></button>"},
				],
	            language: idioma_espanol,
			});
			editar_atn("#" + id_datatable_atn_bibliotecas + " tbody", tabla_atn);
		});
	});
}

function editar_atn(tbody, table){
	$(tbody).on("click", "button.editar",function(){
		var data = table.row($(this).parents("tr")).data();
		console.log(data);
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
