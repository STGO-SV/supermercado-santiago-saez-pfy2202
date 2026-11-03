# Protocolo de pruebas del carrito y navegación

PFY2202 · Experiencia 1 · Semana 3 · Forma B · Etapa 2

Ejecución registrada el 3 de noviembre de 2026. Los quince recorridos se completaron satisfactoriamente y se desglosan en 42 escenarios de navegador. Los resultados detallados están en `evidencia/semana-3/etapa-2/navegador.json`; se mantienen separados de las 84 pruebas automáticas.

## Preparación

Con las dependencias existentes instaladas, ejecutar desde la raíz del repositorio:

```powershell
npm run dev -- --host 127.0.0.1 --port 5173 --strictPort
```

Abrir `http://127.0.0.1:5173/inventario`. Comenzar con una recarga, sin bloqueos ni sustituciones de respuesta. Las incorporaciones son temporales y se pierden al recargar. El recorrido completo requiere conservar el documento entre pasos salvo donde se indique recarga.

## Casos ejecutados y reproducción

| N.º | Recorrido                      | Procedimiento y resultado esperado                                                                                                                                                                               | Resultado registrado                                                                         |
| --- | ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| 1   | Inventario → detalle → carrito | Activar con Enter el enlace de arroz, agregar una unidad y abrir Carrito desde el menú. Deben verse nombre, enlace, precio $1.490, cantidad uno, stock 41 y total $1.490.                                        | Aprobado; se continuó con una segunda incorporación.                                         |
| 2   | Dos artículos diferentes       | Incorporar también una unidad de fideos desde su detalle. Con dos arroces y un fideo deben existir dos líneas y total $3.970.                                                                                    | Aprobado.                                                                                    |
| 3   | Repetición del mismo artículo  | Incorporar arroz dos veces. Debe permanecer una sola línea con cantidad dos, subtotal $2.980 y stock 40.                                                                                                         | Aprobado.                                                                                    |
| 4   | Incremento                     | Aumentar arroz desde el carrito. Deben resultar tres unidades, stock 39, subtotal $4.470 y total $5.460 con el fideo.                                                                                            | Aprobado.                                                                                    |
| 5   | Disminución y devolución       | Disminuir arroz. Deben regresar dos reservas, stock 40 y total $3.970; Inventario e Inicio deben reflejar el mismo stock.                                                                                        | Aprobado.                                                                                    |
| 6   | Agotamiento                    | Crear Avena con precio 1290 y stock dos; reservar una desde el detalle y aumentar desde el carrito. Deben quedar dos reservas, stock cero e incremento deshabilitado. El foco debe pasar al decremento.          | Aprobado; total $6.550 junto con arroz y fideos.                                             |
| 7   | Eliminación de línea           | Disminuir Avena dos veces; después eliminar arroz y fideos mediante decrementos. Cada línea desaparece al llegar a cero, devuelve todas sus unidades y traslada el foco a otra línea o al encabezado vacío.      | Aprobado; total final $0 y stock restaurado.                                                 |
| 8   | Subtotales y total             | Contrastar precio por cantidad y suma de líneas antes y después de cada movimiento.                                                                                                                              | Aprobado: $3.970, $5.460, $5.260, $6.550 y retorno a $0 según el recorrido.                  |
| 9   | Alta durante la sesión         | Crear Avena etapa 2, marca de prueba, categoría Granel, precio 1290 y stock dos. Abrir el detalle desde Inventario e incorporarla.                                                                               | Aprobado; tercera línea y total $5.260 con una unidad nueva.                                 |
| 10  | Navegación e historial         | Recorrer Inventario, Detalle, Inicio y Carrito; abrir el nombre desde el carrito. Usar Atrás y Adelante. Deben conservarse reservas, título y selección activa correctos.                                        | Aprobado.                                                                                    |
| 11  | Recarga y ruta directa         | Con una reserva, recargar `/carrito`. Debe abrir directamente con total cero. Inventario debe recuperar doce registros y stock 42 para arroz; el alta temporal desaparece.                                       | Aprobado.                                                                                    |
| 12  | Carga, error y recuperación    | Bloquear temporalmente la solicitud de productos, abrir `/carrito`, repetir el intento aún bloqueado y después desbloquear y reintentar. Deben distinguirse carga, error y vacío, sin recargar para recuperarse. | Aprobado con dos HTTP 503 controlados y recuperación al tercer intento en compilación local. |
| 13  | Teclado y foco                 | Usar Tab, Enter y Espacio en enlaces y controles. Comprobar contorno visible, salto al contenido y foco tras agotamiento, eliminación de primera/última línea y vaciado completo.                                | Aprobado.                                                                                    |
| 14  | Adaptación                     | Revisar tres líneas del carrito y ambos menús en 375, 768 y 1366 px. Comprobar controles alcanzables y ausencia de desbordamiento horizontal del documento.                                                      | Aprobado en los tres anchos; medidas guardadas en JSON.                                      |
| 15  | Regresión                      | Comprobar filtro Lácteos con tres registros, búsqueda ARROZ con stock actualizado, tres sucursales activas, contacto vacío y válido sin envío, y `/carrito/no-existe` con 404 sin marcar Carrito activo.         | Aprobado.                                                                                    |

Para reproducir el fallo de red del caso 12 puede utilizarse el bloqueo temporal de `productos.json` en Network de DevTools. La ejecución registrada utilizó un servidor temporal de pruebas sobre la compilación local para responder HTTP 503 y demorar 1200 ms. Ambas técnicas deben aplicarse sin editar las semillas del repositorio; al finalizar deben desactivarse bloqueos y sustituciones. Un fallo de red reproducido mediante bloqueo no debe registrarse como si fuera la misma ejecución HTTP 503.

## Comprobaciones automáticas

```powershell
npm test
npm run lint
npm run format:check
npm run build
git diff --check
```

Resultado de esta etapa: 84 pruebas aprobadas —72 conservadas y 12 nuevas—, lint y formato conformes, compilación correcta con 130 módulos y diff sin errores de espacios. Los casos nuevos incluyen renderizado de componentes reales, estados de carga/error, alerta ante rechazo, enlace activo e importes exactos. La interacción por teclado y el foco corresponden a las comprobaciones de navegador.

## Alcance de los resultados

Los quince recorridos tienen ejecución registrada; no quedan pruebas funcionales de esta etapa pendientes. La comprobación de un sitio publicado en GitHub Pages pertenece a una fase posterior y no se ha ejecutado. Tampoco se realizó certificación integral de accesibilidad, pruebas en dispositivos físicos ni una matriz exhaustiva de navegadores.

Se conservan el reducer y las invariantes de Etapa 1. No se incorporan persistencia, compra, pagos, pedidos o servicios externos. Los resultados anteriores permanecen sin alteraciones.
