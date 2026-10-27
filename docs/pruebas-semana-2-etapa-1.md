# Pruebas de estado global e ingreso de artículos

PFY2202 · Experiencia 1 · Semana 2 · Forma B · Despensa Verde

Comprobaciones ejecutadas el 27 de octubre de 2026. Este documento corresponde exclusivamente a la primera etapa de Semana 2; los resultados históricos de Semana 1 permanecen en sus archivos originales.

## Preparación y comandos

Desde la raíz del proyecto, con las dependencias existentes:

```powershell
npm test
npm run lint
npm run format:check
npm run build
npm run dev -- --host 127.0.0.1 --port 5175 --strictPort
```

El servidor de desarrollo se consulta en `http://127.0.0.1:5175/`. Las cuatro comprobaciones de calidad finalizaron satisfactoriamente: 35 pruebas unitarias aprobadas, ESLint sin errores, formato correcto y compilación completada.

Se ejecutaron además 26 escenarios automatizados de navegador con Chrome 156.0.8078.48 y Vite 8.3.5 en desarrollo, con `StrictMode`. El registro de esa ejecución se conserva en `evidencia/semana-2/etapa-1-navegador.json`; no se instaló una suite de navegador en el proyecto. Los procedimientos siguientes permiten reproducir funcionalmente los escenarios.

## Procedimiento de reproducción

