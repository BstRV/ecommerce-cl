import {
  createStep,
  StepResponse,
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { addToCartWorkflow } from "@medusajs/medusa/core-flows"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { ANALYTICS_MODULE } from "../../modules/analytics"
import type AnalyticsModuleService from "../../modules/analytics/service"

// ─── Tipos ────────────────────────────────────────────────────────────────────

type AddToCartWithAnalyticsInput = {
  cartId: string
  items: Array<{
    variantId: string
    quantity: number
  }>
  customerId?: string
  sessionId?: string
}

// ─── Paso 1: Registrar evento de analítica ────────────────────────────────────

/**
 * Paso que registra el evento add_to_cart en el módulo de analíticas.
 * Se ejecuta de forma asíncrona después de añadir el ítem al carrito.
 * Spec: MasterPlan.md § 1.3 Internal Analytics
 */
const trackAddToCartStep = createStep(
  "track-add-to-cart-step",
  async (
    input: {
      variantId: string
      customerId?: string
      sessionId?: string
    },
    { container }
  ) => {
    const analyticsService =
      container.resolve<AnalyticsModuleService>(ANALYTICS_MODULE)

    await analyticsService.trackEvent({
      event_type: "add_to_cart",
      variant_id: input.variantId,
      customer_id: input.customerId,
      session_id: input.sessionId,
    })

    return new StepResponse(null)
  }
)

// ─── Workflow ─────────────────────────────────────────────────────────────────

/**
 * Workflow personalizado para añadir ítems al carrito.
 * Envuelve el workflow nativo de Medusa e inyecta el tracking de analíticas.
 * Spec: MasterPlan.md § 1.3 Custom Workflows
 */
export const addToCartWithAnalyticsWorkflow = createWorkflow(
  "add-to-cart-with-analytics",
  (input: AddToCartWithAnalyticsInput) => {
    // Paso nativo de Medusa: añade los ítems al carrito
    const { cart } = addToCartWorkflow.runAsStep({
      input: {
        cart_id: input.cartId,
        items: input.items.map((item) => ({
          variant_id: item.variantId,
          quantity: item.quantity,
        })),
      },
    })

    // Paso custom: registra el evento en la tabla de analíticas (fire-and-forget)
    trackAddToCartStep({
      variantId: input.items[0]?.variantId ?? "",
      customerId: input.customerId,
      sessionId: input.sessionId,
    })

    return new WorkflowResponse({ cart })
  }
)
