//Doy: horas_totales_personales (horas), horas_totales_presu (horas), horas_trabajadas_personales, horas_trabajadas_presu
//Necesito:
  //rama_bd_obra, rama_bd_registros, rama_bd_ignes, nombre_obra, nombre_presu, esp, username
firebase.database().ref(rama_bd_inges).on('child_added', function(snapshot){
  var ingen = snapshot.val();
  if(ingen.permisos.perfil === true){
    if(ingen.status === true){
      //Jalar presu y obra en los que chambeo de registro con status false y inge = ingen.nombre
      //Como ya tengo ese query change no hay que hacer el query de abajo, hay que checar
      firebase.database().ref(rama_bd_obras + "/" + nombre_obra + "/presupuestos").orderByKey().equalTo(nombre_presu).once('child_added').then(function(snapshot){
          var presu = snapshot.val();

          var horas_totales_presu;
          var horas_totales_personales;
          var horas_trabajadas_presu = 0;
          var horas_trabajadas_personales = 0;

          var nombre_ing;
          var horas_personales_base;

          if(esp == "ie"){
            horas_totales_presu = presu.colaboradores_asignados.horas_totales_ie;
          }
          else if(esp == "ihs"){
            horas_totales_presu = presu.colaboradores_asignados.horas_totales_ihs;
          }

          firebae.database().ref(rama_bd_obras + "/" + nombre_obra + "/presupuestos/" + nombre_presu + "/colaboradores_asignados/" + esp).once('value').then(function(snapshot){
            var ings = snapshot.val();
            var keys = Object.keys(ings);
            for(var i = 0; i<keys.length; i++){
              if(ings[keys[i]] === username){
                horas_totales_personales = ings[keys[i]].horas;//en horas (no mili)
                horas_personales_base = ings[keys[i]].horas_trabajadas; //en horas (no mili)
                nombre_ing = ings[keys[i]].nombre;
              }
              horas_trabajadas_presu += ings[keys[i]].horas_trabajadas;
            }
            firebase.database().ref(rama_bd_registros).orderByChild("status").equalTo(false).on('value',function(snapshot){
              var regs = snapshot.val();
              var keys = Object.keys(regs);
              for(var i = 0; i<keys.length; i++){
                if(regs[keys[i]].presupuesto == nombre_presu){
                  if(regs[keys[i]].inge == nombre_ing){
                    horas_trabajadas_personales = horas_personales_base + (new Date().getTime() - regs[keys[i]].checkin)/3600000;
                  }
                  horas_trabajadas_presu += (new Date().getTime() - regs[keys[i]].checkin)/3600000;
                }
              }
                //AQUI LOS DASHCARDS
            });
          });
      });
    } else {
      //AQUI LOS DASH NO ACTIVOS
    }
  }
});
