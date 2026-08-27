/**
 * Environment variable contract.
 *
 * Public (NEXT_PUBLIC_*) values are safe for the browser.
 * Server-only values must never be imported into Client Components.
 *
 * Phase 0 documents the names. Later phases start reading them.
 */

export const publicEnvNames = [
  "NEXT_PUBLIC_SITE_URL",
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "NEXT_PUBLIC_RAZORPAY_KEY_ID",
] as const;

export const serverEnvNames = [
  "SUPABASE_SERVICE_ROLE_KEY",
  "RAZORPAY_KEY_ID",
  "RAZORPAY_KEY_SECRET",
  "RESEND_API_KEY",
  "RESEND_FROM_EMAIL",
] as const;

export function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "https://pawlix.com";
}
