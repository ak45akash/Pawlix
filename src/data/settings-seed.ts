import { siteConfig } from "@/config/site";
import { defaultLocalListings } from "@/data/marketing-seed";
import { defaultWeeklyBusinessHours, formatBusinessHours } from "@/lib/business-hours";
import type { SiteSettings } from "@/types/catalog";

export function defaultSiteSettings(): SiteSettings {
  const listings = defaultLocalListings();
  const businessHours = defaultWeeklyBusinessHours();
  return {
    shippingCharge: 79,
    freeShippingThreshold: 1499,
    deliveryNote: "Tricity (Chandigarh, Mohali, Panchkula): 1–2 days. Nearby pincodes: 2–4 days.",
    gstEnabled: true,
    gstRate: 18,
    storeName: siteConfig.name,
    storeEmail: listings.email,
    storePhone: listings.phone,
    storeAddress: listings.address,
    businessHours,
    supportHours: formatBusinessHours(businessHours),
    minOrderAmount: 499,
    codEnabled: true,
    pickupEnabled: true,
    orderPrefix: "PWL",
    lowStockAlertThreshold: 5,
    maintenanceMode: false,
    maintenanceMessage: "We are updating the shop and will be back shortly.",
  };
}
