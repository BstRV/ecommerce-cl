# 📦🚀 Master Build Plan: Professional E-commerce Preset (GCP + MedusaJS + Next.js - Mercado Chileno)

## System Design & Implementation Blueprint (Spec-Driven Development)

Este documento es la **Fuente de Verdad** y detalla la hoja de ruta técnica para la construcción de un preset de e-commerce modular, escalable y preparado para el mercado chileno. Está diseñado para ser procesado por herramientas de IA como Antigravity, garantizando que el diseño visual esté completamente desacoplado de la lógica de negocio y que las integraciones fluyan de manera óptima.

---

## 🏗️ Mapa de Directorios (NPM Workspaces)

Utilizaremos una estructura de **Monorepo** para mantener la consistencia de tipos y facilitar el despliegue de los servicios. El backend se mantiene aislado de los workspaces para prevenir conflictos de versiones y problemas de hoisting de dependencias.

```text
/ecommerce-preset-root
├── package.json                 # Definición de workspaces (apps/storefront, packages/*)
├── turbo.json                   # Configuración de Pipeline (dev, build, lint, typecheck)
├── .env.example                 # Template global de variables de entorno
├── docker-compose.yml           # Entorno de desarrollo local (Postgres 15, Redis, Meilisearch)
├── /apps
│   ├── storefront/              # Next.js 16+ App Router (Frontend)
│   │   ├── src/theme/           # Capa de abstracción visual (Design System - B&W)
│   │   ├── src/components/      # Componentes de UI que heredan el theme
│   │   └── src/lib/             # Cliente Medusa, stores, cookies y utilidades
│   └── backend/                 # MedusaJS v2 (Core Engine - Standalone)
│       ├── src/api/             # Endpoints custom (SimpleAPI, Analytics, Auth)
│       ├── src/modules/         # Módulos custom (Analytics)
│       ├── src/workflows/       # Workflows custom (add-to-cart-with-analytics)
│       └── src/subscribers/     # Event handlers (SimpleAPI DTE, Stock, ERP)
├── /packages
│   ├── ui/                      # Librería de componentes base (Shadcn/UI/Tailwind neutro)
│   ├── types/                   # Interfaces TypeScript compartidas (DTE, Products, Brand)
│   ├── config/                  # ESLint, Tailwind, TSConfigs compartidos
│   └── assets/                  # brand.config.ts (Logos, fuentes, animaciones abstractos)
└── /docs
    ├── local-dev.md             # Guía detallada de levantamiento local y Runbook de IA
    └── setup-infra.md           # Manual técnico de despliegue y arquitectura visual
```

---

## 📐 Arquitectura y Funcionamiento de la Aplicación

Para cumplir con los estándares de robustez solicitados, la aplicación se rige por los siguientes pilares de arquitectura:

### 1. Ciclo de Vida del Carrito y Sesión (Usuarios Anónimos)
* **Persistencia en Cookies/Sesión:** Los usuarios anónimos tienen su carrito de compras asociado a un identificador único (`cart_id`) almacenado **únicamente en cookies del navegador** (`HTTP-Only` en producción para mayor seguridad). No se utiliza persistencia local volátil de React.
* **Sincronización y Fusión al Iniciar Sesión (Cart Merge):** 
  * Cuando un usuario inicia sesión, el backend de MedusaJS asocia automáticamente el carrito anónimo existente al perfil del cliente recién autenticado (`customer_id`).
  * Si el cliente ya tenía un carrito activo previo guardado en su cuenta, el storefront gestionará la fusión de ambos carritos enviando las líneas de ítems pendientes al carrito de la cuenta activa.

### 2. Autenticación y Cuentas de Cliente (Accounts & Auth)
* **Estrategia Híbrida de Auth:** El sistema soporta tres flujos de acceso mediante MedusaJS Auth:
  1. **Registro e Inicio de Sesión Tradicional:** Cuenta creada con Email y Contraseña. Validación estricta con Zod en Next.js.
  2. **Acceso con Google (OAuth 2.0):** Integración mediante el plugin de autenticación de MedusaJS para permitir "Iniciar sesión con Google".
  3. **Historial de Compras y Perfil:** Espacio privado para el cliente donde puede consultar su información de envío guardada y revisar su historial completo de compras (Órdenes, Boletas DTE adjuntas, y Estados de Envío).

