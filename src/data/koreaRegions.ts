export type CityId =
  | 'seoul'
  | 'suwon'
  | 'incheon'
  | 'daejeon'
  | 'daegu'
  | 'gwangju'
  | 'busan'
  | 'jeju';

export interface SubRegion {
  id: string;
  name: string;
  district?: string; // For Seoul: parent 구 name (e.g. 강남구)
  lat: number;
  lon: number;
}

export interface CityInfo {
  id: CityId;
  name: string;
  fullName: string;
  subUnitLabel: string;
}

export const CITIES: CityInfo[] = [
  {id: 'seoul', name: '서울', fullName: '서울특별시', subUnitLabel: '동'},
  {id: 'suwon', name: '수원', fullName: '경기도 수원시', subUnitLabel: '구'},
  {id: 'incheon', name: '인천', fullName: '인천광역시', subUnitLabel: '군·구'},
  {id: 'daejeon', name: '대전', fullName: '대전광역시', subUnitLabel: '구'},
  {id: 'daegu', name: '대구', fullName: '대구광역시', subUnitLabel: '군·구'},
  {id: 'gwangju', name: '광주', fullName: '광주광역시', subUnitLabel: '구'},
  {id: 'busan', name: '부산', fullName: '부산광역시', subUnitLabel: '군·구'},
  {id: 'jeju', name: '제주', fullName: '제주특별자치도', subUnitLabel: '지역'},
];

export const SEOUL_DISTRICTS = [
  '강남구',
  '강동구',
  '강북구',
  '강서구',
  '관악구',
  '광진구',
  '구로구',
  '금천구',
  '노원구',
  '도봉구',
  '동대문구',
  '동작구',
  '마포구',
  '서대문구',
  '서초구',
  '성동구',
  '성북구',
  '송파구',
  '양천구',
  '영등포구',
  '용산구',
  '은평구',
  '종로구',
  '중구',
  '중랑구',
] as const;

