import { model } from "@medusajs/framework/utils"

/**
 * Modelo de datos para eventos de analítica interna.
 * Captura acciones clave del usuario en el storefront.
 * Spec: MasterPlan.md § 1.3 Internal Analytics
 */
export const AnalyticsEvent = model.define("analytics_event", {
  id: model.id().primaryKey(),
  event_type: model.enum(["view_item", "add_to_cart"]),
  product_id: model.text().nullable(),
  variant_id: model.text().nullable(),
  customer_id: model.text().nullable(),
  session_id: model.text().nullable(),
  metadata: model.json().nullable(),
})
