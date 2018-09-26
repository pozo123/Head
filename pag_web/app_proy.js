var id_nombre = "proyNombre";

var id_registrar = "registrarProyecto";
var id_imprimir = "imprimir";
var rama_bd = "proys";
var rama_bd_inges = "inges";
var rama_bd_reqs = "reqs";
var num_max_req = "3";
var id_lider = "proyLider";
var id_asignados = "asignados";
var id_reqs = "reqs";
var id_add_asignados = "add_asignados";
var id_add_reqs = "add_reqs";
var delete_reqs = "borrar_reqs_asignados";
var delete_inges = "borrar_inges_asignados";

var asignados = [];
var reqs = [];


$(document).ready(function() {

    var select = document.getElementById(id_lider);
    console.log(select);
    var select2 = document.getElementById(id_asignados);   
    var select3 = document.getElementById(id_reqs);
    console.log(select3);
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

    
    firebase.database().ref('' + rama_bd_inges).orderByChild('nombre').on('child_added',function(snapshot){
        
        var inge = snapshot.val();
        var option4 = document.createElement('OPTION');
        option4.text = option4.value = inge.nombre; 
        select.appendChild(option4);

        var option5 = document.createElement('OPTION');
        option5.text = option5.value = inge.nombre; 
        select2.appendChild(option5);
    });

    firebase.database().ref('' + rama_bd_reqs).orderByChild('nombre').on('child_added',function(snapshot){
        
        var req = snapshot.val();
        var option6 = document.createElement('OPTION');
        option6.text = option6.value = req.nombre; 
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


$('#' + id_add_asignados).click(function () {
    var selec = $("#" + id_asignados + " option:selected").val();
    var node = document.createElement("LI");
    node.classList.add("list-group-item");                 // Create a <li> node
    var textnode = document.createTextNode(selec);        // Create a text node
    node.appendChild(textnode);                              // Append the text to <li>
    document.getElementById("ListaInges").appendChild(node); 
    asignados.push(selec);
    alert(JSON.stringify(asignados));
    //Falta ver como imprimirlos en el lugar adecuado y borrarlos al hacer click en registrar
});

$('#' + delete_inges).click(function () {
    var list = document.getElementById("ListaInges");   // Get the <ul> element with id="myList"
    list.removeChild(list.lastChild);
    asignados.pop(); 
});

$('#' + id_add_reqs).click(function () {
    var selec = $("#" + id_reqs + " option:selected").val();
    var node = document.createElement("LI");
    node.classList.add("list-group-item");                 // Create a <li> node
    var textnode = document.createTextNode(selec);        // Create a text node
    node.appendChild(textnode);                              // Append the text to <li>
    document.getElementById("ListaReqs").appendChild(node);  
    reqs.push({nombre:""+selec,estatus: false,startedAt: new Date().toDateString()});//firebase.database.ServerValue.TIMESTAMP pero lo da en milisegundos
    alert(JSON.stringify(reqs));
    //Falta ver como imprimirlos en el lugar adecuado y borrarlos al hacer click en registrar
    //
});

//Metodo para borrar el ultimo requisito asignado
$('#' + delete_reqs).click(function () {
    var list = document.getElementById("ListaReqs");   // Get the <ul> element with id="myList"
    list.removeChild(list.lastChild);
    reqs.pop(); 
});

$('#' + id_registrar).click(function () {
    // JALA VALORES SELECCIONADOS DE CHECKBOXES SI SON REQS
    // var reqs = [];
    // for(var i = 1;i<=num_max_req;i++){
    //         if(document.getElementById('req'+i).checked == true)
    //             reqs.push(document.getElementById('req'+i).name)
    //     }
    var proyecto = {      
        nombre: $('#' + id_nombre).val(),
        lider: $('#' + id_lider + " option:selected").val(),
        requisitos: reqs,
        asignados: asignados,
        horas: 0,        
        startedAt: new Date().toDateString(),
        startedAtTimestamp: firebase.database.ServerValue.TIMESTAMP,
    }
    reqs = [];
    asignados = [];
    firebase.database().ref("" + rama_bd + "/" + $('#' + id_nombre).val()).set(proyecto)

    alert("¡Alta de proyecto exitosa!");
    $("#alta").load(location.href+" #alta>*","");
});

$('#' + id_imprimir).click(function () {
    if ($('#' + id_nombre).val() != "") {
        firebase.database().ref('' + rama_bd).orderByChild('nombre').equalTo($('#' + id_nombre).val()).on("child_added", function (snapshot) {
            var user = snapshot.val();
            //Llenar los demas atributos
            //$('#' + id_email).val(user.email);
        })
    }
   
});