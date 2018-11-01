var id_obra_ddl_gestionar = "DDL_obra";
var id_presupuestos_ddl_gestionar = "DDL_presupuesto";
var id_activar_button_gestionar = "activar_button";
var id_terminar_button_gestionar = "terminar_button"; //Cambie a terminar
var id_ocultar_button_gestionar = "ocultar_button";
var id_horas_column_ihs_gestionar  = "horasIEColumn";
var id_horas_column_ie_gestionar  = "horasIHSColumn";
var rama_bd_obras = "obras";
var id_guardar_button_gestionar = "guardarHorasGestionar";

var horas_por_inge = [];
//var multiples_consecutivos = false;

$(document).ready(function() {

    loadColaboradoresGestionar(); //Sí aqui?

    var select = document.getElementById(id_obra_ddl_gestionar);
    var option = document.createElement('option');
    option.style = "display:none";
    option.text = option.value = "";
    select.appendChild(option);
    //var option2 = document.createElement('option');
    //option2.text = option2.value = "Miscelaneo";
    //select.appendChild(option2);

    firebase.database().ref(rama_bd_obras).orderByChild('nombre').on('child_added',function(snapshot){
        
        var obra = snapshot.val();
        var option3 = document.createElement('option');
        option3.text = option3.value = obra.nombre; 
        select.appendChild(option3);

    });    
});

//Camie a gestionar
function loadDDLPresupuestosGestionar(){
    $('#' + id_presupuestos_ddl_gestionar).empty();
    var select = document.getElementById(id_presupuestos_ddl_gestionar);
    var option = document.createElement('option');
    option.style = "display:none";
    option.text = option.value = "";
    select.appendChild(option);
    firebase.database().ref(rama_bd_obras + "/" + $('#' + id_obra_ddl_gestionar + " option:selected").val() + "/presupuestos").orderByKey().on('child_added',function(snapshot){
        var presu = snapshot.key;
        var option2 = document.createElement('option');
        option2.text = option2.value = presu; 
        select.appendChild(option2);
    });

};


$('#' + id_activar_button_gestionar).click(function () {
//Chance falta un orderBy?
  if($('#' + id_presupuestos_ddl_gestionar + " option:selected").val() === ""){
    alert("Selecciona todos los campos");
  } else {
    var activado = true;
    firebase.database().ref(rama_bd_obras + "/" + $('#' + id_obra_ddl_gestionar + " option:selected").val() + "/presupuestos/" + $('#' + id_presupuestos_ddl_gestionar + " option:selected").val() + "/contrato").set(activado);
    firebase.database().ref(rama_bd_obras + "/" + $('#' + id_obra_ddl_gestionar + " option:selected").val() + "/presupuestos/" + $('#' + id_presupuestos_ddl_gestionar + " option:selected").val() + "/timestamps/activacion").set(new Date.getTime());
    alert("Presupuesto activado");
  }
});

$('#' + id_terminar_button_gestionar).click(function () {
  if($('#' + id_presupuestos_ddl_gestionar + " option:selected").val() === ""){
    alert("Selecciona todos los campos");
  } else {
    var activado = false;
    firebase.database().ref(rama_bd_obras + "/" + $('#' + id_obra_ddl_gestionar + " option:selected").val() + "/presupuestos/" + $('#' + id_presupuestos_ddl_gestionar + " option:selected").val() + "/contrato").set(activado);
    firebase.database().ref(rama_bd_obras + "/" + $('#' + id_obra_ddl_gestionar + " option:selected").val() + "/presupuestos/" + $('#' + id_presupuestos_ddl_gestionar + " option:selected").val() + "/timestamps/finishedAt").set(new Date.getTime());
    alert("Presupuesto terminado");
  }
});

$('#' + id_ocultar_button_gestionar).click(function () {
  if($('#' + id_presupuestos_ddl_gestionar + " option:selected").val() === ""){
    alert("Selecciona todos los campos");
  } else {
    firebase.database().ref(rama_bd_obras + "/" + $('#' + id_obra_ddl_gestionar + " option:selected").val() + "/presupuestos/" + $('#' + id_presupuestos_ddl_gestionar + " option:selected").val() + "/oculto").once("value").then(function(snapshot){
        if(snapshot.val() === true){
            firebase.database().ref(rama_bd_obras + "/" + $('#' + id_obra_ddl_gestionar + " option:selected").val() + "/presupuestos/" + $('#' + id_presupuestos_ddl_gestionar + " option:selected").val() + "/oculto").set(false);
            alert("Presupuesto desocultado");
        }
        else{
            firebase.database().ref(rama_bd_obras + "/" + $('#' + id_obra_ddl_gestionar + " option:selected").val() + "/presupuestos/" + $('#' + id_presupuestos_ddl_gestionar + " option:selected").val() + "/oculto").set(true);                
            alert("Presupuesto ocultado");
        }
    });
  }
});

