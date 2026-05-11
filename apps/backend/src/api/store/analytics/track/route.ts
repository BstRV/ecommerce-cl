import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { z } from "zod"
import { ANALYTICS_MODULE } from "../../../modules/analytics"
import type AnalyticsModuleService from "../../../modules/analytics/service"

// ─── Validación Zod — sin `any`, cumple MasterPlan.md § Strict Typing ─────────

const TrackEventSchema = z.object({
  event_type: z.enum(["view_item", "add_to_cart"]),
  product_id: z.string().optional(),
  variant_id: z.string().optional(),
  customer_id: z.string().optional(),
  session_id: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
})

// ─── Handler POST /store/analytics/track ─────────────────────────────────────

/**
 * Endpoint público que el Storefront (Next.js) llama para registrar eventos.
 * Se consume desde Server Actions o Route Handlers de Next.js App Router.
 * Spec: MasterPlan.md § 1.3 Internal Analytics
 */
export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> => {
  const parsed = TrackEventSchema.safeParse(req.body)

  if (!parsed.success) {
    res.status(400).json({
      error: "Datos inválidos",
      details: parsed.error.flatten(),
    })
    return
  }

  const analyticsService =
    req.scope.resolve<AnalyticsModuleService>(ANALYTICS_MODULE)

  await analyticsService.trackEvent(parsed.data)

  res.status(201).json({ ok: true })
}
