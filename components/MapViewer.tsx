'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // Import CSS Wajib Leaflet
import L from 'leaflet';
import { useEffect, useState } from 'react';

// FIX ICON BUG: Icon default Leaflet sering hilang di Next.js
// Kita paksa pakai icon dari CDN
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Definisi Tipe Data Laporan (Sesuaikan dengan backend)
interface Report {
  id: string;
  title: string;
  description: string;
  photoUrl: string;
  location: {
    coordinates: [number, number]; // [Longitude, Latitude]
  };
}

export default function MapViewer({ reports }: { reports: Report[] }) {
  // Koordinat Default (Jakarta)
  const defaultCenter: [number, number] = [-6.2088, 106.8456]; 

  return (
    <MapContainer 
      center={defaultCenter} 
      zoom={12} 
      style={{ height: '100%', width: '100%', borderRadius: '12px' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {reports.map((report) => (
        <Marker 
          key={report.id}
          // Hati-hati! PostGIS simpan [Long, Lat], Leaflet minta [Lat, Long]. DIBALIK!
          position={[report.location.coordinates[1], report.location.coordinates[0]]}
          icon={icon}
        >
          <Popup>
            <div className="min-w-[200px]">
              <h3 className="font-bold text-lg">{report.title}</h3>
              <p className="text-sm text-gray-600 mb-2">{report.description}</p>
              {report.photoUrl && (
                <img 
                  src={report.photoUrl} 
                  alt="Bukti" 
                  className="w-full h-32 object-cover rounded-md" 
                />
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}