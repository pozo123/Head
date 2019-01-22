# Head
Depto. de Innovacion y Optimizacion

Después de DEPLOY hay que actualizar la VERSION en firebase/database/info_web/version
 
 Errores:
 - app_permisos, no me deja actualizarlos -> al parecer solo en mozilla?
 - presu misc no aparece en ningun lado. En perfil tiene sentido porque no està activo pero en gestionar tampoco sale. -> en app_gestionar linea 82 quitar ese if (y cambiar los pptos misc de ahorita a que sean contratos)
 - Hacer que los presus misc salgan como contrato desde el principio. -> 171 app_obra
 - Se genera la obra "otros" -> cambié !== por != en app_perfil 261, agregué unos "option:selected" en donde faltaban
 - no jalan los registros al generar un reporte de la obra otros -> al parecer solo en mozilla tambien
 
 Hoy:
  - Sumar las horas de cada ppto (como en ACANTO) para todos los demas

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
