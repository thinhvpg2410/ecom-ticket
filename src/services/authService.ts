import type { User as AuthUser } from "@supabase/supabase-js";

import type { User } from "../mockData";
import { supabase } from "../lib/supabase";

type RegisterInput = {
  fullName: string;
  email: string;
  phone: string;
  password: string;
};
type RegisterResult = {
  profile: User | null;
  needsEmailVerification: boolean;
};
export type ProfileUpdateInput = {
  fullName: string;
  phone: string;
  dateOfBirth?: string;
  avatarFileUri?: string;
  avatarBase64?: string;
};
const PROFILE_SELECT_V2 =
  "id, full_name, email, phone, role, avatar_url, avatar_base64, birth_date, created_at, status";
const PROFILE_SELECT_V1 = "id, full_name, email, phone, role, avatar_url, created_at, status";

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function isMissingColumnError(error: unknown, column: string) {
  const message =
    typeof error === "object" && error && "message" in error && typeof error.message === "string"
      ? error.message
      : "";
  return message.includes(`column app_users.${column} does not exist`);
}

function normalizePhone(value: string) {
  return value.trim().replace(/\s+/g, "");
}

function normalizeDateOfBirth(value?: string) {
  if (!value) {
    return undefined;
  }
  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }

  // Accept dd/mm/yyyy from UI and normalize to yyyy-mm-dd for Postgres date.
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(trimmed);
  if (match) {
    return `${match[3]}-${match[2]}-${match[1]}`;
  }
  return trimmed;
}

function formatDateOfBirth(value?: string | null) {
  if (!value) {
    return undefined;
  }
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) {
    return value;
  }
  return `${match[3]}/${match[2]}/${match[1]}`;
}

function getFileExtension(uri: string) {
  const cleanUri = uri.split("?")[0] ?? uri;
  const segments = cleanUri.split(".");
  const ext = segments.length > 1 ? segments[segments.length - 1] : "jpg";
  return ext.toLowerCase();
}

async function uploadAvatar(uid: string, fileUri: string) {
  const response = await fetch(fileUri);
  const blob = await response.blob();
  const extension = getFileExtension(fileUri);
  const filePath = `${uid}/avatar-${Date.now()}.${extension}`;

  const { error } = await supabase.storage.from("avatars").upload(filePath, blob, {
    upsert: true,
    contentType: blob.type || `image/${extension}`,
  });

  if (error) {
    throw new Error(error.message);
  }

  const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
  return data.publicUrl;
}

function toProfile(user: AuthUser, fallback?: Partial<User>): User {
  const now = new Date().toISOString();
  return {
    id: user.id,
    fullName: fallback?.fullName ?? user.user_metadata.full_name ?? "Người dùng",
    email: fallback?.email ?? user.email ?? "",
    phone: fallback?.phone ?? "",
    role: fallback?.role ?? "customer",
    avatarUrl: fallback?.avatarUrl,
    avatarBase64: fallback?.avatarBase64,
    dateOfBirth: fallback?.dateOfBirth,
    createdAt: fallback?.createdAt ?? now,
    status: fallback?.status ?? "active",
  };
}

export async function readUserProfile(uid: string): Promise<User | null> {
  const query = supabase
    .from("app_users")
    .select(PROFILE_SELECT_V2)
    .eq("id", uid)
    .maybeSingle();
  let { data, error } = await query;

  if (error && (isMissingColumnError(error, "birth_date") || isMissingColumnError(error, "avatar_base64"))) {
    const fallback = await supabase
      .from("app_users")
      .select(PROFILE_SELECT_V1)
      .eq("id", uid)
      .maybeSingle();
    data = fallback.data as typeof data;
    error = fallback.error;
  }

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    return null;
  }
  return {
    id: uid,
    fullName: data.full_name ?? "Người dùng",
    email: data.email ?? "",
    phone: data.phone ?? "",
    role: data.role ?? "customer",
    avatarUrl: data.avatar_url ?? undefined,
    avatarBase64: data.avatar_base64 ?? undefined,
    dateOfBirth: formatDateOfBirth(data.birth_date),
    createdAt: data.created_at ?? new Date().toISOString(),
    status: data.status ?? "active",
  };
}

