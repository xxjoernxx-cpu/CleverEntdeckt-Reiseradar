import { getSavedAffiliateConfig } from './travelData';

export type PrimaryTravelType = 'pauschal' | 'hotel' | 'flug';
export type AddonFilterType = 'alle_passenden' | 'inkl_mietwagen' | 'aktiv_wandern' | 'camping_camper';

export interface PresetDestination {
  id: string;
  label: string;
  searchTerm: string; // Sent to CHECK24 / Expedia / Klook
  country: string;
  regionName: string;
  iata: string;
  countryGroup: 'Türkei' | 'Spanien' | 'Italien' | 'Griechenland & Ägypten' | 'Weitere beliebte Ziele';
  guideBadge?: string;
  recommendedBoards: string[];
}

export const CLEVERENTDECKT_DESTINATIONS: PresetDestination[] = [
  // Türkei (inkl. Side & Kumköy Schwerpunkt)
  {
    id: 'side-kumkoey-antalya',
    label: 'Side & Kumköy (Türkische Riviera / Antalya)',
    searchTerm: 'Side, Antalya',
    country: 'Türkei',
    regionName: 'Türkische Riviera (Antalya)',
    iata: 'AYT',
    countryGroup: 'Türkei',
    guideBadge: 'CleverEntdeckt Reiseführer-Tipp',
    recommendedBoards: ['All Inclusive', 'Halbpension', 'Frühstück'],
  },
  {
    id: 'antalya-belek-lara',
    label: 'Antalya, Lara & Belek (Türkische Riviera)',
    searchTerm: 'Antalya',
    country: 'Türkei',
    regionName: 'Türkische Riviera',
    iata: 'AYT',
    countryGroup: 'Türkei',
    recommendedBoards: ['All Inclusive', 'Halbpension'],
  },
  {
    id: 'alanya-riviera',
    label: 'Alanya & Incekum (Türkische Riviera)',
    searchTerm: 'Alanya, Antalya',
    country: 'Türkei',
    regionName: 'Türkische Riviera',
    iata: 'AYT',
    countryGroup: 'Türkei',
    recommendedBoards: ['All Inclusive', 'Halbpension'],
  },
  {
    id: 'izmir-kusadasi-aegaeis',
    label: 'Izmir, Çeşme & Kuşadası (Türkische Ägäis)',
    searchTerm: 'Izmir',
    country: 'Türkei',
    regionName: 'Türkische Ägäis',
    iata: 'ADB',
    countryGroup: 'Türkei',
    recommendedBoards: ['Halbpension', 'All Inclusive', 'Frühstück'],
  },
  {
    id: 'bodrum-mugla',
    label: 'Bodrum & Marmaris (Ägäis)',
    searchTerm: 'Bodrum',
    country: 'Türkei',
    regionName: 'Türkische Ägäis',
    iata: 'BJV',
    countryGroup: 'Türkei',
    recommendedBoards: ['All Inclusive', 'Frühstück'],
  },
  {
    id: 'istanbul-bosporus',
    label: 'Istanbul (Städtereise & Bosporus)',
    searchTerm: 'Istanbul',
    country: 'Türkei',
    regionName: 'Marmararegion',
    iata: 'IST',
    countryGroup: 'Türkei',
    recommendedBoards: ['Frühstück', 'Nur Übernachtung'],
  },

  // Spanien
  {
    id: 'mallorca-balearen',
    label: 'Mallorca (Palma, Alcúdia & Cala Millor)',
    searchTerm: 'Mallorca',
    country: 'Spanien',
    regionName: 'Balearen',
    iata: 'PMI',
    countryGroup: 'Spanien',
    guideBadge: 'Spanien-Reiseführer',
    recommendedBoards: ['Halbpension', 'Frühstück', 'All Inclusive'],
  },
  {
    id: 'teneriffa-kanaren',
    label: 'Teneriffa & Costa Adeje (Kanaren)',
    searchTerm: 'Teneriffa',
    country: 'Spanien',
    regionName: 'Kanarische Inseln',
    iata: 'TFS',
    countryGroup: 'Spanien',
    recommendedBoards: ['Halbpension', 'All Inclusive', 'Frühstück'],
  },
  {
    id: 'gran-canaria',
    label: 'Gran Canaria (Maspalomas & Meloneras)',
    searchTerm: 'Gran Canaria',
    country: 'Spanien',
    regionName: 'Kanarische Inseln',
    iata: 'LPA',
    countryGroup: 'Spanien',
    recommendedBoards: ['Halbpension', 'All Inclusive'],
  },
  {
    id: 'malaga-andalusien',
    label: 'Andalusien & Costa del Sol (Málaga / Marbella)',
    searchTerm: 'Costa del Sol, Malaga',
    country: 'Spanien',
    regionName: 'Andalusien',
    iata: 'AGP',
    countryGroup: 'Spanien',
    recommendedBoards: ['Frühstück', 'Halbpension'],
  },
  {
    id: 'barcelona-costa-brava',
    label: 'Barcelona & Costa Brava',
    searchTerm: 'Barcelona',
    country: 'Spanien',
    regionName: 'Katalonien',
    iata: 'BCN',
    countryGroup: 'Spanien',
    recommendedBoards: ['Frühstück', 'Nur Übernachtung'],
  },

  // Italien
  {
    id: 'rom-latium',
    label: 'Rom & Latium Küste',
    searchTerm: 'Rom',
    country: 'Italien',
    regionName: 'Latium',
    iata: 'FCO',
    countryGroup: 'Italien',
    guideBadge: 'Italien-Reiseführer',
    recommendedBoards: ['Frühstück', 'Nur Übernachtung'],
  },
  {
    id: 'sizilien-taormina',
    label: 'Sizilien (Catania, Taormina & Cefalù)',
    searchTerm: 'Sizilien',
    country: 'Italien',
    regionName: 'Sizilien',
    iata: 'CTA',
    countryGroup: 'Italien',
    recommendedBoards: ['Frühstück', 'Halbpension'],
  },
  {
    id: 'amalfi-neapel',
    label: 'Golf von Neapel, Sorrent & Amalfiküste',
    searchTerm: 'Sorrent, Neapel',
    country: 'Italien',
    regionName: 'Kampanien',
    iata: 'NAP',
    countryGroup: 'Italien',
    recommendedBoards: ['Frühstück', 'Halbpension'],
  },
  {
    id: 'gardasee-oberitalien',
    label: 'Gardasee, Comer See & Norditalien',
    searchTerm: 'Gardasee',
    country: 'Italien',
    regionName: 'Norditalien',
    iata: 'BGY',
    countryGroup: 'Italien',
    recommendedBoards: ['Frühstück', 'Halbpension', 'Nur Übernachtung'],
  },

  // Griechenland & Ägypten
  {
    id: 'kreta-griechenland',
    label: 'Kreta (Heraklion, Chania & Rethymnon)',
    searchTerm: 'Kreta',
    country: 'Griechenland',
    regionName: 'Griechische Inseln',
    iata: 'HER',
    countryGroup: 'Griechenland & Ägypten',
    recommendedBoards: ['Halbpension', 'All Inclusive', 'Frühstück'],
  },
  {
    id: 'rhodos-griechenland',
    label: 'Rhodos & Kos (Ägäis)',
    searchTerm: 'Rhodos',
    country: 'Griechenland',
    regionName: 'Dodekanes',
    iata: 'RHO',
    countryGroup: 'Griechenland & Ägypten',
    recommendedBoards: ['All Inclusive', 'Halbpension'],
  },
  {
    id: 'hurghada-rotes-meer',
    label: 'Hurghada, Makadi Bay & El Gouna (Rotes Meer)',
    searchTerm: 'Hurghada',
    country: 'Ägypten',
    regionName: 'Rotes Meer',
    iata: 'HRG',
    countryGroup: 'Griechenland & Ägypten',
    recommendedBoards: ['All Inclusive'],
  },

  // Weitere beliebte Ziele
  {
    id: 'lissabon-algarve',
    label: 'Portugal (Lissabon & Algarve)',
    searchTerm: 'Algarve',
    country: 'Portugal',
    regionName: 'Algarve / Lissabon',
    iata: 'FAO',
    countryGroup: 'Weitere beliebte Ziele',
    recommendedBoards: ['Frühstück', 'Halbpension'],
  },
  {
    id: 'kroatien-istrien-split',
    label: 'Kroatien (Split, Dalmatien & Istrien)',
    searchTerm: 'Split, Kroatien',
    country: 'Kroatien',
    regionName: 'Adria',
    iata: 'SPU',
    countryGroup: 'Weitere beliebte Ziele',
    recommendedBoards: ['Frühstück', 'Halbpension', 'Nur Übernachtung'],
  },
  {
    id: 'dubai-vae',
    label: 'Dubai & Vereinigte Arabische Emirate',
    searchTerm: 'Dubai',
    country: 'VAE',
    regionName: 'Persischer Golf',
    iata: 'DXB',
    countryGroup: 'Weitere beliebte Ziele',
    recommendedBoards: ['Frühstück', 'Halbpension'],
  },
  {
    id: 'bangkok-thailand',
    label: 'Thailand (Bangkok, Phuket & Khao Lak)',
    searchTerm: 'Phuket, Thailand',
    country: 'Thailand',
    regionName: 'Südostasien',
    iata: 'BKK',
    countryGroup: 'Weitere beliebte Ziele',
    recommendedBoards: ['Frühstück', 'Halbpension'],
  },
];

