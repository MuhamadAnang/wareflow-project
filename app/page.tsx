"use client";

import Link from "next/link";
import { Button } from "./_components/ui/button";
import { ArrowRight, BarChart3, CheckCircle2, Package, Shield, Star, TrendingUp, Truck, Undo2, Users, Warehouse, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import Logo from "./_components/logo";

export default function Page() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const features = [
    {
      icon: Warehouse,
      title: "Manajemen Gudang Lengkap",
      description: "Kelola stok, penerimaan barang, dan pengiriman dalam satu platform terintegrasi.",
    },
    {
      icon: TrendingUp,
      title: "Prioritas Distribusi Cerdas",
      description: "Sistem pendukung keputusan dengan metode MCDM-TOPSIS untuk menentukan prioritas pengiriman.",
    },
    {
      icon: BarChart3,
      title: "Dashboard Real-Time",
      description: "Pantau stok, order, dan performa distribusi secara langsung dengan visualisasi data.",
    },
    {
      icon: Shield,
      title: "Akurasi Data Terjamin",
      description: "Minimalkan kesalahan pencatatan dengan sistem digital yang terstruktur dan aman.",
    },
    {
      icon: Truck,
      title: "Manajemen Distribusi",
      description: "Kelola pengiriman barang dengan status yang terpantau dari gudang ke pelanggan.",
    },
    {
      icon: Undo2,
      title: "Manajemen Retur",
      description: "Tangani retur dari customer maupun ke supplier dengan sistem yang terintegrasi.",
    },
  ];

  const benefits = [
    "Mengurangi kesalahan pencatatan stok hingga 90%",
    "Mempercepat proses penentuan prioritas pengiriman",
    "Meningkatkan kepuasan pelanggan dengan distribusi tepat waktu",
    "Data stok real-time yang dapat diakses kapan saja",
    "Keputusan distribusi lebih objektif dan terukur",
    "Laporan lengkap untuk evaluasi operasional",
  ];

  const stats = [
    { label: "Mitra Distributor", value: "1+", suffix: "", delay: 0 },
    { label: "Buku Terkelola", value: "1000+", suffix: "", delay: 200 },
    { label: "Customer Aktif", value: "20+", suffix: "", delay: 400 },
    { label: "Akurasi Prioritas", value: "95", suffix: "%", delay: 600 },
  ];
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-indigo-50">
      {/* Navbar */}
      <nav className={`fixed top-0 z-50 w-full transition-all duration-300 ${scrolled ? "bg-white shadow-md py-3" : "bg-transparent py-5"
        }`}>
        <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Logo className="h-15 w-45" />
          </div>
          <div className="flex gap-3">
            <Link href="/waitlist">
              <Button variant="outline" size="sm" className="hidden md:inline-flex">
                Daftar Waitlist
              </Button>
            </Link>
            <Link href="/sign-in">
              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                Masuk
              </Button>
            </Link>
          </div>
        </div>
      </nav>
      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16 md:py-24">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left Content */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Zap className="w-4 h-4" />
              <span>Warehouse Management System + Decision Support</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6">
              Kelola Gudang & Distribusi Buku dengan{" "}
              <span className="bg-gradient-to-r from-green-600 to-indigo-600 bg-clip-text text-transparent">
                Keputusan Cerdas
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-2xl mx-auto lg:mx-0">
              BookFlow adalah platform manajemen gudang terintegrasi dengan sistem pendukung keputusan
              berbasis MCDM-TOPSIS untuk menentukan prioritas distribusi buku secara objektif dan terukur.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/sign-in">
                <Button size="lg" className="bg-green-600 hover:bg-green-700 text-lg px-8">
                  Mulai Sekarang
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Illustration */}
          <div className="flex-1">
            <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/50">
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-green-500 to-indigo-500 rounded-xl p-4 text-white">
                  <div className="flex items-center justify-between mb-3">
                    <Truck className="w-6 h-6" />
                    <span className="text-xs bg-white/20 px-2 py-1 rounded">Prioritas Tinggi</span>
                  </div>
                  <p className="text-sm font-semibold">Pengiriman ke Jakarta</p>
                  <p className="text-xs opacity-90">ETA: 2 jam lagi • Prioritas: Urgent</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <Package className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-sm">Stock: 1,250 unit</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full w-3/4"></div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-500">Sistem Rekomendasi</p>
                      <p className="font-semibold text-sm">Prioritas: Customer Platinum</p>
                    </div>
                    <TrendingUp className="w-5 h-5 text-indigo-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Lebih dari Sekadar Warehouse Management
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              BookFlow menggabungkan manajemen gudang dengan sistem pendukung keputusan
              untuk prioritas pengiriman yang lebih cerdas
            </p>
          </div>
        </div>
        
        {/* Stats Section */}
        <section className="py-16 bg-white border-y border-gray-100">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, idx) => (
                <div key={idx} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-green-600">
                    {stat.value}{stat.suffix}
                  </div>
                  <div className="text-gray-600 mt-2">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl md:text-4xl font-bold">
                Fitur Unggulan BookFlow
              </h2>
              <p className="text-gray-600 mt-4">
                Solusi lengkap untuk mengelola gudang dan distribusi buku Anda
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
                >
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl md:text-4xl font-bold">
                Bagaimana BookFlow Bekerja?
              </h2>
              <p className="text-gray-600 mt-4">
                Proses sederhana untuk meningkatkan efisiensi distribusi buku
              </p>
            </div>
            <div className="grid md:grid-cols-4 gap-6">
              {[
                {
                  step: "01",
                  title: "Input Data",
                  description: "Input data stok buku, pesanan customer, dan informasi retur ke dalam sistem.",
                },
                {
                  step: "02",
                  title: "Analisis Kriteria",
                  description: "Sistem menganalisis 4 kriteria : stok, urgensi, status kontrak, dan retur.",
                },
                {
                  step: "03",
                  title: "Perhitungan MCDM",
                  description: "Metode TOPSIS memproses data dengan bobot AHP untuk menentukan prioritas.",
                },
                {
                  step: "04",
                  title: "Prioritas Distribusi",
                  description: "Sistem menampilkan urutan prioritas pengiriman yang objektif dan terukur.",
                },
              ].map((item, idx) => (
                <div key={idx} className="text-center">
                  <div className="w-16 h-16 bg-green-600 text-white text-2xl font-bold rounded-2xl flex items-center justify-center mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-500 text-sm">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="mt-24 bg-gradient-to-r from-green-600 to-indigo-600 rounded-2xl p-8 md:p-12 text-center text-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold">
                  Tingkatkan Efisiensi Distribusi Buku
                </h2>
                <p className="text-green-100 mt-4 text-lg">
                  Dengan sistem pendukung keputusan yang objektif dan terukur
                </p>
                <div className="mt-8 space-y-3">
                  {benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-wwhite flex-shrink-0" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="hidden lg:block">
                <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                    <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                    <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                    <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                    <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                  </div>
                  <p className="text-lg italic">
                    BookFlow membantu kami mengelola stok lebih akurat dan menentukan
                    prioritas pengiriman dengan lebih objektif. Operasional gudang jadi lebih efisien!
                  </p>
                  <div className="mt-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold">Mitra Distributor Buku</p>
                      <p className="text-sm text-green-200">Pengguna BookFlow</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold">
              Siap Mengelola Distribusi Buku Lebih Baik?
            </h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Bergabunglah dengan BookFlow dan rasakan kemudahan mengelola gudang
              dengan sistem pendukung keputusan yang cerdas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Link href="/sign-in">
                <Button size="lg" className="bg-green-600 hover:bg-green-700 text-base px-8">
                  Masuk / Daftar
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-gray-400 py-12 rounded-2xl">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
            <Logo className="h-15 w-45 " />
                </div>
                <p className="text-sm">
                  Warehouse Management System terintegrasi dengan MCDM untuk menentukan prioritas distribusi buku.
                </p>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-4">Fitur</h4>
                <ul className="space-y-2 text-sm">
                  <li>Manajemen Stok</li>
                  <li>Prioritas Distribusi</li>
                  <li>Manajemen Retur</li>
                  <li>Dashboard Analitik</li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-4">Teknologi</h4>
                <ul className="space-y-2 text-sm">
                  <li>MCDM-TOPSIS</li>
                  <li>Analytic Hierarchy Process</li>
                  <li>Real-time Dashboard</li>
                  <li>Data Terintegrasi</li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-4">Kontak</h4>
                <ul className="space-y-2 text-sm">
                  <li>Email: support@bookflow.com</li>
                  <li>Web: www.bookflow.com</li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
              &copy; {new Date().getFullYear()} BookFlow. All rights reserved.
            </div>
          </div>
        </footer>
      </main>
    </div>

  );
}