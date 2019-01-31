# Head
Depto. de Innovacion y Optimizacion

Después de DEPLOY hay que actualizar la VERSION en firebase/database/info_web/version
 
 Por probar:
 - app_inges -> catch
 - app_actualizar_regs -> cambiar Miscelaneo por Otros
 - app_reporte_obras -> colorsitos cool
 
 28/ene 
  - altas: al crear auth hacer un catch por si ya existe sólo guardar datos en el area correspondiente. 
  - Dar las altas en personal de todos.
  - Cambiar ddchecklist por checkbuttons en reporte_obras
 
 Errores:
   - No se suman las horas en la salida de perfil!! Sólo se guardan las viejas.
   - Hace falta un deploy con perfil, por eso se sigue haciendo la obra Otros

Hoy:
  - Sumar las horas de cada ppto (como en ACANTO) para todos los demas

PRODUCCION:
  - A quien le sale y a quien no.
  - Para obra poder modificar imagen para que impriman planos? Tipo hacerle zoom a algo o cosas así. Ver qué necesidad tienen en la obra.

 
SCORE:
  - Código mágico para cambiar todos los misceláneo por Otros en registros.
  
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
  
- DONE
  - Mover todo a proyectos
  - Ponerle un misc a todas las obras
  - Guardar horas_ie y horas_ihs en consecutivos al generar nuevas versiones
  - PAGOS
  - Imágenes
  - Cierre maestro automático
  - Rama personal
