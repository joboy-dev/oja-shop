import type { OrderStatus } from "@/lib/config/shop";
import type { OrderDetailDTO } from "./order";

export interface AdminProductRow {
  id: string;
  slug: string;
  name: string;
  categoryName: string;
  price: number;
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
  imageUrl: string | null;
  updatedAt: string;
}

export interface AdminProductImage {
  id: string;
  url: string;
  alt: string;
}

export interface AdminProductDetail {
  id: string;
  slug: string;
  name: string;
  categoryId: string;
  shortDescription: string;
  description: string;
  price: number;
  compareAtPrice: number | null;
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
  materials: string | null;
  care: string | null;
  images: AdminProductImage[];
}

export interface AdminCategory {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  sortOrder: number;
  productCount: number;
}

export interface AdminOrderRow {
  id: string;
  orderNumber: string;
  email: string;
  status: OrderStatus;
  paymentStatus: "unpaid" | "paid" | "refunded";
  paymentMethod: "pay_on_delivery" | "bank_transfer";
  total: number;
  itemCount: number;
  placedAt: string;
}

export interface EmailLogDTO {
  id: string;
  template: string;
  to: string;
  status: "sent" | "failed";
  error: string | null;
  createdAt: string;
}

export interface AdminOrderDetail extends OrderDetailDTO {
  userId: string | null;
  emails: EmailLogDTO[];
  confirmationEmailSentAt: string | null;
}

export interface DashboardStats {
  revenueToday: number;
  revenue30d: number;
  orders30d: number;
  averageOrder30d: number;
  awaitingAction: number;
  lowStock: number;
  outOfStock: number;
  recentOrders: AdminOrderRow[];
  topProducts: { name: string; slug: string; units: number; revenue: number }[];
  /** Revenue per day for the last 14 days, oldest first. */
  daily: { date: string; revenue: number; orders: number }[];
}

export interface CustomerRow {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: "customer" | "admin";
  createdAt: string;
  orderCount: number;
  totalSpent: number;
}

export interface ContactMessageDTO {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "new" | "read";
  createdAt: string;
}
