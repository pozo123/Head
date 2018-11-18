var id_obra_ddl_gestionar = "DDL_obra";
var id_presupuestos_ddl_gestionar = "DDL_presupuesto";
var id_activar_button_gestionar = "activar_button";
var id_terminar_button_gestionar = "terminar_button";
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

$(document).ready(function() {

    loadColaboradoresGestionar();

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
    var oculto = false;
    firebase.database().ref(rama_bd_obras + "/" + $('#' + id_obra_ddl_gestionar + " option:selected").val() + "/presupuestos/" + $('#' + id_presupuestos_ddl_gestionar + " option:selected").val() + "/contrato").set(activado);
    firebase.database().ref(rama_bd_obras + "/" + $('#' + id_obra_ddl_gestionar + " option:selected").val() + "/presupuestos/" + $('#' + id_presupuestos_ddl_gestionar + " option:selected").val() + "/oculto").set(oculto);
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
  //$(".row_checkbox_ie_gestionar").prop("checked", false);
  //$(".row_checkbox_ihs_gestionar").prop("checked", false);
  //$(".row_text_ie_gestionar").addClass("hidden");
  //$(".row_text_ihs_gestionar").addClass("hidden");
  
  horas_gestionadas = 0;
  firebase.database().ref(rama_bd_obras + "/" + $('#' + id_obra_ddl_gestionar + " option:selected").val() + "/presupuestos/" + $('#' + id_presupuestos_ddl_gestionar + " option:selected").val() + "/horas_programadas").once("value").then(function(snapshot){
    horas_ppto = snapshot.val();
    $('#' + id_horas_ppto_label_gestionar).text(horas_ppto);
  });
  
  firebase.database().ref(rama_bd_obras + "/" + $('#' + id_obra_ddl_gestionar + " option:selected").val() + "/presupuestos/" + $('#' + id_presupuestos_ddl_gestionar + " option:selected").val() + "/colaboradores_asignados/ie").orderByKey().on("child_added",function(snapshot){
    var uid = snapshot.key;
    var ing = snapshot.val();
    //$("#check_" + uid + "_ie_gestionar").prop("checked", true);
    //$("#text_" + $("#check_" + uid + "_ie_gestionar").val() + "_ie_gestionar").removeClass("hidden");
    $("#text_" + uid + "_ie_gestionar").val(ing.horas);
    horas_gestionadas = horas_gestionadas + parseFloat(ing.horas); //Hay que checar que no se dupiquen aquí + el on change
    $('#' + id_horas_gestionadas_label_gestionar).text(horas_gestionadas);
  });

  firebase.database().ref(rama_bd_obras + "/" + $('#' + id_obra_ddl_gestionar + " option:selected").val() + "/presupuestos/" + $('#' + id_presupuestos_ddl_gestionar + " option:selected").val() + "/colaboradores_asignados/ihs").orderByKey().on("child_added",function(snapshot){
    var uid = snapshot.key;
    var ing = snapshot.val();
    //$("#check_" + uid + "_ihs_gestionar").prop("checked", true);
    //$("#text_" + $("#check_" + uid + "_ihs_gestionar").val() + "_ihs_gestionar").removeClass("hidden");
    $("#text_" + uid + "_ihs_gestionar").val(ing.horas);
    horas_gestionadas = horas_gestionadas + parseInt(ing.horas);  //Hay que checar que no se dupiquen aquí + el on change 
    $('#' + id_horas_gestionadas_label_gestionar).text(horas_gestionadas);
  });
}

// $("#" + id_horas_column_ie_gestionar).on("change", "input.row_checkbox_ie_gestionar",function(){
//     //$("#text_" + $(this).value + "_gestionar")[($(this).is(":checked") ? "show" : "hide")]();//Value necesita ()?
//     if($(this).is(":checked"))
//       $("#text_" + $(this).val() + "_ie_gestionar").removeClass("hidden");
//     else
//       $("#text_" + $(this).val() + "_ie_gestionar").addClass("hidden");
// });

// $("#" + id_horas_column_ihs_gestionar).on("change", "input.row_checkbox_ihs_gestionar",function() {
//     //$("#text_" + $(this).value + "_gestionar")[($(this).is(":checked") ? "show" : "hide")]();//Value necesita ()?
//     if($(this).is(":checked"))
//       $("#text_" + $(this).val() + "_ihs_gestionar").removeClass("hidden");
//     else
//       $("#text_" + $(this).val() + "_ihs_gestionar").addClass("hidden");
// });

//No jalan
$("#" + id_horas_column_ie_gestionar).on("change", "input.row_text_ie_gestionar",function(){
    var h = $(this).val();
    if(h === null)
        h = 0;
    horas_gestionadas = horas_gestionadas + parseFloat(h);
    $('#' + id_horas_gestionadas_label_gestionar).text(horas_gestionadas);
});

$("#" + id_horas_column_ihs_gestionar).on("change", "input.row_text_ihs_gestionar",function(){
    var h = $(this).val();
    if(h === null)
        h = 0;
    horas_gestionadas = horas_gestionadas + parseFloat(h);
    $('#' + id_horas_gestionadas_label_gestionar).text(horas_gestionadas);
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
        //var checkbox = document.createElement('input');
        //checkbox.type = "checkbox";
        //checkbox.className = "row_checkbox_ie_gestionar";
        //checkbox.value = inge.uid;
        //checkbox.id = "check_" + inge.uid + "_ie_gestionar";
        var label = document.createElement('label');
        label.innerHTML = inge.nickname;//Puede ser innerText?
        var textfield = document.createElement('input');
        textfield.type = "text";
        textfield.id = "text_" + inge.uid + "_ie_gestionar";
        textfield.className = "row_text_ie_gestionar";
        //row2.appendChild(checkbox);
        row2.appendChild(label);
        row2.appendChild(textfield);
        var div = document.getElementById(id_horas_column_ie_gestionar);
        div.appendChild(row2);
        horas_por_inge.push({uid: inge.uid, nombre: inge.nombre, especialidad: "ie"});
      } 
      if(inge.especialidad === 2|| inge.especialidad === 3){
        var row1 = document.createElement('div');
        row1.id = "row_" + inge.uid;
        //var checkbox = document.createElement('input');
        //checkbox.type = "checkbox";
        //checkbox.className ="row_checkbox_ihs_gestionar";
        //checkbox.value = inge.uid;
        //checkbox.id = "check_" + inge.uid + "_ihs_gestionar";
        var label = document.createElement('label');
        label.innerHTML = inge.nickname;//Puede ser innerText?
        var textfield = document.createElement('input');
        textfield.type = "text";
        textfield.id = "text_" + inge.uid + "_ihs_gestionar";
        textfield.className = "row_text_ihs_gestionar";
        //row1.appendChild(checkbox);
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
    var j = 0;
    var inges_selec = [];
    for(i=0;i<horas_por_inge.length;i++){
      var i_uid = horas_por_inge[i].uid;
      var esp = horas_por_inge[i].especialidad;
      var nom = horas_por_inge[i].nombre;
      // if($("#check_" + i_uid + "_" + esp + "_gestionar").is(":checked")){
        if(esp === "ie"){
          horas_totales_ie = horas_totales_ie + parseInt($("#text_" + i_uid + "_ie_gestionar").val());
        } else {
          horas_totales_ihs = horas_totales_ihs + parseInt($("#text_" + i_uid + "_ihs_gestionar").val());
        }
        inges_selec.push({uid: horas_por_inge[i].uid, nombre: horas_por_inge[i].nombre, especialidad: horas_por_inge[i].especialidad});
        //alert(rama_bd_obras + "/" + $('#' + id_obra_ddl_gestionar + " option:selected").val() + "/presupuestos/" + $('#' + id_presupuestos_ddl_gestionar + " option:selected").val() + "/colaboradores_asignados/" + esp)
        //firebase.database().ref(rama_bd_obras + "/" + $('#' + id_obra_ddl_gestionar + " option:selected").val() + "/presupuestos/" + $('#' + id_presupuestos_ddl_gestionar + " option:selected").val() + "/colaboradores_asignados/" + esp).orderByKey().equalTo(i_uid).once('value').then(function(snapshot){
        firebase.database().ref(rama_bd_obras + "/" + $('#' + id_obra_ddl_gestionar + " option:selected").val() + "/presupuestos").orderByKey().equalTo($('#' + id_presupuestos_ddl_gestionar + " option:selected").val()).once('value').then(function(snapshot){
          var presup = snapshot.val();
          var i_uid_selec = inges_selec[j].uid;
          var esp_selec = inges_selec[j].especialidad;
          var nom_selec = inges_selec[j].nombre;
          if(presup.colaboradores_asignados !== null){
            firebase.database().ref(rama_bd_obras + "/" + $('#' + id_obra_ddl_gestionar + " option:selected").val() + "/presupuestos/" + $('#' + id_presupuestos_ddl_gestionar + " option:selected").val() + "/colaboradores_asignados/" + esp_selec + "/" + i_uid_selec + "/horas_trabajadas").once('value').then(function(snapshot){
              var horas_anteriores = snapshot.val();
              //console.log(horas)
              if(horas_anteriores !== null){
                var horas = {
                  nombre: nom_selec,
                  horas: parseFloat($("#text_" + i_uid_selec + "_" + esp_selec + "_gestionar").val()),
                  horas_trabajadas: horas_anteriores,
                } 
              } else {
                var horas = {
                  nombre: nom_selec,
                  horas: parseFloat($("#text_" + i_uid_selec + "_" + esp_selec + "_gestionar").val()),
                  horas_trabajadas: 0,
                } 
              }
              //console.log(horas);
              firebase.database().ref(rama_bd_obras + "/" + $('#' + id_obra_ddl_gestionar + " option:selected").val() + "/presupuestos/" + $('#' + id_presupuestos_ddl_gestionar + " option:selected").val() + "/colaboradores_asignados/" + esp_selec + "/" +  i_uid_selec).set(horas);
            });
          } else {
            var horas = {
              nombre: nom_selec,
              horas: $("#text_" + i_uid_selec + "_" + esp_selec + "_gestionar").val(),
              horas_trabajadas: 0,
            } 
            console.log(horas);
            firebase.database().ref(rama_bd_obras + "/" + $('#' + id_obra_ddl_gestionar + " option:selected").val() + "/presupuestos/" + $('#' + id_presupuestos_ddl_gestionar + " option:selected").val() + "/colaboradores_asignados/" + esp_selec + "/" +  i_uid_selec).set(horas);
          }
          j++;
        });
      // } else {
      //   var updates = {};
      //   updates['/horas/'] = 0;
      //   updates['/horas_trabajadas/'] = 0;
      //   updates['/horas/'] = 0;
      //   firebase.database().ref(rama_bd_obras + "/" + $('#' + id_obra_ddl_gestionar + " option:selected").val() + "/presupuestos/" + $('#' + id_presupuestos_ddl_gestionar + " option:selected").val() + "/colaboradores_asignados/" + esp + "/" +  i_uid).update(updates);//{horas: 0});
      // }
    }
    firebase.database().ref(rama_bd_obras + "/" + $('#' + id_obra_ddl_gestionar + " option:selected").val() + "/presupuestos/" + $('#' + id_presupuestos_ddl_gestionar + " option:selected").val() + "/colaboradores_asignados/horas_totales_ie").set(horas_totales_ie);
    firebase.database().ref(rama_bd_obras + "/" + $('#' + id_obra_ddl_gestionar + " option:selected").val() + "/presupuestos/" + $('#' + id_presupuestos_ddl_gestionar + " option:selected").val() + "/colaboradores_asignados/horas_totales_ihs").set(horas_totales_ihs);
    firebase.database().ref(rama_bd_obras + "/" + $('#' + id_obra_ddl_gestionar + " option:selected").val() + "/presupuestos/" + $('#' + id_presupuestos_ddl_gestionar + " option:selected").val() + "/colaboradores_asignados/horas_totales").set(horas_totales_ie + horas_totales_ihs);
    if((horas_totales_ie + horas_totales_ihs) > horas_ppto) //Chance hacer un modal? para que si son distintas (mas o menos? o cualquiera?) ofrezca actualizarlas
      alert("ADVERTENCIA: las horas totales superan las horas presupuestadas");
    alert("Distribucion de horas actualizada");
  }
});
