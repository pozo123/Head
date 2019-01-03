# Head
Depto. de Innovacion y Optimizacion
Deploy:
 - lalala terminal todo
 - deploy
 - actualizar version en firebase/database/info_web/version
 
 Hoy:
   - Miscelaneo:
     - Dar de alta los pptos miscelaneos de las obras ya existentes (las nuevas obras las hacen automáticos)
     - Cambiar obra Miscelaneo por "extras"/"otros" o lo que sea (en perfil). Cambiar la funcionalidad en toooodas las apps :/
  - Guardar horas_ie y horas_ihs en consecutivos al generar nuevas versiones
  - Clave pptos: consec no depende de version, sino de que no hayan otros pptos con la misma clave en la obra
  
 14/enero/2019
  - Revisar si se genera el registro 0
  - Dashboard con child_added / child_changed
  - Cierre maestro 5 pm con cloud functions
  - Reporte ppto (revisar error imagen)

 PRODUCCION:
  - A quien le sale y a quien no.
  - Mover toda la db (menos clientes) a una rama "proyectos" usando export e import json.
   - cambiar en todas las apps "rama_bd" a "proyectos/lo_de_antes"
   
 DICIEMBRE:
  - Sumar las horas de cada ppto (como en ACANTO) para todos los demas

 ENERO:
  - modal cambio contraseña
  - En graphs que vayan de 0, porque si no no se ven bien las proporciones
  - si calendarios vacios reportes de todas las fechas
  - En ppto si algo está vacio (req/exc/anexo) poner "no aplica"
  - botón eliminar en bibliotecas
    - Colabs? borrarlos de auth pero no de database, no? meterle atributo "eliminado"?
    - Obras Poner activo/No activo?
    - pptos sí
    - Despachos no, o sí?
    - atn sí
    - req/exc sí
    - tipos/generos sí
  - Leer archivos de imagen
    - inges
    - reqs
    - contratos
  - Update uml
    - Hacer un diagrama con esteroides, relacional entre metodos, apps y uml con clases y atributos


- FUTUREANDO
  - Dashgrid
  - Dashcards nuevo diseño
  - Reqs (funcionalidad)
  - Para obra poder modificar imagen para que impriman planos? Tipo hacerle zoom a algo o cosas así. Ver qué necesidad tienen en la obra.
  - Checar que no exista otra obra con esa clave

- JUNTA

