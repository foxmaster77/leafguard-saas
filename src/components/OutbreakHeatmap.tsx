'use client';

import React, { useEffect, useState } from 'react';

interface PincodeCluster {
  pincode: string;
  district: string;
  latitude: number;
  longitude: number;
  topDisease: string;
  cropType: string;
  totalCases: number;
  cases48h: number;
  outbreakLevel: 'RED' | 'YELLOW' | 'GREEN';
  latestTimestamp: string;
}

interface OutbreakHeatmapProps {
  clusters: PincodeCluster[];
}

// Dynamically import Leaflet components so they never run on the server
import dynamic from 'next/dynamic';
const MapContainer = dynamic(() => import('react-leaflet').then(m => m.MapContainer), { ssr: false });
const TileLayer    = dynamic(() => import('react-leaflet').then(m => m.TileLayer),    { ssr: false });
const CircleMarker = dynamic(() => import('react-leaflet').then(m => m.CircleMarker), { ssr: false });
const Circle       = dynamic(() => import('react-leaflet').then(m => m.Circle),       { ssr: false });
const Popup        = dynamic(() => import('react-leaflet').then(m => m.Popup),        { ssr: false });

const DEFAULT_CLUSTERS: PincodeCluster[] = [
  { pincode: '712101', district: 'Hooghly (Chinsurah)', latitude: 22.9031, longitude: 88.3908, topDisease: 'Late Blight',     cropType: 'Potato',     totalCases: 6, cases48h: 6, outbreakLevel: 'RED',    latestTimestamp: new Date().toISOString() },
  { pincode: '713101', district: 'Burdwan',             latitude: 23.2324, longitude: 87.8615, topDisease: 'Rice Blast',      cropType: 'Paddy Rice', totalCases: 5, cases48h: 5, outbreakLevel: 'RED',    latestTimestamp: new Date().toISOString() },
  { pincode: '742101', district: 'Murshidabad',         latitude: 24.1025, longitude: 88.2484, topDisease: 'Yellow Rust',     cropType: 'Wheat',      totalCases: 3, cases48h: 3, outbreakLevel: 'YELLOW', latestTimestamp: new Date().toISOString() },
  { pincode: '732101', district: 'Malda',               latitude: 25.0044, longitude: 88.1458, topDisease: 'Aphid Vector',    cropType: 'Mustard',    totalCases: 2, cases48h: 2, outbreakLevel: 'GREEN',  latestTimestamp: new Date().toISOString() },
  { pincode: '741101', district: 'Nadia',               latitude: 23.4013, longitude: 88.4975, topDisease: 'Cercospora Spot', cropType: 'Jute',       totalCases: 2, cases48h: 1, outbreakLevel: 'GREEN',  latestTimestamp: new Date().toISOString() },
  { pincode: '722101', district: 'Bankura',             latitude: 23.2313, longitude: 87.0784, topDisease: 'Stem Rot',        cropType: 'Groundnut',  totalCases: 1, cases48h: 1, outbreakLevel: 'GREEN',  latestTimestamp: new Date().toISOString() },
  { pincode: '721101', district: 'Paschim Medinipur',  latitude: 22.4257, longitude: 87.3199, topDisease: 'Bacterial Blight',cropType: 'Paddy Rice', totalCases: 3, cases48h: 2, outbreakLevel: 'YELLOW', latestTimestamp: new Date().toISOString() },
  { pincode: '734001', district: 'Siliguri',            latitude: 26.7271, longitude: 88.3953, topDisease: 'Blister Blight',  cropType: 'Tea',        totalCases: 2, cases48h: 2, outbreakLevel: 'GREEN',  latestTimestamp: new Date().toISOString() },
];

const CENTER: [number, number] = [23.5, 87.8];

const COLORS = { RED: '#FF4F4F', YELLOW: '#FFB347', GREEN: '#C8F53E' };

function getRadius(cases: number) {
  return Math.min(Math.max((cases || 1) * 4, 10), 30);
}

export default function OutbreakHeatmap({ clusters = [] }: OutbreakHeatmapProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Leaflet CSS must be loaded on the client only
    import('leaflet/dist/leaflet.css');
    setMounted(true);
  }, []);

  const safeClusters = Array.isArray(clusters) && clusters.length > 0 ? clusters : DEFAULT_CLUSTERS;

  if (!mounted) {
    return (
      <div style={{ height: '100%', width: '100%', background: '#060A04', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
        <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#C8F53E', display: 'inline-block', animation: 'ping 1s infinite' }} />
        <span style={{ color: '#C8F53E', fontFamily: 'monospace', fontSize: '0.7rem', letterSpacing: '0.12em' }}>INITIALIZING SATELLITE RADAR...</span>
      </div>
    );
  }

  return (
    <div style={{ height: '100%', width: '100%', position: 'relative', background: '#060A04' }}>
      <MapContainer
        key="outbreak-heatmap"
        center={CENTER}
        zoom={7.5}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%', background: '#060A04' }}
        zoomControl={true}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        />

        {safeClusters.map((c) => {
          if (!c || typeof c.latitude !== 'number' || typeof c.longitude !== 'number') return null;
          const color = COLORS[c.outbreakLevel] ?? COLORS.GREEN;
          const radius = getRadius(c.totalCases);

          return (
            <React.Fragment key={c.pincode}>
              {/* Outer glow ring */}
              <Circle
                center={[c.latitude, c.longitude]}
                radius={radius * 1200}
                pathOptions={{ color, fillColor: color, fillOpacity: c.outbreakLevel === 'RED' ? 0.25 : 0.12, weight: 1 }}
              />
              {/* Core marker */}
              <CircleMarker
                center={[c.latitude, c.longitude]}
                radius={radius}
                pathOptions={{ color, fillColor: color, fillOpacity: 0.85, weight: c.outbreakLevel === 'RED' ? 3 : 1 }}
              >
                <Popup>
                  <div style={{ background: '#0F1409', border: `1px solid ${color}`, padding: '0.9rem 1.2rem', borderRadius: '6px', minWidth: '220px', fontFamily: 'monospace', color: 'white' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.7rem', color, fontWeight: 900, letterSpacing: '0.12em' }}>📍 PINCODE {c.pincode}</span>
                      <span style={{ background: color, color: '#060A04', fontSize: '0.6rem', fontWeight: 900, padding: '0.15rem 0.5rem', borderRadius: '99px', letterSpacing: '0.1em' }}>
                        {c.outbreakLevel === 'RED' ? '🚨 OUTBREAK' : c.outbreakLevel === 'YELLOW' ? '⚠️ MODERATE' : '🟢 LOW RISK'}
                      </span>
                    </div>
                    <p style={{ fontWeight: 900, fontSize: '0.95rem', margin: '0 0 0.2rem', fontFamily: 'sans-serif' }}>{c.district}</p>
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '0.6rem', paddingTop: '0.6rem' }}>
                      <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', margin: '0 0 0.3rem' }}>Primary Pathogen: <strong style={{ color: 'white' }}>{c.topDisease}</strong></p>
                      <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', margin: '0 0 0.3rem' }}>Affected Crop: <strong style={{ color: 'white' }}>{c.cropType}</strong></p>
                      <p style={{ fontSize: '0.75rem', color, margin: '0 0 0.3rem', fontWeight: 700 }}>Detections (48h): {c.cases48h} cases</p>
                      <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', margin: 0 }}>Total Weekly Cases: {c.totalCases}</p>
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            </React.Fragment>
          );
        })}
      </MapContainer>
    </div>
  );
}
