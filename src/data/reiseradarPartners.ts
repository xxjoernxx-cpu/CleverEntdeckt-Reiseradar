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

  if (presetById && (!cleanInput || presetById.label.toLowerCase().includes(cleanInput.toLowerCase()) || presetById.searchTerm.toLowerCase() === cleanInput.toLowerCase())) {
    return {
      displayTitle: presetById.label,
      searchTerm: presetById.searchTerm,
      country: presetById.country,
      iata: presetById.iata,
      regionName: presetById.regionName,
    };
  }

  const lower = cleanInput.toLowerCase();
  if (lower.includes('side') || lower.includes('kumköy') || lower.includes('kumkoey') || lower.includes('manavgat')) {
    return {
      displayTitle: 'Side & Kumköy (Antalya / Türkische Riviera)',
      searchTerm: 'Side, Antalya',
      country: 'Türkei',
      iata: 'AYT',
      regionName: 'Türkische Riviera',
    };
  }
  if (lower === 'türkei' || lower === 'tuerkei' || lower === 'turkei' || lower.includes('antalya') || lower.includes('türkische riviera')) {
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
      displayTitle: cleanInput || 'Spanien (Mallorca & Küsten)',
      searchTerm: lower === 'spanien' ? 'Spanien' : cleanInput,
      country: 'Spanien',
      iata: 'PMI',
      regionName: 'Spanien / Balearen',
    };
  }
  if (lower === 'italien') {
    return {
      displayTitle: 'Italien (Rom, Küsten & Seen)',
      searchTerm: 'Italien',
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
    displayTitle: cleanInput || 'Side & Kumköy (Antalya)',
    searchTerm: cleanInput || 'Side, Antalya',
    country: cleanInput || 'Türkei',
    iata: 'AYT',
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
  if (combined.includes('spanien') || combined.includes('mallorca') || combined.includes('teneriffa') || combined.includes('barcelona') || combined.includes('andalusien')) return 'spanien';
  if (combined.includes('italien') || combined.includes('rom') || combined.includes('sizilien') || combined.includes('gardasee') || combined.includes('amalfi') || combined.includes('sardinien')) return 'italien';
  if (combined.includes('türkei') || combined.includes('tuerkei') || combined.includes('antalya') || combined.includes('side') || combined.includes('izmir') || combined.includes('bodrum')) return 'tuerkei';
  if (combined.includes('kroatien') || combined.includes('istrien') || combined.includes('split') || combined.includes('dalmatien')) return 'kroatien';
  if (combined.includes('griechenland') || combined.includes('kreta') || combined.includes('rhodos') || combined.includes('athen')) return 'griechenland';
  if (combined.includes('portugal') || combined.includes('algarve') || combined.includes('lissabon')) return 'portugal';
  if (combined.includes('österreich') || combined.includes('oesterreich') || combined.includes('tirol') || combined.includes('salzburg') || combined.includes('kärnten')) return 'oesterreich';
  if (combined.includes('schweiz') || combined.includes('zürich') || combined.includes('wallis')) return 'schweiz';
  if (combined.includes('frankreich') || combined.includes('korsika') || combined.includes('cote')) return 'frankreich';
  if (combined.includes('polen') || combined.includes('krakau') || combined.includes('ostsee')) return 'polen';
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
        targetLabel: 'Hotels an der Türkischen Riviera (Eigenanreise)',
        hasRegionMatch: true,
      };
    }
    if (combined.includes('mallorca') || combined.includes('palma')) {
      return {
        targetUrl: 'https://www.ab-in-den-urlaub.de/hotels/europa/spanien/mallorca',
        targetLabel: 'Hotels auf Mallorca (Eigenanreise)',
        hasRegionMatch: true,
      };
    }
    return {
      targetUrl: 'https://www.ab-in-den-urlaub.de/eigene-anreise',
      targetLabel: 'Hotels & Unterkünfte mit eigener Anreise',
      hasRegionMatch: false,
    };
  }

  // Pauschalreise & Urlaub nach Zielregion
  if (combined.includes('side') || combined.includes('kumköy') || combined.includes('manavgat')) {
    return {
      targetUrl: 'https://www.ab-in-den-urlaub.de/urlaub/europa/tuerkei/tuerkische-riviera/side',
      targetLabel: 'Reiseziel Side & Türkische Riviera',
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
      targetLabel: 'Reiseziel Türkische Riviera & Antalya',
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
      targetLabel: 'Reiseziel Türkei',
      hasRegionMatch: true,
    };
  }
  if (combined.includes('mallorca') || combined.includes('palma')) {
    return {
      targetUrl: 'https://www.ab-in-den-urlaub.de/urlaub/europa/spanien/mallorca',
      targetLabel: 'Reiseziel Mallorca (Spanien)',
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
      targetLabel: 'Reiseziel Spanien & Inseln',
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
      targetLabel: 'Reiseziel Italien',
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
      targetLabel: 'Reiseziel Griechenland & Inseln',
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
      targetLabel: 'Reiseziel Ägypten & Rotes Meer',
      hasRegionMatch: true,
    };
  }
  if (combined.includes('portugal') || combined.includes('algarve') || combined.includes('lissabon')) {
    return {
      targetUrl: 'https://www.ab-in-den-urlaub.de/urlaub/europa/portugal',
      targetLabel: 'Reiseziel Portugal & Algarve',
      hasRegionMatch: true,
    };
  }
  if (combined.includes('kroatien') || combined.includes('split') || combined.includes('istrien')) {
    return {
      targetUrl: 'https://www.ab-in-den-urlaub.de/urlaub/europa/kroatien',
      targetLabel: 'Reiseziel Kroatien & Adria',
      hasRegionMatch: true,
    };
  }

  return {
    targetUrl: 'https://www.ab-in-den-urlaub.de/reiseangebote/sommerurlaub',
    targetLabel: 'Sommerurlaub- & Pauschalreise-Angebote',
    hasRegionMatch: false,
  };
}

