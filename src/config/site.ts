export const siteConfig = {
  name: "Pawlix",
  domain: "pawlix.com",
  url: "https://pawlix.com",
  description:
    "Premium pet food, toys, and accessories in Chandigarh, Mohali and Panchkula — thoughtfully chosen for everyday care.",
  location: {
    label: "Tricity",
    cities: ["Chandigarh", "Mohali", "Panchkula"] as const,
    formatted: "Chandigarh, Mohali & Panchkula",
    short: "Chandigarh · Mohali · Panchkula",
    storeCity: "Chandigarh",
    state: "Punjab",
    stateCode: "PB",
  },
} as const;

export function tricityLabel() {
  return siteConfig.location.short;
}

export function tricityDeliveryLine() {
  return `We deliver across the Tricity — ${siteConfig.location.cities.join(", ")}.`;
}
