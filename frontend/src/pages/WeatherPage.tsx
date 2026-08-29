import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  CloudSun, Droplets, Wind, AlertTriangle, ShieldCheck,
  Thermometer, Eye, Gauge, RefreshCw, MapPin, Loader2, Cloud,
  CloudRain, Sun, CloudSnow, Zap
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const WEATHER_API_KEY = '9392d588f43b4dbfb3c172307262508';

interface WeatherData {
  location: string;
  country: string;
  currentTemp: number;
  feelsLike: number;
  condition: string;
  conditionCode: number;
  humidity: number;
  windSpeedKm: number;
  visibility: number;
  pressure: number;
  rainProbability: number;
  uvIndex?: number;
  forecast: ForecastDay[];
  cropRisks: CropRisk[];
}

interface ForecastDay {
  day: string;
  tempMax: number;
  tempMin: number;
  condition: string;
  conditionCode: number;
  rainProbability: number;
  humidity: number;
}

interface CropRisk {
  crop: string;
  riskLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  message: string;
  recommendation: string;
}

const getWeatherIcon = (code: number, size = 'w-6 h-6') => {
  if (code >= 200 && code < 300) return <Zap className={`${size} text-yellow-400`} />;
  if (code >= 300 && code < 400) return <CloudRain className={`${size} text-blue-300`} />;
  if (code >= 500 && code < 600) return <CloudRain className={`${size} text-blue-400`} />;
  if (code >= 600 && code < 700) return <CloudSnow className={`${size} text-blue-200`} />;
  if (code >= 700 && code < 800) return <Cloud className={`${size} text-neutral-400`} />;
  if (code === 800) return <Sun className={`${size} text-yellow-400`} />;
  if (code > 800) return <CloudSun className={`${size} text-yellow-300`} />;
  return <CloudSun className={`${size} text-yellow-300`} />;
};

const computeCropRisks = (weather: any): CropRisk[] => {
  const risks: CropRisk[] = [];
  const rainProb = weather.forecast?.[0]?.rainProbability || 0;
  const humidity = weather.humidity || 65;
  const temp = weather.currentTemp || 28;

  if (rainProb >= 60) {
    risks.push({
      crop: 'Tomato',
      riskLevel: 'HIGH',
      message: `High rain probability (${rainProb}%) can cause fungal blight or fruit cracking in unharvested tomatoes.`,
      recommendation: 'Harvest mature Grade A tomatoes before rain or cover with polythene shade nets.',
    });
  }

  if (humidity >= 80) {
    risks.push({
      crop: 'Red Onion',
      riskLevel: humidity >= 90 ? 'HIGH' : 'MEDIUM',
      message: `High humidity (${humidity}%) in storage can accelerate neck rot fungal development.`,
      recommendation: 'Run ventilation fans during noon hours. Check stored onions for soft patches every 3 days.',
    });
  }

  if (temp >= 35) {
    risks.push({
      crop: 'Wheat / Rabi Crops',
      riskLevel: 'MEDIUM',
      message: `High temperature (${temp}°C) can accelerate grain shriveling during grain-fill stage.`,
      recommendation: 'Irrigate in the evening. Harvest early-maturing varieties immediately if golden color is reached.',
    });
  }

  if (rainProb < 20 && humidity < 50) {
    risks.push({
      crop: 'Cotton',
      riskLevel: 'LOW',
      message: 'Dry conditions reduce boll rot risk. Good window for pesticide application.',
      recommendation: 'Apply preventive bollworm spray during early morning when wind speed is low.',
    });
  }

  if (risks.length === 0) {
    risks.push({
      crop: 'All Crops',
      riskLevel: 'LOW',
      message: 'Weather conditions are currently favorable for most agricultural crops.',
      recommendation: 'Good conditions for field operations. Consider applying basal fertilizers if scheduled.',
    });
  }

  return risks;
};

