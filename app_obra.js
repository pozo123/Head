var id_nombre_obra = "obraNombre";
var id_clave_obra = "obraClave"; //Campo nuevo
//var id_lider_ddl_obra = "proyLider";
var id_cliente_ddl_obra = "cliente";
var id_direccion_calle_obra = "calleObra"; //Campo nuevo
var id_direccion_num_obra = "numObra"; //Campo nuevo
var id_direccion_colonia_obra = "coloniaObra"; //Campo nuevo
var id_direccion_delegacion_obra = "delegacionObra"; //Campo nuevo
var id_direccion_ciudad_obra = "ciudadObra"; //Campo nuevo
var id_direccion_cp_obra = "cpObra"; //Campo nuevo
//var id_asignados_ddl_obra = "asignados";
//var id_add_asignados_button_obra = "add_asignados";
//var id_del_asignados_button_obra = "borrar_inges_asignados";
//var id_asignados_lista_obra = "ListaInges";
var id_registrar_button_obra = "registrarObra";
var rama_bd_obras = "obras";
var rama_bd_inges = "inges";
var rama_bd_clientes = "clientes";

//var asignados = [];

$(document).ready(function() {

    //var select = document.getElementById(id_lider_ddl_obra);
    //var select2 = document.getElementById(id_asignados_ddl_obra);
    var select3 = document.getElementById(id_cliente_ddl_obra) ;
    //var option = document.createElement('option');
    //option.style = "display:none";
    //option.text = option.value = "";
    //var option2 = document.createElement('option');
    //option2.style = "display:none";
    //option2.text = option2.value = "";
    var option3 = document.createElement('option');
    option3.style = "display:none";
    option3.text = option3.value = "";
    //select.appendChild(option);
    //select2.appendChild(option2);
    select3.appendChild(option3);

    
    // firebase.database().ref(rama_bd_inges).orderByChild('nombre').on('child_added',function(snapshot){
        
    //     var inge = snapshot.val();
    //     var option4 = document.createElement('OPTION');
    //     option4.text = option4.value = inge.nombre; 
    //     select.appendChild(option4);

    //     var option5 = document.createElement('OPTION');
    //     option5.text = option5.value = inge.nombre; 
    //     select2.appendChild(option5);

    // });

    firebase.database().ref(rama_bd_clientes).orderByChild('nombre').on('child_added',function(snapshot){
        var clien = snapshot.val();
        var option6 = document.createElement('OPTION');
        option6.text = option6.value = clien.nombre; 
        select3.appendChild(option6);
    });

});


// $('#' + id_add_asignados_button_obra).click(function () {
//     var selec = $("#" + id_asignados_ddl_obra + " option:selected").val();
//     var node = document.createElement("LI");
//     node.classList.add("list-group-item");                 // Create a <li> node
//     var textnode = document.createTextNode(selec);        // Create a text node
//     node.appendChild(textnode);                              // Append the text to <li>
//     document.getElementById(id_asignados_lista_obra).appendChild(node); 
//     asignados.push(selec);
//     alert(JSON.stringify(asignados));
// });

// $('#' + id_del_asignados_button_obra).click(function () {
//     var list = document.getElementById(id_asignados_lista_obra);   // Get the <ul> element with id="myList"
//     list.removeChild(list.lastChild);
//     asignados.pop(); 
// });


$('#' + id_registrar_button_obra).click(function () {
    if(!$('#' + id_nombre_obra).val() || !$('#' + id_clave_obra).val() || $('#' + id_cliente_ddl_obra + " option:selected").val() === "" || !$('#' + id_direccion_calle_obra).val() || !$('#' + id_direccion_num_obra).val() || !$('#' + id_direccion_colonia_obra).val() || !$('#' + id_direccion_delegacion_obra).val() || !$('#' + id_direccion_ciudad_obra).val() || !$('#' + id_direccion_cp_obra).val()){
        alert("Llena todos los campos requeridos");
    } else {
        firebase.database().ref(rama_bd_obras + "/" + $('#' + id_nombre_obra).val()).once('value').then(function(snapshot){
            var o = snapshot.val();
                if(o !== null){
                    alert("Obra ya existente");
                } else {

                    var obra = {      
                        nombre: $('#' + id_nombre_obra).val(),
                        clave: $('#' + id_clave_obra).val(),
                        direccion: {
                            calle: $('#' + id_direccion_calle_obra).val(),
                            numero: $('#' + id_direccion_num_obra).val(),
                            colonia: $('#' + id_direccion_colonia_obra).val(),
                            delegacion: $('#' + id_direccion_delegacion_obra).val(),
                            ciudad: $('#' + id_direccion_ciudad_obra).val(),
                            cp: $('#' + id_direccion_cp_obra).val()
                        },
                        cliente: $('#' + id_cliente_ddl_obra + " option:selected").val(),
                        //lider: $('#' + id_lider_ddl_obra + " option:selected").val(),
                        //asignados: asignados,
                        timestamps: {
                            startedAt: new Date().getTime(),
                            finishedAt: 0,
                        }
                    }
                    //asignados = [];
                    firebase.database().ref(rama_bd_obras + "/" + $('#' + id_nombre_obra).val()).set(obra);

                    alert("¡Alta exitosa!");
                }
        });
    }
});

// $('#' + id_imprimir_proy).click(function () {
//     if ($('#' + id_nombre_obra).val() != "") {
//         firebase.database().ref('' + rama_bd_obras).orderByChild('nombre').equalTo($('#' + id_nombre_obra).val()).on("child_added", function (snapshot) {
//             var user = snapshot.val();
//             //Llenar los demas atributos
//             //$('#' + id_email).val(user.email);
//         })
//     }
   
// });