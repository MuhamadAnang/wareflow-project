# BookFlow

BookFlow adalah aplikasi web untuk mengelola gudang dan distribusi buku. Proyek
ini menggabungkan pencatatan master data, alur pembelian, penerimaan buku,
pesanan customer, pengiriman, retur, dashboard operasional, dan rekomendasi
prioritas pengiriman berbasis MCDM-TOPSIS.

## Tech stack

Proyek ini dibangun dengan stack berikut:

- **Next.js 16** dengan App Router.
- **React 19** untuk antarmuka pengguna.
- **TypeScript** untuk type safety.
- **TailwindCSS 4** dan **shadcn/ui** untuk styling dan komponen UI.
- **Clerk** untuk autentikasi.
- **TanStack Query** untuk server state di client.
- **TanStack Form** dan **Zod** untuk form dan validasi.
- **Drizzle ORM** dengan PostgreSQL untuk akses database.
- **Jest** untuk unit test.

## Prasyarat

Sebelum menjalankan proyek, siapkan kebutuhan berikut:

- **Node.js 22**. Versi proyek tersedia di `.nvmrc`.
- **pnpm 10**. Proyek ini memakai `pnpm` sebagai package manager.
- **PostgreSQL** untuk database aplikasi.
- **Akun Clerk** untuk konfigurasi autentikasi.
- **Docker** secara opsional untuk menjalankan build container.

## Menjalankan proyek

Ikuti langkah berikut untuk menjalankan BookFlow secara lokal.

### 1. Install dependency

Jalankan perintah berikut dari root proyek:

```bash
pnpm install
```

### 2. Siapkan environment variable

Buat file `.env` atau `.env.local` dari `.env.example`, lalu isi nilai yang
dibutuhkan:

```bash
DATABASE_URL=postgresql://postgres:root@localhost:5432/bookflow
NODE_ENV=development
NEXT_BASE_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL=/dashboard
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
CLERK_JWT_KEY=
NEXT_PUBLIC_NODE_TZ=Asia/Jakarta
TZ=Asia/Jakarta
```

> **Note:** Aplikasi memvalidasi environment variable saat runtime. Nilai
> Clerk dan `DATABASE_URL` harus tersedia agar aplikasi bisa berjalan.

### 3. Siapkan database

Pastikan database PostgreSQL sudah tersedia, lalu jalankan migrasi Drizzle:

```bash
pnpm drizzle:migrate
```

Jika ingin mengisi data awal, jalankan seed:

```bash
pnpm db:seed
```

### 4. Jalankan development server

Jalankan server lokal:

```bash
pnpm dev
```

Aplikasi tersedia di `http://localhost:3000`.

## Struktur proyek

Proyek mengikuti struktur Next.js App Router dan memisahkan UI, route handler,
schema validasi, serta logic server berdasarkan domain.

```text
.
|-- app
|   |-- (authenticated)      # Halaman yang membutuhkan login
|   |-- (public)             # Landing page dan halaman sign-in
|   |-- api                  # Route handler API
|   |-- _components          # Komponen UI dan komponen shared
|   |-- _contexts            # React context
|   `-- _hooks               # Hook reusable
|-- common                   # Konfigurasi, konstanta, dan exception
|-- drizzle                  # Schema database dan migration
|-- lib                      # Helper database, request, query, dan utilitas
|-- middleware               # Middleware autentikasi
|-- public                   # Asset statis, font, gambar, dan upload buku
|-- schemas                  # Schema validasi request dan form
|-- scripts                  # Script pendukung seperti seed database
|-- server                   # Controller, service, dan repository per domain
|-- tests                    # Test setup dan test file
`-- types                    # Type global dan tipe response
```

## Fitur utama

BookFlow menyediakan fitur berikut:

- **Dashboard operasional** untuk melihat total buku, stok, customer, supplier,
  pending order, nilai order, pengiriman bulan ini, retur bulan ini, stok
  menipis, customer teratas, dan preview prioritas pengiriman.
- **Master data** untuk customer, percetakan, supplier, mata pelajaran, dan
  daftar buku.
- **Manajemen buku** dengan kode buku, mata pelajaran, jenjang, kelas,
  kurikulum, semester, gambar, harga, tahun produksi, percetakan, stok saat
  ini, riwayat pergerakan stok, dan penyesuaian stok.
- **Belanja buku** untuk membuat purchase order dari supplier.
- **Buku masuk gudang** untuk mencatat penerimaan berdasarkan purchase order
  dan memperbarui stok.
- **Pesanan customer** untuk mencatat order, item buku, harga, deadline, dan
  status order.
- **Pengiriman** untuk mencatat barang keluar berdasarkan pesanan customer.
- **Retur customer dan supplier** untuk mencatat buku yang dikembalikan dari
  customer atau dikembalikan ke supplier.
- **Prioritas pengiriman** menggunakan metode TOPSIS dengan kriteria pemenuhan
  stok, urgensi deadline, status kontrak customer, dan riwayat retur.
- **Autentikasi** menggunakan Clerk dengan halaman publik dan area aplikasi
  yang dilindungi.

## Domain data

Schema database utama mencakup entitas berikut:

- `customers`, `suppliers`, `percetakans`, dan `subjects`.
- `books` dan `book_prices`.
- `purchase_orders` dan `purchase_order_items`.
- `goods_receipts` dan `goods_receipt_items`.
- `customer_orders` dan `customer_order_items`.
- `goods_out` dan `goods_out_items`.
- `stock_movements`.
- `customer_returns` dan `supplier_returns`.
- `customer_payments`.

## API dan server logic

Route API berada di `app/api`, sedangkan logic bisnis berada di folder
`server`. Pola umumnya memisahkan controller, service, dan repository per
domain, seperti `books`, `customers`, `purchase-orders`, `goods-receipts`,
`goods-out`, `customer-orders`, `returns`, dan `mcdm`.

## Script yang tersedia

Gunakan script berikut dengan `pnpm`:

- `pnpm dev`: Menjalankan development server.
- `pnpm build`: Membuat production build.
- `pnpm start`: Menjalankan production server.
- `pnpm lint`: Menjalankan ESLint.
- `pnpm format`: Memformat file TypeScript, CSS, Markdown, dan JSON.
- `pnpm check:types`: Memeriksa TypeScript tanpa emit.
- `pnpm test`: Menjalankan Jest.
- `pnpm drizzle:generate`: Membuat migration dari perubahan schema.
- `pnpm drizzle:migrate`: Menjalankan migration.
- `pnpm drizzle:push`: Push schema langsung ke database.
- `pnpm drizzle:studio`: Membuka Drizzle Studio.
- `pnpm db:seed`: Menjalankan seed database dari `scripts/seed.ts`.

## Deployment

Proyek menyediakan `Dockerfile` berbasis Node.js 22 dan pnpm. Build container
menjalankan `pnpm build`, menyalin output `.next`, lalu menjalankan aplikasi
dengan `pnpm start` pada port `3000`.

Pastikan environment variable production, koneksi PostgreSQL, dan kredensial
Clerk sudah tersedia sebelum menjalankan container.