export interface AirportOption {
  code: string;
  label: string;
  country: 'DE' | 'AT' | 'CH';
}

export const AIRPORT_OPTIONS: AirportOption[] = [
  { code: 'FRA', label: 'Frankfurt am Main (FRA)', country: 'DE' },
  { code: 'MUC', label: 'München (MUC)', country: 'DE' },
  { code: 'DUS', label: 'Düsseldorf (DUS)', country: 'DE' },
  { code: 'BER', label: 'Berlin Brandenburg (BER)', country: 'DE' },
  { code: 'HAM', label: 'Hamburg (HAM)', country: 'DE' },
  { code: 'STR', label: 'Stuttgart (STR)', country: 'DE' },
  { code: 'CGN', label: 'Köln/Bonn (CGN)', country: 'DE' },
  { code: 'HAJ', label: 'Hannover (HAJ)', country: 'DE' },
  { code: 'NUE', label: 'Nürnberg (NUE)', country: 'DE' },
  { code: 'LEJ', label: 'Leipzig/Halle (LEJ)', country: 'DE' },
  { code: 'FMM', label: 'Memmingen / Allgäu (FMM)', country: 'DE' },
  { code: 'DTM', label: 'Dortmund (DTM)', country: 'DE' },
  { code: 'VIE', label: 'Wien-Schwechat (VIE)', country: 'AT' },
  { code: 'SZG', label: 'Salzburg (SZG)', country: 'AT' },
  { code: 'ZRH', label: 'Zürich (ZRH)', country: 'CH' },
  { code: 'BSL', label: 'Basel-Mulhouse (BSL)', country: 'CH' },
];

export interface SearchParameters {
  travelType: PrimaryTravelType;
  destinationText: string;
  selectedPresetId: string;
  originCode: string;
  checkInDate: string; // YYYY-MM-DD
  checkOutDate: string; // YYYY-MM-DD
  adults: number;
  childrenAges: number[]; // e.g., [6, 11]
  boardFilter: string; // 'Beliebig' | 'Frühstück' | 'Halbpension' | 'All Inclusive'
  awinClickRef?: string;
}

export interface PartnerOfferCardData {
  id: string;
  partnerName: string;
  categoryLabel: string;
  primaryForTypes: PrimaryTravelType[];
  isSpecialistAddon?: 'mietwagen' | 'wandern' | 'camping';
  url: string;
  affiliateNetworkLabel: string;
  affiliateIdSummary: string;
  description: string;
  includedServicesNote: string;
  transferredParams: string[];
  manualParamsAtProvider: string[];
  supportsFullDeepLink: boolean;
  ctaLabel: string;
  secondaryAction?: {
    label: string;
    url: string;
  };
  additionalActions?: Array<{
    label: string;
    url: string;
  }>;
}

