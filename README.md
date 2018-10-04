# Head
Depto. de Innovacion y Optimizacion

sintaxis ids: id_nombreDelObjeto_tipoObjeto_documento (e.g. id_proyecto_ddl_inges) TipoObjeto solo si no text

Pendientes semana  1 oct 

- 4/oct 

  - Problema con Entrada/Salida, si aprieto entrada, no hace ningún registro, eso hace que si me salgo y regreso después a querer apretar salida, como se vuelve a correr el JS cuando abro el html, se vuelven a declarar variables y no hay información.

  Solución propuesta:

  Cambiar el push(registro) del botón salida al botón entrada (generar el registro al hacer la entrada y no la salida)

  Para esto necesitaría un atributo en Inges que se llame currentRecord: String (aquí va el id mágico del registro), se genera vacío "".

  El registro se genera con los siguientes datos:

    Botón Entrada

    hacer push en bd/registros con lo siguiente:

    - Checkin: timestamp (la hora de entrada ya se guarda)
    - horas: "" (vacío, se actualiza con el botón salida)
    - inge: currentUser
    - obra: la obra seleccionada
    - presupuesto: el presupuesto seleccionado

    y actualizar el currentRecord del currentUser de la forma currentUser.currentRecord = registro.uid

    Botón Salida

    hacer una busqueda en registros para encontrar el registro que vamos a cerrar. Buscamos en registros el registro que cumpla 
    currentUser.currentRecord == registro[i].uid, con un (for i=0,i< registros.length,i++)

    cuando encuentres este registro

    actualizar horas: new date().getTime() - registro[i].ckeckin

    actualizar currentUser.currentRecord == "".


    Observaciones:

     - De esta forma ya no necesitamos ni siquiera que al apretar salida, se tenga que tener bloqueado los DDL con la obra y 
     presupuesto del registro actual, simplemente el botón Salida hará la chamba de cerrar el registro abierto de ese ingeniero.
     - podemos ahora en el document.ready() decir que si el valor del user.currentRecord no es vacio, entonces se hiddean los DDL y solo queda el botón salida, o algo así. 
     - Puedes entrar, cerrar sesión, salir, etc. Pero no dejará de ser rojo hasta que completes el registro.



- Primordiales
  
  - datepicker
    - html
    - como filtro
  - foto
    - en inges
    - en reqs
    - en pptos?
  - Dashcards
    - generar formato
    - llenar con query
    - formato grid
  - Definir cómo se guardan los presupuestos en la rama_bd. chance en cliente-> obra -> presu? puede ayudar para consecutivos
  - Ligar html con apps
  - Generar presupuesto
    - En pdf (en el app_presupuesto)
    - Añadir las ddl/checkbox necesarias
      - exclusiones
      - reqs
  - Subir a bd tipos de presupeusto con clave
  - programar consecutivo para clave presu
  - Generar clave cliente
  - Bloquear obra y presu cuando picas entrada, incluso si sales de pagina
  - ddl -> checkboxes
  - Credenciales -> hide
  - todo lo de la clave del presupuesto

  
- Candados
  - Boton entrada bloqueado si no hay obra selec
  - que los valores sean int cuando int, double cuando double, y así
  - No repetir nombres de obras ni presupuesto

- Importantes pero no primordiales
  - cuando se cambie de página, se borre lo que se escribió en formularios.
  - los presupuestos no necesitan nombre
