

var rama_bd_obras_magico = "obras";

//Recibe el nombre de la hora y regresa un json SCORE:{clave_proceso: horas_trabajadas}
function loadScoreKaizen(obra){
  var procesos = {};
  firebase.database().ref(rama_bd_obras_magico + "/" + obra).once('value').then(function(snapshot){
    snapshot.child("procesos").forEach(function(proc_snap){
      var proc = proc_snap.val();
      procesos[proc.clave] = {PROYECTOS:{PPTO:0}};
      firebase.database().ref(rama_bd_obras + "/" + obra + "/presupuestos/").orderByChild("proceso").equalTo(proc.clave).once('value').then(function(snapshot){
        snapshot.forEach(function(ppto_snap){
          var ppto = ppto_snap.val();
          procesos[proc.clave]["PROYECTOS"]["PPTO"] = procesos[proc.clave]["PROYECTOS"]["PPTO"] + ppto.horas_trabajadas;
        });
      });
    });
    console.log(procesos);
    //firebase.database().ref(rama_bd_obras_magico + "/" + obra + "/procesos").update(procesos);
  });
}

function pistaDeAuditoria(){
  var pda = {
    uid: firebase.auth().currentUser.uid,
    timestamp: new Date().getTime(),
  };
  return pda;
}

//Recibe los COSTOS totales de una obra y regresa el precio de venta para obtener cierto VALOR deseado
//Si el criterio es "porcentaje" (utilidad con respecto al precio de venta) debe ser entre 0 y 1 (30% = 0.3)
//Si el criterio es "cantidad" se ingresa el monto exacto que se quiere de utilidad
//Si el criterio es "precioVenta" el valor es el precio al que se va a vender, y se regresa el valor del profit (en %)
function calculaUtilidad(costos, criterio, valor){
  var precioVenta;
  if(criterio == "porcentaje"){
    precioVenta = costos/(0.8-valor);
    return precioVenta;
  } 
  if(criterio == "cantidad"){
    precioVenta = (valor + costos)/0.8;
    return precioVenta;
  }
  if(criterio == "precioVenta"){
    var profitCantidad = 0.8*valor - costos;
    var profitPorcentaje = profitCantidad/valor;
    return profitPorcentaje;
    //return profitCantidad;
  }
}
//input un dia en ms
//regresa un array [week, year]
//var week = getWeek(dia_en_ms)[0];
//var year = getWeek(dia_en_ms)[1];
//ej getWeek(new Date(2027,0,2).getTime())
//La primera semana del año son todos aquellos dias que queden antes del primer miercoles del año.
//La primera y ultima semana del año pueden tener menos días si no se empieza en jueves o termina en miercoles

function getWeek(dia) {
  var d = new Date(dia);

  var y = new Date(d).getFullYear();
  var timestmp = new Date().setFullYear(y, 0, 1);
  var yearFirstDay = Math.floor(timestmp / 86400000);
  var today = Math.floor(d / 86400000);
  var offset = new Date(timestmp).getDay() - 4;
  var jueves = yearFirstDay;
  if(offset<0){
    jueves = yearFirstDay - offset;
  } else if(offset>0){
    jueves = yearFirstDay + (7 - offset);
  }
  var daysSinceJueves = today - jueves;
  var week = Math.floor(daysSinceJueves / 7) + 2;
  if(offset == 0){
    week--;
  }
  
  return [week,y];
}

function formatMoney(n, c, d, t) {
  var c = isNaN(c = Math.abs(c)) ? 2 : c,
    d = d == undefined ? "." : d,
    t = t == undefined ? "," : t,
    s = n < 0 ? "-" : "",
    i = String(parseFloat(n = Math.abs(Number(n) || 0).toFixed(c))),
    j = (j = i.length) > 3 ? j % 3 : 0;

  return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};
