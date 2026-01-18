'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Tag, Clock, Store } from 'lucide-react';

export default function MyVouchersPage() {
  const router = useRouter();
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    axios.get('http://localhost:3000/rewards/my-vouchers', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      setVouchers(res.data);
      setLoading(false);
    })
    .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-500">Memuat Voucher...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
           <div className="flex items-center gap-4">
             <Link href="/rewards" className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-100 text-gray-600">
               <ArrowLeft className="w-5 h-5" />
             </Link>
             <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
               <Tag className="w-6 h-6 text-blue-600" /> Voucher Saya
             </h1>
           </div>
        </div>

        {/* List Voucher */}
        <div className="space-y-4">
          {vouchers.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
               <p className="text-gray-500 mb-4">Kamu belum punya voucher.</p>
               <Link href="/rewards" className="text-blue-600 font-bold hover:underline">Tukar poin sekarang &rarr;</Link>
            </div>
          ) : (
            vouchers.map((v: any) => (
              <div key={v.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col md:flex-row relative">
                {/* Bagian Kiri (Gambar) */}
                <div className="w-full md:w-32 bg-gray-100 flex items-center justify-center p-4 border-r border-dashed border-gray-200 relative">
                   <div className="w-4 h-4 bg-gray-50 rounded-full absolute -top-2 -right-2"></div>
                   <div className="w-4 h-4 bg-gray-50 rounded-full absolute -bottom-2 -right-2"></div>
                   <Store className="w-8 h-8 text-gray-400" />
                </div>

                {/* Bagian Tengah (Info) */}
                <div className="flex-1 p-5">
                   <div className="text-xs text-blue-600 font-bold uppercase mb-1">{v.reward.partnerName}</div>
                   <h3 className="text-lg font-bold text-gray-900">{v.reward.name}</h3>
                   <p className="text-sm text-gray-500 mt-1">{v.reward.description}</p>
                   <div className="flex items-center gap-2 mt-4 text-xs text-gray-400">
                      <Clock className="w-3 h-3" /> Ditukar pada {new Date(v.redeemedAt).toLocaleDateString()}
                   </div>
                </div>

                {/* Bagian Kanan (Kode Unik) */}
                <div className="bg-blue-50 p-5 flex flex-col items-center justify-center border-l border-dashed border-blue-200 min-w-[180px]">
                   <span className="text-xs text-blue-400 font-bold uppercase mb-2">Kode Voucher</span>
                   <div className="bg-white px-4 py-2 rounded border border-blue-200 font-mono font-bold text-lg tracking-widest text-blue-800 select-all">
                      {v.uniqueCode}
                   </div>
                   <span className="text-[10px] text-blue-400 mt-2">Tunjukkan ke kasir</span>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}