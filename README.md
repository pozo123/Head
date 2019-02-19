# Head
Depto. de Innovacion y Optimizacion

Después de DEPLOY hay que actualizar la VERSION en firebase/database/info_web/version
 
 Orden Implementacion:
 - app_colaboradores_produccion: CHECK
 - app_cuenta_cc: 
 - app_obras_prod: CHECK
 - app_procesos: CHECK
 - app_desplegar_procesos: CHECK
 - app_kaizen_global
 - app_datos_kaizen
 - app_asistencia
 
 actualizados/nuevos (19/2/19)
 - app_gestionar_supervisores
 - app_asistencia
 
 actualizado/nuevos(14/2/19):
 - app_utilidad (hay que descomentar cosas)
 
 actualizados/nuevos(13/2/19):
 - app_funciones -> la función para cargar SCORE al kaizen
 - app_inge
 
 actualizados/nuevos(12/2/19) después de llamada:
 - app_datos_kaizen
 
 actualizados/nuevos(12/2/19):
 - app_cierre_maestro -> Creo que encontré el pedo de los registros = 0;
 
 actualizados/nuevos(11/2/19):
 - app_kaizen_global 
 
 Por probar:
 - app_reporte_obras ->(edité, ahora tiene checkboxes... creo :S)
 - app_areas

 Por definir:
 - Centro de costos (Emmanuel la tiene super complicada :S)
 - eliminar en bibliotecas score
 - Hector
    - Asistencias (trabajadores)
    - Diversos
    - Supervisores
    - Pagos nomina (que jale la info de asistencias para el prorrateo)
    - Archivo pagadora

 Errores:
 - registros con horas 0 (creo que ya se resolvió)
 - dropdown checkboxes se duplican cada que se le pica a la pestaña
 - falta empty a muchos ddls antes de cargarlos

TO DO:
 - Centro de costos.
   - alta cuenta
   - añadir al desplegar
 - Los editar en bibliotecas ya no solo afectan la bd de proyectos. Checar que si se cambia el nombre de cliente, por ejemplo, se cambie también en obra magico y en todos los lugares que sean correspondientes
 - Ddl proceso en ppto
 - arreglar las apps de permisos de usuario y de inicio de sesion
 - Poner el filtro de areas adentro de las paginas para que te saque si metes el link directo
 - Poner botón regresar a index o links para navegar entre páginas
 - Cambiar idioma_espanol en tablas de apps como datos_kaizen y asistencia
 - Jalar fechas a magico en obras prod
 - Editar horas kaizen  (procesos y obras)
 - Altas colaboradores:
   - SIGUE TRONANDO ):
   - EBM, MBD y Ray en admin
   - ABD en compras
   - Virgilio en rrhh?
 - Subprocesos los mete como un proceso?? Y en adic no hay que ponerle categoría
 - Y que ya no tengan "adicional: false", hay que borrarselo a varias obras (menos a acanto, marina y neo)
 - Meter adicionales de
   - Acanto
   - Unico
   - via
   - west park
   - zentral

KAIZEN: 
  - Quién es responsable de llenarlo.
    - supervisores:
      - Todas las secciones de sus obras asignadas
    - Gerente (vir)
      - Todas las secciones de todas las obras
    - Admin (emmanuel, ray, MBD, Arturo y yo) 
      - Todo de todo
    - Compras
      - Suministros (pagado seguro, O de C?)
    - Nomina
      - Copeo, pagado de todas las obras.
        
    - Proyectos: 
      - Ppto: Ray + MBD (Eric?) 
        - Formato: simplemente horas.
      - PAG: SCORE 
        - Formato: cargado automático desde SCORE
        - Cross reference con Hector (para que se paguen horas reales y no horas registradas. El chiste es aplicar regla de tres de proporciones (como en reporte obras) con las horas totales pagadas por hector).
        - EDIT: ya no. En el kaizen se pagan todas las horas de SCORE, pero al salir de kaizen para el HeadMaster se le restan las trabajadas. Pueden ser simplemente en el total o prorratearlas entre las obras.
    - Producción
      - Suministros:
        - Cuant: proy (hay inge(s) asignados desde el principio. Se puede cambiar pero es raro. Que se llene desde SCORE)
          - Formato: unidades, precio, concepto, total...???
        - OdeC: compras -> ver quien, ver si lo llenan desde la pagina o un excel y lo subimos o que onda
          - Formato: concepto, total, unidades...???
        - Pag: compras -> ver quien, ver si lo llenan desde la pagina o un excel y lo subimos o que onda
          - Formato: unidades, concepto, fechas... Todo lo que nos platicó Emmanuel.
      - Copeo:
        - Prec: virgilio
          - Formato: ???
        - copeo: virgilio + supervisores 
          - Formato: ???
        - pag: hector ?
          - Formato: asistencias. Por día de la semana, mas horas extra y diversos. 
    - Administración:
      - Estimaciones:
        - ppto: MBD?
          - Que el sistema te proponga una para obtener un profit deseado?
        - ESt: Emmanuel?
        - Pag: Emmanuel?
      - Anticipos:
        - ppto: MBD?
        - pag: emmanuel?
 - Kaizen global
 - Tabla de obras y procesos por obra
 
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
  
- EMAIL
  - Todos pueden subir su foto! (click en seleccionar, seleccionas archivo, y luego click en SUBIR imagen)
  - Cierre maestro a las 5 y de ahí una por hora.
  - Si no está su obra/ppto díganle a Eric. Para medir bien las horas trabajadas necesitamos evitar Otros y Misceláneos lo más posible.
  - Si salen igual, desde el cel
  - A supervisores: ya hay sistema y así funciona