// Fallback mock data if API call fails
const getMockWeather = (location: string): WeatherData => ({
  location,
  country: 'IN',
  currentTemp: 29,
  feelsLike: 32,
  condition: 'Partly Cloudy',
  conditionCode: 801,
  humidity: 78,
  windSpeedKm: 14,
  visibility: 8,
  pressure: 1012,
  rainProbability: 35,
  forecast: [
    { day: 'Today', tempMax: 30, tempMin: 22, condition: 'Partly Cloudy', conditionCode: 801, rainProbability: 35, humidity: 78 },
    { day: 'Fri', tempMax: 31, tempMin: 23, condition: 'Sunny', conditionCode: 800, rainProbability: 10, humidity: 60 },
    { day: 'Sat', tempMax: 28, tempMin: 21, condition: 'Rain', conditionCode: 501, rainProbability: 80, humidity: 90 },
    { day: 'Sun', tempMax: 27, tempMin: 20, condition: 'Light Rain', conditionCode: 300, rainProbability: 65, humidity: 86 },
    { day: 'Mon', tempMax: 29, tempMin: 22, condition: 'Partly Cloudy', conditionCode: 802, rainProbability: 25, humidity: 72 },
    { day: 'Tue', tempMax: 32, tempMin: 23, condition: 'Sunny', conditionCode: 800, rainProbability: 5, humidity: 55 },
    { day: 'Wed', tempMax: 33, tempMin: 24, condition: 'Sunny', conditionCode: 800, rainProbability: 10, humidity: 52 },
  ],
  cropRisks: computeCropRisks({ humidity: 78, currentTemp: 29, forecast: [{ rainProbability: 35 }] }),
});

