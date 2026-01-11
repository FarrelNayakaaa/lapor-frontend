'use client'; 

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Camera, MapPin, Upload, Loader2, ArrowLeft, AlertCircle, FileText, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LaporPage() {
  const router = useRouter();
  
  // State Input
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  
  // State Lokasi
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const [locationStatus, setLocationStatus] = useState('Mencari lokasi...');

  // State Loading
  const [isLoading, setIsLoading] = useState(false);

  // 1. Cari Lokasi saat halaman dibuka
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationStatus('Browser tidak support GPS');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setLocationStatus('Lokasi ditemukan ✅');
      },
      (error) => {
        setLocationStatus('Gagal deteksi lokasi. Pastikan GPS aktif.');
        console.error(error);
      }
    );
  }, []);

  // 2. Handle pilih gambar
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      if (preview) URL.revokeObjectURL(preview);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  // 3. Handle Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    
    if (!file || !location) {
      alert('Mohon lengkapi foto dan tunggu lokasi terdeteksi.');
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('latitude', location.lat.toString());
      formData.append('longitude', location.lng.toString());
      formData.append('file', file);

      const response = await axios.post('http://localhost:3000/reports', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      alert('Laporan Berhasil Terkirim! Terima kasih atas kontribusi Anda.');
      router.push('/peta'); 
    } catch (error) {
      console.error(error);
      alert('Gagal mengirim laporan. Pastikan server backend menyala.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-8 flex items-center justify-center">
      
      {/* Container Utama: Lebar Maksimal diperbesar (max-w-5xl) dan Layout Flex Responsive */}
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header Biru (Full Width) */}
        <div className="bg-blue-600 p-6 md:p-8 text-white flex justify-between items-center">
          <div>
            <Link href="/" className="inline-flex items-center text-blue-100 hover:text-white mb-2 transition text-sm font-medium">
              <ArrowLeft className="w-4 h-4 mr-1" /> Kembali ke Beranda
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Formulir Pengaduan</h1>
            <p className="text-blue-100 text-sm md:text-base mt-1 opacity-90">Sampaikan keluhan infrastruktur dengan data akurat.</p>
          </div>
          {/* Icon Header (Hanya muncul di Desktop) */}
          <div className="hidden md:block bg-blue-500/30 p-3 rounded-xl">
             <FileText className="w-8 h-8 text-blue-50" />
          </div>
        </div>

        {/* Form Body: Menggunakan Flex Row di Desktop, Flex Col di Mobile */}
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row h-full">
          
          {/* KOLOM KIRI: Input Teks (Lebih Lebar di Desktop) */}
          <div className="w-full md:w-3/5 p-6 md:p-10 space-y-6">
            
            {/* Input Judul */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                Judul Laporan <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition font-medium"
                placeholder="Contoh: Jalan Berlubang di Jl. Sudirman"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* Input Deskripsi */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                Detail Kejadian <span className="text-red-500">*</span>
              </label>
              <textarea 
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition h-48 md:h-64 resize-none leading-relaxed"
                placeholder="Jelaskan kondisi kerusakan, patokan lokasi, dan urgensi perbaikan..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <p className="text-xs text-gray-400 mt-2 text-right">Minimal 10 karakter</p>
            </div>

          </div>

          {/* KOLOM KANAN: Visual & Actions (Background Abu-abu halus) */}
          <div className="w-full md:w-2/5 bg-gray-50 p-6 md:p-10 border-t md:border-t-0 md:border-l border-gray-100 flex flex-col justify-between">
            
            <div className="space-y-6">
              {/* Status Lokasi */}
              <div>
                 <label className="block text-sm font-bold text-gray-700 mb-2">Lokasi GPS</label>
                 <div className={`flex items-center gap-3 p-4 rounded-xl text-sm font-medium border ${location ? 'bg-white text-green-700 border-green-200 shadow-sm' : 'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>
                  <MapPin className={`w-5 h-5 flex-shrink-0 ${!location && 'animate-bounce'}`} />
                  <span>{locationStatus}</span>
                </div>
              </div>

              {/* Input Gambar */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Bukti Foto</label>
                <div className="relative border-2 border-dashed border-gray-300 rounded-xl hover:bg-white hover:border-blue-400 transition cursor-pointer group bg-white md:bg-gray-50">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  
                  {preview ? (
                    <div className="relative h-56 md:h-64 w-full p-2">
                      <img src={preview} alt="Preview" className="w-full h-full object-cover rounded-lg shadow-sm" />
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition rounded-lg text-white font-medium z-20 m-2">
                          <ImageIcon className="w-6 h-6 mr-2" /> Ganti Foto
                      </div>
                    </div>
                  ) : (
                    <div className="h-56 md:h-64 flex flex-col items-center justify-center text-gray-400 group-hover:text-blue-500 transition px-4 text-center">
                      <div className="p-4 bg-blue-50 rounded-full mb-3 group-hover:scale-110 transition">
                        <Camera className="w-8 h-8 text-blue-500" />
                      </div>
                      <span className="text-sm font-bold text-gray-600">Ambil / Upload Foto</span>
                      <span className="text-xs mt-1 text-gray-400">Pastikan foto jelas & terang</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Tombol Submit (Di desktop dia akan nempel di bawah karena justify-between) */}
            <div className="mt-8 pt-6 border-t border-gray-200 md:border-none md:pt-0">
              <button 
                type="submit" 
                disabled={isLoading || !location}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-blue-500/30 hover:-translate-y-1 transition-all flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-y-0"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Sedang Mengirim...
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" /> Kirim Laporan
                  </>
                )}
              </button>
              <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-1">
                <AlertCircle className="w-3 h-3" /> Data Anda aman & terlindungi.
              </p>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
}