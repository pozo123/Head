# Head
Depto. de Innovacion y Optimizacion

Después de DEPLOY hay que actualizar la VERSION en firebase/database/info_web/version
 
 Orden Implementacion:
 - app_colaboradores_produccion: CHECK
 - app_obras_prod: 
 - app_procesos
 - app_desplegar_procesos
 - app_kaizen_global
 - app_datos_kaizen
 - app_asistencia
 
 actualizados/nuevos(12/2/19) después de llamada:
 - app_procesos
 - app_desplegar_procesos
 - app_datos_kaizen
 - app_obra_prod
 - app_obra
 
 actualizados/nuevos(12/2/19):
 - app_cierre_maestro -> Creo que encontré el pedo de los registros = 0;
 
 actualizados/nuevos(11/2/19):
 - app_reporte_obras -> cambiar doughnut por pie
 - app_kaizen_global
 - app_presupuesto -> ddl proceso
 
 actualizados/nuevos(7/2/19):
 - app_asistencia (no final... falta probar y definir -> Y cambiar lo de obras_prod/obras_magico)
 - app_colaboradores
 
 Por probar:
 - app_reporte_obras ->(edité, ahora tiene checkboxes... creo :S)
 - app_areas

 Por definir:
 - Supervisor en obra magico? O solo en prod?

 Errores:
 - registros con horas 0 (creo que ya se resolvió)
 - dropdown checkboxes se duplican cada que se le pica a la pestaña
 - falta empty a muchos ddls antes de cargarlos

TO DO:
 - Cambiar app_obra para que cheque y si no existe genere la obra en mágico.
 - app_inges -> catch (volver a cargar app_inge, tenía una r de sobra en la línea 47)
   - Si no existe no está creandolo en personal. Si ya existe el update de areas no se va a llamar, aguas

KAIZEN: 
  - Le ponemos un ddcheckbox para obras asignadas en alta colaborador?
     - O hacer un app_asignar_supervisor en el que se pueda mover todo eso
  - Quién es responsable de llenarlo.
    - supervisores:
      - Todas las secciones de sus obras asignadas
    - Gerente (vir)
      - Todas las secciones de todas las obras
    - Admin (emmanuel, ray, MBD, Arturo y yo) 
      - Todo de todo
    - Compras
      - Suministros (pagado seguro, O de C?)
    - ... continuara
    
    - Todos ellos que tengan una cuenta de produccion con permisos de su responsabilidad para llenar el kaizen
      - Permisos por obra
      - Se llena por area
    - Necesito los supervisores de todas las obras
      - Y pues saber sus responsabilidades y así
    
    - Proyectos: 
      - Ppto: Ray + MBD (Eric?)
      - PAG: SCORE Cross reference con Hector (para que se paguen horas reales y no horas registradas. El chiste es aplicar regla de tres de proporciones (como en reporte obras) con las horas totales pagadas por hector).
    - Producción
      - Suministros:
        - Cuant: proy (hay inge(s) asignados desde el principio. Se puede cambiar pero es raro. Ver que pedo en como ligarlo a score)
        - O de C: compras -> ver quien, ver si lo llenan desde la pagina o un excel y lo subimos o que onda
        - Pag: compras -> ver quien, ver si lo llenan desde la pagina o un excel y lo subimos o que onda
      - Copeo:
        - Prec: virgilio
        - copeo: virgilio + supervisores 
        - est: Matricial cliente (quien?)
        - pag: hector ?
    - Administración:
      - Estimaciones:
        - ppto: MBD?
        - ESt: Emmanuel?
        - Pag: Emmanuel?
      - Anticipos:
        - ppto: MBD?
        - pag: emmanuel?
 - Kaizen global
 - Tabla de obras y procesos por obra
      
PRODUCCION:
  
  - Tabla de converción de materiales para la cuantificación.
     - Qué NO te da AutoCAD? Y de qué depende? Todo tiene que ser una función, hay que definir los parámetros
  - A quien le sale y a quien no.
  - Para obra poder modificar imagen para que impriman planos? Tipo hacerle zoom a algo o cosas así. Ver qué necesidad tienen en la obra.

 
SCORE:
  - meter atributo proceso en pptos
  
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
  - Reqs (funcionalidad)
  - Checar que no exista otra obra con esa clave

- JUNTA
  
- EMAIL
  - Todos pueden subir su foto! (click en seleccionar, seleccionas archivo, y luego click en SUBIR imagen)
  - Cierre maestro a las 5 y de ahí una por hora.
  - Si no está su obra/ppto díganle a Eric. Para medir bien las horas trabajadas necesitamos evitar Otros y Misceláneos lo más posible.
  - Si salen igual, desde el cel
  
- DONE
  - Mover todo a proyectos
  - Ponerle un misc a todas las obras
  - Guardar horas_ie y horas_ihs en consecutivos al generar nuevas versiones
  - PAGOS
  - Imágenes
  - Cierre maestro automático
  - Rama personal
