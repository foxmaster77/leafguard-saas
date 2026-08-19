export type Product = {
  id: string;
  title: string;
  category: "Crops" | "Machinery" | "Seeds" | "Fertilizers";
  price: number;
  currency: "₹" | "$";
  unit: "kg" | "ton" | "piece" | "liter" | "bag";
  location: string;
  organic: boolean;
  image: string;
  images: string[];
  trending?: boolean;
  featured?: boolean;
  discountPercent?: number;
  stockStatus?: "In Stock" | "Limited Stock" | "Pre-order";
  minOrder?: string;
  shelfLife?: string;
  seller: {
    name: string;
    verified: boolean;
    rating: number;
    reviewsCount: number;
    memberSince: string;
    activeListings: number;
    responseTime: string;
    avatar: string;
  };
  harvestDate?: string;
  quantity?: number;
  description?: string;
  specs?: { [key: string]: string };
};

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "p1",
    title: "Organic Super Basmati Rice (Aged 2 Yrs)",
    category: "Crops",
    price: 65,
    currency: "₹",
    unit: "kg",
    location: "Coimbatore",
    organic: true,
    trending: true,
    featured: true,
    discountPercent: 10,
    stockStatus: "In Stock",
    minOrder: "50 kg",
    shelfLife: "24 Months",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=1000&q=80",
    images: [
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=1000&q=80"
    ],
    seller: {
      name: "Ramesh Organic Farms",
      verified: true,
      rating: 4.9,
      reviewsCount: 142,
      memberSince: "March 2023",
      activeListings: 8,
      responseTime: "Replies in ~15m",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
    },
    harvestDate: "2026-07-15",
    quantity: 1200,
    description:
      "Premium export-grade 1121 Super Basmati paddy, naturally grown without synthetic fertilizers or chemical pesticides. APEDA & NPOP organic certified. Rich in natural aroma and elongated grains post cooking.",
    specs: {
      "Purity": "99.5%",
      "Moisture": "12.0% max",
      "Grain Length": "8.35 mm",
      "Certification": "NPOP / APEDA Organic",
      "Packaging": "25kg / 50kg Jute Bags"
    }
  },
  {
    id: "p5",
    title: "GI-Certified Ratnagiri Alphonso Mangoes (A-Grade)",
    category: "Crops",
    price: 220,
    currency: "₹",
    unit: "kg",
    location: "Ratnagiri",
    organic: true,
    trending: true,
    featured: true,
    discountPercent: 15,
    stockStatus: "Limited Stock",
    minOrder: "10 kg",
    shelfLife: "10-14 Days",
    image: "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=1000&q=80",
    images: [
      "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1591073113125-e46713c829ed?auto=format&fit=crop&w=1000&q=80"
    ],
    seller: {
      name: "Konkan Heritage Orchards",
      verified: true,
      rating: 4.95,
      reviewsCount: 230,
      memberSince: "Jan 2022",
      activeListings: 14,
      responseTime: "Replies in ~10m",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
    },
    harvestDate: "2026-05-10",
    quantity: 800,
    description:
      "Original Geographical Indication (GI) tagged Alphonso 'Hapus' mangoes hand-harvested directly in Ratnagiri coastal orchards. 100% carbide-free, naturally straw-ripened, saffron-gold pulp with unmatched sweetness.",
    specs: {
      "Grade": "A+ Export Quality",
      "Average Weight": "240g - 280g / fruit",
      "Ripening Process": "Natural Grass / Hay",
      "Brix (Sweetness)": "19 - 22° Brix",
      "GI Tag": "AU-MAH-0012"
    }
  },
  {
    id: "p2",
    title: "AgriPro 45HP Dual-Clutch 4WD Tractor",
    category: "Machinery",
    price: 1500,
    currency: "$",
    unit: "piece",
    location: "Pune",
    organic: false,
    trending: true,
    featured: false,
    stockStatus: "In Stock",
    minOrder: "1 unit",
    image: "https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?auto=format&fit=crop&w=1000&q=80",
    images: [
      "https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1530267981375-f0de937f5f13?auto=format&fit=crop&w=1000&q=80"
    ],
    seller: {
      name: "AgriMach Machinery Hub",
      verified: true,
      rating: 4.7,
      reviewsCount: 68,
      memberSince: "August 2021",
      activeListings: 19,
      responseTime: "Replies in ~1 hr",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80"
    },
    quantity: 3,
    description:
      "Heavy-duty 45HP direct injection diesel tractor with 4-wheel drive, oil-immersed multi-disc brakes, and 1800kg hydraulic lift capacity. Fully inspected, 1-year comprehensive engine warranty included.",
    specs: {
      "Engine Power": "45 HP @ 2100 RPM",
      "Transmission": "8 Forward + 2 Reverse",
      "Lifting Capacity": "1800 kg",
      "Fuel Tank": "60 Liters",
      "Warranty": "12 Months Farm Warranty"
    }
  },
  {
    id: "p4",
    title: "VNR-412 F1 Hybrid Red Tomato Seeds",
    category: "Seeds",
    price: 850,
    currency: "₹",
    unit: "kg",
    location: "Mysore",
    organic: false,
    trending: false,
    featured: true,
    discountPercent: 5,
    stockStatus: "In Stock",
    minOrder: "1 kg",
    shelfLife: "36 Months",
    image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=1000&q=80",
    images: [
      "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1561136594-7f68413baa99?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=1000&q=80"
    ],
    seller: {
      name: "Green Agro Seed Labs",
      verified: true,
      rating: 4.8,
      reviewsCount: 95,
      memberSince: "Nov 2022",
      activeListings: 22,
      responseTime: "Replies in ~30m",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80"
    },
    quantity: 200,
    description:
      "High-yielding determinate hybrid tomato seeds resistant to TYLCV (Tomato Yellow Leaf Curl Virus) and bacterial wilt. High firmness fruits with deep red color, ideal for long distance transport.",
    specs: {
      "Germination Rate": "Min 85%",
      "Maturity Period": "65 - 70 Days",
      "Fruit Weight": "90 - 110 g",
      "Disease Resistance": "TYLCV & Early Blight",
      "Purity": "98% Min"
    }
  },
  {
    id: "p6",
    title: "Precision Smart Drip Irrigation Kit (1 Acre Complete)",
    category: "Machinery",
    price: 11500,
    currency: "₹",
    unit: "piece",
    location: "Coimbatore",
    organic: false,
    trending: true,
    featured: false,
    discountPercent: 12,
    stockStatus: "In Stock",
    minOrder: "1 Kit",
    image: "https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?auto=format&fit=crop&w=1000&q=80",
    images: [
      "https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=1000&q=80"
    ],
    seller: {
      name: "WaterSmart Agri Solutions",
      verified: true,
      rating: 4.6,
      reviewsCount: 54,
      memberSince: "May 2023",
      activeListings: 6,
      responseTime: "Replies in ~45m",
      avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80"
    },
    quantity: 15,
    description:
      "All-in-one 1-Acre micro-irrigation package. Includes UV-stabilized 16mm inline lateral tubing (400m), screen filter, venturi fertigation injector, ball valves, connectors, and digital pressure gauge. Reduces water usage by up to 60%.",
    specs: {
      "Coverage": "1 Acre (approx 4000 sq.m)",
      "Emitter Spacing": "40 cm inline",
      "Flow Rate": "2.4 LPH per dripper",
      "UV Resistance": "5-Year Guarantee",
      "Operating Pressure": "0.8 - 2.5 bar"
    }
  },
  {
    id: "p3",
    title: "Granular Urea 46% Nitrogen (Slow-Release Eco Formula)",
    category: "Fertilizers",
    price: 32,
    currency: "₹",
    unit: "kg",
    location: "Hyderabad",
    organic: false,
    trending: false,
    featured: false,
    stockStatus: "In Stock",
    minOrder: "100 kg",
    shelfLife: "36 Months",
    image: "https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&w=1000&q=80",
    images: [
      "https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1592417817098-8f3d6ef23a41?auto=format&fit=crop&w=1000&q=80"
    ],
    seller: {
      name: "NitroChem Agro India",
      verified: false,
      rating: 4.1,
      reviewsCount: 38,
      memberSince: "Sept 2023",
      activeListings: 11,
      responseTime: "Replies in ~2 hrs",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80"
    },
    quantity: 5000,
    description:
      "Neem-coated slow-release prilled Urea with guaranteed 46% Nitrogen content. Enhances chlorophyll synthesis, vegetative growth, and minimizes nitrogen leaching into groundwater.",
    specs: {
      "Nitrogen (N)": "46.0% Minimum",
      "Biuret": "1.0% Maximum",
      "Moisture": "0.5% Maximum",
      "Coating": "Neem Oil Extract 0.05%",
      "Form": "White Prilled Granules"
    }
  },
  {
    id: "p7",
    title: "Certified Organic Sharbati Wheat Grains",
    category: "Crops",
    price: 48,
    currency: "₹",
    unit: "kg",
    location: "Pune",
    organic: true,
    trending: true,
    featured: false,
    discountPercent: 8,
    stockStatus: "In Stock",
    minOrder: "50 kg",
    shelfLife: "18 Months",
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=1000&q=80",
    images: [
      "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1000&q=80"
    ],
    seller: {
      name: "Sehore Golden Fields",
      verified: true,
      rating: 4.85,
      reviewsCount: 110,
      memberSince: "Feb 2023",
      activeListings: 5,
      responseTime: "Replies in ~20m",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80"
    },
    harvestDate: "2026-06-20",
    quantity: 2500,
    description:
      "Naturally golden, sweet-tasting whole wheat grains from the fertile black soil of Sehore. High protein (13.5%), excellent dough elasticity, and completely unpolished.",
    specs: {
      "Protein Content": "13.5%",
      "Variety": "C-306 Sharbati",
      "Foreign Matter": "0.1% max",
      "Organic Certified": "Yes (Vedic Krishi)"
    }
  },
  {
    id: "p8",
    title: "Cold-Pressed Bio Neem Shield Pesticide (10,000 PPM)",
    category: "Fertilizers",
    price: 680,
    currency: "₹",
    unit: "liter",
    location: "Hyderabad",
    organic: true,
    trending: false,
    featured: true,
    stockStatus: "In Stock",
    minOrder: "2 liters",
    shelfLife: "24 Months",
    image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1000&q=80",
    images: [
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&w=1000&q=80"
    ],
    seller: {
      name: "BioProtect AgriTech",
      verified: true,
      rating: 4.9,
      reviewsCount: 88,
      memberSince: "Oct 2022",
      activeListings: 9,
      responseTime: "Replies in ~15m",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80"
    },
    quantity: 350,
    description:
      "100% Pure cold-pressed Azadirachtin (10,000 PPM) botanical insect repellent. Controls over 200 species of pests including aphids, whiteflies, caterpillars, and leaf miners without harming pollinators.",
    specs: {
      "Active Ingredient": "Azadirachtin 1.0% w/w",
      "Solubility": "Emulsifiable concentrate",
      "Application Dosage": "2-3 ml per Liter of water",
      "Zero Residue": "Certified for Organic Export"
    }
  }
];
