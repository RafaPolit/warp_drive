warp_drive
======================================================================================
Prueba de Codigo - Enterprise’ warp-drive management software

Instalacion
-----------
$ npm install

Testing
-------
$ npm test

Utilizacion
======================================================================================
Hay 2 maneras de usar la aplicacion: desde consola, o desde un explorador de internet
--------------------------------------------------------------------------------------
Desde Consola:
--------------------------------------------------------------------------------------
$ npm run-script enterprise_go

Para configurar:

$ npm config set warp_drive:data 90,20,15,5

(Donde el primer item es la velocidad WARP deseada y los siguientes 3 los daños
 respectivos de los inyectores A, B y C)
--------------------------------------------------------------------------------------


Notas
-----
* La aplicacion esta diseñada para poder responder a cualquier combinacion solicitada
* La aplicacion genera un objecto enterprise que contiene tres funciones:
  - go_mr_Sulu 
* La aplicacion resuelve correctamente los casos 'limite', por ejmplo si se selecciona
  velocidad 0 y daños en los inyectores y otras situaciones litsadas en casos a probar.
* Las dos funciones que reciben input de usuario tienen validacion para evitar numeros fuera
  de rango o texto en lugar de numeros, etc.
* La aplicacion esta diseñada para que puedan cambiarse las especificaciones de flujo por
  warp, rendimiento de los inyectores, etc.

  Casos a Probar
  --------------
  Seria interesante probar algunos casos 'especiales', para ver los algoritmos matematicos.
  * A:20%, B:0%, C:0%, W:3% -> Determinados algoritmos arrojaran el flujo de A en negativo!.
  * A:0%, B:90%, C:0%, W:0% -> Cualquier combinacion de velocidad 0 con daño en los inyectores.
  * A:0%, B:0%, C:99%, W:20% -> Determinados algoritmos pondran Unable, aunque A y B pueden solos.