'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Import Router
import { ArrowLeft, CheckCircle, Clock, XCircle, MapPin, ExternalLink, LogOut, ShieldAlert } from 'lucide-react';

interface Report {
  id: string;
  title: string;
  description: string;
  status: string;
  photoUrl: string;
  createdAt: string;
  location: {
    coordinates: [number, number]; 
  };
}

export default function AdminPage() {
  const router = useRouter();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false); 

  // --- LOGIC KEAMANAN HALAMAN ADMIN ---
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('user_role'); // Ambil role user

    // 1. Cek Apakah Token Ada?
    if (!token) {
      router.push('/login');
      return;
    }

    // 2. Cek Apakah Role-nya Admin?
    if (role !== 'admin') {
      alert('Akses Ditolak! Halaman ini khusus petugas dinas.');
      router.push('/profile'); // Tendang user biasa ke profil mereka
      return;
    }

    // Jika lolos semua cek, izinkan masuk
    setIsAuthenticated(true);
    fetchReports();
  }, []);
  // ------------------------------------

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:3000/reports');
      const sorted = res.data.sort((a: any, b: any) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setReports(sorted);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    if(!confirm(`Ubah status jadi ${newStatus}?`)) return;

    try {
      const token = localStorage.getItem('token'); // Ambil token untuk izin update

      await axios.patch(
        `http://localhost:3000/reports/${id}/status`, 
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}` // Sertakan token di header
          }
        }
      );
      
      fetchReports(); 
    } catch (err: any) {
      if (err.response?.status === 401) {
        alert('Sesi habis. Silakan login ulang.');
        handleLogout();
      } else {
        alert('Gagal update status. Pastikan Anda adalah Admin.');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_role');
    router.push('/login');
  };

  const getStatusBadge = (status: string) => {
    const baseClass = "px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1 w-fit";
    switch (status) {
      case 'pending': return <span className={`${baseClass} bg-gray-100 text-gray-600 border-gray-200`}><Clock className="w-3 h-3"/> Menunggu</span>;
      case 'in_progress': return <span className={`${baseClass} bg-yellow-50 text-yellow-700 border-yellow-200`}><Clock className="w-3 h-3 animate-pulse"/> Diproses</span>;
      case 'done': return <span className={`${baseClass} bg-green-50 text-green-700 border-green-200`}><CheckCircle className="w-3 h-3"/> Selesai</span>;
      default: return <span className={`${baseClass} bg-red-50 text-red-700 border-red-200`}><XCircle className="w-3 h-3"/> Ditolak</span>;
    }
  };

  // Jangan render konten kalau belum lolos auth (biar gak kedip)
  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Dashboard */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
             <Link href="/" className="p-2 hover:bg-white rounded-full transition shadow-sm bg-white border border-gray-200">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
             </Link>
             <div>
               <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
                 <ShieldAlert className="w-6 h-6 text-blue-600"/> Dashboard Dinas
               </h1>
               <p className="text-gray-500 text-sm">Mode Administrator</p>
             </div>
          </div>
          
          <div className="flex items-center gap-3">
             <button 
                onClick={fetchReports} 
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition shadow-sm"
              >
                Refresh Data
              </button>
             <button 
                onClick={handleLogout} 
                className="px-4 py-2 bg-red-50 border border-red-200 text-red-700 rounded-lg hover:bg-red-100 text-sm font-medium transition shadow-sm flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
          </div>
        </div>

        {/* Tabel Container */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wider border-b border-gray-200">
                <tr>
                  <th className="p-4 font-semibold">Foto</th>
                  <th className="p-4 font-semibold">Judul & Waktu</th>
                  <th className="p-4 font-semibold">Lokasi</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {reports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50 transition">
                    <td className="p-4">
                      {report.photoUrl ? (
                        <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200 shadow-sm relative group">
                          <img src={report.photoUrl} className="w-full h-full object-cover transition group-hover:scale-110" alt="bukti" />
                          <a href={report.photoUrl} target="_blank" className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                      ) : (
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-xs text-gray-400">No Img</div>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col max-w-xs whitespace-normal">
                        <span className="font-bold text-gray-800 text-sm mb-1">{report.title}</span>
                        <span className="text-xs text-gray-500 line-clamp-2">{report.description}</span>
                        <span className="text-[10px] text-gray-400 mt-2 bg-gray-100 w-fit px-2 py-0.5 rounded">
                          {new Date(report.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      {report.location ? (
                         <a 
                           // Saya perbaiki URL maps-nya menggunakan format standar Google Maps yang lebih aman
                           href={`https://www.google.com/maps?q=${report.location.coordinates[1]},${report.location.coordinates[0]}`} 
                           target="_blank" 
                           rel="noreferrer"
                           className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline bg-blue-50 px-3 py-1.5 rounded-lg w-fit transition"
                         >
                           <MapPin className="w-3.5 h-3.5" />
                           Buka Peta
                         </a>
                      ) : (
                         <span className="text-gray-400 text-xs">No Loc</span>
                      )}
                    </td>
                    <td className="p-4">
                      {getStatusBadge(report.status)}
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center gap-2">
                        {report.status !== 'in_progress' && report.status !== 'done' && (
                          <button 
                            onClick={() => handleUpdateStatus(report.id, 'in_progress')}
                            className="p-2 bg-yellow-50 text-yellow-600 border border-yellow-200 rounded-lg hover:bg-yellow-100 hover:border-yellow-300 transition shadow-sm" title="Proses"
                          >
                            <Clock className="w-4 h-4" />
                          </button>
                        )}
                        
                        {report.status !== 'done' && (
                          <button 
                            onClick={() => handleUpdateStatus(report.id, 'done')}
                            className="p-2 bg-green-50 text-green-600 border border-green-200 rounded-lg hover:bg-green-100 hover:border-green-300 transition shadow-sm" title="Selesai"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}

                        <button 
                          onClick={() => handleUpdateStatus(report.id, 'rejected')}
                          className="p-2 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 hover:border-red-300 transition shadow-sm" title="Tolak"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {reports.length === 0 && !loading && (
            <div className="p-12 text-center flex flex-col items-center justify-center text-gray-500">
              <p>Belum ada laporan masuk.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}