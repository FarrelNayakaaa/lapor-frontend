'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Trophy, ShoppingBag, Loader2, Tag, AlertCircle } from 'lucide-react';

export default function RewardsPage() {
  const router = useRouter();
  const [rewards, setRewards] = useState([]);
  const [userPoints, setUserPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [redeemLoading, setRedeemLoading] = useState<string | null>(null); // ID reward yg lagi diproses

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        
        // 1. Ambil Data Reward
        const resRewards = await axios.get('http://localhost:3000/rewards');
        setRewards(resRewards.data);

        // 2. Ambil Poin User Terkini
        const resUser = await axios.get('http://localhost:3000/users/profile', { headers });
        setUserPoints(resUser.data.points);
        
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  const handleRedeem = async (rewardId: string, rewardName: string, cost: number) => {
    if (userPoints < cost) {
      alert('Poin kamu belum cukup. Yuk lapor lagi!');
      return;
    }

    if (!confirm(`Tukar ${cost} poin untuk "${rewardName}"?`)) return;

    setRedeemLoading(rewardId);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:3000/rewards/${rewardId}/redeem`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('Berhasil menukar poin! Cek voucher di menu "Voucher Saya".');
      router.push('/my-vouchers'); // Redirect ke dompet voucher
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal menukar reward.');
    } finally {
      setRedeemLoading(null);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-500">Memuat Toko...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Navigation */}
        <div className="flex items-center justify-between mb-8">
           <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-medium">
             <ArrowLeft className="w-4 h-4" /> Kembali
           </Link>
           <Link href="/my-vouchers" className="flex items-center gap-2 text-blue-600 font-bold hover:underline bg-blue-50 px-4 py-2 rounded-full">
             <Tag className="w-4 h-4" /> Voucher Saya
           </Link>
        </div>

        {/* Poin Banner */}
        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-8 rounded-2xl shadow-lg mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <ShoppingBag className="w-8 h-8" /> Reward Market
            </h1>
            <p className="text-yellow-100 mt-1">Tukarkan poin hasil kontribusimu dengan hadiah menarik.</p>
          </div>
          <div className="bg-white/20 backdrop-blur-md px-6 py-3 rounded-xl text-center min-w-[150px]">
            <div className="text-xs uppercase tracking-wider font-bold text-yellow-100 mb-1">Saldo Poin</div>
            <div className="text-4xl font-extrabold">{userPoints}</div>
          </div>
        </div>

        {/* Grid Rewards */}
        <div className="grid md:grid-cols-3 gap-6">
          {rewards.map((reward: any) => (
            <div key={reward.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition flex flex-col">
              {/* Gambar Dummy (Bisa diganti real image nanti) */}
              <div className="h-40 bg-gray-100 relative">
                 <img src={reward.imageUrl || "https://via.placeholder.com/400x200?text=Reward"} className="w-full h-full object-cover" />
                 <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
                   Stok: {reward.stock}
                 </div>
              </div>
              
              <div className="p-5 flex-1 flex flex-col">
                <div className="text-xs font-bold text-blue-600 mb-1 uppercase tracking-wide">{reward.partnerName}</div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{reward.name}</h3>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-1">{reward.description}</p>
                
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
                  <div className="font-bold text-orange-600 flex items-center gap-1">
                    <Trophy className="w-4 h-4" /> {reward.pointsRequired} Poin
                  </div>
                  
                  <button 
                    onClick={() => handleRedeem(reward.id, reward.name, reward.pointsRequired)}
                    disabled={userPoints < reward.pointsRequired || reward.stock <= 0 || redeemLoading === reward.id}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition flex items-center gap-2 ${
                      userPoints >= reward.pointsRequired && reward.stock > 0
                        ? 'bg-blue-600 text-white hover:bg-blue-700 hover:-translate-y-0.5 shadow-md' 
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {redeemLoading === reward.id ? <Loader2 className="w-4 h-4 animate-spin"/> : 'Tukar'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}