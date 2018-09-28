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

var asignados = [];
var time = new Date();

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
        select2.appendChild(option5);

    });

    firebase.database().ref(rama_bd_clientes).orderByChild('nombre').on('child_added',function(snapshot){
        var clien = snapshot.val();
        var option5 = document.createElement('OPTION');
        option5.text = option5.value = clien.nombre; 
        select3.appendChild(option5);
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
        cliente: $('#' + id_cliente_ddl_proy + "option:selected").val(),
        asignados: asignados,
        timestamps: {
            startedAt: time.getTime(),
            finishedAt: 0,
        }
    }
    asignados = [];
    firebase.database().ref(rama_bd_proys + "/" + $('#' + id_nombre_proy).val()).set(proyecto)

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
