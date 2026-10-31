# Mejoras derivadas de la retroalimentación de Semana 1

PFY2202 · Despensa Verde · 31 de octubre de 2026 · America/Santiago

## Alcance y verificación de la base

La rama activa es `semana-3`, con base `3c9ea9c` («Integra Tailwind CSS y completa Semana 2.»). `semana-2` es antecesora de HEAD. Se conserva la implementación de ambas etapas: estado compartido, alta de artículos, tabla de inventario, validaciones, navegación y Tailwind CSS.

Al iniciar existían dos modificaciones locales en `src/pages/Contactanos.jsx` y `src/pages/NuestrasTiendas.jsx`, correspondientes a correcciones ortográficas. Se conservaron sin incluirlas en el commit de mejoras. En tiendas, únicamente se prepara la integración del reintento. La búsqueda de las dos erratas en `src/` no obtuvo coincidencias en la copia de trabajo.

Las referencias `main`, `semana-1` y `semana-2` se mantienen intactas. No se añaden dependencias, persistencia, servicios de aplicación ni reintentos automáticos. Este trabajo aplica sugerencias sobre Semana 1 a la base completa de Semana 2; no implementa ni acredita futuros requisitos académicos de Semana 3.

## Funcionalidades incorporadas

El layout obtiene `pathname` de React Router y actualiza `document.title`. La utilidad central usa `matchPath` con coincidencia completa, compatible con las barras finales y mayúsculas admitidas por Router. Se contemplan Inicio, Nuestras tiendas, Contáctanos, Ingreso de artículos, Inventario y Página no encontrada (404), con el sufijo «| Despensa Verde». Una subruta desconocida no recibe el título de su prefijo.

La utilidad `crearCargaJSON` concentra la comprobación HTTP, transformación, cancelación y control de fase. Solo admite una carga inicial o un reintento explícito tras error. El bloqueo se establece sin esperar al siguiente render, por lo que invocaciones consecutivas no generan solicitudes simultáneas. Cada operación tiene su controlador; una operación cancelada no publica respuestas ni errores tardíos, incluso si la solicitud ignora la cancelación. StrictMode crea una operación nueva tras cancelar la anterior.

`ProductosProvider` publica `reintentar` en el contexto. El hook `useProductos`, revisado y conservado, lo expone junto al estado y al alta mediante su retorno del contexto. El reducer incorpora `CARGA_INICIADA`, limpia el error y solo permite reiniciar después de un fallo. La lista recuperada reemplaza la semilla de forma controlada. Una carga satisfactoria cierra la operación: no puede repetir la semilla ni sobrescribir altas posteriores.

`useSucursales` publica una operación equivalente y mantiene su validación de datos y filtrado de sucursales activas. El componente compartido `ErrorCarga` presenta el mensaje con `role="alert"` y el botón «Reintentar». Se integra en catálogo, ingreso, inventario y tiendas. Durante cada solicitud el botón desaparece y se presenta «Cargando…» con `role="status"`. El ingreso permanece bloqueado mientras hay carga o error.

## Corrección de referencias documentales

La revisión del historial y de las cuatro capturas originales identificó versiones anteriores a la identidad final. Se corrige la atribución de las capturas en el informe de Semana 1 y se añade una aclaración de procedencia por archivo. El protocolo manual remite a esa aclaración. El README describe la rama actual, las mejoras y las comprobaciones posteriores por separado.

No se alteran capturas históricas, JSON de resultados, fechas de ejecuciones ni recuentos previos. Las referencias a «Aula Verde», «El inventario, a la vista» y «Un espacio para cada comunidad» identifican evidencia intermedia; no describen los textos finales de la entrega de Semana 1.

## Archivos del encargo

| Grupo           | Archivos                                                                                                                                                                                                                  |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Títulos         | `src/layouts/MainLayout.jsx`, nuevo `src/utils/titulos.js`                                                                                                                                                                |
| Carga y estado  | nuevo `src/utils/cargaJSON.js`, `src/context/ProductosProvider.jsx`, `src/reducers/productosReducer.js`, `src/hooks/useSucursales.js`                                                                                     |
| Presentación    | nuevo `src/components/ErrorCarga.jsx`, `src/components/CatalogoProductos.jsx`, `src/pages/Home.jsx`, `src/pages/IngresoArticulos.jsx`, `src/pages/Inventario.jsx`, integración parcial de `src/pages/NuestrasTiendas.jsx` |
| Pruebas         | nuevo `tests/mejoras-semana-1.test.js`                                                                                                                                                                                    |
| Documentación   | `README.md`, `docs/informe-implementacion-semana-1.md`, `docs/pruebas-manuales-semana-1.md`, este informe                                                                                                                 |
| Evidencia nueva | `docs/evidencia/mejoras-semana-1/`: cuatro capturas y `rutas-y-anchos.json`                                                                                                                                               |

