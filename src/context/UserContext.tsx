import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { AuthChangeEvent } from "@supabase/supabase-js";
import type { User } from "../mockData";
import { supabase } from "../lib/supabase";
import {
  loginWithEmailOrPhone,
  logoutCurrentUser,
  readUserProfile,
  registerWithEmail,
  type ProfileUpdateInput,
  updateUserProfile,
  upsertUserProfile,
} from "../services/authService";

type RegisterInput = {
  fullName: string;
  email: string;
  phone: string;
  password: string;
};

type UserContextValue = {
  users: User[]; // reserved for future admin screens
  currentUser: User | null;
  authReady: boolean;
  login: (emailOrPhone: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (input: RegisterInput) => Promise<{
    success: boolean;
    message?: string;
    needsEmailVerification?: boolean;
  }>;
  updateProfile: (input: ProfileUpdateInput) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
};

const UserContext = createContext<UserContextValue | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [users] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const buildFallbackUser = (id: string, email: string | undefined, metadata: unknown): User => {
      const safeMetadata = typeof metadata === "object" && metadata ? metadata : {};
      const fullName =
        "full_name" in safeMetadata && typeof safeMetadata.full_name === "string"
          ? safeMetadata.full_name
          : "Người dùng";
      const phone =
        "phone" in safeMetadata && typeof safeMetadata.phone === "string"
          ? safeMetadata.phone
          : "";

      return {
        id,
        fullName,
        email: email ?? "",
        phone,
        role: "customer",
        createdAt: new Date().toISOString(),
        status: "active",
      };
    };

    const syncCurrentUser = async (user: { id: string; email?: string; user_metadata: unknown }) => {
      const profile = await readUserProfile(user.id);
      if (profile) {
        setCurrentUser(profile);
        return;
      }

      const fallbackUser = buildFallbackUser(user.id, user.email, user.user_metadata);
      await upsertUserProfile(user.id, fallbackUser);
      setCurrentUser(fallbackUser);
    };

    const bootstrapSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error || !data.session?.user) {
        setCurrentUser(null);
        setAuthReady(true);
        return;
      }

      try {
        await syncCurrentUser(data.session.user);
      } finally {
        setAuthReady(true);
      }
    };

    void bootstrapSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event: AuthChangeEvent, session) => {
      if (event === "INITIAL_SESSION") {
        return;
      }

      if (!session?.user) {
        setCurrentUser(null);
        setAuthReady(true);
        return;
      }

      setTimeout(() => {
        void (async () => {
          try {
            await syncCurrentUser(session.user);
          } finally {
            setAuthReady(true);
          }
        })();
      }, 0);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login: UserContextValue["login"] = async (emailOrPhone, password) => {
    try {
      const profile = await loginWithEmailOrPhone(emailOrPhone, password);
      setCurrentUser(profile);
      return { success: true };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Đăng nhập thất bại. Vui lòng thử lại.";
      return { success: false, message };
    }
  };

  const register: UserContextValue["register"] = async (input) => {
    try {
      const result = await registerWithEmail(input);
      if (result.needsEmailVerification) {
        setCurrentUser(null);
        return {
          success: true,
          needsEmailVerification: true,
          message: "Kiểm tra email để kích hoạt tài khoản, sau đó đăng nhập.",
        };
      }

      if (result.profile) {
        setCurrentUser(result.profile);
      }
      return { success: true, needsEmailVerification: false };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Đăng ký thất bại.";
      return { success: false, message };
    }
  };

  const logout = async () => {
    await logoutCurrentUser();
    setCurrentUser(null);
  };

  const updateProfile: UserContextValue["updateProfile"] = async (input) => {
    if (!currentUser) {
      return { success: false, message: "Bạn cần đăng nhập để cập nhật hồ sơ." };
    }

    try {
      const updatedProfile = await updateUserProfile(currentUser.id, input);
      setCurrentUser(updatedProfile);
      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Cập nhật hồ sơ thất bại.";
      return { success: false, message };
    }
  };

  const value = useMemo<UserContextValue>(
    () => ({
      users,
      currentUser,
      authReady,
      login,
      register,
      updateProfile,
      logout,
    }),
    [authReady, currentUser, users],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUserContext() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within UserProvider");
  }
  return context;
}
