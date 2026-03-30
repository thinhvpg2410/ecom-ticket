# Admin dashboard (Vite + React + Supabase)

Ứng dụng quản trị: thống kê doanh thu / vé, CRUD sự kiện + loại vé, quản lý người dùng và vai trò.

## Yêu cầu

- Node 20+
- Dự án Supabase đã áp dụng migrations (RLS: `20260331_admin_rls.sql`; biểu đồ & bảng kê: `20260401_admin_dashboard_charts.sql` — các RPC `admin_revenue_daily_series`, `admin_revenue_breakdown`, `admin_revenue_by_provider`, `admin_orders_ledger`).

## Cấu hình

1. Copy `.env.example` thành `.env` trong thư mục `admin/`.
2. Điền `VITE_SUPABASE_URL` và `VITE_SUPABASE_ANON_KEY` (Supabase → Project Settings → API).

## Quyền admin

Trong bảng `app_users`, đặt `role = 'admin'` cho user trùng `auth.users.id` (cột `id` dạng text).

```sql
update public.app_users
set role = 'admin'
where id = '<auth_user_uuid>';
```

## Chạy local

```bash
cd admin
npm install
npm run dev
```

Mở `http://localhost:5173`, đăng nhập bằng tài khoản Supabase Auth đã có dòng `app_users` và `role = 'admin'`.

## Build production

```bash
npm run build
npm run preview
```

Triển khai thư mục `dist/` lên CDN / static hosting; cấu hình biến môi trường build-time cho Vite (cùng tên `VITE_*`).

## Triển khai Vercel

1. **Import repo** trên [Vercel](https://vercel.com) → chọn repository chứa project.
2. **Root Directory**: đặt `admin` (nếu repo là monorepo, thư mục gốc không phải `admin`).
3. **Build & Output**: để mặc định (Vercel nhận diện Vite) — `npm run build`, output `dist`. File `vercel.json` có `rewrites` để React Router hoạt động (F5 trên `/events`, `/login`, …).
4. **Environment Variables** (Settings → Environment Variables), thêm cho **Production** (và Preview nếu cần):
   - `VITE_SUPABASE_URL` — URL project Supabase
   - `VITE_SUPABASE_ANON_KEY` — anon public key  
   Sau khi lưu, **Redeploy** để build nhận biến.
5. **Supabase Auth**: vào Supabase → Authentication → URL Configuration:
   - **Site URL**: `https://<domain-vercel-của-bạn>`
   - **Redirect URLs**: thêm `https://<domain-vercel-của-bạn>/**` (và URL preview nếu dùng PR preview).

CLI (tùy chọn), từ máy local:

```bash
cd admin
npm i -g vercel
vercel
```

Lần đầu chọn link project, chỉnh Root Directory = `admin` nếu deploy từ repo gốc.

## Ghi chú

- Tạo user Auth mới (email/password) không có trong UI admin: dùng Supabase Dashboard hoặc Edge Function với service role, rồi insert `app_users` tương ứng.
- Xoá sự kiện có thể thất bại nếu đã có đơn hàng tham chiếu (`order_items`).
- Xoá loại vé có thể thất bại nếu đã bán.