### 3. Arquitectura de Búsqueda Dual (Búsqueda Nativa vs. Meilisearch Premium)
* **Búsqueda Core (MedusaJS API):** Por defecto, la búsqueda interna de productos opera llamando directamente a la API de productos de MedusaJS (`/store/products` con query param `q`). Esta lógica básica está integrada de forma nativa en el storefront y no requiere servicios adicionales externos.
* **Búsqueda Premium (Meilisearch Add-on):**
  * Meilisearch se concibe como un complemento (*plugin*) premium opcional para clientes que paguen un extra.
  * El storefront implementa una **estrategia de abstracción de búsqueda** (mediante un feature flag o variable de entorno `NEXT_PUBLIC_SEARCH_PROVIDER`).
  * Si el proveedor está en `medusa`, la búsqueda consulta la base de datos PostgreSQL mediante el backend.
  * Si está en `meilisearch`, el storefront se conecta directamente a Meilisearch usando `instantsearch.js` para búsquedas facetadas ultrarrápidas de baja latencia con filtros interactivos.

---

## 🚀 Fase 1: Desarrollo Local (Core, Abstracción Visual e Integración Real)
**Objetivo:** Construir el motor funcional, una interfaz neutra (B&W) totalmente parametrizada y la conexión e integración real (sin mock data) del storefront con el backend para productos, carrito, analíticas y cuentas.

### 1.1 Configuración del Workspace e Infraestructura Local
* **Workspace:** Estructura monorepo con npm workspaces. Dependencias comunes administradas en la raíz.
* **Infraestructura Docker:** Inicializar PostgreSQL 15, Redis y Meilisearch (como servicio opcional de pruebas).
* **Variables de Entorno:** Configuración de `.env` estructurado en storefront y backend.

### 1.2 Abstracción Visual y Tematizado (White-Label Strategy)
* **Neutral Design:** Implementar el sistema basado en **CSS Variables** (Tailwind v4) usando una escala de grises estricta en `tokens.css`.
* **Brand Config:** `brand.config.ts` como punto único de control de fuentes, logos y colores.
* **UI Library:** Componentes neutros reutilizables en `packages/ui`.

### 1.3 Desarrollo del Backend (MedusaJS Core)
* **Modelos de Datos y Catálogo:** Cargar el seed de datos iniciales en la base de datos local con categorías, productos y variantes (Marca, Talla, Color).
* **Módulo de Analíticas:** Módulo custom `ecommerce-analytics` en Postgres para registrar eventos de usuario (`view_item`, `add_to_cart`).
* **Autenticación:** Configuración del módulo de autenticación nativo de MedusaJS, incluyendo soporte para contraseñas tradicionales y proveedor de Google OAuth.

### 1.4 Integración Real en el Storefront (Next.js)
* **Conexión Directa a la API de Medusa:** Eliminar por completo el uso de `MOCK_PRODUCTS`. Consumir productos y categorías directamente del backend (`NEXT_PUBLIC_MEDUSA_URL`).
* **Búsqueda Core:** Implementar la barra de búsqueda que consulta directamente a la API de Medusa (`q=...`), con soporte modular para activar Meilisearch.
* **Carrito Persistente (Cookies):** Sincronizar el flujo del carrito con la base de datos a través de cookies de sesión para mantener el carrito activo entre recargas.
* **Flujo de Checkout Real:** Validación de datos de envío chilenos con Zod, cálculo de envíos reales y pre-orden creada en Medusa.
* **Cuentas de Cliente y Registro:**
  * Páginas de Login, Registro y Mi Cuenta en Next.js.
  * Autenticación tradicional y botón de Google OAuth.
  * Vista de historial de órdenes de compra recuperada dinámicamente desde el backend.