export function resolveDestinationInfo(destinationText: string, selectedPresetId: string): {
  displayTitle: string;
  searchTerm: string;
  country: string;
  iata: string;
  regionName: string;
} {
  const cleanInput = destinationText.trim();
  const presetById = CLEVERENTDECKT_DESTINATIONS.find((d) => d.id === selectedPresetId);

  if (
    presetById &&
    (!cleanInput ||
      presetById.label.toLowerCase().includes(cleanInput.toLowerCase()) ||
      presetById.searchTerm.toLowerCase() === cleanInput.toLowerCase())
  ) {
    return {
      displayTitle: presetById.label,
      searchTerm: presetById.searchTerm,
      country: presetById.country,
      iata: presetById.iata,
      regionName: presetById.regionName,
    };
  }

  if (!cleanInput) {
    return {
      displayTitle: 'Wohin möchtest du reisen?',
      searchTerm: '',
      country: '',
      iata: 'PMI',
      regionName: '',
    };
  }

  const lower = cleanInput.toLowerCase();
  if (
    lower.includes('side') ||
    lower.includes('kumköy') ||
    lower.includes('kumkoey') ||
    lower.includes('manavgat')
  ) {
    return {
      displayTitle: 'Side & Kumköy (Antalya / Türkische Riviera)',
      searchTerm: 'Side, Antalya',
      country: 'Türkei',
      iata: 'AYT',
      regionName: 'Türkische Riviera',
    };
  }
  if (
    lower === 'türkei' ||
    lower === 'tuerkei' ||
    lower === 'turkei' ||
    lower.includes('antalya') ||
    lower.includes('türkische riviera')
  ) {
    return {
      displayTitle: 'Türkische Riviera & Antalya (Türkei)',
      searchTerm: 'Antalya',
      country: 'Türkei',
      iata: 'AYT',
      regionName: 'Türkische Riviera',
    };
  }
  if (lower === 'spanien' || lower.includes('mallorca') || lower.includes('palma')) {
    return {
      displayTitle: lower === 'spanien' ? 'Spanien (Mallorca, Kanaren & Festland)' : cleanInput,
      searchTerm: lower === 'spanien' ? 'Mallorca' : cleanInput,
      country: 'Spanien',
      iata: 'PMI',
      regionName: 'Spanien / Balearen',
    };
  }
  if (lower === 'italien' || lower === 'rom') {
    return {
      displayTitle: lower === 'rom' ? 'Rom & Latium (Italien)' : 'Italien (Rom, Küsten & Seen)',
      searchTerm: lower === 'rom' ? 'Rom' : 'Italien',
      country: 'Italien',
      iata: 'FCO',
      regionName: 'Italien',
    };
  }

  const matchedPreset = CLEVERENTDECKT_DESTINATIONS.find(
    (d) =>
      d.label.toLowerCase().includes(lower) ||
      d.searchTerm.toLowerCase().includes(lower) ||
      d.country.toLowerCase().includes(lower) ||
      d.iata.toLowerCase() === lower
  );

  if (matchedPreset) {
    return {
      displayTitle: cleanInput ? `${cleanInput} (${matchedPreset.country})` : matchedPreset.label,
      searchTerm: cleanInput || matchedPreset.searchTerm,
      country: matchedPreset.country,
      iata: matchedPreset.iata,
      regionName: matchedPreset.regionName,
    };
  }

  return {
    displayTitle: cleanInput,
    searchTerm: cleanInput,
    country: cleanInput,
    iata: 'FRA',
    regionName: 'Freie Zielsuche',
  };
}

export function calculateNights(checkIn: string, checkOut: string): number {
  const d1 = new Date(checkIn);
  const d2 = new Date(checkOut);
  if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return 7;
  const diff = Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(1, diff);
}

export function formatGermanDate(dateStr: string): string {
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  return `${parts[2]}.${parts[1]}.${parts[0]}`;
}

function getCampingCountrySlug(country: string, searchTerm: string): string {
  const combined = `${country} ${searchTerm}`.toLowerCase();
  if (
    combined.includes('spanien') ||
    combined.includes('mallorca') ||
    combined.includes('teneriffa') ||
    combined.includes('barcelona') ||
    combined.includes('andalusien')
  )
    return 'spanien';
  if (
    combined.includes('italien') ||
    combined.includes('rom') ||
    combined.includes('sizilien') ||
    combined.includes('gardasee') ||
    combined.includes('amalfi') ||
    combined.includes('sardinien')
  )
    return 'italien';
  if (
    combined.includes('türkei') ||
    combined.includes('tuerkei') ||
    combined.includes('antalya') ||
    combined.includes('side') ||
    combined.includes('izmir') ||
    combined.includes('bodrum')
  )
    return 'tuerkei';
  if (
    combined.includes('kroatien') ||
    combined.includes('istrien') ||
    combined.includes('split') ||
    combined.includes('dalmatien')
  )
    return 'kroatien';
  if (
    combined.includes('griechenland') ||
    combined.includes('kreta') ||
    combined.includes('rhodos') ||
    combined.includes('athen')
  )
    return 'griechenland';
  if (combined.includes('portugal') || combined.includes('algarve') || combined.includes('lissabon'))
    return 'portugal';
  if (
    combined.includes('österreich') ||
    combined.includes('oesterreich') ||
    combined.includes('tirol') ||
    combined.includes('salzburg') ||
    combined.includes('kärnten')
  )
    return 'oesterreich';
  if (combined.includes('schweiz') || combined.includes('zürich') || combined.includes('wallis'))
    return 'schweiz';
  if (combined.includes('frankreich') || combined.includes('korsika') || combined.includes('cote'))
    return 'frankreich';
  if (combined.includes('polen') || combined.includes('krakau') || combined.includes('ostsee'))
    return 'polen';
  return 'deutschland';
}

