'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export interface ScanItem {
  id: string;
  cropName: string;
  disease: string;
  riskLevel: 'Low' | 'Moderate' | 'Medium' | 'High' | 'Critical';
  confidence: number;
  thumbnailUrl: string | null;
  timestamp: number;
  pincode?: string;
  treatment: string;
  dosage?: string;
  treatmentStatus: 'pending' | 'applied' | 'skipped';
  notes?: string;
}

export interface FarmerProfile {
  id: string;
  name: string;
  email: string;
  region: string;
  landSize: string;
  primaryCrops: string[];
  joinedAt: string;
  phone?: string;
}

interface AuthContextType {
  user: any | null;
  profile: FarmerProfile;
  loading: boolean;
  scanHistory: ScanItem[];
  addScan: (scan: Omit<ScanItem, 'id' | 'timestamp' | 'treatmentStatus'> & { id?: string; timestamp?: number; treatmentStatus?: 'pending' | 'applied' | 'skipped' }) => void;
  updateScanStatus: (id: string, status: 'pending' | 'applied' | 'skipped') => void;
  deleteScan: (id: string) => void;
  updateProfile: (updates: Partial<FarmerProfile>) => void;
  logout: () => Promise<void>;
}

const DEFAULT_PROFILE: FarmerProfile = {
  id: 'farmer-demo-01',
  name: 'Debashis Mukherjee',
  email: 'debashis.fpo@wb.gov.in',
  region: 'Hooghly & Purba Bardhaman (WB)',
  landSize: '14.5 Acres',
  primaryCrops: ['Paddy Rice', 'Potato (Kufri Jyoti)', 'Mustard', 'Jute'],
  joinedAt: 'Kharif Season 2025',
  phone: '+91 98312 45678'
};

const DEFAULT_SCANS: ScanItem[] = [
  {
    id: 'scan-init-01',
    cropName: 'Potato',
    disease: 'Late Blight (Phytophthora)',
    riskLevel: 'High',
    confidence: 96,
    thumbnailUrl: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=300&q=80',
    timestamp: Date.now() - 1000 * 60 * 45,
    pincode: '712101',
    treatment: 'Spray Mancozeb 75% WP @ 2.5g/L immediately',
    dosage: '2.5g/L water',
    treatmentStatus: 'pending',
    notes: 'Affected foliage in North Plot 4-B'
  },
  {
    id: 'scan-init-02',
    cropName: 'Paddy Rice',
    disease: 'Rice Blast (Magnaporthe)',
    riskLevel: 'Moderate',
    confidence: 92,
    thumbnailUrl: 'https://images.unsplash.com/photo-1536657464919-892534f60d6e?w=300&q=80',
    timestamp: Date.now() - 1000 * 60 * 60 * 5,
    pincode: '713101',
    treatment: 'Apply Tricyclazole 75% WP @ 0.6g/L',
    dosage: '0.6g/L water',
    treatmentStatus: 'applied',
    notes: 'Treated with knapsack sprayer'
  },
  {
    id: 'scan-init-03',
    cropName: 'Mustard',
    disease: 'Healthy Leaf Canopy',
    riskLevel: 'Low',
    confidence: 98,
    thumbnailUrl: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=300&q=80',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 2,
    pincode: '732101',
    treatment: 'No chemical required · Maintain standard NPK balance',
    dosage: 'Standard irrigation',
    treatmentStatus: 'applied',
    notes: 'Routine baseline screening'
  }
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<FarmerProfile>(DEFAULT_PROFILE);
  const [scanHistory, setScanHistory] = useState<ScanItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const savedScans = localStorage.getItem('cropguard_scan_history');
      if (savedScans) {
        setScanHistory(JSON.parse(savedScans));
      } else {
        setScanHistory(DEFAULT_SCANS);
        localStorage.setItem('cropguard_scan_history', JSON.stringify(DEFAULT_SCANS));
      }
    } catch (e) {
      console.warn('Could not read scan history from storage:', e);
      setScanHistory(DEFAULT_SCANS);
    }

    try {
      const savedProfile = localStorage.getItem('cropguard_farmer_profile');
      if (savedProfile) {
        setProfile(JSON.parse(savedProfile));
      }
    } catch (e) {
      console.warn('Could not read profile from storage:', e);
    }

    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          const emailName = session.user.email?.split('@')[0] || 'Farmer Operator';
          const formattedName = emailName.charAt(0).toUpperCase() + emailName.slice(1);
          setProfile(prev => ({
            ...prev,
            id: session.user.id,
            email: session.user.email || prev.email,
            name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || formattedName
          }));
        } else {
          const mockUser = localStorage.getItem('cropguard_mock_session');
          if (mockUser) {
            const parsed = JSON.parse(mockUser);
            setUser(parsed);
          }
        }
      } catch (err) {
        console.warn('Supabase auth getSession check:', err);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        const emailName = session.user.email?.split('@')[0] || 'Farmer Operator';
        const formattedName = emailName.charAt(0).toUpperCase() + emailName.slice(1);
        setProfile(prev => ({
          ...prev,
          id: session.user.id,
          email: session.user.email || prev.email,
          name: session.user.user_metadata?.full_name || formattedName
        }));
      } else {
        const mockUser = localStorage.getItem('cropguard_mock_session');
        if (!mockUser) {
          setUser(null);
        }
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const addScan = (newScan: Omit<ScanItem, 'id' | 'timestamp' | 'treatmentStatus'> & { id?: string; timestamp?: number; treatmentStatus?: 'pending' | 'applied' | 'skipped' }) => {
    const item: ScanItem = {
      ...newScan,
      id: newScan.id || ('scan-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6)),
      timestamp: newScan.timestamp || Date.now(),
      treatmentStatus: newScan.treatmentStatus || 'pending'
    };

    setScanHistory(prev => {
      const updated = [item, ...prev];
      try {
        localStorage.setItem('cropguard_scan_history', JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to persist scan history:', e);
      }
      return updated;
    });
  };

  const updateScanStatus = (id: string, status: 'pending' | 'applied' | 'skipped') => {
    setScanHistory(prev => {
      const updated = prev.map(s => s.id === id ? { ...s, treatmentStatus: status } : s);
      try {
        localStorage.setItem('cropguard_scan_history', JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to update scan history:', e);
      }
      return updated;
    });
  };

  const deleteScan = (id: string) => {
    setScanHistory(prev => {
      const updated = prev.filter(s => s.id !== id);
      try {
        localStorage.setItem('cropguard_scan_history', JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to delete scan:', e);
      }
      return updated;
    });
  };

  const updateProfile = (updates: Partial<FarmerProfile>) => {
    setProfile(prev => {
      const updated = { ...prev, ...updates };
      try {
        localStorage.setItem('cropguard_farmer_profile', JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to update farmer profile:', e);
      }
      return updated;
    });
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('Sign out error:', e);
    }
    localStorage.removeItem('cropguard_mock_session');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        scanHistory,
        addScan,
        updateScanStatus,
        deleteScan,
        updateProfile,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
