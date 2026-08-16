'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically load Leaflet components — never server-rendered
const MapContainer = dynamic(() => import('react-leaflet').then(m => m.MapContainer), { ssr: false });
const TileLayer    = dynamic(() => import('react-leaflet').then(m => m.TileLayer),    { ssr: false });
const CircleMarker = dynamic(() => import('react-leaflet').then(m => m.CircleMarker), { ssr: false });
const Popup        = dynamic(() => import('react-leaflet').then(m => m.Popup),        { ssr: false });

const markers = [
  { pos:[22.9031, 88.3908] as [number,number], label:'Hooghly (712101)',   note:'Late Blight Alert · 8 Detections' },
  { pos:[23.2324, 87.8615] as [number,number], label:'Burdwan (713101)',   note:'Rice Blast Alert · 7 Detections' },
  { pos:[24.1025, 88.2484] as [number,number], label:'Murshidabad (742101)',note:'Yellow Rust · 4 Detections' },
  { pos:[25.0044, 88.1458] as [number,number], label:'Malda (732101)',     note:'Mustard Vector Surveillance' },
  { pos:[23.4013, 88.4975] as [number,number], label:'Nadia (741101)',     note:'Jute Stem Rot Monitoring' },
  { pos:[22.4257, 87.3199] as [number,number], label:'Medinipur (721101)', note:'Bacterial Leaf Blight Watch' },
  { pos:[26.7271, 88.3953] as [number,number], label:'Siliguri (734001)',  note:'Tea Blister Blight Monitor' },
  { pos:[23.8103, 90.4125] as [number,number], label:'Dhaka Region',       note:'531 Regional Farm Uplinks' },
  { pos:[30.9010, 75.8573] as [number,number], label:'Punjab Grain Corridor', note:'Wheat Rust Early Warning' },
];

export default function GlobalMap() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    // Import leaflet CSS only on client
    import('leaflet/dist/leaflet.css');
  }, []);

  if (!mounted) {
    return (
      <div style={{ height: '100%', width: '100%', background: '#060A04', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color: '#C8F53E', fontFamily: 'monospace', fontSize: '0.75rem', letterSpacing: '0.1em' }}>LOADING MAP...</span>
      </div>
    );
  }

  return (
    <MapContainer
      center={[23.8, 88.2]}
      zoom={6}
      scrollWheelZoom={false}
      style={{ height:'100%', width:'100%', background:'#060A04' }}
      attributionControl={false}
      zoomControl={true}
    >
      <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
      {markers.map((m, i) => (
        <CircleMarker key={i} center={m.pos} radius={7}
          pathOptions={{ color:'#C8F53E', fillColor:'#C8F53E', fillOpacity:0.6, weight:1 }}>
          <Popup>
            <div style={{ background:'#0F1409', border:'1px solid rgba(200,245,62,0.2)', padding:'0.6rem 1rem', borderRadius:'4px', minWidth:'140px' }}>
              <p style={{ color:'#C8F53E', fontFamily:'monospace', fontSize:'0.7rem', fontWeight:700, letterSpacing:'0.15em', marginBottom:'0.3rem' }}>● ACTIVE MONITORING</p>
              <p style={{ color:'white', fontWeight:700, fontSize:'0.85rem', marginBottom:'0.2rem' }}>{m.label}</p>
              <p style={{ color:'rgba(255,255,255,0.4)', fontFamily:'monospace', fontSize:'0.65rem' }}>{m.note}</p>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