function resolveAbInDenUrlaubTarget(
  country: string,
  searchTerm: string,
  travelType: PrimaryTravelType
): { targetUrl: string; targetLabel: string; hasRegionMatch: boolean } {
  const combined = `${country} ${searchTerm}`.toLowerCase();

  if (travelType === 'hotel') {
    if (
      combined.includes('side') ||
      combined.includes('kumköy') ||
      combined.includes('antalya') ||
      combined.includes('alanya') ||
      combined.includes('belek') ||
      combined.includes('riviera')
    ) {
      return {
        targetUrl: 'https://www.ab-in-den-urlaub.de/hotels/europa/tuerkei/tuerkische-riviera',
        targetLabel: 'Kategorieseite: Hotels an der Türkischen Riviera',
        hasRegionMatch: true,
      };
    }
    if (combined.includes('mallorca') || combined.includes('palma')) {
      return {
        targetUrl: 'https://www.ab-in-den-urlaub.de/hotels/europa/spanien/mallorca',
        targetLabel: 'Kategorieseite: Hotels auf Mallorca',
        hasRegionMatch: true,
      };
    }
    return {
      targetUrl: 'https://www.ab-in-den-urlaub.de/eigene-anreise',
      targetLabel: 'Kategorieseite: Hotels mit eigener Anreise',
      hasRegionMatch: false,
    };
  }

  // Pauschalreise & Urlaub nach Zielregion
  if (combined.includes('side') || combined.includes('kumköy') || combined.includes('manavgat')) {
    return {
      targetUrl: 'https://www.ab-in-den-urlaub.de/urlaub/europa/tuerkei/tuerkische-riviera/side',
      targetLabel: 'Kategorieseite: Urlaub in Side & Türkische Riviera',
      hasRegionMatch: true,
    };
  }
  if (
    combined.includes('antalya') ||
    combined.includes('alanya') ||
    combined.includes('belek') ||
    combined.includes('lara') ||
    combined.includes('riviera')
  ) {
    return {
      targetUrl: 'https://www.ab-in-den-urlaub.de/urlaub/europa/tuerkei/tuerkische-riviera',
      targetLabel: 'Kategorieseite: Urlaub an der Türkischen Riviera',
      hasRegionMatch: true,
    };
  }
  if (
    combined.includes('türkei') ||
    combined.includes('tuerkei') ||
    combined.includes('izmir') ||
    combined.includes('bodrum') ||
    combined.includes('istanbul')
  ) {
    return {
      targetUrl: 'https://www.ab-in-den-urlaub.de/urlaub/europa/tuerkei',
      targetLabel: 'Kategorieseite: Urlaub in der Türkei',
      hasRegionMatch: true,
    };
  }
  if (combined.includes('mallorca') || combined.includes('palma')) {
    return {
      targetUrl: 'https://www.ab-in-den-urlaub.de/urlaub/europa/spanien/mallorca',
      targetLabel: 'Kategorieseite: Urlaub auf Mallorca',
      hasRegionMatch: true,
    };
  }
  if (
    combined.includes('spanien') ||
    combined.includes('teneriffa') ||
    combined.includes('gran canaria') ||
    combined.includes('kanaren') ||
    combined.includes('andalusien') ||
    combined.includes('malaga') ||
    combined.includes('barcelona')
  ) {
    return {
      targetUrl: 'https://www.ab-in-den-urlaub.de/urlaub/europa/spanien',
      targetLabel: 'Kategorieseite: Urlaub in Spanien',
      hasRegionMatch: true,
    };
  }
  if (
    combined.includes('italien') ||
    combined.includes('rom') ||
    combined.includes('sizilien') ||
    combined.includes('amalfi') ||
    combined.includes('neapel') ||
    combined.includes('gardasee')
  ) {
    return {
      targetUrl: 'https://www.ab-in-den-urlaub.de/urlaub/europa/italien',
      targetLabel: 'Kategorieseite: Urlaub in Italien',
      hasRegionMatch: true,
    };
  }
  if (
    combined.includes('griechenland') ||
    combined.includes('kreta') ||
    combined.includes('rhodos') ||
    combined.includes('kos')
  ) {
    return {
      targetUrl: 'https://www.ab-in-den-urlaub.de/urlaub/europa/griechenland',
      targetLabel: 'Kategorieseite: Urlaub in Griechenland',
      hasRegionMatch: true,
    };
  }
  if (
    combined.includes('ägypten') ||
    combined.includes('aegypten') ||
    combined.includes('hurghada') ||
    combined.includes('rotes meer') ||
    combined.includes('marsa alam')
  ) {
    return {
      targetUrl: 'https://www.ab-in-den-urlaub.de/urlaub/afrika/aegypten',
      targetLabel: 'Kategorieseite: Urlaub in Ägypten',
      hasRegionMatch: true,
    };
  }
  if (combined.includes('portugal') || combined.includes('algarve') || combined.includes('lissabon')) {
    return {
      targetUrl: 'https://www.ab-in-den-urlaub.de/urlaub/europa/portugal',
      targetLabel: 'Kategorieseite: Urlaub in Portugal',
      hasRegionMatch: true,
    };
  }
  if (combined.includes('kroatien') || combined.includes('split') || combined.includes('istrien')) {
    return {
      targetUrl: 'https://www.ab-in-den-urlaub.de/urlaub/europa/kroatien',
      targetLabel: 'Kategorieseite: Urlaub in Kroatien',
      hasRegionMatch: true,
    };
  }

  return {
    targetUrl: 'https://www.ab-in-den-urlaub.de/reiseangebote/sommerurlaub',
    targetLabel: 'Kategorieseite: Sommerurlaub & Pauschalreisen',
    hasRegionMatch: false,
  };
}

const TRIPCOM_CITY_SLUGS: Record<string, string> = {
  FRA: 'frankfurt',
  MUC: 'munich',
  DUS: 'dusseldorf',
  BER: 'berlin',
  HAM: 'hamburg',
  STR: 'stuttgart',
  CGN: 'cologne',
  HAJ: 'hanover',
  NUE: 'nuremberg',
  LEJ: 'leipzig',
  FMM: 'memmingen',
  DTM: 'dortmund',
  VIE: 'vienna',
  SZG: 'salzburg',
  ZRH: 'zurich',
  BSL: 'basel',
  PMI: 'palma-de-mallorca',
  AYT: 'antalya',
  ADB: 'izmir',
  BJV: 'bodrum',
  IST: 'istanbul',
  TFS: 'tenerife',
  LPA: 'gran-canaria',
  AGP: 'malaga',
  BCN: 'barcelona',
  FCO: 'rome',
  CTA: 'catania',
  NAP: 'naples',
  BGY: 'milan',
  HER: 'heraklion',
  RHO: 'rhodes',
  HRG: 'hurghada',
  FAO: 'faro',
  SPU: 'split',
  DXB: 'dubai',
  BKK: 'bangkok',
};

