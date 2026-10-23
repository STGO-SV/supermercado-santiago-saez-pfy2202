# Informe de implementación — Semana 1

**PFY2202 · Desarrollo Frontend II · Experiencia 1 · Forma B**

Proyecto: **Despensa Verde**, supermercado ficticio. Implementación: **21 de octubre de 2026**. Cierre: **22 de octubre de 2026**, America/Santiago.

## A. Resultado y alcance

Se completó la implementación de la SPA: catálogo de consulta, sucursales activas, contacto demostrativo y navegación inferior con React Router. Se trabajó en `C:\Dev\Duoc\DFEII\DFE_II_supermercado`. El proyecto anterior se consultó en modo de lectura y no se modificó.

No se dispone de los documentos oficiales originales de la evaluación. La auditoría usa los requisitos explícitos de los dos textos adjuntos y la indicación de dos criterios de 50 puntos; no constituye una calificación oficial. El primer texto termina con una frase truncada después de «contengan la»; se cumplieron sus instrucciones completas y legibles sobre informes y validación manual.

La Etapa 1 se revisó antes de continuar: dependencias instaladas, rutas, lint, formato y build correctos. No existían commits ni remoto, y todos los archivos estaban sin seguimiento.

### Reutilización selectiva

- `C:\Dev\Duoc\DFEI\S1\src\utils\formatoPrecio.js`: se conserva su implementación para moneda CLP.
- `C:\Dev\Duoc\DFEI\S1\src\components\CatalogoProductos.jsx`: se adaptan búsqueda sin tildes, filtrado y estados; sin comportamiento de compra.
- `C:\Dev\Duoc\DFEI\S1\src\components\TarjetaProducto.jsx`: se adapta la tarjeta para precio único, stock y disponibilidad.
- `C:\Dev\Duoc\DFEI\S1\src\components\FormularioContacto.jsx`: se conservan campos controlados, validación y mensajes accesibles; se añade asunto y foco en el primer error.
- Del patrón de carga anterior se recuperan comprobación HTTP, validación de datos y cancelación con AbortController. Las cargas permanecen independientes y sencillas.

Se descartaron la identidad visual y recursos temáticos anteriores, las operaciones de compra y su almacenamiento. No se incorporaron sus estilos globales ni bibliotecas visuales. Se eliminaron los recursos iniciales sin uso `public/icons.svg`, `public/favicon.svg`, `src/assets/react.svg`, `src/assets/vite.svg` y `src/assets/hero.png`. El `src/App.css` inicial ya había sido eliminado en la Etapa 1.

### Inventario de archivos

Rutas relativas a `C:\Dev\Duoc\DFEII\DFE_II_supermercado`:

| Estado respecto de la Etapa 1    | Archivos                                                                                                                                                                     |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Nuevos datos                     | `public/data/productos.json`, `public/data/sucursales.json`                                                                                                                  |
| Nuevos componentes               | `src/components/CatalogoProductos.jsx`, `TarjetaProducto.jsx`, `TarjetaSucursal.jsx`, `FormularioContacto.jsx`                                                               |
| Nuevas cargas                    | `src/hooks/useProductos.js`, `src/hooks/useSucursales.js`                                                                                                                    |
| Nuevas utilidades                | `src/utils/formatoPrecio.js`, `normalizarTexto.js`, `validarDatos.js`, `validarContacto.js`                                                                                  |
| Modificados                      | `src/pages/Home.jsx`, `src/pages/NuestrasTiendas.jsx`, `src/pages/Contactanos.jsx`, `src/layouts/MainLayout.jsx`, `src/index.css`, `index.html`, `README.md`, `package.json` |
| Nuevos controles y documentación | `tests/validaciones.test.js`, `.gitattributes`, este informe, `docs/pruebas-manuales-semana-1.md` y evidencias actuales en `docs/evidencia/`                                 |
| Conservados                      | Árbol de rutas en `src/App.jsx`, `src/main.jsx`, `src/pages/NoEncontrado.jsx`, configuración Vite, ESLint, Prettier, exclusiones y archivo de versiones instaladas           |

