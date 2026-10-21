# Informe de implementación — Semana 1

**PFY2202 · Desarrollo Frontend II · Experiencia 1 · Forma B**

Proyecto: **Aula Verde**, supermercado ficticio. Fecha: **21 de octubre de 2026**, America/Santiago.

## A. Resultado y alcance

La SPA queda implementada para revisión humana: catálogo de consulta, sucursales activas, contacto demostrativo y navegación inferior con React Router. Se trabajó en `C:\Dev\Duoc\DFEII\DFE_II_supermercado`. El proyecto anterior se consultó en modo de lectura y no se modificó.

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

| Ruta                | Comportamiento                                                                                                                                                                |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/`                 | Presentación de Aula Verde y 12 productos en cinco categorías, búsqueda por nombre/categoría sin distinguir tildes o mayúsculas, selector de categoría y limpieza de filtros. |
| `/nuestras-tiendas` | Tres sucursales activas de cuatro registros. La inactiva permanece en el JSON y no se muestra. Direcciones claramente ficticias.                                              |
| `/contactanos`      | Nombre, correo, asunto y mensaje obligatorios. Rechaza campos vacíos/espacios y formato de correo inválido. Informa que no se ha enviado ningún mensaje.                      |
| `*`                 | Página 404 y enlace SPA al inicio; el menú no marca una ruta equivocada, incluso en una dirección anidada inexistente.                                                        |

Los JSON se solicitan mediante `fetch()` con `import.meta.env.BASE_URL` y Accept application/json. Se verifican respuesta HTTP, lista, campos requeridos, IDs únicos, enteros seguros no negativos y estados booleanos. La disponibilidad debe coincidir con stock > 0. Un conjunto inválido se rechaza entero, sin mostrar registros parcialmente incorrectos.

Ambas páginas de datos disponen de carga, error y vacío. La búsqueda sin coincidencias se distingue de un catálogo realmente vacío. La salida de página cancela solicitudes pendientes, también bajo StrictMode.

El menú inferior persiste en el layout; NavLink aporta aria-current y el CSS añade fondo, subrayado y peso. Se mantienen etiquetas, encabezados, foco visible, enlace de salto y errores asociados. El contenido tiene espacio inferior suficiente para alcanzar sus últimos controles por encima del menú.

No hay modificación de existencias ni servicios de recepción. El formulario conserva valores solo en memoria mientras está montado; no solicita envíos ni escribe almacenamiento del navegador. Las imágenes externas no son necesarias: las tarjetas son representaciones tipográficas con CSS propio.

## C. Comprobaciones ejecutadas

**55 comprobaciones técnicas agrupadas: 14 pruebas unitarias automáticas, 38 escenarios de navegador asistidos por herramientas y tres controles de calidad.** El recuento corresponde a casos únicos finales; no suma las repeticiones de comandos ni cada aserción interna como prueba distinta.

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

## D. Protocolo de revisión humana

El protocolo completo está en [pruebas-manuales-semana-1.md](pruebas-manuales-semana-1.md): **18 pruebas**, con condiciones, acciones, resultados observables y señales de fallo. **Las 18 permanecen «Pendiente de ejecución por el usuario».** No se trasladaron resultados del agente a esa columna.

Las 14 pruebas unitarias pueden repetirse con `npm test`; los 38 escenarios asistidos corresponden a esta sesión de navegador, no a una suite end-to-end instalada. La intervención humana sigue siendo necesaria para registrar los resultados personales, evaluar comodidad visual y contrastar la pauta original. El protocolo explica cómo simular errores con Overrides del navegador sin tocar los originales.

## E. Git y preparación de entrega

- Rama: `main`.
- Primer commit: `bd77a67` — «Implementa catálogo, sucursales y contacto demostrativo con navegación SPA».
- Segundo commit documental: «Documenta validaciones y prepara revisión de Semana 1». Este informe forma parte de ese commit; su identificador se consulta mediante `git log -2 --oneline`.
- Ajuste documental final: «Normaliza formato de la documentación», para eliminar espacios finales de Markdown detectados por Git. El historial completo se consulta con `git log --oneline`.
- El cierre exige `git status --porcelain` vacío después del commit documental.
- `git remote -v` no registra remotos. No se creó GitHub ni se ejecutó push.
- `.gitignore` excluye dependencias, producción y archivos locales. No se añaden secretos ni archivos personales.
- No se creó ZIP definitivo ni se publicó el trabajo.

## F. Auditoría contra los requisitos proporcionados

| Requisito                           | Archivo/componente                                | Evidencia                                                                             | Estado                                                |
| ----------------------------------- | ------------------------------------------------- | ------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| Home relacionado con inventario     | Home, CatalogoProductos, TarjetaProducto          | 12 tarjetas y campos verificados en navegador; JSON y utilidades probados             | Completo                                              |
| Datos de productos por JSON         | productos.json, useProductos, validarDatos        | Carga normal, vacío, inválido, JSON mal formado y HTTP 404                            | Completo                                              |
| Nuestras tiendas                    | NuestrasTiendas, TarjetaSucursal, sucursales.json | Tres activas visibles, inactiva oculta; vacío y errores probados                      | Completo                                              |
| Contáctanos                         | Contactanos, FormularioContacto, validarContacto  | Obligatorios, espacios, correo, éxito demostrativo y edición comprobados              | Completo                                              |
| Menú inferior persistente           | MainLayout, index.css                             | Disponible en las cuatro vistas y contenido final alcanzable                          | Completo                                              |
| React Router y SPA                  | App, main, NavLink, Outlet                        | Tres rutas, 404, recargas, historial y ausencia de recarga al navegar                 | Completo                                              |
| Accesibilidad básica                | Layout, formulario, tarjetas, CSS                 | Teclado, etiquetas, foco, jerarquía y estado activo revisados; sin certificación WCAG | Completo dentro de las verificaciones descritas       |
| Responsive                          | index.css                                         | Nueve combinaciones en 375/768/1366 px sin desbordamiento ni ocultación final         | Completo                                              |
| ESLint, Prettier y build            | Configuraciones y scripts existentes              | Tres comandos finales satisfactorios; 14 pruebas unitarias aprobadas                  | Completo                                              |
| Limpieza y documentación            | README, exclusiones, utilidades y recursos        | Sin referencias antiguas en aplicación/README; recursos de muestra retirados          | Completo                                              |
| Repositorio independiente preparado | Git local en el directorio nuevo                  | Commits locales y ausencia de remoto; proyecto anterior intacto                       | Completo                                              |
| Repositorio en GitHub               | Pendiente de autorización futura                  | Publicación expresamente prohibida en este encargo                                    | Parcial: preparación local completa, remoto pendiente |
| Revisión humana y contraste oficial | Protocolo manual y este informe                   | 18 resultados personales pendientes; originales oficiales no disponibles              | Pendiente de revisión humana                          |

Los dos criterios de evaluación informados quedan cubiertos por la implementación y sus evidencias, sin asignar una nota anticipada. Lo necesario para cerrar la entrega es ejecutar la revisión humana, cotejar los documentos oficiales y autorizar posteriormente el remoto y la entrega.

## G. Guardado e hibernación

La autorización anticipada fue dada en el encargo integrado. Antes de desarrollar, `powercfg /a` confirmó **Hibernar disponible** y se localizaron las herramientas de Windows.

Antes de solicitar hibernación se verifican los archivos guardados, los commits, el estado limpio y el fin de pruebas/instalaciones/escrituras. Se detiene el servidor de desarrollo iniciado por el agente. Se vuelve a consultar la disponibilidad y solicitudes de energía. No se ejecuta apagado, reinicio, cierre de sesión ni hibernación forzada.

**Este documento se guarda antes de la solicitud final. No certifica que el equipo ya haya hibernado:** la transición solo puede producirse después y depende de que Windows acepte la solicitud. La hibernación será la última operación; si Windows o la revisión de permisos la rechazan, no se fuerza.
