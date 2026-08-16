export interface GovtScheme {
  id: string;
  name: string;
  name_bn: string;
  name_hi: string;
  category: 'Insurance' | 'Direct Aid' | 'Input Subsidy' | 'Soil & Organic';
  badge: string;
  description: string;
  description_bn: string;
  description_hi: string;
  eligibility_note: string;
  eligibility_note_bn: string;
  eligibility_note_hi: string;
  official_link: string;
  spokenTip_bn: string;
  spokenTip_hi: string;
  spokenTip_en: string;
  triggerSeverity?: ('Low' | 'Medium' | 'High' | 'Critical')[];
}

export const GOVT_SCHEMES: GovtScheme[] = [
  {
    id: 'bsb-wb',
    name: 'Bangla Shasya Bima (BSB)',
    name_bn: 'বাংলা শস্য বীমা (BSB)',
    name_hi: 'बांग्ला शस्य बीमा योजना',
    category: 'Insurance',
    badge: '100% WB Subsidized',
    description: 'Government of West Bengal provides 100% premium-free crop loss insurance for all farmers.',
    description_bn: 'পশ্চিমবঙ্গ সরকারের সম্পূর্ণ বিনামূল্যে শস্য বীমা — রোগ বা বন্যায় ফসলের ক্ষতি হলে সম্পূর্ণ ক্ষতিপূরণ।',
    description_hi: 'पश्चिम बंगाल सरकार द्वारा 100% मुफ्त फसल बीमा — रोग या आपदा में नुकसान की भरपाई।',
    eligibility_note: 'All WB farmers (Paddy, Potato, Wheat, Jute) registered via Krishi Bhavan.',
    eligibility_note_bn: 'পশ্চিমবঙ্গের সকল কৃষক (ধান, আলু, গম, পাট চাষি) এই বীমার যোগ্য।',
    eligibility_note_hi: 'पश्चिम बंगाल के सभी किसान बिना किसी प्रीमियम के पात्र हैं।',
    official_link: 'https://banglashasyabima.net',
    spokenTip_bn: 'আপনি বাংলা শস্য বীমা যোজনার আওতায় ক্ষতিপূরণের জন্য স্থানীয় কৃষি অফিসে যোগাযোগ করতে পারেন।',
    spokenTip_hi: 'आप बांग्ला शस्य बीमा योजना के तहत नुकसान की भरपाई के लिए आवेदन कर सकते हैं।',
    spokenTip_en: 'You can claim crop loss relief under the Bangla Shasya Bima scheme.',
    triggerSeverity: ['High', 'Critical']
  },
  {
    id: 'krishak-bandhu',
    name: 'Krishak Bandhu Scheme',
    name_bn: 'কৃষক বন্ধু প্রকল্প',
    name_hi: 'कृषक बंधु योजना',
    category: 'Direct Aid',
    badge: '₹10,000/yr Aid + Insurance',
    description: 'Direct financial assistance of up to ₹10,000/year per acre for agricultural inputs, plus ₹2 Lakh insurance cover.',
    description_bn: 'কীটনাশক ও সার কেনার জন্য বছরে একর প্রতি ₹১০,০০০ পর্যন্ত আর্থিক সহায়তা এবং ₹২ লাখ জীবন বীমা।',
    description_hi: 'दवा और खाद के लिए प्रति वर्ष ₹10,000 तक की सीधी सहायता और बीमा सुरक्षा।',
    eligibility_note: 'All recorded farmland owners and registered Bhagchasis (sharecroppers) in West Bengal.',
    eligibility_note_bn: 'পশ্চিমবঙ্গের নথিভুক্ত কৃষক ও ভাগচাষী উভয়ই অনুদানের যোগ্য।',
    eligibility_note_hi: 'पश्चिम बंगाल के सभी भूमिधारक किसान और बटाईदार पात्र हैं।',
    official_link: 'https://krishakbandhu.wb.gov.in',
    spokenTip_bn: 'কীটনাশক ও সারের খরচের জন্য কৃষক বন্ধু প্রকল্পের আর্থিক সহায়তা ব্যবহার করুন।',
    spokenTip_hi: 'दवाई और खाद के खर्च के लिए कृषक बंधु योजना की सहायता का उपयोग करें।',
    spokenTip_en: 'Utilize Krishak Bandhu input grants for purchasing recommended plant treatments.',
    triggerSeverity: ['Medium', 'High', 'Critical']
  },
  {
    id: 'pm-kisan',
    name: 'PM-KISAN Samman Nidhi',
    name_bn: 'পিএম-কিষাণ সম্মান নিধি',
    name_hi: 'प्रधानमंत्री किसान सम्मान निधि',
    category: 'Direct Aid',
    badge: '₹6,000/yr Direct Support',
    description: 'Direct income support of ₹6,000 per year in 3 equal installments to small and marginal farmers.',
    description_bn: 'ক্ষুদ্র ও প্রান্তিক কৃষকদের অ্যাকাউন্টে বছরে ₹৬,০০০ সরাসরি সরকারি সহায়তা (৩টি কিস্তিতে)।',
    description_hi: 'सभी छोटे और सीमांत किसानों को प्रति वर्ष ₹6,000 की सीधी आर्थिक सहायता।',
    eligibility_note: 'Landholding farmer families with valid Aadhaar-linked bank accounts.',
    eligibility_note_bn: 'আধার-সংযুক্ত ব্যাঙ্ক অ্যাকাউন্ট সহ সমস্ত বৈধ কৃষক পরিবার।',
    eligibility_note_hi: 'आधार से जुड़े बैंक खाते वाले सभी भूमिधारक किसान परिवार।',
    official_link: 'https://pmkisan.gov.in',
    spokenTip_bn: 'পিএম-কিষাণ সহায়তার কিস্তি আপনার ব্যাঙ্ক অ্যাকাউন্টে সরাসরি জমা হয়।',
    spokenTip_hi: 'पीएम-किसान की सहायता राशि आपके बैंक खाते में सीधे उपलब्ध है।',
    spokenTip_en: 'PM-KISAN direct cash support helps cover seasonal crop protection inputs.',
    triggerSeverity: ['Low', 'Medium', 'High', 'Critical']
  },
  {
    id: 'soil-health',
    name: 'Soil Health Card Scheme',
    name_bn: 'সয়েল হেলথ কার্ড প্রকল্প',
    name_hi: 'मृदा स्वास्थ्य कार्ड योजना',
    category: 'Soil & Organic',
    badge: 'Free Soil Testing',
    description: 'Free comprehensive testing of 12 soil parameters with customized nutrient dosage advice to prevent pathogen vulnerability.',
    description_bn: 'বিনামূল্যে মাটির পুষ্টি উপাদান পরীক্ষা এবং রোগের ঝুঁকি কমাতে সারের সঠিক পরিমাপের পরামর্শ।',
    description_hi: 'मुफ्त मिट्टी की जांच और रोगों से बचाव के लिए सही खाद व पोषक तत्वों की सलाह।',
    eligibility_note: 'Open to all farmers at local Block Agriculture Development Offices (BADO).',
    eligibility_note_bn: 'স্থানীয় ব্লক কৃষি অফিসে (BADO) গিয়ে আবেদন করুন।',
    eligibility_note_hi: 'नजदीकी ब्लॉक कृषि कार्यालय में मुफ्त उपलब्ध।',
    official_link: 'https://soilhealth.dac.gov.in',
    spokenTip_bn: 'ফসলের রোগ প্রতিরোধ ক্ষমতা বাড়াতে বিনামূল্যে সয়েল টেস্ট করান।',
    spokenTip_hi: 'रोगों से बचाव के लिए नजदीकी केंद्र से मुफ्त मिट्टी की जांच करवाएं।',
    spokenTip_en: 'Get a free soil health test to balance nutrients and boost pathogen resilience.',
    triggerSeverity: ['Low', 'Medium']
  }
];

export function getRelevantSchemes(
  severity: string = 'Medium',
  limit = 2
): GovtScheme[] {
  const normSeverity = (severity.charAt(0).toUpperCase() + severity.slice(1).toLowerCase()) as 'Low' | 'Medium' | 'High' | 'Critical';
  
  // If High/Critical severity, prioritize crop insurance (Bangla Shasya Bima)
  if (normSeverity === 'High' || normSeverity === 'Critical') {
    const insurance = GOVT_SCHEMES.find(s => s.id === 'bsb-wb');
    const aid = GOVT_SCHEMES.find(s => s.id === 'krishak-bandhu');
    const list: GovtScheme[] = [];
    if (insurance) list.push(insurance);
    if (aid) list.push(aid);
    return list.slice(0, limit);
  }

  // Otherwise show Krishak Bandhu / PM-KISAN / Soil health
  const baseline = GOVT_SCHEMES.filter(s => s.id !== 'bsb-wb');
  return baseline.slice(0, limit);
}
