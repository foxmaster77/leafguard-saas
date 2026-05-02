'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect } from 'react';

// Fix for default marker icon in Next.js
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function MapComponent() {
  const monitors = [
    { id: 1, name: 'Pilot Farm: USA (Illinois)', lat: 41.8781, lng: -87.6298 },
    { id: 2, name: 'Pilot Farm: India (MP)', lat: 22.9734, lng: 78.6569 },
    { id: 3, name: 'Pilot Farm: Europe (France)', lat: 48.8566, lng: 2.3522 },
  ];

  return (
    <div className="h-[400px] w-full rounded-xl overflow-hidden border border-card-border z-0 relative">
      <MapContainer center={[30, 0]} zoom={2} style={{ height: '100%', width: '100%' }} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.esri.com/">Esri</a>, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EBP, and the GIS User Community'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        />
        
        {/* Markers for Farm Locations */}
        {monitors.map((m: any) => (
          <Marker 
            key={m.id} 
            position={[m.lat || 51.505, m.lng || -0.09]}
            icon={L.divIcon({
              className: 'custom-div-icon',
              html: `<div class="w-6 h-6 bg-[#C8F53E] rounded-full border-2 border-[#080C05] shadow-[0_0_15px_#C8F53E] animate-pulse"></div>`,
              iconSize: [24, 24],
              iconAnchor: [12, 12]
            })}
          >
            <Popup>
              <div className="p-2 font-bold text-[#080C05]">
                <p className="text-xs uppercase tracking-widest opacity-50 mb-1">Active Sector</p>
                <p className="text-sm">{m.name}</p>
                <p className="text-[10px] text-[#C8F53E] bg-[#080C05] px-1.5 py-0.5 rounded mt-2 inline-block">NOMINAL</p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Professional Overlay Legend */}
        <div className="absolute bottom-6 left-6 z-[1000] glass-card p-4 border border-white/10 rounded-2xl bg-black/60 backdrop-blur-md pointer-events-none">
          <p className="text-[8px] font-black uppercase tracking-[0.3em] text-[#C8F53E] mb-2">Satellite Overlay</p>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#C8F53E] animate-pulse"></div>
              <span className="text-[10px] font-bold text-white">Active Sensor Hub</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-orange-500"></div>
              <span className="text-[10px] font-bold text-white">Maintenance Required</span>
            </div>
          </div>
        </div>
      </MapContainer>
      <style jsx global>{`
        .map-tiles {
          filter: invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%);
        }
        .leaflet-container {
          background: #080C05;
        }
      `}</style>
    </div>
  );
}
