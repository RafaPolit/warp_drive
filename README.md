======================================================================================
warp_drive
Prueba de Codigo - Enterprise’ warp-drive management software

Instalacion
======================================================================================
$ npm install

Testing
======================================================================================
$ npm test

Utilizacion
======================================================================================
Hay 2 maneras de usar la aplicacion: desde un explorador de internet o desde consola 

--------------------------------------------------------------------------------------
Desde un Navegador de Internet (Chrome recomendado):
--------------------------------------------------------------------------------------
Ejecutar
$ npm start

* http://localhost:3000       - en el navegador para ver resultados de casos ejemplo
* http://localhost:3000/go    - para ingresar datos distintos a los de ejemplo

--------------------------------------------------------------------------------------
Desde Consola:
--------------------------------------------------------------------------------------
$ npm run-script enterprise_go

Para configurar:

$ npm config set warp_drive:data 90,20,15,5

(Donde el primer item es la velocidad WARP deseada y los siguientes 3 los daños
 respectivos de los inyectores A, B y C)
 
======================================================================================
Estructura
======================================================================================
* Todos los modelos de la aplicación se encuentran en /libraries/models
* Cada uno de ellos viene acompañado de un test en /specs/models
* Un script con utilidades menores se encuentra en /libraries/utils
* Este script tiene su test respectivo en /specs/utils
* Las 'fixtures' para los tests se encuentran en /specs/fixtures

Notas
======================================================================================
* La aplicacion esta diseñada para poder responder a cualquier combinacion solicitada
* La aplicacion genera un objeto enterprise que contiene tres funciones:
  La principal es ** go_mr_Sulu **
  Las otras sirven para obtener los resultados en formato string.
* Algunos test realmente son tests de integración, que deberían haber sido remplazados
  por mocks individuales.
* La aplicacion resuelve correctamente los casos 'limite', por ejmplo si se selecciona
  velocidad 0 y daños en los inyectores y otras situaciones litsadas en casos a probar.
* Las dos funciones que reciben input de usuario tienen validacion para evitar numeros
  fuera de rango o texto en lugar de numeros, etc.
* La aplicacion esta diseñada para que puedan cambiarse las especificaciones de flujo
  por warp, rendimiento de los inyectores, etc.
* Tanto las rutas js, las vistas ejs y la aplicación de consola están hechas más bien
  al apuro y sin tests o 'refactors' más alla de verificar que funcionen y son más bien 
  para mostrar los datos y servir de input que como referencia de código, así que por
  favor no les tengan en cuenta como emjemplo de código.
* Usé Bootsrap como CSS para la vista rápida de las dos páginas WEB, pero no hay nada
  de funcionalidad JS sacada de librerías en ninguna parte del código más allá del 
  aspecto de los ejs.

Casos 'Limite' a probar para verificar
---------------------------------------------------------------------------------------
Seria interesante probar algunos casos 'especiales', para ver los algoritmos matematicos.
* A:20%, B:0%, C:0%, W:3% -> Determinados algoritmos arrojaran el flujo de A en negativo!.
* A:0%, B:90%, C:0%, W:0% -> Cualquier combinacion de velocidad 0 con daño en los inyectores.
* A:90%, B:40%, C:40%, W:50% -> Determinados algoritmos no optimizaran el tiempo restante.