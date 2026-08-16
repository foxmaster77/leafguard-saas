import { DailyForecast } from './weather';

export interface DiseaseRiskAssessment {
  riskLevel: 'Low' | 'Moderate' | 'High';
  riskScore: number; // 0-100
  title: string;
  title_bn: string;
  title_hi: string;
  explanation: string;
  explanation_bn: string;
  explanation_hi: string;
  actionableAdvice: string;
  actionableAdvice_bn: string;
  actionableAdvice_hi: string;
  riskFactors: string[];
}

// Pathogen classification dictionaries
const FUNGAL_KEYWORDS = ['blight', 'blast', 'rust', 'mildew', 'spot', 'rot', 'smut', 'anthracnose', 'scab'];
const BACTERIAL_KEYWORDS = ['bacterial', 'wilt', 'canker', 'soft rot'];
const PEST_KEYWORDS = ['aphid', 'hopper', 'borer', 'caterpillar', 'mite', 'pest', 'worm', 'curl'];

export function calculateDiseaseSpreadRisk(
  diseaseName: string = '',
  cropName: string = '',
  forecast: DailyForecast[] = []
): DiseaseRiskAssessment {
  const disease = (diseaseName || '').toLowerCase();
  const isHealthy = disease.includes('healthy') || disease === '';
  const isFungal = FUNGAL_KEYWORDS.some(k => disease.includes(k));
  const isBacterial = BACTERIAL_KEYWORDS.some(k => disease.includes(k));
  const isPest = PEST_KEYWORDS.some(k => disease.includes(k));

  const avgHumidity = forecast.length > 0
    ? Math.round(forecast.reduce((a, b) => a + b.humidity, 0) / forecast.length)
    : 75;
  const maxRain = forecast.length > 0
    ? Math.max(...forecast.map(f => f.rain_probability))
    : 50;
  const avgTemp = forecast.length > 0
    ? Math.round(forecast.reduce((a, b) => a + b.temp, 0) / forecast.length)
    : 30;

  const riskFactors: string[] = [];
  if (avgHumidity >= 75) riskFactors.push(`High average humidity (${avgHumidity}%)`);
  if (maxRain >= 50) riskFactors.push(`Elevated rain chance (${maxRain}%)`);
  if (avgTemp >= 28) riskFactors.push(`Warm ambient temp (${avgTemp}°C)`);

  // Scenario 1: Healthy Crop
  if (isHealthy) {
    return {
      riskLevel: 'Low',
      riskScore: 20,
      title: 'Optimal Crop Conditions',
      title_bn: 'অনুকূল ও নিরাপদ আবহাওয়া',
      title_hi: 'फसल के लिए सुरक्षित मौसम',
      explanation: `Current weather conditions (${avgHumidity}% humidity, ${avgTemp}°C) present low danger for healthy ${cropName || 'crops'}.`,
      explanation_bn: `বর্তমান আবহাওয়া (${avgHumidity}% আর্দ্রতা) আপনার সুস্থ ফসলে রোগ ছড়ানোর ঝুঁকি তৈরি করছে না।`,
      explanation_hi: `वर्तमान मौसम (${avgHumidity}% नमी) स्वस्थ फसल के लिए सुरक्षित है।`,
      actionableAdvice: 'Maintain regular scouting and avoid unnecessary chemical spraying.',
      actionableAdvice_bn: 'নিয়মিত খেত পর্যবেক্ষণ করুন, অতিরিক্ত রাসায়নিক স্প্রে করার প্রয়োজন নেই।',
      actionableAdvice_hi: 'नियमित रूप से खेत की निगरानी रखें, बेवजह दवा का छिड़काव न करें।',
      riskFactors
    };
  }

  // Scenario 2: Fungal Pathogen in High Humidity (e.g. Late Blight, Rice Blast, Rust)
  if (isFungal && (avgHumidity >= 70 || maxRain >= 40)) {
    return {
      riskLevel: 'High',
      riskScore: 88,
      title: 'High Pathogen Spread Warning',
      title_bn: '⚠️ তীব্র রোগ সংক্রমণের সতর্কতা',
      title_hi: '⚠️ तीव्र रोग फैलाव की चेतावनी',
      explanation: `High atmospheric humidity (${avgHumidity}%) and impending rainfall (${maxRain}%) create optimal conditions for rapid fungal sporulation and field-to-field spread.`,
      explanation_bn: `উচ্চ আর্দ্রতা (${avgHumidity}%) এবং বৃষ্টির সম্ভাবনা ছত্রাকজনিত রোগের দ্রুত বিস্তারের চরম অনুকূল। আগামী ৪৮ ঘণ্টার মধ্যে পুরো খেতে রোগ ছড়িয়ে পড়তে পারে।`,
      explanation_hi: `अधिक नमी (${avgHumidity}%) और बारिश के कारण फंगल रोग बहुत तेजी से आसपास के खेतों में फैल सकता है।`,
      actionableAdvice: `Apply recommended systemic fungicide within 24–48 hours before rain washes away protective foliar cover.`,
      actionableAdvice_bn: `বৃষ্টি নামার আগেই আগামী ২৪–৪৮ ঘণ্টার মধ্যে সুপারিশকৃত ছত্রাকনাশক স্প্রে সম্পন্ন করুন।`,
      actionableAdvice_hi: `बारिश शुरू होने से पहले अगले 24–48 घंटों में सुझाई गई फफूंदनाशक दवा का छिड़काव करें।`,
      riskFactors
    };
  }

  // Scenario 3: Bacterial Pathogen with High Rain/Moisture
  if (isBacterial && (maxRain >= 45 || avgTemp >= 28)) {
    return {
      riskLevel: 'Moderate',
      riskScore: 65,
      title: 'Moderate Bacterial Spread Alert',
      title_bn: 'মাঝারি ব্যাকটেরিয়া সংক্রমণের ঝুঁকি',
      title_hi: 'मध्यम जीवाणु फैलाव का खतरा',
      explanation: `Warm temperatures (${avgTemp}°C) with wet foliage facilitate bacterial oozing and water splash transmission across plant rows.`,
      explanation_bn: `বৃষ্টির জল এবং গরম আবহাওয়ায় ব্যাকটেরিয়া দ্রুত গাছের পাতায় ছড়াতে পারে। খেতের জল নিষ্কাশন জরুরি।`,
      explanation_hi: `गीले पत्तों और गर्मी के कारण जीवाणु रोग तेजी से फैल सकते हैं। जल निकासी का ध्यान रखें।`,
      actionableAdvice: `Ensure field drainage to avoid waterlogging and apply recommended bactericide during dry morning hours.`,
      actionableAdvice_bn: `খেতে জল জমতে দেবেন না এবং সকালে রোদ থাকলে নির্ধারিত ব্যাকটেরিয়ানাশক স্প্রে করুন।`,
      actionableAdvice_hi: `खेत में पानी जमा न होने दें और शुष्क मौसम में जीवाणुनाशक दवा का छिड़काव करें।`,
      riskFactors
    };
  }

  // Scenario 4: Pests & Sucking Insects in Warm Spells
  if (isPest && avgTemp >= 27) {
    return {
      riskLevel: 'Moderate',
      riskScore: 58,
      title: 'Pest Vector Multiplication Risk',
      title_bn: 'কীটপতঙ্গের বংশবৃদ্ধির মাঝারি ঝুঁকি',
      title_hi: 'कीट फैलाव का मध्यम जोखिम',
      explanation: `Warm temperatures accelerate insect lifecycle and feeding activity on tender leaves.`,
      explanation_bn: `উষ্ণ আবহাওয়ায় পোকার আক্রমণ এবং বংশবৃদ্ধি দ্রুত বাড়তে পারে।`,
      explanation_hi: `गर्म मौसम में कीटों का प्रकोप तेजी से बढ़ सकता है।`,
      actionableAdvice: `Install yellow sticky traps and spray recommended targeted organic or contact insecticide.`,
      actionableAdvice_bn: `হলুদ ফাঁদ (Sticky Trap) লাগান এবং নির্ধারিত কীটনাশক প্রয়োগ করুন।`,
      actionableAdvice_hi: `पीले चिपचिपे जाल लगाएं और सुझाई गई कीटनाशक दवा का प्रयोग करें।`,
      riskFactors
    };
  }

  // Scenario 5: General Default / Dry Weather
  return {
    riskLevel: 'Low',
    riskScore: 35,
    title: 'Low Spread Pressure',
    title_bn: 'সংক্রমণের ঝুঁকি কম',
    title_hi: 'फैलाव का कम जोखिम',
    explanation: `Moderate humidity (${avgHumidity}%) and low rain chance will suppress sudden spore flare-ups.`,
    explanation_bn: `স্বাভাবিক আর্দ্রতায় এই মুহূর্তে রোগটি দ্রুত ছড়ানোর আশঙ্কা কম।`,
    explanation_hi: `सामान्य नमी के कारण रोग का फैलाव फिलहाल धीमा रहेगा।`,
    actionableAdvice: `Treat currently affected plants and monitor perimeter rows every 3 days.`,
    actionableAdvice_bn: `আক্রান্ত গাছে প্রয়োজনীয় ওষুধ দিন এবং ৩ দিন পর পর খেত ঘুরে দেখুন।`,
    actionableAdvice_hi: `प्रभावित पौधों का उपचार करें और हर 3 दिन में खेत का मुआयना करें।`,
    riskFactors
  };
}