function getTripComCitySlug(iataCode: string, fallbackName?: string): string {
  const upper = iataCode.toUpperCase();
  if (TRIPCOM_CITY_SLUGS[upper]) {
    return TRIPCOM_CITY_SLUGS[upper];
  }
  if (fallbackName) {
    return fallbackName
      .toLowerCase()
      .replace(/ä/g, 'ae')
      .replace(/ö/g, 'oe')
      .replace(/ü/g, 'ue')
      .replace(/ß/g, 'ss')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  return upper.toLowerCase();
}

export function buildVerifiedPartnerOffers(params: SearchParameters): PartnerOfferCardData[] {
  const aff = getSavedAffiliateConfig();
  const dest = resolveDestinationInfo(params.destinationText, params.selectedPresetId);
  const effectiveSearchTerm = dest.searchTerm || 'Mallorca';
  const effectiveCountry = dest.country || 'Europa';
  const { travelType, originCode, checkInDate, checkOutDate, adults, childrenAges, boardFilter } =
    params;

  const deCheckIn = formatGermanDate(checkInDate);
  const deCheckOut = formatGermanDate(checkOutDate);
  const inParts = checkInDate.split('-');
  const outParts = checkOutDate.split('-');
  const aviaOut = inParts.length === 3 ? `${inParts[2]}${inParts[1]}` : '1505';
  const aviaIn = outParts.length === 3 ? `${outParts[2]}${outParts[1]}` : '2205';

  const check24PartnerId = (aff.customCheck24Url || '1176801').trim();
  const expediaCamref = (aff.customExpediaUrl || '1100l6tjov').trim();
  const tpMarker = (aff.travelpayoutsMarker || '771810').trim();
  const awinPubId = (aff.awinPublisherId || '3034525').trim();
  const awinClickRef = params.awinClickRef ? `&clickref=${encodeURIComponent(params.awinClickRef)}` : '';
  const buildAwinLink = (advertiserId: number, targetPage: string) =>
    `https://www.awin1.com/cread.php?awinmid=${advertiserId}&awinaffid=${encodeURIComponent(awinPubId)}${awinClickRef}&ued=${encodeURIComponent(targetPage)}`;

  const travelerParamSummary =
    childrenAges.length > 0
      ? `${adults} Erw., ${childrenAges.length} Kind${childrenAges.length > 1 ? 'er' : ''} (${childrenAges.map((a) => `${a} J.`).join(', ')})`
      : `${adults} Erwachsene${adults === 1 ? 'r' : ''}`;

  // 1. CHECK24 (Pauschalreise & Hotel)
  const check24Transport = travelType === 'hotel' ? 'eigenanreise' : 'flight';
  const check24ChildrenPart =
    childrenAges.length > 0
      ? `&childCount=${childrenAges.length}&childrenAges=${encodeURIComponent(childrenAges.join(','))}`
      : '';
  const check24Url = `https://urlaub.check24.de/suche/hotel?search=${encodeURIComponent(effectiveSearchTerm)}${
    travelType !== 'hotel' ? `&airport=${encodeURIComponent(originCode)}` : ''
  }&transportType=${check24Transport}&departureDate=${checkInDate}&returnDate=${checkOutDate}&adultCount=${adults}${check24ChildrenPart}&sort=price_asc&partnerid=${encodeURIComponent(check24PartnerId)}`;

  // 2. Expedia.de (Pauschalreise, Hotel & Flug via Partnerize camref:1100l6tjov)
  const expediaChildrenHotelParam =
    childrenAges.length > 0
      ? `&children=${encodeURIComponent(childrenAges.map((age) => `1_${age}`).join(','))}`
      : '';
  const baseExpediaHotelOrPkgUrl = `https://www.expedia.de/Hotel-Search?destination=${encodeURIComponent(effectiveSearchTerm)}&startDate=${checkInDate}&endDate=${checkOutDate}&d1=${checkInDate}&d2=${checkOutDate}&rooms=1&adults=${adults}${expediaChildrenHotelParam}&sort=PRICE_LOW_TO_HIGH&siteid=6&langid=1031`;

  const expediaLeg1 = `from:${originCode},to:${dest.iata},departure:${deCheckIn}TANYT`;
  const expediaLeg2 = `from:${dest.iata},to:${originCode},departure:${deCheckOut}TANYT`;
  const expediaFlightPassengers = `children:${childrenAges.length}${
    childrenAges.length > 0 ? `[${childrenAges.join(';')}]` : ''
  },adults:${adults},seniors:0,infantinlap:Y`;
  const baseExpediaFlightUrl = `https://www.expedia.de/Flights-Search?flight-type=on&mode=search&trip=roundtrip&leg1=${encodeURIComponent(expediaLeg1)}&leg2=${encodeURIComponent(expediaLeg2)}&fromDate=${encodeURIComponent(deCheckIn)}&toDate=${encodeURIComponent(deCheckOut)}&d1=${checkInDate}&d2=${checkOutDate}&passengers=${encodeURIComponent(expediaFlightPassengers)}&options=${encodeURIComponent('cabinclass:economy,sortby:price')}&siteid=6&langid=1031`;

  const targetExpediaInnerUrl =
    travelType === 'flug' ? baseExpediaFlightUrl : baseExpediaHotelOrPkgUrl;
  const expediaUrl = `https://www.expedia.de/affiliate?siteid=6&landingPage=${encodeURIComponent(targetExpediaInnerUrl)}&camref=${encodeURIComponent(expediaCamref)}&creativeref=1101l87346`;

  // 3. ab-in-den-urlaub (Awin awinmid=9369, awinaffid=3034525)
  const aiduTarget = resolveAbInDenUrlaubTarget(effectiveCountry, effectiveSearchTerm, travelType);
  const buildAiduLink = (targetPage: string) => buildAwinLink(9369, targetPage);

  const abInDenUrlaubUrl = buildAiduLink(aiduTarget.targetUrl);
  const aiduSommerurlaubUrl = buildAiduLink(
    'https://www.ab-in-den-urlaub.de/reiseangebote/sommerurlaub'
  );
  const aiduFamilienurlaubUrl = buildAiduLink(
    'https://www.ab-in-den-urlaub.de/reiseangebote/urlaub-mit-kindern'
  );
  const aiduAllInclusiveUrl = buildAiduLink('https://www.ab-in-den-urlaub.de/urlaub/all-inclusive');
  const aiduLastMinuteUrl = buildAiduLink('https://www.ab-in-den-urlaub.de/lastminute');

  // 4. Trip.com Komplett-Angebot (Pauschalreisen/Packages, Hotels, Flüge, Mietwagen, Transfers, Ausflüge, Züge)
  // Mit fester Affiliate-Kennung: Allianceid=10486295, SID=330669011, trip_sub3=D20880694
  const tripTrackingQuery = 'Allianceid=10486295&SID=330669011&trip_sub1=&trip_sub3=D20880694';
  const originLower = originCode.toLowerCase();
  const destLower = dest.iata.toLowerCase();
  const originSlug = getTripComCitySlug(originCode);
  const destSlug = getTripComCitySlug(dest.iata, effectiveSearchTerm);

  const tripComPackagesUrl = `https://www.trip.com/packages/list/${originSlug}-to-${destSlug}/${originLower}-to-${destLower}?dCity=${originLower}&aCity=${destLower}&${tripTrackingQuery}`;
  const tripComFlightUrl = `https://de.trip.com/flights/${originSlug}-to-${destSlug}/tickets-${originLower}-${destLower}?dcity=${originLower}&acity=${destLower}&ddate=${checkInDate}&rdate=${checkOutDate}&flighttype=rt&class=y&quantity=${adults}&childqty=${childrenAges.length}&${tripTrackingQuery}&locale=de_de`;
  const tripComHotelUrl = `https://de.trip.com/hotels/list?checkin=${checkInDate}&checkout=${checkOutDate}&adult=${adults}&crn=1&${tripTrackingQuery}&locale=de_de`;
  const tripComCarHireUrl = `https://de.trip.com/carhire/?${tripTrackingQuery}&locale=de_de`;
  const tripComTransfersUrl = `https://de.trip.com/airport-transfers/?${tripTrackingQuery}&locale=de_de`;
  const tripComThingsToDoUrl = `https://de.trip.com/things-to-do/?${tripTrackingQuery}&locale=de_de`;
  const tripComTrainsUrl = `https://de.trip.com/trains/?${tripTrackingQuery}&locale=de_de`;

  const tripComUrl =
    travelType === 'pauschal'
      ? tripComPackagesUrl
      : travelType === 'hotel'
      ? tripComHotelUrl
      : tripComFlightUrl;

  // 5. Aviasales Flug-Preisvergleich (Travelpayouts Marker 771810)
  const aviasalesUrl = `https://www.aviasales.com/search/${originCode.toUpperCase()}${aviaOut}${dest.iata.toUpperCase()}${aviaIn}${adults}${
    childrenAges.length > 0 ? childrenAges.length : ''
  }?currency=eur&marker=${encodeURIComponent(tpMarker)}`;

  // 6. DiscoverCars Mietwagen (a_aid=CleverEntdeckt, a_bid=61a4ac81)
  const discoverCarsUrl = `https://www.discovercars.com/de?iata=${encodeURIComponent(dest.iata)}&a_aid=CleverEntdeckt&a_bid=61a4ac81`;

  // 7. ASI Reisen (Geprüfte Awin Deep-Links awinmid=126961, awinaffid=3034525)
  const asiWanderreisenUrl = buildAwinLink(126961, 'https://www.asi-reisen.de/a/wanderreisen');
  const asiRundreisenUrl = buildAwinLink(126961, 'https://www.asi-reisen.de/gi/individuelle-rundreisen');
  const asiWinterreisenUrl = buildAwinLink(126961, 'https://www.asi-reisen.de/a/schneeschuhwandern');

  // 8. camping.info (Campingplätze & Glamping via Awin awinmid=44063, awinaffid=3034525)
  const campingTarget = dest.searchTerm
    ? `https://www.camping.info/de/land/${getCampingCountrySlug(dest.country, dest.searchTerm)}`
    : 'https://www.camping.info/de/campingplatz';
  const campingInfoUrl = buildAwinLink(44063, campingTarget);

  // 9. CamperDays & TUI Camper (Wohnmobile via Awin)
  const camperDaysUrl = buildAwinLink(52889, 'https://www.camperdays.de/');
  const tuiCamperUrl = buildAwinLink(11934, 'https://www.tuicamper.com/');

  // 10. Klook Ausflüge & Flughafentransfers (Travelpayouts campaign_id=137, marker=771810)
  const klookUrl = `https://tp.media/r?campaign_id=137&marker=${encodeURIComponent(tpMarker)}&p=4110&trs=568370&u=${encodeURIComponent(`https://www.klook.com/de/search/result/?query=${encodeURIComponent(effectiveSearchTerm)}`)}`;

  const offers: PartnerOfferCardData[] = [
    {
      id: 'check24',
      partnerName: 'CHECK24',
      categoryLabel:
        travelType === 'hotel' ? 'Hotelvergleich (Eigene Anreise)' : 'Pauschalreise-Vergleich',
      primaryForTypes: ['pauschal', 'hotel'],
      url: check24Url,
      affiliateNetworkLabel: 'CHECK24 Partnerprogramm',
      affiliateIdSummary: `Partner-ID ${check24PartnerId}`,
      description:
        travelType === 'hotel'
          ? `Vergleicht verfügbare Hotels und Ferienunterkünfte in ${effectiveSearchTerm} für eigene Anreise.`
          : `Vergleicht Pauschalreisen (Flug + Hotel) nach ${effectiveSearchTerm} bei großen Reiseveranstaltern.`,
      includedServicesNote: '',
      transferredParams: [
        `Reiseziel (${effectiveSearchTerm})`,
        ...(travelType !== 'hotel' ? [`Abflughafen (${originCode})`] : ['Eigene Anreise']),
        `Zeitraum (${deCheckIn} – ${deCheckOut})`,
        `Reisende (${travelerParamSummary})`,
      ],
      manualParamsAtProvider:
        boardFilter !== 'Beliebig' ? [`Verpflegung (${boardFilter}) im Filter auswählen`] : [],
      supportsFullDeepLink: true,
      ctaLabel: 'Angebote prüfen',
    },
    {
      id: 'expedia',
      partnerName: 'Expedia.de',
      categoryLabel:
        travelType === 'flug'
          ? 'Flugsuche (Hin- & Rückflug)'
          : travelType === 'hotel'
          ? 'Hotels & Ferienunterkünfte'
          : 'Hotels & Kombi-Reisen',
      primaryForTypes: ['pauschal', 'hotel', 'flug'],
      url: expediaUrl,
      affiliateNetworkLabel: 'Expedia Partnerprogramm',
      affiliateIdSummary: `camref ${expediaCamref}`,
      description:
        travelType === 'flug'
          ? `Sucht passende Hin- und Rückflüge von ${originCode} nach ${dest.iata} (${effectiveSearchTerm}).`
          : travelType === 'hotel'
          ? `Hotels, Strandresorts und Apartments in ${effectiveSearchTerm} im direkten Preisvergleich.`
          : `Hotels, Resorts und flexibel kombinierbare Reiseangebote für ${effectiveSearchTerm}.`,
      includedServicesNote: '',
      transferredParams:
        travelType === 'flug'
          ? [
              `Flugstrecke (${originCode} ↔ ${dest.iata})`,
              `Reisedaten (${deCheckIn} – ${deCheckOut})`,
              `Reisende (${travelerParamSummary})`,
            ]
          : [
              `Reiseziel (${effectiveSearchTerm})`,
              `Zeitraum (${deCheckIn} – ${deCheckOut})`,
              `Reisende (${travelerParamSummary})`,
            ],
      manualParamsAtProvider:
        travelType === 'pauschal' ? ['Bei Bedarf auf Expedia den Flug-Filter ergänzen'] : [],
      supportsFullDeepLink: true,
      ctaLabel: 'Angebote prüfen',
    },
    {
      id: 'ab-in-den-urlaub',
      partnerName: 'ab-in-den-urlaub.de',
      categoryLabel:
        travelType === 'hotel'
          ? 'Hotels mit eigener Anreise'
          : 'Pauschalreisen, Familien & Last Minute',
      primaryForTypes: ['pauschal', 'hotel'],
      url: abInDenUrlaubUrl,
      affiliateNetworkLabel: 'Awin Partnerprogramm',
      affiliateIdSummary: `Awin ID ${awinPubId}`,
      description:
        travelType === 'hotel'
          ? `Hotels, Resorts und Ferienanlagen mit eigener Anreise (${effectiveCountry}).`
          : `Pauschalreisen, All-Inclusive-Hotels und Familienangebote zahlreicher Reiseveranstalter (${effectiveCountry}).`,
      includedServicesNote: '',
      transferredParams: [aiduTarget.targetLabel],
      manualParamsAtProvider: [
        `Reisezeitraum (${deCheckIn} – ${deCheckOut})${
          travelType === 'pauschal' ? `, Abflughafen (${originCode})` : ''
        } und Reisende (${travelerParamSummary}) beim Anbieter eingeben`,
      ],
      supportsFullDeepLink: false,
      ctaLabel: 'Angebote prüfen',
      secondaryAction:
        travelType === 'pauschal'
          ? {
              label: 'Sommerurlaub-Angebote ansehen',
              url: aiduSommerurlaubUrl,
            }
          : undefined,
      additionalActions:
        travelType === 'pauschal'
          ? [
              childrenAges.length > 0
                ? {
                    label: 'Familienurlaub mit Kindern ansehen',
                    url: aiduFamilienurlaubUrl,
                  }
                : {
                    label: 'All-Inclusive-Angebote ansehen',
                    url: aiduAllInclusiveUrl,
                  },
              {
                label: 'Last-Minute-Angebote ansehen',
                url: aiduLastMinuteUrl,
              },
            ]
          : undefined,
    },
    {
      id: 'tripcom',
      partnerName: 'Trip.com',
      categoryLabel:
        travelType === 'pauschal'
          ? 'Flug + Hotel Kombi-Reisen (Packages)'
          : travelType === 'hotel'
          ? 'Hotels & Unterkünfte weltweit'
          : 'Flugvergleich weltweit',
      primaryForTypes: ['pauschal', 'hotel', 'flug'],
      url: tripComUrl,
      affiliateNetworkLabel: 'Trip.com Partnerprogramm',
      affiliateIdSummary: 'AllianceID 10486295 / SID 330669011',
      description:
        travelType === 'pauschal'
          ? `Kombi-Reisen (Flug + Hotel) für die Verbindung ${originCode} nach ${dest.iata} (${effectiveSearchTerm}) sowie Hotels, Transfers und Aktivitäten.`
          : travelType === 'hotel'
          ? `Große Auswahl an Stadthotels, Strandresorts und Unterkünften zum gewählten Zeitraum.`
          : `Vergleicht Linien- und Ferienflüge auf der Strecke ${originCode} ↔ ${dest.iata} (${effectiveSearchTerm}).`,
      includedServicesNote: '',
      transferredParams:
        travelType === 'pauschal'
          ? [
              `Abflughafen (${originCode})`,
              `Zielflughafen (${dest.iata} – ${effectiveSearchTerm})`,
            ]
          : travelType === 'hotel'
          ? [`Zeitraum (${deCheckIn} – ${deCheckOut})`, `Erwachsene (${adults})`]
          : [
              `Flugstrecke (${originCode} ↔ ${dest.iata})`,
              `Reisedaten (${deCheckIn} – ${deCheckOut})`,
              `Reisende (${travelerParamSummary})`,
            ],
      manualParamsAtProvider:
        travelType === 'pauschal'
          ? [`Reisezeitraum (${deCheckIn} – ${deCheckOut}) und Reisende bei Trip.com auswählen`]
          : travelType === 'hotel'
          ? [`Reiseziel (${effectiveSearchTerm}) im Suchfeld bei Trip.com eingeben`]
          : [],
      supportsFullDeepLink: travelType === 'flug',
      ctaLabel:
        travelType === 'pauschal'
          ? 'Flug + Hotel Angebote prüfen'
          : travelType === 'hotel'
          ? 'Hotels bei Trip.com prüfen'
          : 'Flüge bei Trip.com prüfen',
      secondaryAction:
        travelType === 'pauschal'
          ? {
              label: 'Nur Flüge bei Trip.com prüfen',
              url: tripComFlightUrl,
            }
          : {
              label: 'Flug + Hotel Kombi-Pakete bei Trip.com',
              url: tripComPackagesUrl,
            },
      additionalActions: [
        ...(travelType !== 'hotel'
          ? [
              {
                label: 'Hotels & Resorts bei Trip.com',
                url: tripComHotelUrl,
              },
            ]
          : []),
        {
          label: 'Mietwagen & Flughafentransfers bei Trip.com',
          url: tripComCarHireUrl,
        },
        {
          label: 'Ausflüge, Touren & Attraktionen bei Trip.com',
          url: tripComThingsToDoUrl,
        },
        {
          label: 'Zugtickets & Bahnreisen bei Trip.com',
          url: tripComTrainsUrl,
        },
      ],
    },
    {
      id: 'aviasales',
      partnerName: 'Aviasales',
      categoryLabel: 'Flug-Preisvergleich (Linie & Direktflug)',
      primaryForTypes: ['flug'],
      url: aviasalesUrl,
      affiliateNetworkLabel: 'Travelpayouts',
      affiliateIdSummary: `Marker ${tpMarker}`,
      description: `Vergleicht Flugverbindungen vieler Airlines und Buchungsportale für ${originCode} ↔ ${dest.iata}.`,
      includedServicesNote: '',
      transferredParams: [
        `Flugstrecke (${originCode} ↔ ${dest.iata})`,
        `Reisedaten (${deCheckIn} – ${deCheckOut})`,
        `Passagiere (${travelerParamSummary})`,
      ],
      manualParamsAtProvider: [],
      supportsFullDeepLink: true,
      ctaLabel: 'Angebote prüfen',
    },
    {
      id: 'asi-reisen',
      partnerName: 'ASI Reisen',
      categoryLabel: 'Wanderreisen, Rundreisen & Winterreisen',
      primaryForTypes: [],
      isSpecialistAddon: 'wandern',
      url: asiWanderreisenUrl,
      affiliateNetworkLabel: 'Awin Partnerprogramm',
      affiliateIdSummary: `Awin ID ${awinPubId} (awinmid 126961)`,
      description:
        'Geführte und individuelle Wander- und Trekkingreisen, weltweite Rundreisen sowie Schneeschuhwandern.',
      includedServicesNote: '',
      transferredParams: ['Kategorieseite: Wanderreisen bei ASI Reisen'],
      manualParamsAtProvider: ['Gewünschtes Reiseziel und Zeitraum direkt bei ASI Reisen auswählen'],
      supportsFullDeepLink: false,
      ctaLabel: 'Angebote prüfen (Wanderreisen)',
      secondaryAction: {
        label: 'Individuelle Rundreisen bei ASI Reisen',
        url: asiRundreisenUrl,
      },
      additionalActions: [
        {
          label: 'Schneeschuhwandern & Winterreisen bei ASI Reisen',
          url: asiWinterreisenUrl,
        },
      ],
    },
    {
      id: 'discovercars',
      partnerName: 'DiscoverCars',
      categoryLabel: 'Mietwagen am Urlaubsort',
      primaryForTypes: [],
      isSpecialistAddon: 'mietwagen',
      url: discoverCarsUrl,
      affiliateNetworkLabel: 'DiscoverCars Partnerprogramm',
      affiliateIdSummary: 'a_aid CleverEntdeckt',
      description: `Vergleicht Mietwagen-Angebote lokaler und internationaler Vermieter am Zielflughafen ${dest.iata}.`,
      includedServicesNote: '',
      transferredParams: [`Abholregion / Zielflughafen (${dest.iata})`],
      manualParamsAtProvider: [`Abhol- und Rückgabedatum (${deCheckIn} – ${deCheckOut}) auswählen`],
      supportsFullDeepLink: true,
      ctaLabel: 'Angebote prüfen',
    },
    {
      id: 'tripcom-mietwagen',
      partnerName: 'Trip.com Mietwagen & Transfers',
      categoryLabel: 'Mietwagen & Flughafentransfers weltweit',
      primaryForTypes: [],
      isSpecialistAddon: 'mietwagen',
      url: tripComCarHireUrl,
      affiliateNetworkLabel: 'Trip.com Partnerprogramm',
      affiliateIdSummary: 'AllianceID 10486295 / SID 330669011',
      description: `Mietwagen am Flughafen oder Urlaubsort sowie buchbare Flughafentransfers zum Hotel.`,
      includedServicesNote: '',
      transferredParams: ['Kategorieseite: Mietwagen bei Trip.com'],
      manualParamsAtProvider: [
        `Abholort (${effectiveSearchTerm} / ${dest.iata}) und Zeitraum (${deCheckIn} – ${deCheckOut}) eingeben`,
      ],
      supportsFullDeepLink: false,
      ctaLabel: 'Mietwagen bei Trip.com prüfen',
      secondaryAction: {
        label: 'Flughafentransfers bei Trip.com prüfen',
        url: tripComTransfersUrl,
      },
    },
    {
      id: 'camping-info',
      partnerName: 'camping.info',
      categoryLabel: 'Campingplätze & Mobilheime',
      primaryForTypes: [],
      isSpecialistAddon: 'camping',
      url: campingInfoUrl,
      affiliateNetworkLabel: 'Awin Partnerprogramm',
      affiliateIdSummary: `Awin ID ${awinPubId}`,
      description: 'Campingplätze, Glamping und Mietunterkünfte in Europa.',
      includedServicesNote: '',
      transferredParams: [dest.searchTerm ? `Zielland (${effectiveCountry})` : 'Campingplatz-Übersicht für Europa'],
      manualParamsAtProvider: [`Reisezeitraum (${deCheckIn} – ${deCheckOut}) und Personen eingeben`],
      supportsFullDeepLink: false,
      ctaLabel: 'Angebote prüfen',
    },
    {
      id: 'camperdays',
      partnerName: 'CamperDays',
      categoryLabel: 'Wohnmobile & Camper mieten',
      primaryForTypes: [],
      isSpecialistAddon: 'camping',
      url: camperDaysUrl,
      affiliateNetworkLabel: 'Awin Partnerprogramm',
      affiliateIdSummary: `Awin ID ${awinPubId}`,
      description: 'Preisvergleich für Miet-Wohnmobile und Campervans weltweit.',
      includedServicesNote: '',
      transferredParams: ['Startseite Wohnmobil-Vergleich'],
      manualParamsAtProvider: ['Abholort und Mietzeitraum beim Anbieter auswählen'],
      supportsFullDeepLink: false,
      ctaLabel: 'Angebote prüfen',
    },
    {
      id: 'tui-camper',
      partnerName: 'TUI Camper',
      categoryLabel: 'Wohnmobile weltweit mieten',
      primaryForTypes: [],
      isSpecialistAddon: 'camping',
      url: tuiCamperUrl,
      affiliateNetworkLabel: 'Awin Partnerprogramm',
      affiliateIdSummary: `Awin ID ${awinPubId}`,
      description: 'Wohnmobil-Angebote von TUI für Europa und weltweite Rundreisen.',
      includedServicesNote: '',
      transferredParams: ['Startseite TUI Camper'],
      manualParamsAtProvider: ['Abholstation und Reisedaten beim Anbieter eingeben'],
      supportsFullDeepLink: false,
      ctaLabel: 'Angebote prüfen',
    },
    {
      id: 'klook',
      partnerName: 'Klook',
      categoryLabel: 'Ausflüge, Tickets & Transfers vor Ort',
      primaryForTypes: [],
      isSpecialistAddon: 'wandern',
      url: klookUrl,
      affiliateNetworkLabel: 'Travelpayouts',
      affiliateIdSummary: `Marker ${tpMarker}`,
      description: `Ausflüge, Sehenswürdigkeiten-Tickets und Flughafentransfers für ${effectiveSearchTerm}.`,
      includedServicesNote: '',
      transferredParams: [`Zielort (${effectiveSearchTerm})`],
      manualParamsAtProvider: ['Wunschdatum beim Anbieter auswählen'],
      supportsFullDeepLink: true,
      ctaLabel: 'Angebote prüfen',
    },
  ];

  return offers;
}

// Privacy-friendly, cookie-free local & dataLayer event measurement (Requirement 10.F)
export interface AnonymizedUsageStats {
  totalSearches: number;
  searchesByType: Record<PrimaryTravelType, number>;
  outboundClicksByPartner: Record<string, number>;
  lastUpdated: string;
}

const STATS_STORAGE_KEY = 'cleverentdeckt_reiseradar_anon_stats_v1';

export function getAnonymizedUsageStats(): AnonymizedUsageStats {
  const fallback: AnonymizedUsageStats = {
    totalSearches: 0,
    searchesByType: { pauschal: 0, hotel: 0, flug: 0 },
    outboundClicksByPartner: {},
    lastUpdated: '',
  };
  try {
    const raw = localStorage.getItem(STATS_STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return {
      totalSearches: Number(parsed.totalSearches) || 0,
      searchesByType: {
        pauschal: Number(parsed.searchesByType?.pauschal) || 0,
        hotel: Number(parsed.searchesByType?.hotel) || 0,
        flug: Number(parsed.searchesByType?.flug) || 0,
      },
      outboundClicksByPartner: parsed.outboundClicksByPartner || {},
      lastUpdated: parsed.lastUpdated || '',
    };
  } catch {
    return fallback;
  }
}

export function trackReiseRadarSearch(travelType: PrimaryTravelType, destination: string): void {
  try {
    const current = getAnonymizedUsageStats();
    current.totalSearches += 1;
    current.searchesByType[travelType] = (current.searchesByType[travelType] || 0) + 1;
    current.lastUpdated = new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
    localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(current));

    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('cleverentdeckt:search', {
          detail: { travelType, destination, timestamp: new Date().toISOString() },
        })
      );
    }
  } catch {
    // Ignore storage errors in private mode
  }
}

export function trackReiseRadarPartnerClick(
  partnerId: string,
  partnerName: string,
  travelType: PrimaryTravelType,
  destination: string
): void {
  try {
    const current = getAnonymizedUsageStats();
    current.outboundClicksByPartner[partnerName] =
      (current.outboundClicksByPartner[partnerName] || 0) + 1;
    current.lastUpdated = new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
    localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(current));

    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('cleverentdeckt:partner_click', {
          detail: { partnerId, partnerName, travelType, destination, timestamp: new Date().toISOString() },
        })
      );
    }
  } catch {
    // Ignore storage errors
  }
}
