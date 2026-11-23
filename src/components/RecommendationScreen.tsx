import React from 'react';
import {Home, Loader2, RefreshCw} from 'lucide-react';
import {WeatherSummary} from '../services/weatherService';

export interface OutfitRecommendation {
  outer: string;
  top: string;
  bottom: string;
  shoes: string;
  accessory: string;
  reason: string;
}

interface RecommendationScreenProps {
  styleName: string;
  styleDescription: string;
  styleIllustration: React.ReactNode;
  locationLabel: string;
  weather: WeatherSummary;
  recommendation: OutfitRecommendation | null;
  isLoading: boolean;
  hasError: boolean;
  onRetryRecommend: () => void;
  onStartOver: () => void;
}

export default function RecommendationScreen({
  styleName,
  styleDescription,
  styleIllustration,
  locationLabel,
  weather,
  recommendation,
  isLoading,
  hasError,
  onRetryRecommend,
  onStartOver,
}: RecommendationScreenProps) {
  const itemRows = recommendation
    ? [
        {emoji: '🧥', label: '겉옷', value: recommendation.outer},
        {emoji: '👕', label: '상의', value: recommendation.top},
        {emoji: '👖', label: '하의', value: recommendation.bottom},
        {emoji: '👟', label: '신발', value: recommendation.shoes},
        {emoji: '👜', label: '소품', value: recommendation.accessory},
      ]
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100/80 via-[#F4FAFF] to-[#FFFFFF] text-[#0F2942] flex flex-col">
      {/* Top Header */}
      <header className="w-full border-b border-sky-200/70 bg-white/80 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 py-4 flex items-center justify-between">
          <span className="text-xl sm:text-2xl font-bold tracking-tight text-sky-700 whitespace-nowrap shrink-0">
            오늘 착장
          </span>
          <span className="text-sm sm:text-base font-medium text-sky-700/80 whitespace-nowrap shrink-0">
            오늘의 옷차림
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-3xl mx-auto px-5 sm:px-8 pt-6 pb-10 sm:pt-9 sm:pb-12">
        {/* Title */}
        <div className="mb-5 sm:mb-6">
          <h1 className="text-[28px] sm:text-[34px] font-bold tracking-tight text-[#0F2942] leading-tight text-balance">
            오늘의 옷차림
          </h1>
        </div>

        {/* One-line Weather Summary at the Top */}
        <div className="mb-6 rounded-2xl bg-sky-100/75 border border-sky-200 px-4 py-3 text-sm sm:text-base font-semibold text-[#0F2942] tabular-nums leading-snug">
          <p className="sm:truncate">
            {locationLabel} · {weather.weatherEmoji} 지금 {weather.temperature}℃ (체감{' '}
            {weather.apparentTemperature}℃) · {weather.weatherLabel} · 최저{' '}
            {weather.tempMin}℃ / 최고 {weather.tempMax}℃ · 비 올 확률{' '}
            {weather.precipitationProbability}%
          </p>
        </div>

        {/* Recommendation Card */}
        <section
          aria-live="polite"
          className="rounded-3xl border-2 border-sky-200 bg-white p-5 sm:p-7 shadow-md shadow-sky-200/40"
        >
          {/* Selected Style Header */}
          <div className="flex items-center gap-4 pb-5 border-b border-sky-100">
            <div className="w-18 h-18 sm:w-20 sm:h-20 shrink-0">
              {styleIllustration}
            </div>
            <div className="min-w-0">
              <div className="text-xl sm:text-2xl font-bold text-[#0F2942]">
                {styleName}
              </div>
              <p className="mt-1 text-sm sm:text-base text-slate-600">
                {styleDescription}
              </p>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="py-14 flex flex-col items-center justify-center text-center gap-4">
              <Loader2
                className="w-10 h-10 text-sky-600 animate-spin"
                aria-hidden="true"
              />
              <p className="text-xl sm:text-2xl font-bold text-sky-800">
                AI가 옷을 고르는 중이에요…
              </p>
            </div>
          )}

          {/* Error State */}
          {!isLoading && hasError && (
            <div className="py-12 px-2 text-center">
              <p className="text-xl sm:text-2xl font-bold text-[#0F2942] leading-snug">
                지금은 추천할 수 없어요.
              </p>
              <p className="mt-2 text-base sm:text-lg text-slate-600">
                잠시 후 다시 눌러 주세요
              </p>
            </div>
          )}

          {/* Recommended Outfit Content */}
          {!isLoading && !hasError && recommendation && (
            <div className="pt-5">
              <ul className="divide-y divide-sky-100">
                {itemRows.map((item) => (
                  <li
                    key={item.label}
                    className="py-4 first:pt-1 flex items-start gap-3.5 sm:gap-4"
                  >
                    <span
                      className="text-2xl sm:text-[26px] leading-none pt-0.5 shrink-0"
                      aria-hidden="true"
                    >
                      {item.emoji}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm sm:text-base font-bold text-sky-700">
                        {item.label}
                      </div>
                      <p className="mt-0.5 text-lg sm:text-xl font-bold text-[#0F2942] leading-snug">
                        {item.value}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>

              {/* 💡 추천 이유 */}
              <div className="mt-5 rounded-2xl bg-sky-50 border border-sky-200 p-4 sm:p-5">
                <div className="text-base sm:text-lg font-bold text-sky-800">
                  💡 추천 이유
                </div>
                <p className="mt-1.5 text-base sm:text-lg font-medium text-[#0F2942] leading-relaxed">
                  {recommendation.reason}
                </p>
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
            disabled={isLoading}
            onClick={onRetryRecommend}
            className={`flex-1 min-h-[56px] sm:min-h-[60px] px-4 rounded-2xl text-lg sm:text-xl font-bold flex items-center justify-center gap-2 transition-all duration-150 whitespace-nowrap focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-300 ${
              isLoading
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-sky-600 hover:bg-sky-700 text-white shadow-lg shadow-sky-600/25 active:scale-[0.99] cursor-pointer'
            }`}
          >
            <RefreshCw className="w-5 h-5 shrink-0" aria-hidden="true" />
            <span>다시 추천받기</span>
          </button>

          <button
            type="button"
            disabled={isLoading}
            onClick={onStartOver}
            className={`min-h-[56px] sm:min-h-[60px] px-5 sm:px-7 rounded-2xl border-2 text-lg sm:text-xl font-bold flex items-center justify-center gap-2 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-300 ${
              isLoading
                ? 'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'border-sky-300 bg-white hover:bg-sky-50 text-[#0F2942] cursor-pointer'
            }`}
          >
            <Home className="w-5 h-5 shrink-0" aria-hidden="true" />
            <span>처음으로</span>
          </button>
        </div>
      </footer>
    </div>
  );
}
