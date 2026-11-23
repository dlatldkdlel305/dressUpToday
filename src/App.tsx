import React, {useRef, useState} from 'react';
import {Check, ChevronRight} from 'lucide-react';
import {
  ActiveIllustration,
  CasualIllustration,
  ClassicIllustration,
  NeatIllustration,
  StyleId,
} from './components/StyleIllustrations';
import WeatherScreen from './components/WeatherScreen';
import RecommendationScreen, {
  OutfitRecommendation,
} from './components/RecommendationScreen';
import {WeatherSummary} from './services/weatherService';

const AGE_OPTIONS = ['20대', '30대', '40대', '50대', '60대', '70대 이상'] as const;
type AgeOption = (typeof AGE_OPTIONS)[number];

const GENDER_OPTIONS = ['여성', '남성', '선택 안 함'] as const;
type GenderOption = (typeof GENDER_OPTIONS)[number];

interface StyleOption {
  id: StyleId;
  name: string;
  description: string;
  renderIllustration: (selected: boolean) => React.ReactNode;
}

const STYLE_OPTIONS: StyleOption[] = [
  {
    id: 'casual',
    name: '편안한 캐주얼',
    description: '동네 산책·장보기, 편하고 무난하게',
    renderIllustration: (selected) => <CasualIllustration selected={selected} />,
  },
  {
    id: 'neat',
    name: '단정한 외출복',
    description: '모임·병원·관공서, 깔끔하게',
    renderIllustration: (selected) => <NeatIllustration selected={selected} />,
  },
  {
    id: 'active',
    name: '활동적인 운동복',
    description: '걷기·등산·운동, 가볍고 따뜻하게',
    renderIllustration: (selected) => <ActiveIllustration selected={selected} />,
  },
  {
    id: 'classic',
    name: '차분한 클래식',
    description: '격식 있는 자리, 고급스럽게',
    renderIllustration: (selected) => <ClassicIllustration selected={selected} />,
  },
];

function getObjectParticle(label: string): '을' | '를' {
  // '연령대' ends with vowel ㅐ (no final consonant) -> 를
  // '성별' ends with ㄹ -> 을
  // '선호하는 옷 스타일' ends with ㄹ -> 을
  if (label === '연령대') {
    return '를';
  }
  return '을';
}

function formatMissingMessage(missingLabels: string[]): string {
  if (missingLabels.length === 0) {
    return '';
  }
  const lastLabel = missingLabels[missingLabels.length - 1];
  const particle = getObjectParticle(lastLabel);
  return `${missingLabels.join(', ')}${particle} 골라 주세요`;
}

