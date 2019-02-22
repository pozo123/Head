

//Recibe el nombre de la hora y regresa un json SCORE:{clave_proceso: horas_trabajadas}
var rama_bd_obras_magico = "obras";
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
//input un dia en ms
//regresa un array [week, year]
//var week = getWeek(dia_en_ms)[0];
//var year = getWeek(dia_en_ms)[1];
//ej getWeek(new Date(2027,0,2).getTime())


function getWeek(dia) {
  var d = new Date(dia);

  var y = new Date(d).getFullYear();
  var timestmp = new Date().setFullYear(y, 0, 1);
  var yearFirstDay = Math.floor(timestmp / 86400000);
  var day = Math.ceil(d / 86400000);
  var dayOfYear = day - yearFirstDay;

  var firstDay = new Date(y,0,1);
  var offset = 4 - firstDay.getDay();
  
  if(offset < 0)
  	offset = 8 + offset;
  else
  	offset = offset + 1;
    
  var week;
  var year = y;
  if(dayOfYear < offset){
	year--;
	week = getWeek(new Date(year,11,31).getTime())[0];
  }
  else{
  	week = Math.floor((dayOfYear - offset)/7) + 1;
  }
  //document.getElementById("demo").innerHTML = week;
  //document.getElementById("demo2").innerHTML = year;
  //document.getElementById("demo3").innerHTML = d; 
  
  return [week,year];
}
