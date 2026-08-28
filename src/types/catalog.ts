import type { SkuSource } from "@/features/products/sku.ts";
import type { AdminRole } from "@/lib/permissions/catalogue.ts";

export type PetType = {
  id: string;
  name: string;
  slug: string;
  sortOrder: number;
  archived: boolean;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  petTypeIds: string[];
  sortOrder: number;
  archived: boolean;
};

export type Subcategory = {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  sortOrder: number;
  archived: boolean;
};

export type Brand = {
  id: string;
  name: string;
  slug: string;
  sortOrder: number;
  archived: boolean;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  sku: string;
  skuSource: SkuSource;
  shortDescription: string;
  description: string;
  petTypeId: string;
  categoryId: string;
  subcategoryId: string | null;
  brandId: string | null;
  image: string;
  images: string[];
  mrp: number;
  price: number;
  cost: number;
  gstPercent: number;
  stock: number;
  lowStockThreshold: number;
  published: boolean;
  featured: boolean;
  sortOrder: number;
  seoTitle: string;
  seoDescription: string;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ProductVariant = {
  id: string;
  productId: string;
  name: string;
  sku: string;
  skuSource: SkuSource;
  price: number;
  mrp: number | null;
  cost: number;
  stock: number;
};

export type InventoryMovement = {
  id: string;
  productId: string;
  variantId: string | null;
  type:
    | "ONLINE_SALE"
    | "OFFLINE_SALE"
    | "STOCK_RECEIVED"
    | "STOCK_ADJUSTMENT"
    | "RETURN"
    | "DAMAGED"
    | "CANCELLED_ORDER"
    | "RESTOCK";
  quantityChange: number;
  previousQuantity: number;
  newQuantity: number;
  reason: string;
  note: string;
  actor: string;
  createdAt: string;
};

export type OrderStatus =
  | "Pending payment"
  | "Confirmed"
  | "Processing"
  | "Packed"
  | "Shipped"
  | "Out for delivery"
  | "Delivered"
  | "Cancelled"
  | "Return requested"
  | "Returned"
  | "Refunded";

export type OrderItem = {
  productId: string;
  variantId: string | null;
  name: string;
  sku: string;
  quantity: number;
  unitPrice: number;
};

export type Order = {
  id: string;
  number: string;
  customerName: string;
  customerEmail: string;
  status: OrderStatus;
  paymentStatus: "Paid" | "Pending" | "Failed" | "Refunded";
  channel: "online" | "offline";
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  address: string;
  createdAt: string;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  orders: number;
  spent: number;
  createdAt: string;
};

export type Coupon = {
  id: string;
  code: string;
  type: "percentage" | "fixed";
  value: number;
  minOrder: number;
  usageLimit: number;
  used: number;
  active: boolean;
  startsAt: string;
  endsAt: string;
};

export type Review = {
  id: string;
  productId: string;
  author: string;
  rating: number;
  body: string;
  published: boolean;
  createdAt: string;
};

export type HomepageSection = {
  id: string;
  title: string;
  kind: "hero" | "featured" | "collection" | "banner";
  body: string;
  enabled: boolean;
  sortOrder: number;
};

export type ContentKind = "blog" | "recipe";

export type ContentPost = {
  id: string;
  kind: ContentKind;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  coverImage: string;
  petTypeIds: string[];
  published: boolean;
  featured: boolean;
  readingMinutes: number;
  servings: string;
  prepMinutes: number | null;
  cookMinutes: number | null;
  seoTitle: string;
  seoDescription: string;
  publishedAt: string;
  updatedAt: string;
  archived: boolean;
};

export type AuditLog = {
  id: string;
  actor: string;
  action: string;
  entity: string;
  entityId: string;
  detail: string;
  createdAt: string;
};

export type SiteSettings = {
  shippingCharge: number;
  freeShippingThreshold: number;
  deliveryNote: string;
  gstEnabled: boolean;
};

export type DemoState = {
  petTypes: PetType[];
  categories: Category[];
  subcategories: Subcategory[];
  brands: Brand[];
  products: Product[];
  variants: ProductVariant[];
  movements: InventoryMovement[];
  orders: Order[];
  customers: Customer[];
  coupons: Coupon[];
  reviews: Review[];
  posts: ContentPost[];
  homepageSections: HomepageSection[];
  auditLogs: AuditLog[];
  settings: SiteSettings;
  adminRole: AdminRole;
};

export type CartItem = {
  productId: string;
  variantId: string | null;
  quantity: number;
};
