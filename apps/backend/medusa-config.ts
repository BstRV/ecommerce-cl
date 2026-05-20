import { loadEnv, defineConfig, Modules } from '@medusajs/framework/utils'
import { ANALYTICS_MODULE } from './src/modules/analytics'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    redisUrl: process.env.REDIS_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    }
  },
  modules: [
    // ── Módulo local de Analíticas Internas ──────────────────────────────────
    // Captura eventos view_item y add_to_cart directamente en Postgres.
    // Spec: MasterPlan.md § 1.3 Internal Analytics
    {
      resolve: './src/modules/analytics',
      key: ANALYTICS_MODULE,
    },
    // ── Módulo de Autenticación Híbrida ──────────────────────────────────────
    {
      resolve: "@medusajs/medusa/auth",
      options: {
        providers: [
          {
            resolve: "@medusajs/medusa/auth-emailpass",
            id: "emailpass",
          },
          {
            resolve: "@medusajs/medusa/auth-google",
            id: "google",
            options: {
              clientId: process.env.GOOGLE_CLIENT_ID,
              clientSecret: process.env.GOOGLE_CLIENT_SECRET,
              callbackUrl: process.env.GOOGLE_CALLBACK_URL || "http://localhost:9000/auth/google/callback",
              successRedirectUrl: process.env.GOOGLE_SUCCESS_REDIRECT || "http://localhost:3000/cuenta",
            },
          },
        ],
      },
    },
  ],
})

