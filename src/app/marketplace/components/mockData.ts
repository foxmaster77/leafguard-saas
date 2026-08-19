export type Product = {
  id: string;
  title: string;
  category: "Crops" | "Machinery" | "Seeds" | "Fertilizers";
  price: number;
  currency: "₹" | "$";
  unit: "kg" | "ton" | "piece";
  location: string;
  organic: boolean;
  image: string;
  seller: { name: string; verified: boolean; rating: number };
  harvestDate?: string;
  quantity?: number;
  description?: string;
};

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "p1",
    title: "Organic Rice – Basmati",
    category: "Crops",
    price: 50,
    currency: "₹",
    unit: "kg",
    location: "Coimbatore",
    organic: true,
    image: "/images/placeholder-rice.jpg",
    seller: { name: "Ramesh Farm", verified: true, rating: 4.8 },
    harvestDate: "2026-07-15",
    quantity: 1200,
    description:
      "Premium quality organic basmati rice grown without pesticides. Certified organic by APEDA. Long grain, aromatic, and perfect for biryani.",
  },
  {
    id: "p2",
    title: "Tractor Model X200",
    category: "Machinery",
    price: 1500,
    currency: "$",
    unit: "piece",
    location: "Pune",
    organic: false,
    image: "/images/placeholder-tractor.jpg",
    seller: { name: "AgriMach Tools", verified: true, rating: 4.5 },
    quantity: 3,
    description:
      "45 HP diesel tractor with power steering and hydraulic lift. 2 years old, well maintained. Suitable for medium to large farms.",
  },
  {
    id: "p3",
    title: "Urea 46% N Fertilizer",
    category: "Fertilizers",
    price: 30,
    currency: "₹",
    unit: "kg",
    location: "Hyderabad",
    organic: false,
    image: "/images/placeholder-fertilizer.jpg",
    seller: { name: "NitroChem", verified: false, rating: 3.9 },
    quantity: 5000,
    description:
      "Industrial grade urea fertilizer with 46% nitrogen content. Ideal for all kharif and rabi crops. Available in 50kg bags.",
  },
  {
    id: "p4",
    title: "Hybrid Tomato Seeds – VNR 412",
    category: "Seeds",
    price: 800,
    currency: "₹",
    unit: "kg",
    location: "Mysore",
    organic: false,
    image: "/images/placeholder-seeds.jpg",
    seller: { name: "Green Agro Seeds", verified: true, rating: 4.6 },
    quantity: 200,
    description:
      "High-yield hybrid tomato seeds. Disease resistant, suitable for open field and poly-house cultivation. Maturity: 65–70 days.",
  },
  {
    id: "p5",
    title: "Fresh Alphonso Mangoes",
    category: "Crops",
    price: 180,
    currency: "₹",
    unit: "kg",
    location: "Ratnagiri",
    organic: true,
    image: "/images/placeholder-mango.jpg",
    seller: { name: "Konkan Orchards", verified: true, rating: 4.9 },
    harvestDate: "2026-05-10",
    quantity: 800,
    description:
      "GI-tagged Alphonso mangoes from Ratnagiri. Hand-picked, naturally ripened, and chemical-free. Sweet, fiber-less pulp.",
  },
  {
    id: "p6",
    title: "Drip Irrigation Kit – 1 Acre",
    category: "Machinery",
    price: 12000,
    currency: "₹",
    unit: "piece",
    location: "Coimbatore",
    organic: false,
    image: "/images/placeholder-drip.jpg",
    seller: { name: "WaterSmart Agri", verified: true, rating: 4.3 },
    quantity: 15,
    description:
      "Complete drip irrigation kit for 1 acre with lateral pipes, drippers, filter, and fertigation tank. Saves up to 60% water vs flood irrigation.",
  },
];
