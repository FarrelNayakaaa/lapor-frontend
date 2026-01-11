import Link from 'next/link';
import { Camera, Map, ShieldCheck, ArrowRight, Activity, BarChart3, Users, CheckCircle2 } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-blue-100 selection:text-blue-900">
      
      {/* Navbar: Sticky & Glassmorphism */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-blue-700">
            <div className="bg-blue-600 p-1.5 rounded-lg text-white">
              <Activity className="w-5 h-5" />
            </div>
            <span>LaporApp.</span>
          </div>
          <div className="flex gap-4">
            <Link 
              href="/admin" 
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all"
            >
              Login Dinas
            </Link>
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
            Smart City System v1.0
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6 tracking-tight leading-tight">
            Ubah Kota Kita, <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Satu Laporan Sekaligus.
            </span>
          </h1>
          
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 mb-10 leading-relaxed">
            Laporkan jalan rusak, lampu mati, atau sampah menumpuk dalam hitungan detik. 
            Didukung teknologi Geo-Spatial untuk penanganan akurat.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <Link 
              href="/lapor" 
              className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 hover:shadow-lg hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
            >
              <Camera className="w-5 h-5" />
              Lapor Sekarang
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
              <div className="text-3xl font-bold text-gray-900">98%</div>
              <div className="text-sm text-gray-500">Terselesaikan</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">24h</div>
              <div className="text-sm text-gray-500">Respon Cepat</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">15+</div>
              <div className="text-sm text-gray-500">Kecamatan</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Kenapa LaporApp?</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Sistem kami didesain untuk transparansi dan kecepatan, menghubungkan warga langsung dengan petugas lapangan.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition duration-300">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6 text-blue-600">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Verifikasi AI</h3>
              <p className="text-gray-500 leading-relaxed">
                Setiap foto divalidasi otomatis untuk memastikan laporan asli dan bukan spam.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition duration-300">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-6 text-indigo-600">
                <Map className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Real-time GIS</h3>
              <p className="text-gray-500 leading-relaxed">
                Visualisasi titik masalah dalam peta interaktif memudahkan pemantauan wilayah.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition duration-300">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-6 text-green-600">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Kolaborasi Warga</h3>
              <p className="text-gray-500 leading-relaxed">
                Membangun kota yang lebih baik dimulai dari partisipasi aktif masyarakatnya.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-white py-12 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} LaporApp Project. Engineering for a better city.</p>
        </div>
      </footer>
    </div>
  );
}