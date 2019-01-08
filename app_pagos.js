var nombre_tab_pago = "tabPagos";
var id_obra_ddl_pagos = "obrasDdlPagos";
var id_presupuestos_ddl_pagos = "pptoDdlPagos";
var id_guardar_button_pagos = "guardarPago";
var id_monto_pagos = "montoPagos";
var id_concepto_pagos = "conceptoPagos";

var rama_bd_obras = "proyectos/obras";

$('#' + nombre_tab_pago).click(function(){

  loadColaboradoresGestionar();

  var select = document.getElementById(id_obra_ddl_pagos);
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

function loadDDLPresupuestosPagos(){
    $('#' + id_presupuestos_ddl_pagos).empty();
    var select = document.getElementById(id_presupuestos_ddl_pagos);
    var option = document.createElement('option');
    option.style = "display:none";
    option.text = option.value = "";
    select.appendChild(option);
    firebase.database().ref(rama_bd_obras + "/" + $('#' + id_obra_ddl_pagos + " option:selected").val() + "/presupuestos").orderByKey().on('child_added',function(snapshot){
        var presu = snapshot.key;
        var option2 = document.createElement('option');
        option2.text = option2.value = presu; 
        select.appendChild(option2);
    });

};

$('#' + id_guardar_button_pagos).click(function () {
  if($('#' + id_obra_ddl_pagos + " option:selected").val() === "" || $('#' + id_presupuestos_ddl_pagos + " option:selected").val() === "" || $('#' + id_monto_pagos).val() === "" || $('#' + id_concepto_pagos).val() === "" ){
    alert("Llena todos los campos esenciales");
  } else {
    var pago = {
      fecha_timestamp: 0,
      fecha_dia: 0,
      monto: $('#' + id_monto_pagos).val(),
      concepto: $('#' + id_concepto_pagos).val(),
      imagen: 0,
      cu: 0
    }
    var ref_cu = firebase.database().ref(rama_bd_obras + "/" + $('#' + id_obra_ddl_pagos + " option:selected").val() + "/presupuestos/" + $('#' + id_presupuestos_ddl_pagos + " option:selected").val() + "/pagos").push(pago);
    var cu = ("" + ref_cu).substring(("" + ref_cu).length - 20, (""+ref_cu).length);
    firebase.database().ref(rama_bd_obras + "/" + $('#' + id_obra_ddl_pagos + " option:selected").val() + "/presupuestos/" + $('#' + id_presupuestos_ddl_pagos + " option:selected").val() + "/pagos/" + cu + "/cu").set(cu);
    alert("Alta exitosa");
  }
});
