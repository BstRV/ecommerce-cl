import { MedusaService } from "@medusajs/framework/utils"
import { AnalyticsEvent } from "./models/analytics-event"

type TrackEventInput = {
  event_type: "view_item" | "add_to_cart"
  product_id?: string
  variant_id?: string
  customer_id?: string
  session_id?: string
  metadata?: Record<string, unknown>
}

/**
 * Servicio para el módulo de Analíticas Internas.
 * Expone el método `trackEvent` que persiste eventos en Postgres.
 * Spec: MasterPlan.md § 1.3 Internal Analytics
 */
class AnalyticsModuleService extends MedusaService({
  AnalyticsEvent,
}) {
  async trackEvent(data: TrackEventInput): Promise<void> {
    await this.createAnalyticsEvents({
      event_type: data.event_type,
      product_id: data.product_id ?? null,
      variant_id: data.variant_id ?? null,
      customer_id: data.customer_id ?? null,
      session_id: data.session_id ?? null,
      metadata: data.metadata ?? null,
    })
  }
}

export default AnalyticsModuleService