export async function upsertUserProfile(uid: string, profile: User) {
  const payloadV2 = {
    id: uid,
    full_name: profile.fullName,
    email: profile.email,
    phone: profile.phone,
    role: profile.role,
    avatar_url: profile.avatarUrl ?? null,
    avatar_base64: profile.avatarBase64 ?? null,
    birth_date: normalizeDateOfBirth(profile.dateOfBirth) ?? null,
    created_at: profile.createdAt,
    status: profile.status,
  };
  let { error } = await supabase.from("app_users").upsert(
    payloadV2,
    { onConflict: "id" },
  );

  if (error && (isMissingColumnError(error, "birth_date") || isMissingColumnError(error, "avatar_base64"))) {
    const payloadV1 = {
      id: uid,
      full_name: profile.fullName,
      email: profile.email,
      phone: profile.phone,
      role: profile.role,
      avatar_url: profile.avatarUrl ?? null,
      created_at: profile.createdAt,
      status: profile.status,
    };
    const fallback = await supabase.from("app_users").upsert(
      payloadV1,
      { onConflict: "id" },
    );
    error = fallback.error;
  }

  if (error) {
    throw new Error(error.message);
  }
}

async function updateProfileRowWithFallback(
  uid: string,
  payloadV2: {
    full_name: string;
    phone: string;
    birth_date: string | null;
    avatar_url?: string | null;
    avatar_base64?: string | null;
  },
) {
  let { error } = await supabase.from("app_users").update(payloadV2).eq("id", uid);

  if (error && (isMissingColumnError(error, "birth_date") || isMissingColumnError(error, "avatar_base64"))) {
    const payloadV1: {
      full_name: string;
      phone: string;
      avatar_url?: string | null;
    } = {
      full_name: payloadV2.full_name,
      phone: payloadV2.phone,
    };
    if (payloadV2.avatar_url !== undefined) {
      payloadV1.avatar_url = payloadV2.avatar_url;
    }
    const fallback = await supabase.from("app_users").update(payloadV1).eq("id", uid);
    error = fallback.error;
  }

  if (error) {
    throw new Error(error.message);
  }
}

async function resolveLoginEmail(emailOrPhone: string) {
  const input = emailOrPhone.trim();
  if (!input) {
    return "";
  }

  if (input.includes("@")) {
    return normalize(input);
  }

  const { data, error } = await supabase
    .from("app_users")
    .select("email")
    .eq("phone", normalizePhone(input))
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    return "";
  }
  return data.email ? normalize(data.email) : "";
}

export async function loginWithEmailOrPhone(emailOrPhone: string, password: string) {
  const email = await resolveLoginEmail(emailOrPhone);
  if (!email) {
    throw new Error("Không tìm thấy tài khoản.");
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password: password.trim(),
  });

  if (error) {
    throw new Error(error.message);
  }
  if (!data.user) {
    throw new Error("Đăng nhập thất bại. Không tìm thấy người dùng.");
  }

  return toProfile(data.user, {
    phone: normalizePhone(String(data.user.user_metadata.phone ?? "")),
  });
}

export async function registerWithEmail(input: RegisterInput): Promise<RegisterResult> {
  const email = normalize(input.email);
  const phone = normalizePhone(input.phone);
  const password = input.password.trim();
  const fullName = input.fullName.trim();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        phone,
      },
    },
  });

  if (error) {
    throw new Error(error.message);
  }
  if (!data.user) {
    throw new Error("Không thể tạo tài khoản.");
  }

  if (!data.session) {
    return {
      profile: null,
      needsEmailVerification: true,
    };
  }

  const profile = toProfile(data.user, {
    fullName,
    email,
    phone,
    role: "customer",
    createdAt: new Date().toISOString(),
    status: "active",
  });

  await upsertUserProfile(data.user.id, profile);
  return {
    profile,
    needsEmailVerification: false,
  };
}

export async function requestPasswordReset(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(normalize(email));
  if (error) {
    throw new Error(error.message);
  }
}

export async function updateUserProfile(uid: string, input: ProfileUpdateInput) {
  const fullName = input.fullName.trim();
  const phone = normalizePhone(input.phone);
  const birthDate = normalizeDateOfBirth(input.dateOfBirth) ?? null;

  let avatarUrl: string | null | undefined = undefined;
  if (input.avatarFileUri?.trim()) {
    avatarUrl = await uploadAvatar(uid, input.avatarFileUri.trim());
  }

  const payload: {
    full_name: string;
    phone: string;
    birth_date: string | null;
    avatar_url?: string | null;
    avatar_base64?: string | null;
  } = {
    full_name: fullName,
    phone,
    birth_date: birthDate,
  };
  if (avatarUrl !== undefined) {
    payload.avatar_url = avatarUrl;
  }
  if (input.avatarBase64 !== undefined) {
    payload.avatar_base64 = input.avatarBase64 || null;
  }

  await updateProfileRowWithFallback(uid, payload);

  const updatedProfile = await readUserProfile(uid);
  if (!updatedProfile) {
    throw new Error("Không thể tải hồ sơ sau khi cập nhật.");
  }
  return updatedProfile;
}

export async function logoutCurrentUser() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error(error.message);
  }
}