| N.º | Procedimiento                                                                                                        | Resultado esperado y observado en la ejecución                                                                                                                                              |
| --- | -------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Abrir Inicio. Buscar `JABON`, limpiar, seleccionar Lácteos y limpiar otra vez.                                       | Doce tarjetas iniciales; una coincidencia para jabón; tres productos lácteos; recuperación de los doce.                                                                                     |
| 2   | Revisar ambos menús y abrir Ver inventario.                                                                          | Tres enlaces inferiores originales, dos secundarios; solo Inventario activo en el menú secundario.                                                                                          |
| 3   | Revisar la tabla inicial.                                                                                            | Doce filas, siete columnas, nombres como encabezados de fila, marcas «Sin información» y tipos correspondientes a las categorías.                                                           |
| 4   | Abrir Ingresar artículos mediante el menú y revisar la red.                                                          | Navegación SPA sin nuevo documento ni otra carga de productos al cambiar de ruta. En el montaje inicial puede existir una solicitud cancelada por `StrictMode`.                             |
| 5   | Enviar el formulario vacío.                                                                                          | Cinco errores asociados a campos y foco en Nombre.                                                                                                                                          |
| 6   | Completar los campos con Nombre compuesto solo por espacios, precio `1.5` y cantidad `-1`. Enviar.                   | Rechazo de los tres campos; no se incorpora ningún producto.                                                                                                                                |
| 7   | Completar `Avena de prueba`, `Marca ficticia`, `Cereales de prueba`, precio `1290` y cantidad `6`. Enviar.           | Confirmación y campos vacíos; ninguna solicitud de escritura al servidor.                                                                                                                   |
| 8   | Abrir Inventario sin recargar.                                                                                       | Trece filas; artículo nuevo con marca, tipo, precio $1.290, stock 6 y disponibilidad positiva.                                                                                              |
| 9   | Abrir Inicio, buscar `AVENA DE PRUEBA`, limpiar y seleccionar Cereales de prueba.                                    | Trece tarjetas sin filtros y una coincidencia al buscar o seleccionar la nueva categoría.                                                                                                   |
| 10  | Agregar `Artículo sin existencias`, con marca y tipo informados, precio `1290` y cantidad `0`. Revisar ambas vistas. | Catorce artículos con identificadores únicos; el segundo nuevo indica «Sin stock» en tabla y catálogo.                                                                                      |
| 11  | Usar Atrás y Adelante entre Inventario e Inicio.                                                                     | Se conservan las rutas y los catorce registros.                                                                                                                                             |
| 12  | Abrir Nuestras tiendas.                                                                                              | Tres sucursales activas.                                                                                                                                                                    |
| 13  | Validar Contacto vacío, completar datos ficticios válidos y validar. Salir a Inventario y volver.                    | Cuatro errores iniciales; confirmación sin envío; inventario conserva las altas; Contacto vuelve vacío.                                                                                     |
| 14  | Recargar Inventario e inspeccionar almacenamiento local y de sesión.                                                 | Regresan doce productos; no hay entradas de persistencia de la aplicación.                                                                                                                  |
| 15  | Abrir directamente `/ingreso-articulos` y `/inventario`; recargar cada una.                                          | Ambas rutas muestran su contenido y completan la carga.                                                                                                                                     |
| 16  | Abrir `/inventario/no-existe`.                                                                                       | Página 404; ningún enlace de los menús queda seleccionado.                                                                                                                                  |
| 17  | Revisar las cinco páginas a 375 px. Activar Saltar al contenido con teclado. En Ingreso, desplazarse hasta el final. | Sin desbordamiento horizontal del documento; salto al contenido operativo y botón de incorporación alcanzable sobre el menú inferior. La tabla dispone de desplazamiento horizontal propio. |
| 18  | Repetir la revisión a 768 px.                                                                                        | Mismos resultados de adaptación y acceso al contenido.                                                                                                                                      |
| 19  | Repetir la revisión a 1366 px.                                                                                       | Mismos resultados de adaptación y acceso al contenido.                                                                                                                                      |
| 20  | Sustituir la respuesta de productos por `[]`. Abrir Inventario, Ingreso e Inicio.                                    | Inventario y catálogo vacíos; ingreso habilitado.                                                                                                                                           |
| 21  | Simular respuesta HTTP 404 de productos. Recorrer las tres vistas de productos.                                      | Aviso compartido de carga fallida, navegación utilizable y formulario de alta ausente.                                                                                                      |
| 22  | Bloquear la solicitud de productos y repetir la navegación.                                                          | Mismo control de error; no se permiten incorporaciones.                                                                                                                                     |
| 23  | Sustituir la respuesta por `{json invalido`.                                                                         | Error compartido sin renderizado parcial.                                                                                                                                                   |
| 24  | Sustituir la respuesta por `[{"id":"invalido"}]`.                                                                    | Rechazo de toda la lista y error compartido.                                                                                                                                                |
| 25  | Retener la respuesta de productos al abrir Ingreso y liberarla posteriormente con el JSON original.                  | Primero aparece «Cargando productos…», sin formulario; después aparece el formulario y la tabla contiene doce filas.                                                                        |
| 26  | Revisar las excepciones de ejecución durante los escenarios.                                                         | No se registraron excepciones de JavaScript. Los fallos de red provocados en los escenarios de error son intencionales.                                                                     |

Los escenarios 20 a 25 se ejecutaron interceptando exclusivamente la respuesta en el contexto del navegador, sin modificar los JSON del repositorio. Para reproducirlos manualmente, pueden utilizarse sustituciones de respuesta y bloqueo de solicitudes en las herramientas de desarrollo. Al finalizar, se deben retirar las sustituciones y bloqueos y recargar para recuperar la semilla original.

## Alcance y comprobaciones pendientes

La suite de Node.js verifica 35 casos y puede repetirse con `npm test`. Los 26 escenarios de navegador se registran por separado y no deben confundirse con las pruebas unitarias ni con una nueva ejecución manual.

Las capturas de ingreso e inventario a 375 y 1366 px se revisaron visualmente. Las comprobaciones de accesibilidad realizadas son parciales: etiquetas, errores asociados, foco ante validación y salto al contenido. Quedan fuera una auditoría completa con lector de pantalla y la certificación de accesibilidad.

La compilación de producción se completó. Quedan pendientes la verificación funcional en un alojamiento de producción y la regresión posterior a la integración de Tailwind CSS. No se atribuyen resultados ejecutados a esas comprobaciones pendientes.
