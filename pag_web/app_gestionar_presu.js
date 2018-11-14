var id_obra_ddl_gestionar = "DDL_obra";
var id_presupuestos_ddl_gestionar = "DDL_presupuesto";
var id_activar_button_gestionar = "activar_button";
var id_terminar_button_gestionar = "terminar_button"; //Cambie a terminar
var id_ocultar_button_gestionar = "ocultar_button";
var id_horas_column_ihs_gestionar  = "horasIEColumn";
var id_horas_column_ie_gestionar  = "horasIHSColumn";
var rama_bd_obras = "obras";
var id_guardar_button_gestionar = "guardarHorasGestionar";

var id_horas_gestionadas_label_gestionar = "labelHorasGestionadas";
var id_horas_ppto_label_gestionar = "labelHorasPpto";

var horas_por_inge = [];
var horas_ppto = 0;
var horas_gestionadas = 0;
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
    firebase.database().ref(rama_bd_obras + "/" + $('#' + id_obra_ddl_gestionar + " option:selected").val() + "/presupuestos/" + $('#' + id_presupuestos_ddl_gestionar + " option:selected").val() + "/timestamps/activacion").set(new Date().getTime());
    alert("Presupuesto activado");
  }
});

$('#' + id_terminar_button_gestionar).click(function () {
  if($('#' + id_presupuestos_ddl_gestionar + " option:selected").val() === ""){
    alert("Selecciona todos los campos");
  } else {
    var activado = false;
    firebase.database().ref(rama_bd_obras + "/" + $('#' + id_obra_ddl_gestionar + " option:selected").val() + "/presupuestos/" + $('#' + id_presupuestos_ddl_gestionar + " option:selected").val() + "/contrato").set(activado);
    firebase.database().ref(rama_bd_obras + "/" + $('#' + id_obra_ddl_gestionar + " option:selected").val() + "/presupuestos/" + $('#' + id_presupuestos_ddl_gestionar + " option:selected").val() + "/timestamps/finishedAt").set(new Date().getTime());
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
  $(".row_text_ie_gestionar").val(null);
  $(".row_text_ihs_gestionar").val(null);
  $(".row_checkbox_ie_gestionar").prop("checked", false);
  $(".row_checkbox_ihs_gestionar").prop("checked", false);
  $(".row_text_ie_gestionar").addClass("hidden");
  $(".row_text_ihs_gestionar").addClass("hidden");
  
  horas_gestionadas = 0;
  firebase.database().ref(rama_bd_obras + "/" + $('#' + id_obra_ddl_gestionar + " option:selected").val() + "/presupuestos/" + $('#' + id_presupuestos_ddl_gestionar + " option:selected").val() + "/horas_programadas").once("value").then(function(snapshot){
    horas_ppto = snapshot.val();
    $('#' + id_horas_ppto_label_gestionar).text("Horas presupuestadas: " + horas_ppto);
  });
  
  firebase.database().ref(rama_bd_obras + "/" + $('#' + id_obra_ddl_gestionar + " option:selected").val() + "/presupuestos/" + $('#' + id_presupuestos_ddl_gestionar + " option:selected").val() + "/colaboradores_asignados/ie").orderByKey().on("child_added",function(snapshot){
    var uid = snapshot.key;
    var ing = snapshot.val();
    $("#check_" + uid + "_ie_gestionar").prop("checked", true);
    $("#text_" + $("#check_" + uid + "_ie_gestionar").val() + "_ie_gestionar").removeClass("hidden");
    $("#text_" + uid + "_ie_gestionar").val(ing.horas);
    horas_gestionadas = horas_gestionadas + parseInt(ing.horas); //Hay que checar que no se dupiquen aquí + el on change
    $('#' + id_horas_gestionadas_label_gestionar).text("Horas gestionadas: " + horas_gestionadas);
  });

  firebase.database().ref(rama_bd_obras + "/" + $('#' + id_obra_ddl_gestionar + " option:selected").val() + "/presupuestos/" + $('#' + id_presupuestos_ddl_gestionar + " option:selected").val() + "/colaboradores_asignados/ihs").orderByKey().on("child_added",function(snapshot){
    var uid = snapshot.key;
    var ing = snapshot.val();
    $("#check_" + uid + "_ihs_gestionar").prop("checked", true);
    $("#text_" + $("#check_" + uid + "_ihs_gestionar").val() + "_ihs_gestionar").removeClass("hidden");
    $("#text_" + uid + "_ihs_gestionar").val(ing.horas);
    horas_gestionadas = horas_gestionadas + parseInt(ing.horas);  //Hay que checar que no se dupiquen aquí + el on change 
    $('#' + id_horas_gestionadas_label_gestionar).text("Horas gestionadas: " + horas_gestionadas);
  });
}

$("#" + id_horas_column_ie_gestionar).on("change", "input.row_checkbox_ie_gestionar",function(){
    //$("#text_" + $(this).value + "_gestionar")[($(this).is(":checked") ? "show" : "hide")]();//Value necesita ()?
    if($(this).is(":checked"))
      $("#text_" + $(this).val() + "_ie_gestionar").removeClass("hidden");
    else
      $("#text_" + $(this).val() + "_ie_gestionar").addClass("hidden");
});

$("#" + id_horas_column_ihs_gestionar).on("change", "input.row_checkbox_ihs_gestionar",function() {
    //$("#text_" + $(this).value + "_gestionar")[($(this).is(":checked") ? "show" : "hide")]();//Value necesita ()?
    if($(this).is(":checked"))
      $("#text_" + $(this).val() + "_ihs_gestionar").removeClass("hidden");
    else
      $("#text_" + $(this).val() + "_ihs_gestionar").addClass("hidden");
});

//No jalan
$('.row_text_ie_gestionar').on("change",function(){
    horas_gestionadas = horas_gestionadas + $(this).val();
    $('#' + id_horas_gestionadas_label_gestionar).text("Horas gestionadas: " + horas_gestionadas);
});

$(".row_text_ihs_gestionar").change(function(){
    horas_gestionadas = horas_gestionadas + $(this).val();
    $('#' + id_horas_gestionadas_label_gestionar).text("Horas gestionadas: " + horas_gestionadas);
});

function loadColaboradoresGestionar(){
  horas_por_inge = [];
  $('#' + id_horas_column_ie_gestionar).empty();
  $('#' + id_horas_column_ihs_gestionar).empty();
  firebase.database().ref(rama_bd_inges).orderByChild("nombre").on("child_added",function(snapshot){
    var inge = snapshot.val();
    if(inge.permisos.perfil === true){
      if(inge.especialidad === 1 || inge.especialidad === 3){
        var row2 = document.createElement('div');
        row2.id = "row_" + inge.uid;
        row2.className = "holi";
        console.log(row2);
        var checkbox = document.createElement('input');
        checkbox.type = "checkbox";
        checkbox.className = "row_checkbox_ie_gestionar";
        checkbox.value = inge.uid;
        checkbox.id = "check_" + inge.uid + "_ie_gestionar";
        var label = document.createElement('label');
        label.innerHTML = inge.nickname;//Puede ser innerText?
        var textfield = document.createElement('input');
        textfield.type = "text";
        textfield.id = "text_" + inge.uid + "_ie_gestionar";
        textfield.className = "hidden row_text_ie_gestionar";
        row2.appendChild(checkbox);
        row2.appendChild(label);
        row2.appendChild(textfield);
        var div = document.getElementById(id_horas_column_ie_gestionar);
        div.appendChild(row2);
        horas_por_inge.push({uid: inge.uid, nombre: inge.nombre, especialidad: "ie"});
      } 
      if(inge.especialidad === 2|| inge.especialidad === 3){
        var row1 = document.createElement('div');
        row1.id = "row_" + inge.uid;
        var checkbox = document.createElement('input');
        checkbox.type = "checkbox";
        checkbox.className ="row_checkbox_ihs_gestionar";
        checkbox.value = inge.uid;
        checkbox.id = "check_" + inge.uid + "_ihs_gestionar";
        var label = document.createElement('label');
        label.innerHTML = inge.nickname;//Puede ser innerText?
        var textfield = document.createElement('input');
        textfield.type = "text";
        textfield.id = "text_" + inge.uid + "_ihs_gestionar";
        textfield.className = "hidden row_text_ihs_gestionar";
        console.log(textfield)
        row1.appendChild(checkbox);
        row1.appendChild(label);
        row1.appendChild(textfield);
        var div = document.getElementById(id_horas_column_ihs_gestionar);
        div.appendChild(row1);
        horas_por_inge.push({uid: inge.uid, nombre: inge.nombre, especialidad: "ihs"});
      }
      
    }      
  });
}

$('#' + id_guardar_button_gestionar).click(function () {
  if($('#' + id_presupuestos_ddl_gestionar + " option:selected").val() === ""){
    alert("Selecciona todos los campos");
  } else {
    var horas_totales_ie = 0;
    var horas_totales_ihs = 0;
    for(i=0;i<horas_por_inge.length;i++){
      var i_uid = horas_por_inge[i].uid;
      var esp = horas_por_inge[i].especialidad;
      if($("#check_" + i_uid + "_" + esp + "_gestionar").is(":checked")){
        if(esp === "ie"){
          horas_totales_ie = horas_totales_ie + parseInt($("#text_" + i_uid + "_ie_gestionar").val());
        } else {
          horas_totales_ihs = horas_totales_ihs + parseInt($("#text_" + i_uid + "_ihs_gestionar").val());
        }
          firebase.database().ref(rama_bd_obras + "/" + $('#' + id_obra_ddl_gestionar + " option:selected").val() + "/presupuestos/" + $('#' + id_presupuestos_ddl_gestionar + " option:selected").val() + "/colaboradores_asignados/" + esp + "/" + i_uid).once('value').then(function(snapshot){
            var in = snapshot.val();
            if(in !== null){
              var horas = {
                nombre: horas_por_inge[i].nombre,
                horas: $("#text_" + i_uid + "_" + esp + "_gestionar").val(),
                horas_trabajadas: in.horas_trabajadas,
              } 
            } else {
              var horas = {
                nombre: horas_por_inge[i].nombre,
                horas: $("#text_" + i_uid + "_" + esp + "_gestionar").val(),
                horas_trabajadas: 0,
              } 
            }
            firebase.database().ref(rama_bd_obras + "/" + $('#' + id_obra_ddl_gestionar + " option:selected").val() + "/presupuestos/" + $('#' + id_presupuestos_ddl_gestionar + " option:selected").val() + "/colaboradores_asignados/" + esp + "/" +  i_uid).set(horas);
          });
        } else {
        firebase.database().ref(rama_bd_obras + "/" + $('#' + id_obra_ddl_gestionar + " option:selected").val() + "/presupuestos/" + $('#' + id_presupuestos_ddl_gestionar + " option:selected").val() + "/colaboradores_asignados/" + esp + "/" +  i_uid).set(null);
      }
    }
    firebase.database().ref(rama_bd_obras + "/" + $('#' + id_obra_ddl_gestionar + " option:selected").val() + "/presupuestos/" + $('#' + id_presupuestos_ddl_gestionar + " option:selected").val() + "/colaboradores_asignados/horas_totales_ie").set(horas_totales_ie);
    firebase.database().ref(rama_bd_obras + "/" + $('#' + id_obra_ddl_gestionar + " option:selected").val() + "/presupuestos/" + $('#' + id_presupuestos_ddl_gestionar + " option:selected").val() + "/colaboradores_asignados/horas_totales_ihs").set(horas_totales_ihs);
    firebase.database().ref(rama_bd_obras + "/" + $('#' + id_obra_ddl_gestionar + " option:selected").val() + "/presupuestos/" + $('#' + id_presupuestos_ddl_gestionar + " option:selected").val() + "/colaboradores_asignados/horas_totales").set(horas_totales_ie + horas_totales_ihs);
    if((horas_totales_ie + horas_totales_ihs) > horas_ppto) //Chance hacer un modal? para que si son distintas (mas o menos? o cualquiera?) ofrezca actualizarlas
      alert("ADVERTENCIA: las horas totales superan las horas presupuestadas");
    alert("Distribucion de horas actualizada");
  }
});
