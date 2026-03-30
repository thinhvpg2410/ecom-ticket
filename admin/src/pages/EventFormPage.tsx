import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { useFieldArray, useForm, type Resolver } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { z } from "zod";

import { newId } from "../lib/ids";
import { supabase } from "../lib/supabase";
import {
  EVENT_CATEGORIES,
  EVENT_LOCATIONS,
  EVENT_STATUSES,
  EVENT_TYPES,
} from "../types/events";

const ticketSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Bắt buộc"),
  price: z.preprocess(
    (v) => (typeof v === "number" && Number.isFinite(v) ? v : Number(v) || 0),
    z.number().min(0),
  ),
  remaining: z.preprocess(
    (v) => (typeof v === "number" && Number.isFinite(v) ? Math.trunc(v) : Math.trunc(Number(v) || 0)),
    z.number().int().min(0),
  ),
  benefitsText: z.string().optional(),
});

const eventFormSchema = z.object({
  title: z.string().min(1, "Bắt buộc"),
  image_url: z.string().optional(),
  date_display: z.string().min(1, "Bắt buộc"),
  category: z.enum(EVENT_CATEGORIES),
  is_trending: z.boolean(),
  location: z.enum(EVENT_LOCATIONS),
  type: z.enum(EVENT_TYPES),
  description: z.string().min(1, "Bắt buộc"),
  organizer_id: z.string().min(1, "Chọn ban tổ chức"),
  status: z.enum(EVENT_STATUSES),
  tickets: z.array(ticketSchema).min(1, "Cần ít nhất một loại vé"),
});

type EventFormValues = z.infer<typeof eventFormSchema>;

function parseBenefits(text: string | undefined): unknown {
  if (!text?.trim()) {
    return null;
  }
  const lines = text
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
  return lines.length ? lines : null;
}

function benefitsToText(raw: unknown): string {
  if (raw == null) {
    return "";
  }
  if (Array.isArray(raw)) {
    return raw.map(String).join("\n");
  }
  return String(raw);
}

