'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await axios.post('http://localhost:3000/auth/login', {
        email,
        password
      });

      // 1. Simpan Token & Role
      localStorage.setItem('token', res.data.access_token);
      localStorage.setItem('user_role', res.data.user.role);

      // 2. CEK ROLE & REDIRECT SESUAI HAK AKSES
      if (res.data.user.role === 'admin') {
        router.push('/admin'); // Admin ke Dashboard Dinas
      } else {
        router.push('/profile'); // Warga ke Profil Poin
      }
      
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError('Email atau Password salah!');
      } else {
        setError('Gagal terhubung ke server.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      
      <div className="mb-8 text-center">
         <Link href="/" className="inline-flex items-center text-gray-500 hover:text-blue-600 mb-6 transition text-sm font-medium">
            <ArrowLeft className="w-4 h-4 mr-1" /> Kembali ke Beranda
         </Link>
         <h1 className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-2">
           <div className="bg-blue-600 p-1.5 rounded-lg text-white">
             <Lock className="w-5 h-5" />
           </div>
           Masuk Akun
         </h1>
         <p className="text-gray-500 text-sm mt-2">Silakan login untuk melanjutkan.</p>
      </div>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        <form onSubmit={handleLogin} className="space-y-5">
          
          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg flex items-center gap-2 border border-red-100">
              <AlertCircle className="w-4 h-4" /> {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="email" 
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                placeholder="email@anda.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="password" 
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg hover:shadow-blue-500/30 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Masuk Sekarang <ArrowRight className="w-5 h-5" /></>}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          Belum punya akun? <Link href="/register" className="text-blue-600 font-bold hover:underline">Daftar disini</Link>
        </div>
      </div>
    </div>
  );
}