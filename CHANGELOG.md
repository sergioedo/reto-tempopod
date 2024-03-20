Listado de mejoras y decisiones tomadas.

-   **Feed inválido**: en caso de que no se puedan obtener correctamente los datos del feed, se lanza una excepción, para el que invoque la función gestione el error.
-   **Feed sin items**: si no tiene items, el resultado debe ser un array vacío. Para hacer los tests con feeds en fichero, se ha hecho refactor, separando la lectura del feed (fichero or URL) del resto del código.
-   **Tiempo inferior al capítulo más corto**: aquí decidimos también devolver un listado vacío.
-   **Episodios sin duración**: determinamos obviarlos.
