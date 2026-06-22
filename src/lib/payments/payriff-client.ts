// Payriff (Azərbaycan) ödəniş sistemi — Gateway API V3
// Sənədlər: https://docs.payriff.com/

const PAYRIFF_BASE_URL = "https://api.payriff.com/api/v3";

interface CreateOrderParams {
  amount: number;
  description: string;
  callbackUrl: string;
  language?: "AZ" | "EN" | "RU";
  currency?: "AZN" | "USD" | "EUR";
  metadata?: Record<string, string>;
}

interface CreateOrderResponse {
  code: string;
  message: string;
  internalMessage: string | null;
  payload: {
    orderId: string;
    paymentUrl: string;
    transactionId: number;
  };
}

function getSecretKey(): string {
  const key = process.env.PAYRIFF_SECRET_KEY;
  if (!key) throw new Error("PAYRIFF_SECRET_KEY tapılmadı. .env.local-a əlavə edin.");
  return key;
}

/**
 * Yeni ödəniş sifarişi yaradır və ödəniş səhifəsinin linkini qaytarır.
 * İstifadəçi bu linkə yönləndirilir, kart məlumatlarını Payriff-in öz
 * təhlükəsiz səhifəsində daxil edir (PCI-DSS — bizim tərəfdə kart məlumatı saxlanılmır).
 */
export async function createPayriffOrder(params: CreateOrderParams): Promise<CreateOrderResponse> {
  const res = await fetch(`${PAYRIFF_BASE_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: getSecretKey(),
    },
    body: JSON.stringify({
      amount: params.amount,
      language: params.language ?? "AZ",
      currency: params.currency ?? "AZN",
      description: params.description,
      callbackUrl: params.callbackUrl,
      cardSave: false,
      operation: "PURCHASE",
      metadata: params.metadata,
    }),
  });

  const data: CreateOrderResponse = await res.json();
  if (!res.ok || data.code !== "00000") {
    throw new Error(data.message ?? "Payriff sifarişi yaradıla bilmədi.");
  }
  return data;
}

interface OrderInfoResponse {
  code: string;
  message: string;
  payload: {
    orderId: string;
    amount: number;
    currencyType: string;
    paymentStatus: "PAID" | "CREATED" | "CANCELED" | "DECLINED" | "EXPIRED" | string;
    description: string;
  };
}

/**
 * Sifarişin cari statusunu yoxlamaq üçün (webhook gəlmədiyi halda manual yoxlama).
 */
export async function getPayriffOrderInfo(orderId: string): Promise<OrderInfoResponse> {
  const res = await fetch(`${PAYRIFF_BASE_URL}/orders/${orderId}`, {
    method: "GET",
    headers: { Authorization: getSecretKey() },
  });
  const data: OrderInfoResponse = await res.json();
  if (!res.ok) throw new Error(data.message ?? "Sifariş məlumatı alına bilmədi.");
  return data;
}
