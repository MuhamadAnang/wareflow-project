import "dotenv/config";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { eq } from "drizzle-orm";

import * as schema from "../drizzle/schema";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

async function seed() {
  try {
    const TODAY = new Date("2026-05-23");

    // ================= 1. MASTER DATA =================
    const [subjPKn] = await db
      .insert(schema.subjectTable)
      .values({ name: "Pendidikan Kewarganegaraan" })
      .returning();
    const [subjBIndo] = await db
      .insert(schema.subjectTable)
      .values({ name: "Bahasa Indonesia" })
      .returning();
    const [subjMTK] = await db
      .insert(schema.subjectTable)
      .values({ name: "Matematika" })
      .returning();
    const [subjFiqih] = await db.insert(schema.subjectTable).values({ name: "Fikih" }).returning();
    const [subjSejarah] = await db
      .insert(schema.subjectTable)
      .values({ name: "Sejarah" })
      .returning();

    const [percetakan] = await db
      .insert(schema.percetakanTable)
      .values({
        name: "Percetakan Hayati",
        phone: "0341-123456",
        address: "Jl. Industri No. 10, Malang",
      })
      .returning();

    const [supplier] = await db
      .insert(schema.supplierTable)
      .values({
        name: "Supplier Buku Hayati",
        phone: "0341-999888",
        address: "Jl. Gudang Buku No. 5, Malang",
      })
      .returning();

    // ================= 2. CUSTOMERS =================
    const customers = await db
      .insert(schema.customerTable)
      .values([
        {
          name: "Pak Angga",
          phone: "081234567890",
          address: "Jl. Raya Srengat No. 15, Blitar",
          institution: "SMA N Srengat",
          status: "CONTRACT",
        },
        {
          name: "Pak Mansur Arif",
          phone: "081234567891",
          address: "Jl. Munjungan No. 8, Trenggalek",
          institution: "MA Nurul Ulum",
          status: "CONTRACT",
        },
        {
          name: "Pak Marta",
          phone: "081234567892",
          address: "Jl. Munjungan No. 12, Trenggalek",
          institution: "MTsN Munjungan",
          status: "CONTRACT",
        },
        {
          name: "Bu Siti",
          phone: "081234567893",
          address: "Jl. Ponggok No. 5, Blitar",
          institution: "SMA N Ponggok",
          status: "MOU",
        },
        {
          name: "Pak Bahrun Nashor",
          phone: "081234567894",
          address: "Jl. Boyolangu No. 20, Tulungagung",
          institution: "SMA N Boyolangu",
          status: "CONTRACT",
        },
        {
          name: "Pak Roziqin",
          phone: "081234567895",
          address: "Jl. Udanawu No. 7, Blitar",
          institution: "SMK N Udanawu",
          status: "NON-CONTRACT",
        },
        {
          name: "Bu Diyah",
          phone: "081234567896",
          address: "Jl. Darul Hikmah No. 3, Tulungagung",
          institution: "MA Darul Hikmah",
          status: "MOU",
        },
        {
          name: "Bu Hima",
          phone: "081234567897",
          address: "Jl. Wonodadi No. 18, Blitar",
          institution: "SMK Darul Huda",
          status: "NON-CONTRACT",
        },
        {
          name: "Bu Wiwik",
          phone: "081234567898",
          address: "Jl. Campurdarat No. 22, Tulungagung",
          institution: "SMA N Campurdarat",
          status: "MOU",
        },
        {
          name: "Pak Hendro",
          phone: "081234567899",
          address: "Jl. Trenggalek No. 45, Trenggalek",
          institution: "MAN Trenggalek",
          status: "CONTRACT",
        },
      ])
      .returning();

    const getCustId = (inst: string) => customers.find((c) => c.institution === inst)?.id!;

    // ================= 3. BOOKS (Awal stok 0, akan diupdate setelah Goods Receipt) =================
    const books = await db
      .insert(schema.bookTable)
      .values([
        {
          code: "PKW-SMA10-MER-GAN-001",
          name: "PKn SMA Kelas 10 Kurikulum Merdeka",
          subjectId: subjPKn.id,
          grade: 10,
          level: "SMA",
          curriculum: "KURIKULUM_MERDEKA",
          semester: "GANJIL",
          percetakanId: percetakan.id,
          currentStock: 0,
          productionYear: 2025,
        },
        {
          code: "FIQ-MASMP-MER-GAN-002",
          name: "Fikih MA/SMP Kelas 7 Kurikulum Merdeka",
          subjectId: subjFiqih.id,
          grade: 7,
          level: "SMA",
          curriculum: "KURIKULUM_MERDEKA",
          semester: "GANJIL",
          percetakanId: percetakan.id,
          currentStock: 0,
          productionYear: 2025,
        },
        {
          code: "FIQ-MTS-MER-GAN-003",
          name: "Fikih MTs Kelas 8 Kurikulum Merdeka",
          subjectId: subjFiqih.id,
          grade: 8,
          level: "SMP",
          curriculum: "KURIKULUM_MERDEKA",
          semester: "GANJIL",
          percetakanId: percetakan.id,
          currentStock: 0,
          productionYear: 2025,
        },
        {
          code: "BHS-SMA11-MER-GAN-004",
          name: "Bahasa Indonesia SMA Kelas 11 K. Merdeka",
          subjectId: subjBIndo.id,
          grade: 11,
          level: "SMA",
          curriculum: "KURIKULUM_MERDEKA",
          semester: "GANJIL",
          percetakanId: percetakan.id,
          currentStock: 0,
          productionYear: 2025,
        },
        {
          code: "MTK-SMA12-MER-GAN-005",
          name: "Matematika SMA Kelas 12 K. Merdeka",
          subjectId: subjMTK.id,
          grade: 12,
          level: "SMA",
          curriculum: "KURIKULUM_MERDEKA",
          semester: "GANJIL",
          percetakanId: percetakan.id,
          currentStock: 0,
          productionYear: 2025,
        },
        {
          code: "SEJ-SMK11-MER-GAN-006",
          name: "Sejarah SMK Kelas 11 K. Merdeka",
          subjectId: subjSejarah.id,
          grade: 11,
          level: "SMK",
          curriculum: "KURIKULUM_MERDEKA",
          semester: "GANJIL",
          percetakanId: percetakan.id,
          currentStock: 0,
          productionYear: 2025,
        },
        {
          code: "PKW-MA10-MER-GAN-007",
          name: "PKn MA Kelas 10 Kurikulum Merdeka",
          subjectId: subjPKn.id,
          grade: 10,
          level: "SMA",
          curriculum: "KURIKULUM_MERDEKA",
          semester: "GANJIL",
          percetakanId: percetakan.id,
          currentStock: 0,
          productionYear: 2025,
        },
        {
          code: "BHS-SMK10-MER-GAN-008",
          name: "Bahasa Indonesia SMK Kelas 10 K. Merdeka",
          subjectId: subjBIndo.id,
          grade: 10,
          level: "SMK",
          curriculum: "KURIKULUM_MERDEKA",
          semester: "GANJIL",
          percetakanId: percetakan.id,
          currentStock: 0,
          productionYear: 2025,
        },
        {
          code: "MTK-SMA10-MER-GAN-009",
          name: "Matematika SMA Kelas 10 K. Merdeka",
          subjectId: subjMTK.id,
          grade: 10,
          level: "SMA",
          curriculum: "KURIKULUM_MERDEKA",
          semester: "GANJIL",
          percetakanId: percetakan.id,
          currentStock: 0,
          productionYear: 2025,
        },
        {
          code: "FIQ-MAN11-MER-GAN-010",
          name: "Fikih MAN Kelas 11 Kurikulum Merdeka",
          subjectId: subjFiqih.id,
          grade: 11,
          level: "SMA",
          curriculum: "KURIKULUM_MERDEKA",
          semester: "GANJIL",
          percetakanId: percetakan.id,
          currentStock: 0,
          productionYear: 2025,
        },
      ])
      .returning();

    const getBookId = (code: string) => books.find((b) => b.code === code)?.id!;
    const bookCodes = [
      "PKW-SMA10-MER-GAN-001",
      "FIQ-MASMP-MER-GAN-002",
      "FIQ-MTS-MER-GAN-003",
      "BHS-SMA11-MER-GAN-004",
      "MTK-SMA12-MER-GAN-005",
      "SEJ-SMK11-MER-GAN-006",
      "PKW-MA10-MER-GAN-007",
      "BHS-SMK10-MER-GAN-008",
      "MTK-SMA10-MER-GAN-009",
      "FIQ-MAN11-MER-GAN-010",
    ];

    // ================= 4. PURCHASE ORDERS & GOODS RECEIPTS (Logika Stok Masuk) =================
    // Simulasi pembelian buku ke supplier tanggal 15 Jan 2025
    const pos = await db
      .insert(schema.purchaseOrderTable)
      .values(
        bookCodes.map(() => ({
          supplierId: supplier.id,
          orderDate: "2025-01-15",
          note: "Pengadaan Awal Semester Ganjil 2025",
        })),
      )
      .returning();

    // Simulasi barang diterima gudang tanggal 20 Jan 2025
    const receipts = await db
      .insert(schema.goodsReceiptTable)
      .values(
        pos.map((po) => ({
          purchaseOrderId: po.id,
          receivedDate: "2025-01-20",
          note: "Barang diterima lengkap",
        })),
      )
      .returning();

    // Update stok buku ke jumlah yang dibutuhkan untuk skenario
    // Jumlah stok = (Test Order Qty) + (Historical Order Qty) + (Buffer) agar realistis
    const stockTargets = [1500, 350, 450, 300, 2000, 1800, 1600, 600, 400, 900];
    for (let i = 0; i < 10; i++) {
      await db
        .update(schema.bookTable)
        .set({ currentStock: stockTargets[i] })
        .where(eq(schema.bookTable.code, bookCodes[i]));
    }

    // ================= 5. HISTORICAL ORDERS & GOODS OUT (Logika Pengiriman Lama) =================
    // Order lama status SHIPPED (Jan 2025)
    const histOrders = await db
      .insert(schema.customerOrderTable)
      .values([
        {
          customerId: getCustId("SMA N Srengat"),
          orderDate: "2025-01-10",
          deadline: "2025-02-01",
          status: "SHIPPED",
          note: "Pesanan Semester Ganjil 2025",
        },
        {
          customerId: getCustId("MA Nurul Ulum"),
          orderDate: "2025-01-12",
          deadline: "2025-02-10",
          status: "SHIPPED",
          note: "Pesanan Semester Ganjil 2025",
        },
        {
          customerId: getCustId("MTsN Munjungan"),
          orderDate: "2025-01-12",
          deadline: "2025-02-10",
          status: "SHIPPED",
          note: "Pesanan Semester Ganjil 2025",
        },
        {
          customerId: getCustId("SMA N Ponggok"),
          orderDate: "2025-01-15",
          deadline: "2025-02-15",
          status: "SHIPPED",
          note: "Pesanan Semester Ganjil 2025",
        },
        {
          customerId: getCustId("SMA N Boyolangu"),
          orderDate: "2025-01-20",
          deadline: "2025-02-20",
          status: "SHIPPED",
          note: "Pesanan Semester Ganjil 2025",
        },
        {
          customerId: getCustId("SMK N Udanawu"),
          orderDate: "2025-01-22",
          deadline: "2025-02-22",
          status: "SHIPPED",
          note: "Pesanan Semester Ganjil 2025",
        },
        {
          customerId: getCustId("MA Darul Hikmah"),
          orderDate: "2025-01-18",
          deadline: "2025-02-18",
          status: "SHIPPED",
          note: "Pesanan Semester Ganjil 2025",
        },
        {
          customerId: getCustId("SMK Darul Huda"),
          orderDate: "2025-01-25",
          deadline: "2025-02-25",
          status: "SHIPPED",
          note: "Pesanan Semester Ganjil 2025",
        },
        {
          customerId: getCustId("SMA N Campurdarat"),
          orderDate: "2025-01-05",
          deadline: "2025-02-05",
          status: "SHIPPED",
          note: "Pesanan Semester Ganjil 2025",
        },
        {
          customerId: getCustId("MAN Trenggalek"),
          orderDate: "2025-01-28",
          deadline: "2025-02-28",
          status: "SHIPPED",
          note: "Pesanan Semester Ganjil 2025",
        },
      ])
      .returning();

    const getHistOrderId = (idx: number) => histOrders[idx].id;
    const histOrderQty = [30000, 9600, 9500, 9700, 1000, 2400, 1600, 800, 400, 1000];

    await db.insert(schema.customerOrderItemTable).values(
      histOrderQty.map((qty, i) => ({
        customerOrderId: getHistOrderId(i),
        bookId: getBookId(bookCodes[i]),
        price: "45000",
        quantity: qty,
      })),
    );

    // Goods Out (Pengiriman Historis)
    await db
      .insert(schema.goodsOutTable)
      .values(
        histOrders.map((ho) => ({
          customerOrderId: ho.id,
          shippedDate: "2025-02-01",
          note: "Pengiriman selesai historis",
        })),
      );

    // ================= 6. HISTORICAL RETURNS (Logika Pengembalian Buku) =================
    // Return Rate = Total Retur / (Total Historis + Total Test) * 100
    const returns = await db
      .insert(schema.customerReturnTable)
      .values([
        {
          customerId: getCustId("SMA N Srengat"),
          returnDate: "2025-03-15",
          reason: "Retur kerusakan cetak semester ganjil",
        },
        {
          customerId: getCustId("MA Nurul Ulum"),
          returnDate: "2025-03-16",
          reason: "Retur minor semester ganjil",
        },
        {
          customerId: getCustId("MTsN Munjungan"),
          returnDate: "2025-03-16",
          reason: "Retur minor semester ganjil",
        },
        {
          customerId: getCustId("SMA N Ponggok"),
          returnDate: "2025-03-18",
          reason: "Retur semester ganjil",
        },
        {
          customerId: getCustId("SMA N Boyolangu"),
          returnDate: "2025-03-20",
          reason: "Retur semester ganjil",
        },
        {
          customerId: getCustId("SMK N Udanawu"),
          returnDate: "2025-03-22",
          reason: "Retur semester ganjil",
        },
        {
          customerId: getCustId("MA Darul Hikmah"),
          returnDate: "2025-03-19",
          reason: "Retur minor semester ganjil",
        },
        {
          customerId: getCustId("SMK Darul Huda"),
          returnDate: "2025-03-25",
          reason: "Retur semester ganjil",
        },
        {
          customerId: getCustId("SMA N Campurdarat"),
          returnDate: "2025-03-10",
          reason: "Retur tinggi semester ganjil",
        },
        {
          customerId: getCustId("MAN Trenggalek"),
          returnDate: "2025-03-30",
          reason: "Retur sangat rendah semester ganjil",
        },
      ])
      .returning();

    const getReturnId = (idx: number) => returns[idx].id;
    // Kuantitas retur dihitung agar persentase akhir sesuai target saat digabung dengan test order
    const returnQty = [1055, 100, 100, 300, 226, 420, 42, 40, 126, 10];

    await db.insert(schema.customerReturnItemTable).values(
      returnQty.map((qty, i) => ({
        customerReturnId: getReturnId(i),
        bookId: getBookId(bookCodes[i]),
        quantity: qty,
      })),
    );

    // ================= 7. TEST ORDERS (Skenario 1-10, Tanggal Hari Ini) =================
    // orderDate = 2026-05-23 (Hari Pengujian)
    // Deadline disesuaikan agar rumus Urgensi: 1/(remainingDays+1)*100 menghasilkan skor logis
    const testOrders = await db
      .insert(schema.customerOrderTable)
      .values([
        {
          customerId: getCustId("SMA N Srengat"),
          orderDate: TODAY.toISOString().split("T")[0],
          deadline: "2026-05-26",
          status: "CONFIRMED",
          note: "Skenario Uji 1 (H+3)",
        },
        {
          customerId: getCustId("MA Nurul Ulum"),
          orderDate: TODAY.toISOString().split("T")[0],
          deadline: "2026-06-05",
          status: "CONFIRMED",
          note: "Skenario Uji 2 (H+13)",
        },
        {
          customerId: getCustId("MTsN Munjungan"),
          orderDate: TODAY.toISOString().split("T")[0],
          deadline: "2026-06-05",
          status: "CONFIRMED",
          note: "Skenario Uji 3 (H+13)",
        },
        {
          customerId: getCustId("SMA N Ponggok"),
          orderDate: TODAY.toISOString().split("T")[0],
          deadline: "2026-06-12",
          status: "CONFIRMED",
          note: "Skenario Uji 4 (H+20)",
        },
        {
          customerId: getCustId("SMA N Boyolangu"),
          orderDate: TODAY.toISOString().split("T")[0],
          deadline: "2026-06-22",
          status: "CONFIRMED",
          note: "Skenario Uji 5 (H+30/capped)",
        },
        {
          customerId: getCustId("SMK N Udanawu"),
          orderDate: TODAY.toISOString().split("T")[0],
          deadline: "2026-06-22",
          status: "CONFIRMED",
          note: "Skenario Uji 6 (H+30/capped)",
        },
        {
          customerId: getCustId("MA Darul Hikmah"),
          orderDate: TODAY.toISOString().split("T")[0],
          deadline: "2026-06-06",
          status: "CONFIRMED",
          note: "Skenario Uji 7 (H+14)",
        },
        {
          customerId: getCustId("SMK Darul Huda"),
          orderDate: TODAY.toISOString().split("T")[0],
          deadline: "2026-05-30",
          status: "CONFIRMED",
          note: "Skenario Uji 8 (H+7)",
        },
        {
          customerId: getCustId("SMA N Campurdarat"),
          orderDate: TODAY.toISOString().split("T")[0],
          deadline: "2026-05-28",
          status: "CONFIRMED",
          note: "Skenario Uji 9 (H+5)",
        },
        {
          customerId: getCustId("MAN Trenggalek"),
          orderDate: TODAY.toISOString().split("T")[0],
          deadline: "2026-06-22",
          status: "CONFIRMED",
          note: "Skenario Uji 10 (H+30/capped)",
        },
      ])
      .returning();

    const getTestOrderId = (idx: number) => testOrders[idx].id;
    const testOrderQty = [1200, 400, 500, 300, 2000, 2400, 1600, 800, 400, 1000];

    await db.insert(schema.customerOrderItemTable).values(
      testOrderQty.map((qty, i) => ({
        customerOrderId: getTestOrderId(i),
        bookId: getBookId(bookCodes[i]),
        price: "45000",
        quantity: qty,
      })),
    );

    console.log("✅ Seed data MCDM berhasil diinjeksikan dengan alur logis!");
    console.log(
      "📦 Alur: Supplier → PO → Goods Receipt → Stok Update → Historis Order → Goods Out → Historis Return → Test Order",
    );
  } catch (error) {
    console.error("❌ Error saat seed:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seed();
