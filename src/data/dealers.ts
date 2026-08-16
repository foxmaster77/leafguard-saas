export interface Dealer {
  id: string;
  name: string;
  district: string;
  pincode: string;
  address: string;
  phone: string;
  specialization: string; // e.g. "Fungicides & Biopesticides", "Paddy Care & Seeds"
  rating: number;
  openHours: string;
  distanceEstimate?: string;
}

export const WB_AGRI_DEALERS: Dealer[] = [
  // Hooghly (712101)
  {
    id: 'd-hooghly-1',
    name: 'Hooghly Krishi Seva Kendra',
    district: 'Hooghly',
    pincode: '712101',
    address: 'GT Road, Chinsurah Station More, Hooghly - 712101',
    phone: '+91 98321 44001',
    specialization: 'Fungicides, Potato Blight Remedies & Micro-nutrients',
    rating: 4.8,
    openHours: '08:00 AM - 08:00 PM',
    distanceEstimate: '1.8 km away'
  },
  {
    id: 'd-hooghly-2',
    name: 'Maa Tara Krishi Bhander',
    district: 'Hooghly',
    pincode: '712101',
    address: 'Pipulhati Market, Mogra, Hooghly - 712148',
    phone: '+91 98321 44002',
    specialization: 'Organic Bio-Pesticides, Mancozeb & Copper Oxychloride',
    rating: 4.7,
    openHours: '07:30 AM - 07:30 PM',
    distanceEstimate: '3.4 km away'
  },

  // Burdwan (713101)
  {
    id: 'd-burdwan-1',
    name: 'Bardhaman Agro Solutions',
    district: 'Burdwan (Purba Bardhaman)',
    pincode: '713101',
    address: 'Court Compound, Station Road, Burdwan - 713101',
    phone: '+91 98322 55001',
    specialization: 'Rice Blast Fungicides (Tricyclazole), Paddy Seeds & Nitrogen Control',
    rating: 4.9,
    openHours: '08:00 AM - 08:30 PM',
    distanceEstimate: '2.1 km away'
  },
  {
    id: 'd-burdwan-2',
    name: 'Damodar Valley Krishi Kendra',
    district: 'Burdwan (Purba Bardhaman)',
    pincode: '713101',
    address: 'Shaktigarh Bypass Market, Burdwan - 713149',
    phone: '+91 98322 55002',
    specialization: 'Systemic Fungicides, Spray Equipment & Plant Tonics',
    rating: 4.6,
    openHours: '07:00 AM - 08:00 PM',
    distanceEstimate: '4.2 km away'
  },

  // Murshidabad (742101)
  {
    id: 'd-murshidabad-1',
    name: 'Bhagirathi Bio-Crop Care',
    district: 'Murshidabad',
    pincode: '742101',
    address: 'Panchanantala Main Market, Baharampur - 742101',
    phone: '+91 98323 66001',
    specialization: 'Wheat Rust Treatments (Propiconazole), Soil Conditioners',
    rating: 4.8,
    openHours: '08:30 AM - 08:00 PM',
    distanceEstimate: '1.5 km away'
  },
  {
    id: 'd-murshidabad-2',
    name: 'Murshidabad Krishi Unnayan',
    district: 'Murshidabad',
    pincode: '742101',
    address: 'Lalbagh Road, Jiaganj, Murshidabad - 742123',
    phone: '+91 98323 66002',
    specialization: 'Jute Pest Control, Broad-Spectrum Fungicides',
    rating: 4.5,
    openHours: '08:00 AM - 07:00 PM',
    distanceEstimate: '3.9 km away'
  },

  // Malda (732101)
  {
    id: 'd-malda-1',
    name: 'Malda Kisan Agrotech',
    district: 'Malda',
    pincode: '732101',
    address: 'Fouzder Court, English Bazar, Malda - 732101',
    phone: '+91 98324 77001',
    specialization: 'Mustard Aphid Sprays (Imidacloprid), Mango & Veg Pathogen Control',
    rating: 4.7,
    openHours: '08:00 AM - 08:00 PM',
    distanceEstimate: '2.0 km away'
  },

  // Nadia (741101)
  {
    id: 'd-nadia-1',
    name: 'Nadia Krishi Bigyan Depot',
    district: 'Nadia',
    pincode: '741101',
    address: 'High Street, Krishnanagar, Nadia - 741101',
    phone: '+91 98325 88001',
    specialization: 'Jute Cercospora Fungicides, Veg Pest Removals',
    rating: 4.8,
    openHours: '08:00 AM - 07:30 PM',
    distanceEstimate: '1.2 km away'
  },

  // Bankura (722101)
  {
    id: 'd-bankura-1',
    name: 'Rarh Banga Agri Store',
    district: 'Bankura',
    pincode: '722101',
    address: 'Machantala Bus Stand, Bankura - 722101',
    phone: '+91 98326 99001',
    specialization: 'Groundnut Stem Rot Remedies, Dryland Bio-fertilizers',
    rating: 4.6,
    openHours: '08:00 AM - 07:00 PM',
    distanceEstimate: '2.5 km away'
  },

  // Medinipur (721101)
  {
    id: 'd-medinipur-1',
    name: 'Medinipur Krishi Sangha',
    district: 'Paschim Medinipur',
    pincode: '721101',
    address: 'Keranitola, Midnapore Town - 721101',
    phone: '+91 98327 11001',
    specialization: 'Bacterial Blight Bactericides (Streptocycline), Paddy Nutrition',
    rating: 4.9,
    openHours: '07:30 AM - 08:00 PM',
    distanceEstimate: '1.9 km away'
  },

  // Siliguri / Darjeeling (734001)
  {
    id: 'd-siliguri-1',
    name: 'Himalayan Agri-Inputs',
    district: 'Darjeeling (Siliguri)',
    pincode: '734001',
    address: 'Hill Cart Road, Siliguri - 734001',
    phone: '+91 98328 22001',
    specialization: 'Tea Blister Blight Fungicides, Organic Copper Sprays',
    rating: 4.8,
    openHours: '08:30 AM - 08:00 PM',
    distanceEstimate: '3.0 km away'
  },

  // Kolkata Central (700001)
  {
    id: 'd-kolkata-1',
    name: 'Bengal Agro Corporation Hub',
    district: 'Kolkata Central',
    pincode: '700001',
    address: 'BBD Bagh North, Kolkata - 700001',
    phone: '+91 98329 33001',
    specialization: 'Wholesale Agri-Chemicals, Certified Bio-inputs & Soil Health Kits',
    rating: 4.9,
    openHours: '09:00 AM - 07:00 PM',
    distanceEstimate: '0.8 km away'
  }
];

export function getNearestDealers(districtOrPincode: string, limit = 3): Dealer[] {
  const query = (districtOrPincode || '').toLowerCase().trim();
  
  // 1. Exact match on pincode
  const exactPinMatch = WB_AGRI_DEALERS.filter(d => d.pincode === query);
  if (exactPinMatch.length >= limit) return exactPinMatch.slice(0, limit);

  // 2. District name match
  const districtMatches = WB_AGRI_DEALERS.filter(d => 
    d.district.toLowerCase().includes(query) || 
    query.includes(d.district.toLowerCase().split(' ')[0])
  );
  if (districtMatches.length > 0) {
    return districtMatches.slice(0, limit);
  }

  // 3. Fallback to default top-rated West Bengal dealers (Hooghly & Burdwan)
  return WB_AGRI_DEALERS.slice(0, limit);
}
