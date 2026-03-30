import type { PaymentMethod } from "../mockData";
import { supabase } from "../lib/supabase";

function mapRow(row: {
  id: string;
  user_id: string;
  type: string;
  provider_label: string;
  holder_name: string | null;
  brand: string | null;
  last4: string | null;
  expiry_month: number | null;
  expiry_year: number | null;
  wallet_phone: string | null;
  token_ref: string;
  status: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}): PaymentMethod {
  return {
    id: row.id,
    userId: row.user_id,
    type: row.type as PaymentMethod["type"],
    providerLabel: row.provider_label,
    holderName: row.holder_name ?? undefined,
    brand: row.brand ?? undefined,
    last4: row.last4 ?? undefined,
    expiryMonth: row.expiry_month ?? undefined,
    expiryYear: row.expiry_year ?? undefined,
    walletPhone: row.wallet_phone ?? undefined,
    tokenRef: row.token_ref,
    status: row.status as PaymentMethod["status"],
    isDefault: row.is_default,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function listPaymentMethodsForUser(userId: string): Promise<PaymentMethod[]> {
  const { data, error } = await supabase
    .from("payment_methods")
    .select(
      "id, user_id, type, provider_label, holder_name, brand, last4, expiry_month, expiry_year, wallet_phone, token_ref, status, is_default, created_at, updated_at",
    )
    .eq("user_id", userId)
    .eq("status", "active")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map(mapRow);
}

function newId(prefix: string) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

function nowIso() {
  return new Date().toISOString();
}

export async function addSimulatedCard(input: {
  userId: string;
  holderName: string;
  last4: string;
  brand: "VISA" | "MASTERCARD";
  expiryMonth: number;
  expiryYear: number;
}): Promise<PaymentMethod> {
  const id = newId("pm");
  const tokenRef = `sim_card_${id}`;
  const createdAt = nowIso();
  const providerLabel =
    input.brand === "VISA" ? "VISA •••• " + input.last4 : "Mastercard •••• " + input.last4;

  const { data, error } = await supabase
    .from("payment_methods")
    .insert({
      id,
      user_id: input.userId,
      type: "visa",
      provider_label: providerLabel,
      holder_name: input.holderName.trim().toUpperCase(),
      brand: input.brand,
      last4: input.last4,
      expiry_month: input.expiryMonth,
      expiry_year: input.expiryYear,
      token_ref: tokenRef,
      status: "active",
      is_default: false,
      created_at: createdAt,
      updated_at: createdAt,
    })
    .select(
      "id, user_id, type, provider_label, holder_name, brand, last4, expiry_month, expiry_year, wallet_phone, token_ref, status, is_default, created_at, updated_at",
    )
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapRow(data);
}

export async function addSimulatedMomo(input: { userId: string; walletPhone: string }): Promise<PaymentMethod> {
  const id = newId("pm");
  const phone = input.walletPhone.trim().replace(/\s+/g, "");
  const tokenRef = `sim_momo_${id}`;
  const createdAt = nowIso();

  const { data, error } = await supabase
    .from("payment_methods")
    .insert({
      id,
      user_id: input.userId,
      type: "momo",
      provider_label: "MoMo Wallet",
      wallet_phone: phone,
      token_ref: tokenRef,
      status: "active",
      is_default: false,
      created_at: createdAt,
      updated_at: createdAt,
    })
    .select(
      "id, user_id, type, provider_label, holder_name, brand, last4, expiry_month, expiry_year, wallet_phone, token_ref, status, is_default, created_at, updated_at",
    )
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapRow(data);
}

export async function addSimulatedVnpay(input: { userId: string; label?: string }): Promise<PaymentMethod> {
  const id = newId("pm");
  const tokenRef = `sim_vnpay_${id}`;
  const createdAt = nowIso();

  const { data, error } = await supabase
    .from("payment_methods")
    .insert({
      id,
      user_id: input.userId,
      type: "vnpay",
      provider_label: input.label?.trim() || "VNPay / ứng dụng ngân hàng",
      token_ref: tokenRef,
      status: "active",
      is_default: false,
      created_at: createdAt,
      updated_at: createdAt,
    })
    .select(
      "id, user_id, type, provider_label, holder_name, brand, last4, expiry_month, expiry_year, wallet_phone, token_ref, status, is_default, created_at, updated_at",
    )
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapRow(data);
}
