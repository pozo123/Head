var id_nombre_proy = "proyNombre";
var id_lider_ddl_proy = "proyLider";
var id_cliente_ddl_proy = "cliente";
var id_asignados_ddl_proy = "asignados";
var id_add_asignados_button_proy = "add_asignados";
var id_del_asignados_button_proy = "borrar_inges_asignados";
var id_asignados_lista_proy = "ListaInges";
var id_registrar_button_proy = "registrarProyecto";
var rama_bd_proys = "proys";
var rama_bd_inges = "inges";
var rama_bd_clientes = "clientes";


var id_contrato_nombre_proy = "contratoNombre";
var id_contrato_extension_proy = "contratoExtension";
var id_contrato_email_proy = "contratoEmail";

var id_proyecto_nombre_proy = "proyectoNombre";
var id_proyecto_extension_proy = "proyectoExtension";
var id_proyecto_email_proy = "proyectoEmail";

var id_control_obra_nombre_proy = "control_obraNombre";
var id_control_obra_extension_proy = "control_obraExtension";
var id_control_obra_email_proy = "control_obraEmail";

var id_precios_nombre_proy = "preciosNombre";
var id_precios_extension_proy = "preciosExtension";
var id_precios_email_proy = "preciosEmail";

var id_pagos_nombre_proy = "pagosNombre";
var id_pagos_extension_proy = "pagosExtension";
var id_pagos_email_proy = "pagosEmail";

var asignados = [];

$(document).ready(function() {

    var select = document.getElementById(id_lider_ddl_proy);
    var select2 = document.getElementById(id_asignados_ddl_proy);
    var select3 = document.getElementById(id_cliente_ddl_proy) ;
    var option = document.createElement('option');
    option.style = "display:none";
    option.text = option.value = "";
    var option2 = document.createElement('option');
    option2.style = "display:none";
    option2.text = option2.value = "";
    var option3 = document.createElement('option');
    option3.style = "display:none";
    option3.text = option3.value = "";
    select.appendChild(option);
    select2.appendChild(option2);
    select3.appendChild(option3);

    
    firebase.database().ref(rama_bd_inges).orderByChild('nombre').on('child_added',function(snapshot){
        
        var inge = snapshot.val();
        var option4 = document.createElement('OPTION');
        option4.text = option4.value = inge.nombre; 
        select.appendChild(option4);

        var option5 = document.createElement('OPTION');
        option5.text = option5.value = inge.nombre; 
        select2.appendChild(option5);

    });

    firebase.database().ref(rama_bd_clientes).orderByChild('nombre').on('child_added',function(snapshot){
        var clien = snapshot.val();
        var option6 = document.createElement('OPTION');
        option6.text = option6.value = clien.nombre; 
        select3.appendChild(option6);
    });

});


$('#' + id_add_asignados_button_proy).click(function () {
    var selec = $("#" + id_asignados_ddl_proy + " option:selected").val();
    var node = document.createElement("LI");
    node.classList.add("list-group-item");                 // Create a <li> node
    var textnode = document.createTextNode(selec);        // Create a text node
    node.appendChild(textnode);                              // Append the text to <li>
    document.getElementById(id_asignados_lista_proy).appendChild(node); 
    asignados.push(selec);
    alert(JSON.stringify(asignados));
});

$('#' + id_del_asignados_button_proy).click(function () {
    var list = document.getElementById(id_asignados_lista_proy);   // Get the <ul> element with id="myList"
    list.removeChild(list.lastChild);
    asignados.pop(); 
});


$('#' + id_registrar_button_proy).click(function () {
    
    var proyecto = {      
        nombre: $('#' + id_nombre_proy).val(),
        lider: $('#' + id_lider_ddl_proy + " option:selected").val(),
        asignados: asignados,
        timestamps: {
            startedAt: new Date().getTime(),
            finishedAt: 0,
        }
    }
    asignados = [];
    firebase.database().ref(rama_bd_proys + "/" + $('#' + id_nombre_proy).val()).set(proyecto)

    var cliente = {
        nombre: $('#' + id_cliente_ddl_proy + " option:selected").val(),
        contrato:{
            nombre: $('#' + id_contrato_nombre_proy).val(),
            extension: $('#' + id_contrato_extension_proy).val(),
            email: $('#' + id_contrato_email_proy).val(),
        },
        proyecto:{
            nombre: $('#' + id_proyecto_nombre_proy).val(),
            extension: $('#' + id_proyecto_extension_proy).val(),
            email: $('#' + id_proyecto_email_proy).val(),
        },
        control_obra:{
            nombre: $('#' + id_control_obra_nombre_proy).val(),
            extension: $('#' + id_control_obra_extension_proy).val(),
            email: $('#' + id_control_obra_email_proy).val(),
        },
        precios:{
            nombre: $('#' + id_precios_nombre_proy).val(),
            extension: $('#' + id_precios_extension_proy).val(),
            email: $('#' + id_precios_email_proy).val(),
        },
        pagos:{
            nombre: $('#' + id_pagos_nombre_proy).val(),
            extension: $('#' + id_pagos_extension_proy).val(),
            email: $('#' + id_pagos_email_proy).val(),
        }
    }
    firebase.database().ref(rama_bd_proys + "/" + $('#' + id_nombre_proy).val() + "/cliente").set(cliente);

    alert("¡Alta de proyecto exitosa!");
});

// $('#' + id_imprimir_proy).click(function () {
//     if ($('#' + id_nombre_proy).val() != "") {
//         firebase.database().ref('' + rama_bd_proys).orderByChild('nombre').equalTo($('#' + id_nombre_proy).val()).on("child_added", function (snapshot) {
//             var user = snapshot.val();
//             //Llenar los demas atributos
//             //$('#' + id_email).val(user.email);
//         })
//     }
   
// });