* **Tracking de Analíticas:** Conectar el frontend para invocar el endpoint `/store/analytics/track` en vistas de productos (`view_item`) e interacciones con el carrito (`add_to_cart`).

---

## 🧪 Fase 2: Integración de Módulos Premium (Ecosistema Chile & Add-ons)
**Objetivo:** Conectar servicios externos para producción y habilitar complementos premium opcionales.

### 2.1 Módulo de Pagos (Mercado Pago)
* **Checkout API:** Integración de "Checkout Transparente" (SDK) en pesos chilenos (CLP).
* **Webhooks:** Endpoint IPN (`payment.authorized`) con verificación de firma para actualizar pedidos a `captured` de forma automática y resiliente.

### 2.2 Módulo Tributario (SimpleAPI / SimpleBoleta)
* **Subscriber de Facturación:** Escuchar el evento `order.placed` tras confirmación de pago.
* **Emisión de DTE:** Envío asíncrono a SimpleAPI, generación de Boleta Electrónica e inyección de la URL del PDF del SII en la metadata de la orden para que el cliente pueda descargarla en su historial de compras.
* **Cola de Reintentos:** Encolar en Redis mediante BullMQ en caso de caídas de los servidores del SII.

### 2.3 Activación de Meilisearch (Premium Search Add-on)
* **Sincronización:** Indexación automática de productos al ser editados en el Admin panel de MedusaJS.
* **Búsqueda Facetada:** Activar el feature flag en el frontend para cambiar a Meilisearch. Mostrar sidebar interactiva con filtros dinámicos avanzados (Marca, Rango de Precios, Popularidad) usando `instantsearch.js`.

### 2.4 Notificaciones y Storage
* **Resend:** Templates de confirmación de órdenes con link de la boleta electrónica.
* **GCP Storage:** Plugin de almacenamiento de archivos multimedia para fotos de productos en producción.

---

## 🚢 Fase 3: Despliegue a Producción (GCP + Vercel)
**Objetivo:** Trasladar el entorno a la nube con alta disponibilidad, seguridad y optimización de costos.

### 3.1 Setup de Google Cloud Platform (Backend)
* **Cloud SQL:** Instancia PostgreSQL (db-f1-micro) con backups automáticos habilitados.
* **Cloud Run:** Servicios `backend-api` y `meilisearch-instance` vía Docker. Habilitar **Startup CPU Boost** y mínimo de instancias.
* **Secret Manager & IAM:** Cuentas de servicio con permisos mínimos para SimpleAPI, Mercado Pago y almacenamiento.

### 3.2 Despliegue Frontend (Vercel)
* **Next.js SSR/ISR:** Optimización de carga y revalidación (revalidate: 60s) en páginas de productos y colecciones.

### 3.3 Red y CDN (Cloudflare)
* Proxy activo contra DDoS y Edge caching de estáticos.

---

## 🛠️ Fase 4: Mantenimiento y Documentación

### 4.1 Documentación y Guías
* `README.md` and `setup-infra.md` con las instrucciones de la búsqueda dual y autenticación.
* Manual de usuario para administración de catálogo e historial de compras.

### 4.2 Monitoreo y Analíticas
* Visualización en el panel de administración de eventos de analíticas internas guardados en Postgres durante la Fase 1.
* GCP Logs y alertas ante errores 5xx de pasarelas de pago o facturación.

---

## 📝 Convenciones de Código y Notas de Implementación (Para Antigravity)

1. **Estrategia Dual de Búsqueda:** Utilizar un patrón de repositorio o servicio abstracto en la UI para intercambiar el proveedor de búsqueda (`medusa` o `meilisearch`) sin duplicar componentes visuales.
2. **Fusión de Carrito:** Al autenticar un usuario, ejecutar el workflow de fusión de líneas de ítems para unificar el carrito anónimo en cookie con el carrito de la cuenta de cliente.
3. **Validación SII y Colas:** Asegurar que el fallo al emitir documentos tributarios no interrumpa la experiencia de compra del usuario final.
4. **Manejo Estricto de Tipos:** Prohibido el uso de `any`. Validaciones en fronteras con Zod.
