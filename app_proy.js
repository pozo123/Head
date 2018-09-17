// JavaScript source code
var id_nombre = "nombre";

var id_registrar = "registrar";
var id_imprimir = "imprimir";
var rama_bd = "proys";
var rama_bd_inges = "inges";
var rama_bd_reqs = "reqs";
var num_max_req = "3";
var id_lider = "lider";
var id_asignados = "asignados";
var id_reqs = "reqs";
var id_add_asignados = "add_asignados";
var id_add_reqs = "add_reqs";

var asignados = [];
var reqs = [];



function loadDDL(){

    var select = document.getElementById(id_lider);
    var select2 = document.getElementById(id_asignados);   
    var select3 = document.getElementById(id_reqs);
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
        var option4 = document.createElement('option');
        option4.text = option4.value = inge.nombre; 
        select.appendChild(option4);

        var option5 = document.createElement('option');
        option5.text = option5.value = inge.nombre; 
        select2.appendChild(option5);
    });

    firebase.database().ref('' + rama_bd_reqs).orderByChild('nombre').on('child_added',function(snapshot){
        
        var req = snapshot.val();
        var option6 = document.createElement('option');
        option6.text = option6.value = req.nombre; 
        select3.appendChild(option6);
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
}

$('#' + id_add_asignados).click(function () {
    var selec = $("#" + id_asignados + " option:selected").val();
    console.log($("#" + id_asignados + " option:selected").val());
    document.body.appendChild(document.createTextNode(selec));
    asignados.push(selec);
    //Falta ver como imprimirlos en el lugar adecuado
});

$('#' + id_add_reqs).click(function () {
    var selec = $("#" + id_reqs + " option:selected").val();
    console.log($("#" + id_reqs + " option:selected").val());
    document.body.appendChild(document.createTextNode(selec));
    reqs.push(selec);
    //Falta ver como imprimirlos en el lugar adecuado
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
    }
    firebase.database().ref("" + rama_bd + "/" + $('#' + id_nombre).val()).set(proyecto)
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
