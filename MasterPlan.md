# 📦🚀 Master Build Plan: Professional E-commerce Preset (GCP + MedusaJS + Next.js - Mercado Chileno)

## System Design & Implementation Blueprint (Spec-Driven Development)

Este documento es la **Fuente de Verdad** y detalla la hoja de ruta técnica para la construcción de un preset de e-commerce modular, escalable y preparado para el mercado chileno. Está diseñado para ser procesado por herramientas de IA como Antigravity, garantizando que el diseño visual esté completamente desacoplado de la lógica de negocio.

---

## 🏗️ Mapa de Directorios (NPM Workspaces)
Utilizaremos una estructura de **Monorepo** para mantener la consistencia de tipos y facilitar el despliegue de los servicios.

```text
/ecommerce-preset-root
├── package.json                 # Definición de workspaces
├── turbo.json                   # Configuración de Pipeline (opcional para velocidad)
├── .env.example                 # Template global de variables de entorno
├── docker-compose.yml           # Entorno de desarrollo local (Postgres, Meilisearch, Redis)
├── /apps
│   ├── storefront/              # Next.js 15+ App Router (Frontend)
│   │   ├── src/theme/           # Capa de abstracción visual (Design System - B&W)
│   │   └── src/components/      # Componentes de UI que heredan el theme
│   └── backend/                 # MedusaJS v2 (Core Engine)
│       ├── src/api/             # Endpoints custom (SimpleAPI, Analytics)
│       ├── src/plugins/         # Lógica modular (Mercado Pago, Starken)
│       └── src/subscribers/     # Event handlers (Stock, Correos, ERP sync)
├── /packages
│   ├── ui/                      # Librería de componentes base (Shadcn/UI/Tailwind neutro)
│   ├── types/                   # Interfaces TypeScript compartidas (DTE, Products)
│   ├── config/                  # ESLint, Tailwind, TSConfigs compartidos
│   └── assets/                  # brand.config.ts (Logos, fuentes, animaciones abstractos)
└── /docs
    ├── setup-infra.md           # Manual técnico de despliegue (GCP)
    └── manual-usuario.md        # Manual de uso para el cliente final
```

---

## 🚀 Fase 1: Desarrollo Local (Core & Abstracción Visual)
**Objetivo:** Construir el motor funcional y una interfaz neutra (B&W) totalmente parametrizada.

### 1.1 Configuración del Workspace e Infraestructura Local
* **Workspace:** Inicializar `npm init` con workspaces. Todas las dependencias comunes se gestionan en la raíz.
* **Contenedores Locales:** Levantar `docker-compose` con:
  * PostgreSQL (Cloud SQL local mirror - Puerto 5432).
  * Redis (Para tareas en segundo plano de Medusa).
  * Meilisearch (Motor de búsqueda - Puerto 7700).
* **Estándares:** Configuración estricta de TypeScript (sin `any`) y ESLint para evitar deuda técnica. Uso obligatorio de archivos `.env`.

### 1.2 Abstracción Visual y Tematizado (White-Label Strategy)
* **Neutral Design:** El diseño debe estar desacoplado. Implementar un sistema basado en **CSS Variables** (Tailwind) usando una escala de grises estricta (`#000000` a `#FFFFFF`). No usar estilos en línea.
* **Brand Config:** Crear `packages/assets/brand.config.ts` para centralizar rutas de logos, tipografías y animaciones.
  ```typescript
  export const brandConfig = {
    logo: '/assets/logo.svg',
    primaryColor: 'var(--color-black)',
    fontFamily: 'Geist Sans, sans-serif',
    animations: true,
    darkMode: false
  }
  ```
* **UI Library:** Desarrollar componentes en `packages/ui` (Botones, Inputs, Cards) que hereden el theme, permitiendo cambiar el "look & feel" desde las variables.

### 1.3 Desarrollo del Backend (MedusaJS Core)
* **Modelos de Datos:** Configuración de Data Models para productos con variantes (Marca, Talla, Color) y categorías.
* **Custom Workflows:** Implementar flujos para el carrito de compras.
* **Stock Management:** Lógica de stock interno editable desde el Admin.
* **Internal Analytics:** Middleware/plugin interno para capturar eventos `view_item` y `add_to_cart`. Almacenamiento en tabla analítica en Postgres.

### 1.4 Desarrollo del Storefront (Next.js)
* **Server Components:** Priorizar el renderizado en servidor para páginas de productos (SEO).
* **Filtros Dinámicos:** Sidebar interactiva con lógica de filtrado por URL (query params) para Marca, Precio y Popularidad.
* **Checkout Flow & Skeletons:** Construcción del checkout paso a paso. Implementar estados de carga (Skeleton Loading) para mitigar percepción de latencia.

---

## 🧪 Fase 2: Integración de Módulos (Ecosistema Chile)
**Objetivo:** Conectar el ecosistema de servicios externos y asegurar el flujo de datos.

### 2.1 Módulo de Pagos (Mercado Pago)
* **Checkout API:** Integración de "Checkout Transparente" (SDK).
* **Webhooks:** Endpoint para recibir notificaciones IPN (`payment.authorized`, `payment.failed`) y actualizar estado a `captured` automáticamente.
* **Flujo Frontend:** Redirección dinámica tras pago exitoso/fallido.

