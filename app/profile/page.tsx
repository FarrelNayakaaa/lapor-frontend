'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Trophy, Clock, LogOut, ArrowLeft, Plus, MapPin, CheckCircle } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Cek Token
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    // 2. Ambil Data Profil dari Backend
    axios.get('http://localhost:3000/users/profile', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      setUser(res.data);
      setLoading(false);
    })
    .catch(() => {
      // Kalau token expired, logout otomatis
      localStorage.removeItem('token');
      router.push('/login');
    });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_role');
    router.push('/login');
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-500 bg-gray-50"><div className="animate-spin mr-2">⏳</div> Memuat Profil...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Navigasi */}
        <div className="flex items-center justify-between mb-6">
           <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-medium transition">
             <ArrowLeft className="w-4 h-4" /> Kembali ke Home
           </Link>
           <button onClick={handleLogout} className="flex items-center gap-2 text-red-500 hover:text-red-700 font-medium text-sm transition bg-white px-3 py-1.5 rounded-lg border border-red-100 hover:bg-red-50">
             <LogOut className="w-4 h-4" /> Logout
           </button>
        </div>

        {/* GAMIFICATION CARD: Poin & Identitas */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-xl shadow-blue-900/20 mb-10 relative overflow-hidden transform hover:scale-[1.01] transition duration-300">
           {/* Hiasan Background */}
           <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
           
           <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex items-center gap-5">
                 <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/10 shadow-inner">
                    <User className="w-10 h-10 text-white" />
                 </div>
                 <div className="text-center md:text-left">
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{user.email.split('@')[0]}</h1>
                    <p className="text-blue-100 text-sm opacity-90">{user.email}</p>
                    <div className="inline-flex items-center gap-1 mt-2 px-3 py-1 bg-blue-800/50 rounded-full text-xs font-semibold border border-blue-500/30">
                      <CheckCircle className="w-3 h-3" /> Akun Terverifikasi
                    </div>
                 </div>
              </div>

              {/* Kotak Poin */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center min-w-[240px] shadow-lg">
                 <div className="flex items-center justify-center gap-2 text-yellow-300 mb-2">
                    <Trophy className="w-5 h-5" />
                    <span className="font-bold uppercase tracking-wider text-xs text-blue-100">LaporApp Points</span>
                 </div>
                 <div className="text-5xl font-extrabold text-white tracking-tighter drop-shadow-sm">{user.points}</div>
                 <div className="text-xs text-blue-200 mt-2 font-medium">Bisa ditukar voucher segera! 🎁</div>
              </div>
           </div>
        </div>

        {/* Section Riwayat */}
        <div className="flex items-center justify-between mb-6">
           <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
             <Clock className="w-5 h-5 text-gray-500" /> Riwayat Laporan
           </h2>
           <Link href="/lapor" className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 transition flex items-center gap-2">
             <Plus className="w-4 h-4" /> Buat Laporan Baru
           </Link>
        </div>

        <div className="space-y-4">
           {user.reports && user.reports.length > 0 ? (
             user.reports.map((report: any) => (
               <div key={report.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-5 hover:border-blue-200 hover:shadow-md transition duration-300 group">
                  {/* Foto Laporan */}
                  <div className="w-full md:w-40 h-40 md:h-32 rounded-xl overflow-hidden relative flex-shrink-0">
                    <img src={report.photoUrl} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" alt="bukti" />
                  </div>
                  
                  {/* Detail Laporan */}
                  <div className="flex-1 flex flex-col justify-between py-1">
                     <div>
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-gray-800 text-lg leading-tight group-hover:text-blue-600 transition">{report.title}</h3>
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
                             report.status === 'done' ? 'bg-green-50 text-green-700 border-green-200' :
                             report.status === 'in_progress' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                             'bg-gray-50 text-gray-600 border-gray-200'
                          }`}>
                             {report.status.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed">{report.description}</p>
                     </div>
                     
                     <div className="flex items-center gap-4 mt-4 pt-3 border-t border-gray-50">
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Clock className="w-3 h-3"/> {new Date(report.createdAt).toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'})}
                        </span>
                        
                        {/* Indikator Poin Didapat */}
                        {report.status === 'done' && (
                           <span className="text-xs font-bold text-green-600 flex items-center gap-1 bg-green-50 px-2 py-0.5 rounded-md">
                             <Trophy className="w-3 h-3"/> +50 Poin
                           </span>
                        )}
                         {report.status === 'in_progress' && (
                           <span className="text-xs font-bold text-yellow-600 flex items-center gap-1 bg-yellow-50 px-2 py-0.5 rounded-md">
                             <Trophy className="w-3 h-3"/> +10 Poin
                           </span>
                        )}
                     </div>
                  </div>
               </div>
             ))
           ) : (
             <div className="text-center py-16 bg-white rounded-3xl border-2 border-dashed border-gray-200">
                <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-gray-900 font-bold mb-1">Belum ada aktivitas</h3>
                <p className="text-gray-500 text-sm mb-6">Yuk bantu kota kita jadi lebih baik!</p>
                <Link href="/lapor" className="text-blue-600 font-bold hover:text-blue-700 hover:underline">Mulai Lapor Sekarang &rarr;</Link>
             </div>
           )}
        </div>

      </div>
    </div>
  );
}