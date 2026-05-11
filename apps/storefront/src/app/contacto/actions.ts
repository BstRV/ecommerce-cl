'use server'

import { z } from 'zod'

const contactFormSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(100, 'El nombre no puede exceder 100 caracteres'),
  email: z.string().email('Ingresa un email válido'),
  mensaje: z.string().min(10, 'El mensaje debe tener al menos 10 caracteres').max(1000, 'El mensaje no puede exceder 1000 caracteres'),
})

type ContactFormInput = z.infer<typeof contactFormSchema>

export type ContactFormResult =
  | { success: true; error?: never }
  | { success: false; error: string }

export async function submitContactForm(
  formData: unknown
): Promise<ContactFormResult> {
  try {
    const validatedData = contactFormSchema.parse(formData)

    // Por ahora: simplemente validar y retornar éxito
    // En el futuro, aquí se enviaría el email o se guardaría en base de datos
    console.log('Formulario de contacto recibido:', validatedData)

    return { success: true }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.issues[0]?.message || 'Error de validación'
      return { success: false, error: firstError }
    }

    return { success: false, error: 'Error al procesar el formulario' }
  }
}
