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
 
 HOY:
  - Definir misc y formato Kaiz
  - Arreglar desplegar kaizen
  - Dar formato amistoso a desplegar kaizen (?)
  - Definir si las áreas lo van a meter o si nos lo mandan y nosotros lo llenamos
  - Dar todas las cuentas y areas 
    - YA SE PUEDE LLENAR AHÍ.
 
 actualizados/nuevos(5/3/19):
 - app_desplegar_kaizen -> colapsar subprocesos, utilidad semanal, avance pag/prog, editar profit
 - app_presupuesto -> que el ddl jale subprocesos también
 - app_colaboradores_rrhh
 - app_colaboradores_admin
 - app_colaboradores_compras
 
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
    - Claves
 - eliminar en bibliotecas score
 - claves subprocesos
 - Miscelaneos
    - columnas, renglon, costos, venta, pagos (?), distribución, calculo, edicion

 Errores:
 - Gantt fecha inicial
 - Gantt no saca inicio (sem) pero sí final (sem)
 - Graphs central park misc tiene horas en ihs pero no hay registros
 - No se están sumando horas en "horas_trabajadas" en el ppto :/
 - registros con horas 0 (creo que ya se resolvió)
 - dropdown checkboxes se duplican cada que se le pica a la pestaña
 - falta empty a muchos ddls antes de cargarlos

TO DO:
 - Produccion
   - Desplegar Kaizen
     - Estilo:
       - cambiar avance "prog" por "pag"
       - avance.pag > avance.real = pag en rojo 
       - hacer que las columnas prec y cuant se hagan grises si el otro tiene datos
     - Funcionalidad:
       - si copeo/odec = -1 jala el valor de prec/cuant
       - dar de alta los subprocesos de via
   - Gantt
     - Hitos
     - Fechas raras :S
     - Sem inic no sale
     - editable
   - Gestionar SCORE en prod -> gerencia, que te salgan los pptos (con su obra, proc, precio) y que los active
   - colvis en desplegar_procesos
   - el borrar todo de utilidad no debe borrar sino recargar. La funcionalidad ya está, sólo hay que quitarle el borra todo
 - Proyectos
   - Definir generar ppto con Erick
   - alta obra jala el nombre de un ddl y lo demás se bloquea como en obra_prod
   - Revisar reporte_obras
   - Si clase = produccion -> hacer mas simple el formato
 - Admin
   - Inve$time
   - Centro de costos.
     - alta cuenta
     - añadir al desplegar
 - RRHH
   - alta_trabajadores
     - Conseguir datos
     - Pasarlos a CSV
     - Usar código cool para pasarlos a JSON (online si es no nested, https://github.com/chamkank/hone si lo es)
     - Subir el json
 - Pagina Web
   - arreglar las apps de permisos de usuario y de inicio de sesion
   - Poner el filtro de areas adentro de las paginas para que te saque si metes el link directo
   - Botón respaldo (aunque baje sólo el json)
   - Poner botón regresar a index o links para navegar entre páginas
   - Manual de usuario, por sección y global.

 - Cambiar idioma_espanol en tablas de apps como datos_kaizen y asistencia y desplegar_procesos
 - Altas colaboradores:
   - EBM, MBD y Ray en admin
   - ABD en compras
   - Virgilio en rrhh?
 - app_agregar_json
    
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
  
