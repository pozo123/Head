# Head
Depto. de Innovacion y Optimizacion
Deploy:
 - lalala terminal todo
 - deploy
 - actualizar version en firebase/database/info_web/version
 
 Hoy:
  - Miscelaneo:
     - Cambiar obra Miscelaneo por "extras"/"otros" en:
        - cierre maestro (linea 36)
        - dashboard (linea 112)
        - reporte (lineas 46 y 78)
        - perfil (lineas 31, 114, 141, 241 y 259(y 10, 11, 106, 116, 120, 137, 142, 242??))
  - Guardar horas_ie y horas_ihs en consecutivos al generar nuevas versiones
  - Clave pptos: consec no depende de version, sino de que no hayan otros pptos con la misma clave en la obra
  - Sumar las horas de cada ppto (como en ACANTO) para todos los demas

 14/enero/2019
  - PAGOS
  - Revisar si se genera el registro 0
  - Cierre maestro 5 pm con cloud functions
  - Reporte ppto (revisar error imagen)
  - Leer archivos de imagen
    - inges
    - reqs
    - contratos  
  - botón eliminar en bibliotecas
    - Colabs? borrarlos de auth pero no de database, no? meterle atributo "eliminado"? -> No, sólo en auth. lo demás es con permisos.
    - Obras Poner activo/No activo?
    - pptos sí
    - Despachos no, o sí?
    - atn sí
    - req/exc sí
    - tipos/generos sí
    
  - Update uml
    - Hacer un diagrama con esteroides, relacional entre metodos, apps y uml con clases y atributos

 PRODUCCION:
  - A quien le sale y a quien no.
  - Mover toda la db (menos clientes) a una rama "proyectos" usando export e import json.
   - cambiar en todas las apps "rama_bd" a "proyectos/lo_de_antes"
   
- FUTUREANDO
  - si calendarios vacios reportes de todas las fechas
  - En ppto si algo está vacio (req/exc/anexo) poner "no aplica"
  - modal cambio contraseña
  - Dashgrid
  - Dashcards nuevo diseño
  - Reqs (funcionalidad)
  - Para obra poder modificar imagen para que impriman planos? Tipo hacerle zoom a algo o cosas así. Ver qué necesidad tienen en la obra.
  - Checar que no exista otra obra con esa clave

- JUNTA