export default function App() {
  const [selectedAge, setSelectedAge] = useState<AgeOption | null>(null);
  const [selectedGender, setSelectedGender] = useState<GenderOption | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<StyleId | null>(null);
  const [nudgeActive, setNudgeActive] = useState(false);
  const [currentStep, setCurrentStep] = useState<'about' | 'weather' | 'recommend'>('about');

  const [weatherContext, setWeatherContext] = useState<{
    locationLabel: string;
    weather: WeatherSummary;
  } | null>(null);
  const [recommendation, setRecommendation] = useState<OutfitRecommendation | null>(null);
  const [isRecommending, setIsRecommending] = useState(false);
  const [recommendError, setRecommendError] = useState(false);

  const isRecommendingRef = useRef(false);
  const ageSectionRef = useRef<HTMLElement | null>(null);
  const genderSectionRef = useRef<HTMLElement | null>(null);
  const styleSectionRef = useRef<HTMLElement | null>(null);

  const missingItems: {label: string; ref: React.RefObject<HTMLElement | null>}[] = [];
  if (!selectedAge) {
    missingItems.push({label: '연령대', ref: ageSectionRef});
  }
  if (!selectedGender) {
    missingItems.push({label: '성별', ref: genderSectionRef});
  }
  if (!selectedStyle) {
    missingItems.push({label: '선호하는 옷 스타일', ref: styleSectionRef});
  }

  const isComplete = missingItems.length === 0;
  const missingMessage = formatMissingMessage(missingItems.map((item) => item.label));

  const handleDisabledNextAttempt = () => {
    if (isComplete) {
      return;
    }
    setNudgeActive(false);
    requestAnimationFrame(() => {
      setNudgeActive(true);
    });
    const firstMissing = missingItems[0];
    if (firstMissing?.ref.current) {
      firstMissing.ref.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  };

  const handleNextClick = () => {
    if (!isComplete) {
      handleDisabledNextAttempt();
      return;
    }
    setCurrentStep('weather');
    window.scrollTo({top: 0, behavior: 'auto'});
  };

  const handleBackToAbout = () => {
    setCurrentStep('about');
    window.scrollTo({top: 0, behavior: 'auto'});
  };

  const requestRecommendationOnce = async (
    locationLabel: string,
    weather: WeatherSummary,
  ) => {
    if (isRecommendingRef.current || !selectedAge || !selectedGender || !selectedStyle) {
      return;
    }
    const styleDetail = STYLE_OPTIONS.find((item) => item.id === selectedStyle);
    if (!styleDetail) {
      return;
    }

    isRecommendingRef.current = true;
    setIsRecommending(true);
    setRecommendError(false);
    setRecommendation(null);

    try {
      const response = await fetch('/api/recommend-outfit', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          age: selectedAge,
          gender: selectedGender,
          styleName: styleDetail.name,
          styleDescription: styleDetail.description,
          temperature: weather.temperature,
          apparentTemperature: weather.apparentTemperature,
          weatherLabel: weather.weatherLabel,
          tempMin: weather.tempMin,
          tempMax: weather.tempMax,
          precipitationProbability: weather.precipitationProbability,
        }),
      });

      if (!response.ok) {
        setRecommendError(true);
        return;
      }

      const data = (await response.json()) as {
        recommendation?: OutfitRecommendation;
      };

      if (!data.recommendation) {
        setRecommendError(true);
        return;
      }

      setRecommendation(data.recommendation);
    } catch {
      setRecommendError(true);
    } finally {
      isRecommendingRef.current = false;
      setIsRecommending(false);
    }
  };

  const handleProceedToRecommend = (
    locationLabel: string,
    weather: WeatherSummary,
  ) => {
    setWeatherContext({locationLabel, weather});
    setCurrentStep('recommend');
    window.scrollTo({top: 0, behavior: 'auto'});
    void requestRecommendationOnce(locationLabel, weather);
  };

  const handleRetryRecommend = () => {
    if (!weatherContext) {
      return;
    }
    void requestRecommendationOnce(
      weatherContext.locationLabel,
      weatherContext.weather,
    );
  };

  const handleStartOver = () => {
    if (isRecommendingRef.current) {
      return;
    }
    setSelectedAge(null);
    setSelectedGender(null);
    setSelectedStyle(null);
    setWeatherContext(null);
    setRecommendation(null);
    setRecommendError(false);
    setCurrentStep('about');
    window.scrollTo({top: 0, behavior: 'auto'});
  };

  if (currentStep === 'weather') {
    return (
      <WeatherScreen
        onBack={handleBackToAbout}
        onProceedToRecommend={handleProceedToRecommend}
      />
    );
  }

  if (currentStep === 'recommend' && weatherContext && selectedStyle) {
    const styleDetail = STYLE_OPTIONS.find((item) => item.id === selectedStyle);
    if (styleDetail) {
      return (
        <RecommendationScreen
          styleName={styleDetail.name}
          styleDescription={styleDetail.description}
          styleIllustration={styleDetail.renderIllustration(true)}
          locationLabel={weatherContext.locationLabel}
          weather={weatherContext.weather}
          recommendation={recommendation}
          isLoading={isRecommending}
          hasError={recommendError}
          onRetryRecommend={handleRetryRecommend}
          onStartOver={handleStartOver}
        />
      );
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100/80 via-[#F4FAFF] to-[#FFFFFF] text-[#0F2942] flex flex-col">
      {/* Top Header */}
      <header className="w-full border-b border-sky-200/70 bg-white/80 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 py-4 flex items-center justify-between">
          <span className="text-xl sm:text-2xl font-bold tracking-tight text-sky-700 whitespace-nowrap shrink-0">
            오늘 착장
          </span>
          <span className="text-sm sm:text-base font-medium text-sky-700/80 whitespace-nowrap shrink-0">
            나에 대해
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-3xl mx-auto px-5 sm:px-8 pt-6 pb-8 sm:pt-9 sm:pb-12">
        {/* Intro Heading */}
        <div className="mb-8 sm:mb-10">
          <h1 className="text-[28px] sm:text-[34px] font-bold tracking-tight text-[#0F2942] leading-tight text-balance">
            나에 대해
          </h1>
          <p className="mt-2 text-base sm:text-lg text-slate-600 leading-relaxed">
            편안하게 입을 수 있도록 연령대, 성별, 선호하는 스타일을 골라 주세요.
          </p>
        </div>

        <div className="space-y-9 sm:space-y-11">
          {/* 1. 연령대 */}
          <section ref={ageSectionRef} aria-labelledby="age-heading">
            <div className="flex items-baseline justify-between gap-4 mb-4">
              <h2
                id="age-heading"
                className="text-xl sm:text-2xl font-bold text-[#0F2942]"
              >
                연령대
              </h2>
              <span className="text-sm sm:text-base text-sky-700 font-medium">
                하나만 선택
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {AGE_OPTIONS.map((age) => {
                const isSelected = selectedAge === age;
                return (
                  <button
                    key={age}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => setSelectedAge(age)}
                    className={`min-h-[58px] sm:min-h-[64px] px-4 py-3 rounded-2xl text-lg sm:text-xl font-bold transition-all duration-150 flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-300 active:scale-[0.98] whitespace-nowrap cursor-pointer ${
                      isSelected
                        ? 'bg-sky-600 text-white border-[3px] border-sky-700 shadow-md shadow-sky-600/20'
                        : 'bg-white text-[#0F2942] border-2 border-sky-200 hover:border-sky-400 hover:bg-sky-50/70'
                    }`}
                  >
                    {isSelected && (
                      <Check className="w-5 h-5 shrink-0 stroke-[3]" aria-hidden="true" />
                    )}
                    <span>{age}</span>
                  </button>
                );
              })}
            </div>
          </section>

          <hr className="border-sky-100" />

          {/* 2. 성별 */}
          <section ref={genderSectionRef} aria-labelledby="gender-heading">
            <div className="flex items-baseline justify-between gap-4 mb-4">
              <h2
                id="gender-heading"
                className="text-xl sm:text-2xl font-bold text-[#0F2942]"
              >
                성별
              </h2>
              <span className="text-sm sm:text-base text-sky-700 font-medium">
                하나만 선택
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2.5 sm:gap-3.5">
              {GENDER_OPTIONS.map((gender) => {
                const isSelected = selectedGender === gender;
                return (
                  <button
                    key={gender}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => setSelectedGender(gender)}
                    className={`min-h-[58px] sm:min-h-[64px] px-3 sm:px-4 py-3 rounded-2xl text-base sm:text-xl font-bold transition-all duration-150 flex items-center justify-center gap-1.5 sm:gap-2 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-300 active:scale-[0.98] whitespace-nowrap cursor-pointer ${
                      isSelected
                        ? 'bg-sky-600 text-white border-[3px] border-sky-700 shadow-md shadow-sky-600/20'
                        : 'bg-white text-[#0F2942] border-2 border-sky-200 hover:border-sky-400 hover:bg-sky-50/70'
                    }`}
                  >
                    {isSelected && (
                      <Check className="w-5 h-5 shrink-0 stroke-[3]" aria-hidden="true" />
                    )}
                    <span>{gender}</span>
                  </button>
                );
              })}
            </div>
          </section>

          <hr className="border-sky-100" />

          {/* 3. 선호하는 옷 스타일 */}
          <section ref={styleSectionRef} aria-labelledby="style-heading">
            <div className="flex items-baseline justify-between gap-4 mb-4">
              <h2
                id="style-heading"
                className="text-xl sm:text-2xl font-bold text-[#0F2942]"
              >
                선호하는 옷 스타일
              </h2>
              <span className="text-sm sm:text-base text-sky-700 font-medium">
                하나만 선택
              </span>
            </div>

            <fieldset className="border-0 p-0 m-0">
              <legend className="sr-only">선호하는 옷 스타일</legend>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
                {STYLE_OPTIONS.map((style) => {
                  const isSelected = selectedStyle === style.id;
                  return (
                    <label
                      key={style.id}
                      className={`group relative flex items-center gap-4 p-4 sm:p-5 rounded-3xl transition-all duration-150 cursor-pointer select-none focus-within:ring-4 focus-within:ring-sky-300 active:scale-[0.99] ${
                        isSelected
                          ? 'bg-sky-50 border-[3px] border-sky-600 shadow-md shadow-sky-200/70'
                          : 'bg-white border-2 border-sky-200/90 hover:border-sky-400 hover:bg-sky-50/40'
                      }`}
                    >
                      <input
                        type="radio"
                        name="preferred-style"
                        value={style.id}
                        checked={isSelected}
                        onChange={() => setSelectedStyle(style.id)}
                        className="sr-only"
                      />

                      {/* Custom SVG Illustration */}
                      <div className="w-20 h-20 sm:w-22 sm:h-22 shrink-0">
                        {style.renderIllustration(isSelected)}
                      </div>

                      {/* Text Content */}
                      <div className="flex-1 min-w-0">
                        <div className="text-lg sm:text-xl font-bold text-[#0F2942] leading-snug">
                          {style.name}
                        </div>
                        <p className="mt-1 text-sm sm:text-base text-slate-600 leading-snug">
                          {style.description}
                        </p>
                      </div>

                      {/* Large Visual Radio Indicator */}
                      <div
                        aria-hidden="true"
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full shrink-0 flex items-center justify-center transition-colors ${
                          isSelected
                            ? 'border-[3px] border-sky-600 bg-white'
                            : 'border-2 border-slate-300 bg-white group-hover:border-sky-400'
                        }`}
                      >
                        {isSelected && (
                          <span className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-sky-600" />
                        )}
                      </div>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          </section>
        </div>
      </main>

      {/* Bottom Action Area */}
      <footer className="sticky bottom-0 z-20 w-full bg-gradient-to-t from-[#F4FAFF] via-[#F4FAFF]/95 to-transparent pt-3 pb-4 px-5 sm:px-8 border-t border-sky-100/80">
        <div className="max-w-3xl mx-auto">
          {/* Missing field prompt */}
          {!isComplete && (
            <p
              role="status"
              aria-live="polite"
              onAnimationEnd={() => setNudgeActive(false)}
              className={`mb-2.5 text-center text-base sm:text-lg font-semibold text-sky-800 ${
                nudgeActive ? 'animate-nudge' : ''
              }`}
            >
              {missingMessage}
            </p>
          )}

          {/* Disabled tap catcher wrapper so tapping the disabled area guides the user */}
          <div
            onClick={() => {
              if (!isComplete) {
                handleDisabledNextAttempt();
              }
            }}
            className="w-full"
          >
            <button
              type="button"
              disabled={!isComplete}
              aria-disabled={!isComplete}
              onClick={handleNextClick}
              className={`w-full min-h-[56px] sm:min-h-[60px] rounded-2xl text-lg sm:text-xl font-bold flex items-center justify-center gap-2 transition-all duration-150 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-300 ${
                isComplete
                  ? 'bg-sky-600 hover:bg-sky-700 text-white shadow-lg shadow-sky-600/25 active:scale-[0.99] cursor-pointer'
                  : 'bg-slate-200 text-slate-500 cursor-not-allowed pointer-events-none'
              }`}
            >
              <span>다음</span>
              <ChevronRight className="w-6 h-6 shrink-0" aria-hidden="true" />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
