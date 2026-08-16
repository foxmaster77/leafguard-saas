'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const MapContainer = dynamic(() => import('react-leaflet').then(m => m.MapContainer), { ssr: false });
const TileLayer    = dynamic(() => import('react-leaflet').then(m => m.TileLayer),    { ssr: false });
const Marker       = dynamic(() => import('react-leaflet').then(m => m.Marker),       { ssr: false });
const Popup        = dynamic(() => import('react-leaflet').then(m => m.Popup),        { ssr: false });

const monitors = [
  { id: 1, name: 'Pilot Farm: USA (Illinois)', lat: 41.8781, lng: -87.6298 },
  { id: 2, name: 'Pilot Farm: India (MP)',      lat: 22.9734, lng: 78.6569 },
  { id: 3, name: 'Pilot Farm: Europe (France)', lat: 48.8566, lng:  2.3522 },
];

export default function MapComponent() {
  const [mounted, setMounted] = useState(false);
  const [icon, setIcon] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    // Leaflet CSS + icon must be loaded on client only
    import('leaflet/dist/leaflet.css');
    import('leaflet').then(L => {
      setIcon(L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="width:24px;height:24px;background:#C8F53E;border-radius:50%;border:2px solid #080C05;box-shadow:0 0 15px #C8F53E;animation:pulse 2s infinite"></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      }));
    });
  }, []);

  if (!mounted) {
    return (
      <div className="h-[400px] w-full rounded-xl flex items-center justify-center bg-[#080C05] border border-card-border">
        <span className="font-mono text-xs text-[#C8F53E] tracking-widest">LOADING MAP...</span>
      </div>
    );
  }

  return (
    <div className="h-[400px] w-full rounded-xl overflow-hidden border border-card-border z-0 relative">
      <MapContainer center={[30, 0]} zoom={2} style={{ height: '100%', width: '100%' }} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        />
        {icon && monitors.map((m) => (
          <Marker key={m.id} position={[m.lat, m.lng]} icon={icon}>
            <Popup>
              <div className="p-2 font-bold text-[#080C05]">
                <p className="text-xs uppercase tracking-widest opacity-50 mb-1">Active Sector</p>
                <p className="text-sm">{m.name}</p>
                <p className="text-[10px] text-[#C8F53E] bg-[#080C05] px-1.5 py-0.5 rounded mt-2 inline-block">NOMINAL</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
