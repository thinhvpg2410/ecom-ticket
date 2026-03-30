import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { z } from "zod";

import { supabase } from "../lib/supabase";

const userFormSchema = z.object({
  full_name: z.string().min(1, "Bắt buộc"),
  email: z.string().email("Email không hợp lệ"),
  phone: z.string().min(1, "Bắt buộc"),
  role: z.enum(["customer", "admin", "organizer"]),
  status: z.enum(["active", "inactive"]),
});

type UserFormValues = z.infer<typeof userFormSchema>;

export default function UserFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const userQuery = useQuery({
    queryKey: ["admin-user", id],
    enabled: Boolean(id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("app_users")
        .select("id, full_name, email, phone, role, status")
        .eq("id", id!)
        .single();
      if (error) {
        throw error;
      }
      return data;
    },
  });

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      full_name: "",
      email: "",
      phone: "",
      role: "customer",
      status: "active",
    },
    values: userQuery.data
      ? {
          full_name: userQuery.data.full_name,
          email: userQuery.data.email,
          phone: userQuery.data.phone,
          role: userQuery.data.role as UserFormValues["role"],
          status: userQuery.data.status as UserFormValues["status"],
        }
      : undefined,
  });

  const saveMutation = useMutation({
    mutationFn: async (values: UserFormValues) => {
      const { error } = await supabase
        .from("app_users")
        .update({
          full_name: values.full_name.trim(),
          email: values.email.trim().toLowerCase(),
          phone: values.phone.trim(),
          role: values.role,
          status: values.status,
        })
        .eq("id", id!);
      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      void queryClient.invalidateQueries({ queryKey: ["admin-user", id] });
      navigate("/users");
    },
  });

  if (userQuery.isLoading) {
    return <p className="text-zinc-400">Đang tải...</p>;
  }

  if (userQuery.error || !userQuery.data) {
    return (
      <div className="text-red-400">
        {userQuery.error instanceof Error ? userQuery.error.message : "Không tìm thấy người dùng."}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Sửa người dùng</h1>
          <p className="mt-1 text-sm text-zinc-400">Vai trò và trạng thái tài khoản.</p>
        </div>
        <Link to="/users" className="text-sm font-semibold text-zinc-400 hover:text-white">
          ← Danh sách
        </Link>
      </div>

      <form
        className="mt-8 space-y-4 rounded-xl border border-zinc-800 bg-zinc-900/50 p-6"
        onSubmit={form.handleSubmit((v) => saveMutation.mutate(v))}
      >
        <div>
          <label className="block text-xs font-semibold uppercase text-zinc-500">Họ tên</label>
          <input className="input-admin mt-1" {...form.register("full_name")} />
          {form.formState.errors.full_name ? (
            <p className="mt-1 text-xs text-red-400">{form.formState.errors.full_name.message}</p>
          ) : null}
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase text-zinc-500">Email</label>
          <input className="input-admin mt-1" type="email" {...form.register("email")} />
          {form.formState.errors.email ? (
            <p className="mt-1 text-xs text-red-400">{form.formState.errors.email.message}</p>
          ) : null}
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase text-zinc-500">Điện thoại</label>
          <input className="input-admin mt-1" {...form.register("phone")} />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase text-zinc-500">Vai trò</label>
          <select className="input-admin mt-1" {...form.register("role")}>
            <option value="customer">customer</option>
            <option value="admin">admin</option>
            <option value="organizer">organizer</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase text-zinc-500">Trạng thái</label>
          <select className="input-admin mt-1" {...form.register("status")}>
            <option value="active">active</option>
            <option value="inactive">inactive</option>
          </select>
        </div>

        {saveMutation.error ? (
          <p className="text-sm text-red-400">
            {saveMutation.error instanceof Error ? saveMutation.error.message : String(saveMutation.error)}
          </p>
        ) : null}

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={saveMutation.isPending}
            className="rounded-lg bg-red-600 px-6 py-2.5 font-bold text-white hover:bg-red-700 disabled:opacity-60"
          >
            {saveMutation.isPending ? "Đang lưu..." : "Lưu"}
          </button>
          <Link
            to="/users"
            className="rounded-lg border border-zinc-600 px-6 py-2.5 font-semibold text-zinc-300 hover:bg-zinc-800"
          >
            Huỷ
          </Link>
        </div>
      </form>
    </div>
  );
}
