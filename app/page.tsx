'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Camera, Map, CheckCircle2, Activity, Users, ArrowRight, User, LogOut, LayoutDashboard, ShoppingBag } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('');

  // CEK STATUS LOGIN SAAT LOAD PAGE
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('user_role');
    
    if (token) {
      setIsLoggedIn(true);
      setUserRole(role || 'user');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_role');
    setIsLoggedIn(false);
    setUserRole('');
    router.refresh(); 
  };

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-blue-100 selection:text-blue-900">
      
      {/* Navbar: Sticky & Smart */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-blue-700">
            <div className="bg-blue-600 p-1.5 rounded-lg text-white">
              <Activity className="w-5 h-5" />
            </div>
            <span>LaporApp.</span>
          </div>
          
          <div className="flex gap-3 items-center">
            {/* LOGIC TOMBOL NAVBAR */}
            {!isLoggedIn ? (
              // KONDISI 1: BELUM LOGIN
              <>
                <Link 
                  href="/login" 
                  className="px-4 py-2 text-sm font-bold text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-full transition-all"
                >
                  Masuk
                </Link>
                <Link 
                  href="/register" 
                  className="px-4 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-full transition-all shadow-md hover:shadow-lg"
                >
                  Daftar
                </Link>
              </>
            ) : (
              // KONDISI 2: SUDAH LOGIN
              <>
                {userRole === 'admin' ? (
                  // MENU KHUSUS ADMIN
                  <Link 
                    href="/admin" 
                    className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-full transition-all"
                  >
                    <LayoutDashboard className="w-4 h-4" /> Dashboard Dinas
                  </Link>
                ) : (
                  // MENU KHUSUS USER (WARGA)
                  <>
                    {/* Tombol Tukar Poin (Reward) */}
                    <Link 
                      href="/rewards" 
                      className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-full transition-all"
                    >
                      <ShoppingBag className="w-4 h-4" /> Tukar Poin
                    </Link>

                    {/* Tombol Profil */}
                    <Link 
                      href="/profile" 
                      className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-full transition-all"
                    >
                      <User className="w-4 h-4" /> Profil
                    </Link>
                  </>
                )}
                
                {/* Tombol Logout Kecil */}
                <button 
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                  title="Keluar"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Gradient Blob */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-20 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-semibold uppercase tracking-wider mb-6">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
            Smart City Ecosystem v2.0
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6 tracking-tight leading-tight">
            Ubah Kota Kita, <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Dapatkan Hadiahnya.
            </span>
          </h1>
          
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 mb-10 leading-relaxed">
            Laporkan kerusakan infrastruktur, kumpulkan poin dari setiap laporan valid, 
            dan tukarkan dengan voucher menarik dari partner kami.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <Link 
              href={isLoggedIn ? "/lapor" : "/login"} // Kalau belum login, arahkan ke login dulu
              className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 hover:shadow-lg hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
            >
              <Camera className="w-5 h-5" />
              {isLoggedIn ? 'Lapor Sekarang' : 'Mulai Lapor'}
            </Link>
            <Link 
              href="/peta" 
              className="w-full sm:w-auto px-8 py-4 bg-white text-gray-700 font-bold rounded-xl hover:bg-gray-50 border border-gray-200 hover:border-gray-300 transition-all flex items-center justify-center gap-2"
            >
              <Map className="w-5 h-5" />
              Pantau Peta
            </Link>
          </div>

          {/* Mini Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-gray-100 pt-8">
            <div>
              <div className="text-3xl font-bold text-gray-900">1.2k+</div>
              <div className="text-sm text-gray-500">Laporan Masuk</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">50k+</div>
              <div className="text-sm text-gray-500">Poin Dibagikan</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">24h</div>
              <div className="text-sm text-gray-500">Respon Cepat</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">15+</div>
              <div className="text-sm text-gray-500">Partner Reward</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Kenapa LaporApp?</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Kami menghubungkan partisipasi warga dengan keuntungan nyata.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition duration-300">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6 text-blue-600">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Lapor & Validasi</h3>
              <p className="text-gray-500 leading-relaxed">
                Foto kerusakan, kirim lokasi. AI dan Admin akan memvalidasi laporanmu dalam hitungan jam.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition duration-300">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mb-6 text-yellow-600">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Kumpulkan Poin</h3>
              <p className="text-gray-500 leading-relaxed">
                Setiap laporan valid memberimu poin. +10 saat diproses, +50 saat masalah selesai diperbaiki.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition duration-300">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-6 text-green-600">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Tukar Reward</h3>
              <p className="text-gray-500 leading-relaxed">
                Gunakan poinmu untuk voucher parkir, diskon kopi, atau belanja di merchant partner.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-white py-12 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} LaporApp Project. Engineering for a better city.</p>
        </div>
      </footer>
    </div>
  );
}