## Comprobaciones ejecutadas

| Comprobación           | Resultado                                                                                |
| ---------------------- | ---------------------------------------------------------------------------------------- |
| `npm test`             | 51 pruebas aprobadas: 35 existentes y 16 nuevas; cero fallos, omisiones o cancelaciones. |
| `npm run lint`         | Satisfactorio, sin errores ni advertencias.                                              |
| `npm run format:check` | Satisfactorio después de aplicar formato a los archivos del encargo.                     |
| `npm run build`        | Satisfactorio: 122 módulos transformados.                                                |
| `git diff --check`     | Satisfactorio, sin errores de espacios.                                                  |

Las pruebas nuevas cubren seis títulos, concordancia con Router, reintento satisfactorio tras JSON mal formado o datos inválidos, fallo de red seguido de HTTP fallido y posterior recuperación, exclusión de solicitudes concurrentes, cancelación con respuestas tardías, listas vacías, cabecera JSON y reinicio controlado del reducer. Las 35 pruebas originales continúan comprobando datos, altas, IDs únicos, validaciones y conservación de registros.

### Navegador y regresión

Se utilizó el navegador integrado, con servidor Vite en `127.0.0.1:5173` y la compilación local en un servidor temporal de pruebas en `127.0.0.1:4174`. Este último simuló HTTP 503 y demoras de 1200 ms mediante configuración temporal fuera del repositorio, sin modificar los JSON originales ni el código de producción. La primera apertura local falló antes de disponer de un servidor accesible; se repitió satisfactoriamente tras iniciar el servidor con acceso local habilitado.

Se ejecutaron los siguientes recorridos:

- Títulos de las seis situaciones, navegación SPA e historial Atrás desde 404 a Inventario. La 404 anidada también muestra el título correcto.
- Productos: fallo inicial, segundo fallo, recuperación desde Ingreso de artículos y cambio a Inicio durante la solicitud. Se recuperan doce productos y desaparece el botón. El error compartido se muestra también en Inventario y el formulario permanece bloqueado durante el fallo.
- Sucursales: fallo inicial, segundo fallo y recuperación mediante el botón. Se observan los estados de carga sin botón y las tres sucursales activas tras recuperarse.
- Alta con formulario vacío: cinco errores y foco en el primer campo. Alta válida de «Avena de prueba», marca informada, precio 1290 y cantidad cero: trece registros únicos en inventario y catálogo, con «Sin stock».
- Búsqueda «AVENA»: una coincidencia entre trece; limpieza: trece; categoría Lácteos: tres. La recarga de Inventario restablece doce registros.
- Contacto vacío: cuatro errores y foco en nombre. Datos ficticios válidos: confirmación de validación sin envío.
- Las seis páginas se miden después de completar sus cargas en 375, 768 y 1366 px: dieciocho combinaciones sin desbordamiento horizontal del documento. La tabla mantiene su contenedor de desplazamiento. Los resultados reales están en `evidencia/mejoras-semana-1/rutas-y-anchos.json`.

Las capturas nuevas son `sucursales-error-375.jpg`, `inventario-alta-375.jpg`, `inventario-768.jpg` e `ingreso-1366.jpg`. Se inspeccionan el error móvil, la tabla en móvil y tableta y el formulario en escritorio. Se compara visualmente el formulario de escritorio con `evidencia/semana-2/etapa-2/ingreso-1366.png`: se conserva la distribución; los navegadores y barras de desplazamiento producen diferencias menores de área útil. Esta revisión es visual y geométrica, sin comparación automática píxel a píxel.

## Estado y límites

Las verificaciones finalizaron satisfactoriamente. No se detectaron pendientes funcionales dentro del encargo. Se mantienen los límites de la aplicación: datos demostrativos, contacto sin envío y altas únicamente en memoria. No se certifica accesibilidad completa ni compatibilidad exhaustiva entre navegadores.

El commit se limita a estas mejoras en `semana-3`, con el mensaje «Implementa sugerencias de mejora de retroalimentación Semana 1». Las dos correcciones locales previas quedan fuera de su contenido y permanecen en la copia de trabajo. No se ejecutan `git push`, fusiones ni cambios sobre las ramas protegidas por el alcance.
