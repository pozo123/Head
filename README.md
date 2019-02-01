# Head
Depto. de Innovacion y Optimizacion

Después de DEPLOY hay que actualizar la VERSION en firebase/database/info_web/version
 
 Por probar:
 - app_inges -> catch (volver a cargar app_inge, tenía una r de sobra en la línea 47)
 - app_reporte_obras -> colorsitos cool (edité, ahora tiene checkboxes... creo :S)
 - app_actualizar_regs -> cambiar Miscelaneo por Otros y hacer todo lo de los registros
 - app_cierre_maestro -> ya suma horas bien (checar en los 5 lugares)
 - app_perfil -> suma horas en inge/obras (checar en los 5 lugares)
 - dashgrid modulo
  
  
 Actualizar_regs:
 - Sumar las horas de cada ppto (como en ACANTO) para todos los demas
 - Código mágico para cambiar todos los misceláneo por Otros en registros.

 Errores:
 - registros con horas = 0 :S
 - Pestaña tipos/generos en bibliotecas se duplica
 
Hoy:

PRODUCCION:
  - A quien le sale y a quien no.
  - Para obra poder modificar imagen para que impriman planos? Tipo hacerle zoom a algo o cosas así. Ver qué necesidad tienen en la obra.

 
SCORE:
  
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
