# Head
Depto. de Innovacion y Optimizacion

Después de DEPLOY hay que actualizar la VERSION en firebase/database/info_web/version
 
 Errores:
   - No se suman las horas en la salida de perfil!! Sólo se guardan las viejas.
   - Hace falta un deploy con perfil, por eso se sigue haciendo la obra Otros
   - Cambié reporte para que si no se selecciona nada sean todos los registros
 Hoy:
  - Sumar las horas de cada ppto (como en ACANTO) para todos los demas

PRODUCCION:
  - A quien le sale y a quien no.
  - Para obra poder modificar imagen para que impriman planos? Tipo hacerle zoom a algo o cosas así. Ver qué necesidad tienen en la obra.

 
SCORE:
  - Reporte pptos no suma todas las horas!!! >:O 
  - No se están guardando bien las horas. Tiene que ser en perfil. HAY QUE ARREGLAR ESE PEDO YA
  - En gestionar el label de "Existe documento firmado" no hace nada
  - Tampoco se suben las fotos de contrato
  - No salen pptos misc en gestionar. Según yo ya estaba arreglado
  
  - Tampoco se suben las fotos de contrato
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
  - si calendarios vacios reportes de todas las fechas
  - En ppto si algo está vacio (req/exc/anexo) poner "no aplica"
  - modal cambio contraseña
  - Reqs (funcionalidad)
  - Checar que no exista otra obra con esa clave

- JUNTA
  - Hablar sobre que Eric de de alta obras.
  - Siguen usando Otros, chance quitarlo de plano.
  - Entrenar a Eric para el uso de la página?
  
- DONE
  - Mover todo a proyectos
  - Ponerle un misc a todas las obras
  - Guardar horas_ie y horas_ihs en consecutivos al generar nuevas versiones
  - PAGOS
  - Imágenes
  - Cierre maestro automático
  - Rama personal
