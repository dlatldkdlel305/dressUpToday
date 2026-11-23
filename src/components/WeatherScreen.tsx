import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  Check,
  ChevronLeft,
  Loader2,
  LocateFixed,
  MapPin,
  Search,
  X,
} from 'lucide-react';
import {
  CITIES,
  CityId,
  OTHER_CITY_SUBREGIONS,
  SEOUL_DISTRICTS,
  SEOUL_DONGS,
  SubRegion,
} from '../data/koreaRegions';
import {fetchWeather, WeatherSummary} from '../services/weatherService';

interface WeatherScreenProps {
  onBack: () => void;
  onProceedToRecommend: (locationLabel: string, weather: WeatherSummary) => void;
}

interface ActiveLocation {
  label: string;
  lat: number;
  lon: number;
  subRegionId?: string;
}

type GeoStatus = 'idle' | 'checking' | 'granted' | 'failed';

export default function WeatherScreen({
  onBack,
  onProceedToRecommend,
}: WeatherScreenProps) {
  const [geoStatus, setGeoStatus] = useState<GeoStatus>('idle');
  const [selectedCity, setSelectedCity] = useState<CityId | null>(null);
  const [selectedSeoulDistrict, setSelectedSeoulDistrict] = useState<string | null>(null);
  const [dongSearch, setDongSearch] = useState('');
  const [activeLocation, setActiveLocation] = useState<ActiveLocation | null>(null);

  const [weather, setWeather] = useState<WeatherSummary | null>(null);
  const [isLoadingWeather, setIsLoadingWeather] = useState(false);
  const [weatherError, setWeatherError] = useState<string | null>(null);
  const [nudgeLocation, setNudgeLocation] = useState(false);

  const locationHeadingRef = useRef<HTMLDivElement | null>(null);
  const weatherCardRef = useRef<HTMLDivElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const loadWeatherForCoords = useCallback(async (lat: number, lon: number) => {
    if (abortRef.current) {
      abortRef.current.abort();
    }
    const controller = new AbortController();
    abortRef.current = controller;

    setIsLoadingWeather(true);
    setWeatherError(null);

    try {
      const result = await fetchWeather(lat, lon, controller.signal);
      if (!controller.signal.aborted) {
        setWeather(result);
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        return;
      }
      if (!controller.signal.aborted) {
        setWeather(null);
        setWeatherError('날씨를 불러오지 못했어요. 다시 시도해 주세요.');
      }
    } finally {
      if (!controller.signal.aborted) {
        setIsLoadingWeather(false);
      }
    }
  }, []);

  const requestCurrentLocation = useCallback(() => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setGeoStatus('failed');
      return;
    }

    setGeoStatus('checking');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const {latitude, longitude} = position.coords;
        setGeoStatus('granted');
        setSelectedCity(null);
        setSelectedSeoulDistrict(null);
        setDongSearch('');
        setActiveLocation({
          label: '현재 위치',
          lat: latitude,
          lon: longitude,
        });
        void loadWeatherForCoords(latitude, longitude);
      },
      () => {
        setGeoStatus('failed');
      },
      {
        enableHighAccuracy: false,
        timeout: 6000,
        maximumAge: 0,
      },
    );
  }, [loadWeatherForCoords]);

  useEffect(() => {
    requestCurrentLocation();
    return () => {
      if (abortRef.current) {
        abortRef.current.abort();
      }
    };
  }, [requestCurrentLocation]);

  const handleSelectCity = (cityId: CityId) => {
    setSelectedCity(cityId);
    setSelectedSeoulDistrict(null);
    setDongSearch('');
  };

  const handleSelectSubRegion = (cityName: string, subRegion: SubRegion) => {
    const fullLabel = subRegion.district
      ? `${cityName} ${subRegion.district} ${subRegion.name}`
      : `${cityName} ${subRegion.name}`;

    setActiveLocation({
      label: fullLabel,
      lat: subRegion.lat,
      lon: subRegion.lon,
      subRegionId: subRegion.id,
    });
    void loadWeatherForCoords(subRegion.lat, subRegion.lon);

    requestAnimationFrame(() => {
      weatherCardRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    });
  };

  const filteredSeoulDongs = useMemo(() => {
    const keyword = dongSearch.trim();
    if (keyword.length > 0) {
      return SEOUL_DONGS.filter(
        (dong) =>
          dong.name.includes(keyword) ||
          (dong.district && dong.district.includes(keyword)),
      );
    }
    if (selectedSeoulDistrict) {
      return SEOUL_DONGS.filter((dong) => dong.district === selectedSeoulDistrict);
    }
    return [];
  }, [dongSearch, selectedSeoulDistrict]);

  const selectedCityInfo = useMemo(
    () => CITIES.find((c) => c.id === selectedCity) ?? null,
    [selectedCity],
  );

  const locationMessage =
    geoStatus === 'failed'
      ? '위치를 찾지 못했어요. 지역을 골라 주세요'
      : '지역을 골라 주세요';

  const handleRecommendClick = () => {
    if (!activeLocation || !weather || isLoadingWeather) {
      setNudgeLocation(false);
      requestAnimationFrame(() => {
        setNudgeLocation(true);
      });
      locationHeadingRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
      return;
    }
    onProceedToRecommend(activeLocation.label, weather);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100/80 via-[#F4FAFF] to-[#FFFFFF] text-[#0F2942] flex flex-col">
      {/* Top Header */}
      <header className="w-full border-b border-sky-200/70 bg-white/80 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 py-4 flex items-center justify-between">
          <span className="text-xl sm:text-2xl font-bold tracking-tight text-sky-700 whitespace-nowrap shrink-0">
            오늘 착장
          </span>
          <span className="text-sm sm:text-base font-medium text-sky-700/80 whitespace-nowrap shrink-0">
            오늘 날씨
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-3xl mx-auto px-5 sm:px-8 pt-6 pb-10 sm:pt-9 sm:pb-12">
        {/* Intro Heading */}
        <div className="mb-7 sm:mb-8">
          <h1 className="text-[28px] sm:text-[34px] font-bold tracking-tight text-[#0F2942] leading-tight text-balance">
            오늘 날씨
          </h1>
          <p className="mt-2 text-base sm:text-lg text-slate-600 leading-relaxed">
            지금 계신 곳의 날씨를 확인한 뒤 옷차림을 알아보세요.
          </p>
        </div>

        {/* Weather Summary Card (Loading / Loaded / Error) */}
        {(isLoadingWeather || weather || weatherError) && (
          <section
            ref={weatherCardRef}
            aria-live="polite"
            className="mb-8 rounded-3xl border-2 border-sky-300 bg-white p-5 sm:p-7 shadow-md shadow-sky-200/50"
          >
            {isLoadingWeather ? (
              <div className="flex items-center justify-center gap-3 py-5 text-sky-700">
                <Loader2 className="w-6 h-6 animate-spin shrink-0" aria-hidden="true" />
                <span className="text-xl sm:text-2xl font-bold">
                  날씨를 확인하는 중…
                </span>
              </div>
            ) : weatherError ? (
              <div className="text-center py-3">
                <p className="text-lg font-semibold text-[#0F2942]">{weatherError}</p>
                {activeLocation && (
                  <button
                    type="button"
                    onClick={() =>
                      void loadWeatherForCoords(activeLocation.lat, activeLocation.lon)
                    }
                    className="mt-4 min-h-[48px] px-6 py-2.5 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white text-base font-bold transition-colors cursor-pointer"
                  >
                    다시 확인하기
                  </button>
                )}
              </div>
            ) : weather ? (
              <div>
                {activeLocation && (
                  <div className="flex items-center gap-1.5 text-base sm:text-lg font-semibold text-sky-700 mb-3">
                    <MapPin className="w-5 h-5 shrink-0" aria-hidden="true" />
                    <span>{activeLocation.label}</span>
                  </div>
                )}

                <p className="text-2xl sm:text-[28px] font-bold text-[#0F2942] leading-snug tabular-nums">
                  {weather.weatherEmoji} 지금 {weather.temperature}℃ (체감{' '}
                  {weather.apparentTemperature}℃) · {weather.weatherLabel}
                </p>

                <p className="mt-3 text-lg sm:text-xl font-semibold text-slate-700 leading-relaxed tabular-nums">
                  오늘 최저 {weather.tempMin}℃ · 최고 {weather.tempMax}℃ · 비 올 확률{' '}
                  {weather.precipitationProbability}%
                </p>
              </div>
            ) : null}
          </section>
        )}

        {/* Location Selection Section */}
        <section ref={locationHeadingRef} aria-labelledby="location-heading">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div>
              <h2
                id="location-heading"
                onAnimationEnd={() => setNudgeLocation(false)}
                className={`text-xl sm:text-2xl font-bold text-[#0F2942] ${
                  nudgeLocation ? 'animate-nudge text-sky-700' : ''
                }`}
              >
                {locationMessage}
              </h2>
              {geoStatus === 'checking' && (
                <p className="mt-1 text-sm sm:text-base text-sky-700 font-medium flex items-center gap-1.5">
                  <Loader2 className="w-4 h-4 animate-spin shrink-0" aria-hidden="true" />
                  <span>현재 위치를 찾는 중이에요… 아래에서 바로 고르실 수도 있어요.</span>
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={requestCurrentLocation}
              disabled={geoStatus === 'checking'}
              className="min-h-[44px] px-4 py-2 rounded-xl border-2 border-sky-300 bg-white hover:bg-sky-50 text-sky-700 text-sm sm:text-base font-bold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-60 whitespace-nowrap shrink-0"
            >
              <LocateFixed className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>내 위치 찾기</span>
            </button>
          </div>

          {/* 1. City Selection Grid (8 Cities) */}
          <div className="grid grid-cols-4 gap-2.5 sm:gap-3">
            {CITIES.map((city) => {
              const isSelected = selectedCity === city.id;
              return (
                <button
                  key={city.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => handleSelectCity(city.id)}
                  className={`min-h-[54px] sm:min-h-[60px] px-2 py-2.5 rounded-2xl text-lg sm:text-xl font-bold transition-all duration-150 flex items-center justify-center gap-1.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-300 active:scale-[0.98] whitespace-nowrap cursor-pointer ${
                    isSelected
                      ? 'bg-sky-600 text-white border-[3px] border-sky-700 shadow-md shadow-sky-600/20'
                      : 'bg-white text-[#0F2942] border-2 border-sky-200 hover:border-sky-400 hover:bg-sky-50/70'
                  }`}
                >
                  {isSelected && (
                    <Check className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 stroke-[3]" aria-hidden="true" />
                  )}
                  <span>{city.name}</span>
                </button>
              );
            })}
          </div>

          {/* 2. Sub-region Selection */}
          {selectedCity === 'seoul' && (
            <div className="mt-6 rounded-3xl border-2 border-sky-200 bg-white p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <h3 className="text-lg sm:text-xl font-bold text-[#0F2942]">
                  서울의 동을 골라 주세요
                </h3>
                <span className="text-sm sm:text-base text-sky-700 font-medium">
                  구를 누르거나 동 이름으로 찾아보세요
                </span>
              </div>

              {/* Search Dong Input */}
              <div className="relative mb-5">
                <Search
                  className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  type="text"
                  value={dongSearch}
                  onChange={(e) => setDongSearch(e.target.value)}
                  placeholder="동 이름 검색 (예: 역삼동, 잠실동, 여의도동)"
                  aria-label="서울 동 이름 검색"
                  className="w-full min-h-[52px] pl-11 pr-11 py-3 rounded-2xl border-2 border-sky-200 bg-[#F8FCFF] text-base sm:text-lg text-[#0F2942] placeholder:text-slate-400 focus:outline-none focus:border-sky-500 focus:bg-white"
                />
                {dongSearch && (
                  <button
                    type="button"
                    onClick={() => setDongSearch('')}
                    aria-label="검색어 지우기"
                    className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-500 hover:bg-sky-100 absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* If not searching, show 구 selection first */}
              {dongSearch.trim().length === 0 && (
                <div className="mb-5">
                  <p className="text-sm sm:text-base font-semibold text-slate-600 mb-2.5">
                    1) 먼저 구를 골라 주세요
                  </p>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {SEOUL_DISTRICTS.map((district) => {
                      const isDistrictSelected = selectedSeoulDistrict === district;
                      return (
                        <button
                          key={district}
                          type="button"
                          aria-pressed={isDistrictSelected}
                          onClick={() => setSelectedSeoulDistrict(district)}
                          className={`min-h-[46px] px-2 py-2 rounded-xl text-sm sm:text-base font-bold transition-colors whitespace-nowrap cursor-pointer ${
                            isDistrictSelected
                              ? 'bg-sky-100 text-sky-900 border-2 border-sky-600'
                              : 'bg-[#F5FAFF] text-slate-700 border border-sky-200 hover:border-sky-400'
                          }`}
                        >
                          {district}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Dong Buttons */}
              {(dongSearch.trim().length > 0 || selectedSeoulDistrict) && (
                <div>
                  <p className="text-sm sm:text-base font-semibold text-slate-600 mb-2.5">
                    {dongSearch.trim().length > 0
                      ? '검색된 동을 골라 주세요'
                      : `2) ${selectedSeoulDistrict}의 동을 골라 주세요`}
                  </p>

                  {filteredSeoulDongs.length === 0 ? (
                    <p className="py-4 text-center text-base text-slate-500">
                      일치하는 동을 찾지 못했어요. 구 목록에서 선택해 보세요.
                    </p>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {filteredSeoulDongs.map((dong) => {
                        const isSelected = activeLocation?.subRegionId === dong.id;
                        return (
                          <button
                            key={dong.id}
                            type="button"
                            aria-pressed={isSelected}
                            onClick={() => handleSelectSubRegion('서울', dong)}
                            className={`min-h-[52px] px-3 py-2.5 rounded-2xl text-base sm:text-lg font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                              isSelected
                                ? 'bg-sky-600 text-white border-[3px] border-sky-700 shadow-sm'
                                : 'bg-white text-[#0F2942] border-2 border-sky-200 hover:border-sky-400 hover:bg-sky-50'
                            }`}
                          >
                            {isSelected && (
                              <Check className="w-4 h-4 shrink-0 stroke-[3]" aria-hidden="true" />
                            )}
                            <span className="truncate">{dong.name}</span>
                            {dongSearch.trim().length > 0 && dong.district && (
                              <span
                                className={`text-xs sm:text-sm font-medium shrink-0 ${
                                  isSelected ? 'text-sky-100' : 'text-slate-500'
                                }`}
                              >
                                ({dong.district})
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {selectedCity && selectedCity !== 'seoul' && selectedCityInfo && (
            <div className="mt-6 rounded-3xl border-2 border-sky-200 bg-white p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-[#0F2942] mb-4">
                {selectedCityInfo.name}의 {selectedCityInfo.subUnitLabel}
                {selectedCityInfo.subUnitLabel === '지역' ? '을' : '를'} 골라 주세요
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
                {OTHER_CITY_SUBREGIONS[selectedCity].map((sub) => {
                  const isSelected = activeLocation?.subRegionId === sub.id;
                  return (
                    <button
                      key={sub.id}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => handleSelectSubRegion(selectedCityInfo.name, sub)}
                      className={`min-h-[54px] px-3 py-3 rounded-2xl text-base sm:text-lg font-bold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer ${
                        isSelected
                          ? 'bg-sky-600 text-white border-[3px] border-sky-700 shadow-sm'
                          : 'bg-white text-[#0F2942] border-2 border-sky-200 hover:border-sky-400 hover:bg-sky-50'
                      }`}
                    >
                      {isSelected && (
                        <Check className="w-4 h-4 shrink-0 stroke-[3]" aria-hidden="true" />
                      )}
                      <span>{sub.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Bottom Action Bar */}
      <footer className="sticky bottom-0 z-20 w-full bg-gradient-to-t from-[#F4FAFF] via-[#F4FAFF]/95 to-transparent pt-3 pb-4 px-5 sm:px-8 border-t border-sky-100/80">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="min-h-[56px] sm:min-h-[60px] px-5 sm:px-7 rounded-2xl border-2 border-sky-300 bg-white hover:bg-sky-50 text-[#0F2942] text-lg sm:text-xl font-bold flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-300"
          >
            <ChevronLeft className="w-5 h-5 shrink-0" aria-hidden="true" />
            <span>이전</span>
          </button>

          <button
            type="button"
            onClick={handleRecommendClick}
            className={`flex-1 min-h-[56px] sm:min-h-[60px] px-4 rounded-2xl text-lg sm:text-xl font-bold flex items-center justify-center gap-2 transition-all duration-150 whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-300 ${
              weather && !isLoadingWeather
                ? 'bg-sky-600 hover:bg-sky-700 text-white shadow-lg shadow-sky-600/25 active:scale-[0.99]'
                : 'bg-sky-500/85 hover:bg-sky-600 text-white shadow-md shadow-sky-500/15'
            }`}
          >
            <span>🤖 옷차림 추천받기</span>
          </button>
        </div>
      </footer>
    </div>
  );
}
