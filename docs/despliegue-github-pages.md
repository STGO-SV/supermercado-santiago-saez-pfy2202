# Despliegue de Despensa Verde en GitHub Pages

**Repositorio:** `STGO-SV/supermercado-santiago-saez-pfy2202`
**Rama de publicación:** `main`

## 1. Objetivo

Configurar el despliegue automatizado de Despensa Verde en GitHub Pages, conservando su funcionamiento como aplicación de página única (SPA) desarrollada con React y Vite.

La publicación utiliza `main` como única fuente de código. Antes de cada despliegue se ejecutan las validaciones automatizadas y la compilación de producción.

**URL prevista:** https://stgo-sv.github.io/supermercado-santiago-saez-pfy2202/

La configuración ha sido validada localmente. La activación y comprobación del sitio remoto permanecen pendientes.

## 2. Configuración de Vite

La compilación de producción utiliza la ruta base:

`/supermercado-santiago-saez-pfy2202/`

El servidor de desarrollo conserva `/` como base.

Esta configuración permite servir los recursos generados bajo la subruta del repositorio, sin depender de rutas absolutas del dominio.

Los archivos `productos.json` y `sucursales.json` se solicitan mediante `import.meta.env.BASE_URL`, manteniendo su acceso tanto en desarrollo como en producción.

El archivo `vite.config.js` centraliza la configuración correspondiente.

## 3. Enrutamiento

La aplicación utiliza React Router con dos configuraciones según el entorno:

| Entorno    | Router          | Comportamiento                                                      |
| ---------- | --------------- | ------------------------------------------------------------------- |
| Desarrollo | `BrowserRouter` | Rutas convencionales gestionadas por el servidor de desarrollo      |
| Producción | `HashRouter`    | Rutas internas mediante fragmentos `#` compatibles con GitHub Pages |

Ambos entornos comparten un único árbol de rutas.

Ejemplos de rutas públicas:

- Catálogo: `#/`
- Inventario: `#/inventario`
- Ingreso de artículos: `#/ingreso-articulos`
- Detalle: `#/articulos/p01`
- Carrito: `#/carrito`

El fragmento de la URL no se envía al servidor, lo que permite recargar las rutas internas sin requerir reglas adicionales de reescritura.

La página 404 de la aplicación gestiona rutas desconocidas dentro de `HashRouter`. Las direcciones físicas inexistentes fuera del fragmento continúan sujetas al comportamiento de GitHub Pages.

El enlace accesible «Saltar al contenido» utiliza gestión directa del foco, evitando interferencias con el fragmento empleado por el router.

## 4. Automatización con GitHub Actions

El workflow se define en:

`.github/workflows/deploy.yml`

Se ejecuta automáticamente ante cada push a `main` y admite ejecución manual mediante `workflow_dispatch`.

El proceso se divide en dos trabajos.

### Compilación y validación

1. Obtener el código del commit correspondiente.
2. Configurar Node.js 24.11.0.
3. Instalar dependencias mediante `npm ci`.
4. Ejecutar `npm test`.
5. Ejecutar `npm run lint`.
6. Ejecutar `npm run format:check`.
7. Ejecutar `npm run build`.
8. Comprobar `git diff --check`.
9. Preparar `dist/` como artefacto de GitHub Pages.

Un fallo en las validaciones impide ejecutar el trabajo de publicación.

### Publicación

El segundo trabajo depende de la finalización satisfactoria del primero y publica el artefacto validado en el entorno `github-pages`.

Los permisos de escritura de Pages y generación del token de identidad están limitados al trabajo de despliegue.

Las acciones oficiales se referencian mediante hashes SHA. La configuración de concurrencia evita despliegues simultáneos.

No se requiere una rama adicional `gh-pages` ni un token personal de acceso.

## 5. Validación local

La preparación del despliegue fue sometida a las siguientes comprobaciones:

| Comprobación                  | Resultado                        |
| ----------------------------- | -------------------------------- |
| Pruebas automatizadas         | 108 aprobadas                    |
| ESLint                        | Satisfactorio                    |
| Prettier                      | Satisfactorio                    |
| Build de producción           | Satisfactorio                    |
| `git diff --check`            | Satisfactorio                    |
| Navegador en producción local | 29 comprobaciones satisfactorias |
| Navegador en desarrollo       | 6 comprobaciones satisfactorias  |
| Recursos HTTP                 | 5 respuestas 200                 |

Las comprobaciones abarcan navegación, títulos, filtros, inventario, detalle de artículos, carrito, reservas, devolución de existencias, formularios, rutas desconocidas y recargas internas.

Se verificó la carga de HTML, JavaScript, CSS y los archivos JSON de productos y sucursales desde la subruta de producción.

Las evidencias locales se conservan en:

`docs/evidencia/github-pages-local/`

Los resultados anteriores no constituyen una verificación de la publicación remota.

## 6. Activación de GitHub Pages

Para activar el despliegue:

1. Abrir **Settings → Pages** en el repositorio.
2. Seleccionar **Build and deployment → Source: GitHub Actions**.
3. Comprobar que las políticas de Actions permitan ejecutar las acciones oficiales referenciadas.
4. Configurar, cuando corresponda, el entorno `github-pages` para admitir despliegues exclusivamente desde `main`.
5. Registrar y publicar la configuración aprobada en `main`.

El push correspondiente deberá iniciar la ejecución del workflow.

La opción de ejecución manual también estará disponible desde GitHub Actions, seleccionando la rama `main`.

## 7. Verificación de la publicación

Una vez completada la primera ejecución, se deberá comprobar en la URL pública:

- Carga correcta de la página principal y los recursos estáticos.
- Acceso a los doce productos originales.
- Visualización de las tres sucursales activas.
- Funcionamiento de los filtros y formularios.
- Navegación entre catálogo, inventario, detalle y carrito.
- Incorporación y devolución de unidades.
- Cálculo de subtotales y total.
- Funcionamiento de «Seguir comprando».
- Recarga de rutas internas con fragmentos.
- Presentación de la página 404.
- Ausencia de errores inesperados en consola y Network.
- Adaptación a resoluciones de 375, 768 y 1366 píxeles.

La publicación se considerará verificada únicamente después de completar estas comprobaciones sobre el sitio remoto.

## 8. Limitaciones

La aplicación utiliza estado temporal en memoria.

Al recargar, el inventario recupera los datos originales, el carrito se vacía y desaparecen los artículos incorporados durante la sesión.

No existe sincronización de inventario entre dispositivos o sesiones, almacenamiento persistente, backend ni procesamiento de compras.

La publicación mediante GitHub Pages no modifica estas limitaciones funcionales.

## 9. Referencias técnicas

- [Vite — Despliegue de sitios estáticos](https://vite.dev/guide/static-deploy#github-pages)
- [GitHub — Workflows personalizados para Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
- [React Router — HashRouter](https://reactrouter.com/api/declarative-routers/HashRouter)
