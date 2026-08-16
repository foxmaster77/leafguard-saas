/**
 * DEMO SEED DATA SCRIPT - AgroGuard Outbreak Heatmap
 * 
 * Purpose: Inserts realistic disease detection records across West Bengal pincodes
 * for hackathon demonstration.
 * 
 * TO STRIP / RESET SEED DATA BEFORE PRODUCTION SUBMISSION:
 * Run SQL in Supabase SQL Editor:
 * DELETE FROM detections WHERE id IS NOT NULL;
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Parse .env.local manually if process.env values are missing
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const [key, ...valueParts] = trimmed.split('=');
      const val = valueParts.join('=').trim();
      if (key && !process.env[key.trim()]) {
        process.env[key.trim()] = val;
      }
    }
  });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_KEY must be configured in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const DEMO_SEED_DETECTIONS = [
  // Cluster 1: Hooghly (Pincode 712101) - Outbreak Alert (6 detections within 48h)
  { disease_name: 'Late Blight', crop_type: 'Potato', confidence: 96, severity: 'High', pincode: '712101', latitude: 22.9031, longitude: 88.3908, created_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString() },
  { disease_name: 'Late Blight', crop_type: 'Potato', confidence: 94, severity: 'High', pincode: '712101', latitude: 22.9050, longitude: 88.3920, created_at: new Date(Date.now() - 6 * 3600 * 1000).toISOString() },
  { disease_name: 'Late Blight', crop_type: 'Potato', confidence: 92, severity: 'High', pincode: '712101', latitude: 22.9010, longitude: 88.3890, created_at: new Date(Date.now() - 12 * 3600 * 1000).toISOString() },
  { disease_name: 'Late Blight', crop_type: 'Potato', confidence: 95, severity: 'High', pincode: '712101', latitude: 22.9080, longitude: 88.3950, created_at: new Date(Date.now() - 20 * 3600 * 1000).toISOString() },
  { disease_name: 'Late Blight', crop_type: 'Potato', confidence: 91, severity: 'High', pincode: '712101', latitude: 22.9040, longitude: 88.3910, created_at: new Date(Date.now() - 30 * 3600 * 1000).toISOString() },
  { disease_name: 'Late Blight', crop_type: 'Potato', confidence: 89, severity: 'High', pincode: '712101', latitude: 22.9020, longitude: 88.3930, created_at: new Date(Date.now() - 40 * 3600 * 1000).toISOString() },

  // Cluster 2: Burdwan (Pincode 713101) - Outbreak Alert (5 detections within 48h)
  { disease_name: 'Rice Blast', crop_type: 'Paddy Rice', confidence: 95, severity: 'High', pincode: '713101', latitude: 23.2324, longitude: 87.8615, created_at: new Date(Date.now() - 4 * 3600 * 1000).toISOString() },
  { disease_name: 'Rice Blast', crop_type: 'Paddy Rice', confidence: 93, severity: 'High', pincode: '713101', latitude: 23.2340, longitude: 87.8630, created_at: new Date(Date.now() - 10 * 3600 * 1000).toISOString() },
  { disease_name: 'Rice Blast', crop_type: 'Paddy Rice', confidence: 91, severity: 'High', pincode: '713101', latitude: 23.2310, longitude: 87.8600, created_at: new Date(Date.now() - 18 * 3600 * 1000).toISOString() },
  { disease_name: 'Rice Blast', crop_type: 'Paddy Rice', confidence: 97, severity: 'High', pincode: '713101', latitude: 23.2350, longitude: 87.8640, created_at: new Date(Date.now() - 28 * 3600 * 1000).toISOString() },
  { disease_name: 'Rice Blast', crop_type: 'Paddy Rice', confidence: 88, severity: 'High', pincode: '713101', latitude: 23.2300, longitude: 87.8590, created_at: new Date(Date.now() - 36 * 3600 * 1000).toISOString() },

  // Cluster 3: Murshidabad (Pincode 742101) - Moderate Level (3 detections)
  { disease_name: 'Yellow Rust', crop_type: 'Wheat', confidence: 90, severity: 'Medium', pincode: '742101', latitude: 24.1025, longitude: 88.2484, created_at: new Date(Date.now() - 8 * 3600 * 1000).toISOString() },
  { disease_name: 'Yellow Rust', crop_type: 'Wheat', confidence: 87, severity: 'Medium', pincode: '742101', latitude: 24.1040, longitude: 88.2500, created_at: new Date(Date.now() - 22 * 3600 * 1000).toISOString() },
  { disease_name: 'Yellow Rust', crop_type: 'Wheat', confidence: 85, severity: 'Medium', pincode: '742101', latitude: 24.1010, longitude: 88.2470, created_at: new Date(Date.now() - 44 * 3600 * 1000).toISOString() },

  // Cluster 4: Malda (Pincode 732101) - Low Risk (2 detections)
  { disease_name: 'Aphid Damage', crop_type: 'Mustard', confidence: 88, severity: 'Low', pincode: '732101', latitude: 25.0044, longitude: 88.1458, created_at: new Date(Date.now() - 14 * 3600 * 1000).toISOString() },
  { disease_name: 'Aphid Damage', crop_type: 'Mustard', confidence: 82, severity: 'Low', pincode: '732101', latitude: 25.0060, longitude: 88.1470, created_at: new Date(Date.now() - 38 * 3600 * 1000).toISOString() },

  // Cluster 5: Nadia (Pincode 741101) - Low Risk (1 detection)
  { disease_name: 'Cercospora Leaf Spot', crop_type: 'Jute', confidence: 86, severity: 'Low', pincode: '741101', latitude: 23.4013, longitude: 88.4975, created_at: new Date(Date.now() - 16 * 3600 * 1000).toISOString() },

  // Cluster 6: Bankura (Pincode 722101) - Low Risk (1 detection)
  { disease_name: 'Stem Rot', crop_type: 'Groundnut', confidence: 89, severity: 'Low', pincode: '722101', latitude: 23.2313, longitude: 87.0784, created_at: new Date(Date.now() - 26 * 3600 * 1000).toISOString() },

  // Cluster 7: Medinipur (Pincode 721101) - Low Risk (1 detection)
  { disease_name: 'Bacterial Blight', crop_type: 'Paddy Rice', confidence: 91, severity: 'Medium', pincode: '721101', latitude: 22.4257, longitude: 87.3199, created_at: new Date(Date.now() - 12 * 3600 * 1000).toISOString() },

  // Cluster 8: Siliguri / Darjeeling (Pincode 734001) - Low Risk (1 detection)
  { disease_name: 'Tea Blister Blight', crop_type: 'Tea', confidence: 94, severity: 'Medium', pincode: '734001', latitude: 26.7271, longitude: 88.3953, created_at: new Date(Date.now() - 5 * 3600 * 1000).toISOString() }
];

async function seedDatabase() {
  console.log('🌱 Seeding demo detections into Supabase table `public.detections`...');

  const { data, error } = await supabase
    .from('detections')
    .insert(DEMO_SEED_DETECTIONS)
    .select();

  if (error) {
    console.error('❌ Failed to seed database:', error.message);
    console.log('👉 Note: Ensure `public.detections` table is created in Supabase SQL editor using `supabase_schema.sql`.');
  } else {
    console.log(`✅ Successfully seeded ${data?.length || DEMO_SEED_DETECTIONS.length} demo detection records across 8 West Bengal pincodes!`);
  }
}

seedDatabase();