export const SEOUL_DONGS: SubRegion[] = [
  // 강남구
  {id: 'seoul-gangnam-yeoksam', name: '역삼동', district: '강남구', lat: 37.5007, lon: 127.0365},
  {id: 'seoul-gangnam-samseong', name: '삼성동', district: '강남구', lat: 37.514, lon: 127.0565},
  {id: 'seoul-gangnam-daechi', name: '대치동', district: '강남구', lat: 37.4995, lon: 127.0625},
  {id: 'seoul-gangnam-apgujeong', name: '압구정동', district: '강남구', lat: 37.5271, lon: 127.0285},
  {id: 'seoul-gangnam-cheongdam', name: '청담동', district: '강남구', lat: 37.5236, lon: 127.0485},
  {id: 'seoul-gangnam-gaepo', name: '개포동', district: '강남구', lat: 37.4822, lon: 127.0662},
  {id: 'seoul-gangnam-suseo', name: '수서동', district: '강남구', lat: 37.4875, lon: 127.1014},

  // 강동구
  {id: 'seoul-gangdong-cheonho', name: '천호동', district: '강동구', lat: 37.5405, lon: 127.1257},
  {id: 'seoul-gangdong-gil', name: '길동', district: '강동구', lat: 37.5376, lon: 127.1404},
  {id: 'seoul-gangdong-myeongil', name: '명일동', district: '강동구', lat: 37.5514, lon: 127.1445},
  {id: 'seoul-gangdong-amsa', name: '암사동', district: '강동구', lat: 37.5512, lon: 127.1279},
  {id: 'seoul-gangdong-godeok', name: '고덕동', district: '강동구', lat: 37.5563, lon: 127.1553},

  // 강북구
  {id: 'seoul-gangbuk-mia', name: '미아동', district: '강북구', lat: 37.6263, lon: 127.026},
  {id: 'seoul-gangbuk-suyu', name: '수유동', district: '강북구', lat: 37.6382, lon: 127.0218},
  {id: 'seoul-gangbuk-beon', name: '번동', district: '강북구', lat: 37.632, lon: 127.0394},
  {id: 'seoul-gangbuk-ui', name: '우이동', district: '강북구', lat: 37.6584, lon: 127.0079},

  // 강서구
  {id: 'seoul-gangseo-hwagok', name: '화곡동', district: '강서구', lat: 37.5416, lon: 126.8404},
  {id: 'seoul-gangseo-magok', name: '마곡동', district: '강서구', lat: 37.5602, lon: 126.8255},
  {id: 'seoul-gangseo-gayang', name: '가양동', district: '강서구', lat: 37.565, lon: 126.8548},
  {id: 'seoul-gangseo-deungchon', name: '등촌동', district: '강서구', lat: 37.5522, lon: 126.8588},
  {id: 'seoul-gangseo-banghwa', name: '방화동', district: '강서구', lat: 37.5734, lon: 126.8141},

  // 관악구
  {id: 'seoul-gwanak-sillim', name: '신림동', district: '관악구', lat: 37.4842, lon: 126.9296},
  {id: 'seoul-gwanak-bongcheon', name: '봉천동', district: '관악구', lat: 37.4823, lon: 126.9516},
  {id: 'seoul-gwanak-nakseongdae', name: '낙성대동', district: '관악구', lat: 37.4763, lon: 126.9608},
  {id: 'seoul-gwanak-namhyeon', name: '남현동', district: '관악구', lat: 37.4744, lon: 126.9794},

  // 광진구
  {id: 'seoul-gwangjin-jayang', name: '자양동', district: '광진구', lat: 37.5342, lon: 127.0752},
  {id: 'seoul-gwangjin-guui', name: '구의동', district: '광진구', lat: 37.5382, lon: 127.0879},
  {id: 'seoul-gwangjin-hwayang', name: '화양동', district: '광진구', lat: 37.5425, lon: 127.0715},
  {id: 'seoul-gwangjin-gwangjang', name: '광장동', district: '광진구', lat: 37.5469, lon: 127.1035},

  // 구로구
  {id: 'seoul-guro-guro', name: '구로동', district: '구로구', lat: 37.4954, lon: 126.8877},
  {id: 'seoul-guro-sindorim', name: '신도림동', district: '구로구', lat: 37.5088, lon: 126.8884},
  {id: 'seoul-guro-gaebong', name: '개봉동', district: '구로구', lat: 37.4926, lon: 126.8588},
  {id: 'seoul-guro-oryu', name: '오류동', district: '구로구', lat: 37.4945, lon: 126.8453},

  // 금천구
  {id: 'seoul-geumcheon-gasan', name: '가산동', district: '금천구', lat: 37.4785, lon: 126.8819},
  {id: 'seoul-geumcheon-doksan', name: '독산동', district: '금천구', lat: 37.4694, lon: 126.8981},
  {id: 'seoul-geumcheon-siheung', name: '시흥동', district: '금천구', lat: 37.4519, lon: 126.9035},

  // 노원구
  {id: 'seoul-nowon-sanggye', name: '상계동', district: '노원구', lat: 37.6579, lon: 127.0672},
  {id: 'seoul-nowon-junggye', name: '중계동', district: '노원구', lat: 37.6462, lon: 127.0714},
  {id: 'seoul-nowon-hagye', name: '하계동', district: '노원구', lat: 37.6365, lon: 127.0705},
  {id: 'seoul-nowon-gongneung', name: '공릉동', district: '노원구', lat: 37.6258, lon: 127.0772},

  // 도봉구
  {id: 'seoul-dobong-chang', name: '창동', district: '도봉구', lat: 37.6531, lon: 127.0478},
  {id: 'seoul-dobong-ssangmun', name: '쌍문동', district: '도봉구', lat: 37.6487, lon: 127.0347},
  {id: 'seoul-dobong-banghak', name: '방학동', district: '도봉구', lat: 37.6675, lon: 127.0419},
  {id: 'seoul-dobong-dobong', name: '도봉동', district: '도봉구', lat: 37.6819, lon: 127.0468},

  // 동대문구
  {id: 'seoul-ddm-cheongnyangni', name: '청량리동', district: '동대문구', lat: 37.5819, lon: 127.0479},
  {id: 'seoul-ddm-hoegi', name: '회기동', district: '동대문구', lat: 37.5906, lon: 127.0549},
  {id: 'seoul-ddm-jegi', name: '제기동', district: '동대문구', lat: 37.5782, lon: 127.0377},
  {id: 'seoul-ddm-jangan', name: '장안동', district: '동대문구', lat: 37.5681, lon: 127.0695},
  {id: 'seoul-ddm-dapsimni', name: '답십리동', district: '동대문구', lat: 37.5688, lon: 127.0545},

  // 동작구
  {id: 'seoul-dongjak-noryangjin', name: '노량진동', district: '동작구', lat: 37.5133, lon: 126.9423},
  {id: 'seoul-dongjak-sadang', name: '사당동', district: '동작구', lat: 37.4827, lon: 126.9766},
  {id: 'seoul-dongjak-sangdo', name: '상도동', district: '동작구', lat: 37.5025, lon: 126.9478},
  {id: 'seoul-dongjak-heukseok', name: '흑석동', district: '동작구', lat: 37.5082, lon: 126.9628},

  // 마포구
  {id: 'seoul-mapo-seogyo', name: '서교동', district: '마포구', lat: 37.5553, lon: 126.9225},
  {id: 'seoul-mapo-yeonnam', name: '연남동', district: '마포구', lat: 37.5637, lon: 126.9249},
  {id: 'seoul-mapo-mangwon', name: '망원동', district: '마포구', lat: 37.5565, lon: 126.9061},
  {id: 'seoul-mapo-gongdeok', name: '공덕동', district: '마포구', lat: 37.5453, lon: 126.9539},
  {id: 'seoul-mapo-sangam', name: '상암동', district: '마포구', lat: 37.5791, lon: 126.8891},

  // 서대문구
  {id: 'seoul-sdm-sinchon', name: '신촌동', district: '서대문구', lat: 37.5597, lon: 126.9422},
  {id: 'seoul-sdm-yeonhui', name: '연희동', district: '서대문구', lat: 37.5681, lon: 126.9328},
  {id: 'seoul-sdm-hongje', name: '홍제동', district: '서대문구', lat: 37.5882, lon: 126.9441},
  {id: 'seoul-sdm-bukahyeon', name: '북아현동', district: '서대문구', lat: 37.5608, lon: 126.9565},

  // 서초구
  {id: 'seoul-seocho-seocho', name: '서초동', district: '서초구', lat: 37.4918, lon: 127.0135},
  {id: 'seoul-seocho-banpo', name: '반포동', district: '서초구', lat: 37.5042, lon: 127.0012},
  {id: 'seoul-seocho-bangbae', name: '방배동', district: '서초구', lat: 37.4812, lon: 126.9937},
  {id: 'seoul-seocho-yangjae', name: '양재동', district: '서초구', lat: 37.4796, lon: 127.0391},
  {id: 'seoul-seocho-jamwon', name: '잠원동', district: '서초구', lat: 37.5152, lon: 127.0156},

  // 성동구
  {id: 'seoul-seongdong-seongsu', name: '성수동', district: '성동구', lat: 37.5446, lon: 127.0559},
  {id: 'seoul-seongdong-wangsimni', name: '왕십리동', district: '성동구', lat: 37.5612, lon: 127.0376},
  {id: 'seoul-seongdong-oksu', name: '옥수동', district: '성동구', lat: 37.5413, lon: 127.0176},
  {id: 'seoul-seongdong-geumho', name: '금호동', district: '성동구', lat: 37.5491, lon: 127.0209},

  // 성북구
  {id: 'seoul-seongbuk-gireum', name: '길음동', district: '성북구', lat: 37.6033, lon: 127.0247},
  {id: 'seoul-seongbuk-anam', name: '안암동', district: '성북구', lat: 37.5861, lon: 127.0294},
  {id: 'seoul-seongbuk-jeongneung', name: '정릉동', district: '성북구', lat: 37.6064, lon: 127.0102},
  {id: 'seoul-seongbuk-seongbuk', name: '성북동', district: '성북구', lat: 37.5934, lon: 126.9994},

  // 송파구
  {id: 'seoul-songpa-jamsil', name: '잠실동', district: '송파구', lat: 37.5133, lon: 127.0875},
  {id: 'seoul-songpa-garak', name: '가락동', district: '송파구', lat: 37.4959, lon: 127.1223},
  {id: 'seoul-songpa-munjeong', name: '문정동', district: '송파구', lat: 37.4864, lon: 127.1261},
  {id: 'seoul-songpa-bangi', name: '방이동', district: '송파구', lat: 37.515, lon: 127.1194},
  {id: 'seoul-songpa-ogeum', name: '오금동', district: '송파구', lat: 37.5023, lon: 127.1319},

  // 양천구
  {id: 'seoul-yangcheon-mok', name: '목동', district: '양천구', lat: 37.5305, lon: 126.8752},
  {id: 'seoul-yangcheon-sinjeong', name: '신정동', district: '양천구', lat: 37.5194, lon: 126.8576},
  {id: 'seoul-yangcheon-sinwol', name: '신월동', district: '양천구', lat: 37.5218, lon: 126.8325},

  // 영등포구
  {id: 'seoul-ydp-yeouido', name: '여의도동', district: '영등포구', lat: 37.526, lon: 126.9242},
  {id: 'seoul-ydp-yeongdeungpo', name: '영등포동', district: '영등포구', lat: 37.5177, lon: 126.9062},
  {id: 'seoul-ydp-dangsan', name: '당산동', district: '영등포구', lat: 37.5313, lon: 126.9016},
  {id: 'seoul-ydp-mullae', name: '문래동', district: '영등포구', lat: 37.5173, lon: 126.8952},
  {id: 'seoul-ydp-daerim', name: '대림동', district: '영등포구', lat: 37.4936, lon: 126.8979},

  // 용산구
  {id: 'seoul-yongsan-itaewon', name: '이태원동', district: '용산구', lat: 37.5345, lon: 126.9946},
  {id: 'seoul-yongsan-hannam', name: '한남동', district: '용산구', lat: 37.5356, lon: 127.0046},
  {id: 'seoul-yongsan-ichon', name: '이촌동', district: '용산구', lat: 37.5215, lon: 126.9721},
  {id: 'seoul-yongsan-hangangno', name: '한강로동', district: '용산구', lat: 37.5301, lon: 126.9669},

  // 은평구
  {id: 'seoul-eunpyeong-bulgwang', name: '불광동', district: '은평구', lat: 37.6105, lon: 126.9299},
  {id: 'seoul-eunpyeong-yeonseo', name: '연신내·갈현동', district: '은평구', lat: 37.619, lon: 126.9212},
  {id: 'seoul-eunpyeong-eungam', name: '응암동', district: '은평구', lat: 37.5959, lon: 126.9182},
  {id: 'seoul-eunpyeong-jingwan', name: '진관동', district: '은평구', lat: 37.6388, lon: 126.9228},

  // 종로구
  {id: 'seoul-jongno-jongno1', name: '종로1·2·3·4가동', district: '종로구', lat: 37.5715, lon: 126.9882},
  {id: 'seoul-jongno-samcheong', name: '삼청동', district: '종로구', lat: 37.5861, lon: 126.9817},
  {id: 'seoul-jongno-sajik', name: '사직동', district: '종로구', lat: 37.5762, lon: 126.9689},
  {id: 'seoul-jongno-hyehwa', name: '혜화동', district: '종로구', lat: 37.5863, lon: 127.0005},
  {id: 'seoul-jongno-pyeongchang', name: '평창동', district: '종로구', lat: 37.6131, lon: 126.9746},

  // 중구
  {id: 'seoul-jung-myeong', name: '명동', district: '중구', lat: 37.5601, lon: 126.9859},
  {id: 'seoul-jung-euljiro', name: '을지로동', district: '중구', lat: 37.5665, lon: 126.9912},
  {id: 'seoul-jung-sindang', name: '신당동', district: '중구', lat: 37.5637, lon: 127.0156},
  {id: 'seoul-jung-sogong', name: '소공동', district: '중구', lat: 37.5639, lon: 126.9788},

  // 중랑구
  {id: 'seoul-jungnang-myeonmok', name: '면목동', district: '중랑구', lat: 37.5844, lon: 127.0879},
  {id: 'seoul-jungnang-sangbong', name: '상봉동', district: '중랑구', lat: 37.5966, lon: 127.0861},
  {id: 'seoul-jungnang-sinnae', name: '신내동', district: '중랑구', lat: 37.6095, lon: 127.0972},
  {id: 'seoul-jungnang-muk', name: '묵동', district: '중랑구', lat: 37.6122, lon: 127.0785},
];

