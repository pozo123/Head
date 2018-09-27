var id_nombre_proy = "proyNombre";
var id_lider_ddl_proy = "proyLider";
var id_cliente_proy = "cliente";
var id_asignados_ddl_proy = "asignados";
var id_add_asignados_button_proy = "add_asignados";
var id_del_asignados_button_proy = "borrar_inges_asignados";
var id_asignados_lista_proy = "ListaInges";
var id_registrar_button_proy = "registrarProyecto";
var rama_bd_proys = "proys";
var rama_bd_inges = "inges";

//Necesaria si son checkboxes
//var num_max_req = "3";

//var id_reqs = "reqs";
//var id_add_reqs = "add_reqs";
//var delete_reqs = "borrar_reqs_asignados";
//var rama_bd_reqs = "reqs";

//var id_imprimir_proy = "imprimir";

var asignados = [];
//var reqs = [];
var time = new Date();

$(document).ready(function() {

    var select = document.getElementById(id_lider_ddl_proy);
    var select2 = document.getElementById(id_asignados_ddl_proy);   
    var option = document.createElement('option');
    option.style = "display:none";
    option.text = option.value = "";
    var option2 = document.createElement('option');
    option2.style = "display:none";
    option2.text = option2.value = "";
    select.appendChild(option);
    select2.appendChild(option2);

    
    firebase.database().ref(rama_bd_inges).orderByChild('nombre').on('child_added',function(snapshot){
        
        var inge = snapshot.val();
        var option3 = document.createElement('OPTION');
        option3.text = option3.value = inge.nombre; 
        select.appendChild(option3);

        var option4 = document.createElement('OPTION');
        option4.text = option4.value = inge.nombre; 
        select2.appendChild(option4);

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

// $('#' + id_add_reqs).click(function () {
//     var selec = $("#" + id_reqs + " option:selected").val();
//     var node = document.createElement("LI");
//     node.classList.add("list-group-item");                 // Create a <li> node
//     var textnode = document.createTextNode(selec);        // Create a text node
//     node.appendChild(textnode);                              // Append the text to <li>
//     document.getElementById("ListaReqs").appendChild(node);  
//     reqs.push({nombre:""+selec,estatus: false,startedAt: new Date().toDateString()});//firebase.database.ServerValue.TIMESTAMP pero lo da en milisegundos
//     alert(JSON.stringify(reqs));
// });

// //Metodo para borrar el ultimo requisito asignado
// $('#' + delete_reqs).click(function () {
//     var list = document.getElementById("ListaReqs");   // Get the <ul> element with id="myList"
//     list.removeChild(list.lastChild);
//     reqs.pop(); 
// });

$('#' + id_registrar_button_proy).click(function () {
    // JALA VALORES SELECCIONADOS DE CHECKBOXES SI SON REQS
    // var reqs = [];
    // for(var i = 1;i<=num_max_req;i++){
    //         if(document.getElementById('req'+i).checked == true)
    //             reqs.push(document.getElementById('req'+i).name)
    //     }
    var proyecto = {      
        nombre: $('#' + id_nombre_proy).val(),
        lider: $('#' + id_lider_ddl_proy + " option:selected").val(),
        cliente: $('#' + id_cliente_proy).val(),
        asignados: asignados,
        timestamps: {
            startedAt: time.getTime(),
            activacion: 0,
            reqs_completos: 0,
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
