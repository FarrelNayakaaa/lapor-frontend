'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ArrowLeft, Map as MapIcon, RefreshCw } from 'lucide-react';

const MapViewer = dynamic(() => import('../../components/MapViewer'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 rounded-xl text-gray-400">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
      <p>Memuat Peta Digital...</p>
    </div>
  )
});

export default function PetaPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = () => {
    setLoading(true);
    axios.get('http://localhost:3000/reports')
      .then((res) => {
        setReports(res.data);
      })
      .catch((err) => console.error("Gagal ambil data:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <div className="h-screen w-full bg-gray-50 flex flex-col overflow-hidden">
      
      {/* Header Floating / Fixed Top */}
      <div className="bg-white shadow-sm border-b px-4 py-3 md:px-8 md:py-4 z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/" className="p-2 hover:bg-gray-100 rounded-full transition text-gray-600">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <MapIcon className="w-5 h-5 text-blue-600" />
              Peta Persebaran
            </h1>
            <p className="text-xs text-gray-500 hidden md:block">Pantau titik laporan kerusakan di seluruh kota.</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1.5 rounded-full">
            {reports.length} Laporan
          </span>
          <button 
            onClick={fetchReports} 
            className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition" 
            title="Refresh Data"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative p-2 md:p-4">
        <div className="w-full h-full bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden relative z-0">
          <MapViewer reports={reports} />
        </div>
      </div>
    </div>
  );
}