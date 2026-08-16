export interface DailyForecast {
  date: string;
  day: string;
  temp: number;
  humidity: number;
  rain_probability: number;
  condition: string;
  icon: string;
}

export interface WeatherForecastResponse {
  source: 'live_api' | 'cached_demo';
  locationName: string;
  forecast: DailyForecast[];
  avgHumidity: number;
  maxRainChance: number;
}

// Deterministic baseline forecasts for West Bengal demo districts
const MOCK_WB_FORECASTS: Record<string, DailyForecast[]> = {
  // Hooghly (712101) - Humid monsoon / pre-blight weather
  '712101': [
    { date: '2026-08-16', day: 'Today', temp: 31, humidity: 82, rain_probability: 65, condition: 'Humid Rain', icon: '🌧️' },
    { date: '2026-08-17', day: 'Mon', temp: 30, humidity: 86, rain_probability: 75, condition: 'Heavy Showers', icon: '⛈️' },
    { date: '2026-08-18', day: 'Tue', temp: 29, humidity: 78, rain_probability: 50, condition: 'Overcast', icon: '☁️' },
    { date: '2026-08-19', day: 'Wed', temp: 32, humidity: 74, rain_probability: 30, condition: 'Partly Cloudy', icon: '⛅' },
    { date: '2026-08-20', day: 'Thu', temp: 33, humidity: 71, rain_probability: 20, condition: 'Warm & Humid', icon: '🌤️' }
  ],
  // Burdwan (713101) - Blast favorable warm & rainy
  '713101': [
    { date: '2026-08-16', day: 'Today', temp: 30, humidity: 79, rain_probability: 60, condition: 'Scattered Rain', icon: '🌦️' },
    { date: '2026-08-17', day: 'Mon', temp: 29, humidity: 84, rain_probability: 70, condition: 'Thunderstorm', icon: '⛈️' },
    { date: '2026-08-18', day: 'Tue', temp: 31, humidity: 76, rain_probability: 45, condition: 'Cloudy', icon: '☁️' },
    { date: '2026-08-19', day: 'Wed', temp: 32, humidity: 72, rain_probability: 25, condition: 'Partly Sunny', icon: '⛅' },
    { date: '2026-08-20', day: 'Thu', temp: 33, humidity: 68, rain_probability: 15, condition: 'Sunny', icon: '☀️' }
  ],
  // Murshidabad (742101) - Moderate humidity
  '742101': [
    { date: '2026-08-16', day: 'Today', temp: 32, humidity: 72, rain_probability: 35, condition: 'Partly Cloudy', icon: '⛅' },
    { date: '2026-08-17', day: 'Mon', temp: 33, humidity: 68, rain_probability: 20, condition: 'Sunny', icon: '☀️' },
    { date: '2026-08-18', day: 'Tue', temp: 31, humidity: 75, rain_probability: 40, condition: 'Light Rain', icon: '🌦️' },
    { date: '2026-08-19', day: 'Wed', temp: 30, humidity: 70, rain_probability: 30, condition: 'Overcast', icon: '☁️' },
    { date: '2026-08-20', day: 'Thu', temp: 32, humidity: 65, rain_probability: 10, condition: 'Clear Skies', icon: '☀️' }
  ],
  // Default general WB forecast
  'default': [
    { date: '2026-08-16', day: 'Today', temp: 31, humidity: 78, rain_probability: 55, condition: 'Scattered Showers', icon: '🌦️' },
    { date: '2026-08-17', day: 'Mon', temp: 30, humidity: 82, rain_probability: 65, condition: 'Rain & Humid', icon: '🌧️' },
    { date: '2026-08-18', day: 'Tue', temp: 29, humidity: 75, rain_probability: 40, condition: 'Overcast', icon: '☁️' },
    { date: '2026-08-19', day: 'Wed', temp: 32, humidity: 70, rain_probability: 25, condition: 'Partly Cloudy', icon: '⛅' },
    { date: '2026-08-20', day: 'Thu', temp: 33, humidity: 67, rain_probability: 15, condition: 'Sunny', icon: '☀️' }
  ]
};

export async function get5DayForecast(
  lat: number = 22.9031,
  lng: number = 88.3908,
  pincode: string = '712101'
): Promise<WeatherForecastResponse> {
  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (apiKey) {
    try {
      const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}&units=metric&appid=${apiKey}`;
      const res = await fetch(url, { next: { revalidate: 3600 } });

      if (res.ok) {
        const data = await res.json();
        const list = data.list || [];
        
        // Group 3-hour forecasts into daily summaries (midday ~12:00 readings)
        const dailyMap: Record<string, DailyForecast> = {};
        const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        list.forEach((item: any, idx: number) => {
          const d = new Date(item.dt * 1000);
          const dateKey = d.toISOString().split('T')[0];
          
          if (!dailyMap[dateKey] && Object.keys(dailyMap).length < 5) {
            const dayLabel = Object.keys(dailyMap).length === 0 ? 'Today' : daysOfWeek[d.getDay()];
            const main = item.weather?.[0]?.main || 'Clear';
            let icon = '⛅';
            if (main.includes('Rain')) icon = '🌧️';
            else if (main.includes('Thunder')) icon = '⛈️';
            else if (main.includes('Cloud')) icon = '☁️';
            else if (main.includes('Clear')) icon = '☀️';

            dailyMap[dateKey] = {
              date: dateKey,
              day: dayLabel,
              temp: Math.round(item.main.temp),
              humidity: item.main.humidity,
              rain_probability: Math.round((item.pop || 0) * 100),
              condition: item.weather?.[0]?.description || main,
              icon
            };
          }
        });

        const forecastList = Object.values(dailyMap);
        if (forecastList.length >= 3) {
          const avgHum = Math.round(forecastList.reduce((acc, f) => acc + f.humidity, 0) / forecastList.length);
          const maxRain = Math.max(...forecastList.map(f => f.rain_probability));

          return {
            source: 'live_api',
            locationName: data.city?.name || `Region ${pincode}`,
            forecast: forecastList,
            avgHumidity: avgHum,
            maxRainChance: maxRain
          };
        }
      }
    } catch (err: any) {
      console.warn('OpenWeatherMap API call failed, using deterministic cached forecast:', err?.message);
    }
  }

  // Guaranteed deterministic fallback
  const mockList = MOCK_WB_FORECASTS[pincode] || MOCK_WB_FORECASTS['default'];
  const avgHum = Math.round(mockList.reduce((acc, f) => acc + f.humidity, 0) / mockList.length);
  const maxRain = Math.max(...mockList.map(f => f.rain_probability));

  return {
    source: 'cached_demo',
    locationName: `Pincode ${pincode} (West Bengal)`,
    forecast: mockList,
    avgHumidity: avgHum,
    maxRainChance: maxRain
  };
}
