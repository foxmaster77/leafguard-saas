'use client';

import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

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

export default function OutbreakHeatmap({ clusters = [] }: OutbreakHeatmapProps) {
  // Center map on West Bengal, India
  const center: [number, number] = [23.5000, 87.8000];

  const getColor = (level: 'RED' | 'YELLOW' | 'GREEN') => {
    switch (level) {
      case 'RED': return '#FF4F4F';
      case 'YELLOW': return '#FFB347';
      case 'GREEN': return '#C8F53E';
      default: return '#C8F53E';
    }
  };

  const getRadius = (cases: number) => {
    return Math.min(Math.max((cases || 1) * 4, 10), 30);
  };

  const safeClusters = Array.isArray(clusters) && clusters.length > 0
    ? clusters
    : [
        { pincode: '712101', district: 'Hooghly (Chinsurah)', latitude: 22.9031, longitude: 88.3908, topDisease: 'Late Blight', cropType: 'Potato', totalCases: 6, cases48h: 6, outbreakLevel: 'RED' as const, latestTimestamp: new Date().toISOString() },
        { pincode: '713101', district: 'Burdwan', latitude: 23.2324, longitude: 87.8615, topDisease: 'Rice Blast', cropType: 'Paddy Rice', totalCases: 5, cases48h: 5, outbreakLevel: 'RED' as const, latestTimestamp: new Date().toISOString() },
        { pincode: '742101', district: 'Murshidabad', latitude: 24.1025, longitude: 88.2484, topDisease: 'Yellow Rust', cropType: 'Wheat', totalCases: 3, cases48h: 3, outbreakLevel: 'YELLOW' as const, latestTimestamp: new Date().toISOString() }
      ];

  return (
    <div style={{ height: '100%', width: '100%', position: 'relative', background: '#060A04' }}>
      <MapContainer
        center={center}
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
          const color = getColor(c.outbreakLevel);
          const radius = getRadius(c.totalCases);


          return (
            <React.Fragment key={c.pincode}>
              {/* Outer Heat Radius Ring */}
              <Circle
                center={[c.latitude, c.longitude]}
                radius={radius * 1200}
                pathOptions={{
                  color: color,
                  fillColor: color,
                  fillOpacity: c.outbreakLevel === 'RED' ? 0.25 : 0.12,
                  weight: 1
                }}
              />

              {/* Marker Circle */}
              <CircleMarker
                center={[c.latitude, c.longitude]}
                radius={radius}
                pathOptions={{
                  color: color,
                  fillColor: color,
                  fillOpacity: 0.85,
                  weight: c.outbreakLevel === 'RED' ? 3 : 1
                }}
              >
                <Popup>
                  <div style={{
                    background: '#0F1409',
                    border: `1px solid ${color}`,
                    padding: '0.9rem 1.2rem',
                    borderRadius: '6px',
                    minWidth: '220px',
                    fontFamily: 'monospace',
                    color: 'white'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.7rem', color: color, fontWeight: 900, letterSpacing: '0.12em' }}>
                        📍 PINCODE {c.pincode}
                      </span>
                      <span style={{
                        background: color,
                        color: '#060A04',
                        fontSize: '0.6rem',
                        fontWeight: 900,
                        padding: '0.15rem 0.5rem',
                        borderRadius: '99px',
                        letterSpacing: '0.1em'
                      }}>
                        {c.outbreakLevel === 'RED' ? '🚨 OUTBREAK' : c.outbreakLevel === 'YELLOW' ? '⚠️ MODERATE' : '🟢 LOW RISK'}
                      </span>
                    </div>

                    <p style={{ fontWeight: 900, fontSize: '0.95rem', margin: '0 0 0.2rem', fontFamily: 'sans-serif' }}>
                      {c.district}
                    </p>

                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '0.6rem', paddingTop: '0.6rem' }}>
                      <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', margin: '0 0 0.3rem' }}>
                        Primary Pathogen: <strong style={{ color: 'white' }}>{c.topDisease}</strong>
                      </p>
                      <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', margin: '0 0 0.3rem' }}>
                        Affected Crop: <strong style={{ color: 'white' }}>{c.cropType}</strong>
                      </p>
                      <p style={{ fontSize: '0.75rem', color: color, margin: '0 0 0.3rem', fontWeight: 700 }}>
                        Detections (48h): {c.cases48h} cases
                      </p>
                      <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', margin: 0 }}>
                        Total Weekly Cases: {c.totalCases}
                      </p>
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
