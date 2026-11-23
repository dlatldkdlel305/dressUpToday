import {GoogleGenAI, ThinkingLevel, Type} from '@google/genai';

export interface RecommendOutfitRequest {
  age: string;
  gender: string;
  styleName: string;
  styleDescription: string;
  temperature: number;
  apparentTemperature: number;
  weatherLabel: string;
  tempMin: number;
  tempMax: number;
  precipitationProbability: number;
}

export interface OutfitRecommendation {
  outer: string;
  top: string;
  bottom: string;
  shoes: string;
  accessory: string;
  reason: string;
}

export class MissingApiKeyError extends Error {
  constructor() {
    super('GEMINI_API_KEY is not configured');
    this.name = 'MissingApiKeyError';
  }
}

export class UpstreamResponseError extends Error {
  readonly code: string;

  constructor(code: string) {
    super(code);
    this.name = 'UpstreamResponseError';
    this.code = code;
  }
}

function sanitizeText(value: unknown, maxLength: number): string | null {
  if (typeof value !== 'string') {
    return null;
  }
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > maxLength) {
    return null;
  }
  return trimmed;
}

function validateTemp(value: unknown): number | null {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return null;
  }
  if (value < -60 || value > 60) {
    return null;
  }
  return value;
}

function validateProbability(value: unknown): number | null {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return null;
  }
  if (value < 0 || value > 100) {
    return null;
  }
  return value;
}

export function validateRecommendPayload(
  raw: unknown,
): RecommendOutfitRequest | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return null;
  }

  const body = raw as Record<string, unknown>;

  const age = sanitizeText(body.age, 30);
  const gender = sanitizeText(body.gender, 30);
  const styleName = sanitizeText(body.styleName, 60);
  const styleDescription =
    typeof body.styleDescription === 'string'
      ? body.styleDescription.trim().slice(0, 150)
      : '';
  const weatherLabel = sanitizeText(body.weatherLabel, 40);

  const temperature = validateTemp(body.temperature);
  const apparentTemperature = validateTemp(body.apparentTemperature);
  const tempMin = validateTemp(body.tempMin);
  const tempMax = validateTemp(body.tempMax);
  const precipitationProbability = validateProbability(
    body.precipitationProbability,
  );

  if (
    !age ||
    !gender ||
    !styleName ||
    !weatherLabel ||
    temperature === null ||
    apparentTemperature === null ||
    tempMin === null ||
    tempMax === null ||
    precipitationProbability === null
  ) {
    return null;
  }

  return {
    age,
    gender,
    styleName,
    styleDescription,
    temperature,
    apparentTemperature,
    weatherLabel,
    tempMin,
    tempMax,
    precipitationProbability,
  };
}

function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    throw new MissingApiKeyError();
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

export async function generateOutfitRecommendation(
  payload: RecommendOutfitRequest,
): Promise<OutfitRecommendation> {
  const ai = getGeminiClient();
  const tempDiff = Math.round(payload.tempMax - payload.tempMin);

  const prompt = [
    '다음 사용자 정보와 오늘 날씨를 보고, 오늘 입을 옷차림을 정확히 1가지 추천해 주세요.',
    '',
    '[사용자 정보]',
    `- 연령대: ${payload.age}`,
    `- 성별: ${payload.gender}`,
    `- 선호하는 옷 스타일: ${payload.styleName}${payload.styleDescription ? ` (${payload.styleDescription})` : ''}`,
    '',
    '[오늘 날씨]',
    `- 지금 기온: ${payload.temperature}℃`,
    `- 체감온도: ${payload.apparentTemperature}℃`,
    `- 날씨 상태: ${payload.weatherLabel}`,
    `- 오늘 최저 기온: ${payload.tempMin}℃`,
    `- 오늘 최고 기온: ${payload.tempMax}℃ (일교차 ${tempDiff}℃)`,
    `- 비 올 확률: ${payload.precipitationProbability}%`,
    '',
    '[작성 규칙]',
    '1. 사용자가 고른 스타일에 딱 맞는 옷차림 정확히 1가지로, 겉옷, 상의, 하의, 신발, 소품을 각각 구체적으로 추천하세요.',
    '2. 오늘 기온과 날씨에 꼭 맞게 고르세요. 비 올 확률이 높거나 비/눈 소식이 있으면 우산이나 방수 신발을 꼭 넣으세요.',
    '3. 아침저녁과 낮의 기온 차이(일교차)가 크면 껴입기(예: 가벼운 카디건이나 얇은 겉옷 겹쳐 입기)를 추천하세요.',
    '4. 연령대와 성별에 어울리면서도 누구나 쉽게 구할 수 있는 평범하고 단정한 옷으로 추천하고, 특정 브랜드 이름은 절대 넣지 마세요.',
    '5. 추천 이유(reason)는 오늘 날씨를 근거로 한 문장으로 자연스럽게 쓰세요.',
    '6. 모든 내용은 쉬운 우리말과 정중한 존댓말로 작성하세요.',
  ].join('\n');

  const response = await ai.models.generateContent({
    model: 'gemini-4-hydrogen',
    contents: prompt,
    config: {
      systemInstruction:
        '당신은 한국인의 일상 옷차림을 알기 쉽게 골라 주는 친절한 스타일 도우미입니다. 반드시 지정된 JSON 스키마로만 답하고, 브랜드명은 절대 언급하지 마세요.',
      responseMimeType: 'application/json',
      thinkingConfig: {
        thinkingLevel: ThinkingLevel.LOW,
      },
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          outer: {
            type: Type.STRING,
            description:
              '겉옷 추천 한 가지 (쉬운 한국어, 존댓말 또는 깔끔한 품목명과 설명)',
          },
          top: {
            type: Type.STRING,
            description: '상의 추천 한 가지',
          },
          bottom: {
            type: Type.STRING,
            description: '하의 추천 한 가지',
          },
          shoes: {
            type: Type.STRING,
            description: '신발 추천 한 가지',
          },
          accessory: {
            type: Type.STRING,
            description: '소품 추천 한 가지 (비 올 확률이 높으면 우산 포함)',
          },
          reason: {
            type: Type.STRING,
            description: '오늘 날씨를 근거로 한 한 문장 추천 이유 (존댓말)',
          },
        },
        required: ['outer', 'top', 'bottom', 'shoes', 'accessory', 'reason'],
      },
    },
  });

  const rawText = (response.text ?? '').trim();
  if (!rawText) {
    throw new UpstreamResponseError('EMPTY_RESPONSE');
  }

  let parsed: Partial<OutfitRecommendation>;
  try {
    parsed = JSON.parse(rawText) as Partial<OutfitRecommendation>;
  } catch {
    throw new UpstreamResponseError('INVALID_JSON_RESPONSE');
  }

  if (
    !parsed.outer ||
    !parsed.top ||
    !parsed.bottom ||
    !parsed.shoes ||
    !parsed.accessory ||
    !parsed.reason
  ) {
    throw new UpstreamResponseError('INCOMPLETE_RESPONSE');
  }

  return {
    outer: String(parsed.outer).trim(),
    top: String(parsed.top).trim(),
    bottom: String(parsed.bottom).trim(),
    shoes: String(parsed.shoes).trim(),
    accessory: String(parsed.accessory).trim(),
    reason: String(parsed.reason).trim(),
  };
}