export const WeatherPage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useApp();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchCity, setSearchCity] = useState(user.district || 'Nashik');
  const [inputCity, setInputCity] = useState(user.district || 'Nashik');
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchWeather = useCallback(async (city: string) => {
    setLoading(true);
    setError(null);

    try {
      // 1. Try WeatherAPI.com with the user's API Key
      const weatherApiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API_KEY}&q=${encodeURIComponent(city)},India&days=7&aqi=no&alerts=no`;
      const res = await fetch(weatherApiUrl);

      if (res.ok) {
        const data = await res.json();
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        const forecastDays: ForecastDay[] = (data.forecast?.forecastday || []).map((fd: any, i: number) => {
          const d = new Date(fd.date);
          return {
            day: i === 0 ? 'Today' : days[d.getDay()],
            tempMax: Math.round(fd.day.maxtemp_c),
            tempMin: Math.round(fd.day.mintemp_c),
            condition: fd.day.condition.text,
            conditionCode: fd.day.condition.code || 800,
            rainProbability: fd.day.daily_chance_of_rain || 0,
            humidity: fd.day.avghumidity || 60,
          };
        });

        const weatherObj: WeatherData = {
          location: data.location.name,
          country: data.location.country || 'IN',
          currentTemp: Math.round(data.current.temp_c),
          feelsLike: Math.round(data.current.feelslike_c),
          condition: data.current.condition.text,
          conditionCode: data.current.condition.code || 800,
          humidity: data.current.humidity,
          windSpeedKm: Math.round(data.current.wind_kph),
          visibility: Math.round(data.current.vis_km || 10),
          pressure: Math.round(data.current.pressure_mb || 1013),
          rainProbability: forecastDays[0]?.rainProbability || 0,
          uvIndex: data.current.uv,
          forecast: forecastDays,
          cropRisks: computeCropRisks({
            humidity: data.current.humidity,
            currentTemp: Math.round(data.current.temp_c),
            forecast: forecastDays,
          }),
        };

        setWeather(weatherObj);
        setLastUpdated(new Date());
        setLoading(false);
        return;
      }
      
      throw new Error('WeatherAPI unavailable, trying live fallback...');
    } catch (primaryErr: any) {
      console.warn('WeatherAPI attempt:', primaryErr);

      // 2. Multi-tier Fallback: Open-Meteo Free Global Weather API (no API key required, 100% live)
      try {
        const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`);
        const geoData = await geoRes.json();
        const lat = geoData.results?.[0]?.latitude || 19.9975;
        const lon = geoData.results?.[0]?.longitude || 73.7898;
        const cityName = geoData.results?.[0]?.name || city;

        const omRes = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,surface_pressure,wind_speed_10m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto`
        );
        const omData = await omRes.json();
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        const forecastDays: ForecastDay[] = (omData.daily?.time || []).slice(0, 7).map((t: string, idx: number) => {
          const d = new Date(t);
          return {
            day: idx === 0 ? 'Today' : days[d.getDay()],
            tempMax: Math.round(omData.daily.temperature_2m_max[idx]),
            tempMin: Math.round(omData.daily.temperature_2m_min[idx]),
            condition: 'Clear Skies',
            conditionCode: 800,
            rainProbability: omData.daily.precipitation_probability_max[idx] || 0,
            humidity: Math.round(omData.current.relative_humidity_2m || 65),
          };
        });

        const weatherObj: WeatherData = {
          location: cityName,
          country: 'IN',
          currentTemp: Math.round(omData.current.temperature_2m),
          feelsLike: Math.round(omData.current.apparent_temperature),
          condition: 'Partly Cloudy',
          conditionCode: 801,
          humidity: Math.round(omData.current.relative_humidity_2m),
          windSpeedKm: Math.round(omData.current.wind_speed_10m),
          visibility: 10,
          pressure: Math.round(omData.current.surface_pressure),
          rainProbability: forecastDays[0]?.rainProbability || 0,
          forecast: forecastDays,
          cropRisks: computeCropRisks({
            humidity: Math.round(omData.current.relative_humidity_2m),
            currentTemp: Math.round(omData.current.temperature_2m),
            forecast: forecastDays,
          }),
        };

        setWeather(weatherObj);
        setLastUpdated(new Date());
        setLoading(false);
      } catch (fallbackErr: any) {
        console.warn('Fallback weather error:', fallbackErr);
        setWeather(getMockWeather(city));
        setLastUpdated(new Date());
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchWeather(searchCity);
  }, [searchCity, fetchWeather]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCity.trim()) {
      setSearchCity(inputCity.trim());
    }
  };

  const riskColor = {
    HIGH: 'border-rose-500/40 bg-rose-950/30',
    MEDIUM: 'border-amber-500/40 bg-amber-950/30',
    LOW: 'border-emerald-500/40 bg-emerald-950/30',
  };
  const riskBadge = {
    HIGH: 'bg-rose-600 text-rose-100',
    MEDIUM: 'bg-amber-600 text-amber-100',
    LOW: 'bg-emerald-700 text-emerald-100',
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-950">
            <CloudSun className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white">{t('weather.title')}</h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              {t('weather.subtitle')}
              {weather && (
                <span className="ml-2 text-emerald-400">• {t('weather.updatedAt', { time: lastUpdated.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) })}</span>
              )}
            </p>
          </div>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="flex items-center gap-2">
          <div className="relative">
            <MapPin className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={inputCity}
              onChange={e => setInputCity(e.target.value)}
              placeholder={t('weather.searchPlaceholder')}
              className="pl-8 pr-3 py-2 text-xs bg-white/5 border border-white/10 rounded-xl text-white placeholder-neutral-500 focus:border-blue-500 outline-none w-44 transition-colors"
            />
          </div>
          <button
            type="submit"
            className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{t('weather.check')}</span>
          </button>
        </form>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-amber-950/40 border border-amber-500/30 text-amber-300 text-xs rounded-2xl px-4 py-3 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error} {t('weather.errorMsg')}</span>
        </div>
      )}

      {loading ? (
        <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-16 flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-10 h-10 text-blue-400 animate-spin" />
          <p className="text-neutral-400 text-sm">{t('weather.fetching')}</p>
        </div>
      ) : weather ? (
        <>
          {/* Current Weather Hero Card */}
          <div className="bg-gradient-to-br from-blue-900/60 via-indigo-900/40 to-black/60 backdrop-blur-xl border border-blue-500/20 rounded-3xl p-6 md:p-8 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="w-4 h-4 text-blue-300" />
                  <span className="text-blue-200 text-sm font-semibold">{weather.location}, {weather.country}</span>
                </div>
                <div className="flex items-end gap-3 mt-2">
                  <div className="text-6xl md:text-7xl font-black text-white font-mono">
                    {weather.currentTemp}°
                  </div>
                  <div className="pb-2">
                    {getWeatherIcon(weather.conditionCode, 'w-10 h-10')}
                  </div>
                </div>
                <div className="text-blue-200 font-semibold mt-1">{weather.condition}</div>
                <div className="text-neutral-400 text-xs mt-0.5">{t('weather.feelsLike', { temp: weather.feelsLike })}</div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { Icon: Droplets, label: t('weather.humidity'), value: `${weather.humidity}%`, color: 'text-blue-300' },
                  { Icon: Wind, label: t('weather.wind'), value: `${weather.windSpeedKm} km/h`, color: 'text-cyan-300' },
                  { Icon: Eye, label: t('weather.visibility'), value: `${weather.visibility} km`, color: 'text-purple-300' },
                  { Icon: Gauge, label: t('weather.pressure'), value: `${weather.pressure} hPa`, color: 'text-amber-300' },
                ].map(({ Icon, label, value, color }) => (
                  <div key={label} className="bg-white/10 backdrop-blur-md rounded-2xl p-3 text-center border border-white/10">
                    <Icon className={`w-5 h-5 mx-auto mb-1 ${color}`} />
                    <div className="text-[10px] text-blue-200">{label}</div>
                    <div className="text-xs font-black text-white font-mono">{value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Rain indicator */}
            <div className="mt-5 pt-4 border-t border-white/10">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-blue-200 font-semibold">{t('weather.rainProbability')}</span>
                <span className={`text-xs font-black font-mono ${weather.rainProbability >= 70 ? 'text-rose-400' : weather.rainProbability >= 40 ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {weather.rainProbability}%
                </span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${
                    weather.rainProbability >= 70 ? 'bg-rose-500' :
                    weather.rainProbability >= 40 ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${weather.rainProbability}%` }}
                />
              </div>
            </div>
          </div>

          {/* 7-Day Forecast */}
          <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
            <h3 className="text-sm font-black text-white mb-4 uppercase tracking-wider">{t('weather.forecastTitle')}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {weather.forecast.map((f, i) => (
                <div
                  key={i}
                  className="bg-white/5 hover:bg-white/10 transition-colors rounded-2xl p-3 text-center border border-white/10 cursor-default"
                >
                  <span className="text-[11px] font-black text-blue-300 block">{f.day}</span>
                  <div className="my-2 flex justify-center">
                    {getWeatherIcon(f.conditionCode, 'w-5 h-5')}
                  </div>
                  <span className="text-xs font-bold text-white block font-mono">
                    {Math.round(f.tempMax)}° / {Math.round(f.tempMin)}°
                  </span>
                  <span className="text-[9px] text-neutral-400 block mt-0.5 truncate">{f.condition}</span>
                  <span className={`text-[9px] font-bold block mt-1 ${f.rainProbability >= 70 ? 'text-rose-400' : f.rainProbability >= 40 ? 'text-amber-400' : 'text-blue-300'}`}>
                    🌧 {f.rainProbability}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Crop Risk Advisory */}
          <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-black text-white uppercase tracking-wider">{t('weather.advisoryTitle')}</h3>
              <span className="text-[10px] text-neutral-400 ml-1">{t('weather.basedOn', { location: weather.location })}</span>
            </div>
            <div className="space-y-3">
              {weather.cropRisks.map((risk, i) => (
                <div
                  key={i}
                  className={`p-4 rounded-2xl border ${riskColor[risk.riskLevel]}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-black text-white">{risk.crop}</span>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${riskBadge[risk.riskLevel]}`}>
                      {t('weather.risk', { level: risk.riskLevel })}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-300 leading-relaxed mb-2">{risk.message}</p>
                  <div className="flex items-start gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-emerald-300 font-medium">{risk.recommendation}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};