export function buildVerifiedPartnerOffers(params: SearchParameters): PartnerOfferCardData[] {
  const aff = getSavedAffiliateConfig();
  const dest = resolveDestinationInfo(params.destinationText, params.selectedPresetId);
  const { travelType, originCode, checkInDate, checkOutDate, adults, childrenAges, boardFilter } = params;

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
  const check24Url = `https://urlaub.check24.de/suche/hotel?search=${encodeURIComponent(dest.searchTerm)}${
    travelType !== 'hotel' ? `&airport=${encodeURIComponent(originCode)}` : ''
  }&transportType=${check24Transport}&departureDate=${checkInDate}&returnDate=${checkOutDate}&adultCount=${adults}${check24ChildrenPart}&sort=price_asc&partnerid=${encodeURIComponent(check24PartnerId)}`;

  // 2. Expedia.de (Pauschalreise, Hotel & Flug via Partnerize camref:1100l6tjov)
  const expediaChildrenHotelParam =
    childrenAges.length > 0
      ? `&children=${encodeURIComponent(childrenAges.map((age) => `1_${age}`).join(','))}`
      : '';
  const baseExpediaHotelOrPkgUrl = `https://www.expedia.de/Hotel-Search?destination=${encodeURIComponent(dest.searchTerm)}&startDate=${checkInDate}&endDate=${checkOutDate}&d1=${checkInDate}&d2=${checkOutDate}&rooms=1&adults=${adults}${expediaChildrenHotelParam}&sort=PRICE_LOW_TO_HIGH&siteid=6&langid=1031`;

  const expediaLeg1 = `from:${originCode},to:${dest.iata},departure:${deCheckIn}TANYT`;
  const expediaLeg2 = `from:${dest.iata},to:${originCode},departure:${deCheckOut}TANYT`;
  const expediaFlightPassengers = `children:${childrenAges.length}${
    childrenAges.length > 0 ? `[${childrenAges.join(';')}]` : ''
  },adults:${adults},seniors:0,infantinlap:Y`;
  const baseExpediaFlightUrl = `https://www.expedia.de/Flights-Search?flight-type=on&mode=search&trip=roundtrip&leg1=${encodeURIComponent(expediaLeg1)}&leg2=${encodeURIComponent(expediaLeg2)}&fromDate=${encodeURIComponent(deCheckIn)}&toDate=${encodeURIComponent(deCheckOut)}&d1=${checkInDate}&d2=${checkOutDate}&passengers=${encodeURIComponent(expediaFlightPassengers)}&options=${encodeURIComponent('cabinclass:economy,sortby:price')}&siteid=6&langid=1031`;

  const targetExpediaInnerUrl = travelType === 'flug' ? baseExpediaFlightUrl : baseExpediaHotelOrPkgUrl;
  const expediaUrl = `https://www.expedia.de/affiliate?siteid=6&landingPage=${encodeURIComponent(targetExpediaInnerUrl)}&camref=${encodeURIComponent(expediaCamref)}&creativeref=1101l87346`;

  // 3. ab-in-den-urlaub (Awin awinmid=9369, awinaffid=3034525 mit Zielgebiets- & Themen-Deep-Links)
  const aiduTarget = resolveAbInDenUrlaubTarget(dest.country, dest.searchTerm, travelType);
  const buildAiduLink = (targetPage: string) =>
    `https://www.awin1.com/cread.php?awinmid=9369&awinaffid=${encodeURIComponent(awinPubId)}&ued=${encodeURIComponent(targetPage)}`;

  const abInDenUrlaubUrl = buildAiduLink(aiduTarget.targetUrl);
  const aiduSommerurlaubUrl = buildAiduLink('https://www.ab-in-den-urlaub.de/reiseangebote/sommerurlaub');
  const aiduFamilienurlaubUrl = buildAiduLink('https://www.ab-in-den-urlaub.de/reiseangebote/urlaub-mit-kindern');
  const aiduAllInclusiveUrl = buildAiduLink('https://www.ab-in-den-urlaub.de/urlaub/all-inclusive');
  const aiduLastMinuteUrl = buildAiduLink('https://www.ab-in-den-urlaub.de/lastminute');

  // 4. Trip.com (Flug & Hotel mit Allianceid=10486295, SID=330669011)
  const tripComFlightUrl = `https://de.trip.com/flights/${originCode.toLowerCase()}-to-${dest.iata.toLowerCase()}/tickets-${originCode.toLowerCase()}-${dest.iata.toLowerCase()}?dcity=${originCode.toLowerCase()}&acity=${dest.iata.toLowerCase()}&ddate=${checkInDate}&rdate=${checkOutDate}&flighttype=rt&class=y&quantity=${adults}&childqty=${childrenAges.length}&Allianceid=10486295&SID=330669011&locale=de_de`;
  const tripComHotelUrl = `https://de.trip.com/hotels/list?checkin=${checkInDate}&checkout=${checkOutDate}&adult=${adults}&crn=1&Allianceid=10486295&SID=330669011&locale=de_de`;
  const tripComUrl = travelType === 'hotel' ? tripComHotelUrl : tripComFlightUrl;

  // 5. Aviasales Flug-Metasuche (Travelpayouts Marker 771810)
  const aviasalesUrl = `https://www.aviasales.com/search/${originCode.toUpperCase()}${aviaOut}${dest.iata.toUpperCase()}${aviaIn}${adults}${
    childrenAges.length > 0 ? childrenAges.length : ''
  }?currency=eur&marker=${encodeURIComponent(tpMarker)}`;

  // 6. DiscoverCars Mietwagen (a_aid=CleverEntdeckt, a_bid=61a4ac81)
  const discoverCarsUrl = `https://www.discovercars.com/de?iata=${encodeURIComponent(dest.iata)}&a_aid=CleverEntdeckt&a_bid=61a4ac81`;

  // 7. ASI Reisen (Individuelle Rundreisen, Winterreisen & Wanderreisen via Awin awinmid=126961, awinaffid=3034525)
  const asiReisenUrl = `https://www.awin1.com/cread.php?awinmid=126961&awinaffid=${encodeURIComponent(awinPubId)}&ued=${encodeURIComponent('https://www.asi-reisen.de/gi/individuelle-rundreisen')}`;
  const asiWinterreisenUrl = `https://www.awin1.com/cread.php?awinmid=126961&awinaffid=${encodeURIComponent(awinPubId)}&ued=${encodeURIComponent('https://www.asi-reisen.de/a/schneeschuhwandern')}`;

  // 8. camping.info (Campingplätze & Glamping via Awin awinmid=44063, awinaffid=3034525)
  const campingSlug = getCampingCountrySlug(dest.country, dest.searchTerm);
  const campingInfoUrl = `https://www.awin1.com/cread.php?awinmid=44063&awinaffid=${encodeURIComponent(awinPubId)}&ued=${encodeURIComponent(`https://www.camping.info/de/land/${campingSlug}`)}`;

  // 9. CamperDays & TUI Camper (Wohnmobile via Awin)
  const camperDaysUrl = `https://www.awin1.com/cread.php?awinmid=52889&awinaffid=${encodeURIComponent(awinPubId)}&ued=${encodeURIComponent('https://www.camperdays.de/')}`;
  const tuiCamperUrl = `https://www.awin1.com/cread.php?awinmid=11934&awinaffid=${encodeURIComponent(awinPubId)}&ued=${encodeURIComponent('https://www.tuicamper.com/')}`;

  // 10. Klook Ausflüge & Flughafentransfers (Travelpayouts campaign_id=137, marker=771810)
  const klookUrl = `https://tp.media/r?campaign_id=137&marker=${encodeURIComponent(tpMarker)}&p=4110&trs=568370&u=${encodeURIComponent(`https://www.klook.com/de/search/result/?query=${encodeURIComponent(dest.searchTerm)}`)}`;

  const offers: PartnerOfferCardData[] = [
    {
      id: 'check24',
      partnerName: 'CHECK24 Reisevergleich',
      categoryLabel:
        travelType === 'hotel'
          ? 'Hotel- & Unterkunftsvergleich (Eigenanreise)'
          : 'Pauschalreise- & Veranstaltervergleich',
      primaryForTypes: ['pauschal', 'hotel'],
      url: check24Url,
      affiliateNetworkLabel: 'CHECK24 Partnerprogramm',
      affiliateIdSummary: `Partner-ID ${check24PartnerId}`,
      description:
        travelType === 'hotel'
          ? `Vergleicht verfügbare Hotels und Ferienunterkünfte in ${dest.searchTerm} bei führenden Hotelportalen und Reiseveranstaltern.`
          : `Vergleicht Pauschalreisen (Flug + Hotel) für ${dest.searchTerm} ab ${originCode} über zahlreiche deutsche Reiseveranstalter.`,
      includedServicesNote:
        boardFilter !== 'Beliebig'
          ? `Gewünschte Verpflegung (${boardFilter}), Gepäck- und Transferoptionen direkt im CHECK24-Filter wählbar.`
          : 'Flug, Hotel, Transfer- und Gepäckdetails werden pro Veranstalter transparent ausgewiesen.',
      transferredParams: [
        `Reiseziel (${dest.searchTerm})`,
        ...(travelType !== 'hotel' ? [`Abflughafen (${originCode})`] : ['Eigenanreise (Nur Hotel)']),
        `Zeitraum (${deCheckIn} – ${deCheckOut})`,
        `Reisende (${travelerParamSummary})`,
      ],
      manualParamsAtProvider:
        boardFilter !== 'Beliebig' ? [`Verpflegungsfilter (${boardFilter})`] : [],
      supportsFullDeepLink: true,
      ctaLabel: 'Aktuelle Preise bei CHECK24 prüfen',
    },
    {
      id: 'expedia',
      partnerName: 'Expedia.de',
      categoryLabel:
        travelType === 'flug'
          ? 'Linien- & Ferienflüge im Direktvergleich'
          : travelType === 'hotel'
          ? 'Hotels, Resorts & Ferienwohnungen'
          : 'Hotels, Flüge & flexible Kombi-Reisen',
      primaryForTypes: ['pauschal', 'hotel', 'flug'],
      url: expediaUrl,
      affiliateNetworkLabel: 'Expedia Group / Partnerize',
      affiliateIdSummary: `camref ${expediaCamref}`,
      description:
        travelType === 'flug'
          ? `Sucht verfügbare Hin- und Rückflüge von ${originCode} nach ${dest.iata} (${dest.searchTerm}) zum gewählten Datum.`
          : `Zeigt buchbare Hotels, Strandresorts und Unterkünfte in ${dest.searchTerm} – aufsteigend sortiert nach Preis.`,
      includedServicesNote:
        travelType === 'flug'
          ? 'Tarife mit Handgepäck oder Aufgabegepäck direkt bei Expedia auswählbar.'
          : 'Optionen mit kostenloser Stornierung sowie Frühstück/All-Inclusive direkt bei Expedia einstellbar.',
      transferredParams:
        travelType === 'flug'
          ? [
              `Abflughafen (${originCode}) & Zielflughafen (${dest.iata})`,
              `Flugdaten (${deCheckIn} – ${deCheckOut})`,
              `Passagiere (${travelerParamSummary})`,
            ]
          : [
              `Reiseziel (${dest.searchTerm})`,
              `Check-in & Check-out (${deCheckIn} – ${deCheckOut})`,
              `Gäste (${travelerParamSummary})`,
            ],
      manualParamsAtProvider:
        travelType === 'pauschal'
          ? ['Optional: Flug-Filter auf Expedia zuschalten']
          : [],
      supportsFullDeepLink: true,
      ctaLabel: 'Aktuelle Preise bei Expedia prüfen',
    },
    {
      id: 'ab-in-den-urlaub',
      partnerName: 'ab-in-den-urlaub.de',
      categoryLabel: 'Pauschalreisen, Sommerurlaub, Familien & Last Minute',
      primaryForTypes: ['pauschal', 'hotel'],
      url: abInDenUrlaubUrl,
      affiliateNetworkLabel: 'Awin Partnerprogramm',
      affiliateIdSummary: `Awin ID ${awinPubId} (awinmid 9369)`,
      description:
        `Großer deutscher Veranstaltervergleich für Pauschalreisen, Sommerurlaub, All-Inclusive-Strandhotels und Familienangebote (${dest.country}).`,
      includedServicesNote:
        'Pauschalangebote beinhalten je nach Veranstalter Hin- & Rückflug, Hotel, ggf. Zug-zum-Flug und Hoteltransfer.',
      transferredParams: [
        `Zielseiten-Vorauswahl: ${aiduTarget.targetLabel}`,
        'Affiliate-Partnerkennung (Awin Deep-Link)',
      ],
      manualParamsAtProvider: [
        `Reisezeitraum (${deCheckIn} – ${deCheckOut}) & Reisende (${travelerParamSummary}) im Filter bestätigen`,
      ],
      supportsFullDeepLink: aiduTarget.hasRegionMatch,
      ctaLabel: aiduTarget.hasRegionMatch
        ? `${dest.country}-Angebote bei ab-in-den-urlaub.de prüfen`
        : 'Angebote bei ab-in-den-urlaub.de prüfen',
      secondaryAction: {
        label: 'Sommerurlaub-Angebote bei ab-in-den-urlaub.de',
        url: aiduSommerurlaubUrl,
      },
      additionalActions: [
        childrenAges.length > 0
          ? {
              label: 'Familienurlaub & Reisen mit Kindern ansehen',
              url: aiduFamilienurlaubUrl,
            }
          : {
              label: 'All-Inclusive-Angebote bei ab-in-den-urlaub.de',
              url: aiduAllInclusiveUrl,
            },
        {
          label: 'Last-Minute-Restplätze bei ab-in-den-urlaub.de',
          url: aiduLastMinuteUrl,
        },
      ],
    },
    {
      id: 'tripcom',
      partnerName: 'Trip.com',
      categoryLabel:
        travelType === 'hotel'
          ? 'Internationale Hotels & Resorts'
          : 'Weltweite Flüge & Kombi-Angebote',
      primaryForTypes: ['flug', 'hotel', 'pauschal'],
      url: tripComUrl,
      affiliateNetworkLabel: 'Trip.com Partnerprogramm',
      affiliateIdSummary: 'AllianceID 10486295 · SID 330669011',
      description:
        travelType === 'hotel'
          ? `Vergleicht internationale Hotelketten und Unterkünfte für den Zeitraum ${deCheckIn} – ${deCheckOut}.`
          : `Direkte Flugsuche für die Strecke ${originCode} → ${dest.iata} (${dest.searchTerm}) inklusive Linien- und Ferienfliegern.`,
      includedServicesNote:
        'Auswahl verschiedener Buchungsklassen, Gepäcktarife und Stornierungsbedingungen direkt im Buchungsschritt.',
      transferredParams:
        travelType === 'hotel'
          ? [
              `Check-in & Check-out (${deCheckIn} – ${deCheckOut})`,
              `Erwachsene (${adults})`,
            ]
          : [
              `Flugstrecke (${originCode} ↔ ${dest.iata})`,
              `Reisedaten (${deCheckIn} – ${deCheckOut})`,
              `Reisende (${travelerParamSummary})`,
            ],
      manualParamsAtProvider:
        travelType === 'hotel' ? [`Reiseziel (${dest.searchTerm}) im Suchfeld bestätigen`] : [],
      supportsFullDeepLink: travelType !== 'hotel',
      ctaLabel: 'Aktuelle Preise bei Trip.com prüfen',
    },
    {
      id: 'aviasales',
      partnerName: 'Aviasales Flug-Metasuche',
      categoryLabel: 'Reiner Flug-Preisvergleich (Linie & Low-Cost)',
      primaryForTypes: ['flug'],
      url: aviasalesUrl,
      affiliateNetworkLabel: 'Travelpayouts',
      affiliateIdSummary: `Marker ${tpMarker}`,
      description:
        `Durchsucht zeitgleich zahlreiche Airlines und Buchungsportale für den Hin- und Rückflug ${originCode} ↔ ${dest.iata}.`,
      includedServicesNote:
        'Zeigt Direktflüge und Umsteigeverbindungen im Vergleich. Gepäckgebühren werden beim jeweiligen Ticketanbieter angezeigt.',
      transferredParams: [
        `Start- & Zielflughafen (${originCode} ↔ ${dest.iata})`,
        `Hinflug (${deCheckIn}) & Rückflug (${deCheckOut})`,
        `Passagiere (${travelerParamSummary})`,
      ],
      manualParamsAtProvider: [],
      supportsFullDeepLink: true,
      ctaLabel: 'Flugpreise bei Aviasales prüfen',
    },
    {
      id: 'discovercars',
      partnerName: 'DiscoverCars',
      categoryLabel: 'Mietwagen am Urlaubsort / Flughafen',
      primaryForTypes: [],
      isSpecialistAddon: 'mietwagen',
      url: discoverCarsUrl,
      affiliateNetworkLabel: 'DiscoverCars Partnerprogramm',
      affiliateIdSummary: 'a_aid CleverEntdeckt',
      description:
        `Vergleicht lokale und internationale Autovermietungen direkt am Zielflughafen ${dest.iata} (${dest.searchTerm}).`,
      includedServicesNote:
        'Faire Tankregelung, Freikilometer und Vollkasko-Optionen transparent im Vergleich wählbar.',
      transferredParams: [`Abholflughafen / Zielregion (${dest.iata})`],
      manualParamsAtProvider: [`Abhol- & Rückgabedatum (${deCheckIn} – ${deCheckOut}) auswählen`],
      supportsFullDeepLink: true,
      ctaLabel: 'Mietwagen bei DiscoverCars prüfen',
    },
    {
      id: 'asi-reisen',
      partnerName: 'ASI Reisen',
      categoryLabel: 'Individuelle Rundreisen, Winter- & Wanderreisen',
      primaryForTypes: ['pauschal'],
      isSpecialistAddon: 'wandern',
      url: asiReisenUrl,
      affiliateNetworkLabel: 'Awin Partnerprogramm',
      affiliateIdSummary: `Awin ID ${awinPubId} (awinmid 126961)`,
      description:
        `Spezialist für individuell geplante Rundreisen, Winter- & Schneeschuhreisen sowie geführte und individuelle Wanderreisen (${dest.country} & weltweit).`,
      includedServicesNote:
        'Je nach Reise inkl. sorgfältig ausgewählter Unterkünfte, Routenplanung, Mietwagen/Transfers und optionalem Flug.',
      transferredParams: ['Direktlinks zu Rundreisen, Winterreisen & Wanderreisen (Awin Deep-Links)'],
      manualParamsAtProvider: [`Wunschregion (${dest.searchTerm}) & Reisetermin auf der Zielseite wählen`],
      supportsFullDeepLink: false,
      ctaLabel: 'Individuelle Rundreisen bei ASI Reisen prüfen',
      secondaryAction: {
        label: 'Winter- & Schneeschuhreisen bei ASI Reisen ansehen',
        url: asiWinterreisenUrl,
      },
      additionalActions: [
        {
          label: 'Wander- & Trekkingreisen bei ASI Reisen ansehen',
          url: `https://www.awin1.com/cread.php?s=4805736&v=126961&q=607249&r=${encodeURIComponent(awinPubId)}`,
        },
      ],
    },
    {
      id: 'camping-info',
      partnerName: 'camping.info',
      categoryLabel: 'Campingplätze, Stellplätze & Mietunterkünfte',
      primaryForTypes: [],
      isSpecialistAddon: 'camping',
      url: campingInfoUrl,
      affiliateNetworkLabel: 'Awin Partnerprogramm',
      affiliateIdSummary: `Awin ID ${awinPubId} (Merchant 44063)`,
      description:
        `Über 23.000 Campingplätze, Glamping-Unterkünfte und Wohnmobil-Stellplätze in ${dest.country} und ganz Europa mit echten Camper-Bewertungen.`,
      includedServicesNote:
        'Direkte Online-Verfügbarkeitsprüfung für Standplätze, Mobilheime und Bungalows.',
      transferredParams: [`Zielland-Vorauswahl (${dest.country})`],
      manualParamsAtProvider: [`An-/Abreisedatum (${deCheckIn} – ${deCheckOut}) & Personen eingeben`],
      supportsFullDeepLink: true,
      ctaLabel: `Campingplätze in ${dest.country} prüfen`,
    },
    {
      id: 'camperdays',
      partnerName: 'CamperDays',
      categoryLabel: 'Wohnmobil- & Camper-Preisvergleich',
      primaryForTypes: [],
      isSpecialistAddon: 'camping',
      url: camperDaysUrl,
      affiliateNetworkLabel: 'Awin Partnerprogramm',
      affiliateIdSummary: `Awin ID ${awinPubId} (Merchant 52889)`,
      description:
        'Vergleicht Miet-Wohnmobile und Kastenwagen führender Vermieter weltweit ohne versteckte Gebühren.',
      includedServicesNote:
        'Transparente Versicherungs- und Kilometerpakete direkt im Buchungsvergleich.',
      transferredParams: ['Affiliate-Partnerkennung (Awin)'],
      manualParamsAtProvider: ['Abholstation und Mietzeitraum beim Anbieter wählen'],
      supportsFullDeepLink: false,
      ctaLabel: 'Wohnmobile bei CamperDays vergleichen',
    },
    {
      id: 'tui-camper',
      partnerName: 'TUI Camper',
      categoryLabel: 'Wohnmobile & Camper weltweit mieten',
      primaryForTypes: [],
      isSpecialistAddon: 'camping',
      url: tuiCamperUrl,
      affiliateNetworkLabel: 'Awin Partnerprogramm',
      affiliateIdSummary: `Awin ID ${awinPubId} (Merchant 11934)`,
      description:
        'Wohnmobil-Angebote mit TUI-Qualitätsstandards für Rundreisen in Europa und Übersee.',
      includedServicesNote:
        'Inklusive Beratung, Versicherungsschutz und flexiblen Stornierungsoptionen.',
      transferredParams: ['Affiliate-Partnerkennung (Awin)'],
      manualParamsAtProvider: ['Abholort und Reisedaten bei TUI Camper eingeben'],
      supportsFullDeepLink: false,
      ctaLabel: 'Angebote bei TUI Camper prüfen',
    },
    {
      id: 'klook',
      partnerName: 'Klook Ausflüge & Transfers',
      categoryLabel: 'Flughafentransfers, Touren & Tickets vor Ort',
      primaryForTypes: [],
      isSpecialistAddon: 'aktiv_wandern' as unknown as 'wandern',
      url: klookUrl,
      affiliateNetworkLabel: 'Travelpayouts',
      affiliateIdSummary: `Marker ${tpMarker}`,
      description:
        `Geprüfte Ausflüge, Sehenswürdigkeiten-Tickets und private Flughafentransfers für ${dest.searchTerm}.`,
      includedServicesNote:
        'Sofortige Ticketbestätigung auf dem Smartphone – ideal als Ergänzung zur gebuchten Reise.',
      transferredParams: [`Zielort-Suche (${dest.searchTerm})`],
      manualParamsAtProvider: ['Wunschdatum für Ausflug oder Transfer wählen'],
      supportsFullDeepLink: true,
      ctaLabel: 'Ausflüge & Transfers bei Klook ansehen',
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