export default function EventFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const organizersQuery = useQuery({
    queryKey: ["organizers"],
    queryFn: async () => {
      const { data, error } = await supabase.from("organizers").select("id, name").order("name");
      if (error) {
        throw error;
      }
      return data ?? [];
    },
  });

  const eventQuery = useQuery({
    queryKey: ["admin-event", id],
    enabled: isEdit,
    queryFn: async () => {
      const { data: ev, error: e1 } = await supabase.from("events").select("*").eq("id", id!).single();
      if (e1) {
        throw e1;
      }
      const { data: tickets, error: e2 } = await supabase
        .from("event_tickets")
        .select("*")
        .eq("event_id", id!)
        .order("created_at", { ascending: true });
      if (e2) {
        throw e2;
      }
      return { event: ev, tickets: tickets ?? [] };
    },
  });

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema) as Resolver<EventFormValues>,
    defaultValues: {
      title: "",
      image_url: "",
      date_display: "",
      category: EVENT_CATEGORIES[0],
      is_trending: false,
      location: EVENT_LOCATIONS[0],
      type: "event",
      description: "",
      organizer_id: "",
      status: "draft",
      tickets: [{ name: "Vé thường", price: 0, remaining: 0, benefitsText: "" }],
    },
    values: eventQuery.data
      ? {
          title: eventQuery.data.event.title,
          image_url: eventQuery.data.event.image_url ?? "",
          date_display: eventQuery.data.event.date_display,
          category: eventQuery.data.event.category as EventFormValues["category"],
          is_trending: eventQuery.data.event.is_trending,
          location: eventQuery.data.event.location as EventFormValues["location"],
          type: eventQuery.data.event.type as EventFormValues["type"],
          description: eventQuery.data.event.description,
          organizer_id: eventQuery.data.event.organizer_id,
          status: eventQuery.data.event.status as EventFormValues["status"],
          tickets: eventQuery.data.tickets.map((t) => ({
            id: t.id,
            name: t.name,
            price: Number(t.price),
            remaining: t.remaining,
            benefitsText: benefitsToText(t.benefits),
          })),
        }
      : undefined,
  });

  const { fields, append, remove } = useFieldArray({ control: form.control, name: "tickets" });

  const createOrganizerMutation = useMutation({
    mutationFn: async (name: string) => {
      const row = { id: newId("org"), name: name.trim() };
      const { error } = await supabase.from("organizers").insert(row);
      if (error) {
        throw error;
      }
      return row;
    },
    onSuccess: async (row) => {
      await queryClient.invalidateQueries({ queryKey: ["organizers"] });
      form.setValue("organizer_id", row.id);
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (values: EventFormValues) => {
      const payload = {
        title: values.title.trim(),
        image_url: values.image_url?.trim() || null,
        date_display: values.date_display.trim(),
        category: values.category,
        is_trending: values.is_trending,
        location: values.location,
        type: values.type,
        description: values.description.trim(),
        organizer_id: values.organizer_id,
        status: values.status,
      };

      if (!isEdit) {
        const eventId = newId("evt");
        const { error: e1 } = await supabase.from("events").insert({ id: eventId, ...payload });
        if (e1) {
          throw e1;
        }
        for (const t of values.tickets) {
          const tid = newId("tkt");
          const { error: e2 } = await supabase.from("event_tickets").insert({
            id: tid,
            event_id: eventId,
            name: t.name.trim(),
            price: t.price,
            remaining: t.remaining,
            benefits: parseBenefits(t.benefitsText) as never,
          });
          if (e2) {
            throw e2;
          }
        }
        return eventId;
      }

      const { error: e1 } = await supabase.from("events").update(payload).eq("id", id!);
      if (e1) {
        throw e1;
      }

      const formIds = new Set(values.tickets.map((t) => t.id).filter(Boolean) as string[]);
      const { data: existing, error: exErr } = await supabase
        .from("event_tickets")
        .select("id")
        .eq("event_id", id!);
      if (exErr) {
        throw exErr;
      }
      for (const row of existing ?? []) {
        if (!formIds.has(row.id)) {
          const { error: delErr } = await supabase.from("event_tickets").delete().eq("id", row.id);
          if (delErr) {
            throw new Error(
              `Không xoá được vé ${row.id}: có thể đã có đơn hàng. ${delErr.message}`,
            );
          }
        }
      }

      for (const t of values.tickets) {
        const benefits = parseBenefits(t.benefitsText);
        if (t.id) {
          const { error: up } = await supabase
            .from("event_tickets")
            .update({
              name: t.name.trim(),
              price: t.price,
              remaining: t.remaining,
              benefits: benefits as never,
            })
            .eq("id", t.id);
          if (up) {
            throw up;
          }
        } else {
          const { error: ins } = await supabase.from("event_tickets").insert({
            id: newId("tkt"),
            event_id: id!,
            name: t.name.trim(),
            price: t.price,
            remaining: t.remaining,
            benefits: benefits as never,
          });
          if (ins) {
            throw ins;
          }
        }
      }
      return id!;
    },
    onSuccess: (eventId) => {
      void queryClient.invalidateQueries({ queryKey: ["admin-events"] });
      void queryClient.invalidateQueries({ queryKey: ["admin-event", eventId] });
      navigate("/events");
    },
  });

  if (isEdit && eventQuery.isLoading) {
    return <p className="text-zinc-400">Đang tải sự kiện...</p>;
  }

  if (isEdit && eventQuery.error) {
    return (
      <div className="text-red-400">
        {eventQuery.error instanceof Error ? eventQuery.error.message : "Không tải được sự kiện."}
      </div>
    );
  }

  const orgs = organizersQuery.data ?? [];

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">{isEdit ? "Sửa sự kiện" : "Thêm sự kiện"}</h1>
          <p className="mt-1 text-sm text-zinc-400">Thông tin sự kiện và các loại vé.</p>
        </div>
        <Link to="/events" className="text-sm font-semibold text-zinc-400 hover:text-white">
          ← Danh sách
        </Link>
      </div>

      <form
        className="mt-8 space-y-6"
        onSubmit={form.handleSubmit((v) => saveMutation.mutate(v))}
      >
        <section className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
          <h2 className="text-lg font-bold text-white">Chung</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Tiêu đề">
              <input
                className="input-admin"
                {...form.register("title")}
              />
              {form.formState.errors.title ? (
                <p className="mt-1 text-xs text-red-400">{form.formState.errors.title.message}</p>
              ) : null}
            </Field>
            <Field label="Ngày hiển thị">
              <input className="input-admin" {...form.register("date_display")} placeholder="VD: 15.03.2026" />
            </Field>
            <Field label="Ảnh (URL)">
              <input className="input-admin" {...form.register("image_url")} placeholder="https://..." />
            </Field>
            <Field label="Ban tổ chức">
              <div className="flex gap-2">
                <select className="input-admin flex-1" {...form.register("organizer_id")}>
                  <option value="">— Chọn —</option>
                  {orgs.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.name}
                    </option>
                  ))}
                </select>
              </div>
              <AddOrganizer
                disabled={createOrganizerMutation.isPending}
                onCreate={(name) => createOrganizerMutation.mutate(name)}
              />
            </Field>
            <Field label="Danh mục">
              <select className="input-admin" {...form.register("category")}>
                {EVENT_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Địa điểm">
              <select className="input-admin" {...form.register("location")}>
                {EVENT_LOCATIONS.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Loại">
              <select className="input-admin" {...form.register("type")}>
                {EVENT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Trạng thái">
              <select className="input-admin" {...form.register("status")}>
                {EVENT_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </Field>
            <div className="flex items-center gap-2 sm:col-span-2">
              <input type="checkbox" id="trending" {...form.register("is_trending")} />
              <label htmlFor="trending" className="text-sm text-zinc-300">
                Xu hướng (hiển thị nổi bật)
              </label>
            </div>
            <Field label="Mô tả" className="sm:col-span-2">
              <textarea className="input-admin min-h-[120px]" {...form.register("description")} />
            </Field>
          </div>
        </section>

        <section className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-lg font-bold text-white">Loại vé</h2>
            <button
              type="button"
              className="rounded-lg border border-zinc-600 px-3 py-1.5 text-sm font-semibold text-zinc-200 hover:bg-zinc-800"
              onClick={() => append({ name: "", price: 0, remaining: 0, benefitsText: "" })}
            >
              + Thêm loại vé
            </button>
          </div>
          <div className="mt-4 space-y-4">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-4"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold uppercase text-zinc-500">Vé {index + 1}</span>
                  {fields.length > 1 ? (
                    <button
                      type="button"
                      className="text-xs text-red-400 hover:underline"
                      onClick={() => remove(index)}
                    >
                      Bỏ
                    </button>
                  ) : null}
                </div>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <Field label="Tên loại vé">
                    <input className="input-admin" {...form.register(`tickets.${index}.name`)} />
                  </Field>
                  <Field label="Giá (VND)">
                    <input
                      type="number"
                      step="1"
                      className="input-admin"
                      {...form.register(`tickets.${index}.price`, { valueAsNumber: true })}
                    />
                  </Field>
                  <Field label="Còn lại">
                    <input
                      type="number"
                      className="input-admin"
                      {...form.register(`tickets.${index}.remaining`, { valueAsNumber: true })}
                    />
                  </Field>
                  <Field label="Quyền lợi (mỗi dòng một mục)" className="sm:col-span-2">
                    <textarea
                      className="input-admin min-h-[72px]"
                      {...form.register(`tickets.${index}.benefitsText`)}
                    />
                  </Field>
                </div>
                <input type="hidden" {...form.register(`tickets.${index}.id`)} />
              </div>
            ))}
          </div>
          {form.formState.errors.tickets ? (
            <p className="mt-2 text-sm text-red-400">{form.formState.errors.tickets.message}</p>
          ) : null}
        </section>

        {saveMutation.error ? (
          <p className="text-sm text-red-400">
            {saveMutation.error instanceof Error ? saveMutation.error.message : String(saveMutation.error)}
          </p>
        ) : null}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saveMutation.isPending}
            className="rounded-lg bg-red-600 px-6 py-2.5 font-bold text-white hover:bg-red-700 disabled:opacity-60"
          >
            {saveMutation.isPending ? "Đang lưu..." : "Lưu"}
          </button>
          <Link
            to="/events"
            className="rounded-lg border border-zinc-600 px-6 py-2.5 font-semibold text-zinc-300 hover:bg-zinc-800"
          >
            Huỷ
          </Link>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="block text-xs font-semibold uppercase text-zinc-500">{label}</label>
      <div className="mt-1">{children}</div>
    </div>
  );
}

function AddOrganizer({
  onCreate,
  disabled,
}: {
  onCreate: (name: string) => void;
  disabled: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  return (
    <div className="mt-2">
      {!open ? (
        <button
          type="button"
          className="text-xs font-semibold text-red-400 hover:underline"
          onClick={() => setOpen(true)}
        >
          + Tạo ban tổ chức mới
        </button>
      ) : (
        <div className="flex flex-wrap gap-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tên ban tổ chức"
            className="input-admin min-w-[200px] flex-1 rounded-lg border border-zinc-700 bg-zinc-950 px-2 py-1.5 text-sm text-white"
          />
          <button
            type="button"
            disabled={disabled || !name.trim()}
            className="rounded bg-zinc-700 px-3 py-1.5 text-sm font-semibold text-white hover:bg-zinc-600 disabled:opacity-50"
            onClick={() => {
              onCreate(name);
              setName("");
              setOpen(false);
            }}
          >
            Tạo
          </button>
          <button type="button" className="text-sm text-zinc-500" onClick={() => setOpen(false)}>
            Đóng
          </button>
        </div>
      )}
    </div>
  );
}
