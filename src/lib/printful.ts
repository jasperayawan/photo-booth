/**
 * Printful API Integration
 * Handles print-on-demand orders for photo products
 */

import { PRINT_PRODUCTS, type PrintProduct, type PrintSize } from "@/data/premium";

// Printful API configuration
const PRINTFUL_API_URL = "https://api.printful.com";

export interface ShippingAddress {
  name: string;
  address1: string;
  address2?: string;
  city: string;
  stateCode: string;
  countryCode: string;
  zip: string;
  phone?: string;
  email: string;
}

export interface PrintOrderItem {
  productId: string;
  sizeId: string;
  quantity: number;
  imageUrl: string; // Base64 or URL to the image
}

export interface PrintOrder {
  items: PrintOrderItem[];
  shipping: ShippingAddress;
  customerId?: string;
}

export interface PrintfulOrderResponse {
  success: boolean;
  orderId?: string;
  estimatedDelivery?: string;
  totalCost?: number;
  error?: string;
}

export interface ShippingRate {
  id: string;
  name: string;
  rate: number;
  currency: string;
  estimatedDays: string;
}

/**
 * Get available print products
 */
export function getProducts(): PrintProduct[] {
  return PRINT_PRODUCTS;
}

/**
 * Get product by ID
 */
export function getProduct(productId: string): PrintProduct | undefined {
  return PRINT_PRODUCTS.find((p) => p.id === productId);
}

/**
 * Get size details
 */
export function getSize(productId: string, sizeId: string): PrintSize | undefined {
  const product = getProduct(productId);
  return product?.sizes.find((s) => s.id === sizeId);
}

/**
 * Calculate order total
 */
export function calculateOrderTotal(
  items: PrintOrderItem[],
  shippingRate: number = 0,
  discountPercent: number = 0
): { subtotal: number; discount: number; shipping: number; total: number } {
  let subtotal = 0;

  for (const item of items) {
    const size = getSize(item.productId, item.sizeId);
    if (size) {
      subtotal += size.price * item.quantity;
    }
  }

  const discount = subtotal * (discountPercent / 100);
  const total = subtotal - discount + shippingRate;

  return {
    subtotal,
    discount,
    shipping: shippingRate,
    total: Math.max(0, total),
  };
}

/**
 * Estimate shipping rates (mock - replace with actual Printful API call)
 */
export async function getShippingRates(
  address: ShippingAddress,
  items: PrintOrderItem[]
): Promise<ShippingRate[]> {
  // In production, call Printful API:
  // POST https://api.printful.com/shipping/rates

  // Mock shipping rates for demo
  return [
    {
      id: "standard",
      name: "Standard Shipping",
      rate: 4.99,
      currency: "USD",
      estimatedDays: "7-14 business days",
    },
    {
      id: "express",
      name: "Express Shipping",
      rate: 12.99,
      currency: "USD",
      estimatedDays: "3-5 business days",
    },
    {
      id: "priority",
      name: "Priority Shipping",
      rate: 24.99,
      currency: "USD",
      estimatedDays: "1-2 business days",
    },
  ];
}

/**
 * Create a print order
 * In production, this should call your backend API which then calls Printful
 */
export async function createPrintOrder(
  order: PrintOrder,
  paymentToken: string
): Promise<PrintfulOrderResponse> {
  try {
    // In production, call your backend API:
    // const response = await fetch('/api/print', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ order, paymentToken }),
    // });

    // Mock response for demo
    await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate API delay

    return {
      success: true,
      orderId: `PB-${Date.now()}`,
      estimatedDelivery: "7-14 business days",
      totalCost: calculateOrderTotal(order.items, 4.99).total,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create order",
    };
  }
}

/**
 * Upload image to Printful for printing
 * In production, upload to your server first, then to Printful
 */
export async function uploadImageForPrint(
  imageDataUrl: string
): Promise<{ success: boolean; fileUrl?: string; error?: string }> {
  try {
    // In production:
    // 1. Upload to your server/cloud storage
    // 2. Return the public URL
    // 3. Printful will fetch from that URL

    // For demo, we'll just validate the image
    if (!imageDataUrl.startsWith("data:image/")) {
      throw new Error("Invalid image format");
    }

    // Mock file URL (in production, return actual uploaded URL)
    return {
      success: true,
      fileUrl: imageDataUrl, // Printful accepts base64 for small images
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to upload image",
    };
  }
}

/**
 * Validate shipping address
 */
export function validateAddress(address: Partial<ShippingAddress>): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!address.name?.trim()) errors.push("Name is required");
  if (!address.address1?.trim()) errors.push("Address is required");
  if (!address.city?.trim()) errors.push("City is required");
  if (!address.stateCode?.trim()) errors.push("State/Province is required");
  if (!address.countryCode?.trim()) errors.push("Country is required");
  if (!address.zip?.trim()) errors.push("ZIP/Postal code is required");
  if (!address.email?.trim()) errors.push("Email is required");
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address.email)) {
    errors.push("Invalid email format");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Get supported countries for shipping
 */
export function getSupportedCountries(): { code: string; name: string }[] {
  return [
    { code: "US", name: "United States" },
    { code: "CA", name: "Canada" },
    { code: "GB", name: "United Kingdom" },
    { code: "AU", name: "Australia" },
    { code: "DE", name: "Germany" },
    { code: "FR", name: "France" },
    { code: "JP", name: "Japan" },
    { code: "PH", name: "Philippines" },
    // Add more countries as needed
  ];
}
