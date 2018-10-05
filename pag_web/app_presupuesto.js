var id_nombre_presupuesto = "presupuestoNombre";
var id_reqs_ddl_presupuesto = "reqs";
var id_add_reqs_button_presupuesto = "add_reqs";
var id_del_reqs_button_presupuesto = "borrar_reqs_asignados";
var lista_reqs_presupuesto = "ListaReqs";
var id_horas_programadas_presupuesto = "horasProgramadas";
var id_registrar_button_presupuesto = "registrarPresupuesto";
var id_obra_ddl_presupuesto = "obraPresupuesto";
var id_tipo_presupuesto_ddl_presupuesto = "DDLtipoPresupuesto"; //Nueva variable
var id_precio_presupuesto = "precioPresupuesto";
var id_precio_sugerido_label_presupuesto = "labelCash";

var rama_bd_tipos_presupuesto = "tipos_presupuesto";
var rama_bd_obras = "obras";
var rama_bd_reqs = "reqs";

//Necesaria si son checkboxes
//var num_max_req = "3";

var precio_hora = 2000;
$('#' + id_horas_programadas_presupuesto).change(function(){
    $('#' + id_precio_sugerido_label_presupuesto).text(""+($('#' + id_horas_programadas_presupuesto).val() * precio_hora));
});

var reqs = [];

$(document).ready(function() {

    var select = document.getElementById(id_reqs_ddl_presupuesto);   
    var option = document.createElement('option');
    option.style = "display:none";
    option.text = option.value = "";
    select.appendChild(option);

    var select2 = document.getElementById(id_obra_ddl_presupuesto);   
    var option2 = document.createElement('option');
    option2.style = "display:none";
    option2.text = option2.value = "";
    select2.appendChild(option2);

    var select3 = document.getElementById(id_tipo_presupuesto_ddl_presupuesto);   
    var option5 = document.createElement('option');
    option5.style = "display:none";
    option5.text = option5.value = "";
    select3.appendChild(option5);
    
    firebase.database().ref(rama_bd_reqs).orderByChild('nombre').on('child_added',function(snapshot){
        
        var req = snapshot.val();
        var option3 = document.createElement('OPTION');
        option3.text = option3.value = req.nombre; 
        select.appendChild(option3);

    });

    firebase.database().ref(rama_bd_obras).orderByChild('nombre').on('child_added',function(snapshot){
        
        var obra = snapshot.val();
        var option4 = document.createElement('OPTION');
        option4.text = option4.value = obra.nombre; 
        select2.appendChild(option4);

    });

    firebase.database().ref(rama_bd_tipos_presupuesto).orderByChild('nombre').on('child_added',function(snapshot){
        
        var tipo = snapshot.val();
        var option6 = document.createElement('OPTION');
        option6.text = tipo.nombre; 
        option6.value = tipo.codigo;
        select3.appendChild(option6);

    });
});

//JALAR LOS REQS DE BASE DE DATOS Y GENERA CHECKBOXES.
//los pone al final de la pagina, hay que ver como ponerlos en donde toca (cambiar appendChild por otro?)
    // var num_reqs = 0;

    // firebase.database().ref('' + rama_bd_reqs).orderByChild('nombre').on('child_added',function(snapshot){
    //     num_reqs++;
    //     var req = snapshot.val();
    //     var checkbox = document.createElement('input');
    //         checkbox.type = "checkbox";
    //         checkbox.id = "req" + num_reqs;
    //         checkbox.name = req.nombre;
    //         document.body.appendChild(checkbox);
    
    //         document.body.appendChild(document.createTextNode(req.nombre));
    // });


 $('#' + id_add_reqs_button_presupuesto).click(function () {
     var selec = $("#" + id_reqs_ddl_presupuesto + " option:selected").val();
     var node = document.createElement("LI");
     firebase.database().ref(rama_bd_reqs).orderByChild('nombre').equalTo(selec).on("child_added", function (snapshot) {
        var r = snapshot.val();
        node.classList.add("list-group-item");                 // Create a <li> node
        var textnode = document.createTextNode(selec);        // Create a text node
        node.appendChild(textnode);                              // Append the text to <li>
        document.getElementById(lista_reqs_presupuesto).appendChild(node);  
        reqs.push({nombre:""+selec,entregado: false,esencial: r.esencial,timestamps:{startedAt: new Date().getTime(), entrega: 0}});//firebase.database.ServerValue.TIMESTAMP pero lo da en milisegundos
        alert(JSON.stringify(reqs));
     });

 });

 //Metodo para borrar el ultimo requisito asignado
 $('#' + id_del_reqs_button_presupuesto).click(function () {
     var list = document.getElementById(lista_reqs_presupuesto);   // Get the <ul> element with id="myList"
     list.removeChild(list.lastChild);
     reqs.pop(); 
 });

$('#' + id_registrar_button_presupuesto).click(function () {
    // JALA VALORES SELECCIONADOS DE CHECKBOXES SI SON REQS
    // var reqs = [];
    // for(var i = 1;i<=num_max_req;i++){
    //         if(document.getElementById('req'+i).checked == true)
    //             reqs.push(document.getElementById('req'+i).name)
    //     }
    firebase.database().ref(rama_bd_obras + "/" + $('#' + id_obra_ddl_presupuesto + " option:selected").val()).once('value').then(function(snapshot){
        var obra_selec = snapshot.val();
        var codigo_obra = obra_selec.clave;
        var codigo_cliente = obra_selec.cliente.substring(0,3);
        var codigo_tipo_proyecto = $('#' + id_tipo_presupuesto_ddl_presupuesto + " option:selected").val();
        var consecutivo = 0; //Falta programar este pedo, esta denso
        var clave_presu = codigo_obra + "/" + codigo_cliente + "/" + codigo_tipo_proyecto + consecutivo;
        var fecha = new Date().getTime();
        var presupuesto = {      
            nombre: $('#' + id_nombre_presupuesto).val(),
            clave: clave_presu,
            requisitos: reqs,
            horas_programadas: $('#' + id_horas_programadas_presupuesto).val(),
            cash_presupuestado: $('#' + id_precio_presupuesto).val(),
            timestamps: {
                startedAt: new Date().getTime(),
                finishedAt: 0,
                activacion: 0,
                reqs_completados: 0
            },
            contrato: false
        }
        reqs = [];
        firebase.database().ref(rama_bd_obras + "/" + obra_selec.nombre + "/presupuestos/" + $('#' + id_nombre_presupuesto).val()).set(presupuesto)

        alert("¡Alta de presupuesto exitosa!");

        //Aqui se genera el pdf... creo
        // Variables: 
        // fecha (falta darle el formato adecuado)
        // obra_selec.nombre
        // obra_selec.direccion (o quieren la direccion del cliente?)
        // obra_selec.cliente
        // clave_presu
        // $('#' + id_tipo_presupuesto_ddl_presupuesto + " option:selected").text() (text jala? el value es el codigo)
        // AT'N hay que jalarlo de un DDL dependiendo de la obra seleccionada, que se puedan añadir como si fueran reqs
        // $('#' + id_precio_presupuesto).val()
    });

    
});