La captura `docs/evidencia/etapa1-inicio.jpg` se conserva como evidencia histórica de la base; las capturas del catálogo, tiendas y contacto corresponden a esta implementación.

No se instalaron dependencias nuevas en esta etapa. Continúan React/React DOM 19.3.1, React Router 8.5.0, Vite instalado 8.3.5, ESLint 10.13.0, Prettier 3.9.10 y eslint-config-prettier 10.1.8. Los imports de enrutamiento corresponden al paquete instalado `react-router`. Node.js local: 24.11.0; el requisito documentado es >=22.22 por React Router.

## B. Funcionalidad

| Ruta                | Comportamiento                                                                                                                                                                    |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/`                 | Presentación de Despensa Verde y 12 productos en cinco categorías, búsqueda por nombre/categoría sin distinguir tildes o mayúsculas, selector de categoría y limpieza de filtros. |
| `/nuestras-tiendas` | Tres sucursales activas de cuatro registros. La inactiva permanece en el JSON y no se muestra. Direcciones claramente ficticias.                                                  |
| `/contactanos`      | Nombre, correo, asunto y mensaje obligatorios. Rechaza campos vacíos/espacios y formato de correo inválido. Informa que no se ha enviado ningún mensaje.                          |
| `*`                 | Página 404 y enlace SPA al inicio; el menú no marca una ruta equivocada, incluso en una dirección anidada inexistente.                                                            |

Los JSON se solicitan mediante `fetch()` con `import.meta.env.BASE_URL` y Accept application/json. Se verifican respuesta HTTP, lista, campos requeridos, IDs únicos, enteros seguros no negativos y estados booleanos. La disponibilidad debe coincidir con stock > 0. Un conjunto inválido se rechaza entero, sin mostrar registros parcialmente incorrectos.

Ambas páginas de datos disponen de carga, error y vacío. La búsqueda sin coincidencias se distingue de un catálogo realmente vacío. La salida de página cancela solicitudes pendientes, también bajo StrictMode.

El menú inferior persiste en el layout; NavLink aporta aria-current y el CSS añade fondo, subrayado y peso. Se mantienen etiquetas, encabezados, foco visible, enlace de salto y errores asociados. El contenido tiene espacio inferior suficiente para alcanzar sus últimos controles por encima del menú.

No hay modificación de existencias ni servicios de recepción. El formulario conserva valores solo en memoria mientras está montado; no solicita envíos ni escribe almacenamiento del navegador. Las imágenes externas no son necesarias: las tarjetas son representaciones tipográficas con CSS propio.

## C. Comprobaciones técnicas del 21 de octubre de 2026

**55 comprobaciones técnicas agrupadas: 14 pruebas unitarias automáticas, 38 escenarios de navegador y tres controles de calidad de código.** El recuento corresponde a casos únicos finales; no suma las repeticiones de comandos ni cada aserción interna como prueba distinta.

| Grupo                  | Cantidad | Resultado                                                                                                                                  |
| ---------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `npm test`             | 14       | 14 aprobadas, cero fallos y cero omitidas. Datos reales, límites, IDs, tipos, disponibilidad, actividad, contacto, moneda y normalización. |
| Navegador              | 38       | 38 escenarios satisfactorios, detallados en `docs/evidencia/comprobaciones-navegador.json`.                                                |
| `npm run lint`         | 1        | Sin errores ni advertencias.                                                                                                               |
| `npm run format:check` | 1        | Todos los archivos comprobados conformes.                                                                                                  |
| `npm run build`        | 1        | Compilación de producción correcta; 107 módulos transformados.                                                                             |

También se ejecutaron `npm ls --depth=0`, `npm run format`, comprobaciones de Git, búsqueda de referencias antiguas y comparación SHA256 de los datos.

### Navegación y presentación

Se probaron los enlaces del menú, indicador activo, navegación SPA, Atrás/Adelante, accesos directos y recarga de las tres páginas. Para SPA se observó continuidad del documento/foco y ausencia de una nueva conexión del cliente de desarrollo al cambiar de página.

Se comprobaron la ruta 404 normal y la anidada, retorno al inicio, tabulación, foco en el primer error y salto al contenido. La consola final no presentó errores ni advertencias con los datos restaurados.

En los anchos 375, 768 y 1366 se revisaron las tres páginas: nueve combinaciones. El ancho del contenido no excede al disponible y la posición del último control/tarjeta al final del desplazamiento queda por encima del menú. El área útil puede descontar el ancho de la barra vertical. Se guardaron capturas `catalogo-1366.jpg`, `tiendas-768.jpg` y `contacto-375.jpg`.

### Fallos controlados y restauración

Se observaron estados de carga y se comprobaron catálogo vacío, búsqueda sin coincidencias, JSON mal formado, producto con precio negativo, sucursales vacías, cero activas, actividad inválida y fallo HTTP por archivos ausentes. Con Accept application/json se confirmó HTTP 404 real para el catálogo ausente.

Los errores esperados muestran avisos comprensibles y conservan la navegación. Se restauraron exactamente los dos archivos, con estas huellas idénticas a las previas a las pruebas:

- Productos: `56F5D4C1D0DC30CDFD29296B0D8137AEDE29E4FD9E2996ACACBDC44520017AF2`.
- Sucursales: `4B3A0E964634556CFB235828B9E6963E85CD63A1946EEAF3C47330003667B92F`.

No quedan copias de los datos alterados ni respaldos temporales de prueba.

### Ajustes y límites de la validación

Se añadió coincidencia exacta a los enlaces de tiendas y contacto para que una subruta inexistente no aparezca activa. Se quitaron recursos sin uso y se mantuvo la cabecera Accept de JSON para distinguir correctamente recursos ausentes. Se corrigió el mínimo de Node documentado al consultar los requisitos del paquete instalado.

Git avisó inicialmente de conversión LF/CRLF; se añade `.gitattributes` para mantener finales de línea LF de forma reproducible, sin modificar configuración global. Las comprobaciones visuales inicialmente anticiparon un desplazamiento aún en curso; se repitieron midiendo la posición final y con inspección visual, sin detectar un defecto del layout.

No se ejecutó una auditoría completa con lector de pantalla, dispositivos físicos, todos los navegadores ni herramienta automática de contraste/WCAG. Se revisaron semántica, etiquetas, estilos de contraste y teclado en el navegador integrado; esto no equivale a certificar accesibilidad. No se probó despliegue público porque no está autorizado. La recepción real de mensajes está excluida del alcance.

## D. Validación manual del 22 de octubre de 2026

El protocolo completo se conserva en [pruebas-manuales-semana-1.md](pruebas-manuales-semana-1.md). **Se registran 18/18 pruebas APROBADAS, con fecha de ejecución 22-10-2026 y sin fallos detectados.** Se conservaron íntegramente los procedimientos y resultados esperados de los 18 casos.

El registro se basa en la confirmación de cierre de la ejecución manual recibida el 22 de octubre de 2026. No se atribuyen esos resultados a pruebas unitarias ni a una ejecución automatizada. No se especificó la versión exacta del navegador utilizado en la ejecución manual.

Se confirmaron navegación SPA, rutas principales y 404, carga HTTP de ambos JSON, filtros y búsqueda, exclusión de sucursales inactivas, formulario demostrativo sin envío, teclado y las nueve combinaciones de página y resolución. Se confirmó el manejo de fallos de red y datos inválidos, la restauración de ambos JSON y la desactivación de los bloqueos y Local Overrides.

Las 55 comprobaciones técnicas previas se mantienen separadas: 14 pruebas unitarias, 38 escenarios de navegador y tres controles de calidad de código. Las pruebas unitarias se reproducen con `npm test`; las evidencias de navegador corresponden a la sesión del 21 de octubre y no constituyen una suite end-to-end instalada. No se presenta el conjunto de 73 registros como una única suite automatizada.

## E. Git y preparación de publicación

- Rama: `main`.
- Primer commit: `bd77a67` — «Implementa catálogo, sucursales y contacto demostrativo con navegación SPA».
- Segundo commit documental: «Documenta validaciones y prepara revisión de Semana 1». Su identificador es `6634846`.
- Ajuste documental final: «Normaliza formato de la documentación», para eliminar espacios finales de Markdown detectados por Git. El historial completo se consulta con `git log --oneline`.
- Registro operativo final: «Registra comprobaciones de cierre e hibernación».
- Antes de este cierre documental se comprobó un árbol limpio en `main`. Se exige nuevamente `git status --porcelain` vacío después del commit de cierre.
- Commit de cierre previsto: «Cierra validación manual y documentación de Semana 1». El identificador final se obtiene con `git log -1 --oneline`.
- Nombre previsto para el repositorio público: `supermercado-santiago-saez-pfy2202`. La creación y publicación permanecen pendientes de autorización.
- `git remote -v` no registra remotos. No se creó GitHub ni se ejecutó push.
- `.gitignore` excluye dependencias, producción y archivos locales. No se añaden secretos ni archivos personales.
- No se creó ZIP definitivo ni se publicó el trabajo.

## F. Auditoría contra los requisitos proporcionados

| Requisito                                     | Archivo/componente                                | Evidencia                                                                             | Estado                                                |
| --------------------------------------------- | ------------------------------------------------- | ------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| Home relacionado con inventario               | Home, CatalogoProductos, TarjetaProducto          | 12 tarjetas y campos verificados en navegador; JSON y utilidades probados             | Completo                                              |
| Datos de productos por JSON                   | productos.json, useProductos, validarDatos        | Carga normal, vacío, inválido, JSON mal formado y HTTP 404                            | Completo                                              |
| Nuestras tiendas                              | NuestrasTiendas, TarjetaSucursal, sucursales.json | Tres activas visibles, inactiva oculta; vacío y errores probados                      | Completo                                              |
| Contáctanos                                   | Contactanos, FormularioContacto, validarContacto  | Obligatorios, espacios, correo, éxito demostrativo y edición comprobados              | Completo                                              |
| Menú inferior persistente                     | MainLayout, index.css                             | Disponible en las cuatro vistas y contenido final alcanzable                          | Completo                                              |
| React Router y SPA                            | App, main, NavLink, Outlet                        | Tres rutas, 404, recargas, historial y ausencia de recarga al navegar                 | Completo                                              |
| Accesibilidad básica                          | Layout, formulario, tarjetas, CSS                 | Teclado, etiquetas, foco, jerarquía y estado activo revisados; sin certificación WCAG | Completo dentro de las verificaciones descritas       |
| Responsive                                    | index.css                                         | Nueve combinaciones en 375/768/1366 px sin desbordamiento ni ocultación final         | Completo                                              |
| ESLint, Prettier y build                      | Configuraciones y scripts existentes              | Tres comandos finales satisfactorios; 14 pruebas unitarias aprobadas                  | Completo                                              |
| Limpieza y documentación                      | README, exclusiones, utilidades y recursos        | Sin referencias antiguas en aplicación/README; recursos de muestra retirados          | Completo                                              |
| Repositorio independiente preparado           | Git local en el directorio nuevo                  | Commits locales y ausencia de remoto; proyecto anterior intacto                       | Completo                                              |
| Repositorio en GitHub                         | Pendiente de autorización futura                  | Publicación expresamente prohibida en este encargo                                    | Parcial: preparación local completa, remoto pendiente |
| Validación manual                             | Protocolo manual y este informe                   | 18/18 pruebas aprobadas el 22-10-2026, sin defectos detectados                        | Completo                                              |
| Contraste con documentos oficiales originales | Requisitos explícitos recibidos                   | Los originales oficiales no están disponibles; no se asigna una calificación          | Limitación documental                                 |

Los dos criterios de evaluación informados quedan cubiertos por la implementación y sus evidencias, sin asignar una nota anticipada. La validación manual se cerró satisfactoriamente el 22 de octubre de 2026. Permanecen pendientes el contraste con los documentos oficiales originales y la autorización de publicación en GitHub.

## G. Registro operativo del 21 de octubre de 2026

Se guardaron la implementación, las evidencias y los informes antes de solicitar hibernación mediante `shutdown.exe /h`. Previamente se detuvo el servidor de desarrollo y se comprobó la finalización de las operaciones de pruebas, instalaciones y Git.

Se comprobó la disponibilidad de hibernación mediante `powercfg /a`. La consulta `powercfg /requests` no estuvo disponible por falta de privilegios de administrador. No se modificaron las opciones de energía ni se solicitó apagado, reinicio o hibernación forzada. El registro documenta la solicitud emitida, sin certificar por sí mismo la transición efectiva del equipo.

Este registro es histórico. El cierre documental del 22 de octubre de 2026 no incluye una nueva solicitud de hibernación.

## H. Cierre definitivo del 22 de octubre de 2026

Se cerró la Semana 1 con 18 pruebas manuales aprobadas y ningún defecto detectado durante esa revisión. Se mantienen las 55 comprobaciones técnicas satisfactorias del 21 de octubre como un registro independiente. No se modificaron funcionalidades, arquitectura, datos ni dependencias durante el cierre documental.

### Auditoría técnica de cierre

Se ejecutaron nuevamente los cuatro comandos de validación el 22 de octubre de 2026:

| Naturaleza                     | Comando                | Resultado                                              |
| ------------------------------ | ---------------------- | ------------------------------------------------------ |
| Pruebas unitarias              | `npm test`             | 14 aprobadas; cero fallos, cancelaciones u omisiones.  |
| Calidad de código              | `npm run lint`         | Ejecución satisfactoria, sin errores ni advertencias.  |
| Calidad de código: formato     | `npm run format:check` | Todos los archivos comprobados conformes con Prettier. |
| Calidad de código: compilación | `npm run build`        | Compilación de producción satisfactoria.               |

Esta repetición de validaciones no incrementa el recuento histórico de 55 comprobaciones ni sustituye las 18 pruebas manuales.

Se revisaron las instrucciones del README, las exclusiones de Git, los archivos versionados, las dependencias y las referencias operativas. Se compararon las huellas SHA256 de ambos JSON con las registradas en la sección C. Se conservaron los datos originales y no se detectaron archivos temporales de prueba ni cambios en `package.json` o `package-lock.json`.

La revisión de nombres y contenido de archivos versionados no detectó contraseñas, tokens, claves privadas ni archivos de uso privado. Los datos de contacto presentes en las pruebas son ficticios. Las referencias al código anterior en la sección A son históricas y no intervienen en la instalación ni ejecución. La revisión no constituye una certificación de ausencia absoluta de secretos.

Los archivos modificados para este cierre son `README.md`, `docs/pruebas-manuales-semana-1.md` y `docs/informe-implementacion-semana-1.md`. Se aplica redacción técnica e impersonal y se distinguen pruebas manuales, unitarias, de navegador y controles de calidad de código.

### Publicación y límites pendientes

El contenido local queda preparado para publicación pública en el repositorio previsto `supermercado-santiago-saez-pfy2202`. La creación del remoto y `git push` no se han ejecutado. No se genera un ZIP de entrega.

No se detectaron defectos funcionales durante la revisión manual. Se conservan las limitaciones descritas: formulario sin recepción real, ausencia de despliegue público comprobado, falta de documentos oficiales originales y ausencia de certificación completa de accesibilidad. La siguiente operación pendiente es la autorización de publicación.
