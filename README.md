# Head
Depto. de Innovacion y Optimizacion

Después de DEPLOY hay que actualizar la VERSION en firebase/database/info_web/version
 
 Orden Implementacion:
 - app_colaboradores_produccion: NOPE
 - app_cuenta_cc: 
 - app_obras_prod: CHECK
 - app_procesos: CHECK
 - app_desplegar_procesos: CHECK
 - app_kaizen_global: CHECK
 - app_datos_kaizen
 - app_asistencia
  
 actualizados/nuevos(26/2/19):
 - app_atributo
 
 actualizados/nuevos(25/2/19):
 - app_asistencia
 - app_cuenta_cc (descomentar botón)

 actualizados/nuevos (19/2/19)
 - app_gestionar_supervisores
   
 Por probar:
 - app_reporte_obras ->(edité, ahora tiene checkboxes... creo :S)
 - app_areas
 - loadScoreKaizen (en app_funciones)
 
 Por definir:
 - Centro de costos 
    - (lo de semanas o quincenas) 
    - Claves
 - eliminar en bibliotecas score

 Errores:
 - registros con horas 0 (creo que ya se resolvió)
 - dropdown checkboxes se duplican cada que se le pica a la pestaña
 - falta empty a muchos ddls antes de cargarlos
 - colaboradores con cu existente :/

TO DO:
 - poner textfield de precio hora score en desplegar-kaizen 
 - Gantt no jala fechas reales, inicios futuros los pone como hoy
 - No suma los profit totales
 - definir clave subproceso (numero del consecutivo por clase o por proceso?)
 - en alta y en editar addClass("hidden") a los campos en el click tab
 - hitos en gantt
 - editable en gantt
 - alta_trabajadores
   - Conseguir datos
   - Pasarlos a CSV
   - Usar código cool para pasarlos a JSON (online si es no nested, https://github.com/chamkank/hone si lo es)
   - Subir el json
 - colvis en desplegar_procesos
 - Centro de costos.
   - alta cuenta
   - añadir al desplegar
 - Revisar reporte_obras
 - arreglar las apps de permisos de usuario y de inicio de sesion
 - Poner el filtro de areas adentro de las paginas para que te saque si metes el link directo
 - Poner botón regresar a index o links para navegar entre páginas
 - Cambiar idioma_espanol en tablas de apps como datos_kaizen y asistencia y desplegar_procesos
 - Altas colaboradores:
   - SIGUE TRONANDO ): Jala un udefined, creo que porque value en vez de child_added
   - EBM, MBD y Ray en admin
   - ABD en compras
   - Virgilio en rrhh?
 - zentral (todos los proc, hay que arreglar lo de "suministros")
 - Hacer un actualizar registros para meter profit bruto y neto a todos los kaiz
 - app_agregar_json
 - Botón respaldo (aunque baje sólo el json)
    
SCORE:
  - Reporte semanal
    - Tabla de colabs contra procesos con totales
   
  - Eliminar en bibliotecas
    - Colabs? borrarlos de auth pero no de database, no? meterle atributo "eliminado"? -> No, sólo en auth. lo demás es con permisos.
    - Obras Poner activo/No activo?
    - pptos sí
    - Despachos no, o sí?
    - atn sí
    - req/exc sí
    - tipos/generos sí
  - Dashgrid
  - Dashcards nuevo diseño
  - Amarillo y rojo en dashcards y graphs para cuando esten al 90% o se hayan pasado de las horas programadas
  - Update uml
  - En ppto si algo está vacio (req/exc/anexo) poner "no aplica"
  - modal cambio contraseña
  - Checar que no exista otra obra con esa clave
  - Los editar en bibliotecas ya no solo afectan la bd de proyectos. Checar que si se cambia el nombre de cliente, por ejemplo, se cambie también en obra magico y en todos los lugares que sean correspondientes

  
- EMAIL
  - Todos pueden subir su foto! (click en seleccionar, seleccionas archivo, y luego click en SUBIR imagen)
  - Cierre maestro a las 5 y de ahí una por hora.
  - Si no está su obra/ppto díganle a Eric. Para medir bien las horas trabajadas necesitamos evitar Otros y Misceláneos lo más posible.
  - Si salen igual, desde el cel
  - A supervisores: ya hay sistema y así funciona