export const OTHER_CITY_SUBREGIONS: Record<Exclude<CityId, 'seoul'>, SubRegion[]> = {
  suwon: [
    {id: 'suwon-jangan', name: '장안구', lat: 37.3037, lon: 127.0102},
    {id: 'suwon-gwonseon', name: '권선구', lat: 37.2576, lon: 126.9718},
    {id: 'suwon-paldal', name: '팔달구', lat: 37.2825, lon: 127.0201},
    {id: 'suwon-yeongtong', name: '영통구', lat: 37.2596, lon: 127.0465},
  ],
  incheon: [
    {id: 'incheon-jung', name: '중구', lat: 37.4737, lon: 126.6217},
    {id: 'incheon-dong', name: '동구', lat: 37.4739, lon: 126.6432},
    {id: 'incheon-michuhol', name: '미추홀구', lat: 37.4636, lon: 126.6502},
    {id: 'incheon-yeonsu', name: '연수구', lat: 37.4102, lon: 126.6782},
    {id: 'incheon-namdong', name: '남동구', lat: 37.4472, lon: 126.7311},
    {id: 'incheon-bupyeong', name: '부평구', lat: 37.5074, lon: 126.7218},
    {id: 'incheon-gyeyang', name: '계양구', lat: 37.5374, lon: 126.7376},
    {id: 'incheon-seo', name: '서구', lat: 37.5455, lon: 126.6759},
    {id: 'incheon-ganghwa', name: '강화군', lat: 37.7465, lon: 126.4881},
    {id: 'incheon-ongjin', name: '옹진군', lat: 37.4466, lon: 126.6368},
  ],
  daejeon: [
    {id: 'daejeon-dong', name: '동구', lat: 36.312, lon: 127.4549},
    {id: 'daejeon-jung', name: '중구', lat: 36.3257, lon: 127.4212},
    {id: 'daejeon-seo', name: '서구', lat: 36.3555, lon: 127.3838},
    {id: 'daejeon-yuseong', name: '유성구', lat: 36.3622, lon: 127.3561},
    {id: 'daejeon-daedeok', name: '대덕구', lat: 36.3466, lon: 127.4158},
  ],
  daegu: [
    {id: 'daegu-jung', name: '중구', lat: 35.8693, lon: 128.6062},
    {id: 'daegu-dong', name: '동구', lat: 35.8866, lon: 128.6356},
    {id: 'daegu-seo', name: '서구', lat: 35.8718, lon: 128.5592},
    {id: 'daegu-nam', name: '남구', lat: 35.846, lon: 128.5977},
    {id: 'daegu-buk', name: '북구', lat: 35.8857, lon: 128.5829},
    {id: 'daegu-suseong', name: '수성구', lat: 35.8581, lon: 128.6305},
    {id: 'daegu-dalseo', name: '달서구', lat: 35.8299, lon: 128.5327},
    {id: 'daegu-dalseong', name: '달성군', lat: 35.7745, lon: 128.4314},
    {id: 'daegu-gunwi', name: '군위군', lat: 36.2427, lon: 128.5729},
  ],
  gwangju: [
    {id: 'gwangju-dong', name: '동구', lat: 35.1461, lon: 126.9231},
    {id: 'gwangju-seo', name: '서구', lat: 35.152, lon: 126.8895},
    {id: 'gwangju-nam', name: '남구', lat: 35.1328, lon: 126.9025},
    {id: 'gwangju-buk', name: '북구', lat: 35.1741, lon: 126.912},
    {id: 'gwangju-gwangsan', name: '광산구', lat: 35.1396, lon: 126.7937},
  ],
  busan: [
    {id: 'busan-jung', name: '중구', lat: 35.1062, lon: 129.0323},
    {id: 'busan-seo', name: '서구', lat: 35.0979, lon: 129.0244},
    {id: 'busan-dong', name: '동구', lat: 35.1293, lon: 129.0455},
    {id: 'busan-yeongdo', name: '영도구', lat: 35.0912, lon: 129.0679},
    {id: 'busan-busanjin', name: '부산진구', lat: 35.1631, lon: 129.0532},
    {id: 'busan-dongnae', name: '동래구', lat: 35.2049, lon: 129.0837},
    {id: 'busan-nam', name: '남구', lat: 35.1365, lon: 129.0843},
    {id: 'busan-buk', name: '북구', lat: 35.1972, lon: 128.9903},
    {id: 'busan-haeundae', name: '해운대구', lat: 35.1631, lon: 129.1636},
    {id: 'busan-saha', name: '사하구', lat: 35.1045, lon: 128.9748},
    {id: 'busan-geumjeong', name: '금정구', lat: 35.2429, lon: 129.0921},
    {id: 'busan-gangseo', name: '강서구', lat: 35.2122, lon: 128.9806},
    {id: 'busan-yeonje', name: '연제구', lat: 35.1763, lon: 129.0797},
    {id: 'busan-suyeong', name: '수영구', lat: 35.1456, lon: 129.1132},
    {id: 'busan-sasang', name: '사상구', lat: 35.1526, lon: 128.9912},
    {id: 'busan-gijang', name: '기장군', lat: 35.2446, lon: 129.2223},
  ],
  jeju: [
    {id: 'jeju-si', name: '제주시', lat: 33.4996, lon: 126.5312},
    {id: 'jeju-seogwipo', name: '서귀포시', lat: 33.2541, lon: 126.5601},
  ],
};
