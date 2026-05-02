'use client';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const markers = [
  { pos:[20.5,78.9] as [number,number], label:'India', note:'847 farms active' },
  { pos:[37.1,-95.7] as [number,number], label:'USA', note:'2,341 farms active' },
  { pos:[-14,-51] as [number,number], label:'Brazil', note:'623 farms active' },
  { pos:[-25,133] as [number,number], label:'Australia', note:'412 farms active' },
  { pos:[51,10] as [number,number], label:'Germany', note:'318 farms active' },
  { pos:[35,104] as [number,number], label:'China', note:'1,204 farms active' },
  { pos:[9,8] as [number,number], label:'Nigeria', note:'287 farms active' },
  { pos:[-1,37] as [number,number], label:'Kenya', note:'194 farms active' },
  { pos:[23,90] as [number,number], label:'Bangladesh', note:'531 farms active' },
  { pos:[-34,-64] as [number,number], label:'Argentina', note:'448 farms active' },
];

export default function GlobalMap() {
  return (
    <MapContainer
      center={[20, 10]}
      zoom={2}
      scrollWheelZoom={false}
      style={{ height:'100%', width:'100%', background:'#060A04' }}
      attributionControl={false}
      zoomControl={false}
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