### 2.2 Módulo Tributario (SimpleAPI / SimpleBoleta)
* **Trigger:** Crear un `subscriber` en el backend que escuche el evento `order.placed` tras confirmación de pago.
* **Flujo:** Mapeo de datos del pedido al esquema JSON de SimpleAPI -> Generar Boleta Electrónica -> Recibir PDF -> Adjuntar link en el correo al cliente.
* **Manejo de Errores:** Encolar reintento si la API falla y notificar al administrador.

### 2.3 Módulo de Búsqueda (Meilisearch)
* **Indexación:** Configuración de índices de productos con atributos buscables (Nombre, Descripción, Marca). Sincronización automática al editar en el Admin.
* **Filtros Frontend:** Habilitar "Filterable Attributes" e implementar barra de búsqueda/filtros facetados con `instantsearch.js`.

### 2.4 Módulo de Notificaciones y Storage
* **Resend:** Configuración de templates HTML/React para correos de confirmación y recuperación de carrito.
* **GCP Storage:** Plugin de archivos en Medusa para guardar imágenes subidas al Admin directo en Google Cloud Storage.

---

## 🚢 Fase 3: Despliegue a Producción (GCP + Vercel)
**Objetivo:** Trasladar el entorno a la nube con alta disponibilidad, seguridad y optimización de costos.

### 3.1 Setup de Google Cloud Platform (Backend)
* **Cloud SQL:** Instancia PostgreSQL (db-f1-micro). Habilitar backups automáticos, usuarios y redes autorizadas.
* **Cloud Run:**
  * Servicios: `backend-api` y `meilisearch-instance` desplegados vía Docker.
  * Configurar `min-instances: 1` para evitar Cold Starts y habilitar **Startup CPU Boost**.
* **Secret Manager & IAM:** Variables críticas (SimpleAPI, MP) administradas con Secret Manager. Cuentas de servicio con permisos mínimos.

### 3.2 Despliegue Frontend (Vercel)
* **Conexión Git:** Despliegue automático con variables de entorno (`MEDUSA_BACKEND_URL`).
* **Optimización ISR:** Configurar Incremental Static Regeneration (revalidate: 60s) para que páginas de productos se actualicen sin redeploy.

### 3.3 Configuración de Red y DNS (Cloudflare)
* **DNS & Seguridad:** Delegación desde NIC Chile. Proxy activo para protección DDoS.
* **Rendimiento:** Activación de Argo Smart Routing (si aplica) y Edge Cache para assets de GCS y estáticos de `packages/assets`.

---

## 🛠️ Fase 4: Mantenimiento y Documentación
**Objetivo:** Garantizar continuidad operativa, estandarización y entregables para terceros.

### 4.1 Documentación y Guías
* **Documentación Técnica:** `README.md` exhaustivo detallando cómo clonar el preset, proceso de "White-labeling" y listado de variables `.env` por módulo.
* **Manual de Usuario:** Documento para el cliente final explicando cómo subir productos, gestionar cupones y entender analíticas del Admin.
* **Troubleshooting:** Solución de problemas comunes (Logs Cloud Run, fallos SimpleAPI).

### 4.2 Monitoreo y Analíticas
* **Panel Admin:** Visualización de los datos de tráfico recolectados en la Fase 1.
* **GCP Logging & Alertas:** Notificaciones de correo ante errores 5xx del backend.
* **SEO:** Configuración de Google Search Console y sitemaps automáticos.

### 4.3 Plan de Actualización
* **Seguridad:** Estrategia regular de `npm update` para dependencias.
* **Backups:** Controlados y automáticos por GCP (Cloud SQL).

---

## 📝 Convenciones de Código y Notas de Implementación (Para Antigravity)

### Variables de Entorno Globales Obligatorias
Se debe generar un `.env` estandarizado:
* `DATABASE_URL`: Conexión Cloud SQL.
* `MEDUSA_ADMIN_TOKEN`: Seguridad del panel.
* `MP_ACCESS_TOKEN` / `MP_PUBLIC_KEY`: Mercado Pago.
* `SIMPLE_API_KEY`: Facturación electrónica.
* `GCP_BUCKET_NAME`: Almacenamiento.
* `MEILISEARCH_HOST` / `MEILISEARCH_API_KEY`: Búsqueda.

### Reglas de Ejecución Asistida (Antigravity):
1. **Spec-Driven:** Antes de cada tarea, la IA debe validar que la acción cumple con los puntos de este `MasterPlan.md`.
2. **Priorización (Fase 1.1 y 1.2):** Asegúrate de que el sistema de temas (variables CSS) esté funcionando antes de crear las páginas.
3. **Uso de `brand.config.ts`:** Cada vez que se cree un componente visual, consultar este archivo para mantener la neutralidad y modularidad B&W.
4. **Strict Typing & Zod:** No usar `any`. Interfaces en `packages/types`. Validar todos los inputs de usuario con Zod antes de procesar en backend.
5. **Estilos Modulares:** Usar clases Tailwind o variables CSS del tema. No usar estilos inline.
6. **Documentación Progresiva:** Al terminar una función compleja, pedir a la IA que actualice el archivo `setup-infra.md`.
