# Head
Depto. de Innovacion y Optimizacion

Después de DEPLOY hay que actualizar la VERSION en firebase/database/info_web/version
 
 actualizados/nuevos(7/2/19):
 - app_kaizen_global (wooooo!!!!)
 - app_obra_prod
 - app_procesos
 - app_colaboradores
 - app_perfil
 - app_cierre_maestro
 
 actualizados/nuevos (6/2/19):
 - app_desplegar_procesos
 
 Por probar:
 - app_obra_prod
 - app_inges -> catch (volver a cargar app_inge, tenía una r de sobra en la línea 47)
 - app_reporte_obras -> colorsitos cool (edité, ahora tiene checkboxes... creo :S) (Edit para que el cb de zobra no este activo)
 - app_actualizar_regs -> cambiar Miscelaneo por Otros y hacer todo lo de los registros
 - app_cierre_maestro -> ya suma horas bien (checar en los 5 lugares)
 - app_perfil -> suma horas en inge/obras (checar en los 5 lugares)
 - dashgrid modulo
 - app_areas (:
 
 Actualizar_regs:
 - Sumar las horas de cada ppto (como en ACANTO) para todos los demas
    - poner en 0s todo
    - llenar 5 campos (inges/obra/ppto, ppto/horas_trabajadas, colaboradores/horas_totales, cols/horas_esp, cols/uid)
 - Código mágico para cambiar todos los misceláneo por Otros en registros.
 - Cambiar registros con más de 15 horas por 9 horas

 Errores:
 - registros con horas = 0 :S
 - dropdown checkboxes se duplican cada que se le pica a la pestaña
 
Hoy:

KAIZEN: 
  - Le ponemos un ddcheckbox para obras asignadas en alta colaborador?
  - Que se guarde el kaizen en obras de producción?
  - Costo de score, sólo depende de los pagos? La oficina es admon, cierto?
  - Al hacer las horas pptadas de score en los kaisens meter alcance.
  - Quién es responsable de llenarlo.
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
  - Todos pueden subir su foto!
  - Cierre maestro a las 5 y de ahí una por hora.
  - Si no está su obra/ppto díganle a Eric. Para medir bien las horas trabajadas necesitamos evitar Otros y Misceláneos lo más posible.
  
- DONE
  - Mover todo a proyectos
  - Ponerle un misc a todas las obras
  - Guardar horas_ie y horas_ihs en consecutivos al generar nuevas versiones
  - PAGOS
  - Imágenes
  - Cierre maestro automático
  - Rama personal