//Incluir en el ddl presupuestos
function loadHorasGestionar(){
  $(".row_text_ie_gestionar").empty();
  firebase.database().ref(rama_bd_obras + "/" + $('#' + id_obra_ddl_gestionar + " option:selected").val() + "/presupuestos/" + $('#' + id_presupuestos_ddl_gestionar + " option:selected").val() + "/colaboradores_asignados/ie").orderByKey().on("child_added",function(snapshot){
    var ing = snapshot.val();
    $("#check_" + Object.keys(ing)[0] + "_ie_gestionar").prop("checked", true);
    $("#text_" + Object.keys(ing)[0] + "_ie_gestionar").val(ing.horas);
  });
  firebase.database().ref(rama_bd_obras + "/" + $('#' + id_obra_ddl_gestionar + " option:selected").val() + "/presupuestos/" + $('#' + id_presupuestos_ddl_gestionar + " option:selected").val() + "/colaboradores_asignados/ihs").orderByKey().on("child_added",function(snapshot){
    var ing = snapshot.val();
    $("#check_" + Object.keys(ing)[0] + "_ihs_gestionar").prop("checked", true);
    $("#text_" + Object.keys(ing)[0] + "_ihs_gestionar").val(ing.horas);
  });
}

$(".row_checkbox_ie_gestionar").on("click", function() {
    //$("#text_" + $(this).value + "_gestionar")[($(this).is(":checked") ? "show" : "hide")]();//Value necesita ()?
    if($(this).is(":checked"))
      $("#text_" + $(this).value + "_ie_gestionar").removeClass("hidden");
    else
      $("#text_" + $(this).value + "_ie_gestionar").addClass("hidden");
}).trigger("click");

$(".row_checkbox_ihs_gestionar").on("click", function() {
    //$("#text_" + $(this).value + "_gestionar")[($(this).is(":checked") ? "show" : "hide")]();//Value necesita ()?
    if($(this).is(":checked"))
      $("#text_" + $(this).value + "_ihs_gestionar").removeClass("hidden");
    else
      $("#text_" + $(this).value + "_ihs_gestionar").addClass("hidden");
}).trigger("click");//Es necesario el trigger?
//Este en el document.Ready??
function loadColaboradoresGestionar(){
  horas_por_inge = [];
  $('#' + id_horas_column_ie_gestionar).empty();
  $('#' + id_horas_column_ihs_gestionar).empty();
  firebase.database().ref(rama_bd_inges).orderByChild("nombre").on("child_added",function(snapshot){
    var inge = snapshot.val();
    if(inge.permisos.perfil === true){
      if(inge.especialidad === 1 || inge.especialidad === 3){
        var row = document.createElement('div');
        row.id = "row_" + inge.uid;
        var checkbox = document.createElement('input');
        checkbox.type = "checkbox";
        checkbox.addClass("row_checkbox_ie_gestionar");
        checkbox.value = inge.uid;
        checkbox.id = "check_" + inge.uid + "_ie_gestionar";
        var label = document.createElement('label');
        label.innerHTML = inge.nombre;//Puede ser innerText?
        var textfield = document.createElement('input');
        textfield.type = "text";
        textfield.id = "text_" + inge.uid + "_ie_gestionar";
        textfield.addClass("hidden row_text_ie_gestionar");
        row.appendChild(checkbox);
        row.appendChild(label);
        row.appendChild(textfield);
        var div = document.getElementById(id_horas_column_ie_gestionar);
        div.appendChild(card);
        horas_por_inge.push({uid: inge.uid, nombre: inge.nombre, especialidad: "ie"});
      } 
      if(inge.especialidad === 2|| inge.especialidad === 3){
        var row = document.createElement('div');
        row.id = "row_" + inge.uid;
        var checkbox = document.createElement('input');
        checkbox.type = "checkbox";
        checkbox.addClass("row_checkbox_ihs_gestionar");
        checkbox.value = inge.uid;
        checkbox.id = "check_" + inge.uid + "_ihs_gestionar";
        var label = document.createElement('label');
        label.innerHTML = inge.nombre;//Puede ser innerText?
        var textfield = document.createElement('input');
        textfield.type = "text";
        textfield.id = "text_" + inge.uid + "_ihs_gestionar";
        textfield.addClass("hidden row_text_ihs_gestionar");
        row.appendChild(checkbox);
        row.appendChild(label);
        row.appendChild(textfield);
        var div = document.getElementById(id_horas_column_ihs_gestionar);
        div.appendChild(card);
        horas_por_inge.push({uid: inge.uid, nombre: inge.nombre, especialidad: "ihs"});
      }
      
    }      
  });
}

$('#' + id_guardar_button_gestionar).click(function () {
  if($('#' + id_presupuestos_ddl_gestionar + " option:selected").val() === ""){
    alert("Selecciona todos los campos");
  } else {
    for(i=0;i<horas_por_inge.length;i++){
      var i_uid = horas_por_inge[i].uid;
      var esp = horas_por_inge[i].especialidad;
      if($("#check_" + i_uid + "_" + esp + "_gestionar").is(":checked")){
        var horas = {
          nombre: horas_por_inge[i].nombre,
          horas: $("#text_" + i_uid + "_" + esp + "_gestionar").val()
        }
        firebase.database().ref(rama_bd_obras + "/" + $('#' + id_obra_ddl_gestionar + " option:selected").val() + "/presupuestos/" + $('#' + id_presupuestos_ddl_gestionar + " option:selected").val() + "/colaboradores_asignados/" + esp + "/" +  i_uid).set(horas);
      }
    }
    alert("Distribucion de horas actualizada");
  }
});
