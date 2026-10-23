# Aula Verde — Supermercado

Proyecto académico de **Desarrollo Frontend II (PFY2202), Experiencia 1, Semana 1, Forma B**.

SPA para consultar un catálogo de inventario de un supermercado ficticio, conocer sus sucursales activas y practicar la validación de una consulta.

## Tecnologías y requisitos

React 19, React Router 8, Vite 8, JavaScript y CSS propio. ESLint revisa el código y Prettier mantiene su formato. Sin bibliotecas visuales adicionales.

Requiere Node.js **22.22 o superior** (validado con Node.js 24.11) y npm. Las versiones instaladas se fijan mediante `package-lock.json`.

## Instalación y ejecución

Desde la carpeta del proyecto:

```powershell
npm ci
npm run dev -- --host 127.0.0.1 --port 5173 --strictPort
```

La aplicación se consulta en <http://127.0.0.1:5173/>. Si el servidor no está activo, se ejecuta nuevamente el segundo comando.

## Comandos

| Comando                | Propósito                                                     |
| ---------------------- | ------------------------------------------------------------- |
| `npm run dev`          | Servidor de desarrollo                                        |
| `npm run lint`         | Revisión ESLint                                               |
| `npm run format`       | Aplicar formato                                               |
| `npm run format:check` | Comprobar formato                                             |
| `npm test`             | 14 pruebas automáticas con el ejecutor incorporado de Node.js |
| `npm run build`        | Generar producción en `dist/`                                 |
| `npm run preview`      | Revisar localmente la compilación                             |

## Estructura

```text
public/data/       productos.json y sucursales.json
src/components/   Catálogo, tarjetas y formulario
src/hooks/        Cargas independientes de productos y sucursales
src/layouts/      Encabezado, contenido y navegación inferior
src/pages/        Inicio, tiendas, contacto y página 404
src/utils/        Validación, búsqueda y formato CLP
src/index.css     Estilos responsivos
tests/            Pruebas de datos y validaciones
docs/             Informe, protocolo manual y evidencias
```

## Páginas

| Ruta                | Contenido                                       |
| ------------------- | ----------------------------------------------- |
| `/`                 | Catálogo de 12 productos, búsqueda y categorías |
| `/nuestras-tiendas` | Sucursales activas                              |
| `/contactanos`      | Formulario demostrativo                         |
| Cualquier otra ruta | Página 404 con regreso al inicio                |

La navegación inferior permanece disponible y señala la página activa. React Router gestiona los cambios sin recargar el documento.

## Datos demostrativos

Los productos, precios CLP enteros, existencias, sucursales y direcciones son ficticios. Se cargan mediante `fetch()` desde dos JSON públicos independientes y se validan antes de mostrarse.

La disponibilidad coincide con el stock: una cantidad cero se muestra como «Sin stock». El archivo de sucursales conserva cuatro registros; la interfaz solo muestra los tres activos. Los estados de carga, error y listas vacías tienen mensajes propios.

## Límites de esta entrega

El catálogo es de consulta: no modifica existencias. El formulario solo valida nombre, correo, asunto y mensaje; **no envía mensajes ni guarda los datos ingresados**. Los campos se mantienen únicamente en memoria mientras la página está montada. No hay servicios externos ni recepción de consultas.

El repositorio es local. La publicación pública permanece pendiente de autorización. El nombre previsto en GitHub es `supermercado-santiago-saez-pfy2202`; todavía no se ha creado el remoto ni se ha ejecutado `git push`.

Para un alojamiento futuro con `BrowserRouter`, se debe configurar la resolución de rutas SPA hacia `index.html` y revisar `base` si se publica bajo una subcarpeta. No hay despliegue configurado.

## Revisión

- [Protocolo de 18 pruebas manuales](docs/pruebas-manuales-semana-1.md).
- [Informe de implementación y comprobaciones](docs/informe-implementacion-semana-1.md).

El 22 de octubre de 2026 se completó la validación manual: **18/18 pruebas aprobadas, sin fallos detectados**. Se conservan por separado las **55 comprobaciones técnicas satisfactorias** registradas el 21 de octubre: 14 pruebas unitarias, 38 escenarios de navegador y tres controles de calidad de código. La auditoría técnica de cierre y sus limitaciones se detallan en el informe.
