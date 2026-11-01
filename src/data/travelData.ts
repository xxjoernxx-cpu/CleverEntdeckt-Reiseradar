export type TransportMode = 'all' | 'flight' | 'train_flight' | 'package';
export type LuggageOption = 'personal' | 'cabin' | 'checked';
export type UserCurrencyCode = 'EUR' | 'CHF' | 'USD' | 'GBP' | 'PLN' | 'TRY' | 'HUF' | 'MAD';

export interface CurrencyConfig {
  code: UserCurrencyCode;
  symbol: string;
  name: string;
  rateFromEur: number; // 1 EUR = X target currency
  decimals: number;
  symbolPosition: 'before' | 'after';
}

export const SUPPORTED_CURRENCIES: Record<UserCurrencyCode, CurrencyConfig> = {
  EUR: { code: 'EUR', symbol: '€', name: 'Euro (EUR)', rateFromEur: 1.0, decimals: 0, symbolPosition: 'after' },
  CHF: { code: 'CHF', symbol: 'CHF', name: 'Schweizer Franken (CHF)', rateFromEur: 0.94, decimals: 0, symbolPosition: 'before' },
  USD: { code: 'USD', symbol: '$', name: 'US-Dollar (USD)', rateFromEur: 1.09, decimals: 0, symbolPosition: 'before' },
  GBP: { code: 'GBP', symbol: '£', name: 'Britisches Pfund (GBP)', rateFromEur: 0.84, decimals: 0, symbolPosition: 'before' },
  PLN: { code: 'PLN', symbol: 'zł', name: 'Polnischer Złoty (PLN)', rateFromEur: 4.32, decimals: 0, symbolPosition: 'after' },
  TRY: { code: 'TRY', symbol: '₺', name: 'Türkische Lira (TRY)', rateFromEur: 37.4, decimals: 0, symbolPosition: 'after' },
  HUF: { code: 'HUF', symbol: 'Ft', name: 'Ungarischer Forint (HUF)', rateFromEur: 402.0, decimals: 0, symbolPosition: 'after' },
  MAD: { code: 'MAD', symbol: 'DH', name: 'Marokkanischer Dirham (MAD)', rateFromEur: 10.75, decimals: 0, symbolPosition: 'after' },
};

export const DESTINATION_LOCAL_CURRENCY: Record<string, { code: UserCurrencyCode; name: string;fxSavingTip: string }> = {
  'palma-mallorca': {
    code: 'EUR',
    name: 'Euro (EUR)',
    fxSavingTip: 'Euroraum: Keine Fremdwährungsgebühren bei Zahlung in EUR; bei CHF/GBP/USD-Karten am Terminal immer „In EUR belasten“ (ohne DCC) wählen.',
  },
  'lissabon-alfama': {
    code: 'EUR',
    name: 'Euro (EUR)',
    fxSavingTip: 'Euroraum: Geldautomaten der „Multibanco“-Kette sind gebührenfrei; meiden Sie Euronet-Automaten mit bis zu 13 % Aufschlag.',
  },
  'budapest-donau': {
    code: 'HUF',
    name: 'Ungarischer Forint (HUF)',
    fxSavingTip: 'Währungs-Tipp: Zahlen Sie im Restaurant und Hotel am Kartenterminal immer in Forint (HUF) statt in Ihrer Heimatwährung – das spart 6–9 % Dynamische Umrechnungsgebühr.',
  },
  'istanbul-bosporus': {
    code: 'TRY',
    name: 'Türkische Lira (TRY)',
    fxSavingTip: 'Währungs-Tipp: Durch den schwachen Lira-Kurs sind lokale Ausgaben vor Ort in TRY bis zu 35 % günstiger als bei Vorauszahlung in Fremdwährung.',
  },
  'athen-riviera': {
    code: 'EUR',
    name: 'Euro (EUR)',
    fxSavingTip: 'Euroraum: Kontaktlose Kartenzahlung wird selbst auf Inselfähren und in kleinen Tavernen ohne Mindestbetrag akzeptiert.',
  },
  'porto-douro': {
    code: 'EUR',
    name: 'Euro (EUR)',
    fxSavingTip: 'Euroraum: Nutzen Sie die Andante-Karte für Metro & Vorortzüge – bei Nicht-EUR-Karten immer Abrechnung in Landeswährung wählen.',
  },
  'krakau-hohe-tatra': {
    code: 'PLN',
    name: 'Polnischer Złoty (PLN)',
    fxSavingTip: 'Währungs-Tipp: Am Kartenterminal immer „Abrechnung in PLN ohne Umrechnung“ wählen; Wechselstuben in Kazimierz („Kantor“) bieten 0 % Kommission.',
  },
  'marrakesch-atlas': {
    code: 'MAD',
    name: 'Marokkanischer Dirham (MAD)',
    fxSavingTip: 'Währungs-Tipp: Geschlossene Währung – erst am Flughafen Menara oder an Bankautomaten (Al Barid Bank ohne Automatengebühr) in MAD wechseln.',
  },
  'barcelona-costa-brava': {
    code: 'EUR',
    name: 'Euro (EUR)',
    fxSavingTip: 'Euroraum: Mit dem T-Casual 10er-Ticket fahren Sie inkl. Flughafen-Zug R2 Nord für nur 1,22 € pro Fahrt durch ganz Barcelona.',
  },
  'teneriffa-adeje': {
    code: 'EUR',
    name: 'Euro (EUR)',
    fxSavingTip: 'Euroraum (Kanarische Sonderzone IGIC mit nur 7 % Steuer): Mietwagen, Benzin und Restaurantbesuche sind rund 20 % günstiger als auf dem Festland.',
  },
  'malaga-andalusien': {
    code: 'EUR',
    name: 'Euro (EUR)',
    fxSavingTip: 'Euroraum: Die S-Bahn Cercanías C1 verbindet den Flughafen Málaga in 12 Minuten für 1,80 € mit dem Zentrum und Torremolinos.',
  },
  'antalya-riviera': {
    code: 'TRY',
    name: 'Türkische Lira (TRY)',
    fxSavingTip: 'Währungs-Tipp: Im Dolmuş, Basar und Restaurant immer in Türkischen Lira (TRY) statt Euro zahlen – Sie sparen bis zu 25 % Wechselkursaufschlag.',
  },
  'izmir-aegaeis': {
    code: 'TRY',
    name: 'Türkische Lira (TRY)',
    fxSavingTip: 'Währungs-Tipp: Die S-Bahn İZBAN fährt direkt vom Flughafen Izmir (ADB) für umgerechnet unter 1 € bis ins Zentrum (Alsancak) und weiter Richtung Selçuk/Ephesos.',
  },
  'bodrum-kappadokien': {
    code: 'TRY',
    name: 'Türkische Lira (TRY)',
    fxSavingTip: 'Währungs-Tipp: Nutzen Sie den offiziellen Havaş/Muttaş-Flughafenbus in TRY statt Flughafen-Taxis in Euro – das spart über 75 % Transferkosten.',
  },
  'rom-latium': {
    code: 'EUR',
    name: 'Euro (EUR)',
    fxSavingTip: 'Spartipp Rom: Der Regionalzug FL1 ab Fiumicino nach Trastevere & Ostiense kostet 8 € statt 14 € für den Leonardo Express.',
  },
  'mailand-comer-see': {
    code: 'EUR',
    name: 'Euro (EUR)',
    fxSavingTip: 'Spartipp Norditalien: Ab Bergamo (BGY) fährt der Regionalzug ab Bahnhof Bergamo für 6,00 € direkt nach Milano Centrale und weiter an den Comer See.',
  },
  'neapel-amalfi': {
    code: 'EUR',
    name: 'Euro (EUR)',
    fxSavingTip: 'Spartipp Amalfiküste: Nutzen Sie ab Neapel die Circumvesuviana-Bahn nach Sorrent (4,60 €) und die SITA-Küstenbusse statt teurer Privattransfers.',
  },
  'sizilien-catania': {
    code: 'EUR',
    name: 'Euro (EUR)',
    fxSavingTip: 'Spartipp Sizilien: Der Alibus bringt Sie vom Flughafen Catania für 4,00 € (inkl. 90 Min. Stadtbus) direkt zum Domplatz und Hauptbahnhof.',
  },
};

export function convertFromEur(amountEur: number, targetCurrency: UserCurrencyCode): number {
  const cfg = SUPPORTED_CURRENCIES[targetCurrency] || SUPPORTED_CURRENCIES.EUR;
  return amountEur * cfg.rateFromEur;
}

export function formatMoney(
  amountEur: number,
  targetCurrency: UserCurrencyCode,
  options?: { exactDecimals?: boolean; showPlus?: boolean; showMinus?: boolean }
): string {
  const cfg = SUPPORTED_CURRENCIES[targetCurrency] || SUPPORTED_CURRENCIES.EUR;
  const converted = amountEur * cfg.rateFromEur;
  const decimals = options?.exactDecimals ? 2 : cfg.decimals;

  const formattedNum = converted.toLocaleString('de-DE', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  const prefix = options?.showPlus ? '+' : options?.showMinus ? '-' : '';
  if (cfg.symbolPosition === 'before') {
    return `${prefix}${cfg.symbol} ${formattedNum}`;
  }
  return `${prefix}${formattedNum} ${cfg.symbol}`;
}

export function formatCatalogPrice(
  amountEur: number,
  targetCurrency: UserCurrencyCode
): string {
  const cfg = SUPPORTED_CURRENCIES[targetCurrency] || SUPPORTED_CURRENCIES.EUR;
  const converted = Math.round(amountEur * cfg.rateFromEur);
  const formattedNum = converted.toLocaleString('de-DE');

  if (targetCurrency === 'EUR') {
    return `${formattedNum},– €`;
  }
  if (cfg.symbolPosition === 'before') {
    return `${cfg.symbol} ${formattedNum}.–`;
  }
  return `${formattedNum},– ${cfg.symbol}`;
}

export interface CompletePackageOffer {
  id: string;
  searchKeyword: string;
  cityShort: string;
  country: string;
  days: number;
  nights: number;
  priceEurPerPerson: number;
  regularPriceEur: number;
  boardLabel: string;
  hotelSummary: string;
  flightSummary: string;
}

export const CURATED_COMPLETE_PACKAGES: CompletePackageOffer[] = [
  {
    id: 'pkg-bangkok-15',
    searchKeyword: 'Bangkok',
    cityShort: 'Bangkok & Thailand',
    country: 'Thailand',
    days: 15,
    nights: 14,
    priceEurPerPerson: 999,
    regularPriceEur: 1490,
    boardLabel: 'Inkl. Flug & 4★ Hotel mit Frühstück',
    hotelSummary: '14 Nächte Boutique-Resort & City-Kombi',
    flightSummary: 'Hin- & Rückflug inkl. Gepäck',
  },
  {
    id: 'pkg-mallorca-8',
    searchKeyword: 'Palma',
    cityShort: 'Mallorca',
    country: 'Spanien',
    days: 8,
    nights: 7,
    priceEurPerPerson: 299,
    regularPriceEur: 480,
    boardLabel: 'Inkl. Direktflug & Aparthotel',
    hotelSummary: '7 Nächte an der Serra de Tramuntana',
    flightSummary: 'Direktflug Hin & Zurück',
  },
  {
    id: 'pkg-antalya-10',
    searchKeyword: 'Antalya',
    cityShort: 'Antalya Riviera',
    country: 'Türkei',
    days: 10,
    nights: 9,
    priceEurPerPerson: 449,
    regularPriceEur: 690,
    boardLabel: 'Inkl. Flug & 4★ Strandhotel (Frühstück)',
    hotelSummary: '9 Nächte direkt an der Türkischen Riviera',
    flightSummary: 'Direktflug mit SunExpress / Pegasus',
  },
  {
    id: 'pkg-hurghada-12',
    searchKeyword: 'Hurghada',
    cityShort: 'Hurghada & Rotes Meer',
    country: 'Ägypten',
    days: 12,
    nights: 11,
    priceEurPerPerson: 549,
    regularPriceEur: 840,
    boardLabel: 'Inkl. Flug & 4.5★ Resort (Halbpension)',
    hotelSummary: '11 Nächte Strandresort am Hausriff',
    flightSummary: 'Hin- & Rückflug inkl. Transfer',
  },
  {
    id: 'pkg-newyork-7',
    searchKeyword: 'New York',
    cityShort: 'New York City',
    country: 'USA',
    days: 7,
    nights: 6,
    priceEurPerPerson: 699,
    regularPriceEur: 1090,
    boardLabel: 'Inkl. Nonstop-Flug & Queens Design-Hotel',
    hotelSummary: '6 Nächte (1 Metro-Station bis Manhattan)',
    flightSummary: 'Langstreckenflug Hin & Zurück',
  },
  {
    id: 'pkg-dubai-9',
    searchKeyword: 'Dubai',
    cityShort: 'Dubai & Marina',
    country: 'VAE',
    days: 9,
    nights: 8,
    priceEurPerPerson: 649,
    regularPriceEur: 980,
    boardLabel: 'Inkl. Direktflug & 4★ Hotel mit Pool',
    hotelSummary: '8 Nächte nahe Red Line Metro & Creek',
    flightSummary: 'Direktflug Hin & Zurück',
  },
  {
    id: 'pkg-teneriffa-9',
    searchKeyword: 'Teneriffa',
    cityShort: 'Teneriffa & Costa Adeje',
    country: 'Spanien',
    days: 9,
    nights: 8,
    priceEurPerPerson: 389,
    regularPriceEur: 620,
    boardLabel: 'Inkl. Direktflug & 4★ Sonnen-Resort (Frühstück)',
    hotelSummary: '8 Nächte an der sonnigen Südwestküste',
    flightSummary: 'Direktflug Hin & Zurück',
  },
  {
    id: 'pkg-andalusien-8',
    searchKeyword: 'Málaga',
    cityShort: 'Málaga & Andalusien',
    country: 'Spanien',
    days: 8,
    nights: 7,
    priceEurPerPerson: 319,
    regularPriceEur: 510,
    boardLabel: 'Inkl. Direktflug & 4★ Strandhotel Costa del Sol',
    hotelSummary: '7 Nächte direkt an der Promenade',
    flightSummary: 'Direktflug Hin & Zurück',
  },
  {
    id: 'pkg-istanbul-6',
    searchKeyword: 'Istanbul',
    cityShort: 'Istanbul & Bosporus',
    country: 'Türkei',
    days: 6,
    nights: 5,
    priceEurPerPerson: 269,
    regularPriceEur: 430,
    boardLabel: 'Inkl. Direktflug & 4★ Altstadt-Hotel (Frühstück)',
    hotelSummary: '5 Nächte mit Bosporus-Dachterrasse',
    flightSummary: 'Direktflug mit Turkish Airlines / Pegasus',
  },
  {
    id: 'pkg-izmir-9',
    searchKeyword: 'Izmir',
    cityShort: 'Izmir & Türkische Ägäis',
    country: 'Türkei',
    days: 9,
    nights: 8,
    priceEurPerPerson: 399,
    regularPriceEur: 640,
    boardLabel: 'Inkl. Direktflug & 4★ Ägäis-Strandhotel (Halbpension)',
    hotelSummary: '8 Nächte in Çeşme / Kuşadası am Meer',
    flightSummary: 'Direktflug mit SunExpress',
  },
  {
    id: 'pkg-rom-amalfi-8',
    searchKeyword: 'Rom',
    cityShort: 'Rom & Latium Küste',
    country: 'Italien',
    days: 8,
    nights: 7,
    priceEurPerPerson: 329,
    regularPriceEur: 520,
    boardLabel: 'Inkl. Direktflug & 4★ Boutique-Hotel (Frühstück)',
    hotelSummary: '7 Nächte zwischen Altstadt & Küste',
    flightSummary: 'Direktflug Hin & Zurück',
  },
  {
    id: 'pkg-neapel-amalfi-8',
    searchKeyword: 'Neapel',
    cityShort: 'Amalfiküste & Golf von Neapel',
    country: 'Italien',
    days: 8,
    nights: 7,
    priceEurPerPerson: 369,
    regularPriceEur: 590,
    boardLabel: 'Inkl. Direktflug & 4★ Panorama-Hotel Sorrent (Frühstück)',
    hotelSummary: '7 Nächte mit Blick auf den Vesuv & Capri',
    flightSummary: 'Direktflug nach Neapel (NAP)',
  },
  {
    id: 'pkg-sizilien-9',
    searchKeyword: 'Sizilien',
    cityShort: 'Sizilien & Taormina Küste',
    country: 'Italien',
    days: 9,
    nights: 8,
    priceEurPerPerson: 379,
    regularPriceEur: 610,
    boardLabel: 'Inkl. Direktflug & 4★ Meerblick-Hotel (Frühstück)',
    hotelSummary: '8 Nächte an der Ionischen Küste nahe Ätna',
    flightSummary: 'Direktflug nach Catania (CTA)',
  },
];

export interface CustomAffiliatePartner {
  id: string;
  name: string;
  url: string;
  category: 'package' | 'flight' | 'hotel' | 'winter' | 'extra';
}

export interface AffiliatePartnerConfig {
  travelpayoutsMarker: string; // e.g., "548291" — covers Skyscanner, Kayak, Aviasales, DiscoverCars, Airalo, Compensair
  bookingAid: string; // e.g., "2384910" — direct Booking.com Affiliate ID (aid)
  awinPublisherId: string; // e.g., "1094821" — covers HolidayCheck, Check24, Condor, Eurowings
  customExpediaUrl?: string; // Direct Expedia affiliate link or affcid (e.g. https://prf.hn/... or https://www.expedia.de/?affcid=...)
  customDiscoverCarsUrl?: string; // Direct DiscoverCars affiliate link or a_aid (e.g. https://www.discovercars.com/de?a_aid=...)
  customCheck24Url?: string; // Direct Check24 / Pauschalreise affiliate link (e.g. https://a.check24.net/... or https://urlaub.check24.de/...)
  customBookingUrl?: string; // Direct Booking.com affiliate link
  customSkyscannerUrl?: string; // Direct Skyscanner / Flight affiliate link
  customAbInDenUrlaubUrl?: string; // Direct Ab in den Urlaub affiliate link (Pauschalreisen & Last Minute)
  customTripComUrl?: string; // Direct Trip.com affiliate link (Flüge, Hotels & Kombi-Reisen)
  customSnowTrexUrl?: string; // Direct SnowTrex affiliate link (Skiurlaub, Winterreisen & Bergurlaub inkl. Skipass)
  extraPartners?: CustomAffiliatePartner[]; // Unlimited additional custom affiliate partners ("usw.")
  useExpediaForFlightsIfNoSkyscanner?: boolean; // Automatically monetize flight buttons with user's Expedia link until Skyscanner is added
}

export const DEFAULT_EXTRA_PARTNERS: CustomAffiliatePartner[] = [
  {
    id: 'klook-tp-771810',
    name: 'Klook Erlebnisse & Transfers',
    url: 'https://tp.media/r?campaign_id=137&marker=771810&p=4110&trs=568370&u=https%3A%2F%2Fklook.com',
    category: 'package',
  },
  {
    id: 'tuicamper-awin-11934',
    name: 'TUI Camper (Wohnmobile & Camper)',
    url: 'https://www.awin1.com/cread.php?awinmid=11934&awinaffid=3034525&ued=https%3A%2F%2Fwww.tuicamper.com%2F',
    category: 'extra',
  },
  {
    id: 'camperdays-awin-52889',
    name: 'CamperDays (Wohnmobil-Preisvergleich)',
    url: 'https://www.awin1.com/cread.php?awinmid=52889&awinaffid=3034525&ued=https%3A%2F%2Fwww.camperdays.de%2F',
    category: 'extra',
  },
  {
    id: 'camping-info-awin-44063',
    name: 'camping.info (Campingplätze & Glamping)',
    url: 'https://www.awin1.com/cread.php?awinmid=44063&awinaffid=3034525&ued=https%3A%2F%2Fwww.camping.info%2Fde%2Fland%2Fdeutschland',
    category: 'extra',
  },
];

export const DEFAULT_AFFILIATE_CONFIG: AffiliatePartnerConfig = {
  travelpayoutsMarker: '771810', // User's official Travelpayouts Marker-ID (771810 / trs=568370) pre-configured
  bookingAid: '',
  awinPublisherId: '3034525', // User's official Awin Publisher ID (r=3034525) pre-configured
  customExpediaUrl: '1100l6tjov', // User's official Expedia Partnerize camref (1100l6tjov) pre-configured
  customDiscoverCarsUrl: 'https://www.discovercars.com/de?a_aid=CleverEntdeckt&a_bid=61a4ac81', // User's official DiscoverCars Affiliate Link pre-configured
  customCheck24Url: '1176801', // User's official Check24 Partner/Widget ID 1176801 pre-configured
  customBookingUrl: '',
  customSkyscannerUrl: 'https://www.aviasales.com/?marker=771810', // User's official Aviasales Flight Metasearch via Travelpayouts Marker 771810
  customAbInDenUrlaubUrl: 'https://www.awin1.com/cread.php?s=2307983&v=9369&q=339342&r=3034525', // User's official Ab in den Urlaub Awin Link pre-configured
  customTripComUrl: 'https://de.trip.com/?Allianceid=10486295&SID=330669011&locale=de_de', // User's official Trip.com Affiliate Link (Allianceid=10486295, SID=330669011) pre-configured
  customSnowTrexUrl: 'https://www.awin1.com/cread.php?awinmid=126961&awinaffid=3034525&ued=https%3A%2F%2Fwww.asi-reisen.de%2Fgi%2Findividuelle-rundreisen', // User's official ASI Reisen Individuelle Rundreisen & Aktivreisen Awin Deep-Link
  extraPartners: DEFAULT_EXTRA_PARTNERS,
  useExpediaForFlightsIfNoSkyscanner: true,
};

export function getSavedAffiliateConfig(): AffiliatePartnerConfig {
  let baseConfig: AffiliatePartnerConfig = {
    ...DEFAULT_AFFILIATE_CONFIG,
    extraPartners: DEFAULT_EXTRA_PARTNERS,
  };
  try {
    const raw = localStorage.getItem('sparflug_affiliate_config');
    if (raw) {
      const parsed = JSON.parse(raw);
      const savedExtras: CustomAffiliatePartner[] = Array.isArray(parsed?.extraPartners)
        ? parsed.extraPartners
        : [];
      const mergedExtras = [...DEFAULT_EXTRA_PARTNERS];
      savedExtras.forEach((item) => {
        if (
          item &&
          item.url &&
          item.id !== 'asi-reisen-awin-126961' &&
          !item.url.includes('v=126961') &&
          !item.url.includes('awinmid=126961') &&
          !mergedExtras.some((def) => def.id === item.id || def.url === item.url)
        ) {
          mergedExtras.push(item);
        }
      });

      baseConfig = {
        ...baseConfig,
        ...parsed,
        // Keep default pre-configured partner IDs if user had not entered custom values yet
        travelpayoutsMarker: parsed?.travelpayoutsMarker?.trim() ? parsed.travelpayoutsMarker : '771810',
        awinPublisherId: parsed?.awinPublisherId?.trim() ? parsed.awinPublisherId : '3034525',
        customExpediaUrl: parsed?.customExpediaUrl?.trim() ? parsed.customExpediaUrl : '1100l6tjov',
        customDiscoverCarsUrl: parsed?.customDiscoverCarsUrl?.trim()
          ? parsed.customDiscoverCarsUrl
          : 'https://www.discovercars.com/de?a_aid=CleverEntdeckt&a_bid=61a4ac81',
        customCheck24Url: parsed?.customCheck24Url?.trim() ? parsed.customCheck24Url : '1176801',
        customAbInDenUrlaubUrl: parsed?.customAbInDenUrlaubUrl?.trim()
          ? parsed.customAbInDenUrlaubUrl
          : 'https://www.awin1.com/cread.php?s=2307983&v=9369&q=339342&r=3034525',
        customTripComUrl: parsed?.customTripComUrl?.trim()
          ? parsed.customTripComUrl
          : 'https://de.trip.com/?Allianceid=10486295&SID=330669011&locale=de_de',
        customSnowTrexUrl:
          parsed?.customSnowTrexUrl?.trim() &&
          !parsed.customSnowTrexUrl.includes('s=4805736')
            ? parsed.customSnowTrexUrl
            : 'https://www.awin1.com/cread.php?awinmid=126961&awinaffid=3034525&ued=https%3A%2F%2Fwww.asi-reisen.de%2Fgi%2Findividuelle-rundreisen',
        customSkyscannerUrl: parsed?.customSkyscannerUrl?.trim()
          ? parsed.customSkyscannerUrl
          : 'https://www.aviasales.com/?marker=771810',
        extraPartners: mergedExtras,
      };
    }
  } catch {
    // ignore storage errors
  }

  // Also allow passing affiliate links/IDs via URL query parameters when embedded as an iframe on the user's homepage
  try {
    if (typeof window !== 'undefined' && window.location.search) {
      const sp = new URLSearchParams(window.location.search);
      if (sp.get('marker')) baseConfig.travelpayoutsMarker = sp.get('marker')!;
      if (sp.get('aid')) baseConfig.bookingAid = sp.get('aid')!;
      if (sp.get('awin')) baseConfig.awinPublisherId = sp.get('awin')!;
      if (sp.get('expedia')) baseConfig.customExpediaUrl = sp.get('expedia')!;
      if (sp.get('discovercars')) baseConfig.customDiscoverCarsUrl = sp.get('discovercars')!;
      if (sp.get('check24')) baseConfig.customCheck24Url = sp.get('check24')!;
      if (sp.get('booking')) baseConfig.customBookingUrl = sp.get('booking')!;
      if (sp.get('skyscanner')) baseConfig.customSkyscannerUrl = sp.get('skyscanner')!;
      if (sp.get('abindenurlaub')) baseConfig.customAbInDenUrlaubUrl = sp.get('abindenurlaub')!;
      if (sp.get('tripcom')) baseConfig.customTripComUrl = sp.get('tripcom')!;
      if (sp.get('snowtrex')) baseConfig.customSnowTrexUrl = sp.get('snowtrex')!;
      if (sp.get('extra')) {
        try {
          const parsedExtra = JSON.parse(sp.get('extra')!);
          if (Array.isArray(parsedExtra)) {
            baseConfig.extraPartners = parsedExtra;
          }
        } catch {
          // ignore malformed extra json
        }
      }
    }
  } catch {
    // ignore URL parse errors
  }

  return baseConfig;
}

/**
 * Combines a user's existing affiliate link (or partner code / HTML widget snippet) with the dynamic destination/date deep link.
 * - If the user pasted an HTML widget snippet (e.g. Check24 <script src="https://files.check24.net/widgets/auto/1176801/..."> or Expedia data-camref="1100l6tjov"), extracts the partner ID automatically.
 * - If the user pasted an HTML <a href="..."> snippet (e.g. Trip.com with &amp; entities), extracts the href and decodes &amp; -> & automatically.
 * - If the user pasted a Travelpayouts tp.media/r redirect link with u=..., updates u= to the deep search URL when on the same provider domain so both tracking (marker/trs/campaign_id) and destination search work.
 * - If the user pasted a provider URL with tracking query params (e.g. https://de.trip.com/?Allianceid=10486295&SID=330669011), merges their tracking parameters into the deep search URL so both commission tracking and destination prefill work.
 * - If the user pasted a plain partner ID/code, appends it via fallbackParamName.
 */
function resolveCustomAffiliateUrl(
  rawCustomInput: string | undefined,
  defaultDeepUrl: string,
  providerDomainKeyword: string,
  fallbackParamName: string
): string {
  let input = (rawCustomInput || '').trim();
  if (!input) return defaultDeepUrl;

  // Case 0a: User pasted a Check24 Widget HTML/Script code -> extract Partner ID (e.g. 1176801)
  const c24WidgetMatch = input.match(/widgets\/auto\/(\d+)/i);
  if (c24WidgetMatch && c24WidgetMatch[1]) {
    const sep = defaultDeepUrl.includes('?') ? '&' : '?';
    return `${defaultDeepUrl}${sep}${fallbackParamName}=${encodeURIComponent(c24WidgetMatch[1])}`;
  }

  // Case 0b: User pasted an Expedia Group Banner HTML code (data-camref="1100l6tjov"), Partnerize prf.hn/click/camref:..., or plain Expedia camref ID
  // Uses Expedia Group's official Travel Creator deep-link endpoint (/affiliate?siteid=6&landingPage=...&camref=...&creativeref=1101l87346)
  // so Expedia.de opens the exact destination & dates search results instead of redirecting to the generic homepage.
  const expediaCamrefMatch =
    input.match(/data-camref=["']([^"']+)["']/i) ||
    input.match(/camref[:=]([a-zA-Z0-9_-]+)/i) ||
    (providerDomainKeyword.toLowerCase() === 'expedia' && /^[a-z0-9]{7,15}$/i.test(input)
      ? [input, input]
      : null);
  if (expediaCamrefMatch && expediaCamrefMatch[1]) {
    const camref = expediaCamrefMatch[1].trim();
    const hasSiteId = defaultDeepUrl.includes('siteid=');
    const sep = defaultDeepUrl.includes('?') ? '&' : '?';
    const deepWithSiteId = hasSiteId
      ? defaultDeepUrl
      : `${defaultDeepUrl}${sep}siteid=6&langid=1031`;
    return `https://www.expedia.de/affiliate?siteid=6&landingPage=${encodeURIComponent(deepWithSiteId)}&camref=${encodeURIComponent(camref)}&creativeref=1101l87346`;
  }

  // If user pasted an HTML <a href="..."> or <iframe src="..."> tag, extract the URL
  if (input.includes('<')) {
    const hrefMatch = input.match(/(?:href|src)=["']([^"']+)["']/i);
    if (hrefMatch && hrefMatch[1]) {
      input = hrefMatch[1].trim();
    }
  }

  // Decode HTML entities like &amp; -> & so URLSearchParams parses Allianceid, SID, etc. cleanly
  input = input.replace(/&amp;/gi, '&');

  // Case 1: User entered a plain ID/code (not a URL)
  if (!input.includes('http') && !input.includes('/') && !input.includes('.')) {
    const sep = defaultDeepUrl.includes('?') ? '&' : '?';
    return `${defaultDeepUrl}${sep}${fallbackParamName}=${encodeURIComponent(input)}`;
  }

  const normalizedUrl = input.startsWith('http') ? input : `https://${input}`;

  try {
    const parsedCustom = new URL(normalizedUrl);
    const parsedDefault = new URL(defaultDeepUrl);

    // Case 2a: Awin cread.php wrapper: only attach/update ued when awinmid is used (deep-link format), never overwrite banner creatives (s=...&v=9369&q=...)
    if (
      parsedCustom.hostname.includes('awin1.com') &&
      !defaultDeepUrl.includes('awin1.com')
    ) {
      if (parsedCustom.searchParams.has('awinmid')) {
        parsedCustom.searchParams.set('ued', defaultDeepUrl);
      }
      return parsedCustom.toString();
    }

    // Case 2b: Travelpayouts tp.media/r wrapper with u=... -> if defaultDeepUrl is a different deep search page on the same target brand, inject defaultDeepUrl into u=
    if (parsedCustom.hostname.includes('tp.media') && parsedCustom.searchParams.has('u')) {
      const currentTargetU = parsedCustom.searchParams.get('u') || '';
      if (
        defaultDeepUrl !== normalizedUrl &&
        !defaultDeepUrl.includes('tp.media') &&
        currentTargetU &&
        parsedDefault.hostname
          .replace(/^www\./i, '')
          .toLowerCase()
          .includes(
            new URL(currentTargetU.startsWith('http') ? currentTargetU : `https://${currentTargetU}`).hostname
              .replace(/^www\./i, '')
              .toLowerCase()
          )
      ) {
        parsedCustom.searchParams.set('u', defaultDeepUrl);
      }
      return parsedCustom.toString();
    }

    // Case 3: Direct provider link (e.g., de.trip.com/?Allianceid=10486295&SID=330669011, expedia.de/?affcid=..., discovercars.com/de?a_aid=...)
    // If it has tracking query parameters on the same provider domain, copy all custom tracking params into the deep search URL
    if (
      parsedCustom.hostname.toLowerCase().includes(providerDomainKeyword.toLowerCase()) &&
      Array.from(parsedCustom.searchParams.keys()).length > 0
    ) {
      parsedCustom.searchParams.forEach((val, key) => {
        if (val !== '') {
          parsedDefault.searchParams.set(key, val);
        }
      });
      return parsedDefault.toString();
    }

    // Case 4: Redirect tracking link (e.g. prf.hn, a.check24.net, tp.media, partner.check24.de) or custom landing page
    return normalizedUrl;
  } catch {
    return normalizedUrl;
  }
}

export interface ComparedPartnerOffer {
  id: string;
  providerShortName: string;
  name: string;
  url: string;
  hasActiveAffiliate: boolean;
  priceDeltaEur: number;
  isWinner: boolean;
}

export interface ProviderBookingLinks {
  returnDateStr: string;
  bestDealDirectUrl: string;
  bestDealProviderName: string;
  comparedPartnerOffers: ComparedPartnerOffer[];
  skyscannerFlightUrl: string;
  expediaFlightUrl: string;
  kayakFlightUrl: string;
  googleFlightsUrl: string;
  airlineDirectUrl: string;
  airlineDirectName: string;
  bookingHotelUrl: string;
  trivagoHotelUrl: string;
  expediaPackageUrl: string;
  check24HolidayUrl: string;
  abInDenUrlaubUrl: string;
  tripComUrl: string;
  snowTrexUrl: string;
  klookActivitiesUrl: string;
  tuiCamperUrl: string;
  camperDaysUrl: string;
  campingInfoUrl: string;
  bahnTransferUrl: string;
  rentalCarUrl: string;
  esimDataUrl: string;
  flightCompensationUrl: string;
  isMonetized: boolean;
}

export function addDaysToDateStr(dateStr: string, daysToAdd: number): string {
  const parts = dateStr.split('-').map(Number);
  if (parts.length !== 3 || isNaN(parts[0])) return '2026-11-21';
  const dt = new Date(parts[0], parts[1] - 1, parts[2]);
  dt.setDate(dt.getDate() + daysToAdd);
  const yyyy = dt.getFullYear();
  const mm = String(dt.getMonth() + 1).padStart(2, '0');
  const dd = String(dt.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export function buildProviderBookingLinks(params: {
  originCode: string;
  destCode: string;
  destCity: string;
  hotelName: string;
  carrierName: string;
  departureDateStr: string;
  durationNights: number;
  travelers: number;
  userCurrency: UserCurrencyCode;
  affiliateConfig?: AffiliatePartnerConfig;
  travelMode?: 'standard' | 'camping_nature' | 'hiking' | 'camper';
}): ProviderBookingLinks {
  const {
    originCode,
    destCode,
    destCity,
    carrierName,
    departureDateStr,
    durationNights,
    travelers,
    userCurrency,
    affiliateConfig,
    travelMode = 'standard',
  } = params;

  const aff = affiliateConfig || getSavedAffiliateConfig();
  const marker = aff.travelpayoutsMarker.trim();
  const aid = aff.bookingAid.trim();
  const awin = aff.awinPublisherId.trim();
  const activeExtraPartners = (aff.extraPartners || []).filter(
    (p) => p && p.name.trim() && p.url.trim()
  );
  const hasCustomUrl = Boolean(
    aff.customExpediaUrl?.trim() ||
      aff.customDiscoverCarsUrl?.trim() ||
      aff.customCheck24Url?.trim() ||
      aff.customBookingUrl?.trim() ||
      aff.customSkyscannerUrl?.trim() ||
      aff.customAbInDenUrlaubUrl?.trim() ||
      aff.customTripComUrl?.trim() ||
      aff.customSnowTrexUrl?.trim() ||
      activeExtraPartners.length > 0
  );
  const isMonetized = Boolean(marker || aid || awin || hasCustomUrl);

  const returnDateStr = addDaysToDateStr(departureDateStr, durationNights);
  const skyOut = departureDateStr.slice(2).replace(/-/g, ''); // YYMMDD
  const skyIn = returnDateStr.slice(2).replace(/-/g, ''); // YYMMDD
  const cleanCity = destCity.split('&')[0].trim();

  const markerSuffix = marker ? `&marker=${encodeURIComponent(marker)}&utm_source=sparflug_partner_${encodeURIComponent(marker)}` : '';
  const aidSuffix = aid ? `&aid=${encodeURIComponent(aid)}` : '';
  const awinSuffix = awin ? `&awc=${encodeURIComponent(awin)}` : marker ? `&utm_term=${encodeURIComponent(marker)}` : '';

  // Format DDMM for Aviasales & DD.MM.YYYY for Expedia.de
  const outParts = departureDateStr.split('-');
  const inParts = returnDateStr.split('-');
  const aviaOut = outParts.length === 3 ? `${outParts[2]}${outParts[1]}` : '1711';
  const aviaIn = inParts.length === 3 ? `${inParts[2]}${inParts[1]}` : '2111';
  const deOutDate =
    outParts.length === 3 ? `${outParts[2]}.${outParts[1]}.${outParts[0]}` : '17.11.2026';
  const deInDate =
    inParts.length === 3 ? `${inParts[2]}.${inParts[1]}.${inParts[0]}` : '21.11.2026';
  const rooms = Math.max(1, Math.ceil(travelers / 2));

  // Trip.com Deep Link (Flights + Hotels)
  const hasDirectTripCom = Boolean(aff.customTripComUrl?.trim());
  const baseTripComUrl = `https://de.trip.com/flights/${originCode.toLowerCase()}-to-${destCode.toLowerCase()}/tickets-${originCode.toLowerCase()}-${destCode.toLowerCase()}?dcity=${originCode.toLowerCase()}&acity=${destCode.toLowerCase()}&ddate=${departureDateStr}&rdate=${returnDateStr}&flighttype=rt&class=y&quantity=${travelers}`;
  const tripComUrl = resolveCustomAffiliateUrl(
    aff.customTripComUrl,
    baseTripComUrl,
    'trip.com',
    'allianceid'
  );

  // Expedia Official German Flight Search Deep Link (via Partnerize camref:1100l6tjov & creativeref:1101l87346)
  const expediaLeg1 = `from:${originCode},to:${destCode},departure:${deOutDate}TANYT`;
  const expediaLeg2 = `from:${destCode},to:${originCode},departure:${deInDate}TANYT`;
  const expediaPassengers = `children:0,adults:${travelers},seniors:0,infantinlap:Y`;
  const baseExpediaFlightUrl = `https://www.expedia.de/Flights-Search?flight-type=on&mode=search&trip=roundtrip&leg1=${encodeURIComponent(expediaLeg1)}&leg2=${encodeURIComponent(expediaLeg2)}&fromDate=${encodeURIComponent(deOutDate)}&toDate=${encodeURIComponent(deInDate)}&d1=${departureDateStr}&d2=${returnDateStr}&passengers=${encodeURIComponent(expediaPassengers)}&options=${encodeURIComponent('cabinclass:economy,sortby:price')}&siteid=6&langid=1031`;
  const expediaFlightUrl = resolveCustomAffiliateUrl(
    aff.customExpediaUrl,
    baseExpediaFlightUrl,
    'expedia',
    'affcid'
  );

  // Klook Activities & Airport Transfers Deep Link (via Travelpayouts campaign_id=137 & marker=771810)
  const baseKlookSearchUrl = `https://www.klook.com/de/search/result/?query=${encodeURIComponent(cleanCity)}`;
  const klookPartnerEntry = activeExtraPartners.find((p) => p.url.toLowerCase().includes('klook'));
  const klookActivitiesUrl = resolveCustomAffiliateUrl(
    klookPartnerEntry?.url || 'https://tp.media/r?campaign_id=137&marker=771810&p=4110&trs=568370&u=https%3A%2F%2Fklook.com',
    baseKlookSearchUrl,
    'klook',
    'marker'
  );

  const baseSkyscannerUrl = `https://www.skyscanner.de/transport/fluge/${originCode.toLowerCase()}/${destCode.toLowerCase()}/${skyOut}/${skyIn}/?adultsv2=${travelers}&cabinclass=economy&currency=${userCurrency}`;
  const activeTpMarker = marker || '771810';
  const baseAviasalesUrl = `https://www.aviasales.com/search/${originCode.toUpperCase()}${aviaOut}${destCode.toUpperCase()}${aviaIn}${travelers}?currency=${userCurrency.toLowerCase()}&marker=${encodeURIComponent(activeTpMarker)}`;
  const baseKiwiFlightUrl = `https://www.kiwi.com/de/search/results/${originCode.toLowerCase()}-${destCode.toLowerCase()}/${departureDateStr}/${returnDateStr}?adults=${travelers}`;

  const customFlightInput = (aff.customSkyscannerUrl || '').trim();
  const skyscannerFlightUrl = customFlightInput
    ? resolveCustomAffiliateUrl(
        customFlightInput,
        customFlightInput.toLowerCase().includes('aviasales')
          ? baseAviasalesUrl
          : customFlightInput.toLowerCase().includes('kiwi')
          ? baseKiwiFlightUrl
          : baseSkyscannerUrl,
        customFlightInput.toLowerCase().includes('aviasales')
          ? 'aviasales'
          : customFlightInput.toLowerCase().includes('kiwi')
          ? 'kiwi'
          : customFlightInput.toLowerCase().includes('trip.com')
          ? 'trip.com'
          : 'skyscanner',
        'marker'
      )
    : baseAviasalesUrl;

  // Map secondary flight links directly to the user's real flight partners (Expedia, Trip.com & Aviasales)
  const kayakFlightUrl = expediaFlightUrl;
  const googleFlightsUrl = tripComUrl;
  const airlineDirectUrl = skyscannerFlightUrl;

  // 5. Expedia Official German Hotel & Stays Search — pre-sorted by LOWEST PRICE FIRST (sort=PRICE_LOW_TO_HIGH)
  const hasDirectExpedia = Boolean(aff.customExpediaUrl?.trim());
  const baseExpediaUrl = `https://www.expedia.de/Hotel-Search?destination=${encodeURIComponent(cleanCity)}&startDate=${departureDateStr}&endDate=${returnDateStr}&d1=${departureDateStr}&d2=${returnDateStr}&rooms=${rooms}&adults=${travelers}&sort=PRICE_LOW_TO_HIGH&siteid=6&langid=1031${hasDirectExpedia ? '' : markerSuffix}`;
  const expediaPackageUrl = resolveCustomAffiliateUrl(
    aff.customExpediaUrl,
    baseExpediaUrl,
    'expedia',
    'affcid'
  );

  // 6. Booking.com (Only if user explicitly configured a Booking.com link/AID; otherwise falls back to Expedia Hotel partner link)
  const bookingSearchQuery = encodeURIComponent(`${cleanCity}`);
  const hasDirectBooking = Boolean(aff.customBookingUrl?.trim() || aid);
  const baseBookingHotelUrl = `https://www.booking.com/searchresults.de.html?ss=${bookingSearchQuery}&checkin=${departureDateStr}&checkout=${returnDateStr}&group_adults=${travelers}&no_rooms=${rooms}&order=price&selected_currency=${userCurrency}${aidSuffix}`;
  const bookingHotelUrl = hasDirectBooking
    ? resolveCustomAffiliateUrl(aff.customBookingUrl, baseBookingHotelUrl, 'booking.com', 'aid')
    : expediaPackageUrl;

  const trivagoHotelUrl = expediaPackageUrl;

  // 8. Check24 Pauschalreise comparison (Direct Check24 Link has 100% priority)
  const hasDirectCheck24 = Boolean(aff.customCheck24Url?.trim());
  const baseCheck24Url = `https://urlaub.check24.de/suche/hotel?search=${encodeURIComponent(cleanCity)}&airport=${encodeURIComponent(originCode)}&transportType=flight&departureDate=${departureDateStr}&returnDate=${returnDateStr}&adultCount=${travelers}${hasDirectCheck24 ? '' : awinSuffix}`;
  const check24HolidayUrl = resolveCustomAffiliateUrl(
    aff.customCheck24Url,
    baseCheck24Url,
    'check24',
    'partnerid'
  );

  // 8b. Ab in den Urlaub Pauschalreise & Last-Minute Deep Link
  const hasDirectAbInDenUrlaub = Boolean(aff.customAbInDenUrlaubUrl?.trim());
  const baseAbInDenUrlaubUrl = `https://www.ab-in-den-urlaub.de/`;
  const abInDenUrlaubUrl = resolveCustomAffiliateUrl(
    aff.customAbInDenUrlaubUrl,
    baseAbInDenUrlaubUrl,
    'ab-in-den-urlaub',
    'partnerid'
  );

  // 8c. ASI Reisen (Individuelle Rundreisen, Wander-, Trekking- & Naturreisen via Awin awinmid=126961 & awinaffid=3034525)
  const hasDirectSnowTrex = Boolean(aff.customSnowTrexUrl?.trim());
  const baseSnowTrexUrl = `https://www.asi-reisen.de/gi/individuelle-rundreisen`;
  const snowTrexUrl = resolveCustomAffiliateUrl(
    aff.customSnowTrexUrl,
    baseSnowTrexUrl,
    'asi-reisen',
    'awinaffid'
  );

  // 9. Transfer & Activities (Klook Partner Link)
  const bahnTransferUrl = klookActivitiesUrl;

  // 10. High-Margin Cross-Selling Links (Direct DiscoverCars Link has 100% priority)
  const hasDirectDiscoverCars = Boolean(aff.customDiscoverCarsUrl?.trim());
  const baseRentalCarUrl = `https://www.discovercars.com/de?iata=${encodeURIComponent(destCode)}${!hasDirectDiscoverCars && marker ? `&a_aid=${encodeURIComponent(marker)}` : ''}`;
  const rentalCarUrl = resolveCustomAffiliateUrl(
    aff.customDiscoverCarsUrl,
    baseRentalCarUrl,
    'discovercars',
    'a_aid'
  );

  // 10b. TUI Camper (Wohnmobile & Camper weltweit mieten via Awin awinmid=11934 & awinaffid=3034525)
  const tuiCamperPartnerEntry = activeExtraPartners.find((p) =>
    p.url.toLowerCase().includes('tuicamper') || p.url.includes('11934')
  );
  const tuiCamperUrl = resolveCustomAffiliateUrl(
    tuiCamperPartnerEntry?.url ||
      'https://www.awin1.com/cread.php?awinmid=11934&awinaffid=3034525&ued=https%3A%2F%2Fwww.tuicamper.com%2F',
    'https://www.tuicamper.com/',
    'tuicamper',
    'awinaffid'
  );

  // 10c. CamperDays (Wohnmobil-Preisvergleich via Awin awinmid=52889 & awinaffid=3034525)
  const camperDaysPartnerEntry = activeExtraPartners.find((p) =>
    p.url.toLowerCase().includes('camperdays') || p.url.includes('52889')
  );
  const camperDaysUrl = resolveCustomAffiliateUrl(
    camperDaysPartnerEntry?.url ||
      'https://www.awin1.com/cread.php?awinmid=52889&awinaffid=3034525&ued=https%3A%2F%2Fwww.camperdays.de%2F',
    'https://www.camperdays.de/',
    'camperdays',
    'awinaffid'
  );

  // 10d. camping.info (Campingplätze, Stellplätze & Glamping via Awin awinmid=44063 & awinaffid=3034525 — matched to destination country)
  const campingInfoPartnerEntry = activeExtraPartners.find((p) =>
    p.url.toLowerCase().includes('camping.info') || p.url.includes('44063')
  );
  const codeUpper = destCode.toUpperCase();
  const cityLower = destCity.toLowerCase();
  const campingCountrySlug =
    ['PMI', 'BCN', 'TFS', 'AGP', 'MAD', 'ALC', 'LPA'].includes(codeUpper) || cityLower.includes('spanien') || cityLower.includes('mallorca') || cityLower.includes('barcelona') || cityLower.includes('teneriffa')
      ? 'spanien'
      : ['FCO', 'MXP', 'BGY', 'NAP', 'CTA', 'VCE', 'BLQ'].includes(codeUpper) || cityLower.includes('italien') || cityLower.includes('rom') || cityLower.includes('comer') || cityLower.includes('amalfi') || cityLower.includes('sizilien') || cityLower.includes('gardasee')
      ? 'italien'
      : ['AYT', 'SAW', 'IST', 'ADB', 'BJV'].includes(codeUpper) || cityLower.includes('türkei') || cityLower.includes('antalya') || cityLower.includes('bodrum')
      ? 'tuerkei'
      : ['SPU', 'DBV', 'ZAD', 'PUY'].includes(codeUpper) || cityLower.includes('kroatien') || cityLower.includes('split') || cityLower.includes('istrien')
      ? 'kroatien'
      : ['ATH', 'HER', 'RHO', 'SKG'].includes(codeUpper) || cityLower.includes('griechenland') || cityLower.includes('athen') || cityLower.includes('kreta')
      ? 'griechenland'
      : ['LIS', 'OPO', 'FAO'].includes(codeUpper) || cityLower.includes('portugal') || cityLower.includes('lissabon') || cityLower.includes('porto')
      ? 'portugal'
      : ['KRK', 'WAW', 'GDN'].includes(codeUpper) || cityLower.includes('polen') || cityLower.includes('krakau') || cityLower.includes('tatra')
      ? 'polen'
      : ['BUD'].includes(codeUpper) || cityLower.includes('ungarn') || cityLower.includes('budapest')
      ? 'ungarn'
      : ['INN', 'SZG', 'VIE', 'KLU'].includes(codeUpper) || cityLower.includes('österreich') || cityLower.includes('tirol')
      ? 'oesterreich'
      : ['ZRH', 'GVA', 'BSL'].includes(codeUpper) || cityLower.includes('schweiz')
      ? 'schweiz'
      : cityLower.includes('frankreich') || cityLower.includes('korsika')
      ? 'frankreich'
      : 'deutschland';
  const targetCampingInfoUrl = `https://www.camping.info/de/land/${campingCountrySlug}`;

  const campingInfoUrl = resolveCustomAffiliateUrl(
    campingInfoPartnerEntry?.url ||
      'https://www.awin1.com/cread.php?awinmid=44063&awinaffid=3034525&ued=https%3A%2F%2Fwww.camping.info%2Fde%2Fland%2Fdeutschland',
    targetCampingInfoUrl,
    'camping.info',
    'awinaffid'
  );

  const esimDataUrl = klookActivitiesUrl;
  const flightCompensationUrl = tuiCamperUrl;

  // 11. Smart Single-Button Best-Price Router ("1 Button zum günstigsten Anbieter inkl. aktivem Affiliate-Link")
  // Strictly uses ONLY the user's real affiliate partners and routes Camping/Wandern/Camper directly to the specialist partner!
  const citySeed = cleanCity
    .split('')
    .reduce((acc, ch, idx) => acc + ch.charCodeAt(0) * (idx + 1), 0);
  const isBeachHolidayDest = ['PMI', 'AYT', 'HRG', 'RAK', 'LPA', 'SPU', 'RHO', 'HER', 'FAO', 'TFS', 'AGP', 'BJV', 'CTA'].includes(
    codeUpper
  );
  const isLongHaulOrCityDest = ['BKK', 'JFK', 'DXB', 'LIS', 'BUD', 'KRK', 'SAW', 'ATH', 'BCN', 'FCO', 'NAP'].includes(
    codeUpper
  );

  const isExplicitHikingSearch =
    travelMode === 'hiking' ||
    cityLower.includes('wander') ||
    cityLower.includes('trekking') ||
    cityLower.includes('berg') ||
    cityLower.includes('tatra') ||
    cityLower.includes('alpen') ||
    cityLower.includes('tirol') ||
    cityLower.includes('ski');

  const isExplicitCamperSearch =
    travelMode === 'camper' ||
    cityLower.includes('wohnmobil') ||
    cityLower.includes('camper') ||
    cityLower.includes('kastenwagen');

  const isCampingOrNatureMode =
    travelMode === 'camping_nature' ||
    isExplicitHikingSearch ||
    isExplicitCamperSearch ||
    cityLower.includes('camping') ||
    cityLower.includes('stellplatz') ||
    cityLower.includes('mobilheim') ||
    cityLower.includes('glamping') ||
    cityLower.includes('natur');

  let candidateOffers: {
    id: string;
    providerShortName: string;
    name: string;
    url: string;
    hasActiveAffiliate: boolean;
    rawRankScore: number;
  }[];

  if (isCampingOrNatureMode) {
    // When user wants Camping, Hiking, or Camper, NEVER route primary winner to Expedia!
    candidateOffers = [
      {
        id: 'campinginfo',
        providerShortName: 'camping.info',
        name: 'camping.info Tiefpreis',
        url: campingInfoUrl,
        hasActiveAffiliate: true,
        rawRankScore: isExplicitHikingSearch ? 2 : isExplicitCamperSearch ? 3 : 0,
      },
      {
        id: 'asireisen',
        providerShortName: 'ASI Reisen',
        name: 'ASI Reisen (Wandern & Natur)',
        url: snowTrexUrl,
        hasActiveAffiliate: true,
        rawRankScore: isExplicitHikingSearch ? 0 : 1,
      },
      {
        id: 'camperdays',
        providerShortName: 'CamperDays',
        name: 'CamperDays Preisvergleich',
        url: camperDaysUrl,
        hasActiveAffiliate: true,
        rawRankScore: isExplicitCamperSearch ? 0 : 2,
      },
      {
        id: 'tuicamper',
        providerShortName: 'TUI Camper',
        name: 'TUI Camper Bestpreis',
        url: tuiCamperUrl,
        hasActiveAffiliate: true,
        rawRankScore: isExplicitCamperSearch ? 1 : 3,
      },
    ];
  } else {
    candidateOffers = [
      {
        id: 'expedia',
        providerShortName: 'Expedia',
        name: 'Expedia Tiefpreis',
        url: expediaPackageUrl,
        hasActiveAffiliate: hasDirectExpedia,
        rawRankScore: isLongHaulOrCityDest ? 1 : isBeachHolidayDest ? 2 : (citySeed % 3) + 1,
      },
      {
        id: 'check24',
        providerShortName: 'CHECK24',
        name: 'CHECK24 Tiefpreis',
        url: check24HolidayUrl,
        hasActiveAffiliate: hasDirectCheck24,
        rawRankScore: isBeachHolidayDest ? 1 : isLongHaulOrCityDest ? 2 : ((citySeed + 1) % 3) + 1,
      },
      {
        id: 'abindenurlaub',
        providerShortName: 'Ab in den Urlaub',
        name: 'Ab in den Urlaub Deal',
        url: abInDenUrlaubUrl,
        hasActiveAffiliate: hasDirectAbInDenUrlaub,
        rawRankScore: isBeachHolidayDest ? 1 : ((citySeed + 2) % 3) + 1,
      },
      {
        id: 'tripcom',
        providerShortName: 'Trip.com',
        name: 'Trip.com Tiefpreis',
        url: tripComUrl,
        hasActiveAffiliate: hasDirectTripCom,
        rawRankScore: isLongHaulOrCityDest ? 1 : ((citySeed + 1) % 3) + 1,
      },
      {
        id: 'asireisen',
        providerShortName: 'ASI Reisen',
        name: 'ASI Reisen Aktiv-Deal',
        url: snowTrexUrl,
        hasActiveAffiliate: hasDirectSnowTrex,
        rawRankScore: 3,
      },
    ];

    if (hasDirectBooking) {
      candidateOffers.push({
        id: 'booking',
        providerShortName: 'Booking.com',
        name: 'Booking.com Sparpreis',
        url: bookingHotelUrl,
        hasActiveAffiliate: true,
        rawRankScore: 2,
      });
    }

    if (customFlightInput || activeTpMarker) {
      candidateOffers.push({
        id: 'aviasales',
        providerShortName: customFlightInput.toLowerCase().includes('skyscanner')
          ? 'Skyscanner'
          : customFlightInput.toLowerCase().includes('kiwi')
          ? 'Kiwi.com'
          : 'Aviasales Flüge',
        name: 'Aviasales Flug-Metasuche',
        url: skyscannerFlightUrl,
        hasActiveAffiliate: true,
        rawRankScore: isLongHaulOrCityDest ? 1 : 2,
      });
    }
  }

  // Strictly filter to the partners configured by the user
  const monetizedCandidates = candidateOffers.filter((c) => c.hasActiveAffiliate);
  const poolToUse = [...(monetizedCandidates.length > 0 ? monetizedCandidates : candidateOffers)].sort(
    (a, b) => a.rawRankScore - b.rawRankScore
  );

  const comparedPartnerOffers: ComparedPartnerOffer[] = poolToUse.map((item, idx) => ({
    id: item.id,
    providerShortName: item.providerShortName,
    name: item.name,
    url: item.url,
    hasActiveAffiliate: item.hasActiveAffiliate,
    priceDeltaEur: idx === 0 ? 0 : idx === 1 ? 18 + (citySeed % 17) : 29 + idx * 9 + (citySeed % 15),
    isWinner: idx === 0,
  }));

  const bestWinner = comparedPartnerOffers[0];

  return {
    returnDateStr,
    bestDealDirectUrl: bestWinner.url,
    bestDealProviderName: bestWinner.name,
    comparedPartnerOffers,
    skyscannerFlightUrl,
    expediaFlightUrl,
    kayakFlightUrl,
    googleFlightsUrl,
    airlineDirectUrl,
    airlineDirectName: carrierName.split('/')[0].trim(),
    bookingHotelUrl,
    trivagoHotelUrl,
    expediaPackageUrl,
    check24HolidayUrl,
    abInDenUrlaubUrl,
    tripComUrl,
    snowTrexUrl,
    klookActivitiesUrl,
    tuiCamperUrl,
    camperDaysUrl,
    campingInfoUrl,
    bahnTransferUrl,
    rentalCarUrl,
    esimDataUrl,
    flightCompensationUrl,
    isMonetized,
  };
}

export interface DepartureHub {
  code: string;
  city: string;
  name: string;
  nearbyCodes: { code: string; name: string; distanceKm: number; railTimeMin: number }[];
}

export interface RouteOption {
  id: string;
  type: 'direct' | 'split_ticket' | 'nearby_airport' | 'rail_and_fly';
  label: string;
  summary: string;
  outbound: {
    originCode: string;
    originCity: string;
    destCode: string;
    destCity: string;
    carrier: string;
    flightNumber: string;
    departureTime: string;
    arrivalTime: string;
    durationMinutes: number;
    stops: number;
    stopCity?: string;
    stopDurationMin?: number;
  };
  inbound: {
    originCode: string;
    originCity: string;
    destCode: string;
    destCity: string;
    carrier: string;
    flightNumber: string;
    departureTime: string;
    arrivalTime: string;
    durationMinutes: number;
    stops: number;
    stopCity?: string;
  };
  baseFlightPricePerPerson: number;
  luggageFees: {
    personal: number;
    cabin: number;
    checked: number;
  };
  railTransferFeePerPerson: number;
  savingsVsStandard: number;
  savingReason: string;
}

export interface HotelTier {
  id: string;
  name: string;
  neighborhood: string;
  category: string;
  rating: number;
  reviewCount: number;
  pricePerNightTwoAdults: number;
  boardType: 'Nur Übernachtung' | 'Frühstück inklusive' | 'Halbpension';
  cancellation: 'Kostenlos stornierbar' | 'Nicht erstattbar (Sparpreis)';
  distanceToCenterKm: number;
  highlights: string[];
}

export interface DailyPricePoint {
  dateStr: string; // YYYY-MM-DD
  dayOfMonth: number;
  weekdayShort: string;
  flightPrice: number;
  hotelPerNight: number;
  isLowestInMonth?: boolean;
  isWeekend?: boolean;
}

export interface DestinationDeal {
  id: string;
  city: string;
  country: string;
  regionTag: 'Mittelmeer' | 'Städtetrip' | 'Atlantik & Inseln' | 'Balkan & Osteuropa' | 'Camping & Natur' | 'Fernreise-Budget';
  iata: string;
  tagline: string;
  avgTempMayOct: number;
  mealCostIndex: number; // Avg cheap meal in EUR
  localTransitDayPass: number; // EUR
  historicalAvgTotal: number; // 20-week rolling median for comparison
  cheapestMonth: string;
  bestBookingLeadWeeks: number;
  cheapestWeekday: string;
  svgTheme: {
    primaryFrom: string;
    primaryTo: string;
    accentColor: string;
    landmarkType: 'cove' | 'tram' | 'bosphorus' | 'acropolis' | 'parliament' | 'tatra' | 'medina' | 'porto_bridge' | 'valletta' | 'canary_volcano';
  };
  routesByOrigin: Record<string, RouteOption[]>;
  hotels: HotelTier[];
  monthlyCalendar: Record<string, DailyPricePoint[]>; // Key: '2026-11', '2026-12', '2027-01', '2027-02'
  priceHistory30Days: { dayLabel: string; price: number }[];
}

export interface PriceAlertItem {
  id: string;
  destinationId: string;
  destinationName: string;
  originCode: string;
  targetMaxPrice: number;
  currentBestPrice: number;
  durationNights: number;
  month: string;
  createdAt: string;
}

export const DEPARTURE_HUBS: DepartureHub[] = [
  {
    code: 'FRA',
    city: 'Frankfurt & Rhein-Main',
    name: 'Frankfurt (FRA)',
    nearbyCodes: [
      { code: 'HHN', name: 'Hahn (HHN)', distanceKm: 120, railTimeMin: 95 },
      { code: 'CGN', name: 'Köln/Bonn (CGN)', distanceKm: 155, railTimeMin: 52 },
      { code: 'STR', name: 'Stuttgart (STR)', distanceKm: 185, railTimeMin: 78 },
    ],
  },
  {
    code: 'BER',
    city: 'Berlin & Brandenburg',
    name: 'Berlin (BER)',
    nearbyCodes: [
      { code: 'LEJ', name: 'Leipzig/Halle (LEJ)', distanceKm: 165, railTimeMin: 75 },
      { code: 'DRS', name: 'Dresden (DRS)', distanceKm: 175, railTimeMin: 95 },
      { code: 'SZZ', name: 'Stettin (SZZ)', distanceKm: 140, railTimeMin: 110 },
    ],
  },
  {
    code: 'MUC',
    city: 'München & Südbayern',
    name: 'München (MUC)',
    nearbyCodes: [
      { code: 'FMM', name: 'Memmingen (FMM)', distanceKm: 115, railTimeMin: 70 },
      { code: 'NUE', name: 'Nürnberg (NUE)', distanceKm: 160, railTimeMin: 65 },
      { code: 'SZG', name: 'Salzburg (SZG)', distanceKm: 145, railTimeMin: 90 },
    ],
  },
  {
    code: 'DUS',
    city: 'Düsseldorf & Ruhrgebiet',
    name: 'Düsseldorf (DUS)',
    nearbyCodes: [
      { code: 'NRN', name: 'Weeze (NRN)', distanceKm: 75, railTimeMin: 65 },
      { code: 'CGN', name: 'Köln/Bonn (CGN)', distanceKm: 55, railTimeMin: 35 },
      { code: 'EIN', name: 'Eindhoven (EIN)', distanceKm: 110, railTimeMin: 85 },
    ],
  },
  {
    code: 'HAM',
    city: 'Hamburg & Norddeutschland',
    name: 'Hamburg (HAM)',
    nearbyCodes: [
      { code: 'BRE', name: 'Bremen (BRE)', distanceKm: 120, railTimeMin: 65 },
      { code: 'HAJ', name: 'Hannover (HAJ)', distanceKm: 150, railTimeMin: 80 },
      { code: 'LBC', name: 'Lübeck (LBC)', distanceKm: 65, railTimeMin: 50 },
    ],
  },
  {
    code: 'CGN',
    city: 'Köln/Bonn & Rheinland',
    name: 'Köln/Bonn (CGN)',
    nearbyCodes: [
      { code: 'DUS', name: 'Düsseldorf (DUS)', distanceKm: 55, railTimeMin: 35 },
      { code: 'NRN', name: 'Weeze (NRN)', distanceKm: 115, railTimeMin: 85 },
      { code: 'FRA', name: 'Frankfurt (FRA)', distanceKm: 155, railTimeMin: 52 },
    ],
  },
  {
    code: 'STR',
    city: 'Stuttgart & Baden-Württemberg',
    name: 'Stuttgart (STR)',
    nearbyCodes: [
      { code: 'FKB', name: 'Karlsruhe/Baden (FKB)', distanceKm: 95, railTimeMin: 65 },
      { code: 'FMM', name: 'Memmingen (FMM)', distanceKm: 135, railTimeMin: 85 },
      { code: 'FRA', name: 'Frankfurt (FRA)', distanceKm: 185, railTimeMin: 78 },
    ],
  },
  {
    code: 'HAJ',
    city: 'Hannover & Niedersachsen',
    name: 'Hannover (HAJ)',
    nearbyCodes: [
      { code: 'BRE', name: 'Bremen (BRE)', distanceKm: 125, railTimeMin: 65 },
      { code: 'PAD', name: 'Paderborn (PAD)', distanceKm: 130, railTimeMin: 85 },
      { code: 'HAM', name: 'Hamburg (HAM)', distanceKm: 150, railTimeMin: 80 },
    ],
  },
  {
    code: 'NUE',
    city: 'Nürnberg & Franken',
    name: 'Nürnberg (NUE)',
    nearbyCodes: [
      { code: 'MUC', name: 'München (MUC)', distanceKm: 160, railTimeMin: 65 },
      { code: 'FMM', name: 'Memmingen (FMM)', distanceKm: 180, railTimeMin: 110 },
      { code: 'FRA', name: 'Frankfurt (FRA)', distanceKm: 220, railTimeMin: 125 },
    ],
  },
  {
    code: 'LEJ',
    city: 'Leipzig/Halle & Mitteldeutschland',
    name: 'Leipzig/Halle (LEJ)',
    nearbyCodes: [
      { code: 'DRS', name: 'Dresden (DRS)', distanceKm: 115, railTimeMin: 70 },
      { code: 'BER', name: 'Berlin (BER)', distanceKm: 165, railTimeMin: 75 },
      { code: 'ERF', name: 'Erfurt (ERF)', distanceKm: 110, railTimeMin: 55 },
    ],
  },
  {
    code: 'DTM',
    city: 'Dortmund & Westfalen',
    name: 'Dortmund (DTM)',
    nearbyCodes: [
      { code: 'PAD', name: 'Paderborn (PAD)', distanceKm: 80, railTimeMin: 55 },
      { code: 'FMO', name: 'Münster/Osnabrück (FMO)', distanceKm: 85, railTimeMin: 60 },
      { code: 'DUS', name: 'Düsseldorf (DUS)', distanceKm: 65, railTimeMin: 48 },
    ],
  },
  {
    code: 'BRE',
    city: 'Bremen & Nordwesten',
    name: 'Bremen (BRE)',
    nearbyCodes: [
      { code: 'HAJ', name: 'Hannover (HAJ)', distanceKm: 125, railTimeMin: 65 },
      { code: 'HAM', name: 'Hamburg (HAM)', distanceKm: 120, railTimeMin: 65 },
      { code: 'FMO', name: 'Münster/Osnabrück (FMO)', distanceKm: 145, railTimeMin: 80 },
    ],
  },
  {
    code: 'DRS',
    city: 'Dresden & Sachsen',
    name: 'Dresden (DRS)',
    nearbyCodes: [
      { code: 'LEJ', name: 'Leipzig/Halle (LEJ)', distanceKm: 115, railTimeMin: 70 },
      { code: 'PRG', name: 'Prag (PRG)', distanceKm: 150, railTimeMin: 115 },
      { code: 'BER', name: 'Berlin (BER)', distanceKm: 175, railTimeMin: 95 },
    ],
  },
  {
    code: 'FMM',
    city: 'Memmingen & Allgäu',
    name: 'Memmingen (FMM)',
    nearbyCodes: [
      { code: 'FDH', name: 'Friedrichshafen (FDH)', distanceKm: 75, railTimeMin: 60 },
      { code: 'MUC', name: 'München (MUC)', distanceKm: 115, railTimeMin: 70 },
      { code: 'STR', name: 'Stuttgart (STR)', distanceKm: 135, railTimeMin: 85 },
    ],
  },
  {
    code: 'FKB',
    city: 'Karlsruhe/Baden-Baden',
    name: 'Karlsruhe/Baden (FKB)',
    nearbyCodes: [
      { code: 'STR', name: 'Stuttgart (STR)', distanceKm: 95, railTimeMin: 65 },
      { code: 'SXB', name: 'Straßburg (SXB)', distanceKm: 55, railTimeMin: 45 },
      { code: 'BSL', name: 'Basel (BSL)', distanceKm: 160, railTimeMin: 95 },
    ],
  },
  {
    code: 'FMO',
    city: 'Münster/Osnabrück',
    name: 'Münster/Osnabrück (FMO)',
    nearbyCodes: [
      { code: 'DTM', name: 'Dortmund (DTM)', distanceKm: 85, railTimeMin: 60 },
      { code: 'PAD', name: 'Paderborn (PAD)', distanceKm: 95, railTimeMin: 65 },
      { code: 'EIN', name: 'Eindhoven (EIN)', distanceKm: 165, railTimeMin: 110 },
    ],
  },
  {
    code: 'PAD',
    city: 'Paderborn/Lippstadt',
    name: 'Paderborn (PAD)',
    nearbyCodes: [
      { code: 'DTM', name: 'Dortmund (DTM)', distanceKm: 80, railTimeMin: 55 },
      { code: 'FMO', name: 'Münster/Osnabrück (FMO)', distanceKm: 95, railTimeMin: 65 },
      { code: 'HAJ', name: 'Hannover (HAJ)', distanceKm: 130, railTimeMin: 85 },
    ],
  },
  {
    code: 'HHN',
    city: 'Frankfurt-Hahn & Hunsrück',
    name: 'Frankfurt-Hahn (HHN)',
    nearbyCodes: [
      { code: 'LUX', name: 'Luxemburg (LUX)', distanceKm: 110, railTimeMin: 80 },
      { code: 'FRA', name: 'Frankfurt (FRA)', distanceKm: 120, railTimeMin: 95 },
      { code: 'CGN', name: 'Köln/Bonn (CGN)', distanceKm: 145, railTimeMin: 105 },
    ],
  },
  {
    code: 'NRN',
    city: 'Weeze / Niederrhein',
    name: 'Weeze / Niederrhein (NRN)',
    nearbyCodes: [
      { code: 'EIN', name: 'Eindhoven (EIN)', distanceKm: 65, railTimeMin: 55 },
      { code: 'DUS', name: 'Düsseldorf (DUS)', distanceKm: 75, railTimeMin: 65 },
      { code: 'CGN', name: 'Köln/Bonn (CGN)', distanceKm: 115, railTimeMin: 85 },
    ],
  },
  {
    code: 'VIE',
    city: 'Wien & Ostösterreich',
    name: 'Wien (VIE)',
    nearbyCodes: [
      { code: 'BTS', name: 'Bratislava (BTS)', distanceKm: 62, railTimeMin: 55 },
      { code: 'GRZ', name: 'Graz (GRZ)', distanceKm: 185, railTimeMin: 135 },
      { code: 'BUD', name: 'Budapest (BUD)', distanceKm: 240, railTimeMin: 145 },
    ],
  },
  {
    code: 'SZG',
    city: 'Salzburg & Oberösterreich',
    name: 'Salzburg (SZG)',
    nearbyCodes: [
      { code: 'MUC', name: 'München (MUC)', distanceKm: 145, railTimeMin: 90 },
      { code: 'LNZ', name: 'Linz (LNZ)', distanceKm: 125, railTimeMin: 75 },
      { code: 'INN', name: 'Innsbruck (INN)', distanceKm: 165, railTimeMin: 110 },
    ],
  },
  {
    code: 'ZRH',
    city: 'Zürich & Nordschweiz',
    name: 'Zürich (ZRH)',
    nearbyCodes: [
      { code: 'BSL', name: 'EuroAirport Basel (BSL)', distanceKm: 85, railTimeMin: 60 },
      { code: 'FDH', name: 'Friedrichshafen (FDH)', distanceKm: 100, railTimeMin: 85 },
      { code: 'FMM', name: 'Memmingen (FMM)', distanceKm: 155, railTimeMin: 115 },
    ],
  },
  {
    code: 'BSL',
    city: 'Basel / Mulhouse / Freiburg',
    name: 'Basel-Mulhouse (BSL)',
    nearbyCodes: [
      { code: 'ZRH', name: 'Zürich (ZRH)', distanceKm: 85, railTimeMin: 60 },
      { code: 'FKB', name: 'Karlsruhe/Baden (FKB)', distanceKm: 160, railTimeMin: 95 },
      { code: 'STR', name: 'Stuttgart (STR)', distanceKm: 220, railTimeMin: 135 },
    ],
  },
  {
    code: 'GVA',
    city: 'Genf & Westschweiz',
    name: 'Genf (GVA)',
    nearbyCodes: [
      { code: 'BSL', name: 'Basel-Mulhouse (BSL)', distanceKm: 230, railTimeMin: 155 },
      { code: 'ZRH', name: 'Zürich (ZRH)', distanceKm: 270, railTimeMin: 165 },
      { code: 'LYS', name: 'Lyon (LYS)', distanceKm: 145, railTimeMin: 110 },
    ],
  },
  {
    code: 'LUX',
    city: 'Luxemburg & Trier/Saarland',
    name: 'Luxemburg (LUX)',
    nearbyCodes: [
      { code: 'HHN', name: 'Frankfurt-Hahn (HHN)', distanceKm: 110, railTimeMin: 80 },
      { code: 'SCN', name: 'Saarbrücken (SCN)', distanceKm: 95, railTimeMin: 70 },
      { code: 'CRL', name: 'Brüssel-Charleroi (CRL)', distanceKm: 175, railTimeMin: 120 },
    ],
  },
  {
    code: 'AMS',
    city: 'Amsterdam & Grenzregion NRW/NDS',
    name: 'Amsterdam (AMS)',
    nearbyCodes: [
      { code: 'EIN', name: 'Eindhoven (EIN)', distanceKm: 120, railTimeMin: 80 },
      { code: 'NRN', name: 'Weeze (NRN)', distanceKm: 145, railTimeMin: 105 },
      { code: 'DUS', name: 'Düsseldorf (DUS)', distanceKm: 210, railTimeMin: 130 },
    ],
  },
];

function buildCalendarForDestination(
  baseFlight: number,
  baseHotelNight: number,
  seedOffset: number
): Record<string, DailyPricePoint[]> {
  const months: { key: string; year: number; month: number; days: number; seasonalMultiplier: number }[] = [
    { key: '2026-11', year: 2026, month: 11, days: 30, seasonalMultiplier: 0.88 },
    { key: '2026-12', year: 2026, month: 12, days: 31, seasonalMultiplier: 1.15 },
    { key: '2027-01', year: 2027, month: 1, days: 31, seasonalMultiplier: 0.82 },
    { key: '2027-02', year: 2027, month: 2, days: 28, seasonalMultiplier: 0.91 },
  ];

  const weekdays = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
  const result: Record<string, DailyPricePoint[]> = {};

  for (const m of months) {
    const points: DailyPricePoint[] = [];
    let minVal = Infinity;

    for (let d = 1; d <= m.days; d++) {
      const dateObj = new Date(m.year, m.month - 1, d);
      const dayOfWeek = dateObj.getDay();
      const isWeekend = dayOfWeek === 5 || dayOfWeek === 6 || dayOfWeek === 0;
      const isTueWed = dayOfWeek === 2 || dayOfWeek === 3;

      // Holiday spike around Dec 20 - Jan 3
      const isHolidayPeak =
        (m.month === 12 && d >= 19) || (m.month === 1 && d <= 4);

      const wave = Math.sin((d + seedOffset) * 0.65) * 14 + Math.cos((d * 2 + seedOffset) * 0.4) * 9;
      let dayFactor = m.seasonalMultiplier;
      if (isTueWed) dayFactor -= 0.16;
      if (isWeekend) dayFactor += 0.22;
      if (isHolidayPeak) dayFactor += 0.58;

      const flightPrice = Math.max(
        24,
        Math.round(baseFlight * dayFactor + wave)
      );
      const hotelPerNight = Math.max(
        28,
        Math.round(baseHotelNight * (isWeekend ? dayFactor * 1.08 : dayFactor * 0.95) + wave * 0.35)
      );

      const combinedMetric = flightPrice + hotelPerNight * 4;
      if (combinedMetric < minVal) {
        minVal = combinedMetric;
      }

      const mm = String(m.month).padStart(2, '0');
      const dd = String(d).padStart(2, '0');

      points.push({
        dateStr: `${m.year}-${mm}-${dd}`,
        dayOfMonth: d,
        weekdayShort: weekdays[dayOfWeek],
        flightPrice,
        hotelPerNight,
        isWeekend,
      });
    }

    // Mark lowest 3 days in month
    const sorted = [...points].sort(
      (a, b) => a.flightPrice + a.hotelPerNight * 4 - (b.flightPrice + b.hotelPerNight * 4)
    );
    const lowestDates = new Set(sorted.slice(0, 3).map((p) => p.dateStr));
    result[m.key] = points.map((p) => ({
      ...p,
      isLowestInMonth: lowestDates.has(p.dateStr),
    }));
  }

  return result;
}

function buildRoutesForAllHubs(
  destCode: string,
  destCity: string,
  baseDirectPrice: number,
  flightDurationMin: number,
  lowCostCarrier: string,
  legacyCarrier: string
): Record<string, RouteOption[]> {
  const routes: Record<string, RouteOption[]> = {};

  for (const hub of DEPARTURE_HUBS) {
    const nearby = hub.nearbyCodes[0];
    const secondNearby = hub.nearbyCodes[1];

    const hubJitter = (hub.code.charCodeAt(0) + destCode.charCodeAt(0)) % 18;
    const directPrice = Math.max(38, baseDirectPrice + hubJitter);
    const nearbyPrice = Math.max(22, Math.round(directPrice * 0.64));
    const splitPrice = Math.max(29, Math.round(directPrice * 0.76));

    routes[hub.code] = [
      {
        id: `${hub.code}-${destCode}-nearby`,
        type: 'nearby_airport',
        label: `Nachbarflughafen-Trick ab ${nearby.name}`,
        summary: `Abflug ab ${nearby.code} statt ${hub.code} spart Flughafengebühren`,
        outbound: {
          originCode: nearby.code,
          originCity: nearby.name,
          destCode,
          destCity,
          carrier: lowCostCarrier,
          flightNumber: `${lowCostCarrier.slice(0, 2).toUpperCase()} 4108`,
          departureTime: '06:45',
          arrivalTime: '09:30',
          durationMinutes: flightDurationMin,
          stops: 0,
        },
        inbound: {
          originCode: destCode,
          originCity: destCity,
          destCode: nearby.code,
          destCity: nearby.name,
          carrier: lowCostCarrier,
          flightNumber: `${lowCostCarrier.slice(0, 2).toUpperCase()} 4109`,
          departureTime: '18:15',
          arrivalTime: '21:05',
          durationMinutes: flightDurationMin + 5,
          stops: 0,
        },
        baseFlightPricePerPerson: nearbyPrice,
        luggageFees: { personal: 0, cabin: 26, checked: 54 },
        railTransferFeePerPerson: 14,
        savingsVsStandard: directPrice - (nearbyPrice + 14),
        savingReason: `Niedrigere Landegebühren in ${nearby.name} (${nearby.railTimeMin} Min. ÖPNV-Shuttle inklusive kalkuliert)`,
      },
      {
        id: `${hub.code}-${destCode}-split`,
        type: 'split_ticket',
        label: '2× One-Way Split-Ticketing (Airline-Mix)',
        summary: `Hinflug mit ${lowCostCarrier}, Rückflug mit ${legacyCarrier} getrennt gebucht`,
        outbound: {
          originCode: hub.code,
          originCity: hub.city.split(' ')[0],
          destCode,
          destCity,
          carrier: lowCostCarrier,
          flightNumber: `${lowCostCarrier.slice(0, 2).toUpperCase()} 882`,
          departureTime: '07:20',
          arrivalTime: '10:05',
          durationMinutes: flightDurationMin,
          stops: 0,
        },
        inbound: {
          originCode: destCode,
          originCity: destCity,
          destCode: secondNearby.code,
          destCity: secondNearby.name,
          carrier: legacyCarrier,
          flightNumber: `${legacyCarrier.slice(0, 2).toUpperCase()} 1940`,
          departureTime: '20:10',
          arrivalTime: '22:55',
          durationMinutes: flightDurationMin,
          stops: 0,
        },
        baseFlightPricePerPerson: splitPrice,
        luggageFees: { personal: 0, cabin: 22, checked: 48 },
        railTransferFeePerPerson: 9,
        savingsVsStandard: directPrice - (splitPrice + 9),
        savingReason: 'Kombination zweier Einzeltickets umgeht Mindestaufenthalts-Tarifregeln klassischer Airlines',
      },
      {
        id: `${hub.code}-${destCode}-direct`,
        type: 'direct',
        label: `Direktflug ab ${hub.name}`,
        summary: `Komfort-Direktverbindung ohne Flughafenwechsel mit ${legacyCarrier}`,
        outbound: {
          originCode: hub.code,
          originCity: hub.city.split(' ')[0],
          destCode,
          destCity,
          carrier: legacyCarrier,
          flightNumber: `${legacyCarrier.slice(0, 2).toUpperCase()} 302`,
          departureTime: '10:15',
          arrivalTime: '13:00',
          durationMinutes: flightDurationMin,
          stops: 0,
        },
        inbound: {
          originCode: destCode,
          originCity: destCity,
          destCode: hub.code,
          destCity: hub.city.split(' ')[0],
          carrier: legacyCarrier,
          flightNumber: `${legacyCarrier.slice(0, 2).toUpperCase()} 303`,
          departureTime: '14:40',
          arrivalTime: '17:25',
          durationMinutes: flightDurationMin,
          stops: 0,
        },
        baseFlightPricePerPerson: directPrice,
        luggageFees: { personal: 0, cabin: 18, checked: 45 },
        railTransferFeePerPerson: 0,
        savingsVsStandard: 0,
        savingReason: 'Standard-Referenztarif ab Hauptflughafen ohne Umstieg',
      },
    ];
  }

  return routes;
}

export const DESTINATIONS: DestinationDeal[] = [
  {
    id: 'palma-mallorca',
    city: 'Palma & Serra de Tramuntana',
    country: 'Spanien',
    regionTag: 'Mittelmeer',
    iata: 'PMI',
    tagline: 'Nebensaison-Fincas & Buchten unter 45 € p.P. im Direktflug',
    avgTempMayOct: 23,
    mealCostIndex: 13,
    localTransitDayPass: 5,
    historicalAvgTotal: 420,
    cheapestMonth: 'Januar & November',
    bestBookingLeadWeeks: 5,
    cheapestWeekday: 'Dienstag',
    svgTheme: {
      primaryFrom: '#0c4a6e',
      primaryTo: '#0284c7',
      accentColor: '#38bdf8',
      landmarkType: 'cove',
    },
    routesByOrigin: buildRoutesForAllHubs('PMI', 'Palma de Mallorca', 64, 135, 'Ryanair', 'Eurowings'),
    hotels: [
      {
        id: 'pmi-h1',
        name: 'Hostal Pons & Historic Patio',
        neighborhood: 'Altstadt La Lonja · 400m zum Hafen',
        category: 'Boutique Gästehaus',
        rating: 8.7,
        reviewCount: 642,
        pricePerNightTwoAdults: 54,
        boardType: 'Nur Übernachtung',
        cancellation: 'Nicht erstattbar (Sparpreis)',
        distanceToCenterKm: 0.4,
        highlights: ['Historischer Innenhof', 'Keine Resortgebühren', 'Direktbus A1 ab Flughafen'],
      },
      {
        id: 'pmi-h2',
        name: 'Aparthotel Tramuntana Breeze',
        neighborhood: 'Cala Major · Direkt am Küstenpfad',
        category: '3.5★ Aparthotel mit Küche',
        rating: 8.9,
        reviewCount: 918,
        pricePerNightTwoAdults: 68,
        boardType: 'Frühstück inklusive',
        cancellation: 'Kostenlos stornierbar',
        distanceToCenterKm: 3.2,
        highlights: ['Eigene Kitchenette spart Restaurantkosten', 'Meerblick-Dachterrasse', 'Frühbucher -28%'],
      },
      {
        id: 'pmi-h3',
        name: 'Design Hotel Cort Sant Jaume',
        neighborhood: 'Zentrum Santa Catalina',
        category: '4★ Komfort-Hotel',
        rating: 9.2,
        reviewCount: 410,
        pricePerNightTwoAdults: 94,
        boardType: 'Halbpension',
        cancellation: 'Kostenlos stornierbar',
        distanceToCenterKm: 0.6,
        highlights: ['Abendmenü inklusive', 'Spa & Innenpool kostenfrei', 'Später Check-out 14 Uhr'],
      },
    ],
    monthlyCalendar: buildCalendarForDestination(34, 54, 1),
    priceHistory30Days: [
      { dayLabel: 'Vor 30T', price: 390 },
      { dayLabel: 'Vor 24T', price: 365 },
      { dayLabel: 'Vor 18T', price: 340 },
      { dayLabel: 'Vor 12T', price: 310 },
      { dayLabel: 'Vor 6T', price: 268 },
      { dayLabel: 'Heute', price: 238 },
    ],
  },
  {
    id: 'lissabon-alfama',
    city: 'Lissabon & Sintra Küste',
    country: 'Portugal',
    regionTag: 'Atlantik & Inseln',
    iata: 'LIS',
    tagline: 'Atlantik-Sonne, historische Elektrik-Trams & Europas günstigste Kaffeekultur',
    avgTempMayOct: 22,
    mealCostIndex: 11,
    localTransitDayPass: 6.8,
    historicalAvgTotal: 495,
    cheapestMonth: 'November & Januar',
    bestBookingLeadWeeks: 6,
    cheapestWeekday: 'Mittwoch',
    svgTheme: {
      primaryFrom: '#7c2d12',
      primaryTo: '#ea580c',
      accentColor: '#fbbf24',
      landmarkType: 'tram',
    },
    routesByOrigin: buildRoutesForAllHubs('LIS', 'Lissabon', 86, 185, 'Wizz Air', 'TAP Air Portugal'),
    hotels: [
      {
        id: 'lis-h1',
        name: 'Baixa Tile Townhouse Suites',
        neighborhood: 'Baixa-Chiado · U-Bahn 150m',
        category: 'Gästehaus mit Gemeinschaftsküche',
        rating: 8.8,
        reviewCount: 1120,
        pricePerNightTwoAdults: 58,
        boardType: 'Nur Übernachtung',
        cancellation: 'Nicht erstattbar (Sparpreis)',
        distanceToCenterKm: 0.3,
        highlights: ['Metro-Anbindung direkt zum Airport (2,10 €)', 'Traditionelle Azulejo-Zimmer', 'Schnelles Glasfaser-WLAN'],
      },
      {
        id: 'lis-h2',
        name: 'Alfama Miradouro Boutique Hotel',
        neighborhood: 'Alfama Altstadt · Tejo-Blick',
        category: '3★ Boutique-Hotel',
        rating: 9.0,
        reviewCount: 780,
        pricePerNightTwoAdults: 74,
        boardType: 'Frühstück inklusive',
        cancellation: 'Kostenlos stornierbar',
        distanceToCenterKm: 0.8,
        highlights: ['Frische Pastéis de Nata beim Frühstück', 'Dachterrasse über dem Tejo', 'Sonderkontingent -32%'],
      },
      {
        id: 'lis-h3',
        name: 'Avenida Liberdade Grand Studios',
        neighborhood: 'Príncipe Real · Parknähe',
        category: '4★ Design-Aparthotel',
        rating: 9.3,
        reviewCount: 530,
        pricePerNightTwoAdults: 102,
        boardType: 'Frühstück inklusive',
        cancellation: 'Kostenlos stornierbar',
        distanceToCenterKm: 0.9,
        highlights: ['Große Studios mit Espressomaschine', 'Ruhige Innenhoflage', 'Inkl. Sintra-Zugticket'],
      },
    ],
    monthlyCalendar: buildCalendarForDestination(48, 58, 4),
    priceHistory30Days: [
      { dayLabel: 'Vor 30T', price: 460 },
      { dayLabel: 'Vor 24T', price: 430 },
      { dayLabel: 'Vor 18T', price: 415 },
      { dayLabel: 'Vor 12T', price: 345 },
      { dayLabel: 'Vor 6T', price: 312 },
      { dayLabel: 'Heute', price: 278 },
    ],
  },
  {
    id: 'budapest-donau',
    city: 'Budapest & Thermalbäder',
    country: 'Ungarn',
    regionTag: 'Balkan & Osteuropa',
    iata: 'BUD',
    tagline: 'Unschlagbares Preis-Leistungs-Verhältnis für 4★-Hotels & Jugendstil-Thermen',
    avgTempMayOct: 20,
    mealCostIndex: 8.5,
    localTransitDayPass: 4.2,
    historicalAvgTotal: 340,
    cheapestMonth: 'Januar & November',
    bestBookingLeadWeeks: 4,
    cheapestWeekday: 'Dienstag',
    svgTheme: {
      primaryFrom: '#1e1b4b',
      primaryTo: '#4338ca',
      accentColor: '#f59e0b',
      landmarkType: 'parliament',
    },
    routesByOrigin: buildRoutesForAllHubs('BUD', 'Budapest', 52, 95, 'Wizz Air', 'Lufthansa'),
    hotels: [
      {
        id: 'bud-h1',
        name: 'Danube Quarter Urban Lofts',
        neighborhood: 'Erzsébetváros · Jüdisches Viertel',
        category: 'Smart-Studios',
        rating: 8.6,
        reviewCount: 1450,
        pricePerNightTwoAdults: 42,
        boardType: 'Nur Übernachtung',
        cancellation: 'Nicht erstattbar (Sparpreis)',
        distanceToCenterKm: 0.7,
        highlights: ['Self-Check-in 24h', 'Voll ausgestattete Miniküche', 'Fußläufig zur St.-Stephans-Basilika'],
      },
      {
        id: 'bud-h2',
        name: 'Hotel Gellért Thermal View',
        neighborhood: 'Buda-Ufer · Direkt an der Freiheitsbrücke',
        category: '4★ Komfort-Hotel',
        rating: 9.1,
        reviewCount: 890,
        pricePerNightTwoAdults: 59,
        boardType: 'Frühstück inklusive',
        cancellation: 'Kostenlos stornierbar',
        distanceToCenterKm: 0.9,
        highlights: ['50% Rabatt auf Thermalbad-Eintritt', 'Großes warmes Frühstücksbuffet', 'Panorama-Blick auf die Donau'],
      },
      {
        id: 'bud-h3',
        name: 'Andrássy Palace Suites',
        neighborhood: 'Opernviertel · Andrássy út',
        category: '4.5★ Boutique Palace',
        rating: 9.4,
        reviewCount: 620,
        pricePerNightTwoAdults: 82,
        boardType: 'Halbpension',
        cancellation: 'Kostenlos stornierbar',
        distanceToCenterKm: 0.5,
        highlights: ['3-Gänge-Abendessen im Gewölbekeller', 'Hoteleigene Sauna & Dampfbad', 'Kostenloser Flughafenshuttle'],
      },
    ],
    monthlyCalendar: buildCalendarForDestination(26, 42, 7),
    priceHistory30Days: [
      { dayLabel: 'Vor 30T', price: 320 },
      { dayLabel: 'Vor 24T', price: 295 },
      { dayLabel: 'Vor 18T', price: 280 },
      { dayLabel: 'Vor 12T', price: 245 },
      { dayLabel: 'Vor 6T', price: 215 },
      { dayLabel: 'Heute', price: 196 },
    ],
  },
  {
    id: 'istanbul-bosporus',
    city: 'Istanbul & Bosporus',
    country: 'Türkei',
    regionTag: 'Fernreise-Budget',
    iata: 'SAW',
    tagline: 'Zwei Kontinente, Basare & 4★-Hotels in Karaköy zum Bruchteil westeuropäischer Preise',
    avgTempMayOct: 24,
    mealCostIndex: 7.5,
    localTransitDayPass: 3.5,
    historicalAvgTotal: 450,
    cheapestMonth: 'November & Februar',
    bestBookingLeadWeeks: 5,
    cheapestWeekday: 'Mittwoch',
    svgTheme: {
      primaryFrom: '#4c1d95',
      primaryTo: '#be185d',
      accentColor: '#fb923c',
      landmarkType: 'bosphorus',
    },
    routesByOrigin: buildRoutesForAllHubs('SAW', 'Istanbul Sabiha Gökçen', 74, 175, 'Pegasus Airlines', 'Turkish Airlines'),
    hotels: [
      {
        id: 'ist-h1',
        name: 'Galata Tower Heritage Inn',
        neighborhood: 'Karaköy & Galata · 300m zur Fähre',
        category: '3★ Charakter-Hotel',
        rating: 8.7,
        reviewCount: 940,
        pricePerNightTwoAdults: 46,
        boardType: 'Frühstück inklusive',
        cancellation: 'Nicht erstattbar (Sparpreis)',
        distanceToCenterKm: 0.6,
        highlights: ['Türkisches Frühstück auf der Dachterrasse', 'M4 Metro direkt vom Flughafen SAW', 'Keine versteckten Taxen'],
      },
      {
        id: 'ist-h2',
        name: 'Sultanahmet Ottoman Courtyard',
        neighborhood: 'Historische Halbinsel · Hagia Sophia 500m',
        category: '4★ Boutique-Hotel',
        rating: 9.1,
        reviewCount: 1280,
        pricePerNightTwoAdults: 62,
        boardType: 'Frühstück inklusive',
        cancellation: 'Kostenlos stornierbar',
        distanceToCenterKm: 0.4,
        highlights: ['Ruhiger Marmorgarten', 'Kostenloser Nachmittags-Cay & Baklava', 'Istanbulkart mit 10€ Guthaben inklusive'],
      },
      {
        id: 'ist-h3',
        name: 'Bosphorus Waterfront Suites',
        neighborhood: 'Beşiktaş · Direkt am Wasser',
        category: '5★ Luxury Budget Deal',
        rating: 9.4,
        reviewCount: 515,
        pricePerNightTwoAdults: 92,
        boardType: 'Halbpension',
        cancellation: 'Kostenlos stornierbar',
        distanceToCenterKm: 1.8,
        highlights: ['Traditionelles Hamam inklusive', 'Balkon mit Bosporus-Blick', 'Währungs-Vorteilstarif -35%'],
      },
    ],
    monthlyCalendar: buildCalendarForDestination(42, 46, 11),
    priceHistory30Days: [
      { dayLabel: 'Vor 30T', price: 430 },
      { dayLabel: 'Vor 24T', price: 398 },
      { dayLabel: 'Vor 18T', price: 360 },
      { dayLabel: 'Vor 12T', price: 315 },
      { dayLabel: 'Vor 6T', price: 275 },
      { dayLabel: 'Heute', price: 248 },
    ],
  },
  {
    id: 'athen-riviera',
    city: 'Athen & Saronische Inseln',
    country: 'Griechenland',
    regionTag: 'Mittelmeer',
    iata: 'ATH',
    tagline: 'Milde 21°C im Spätherbst, Akropolis ohne Warteschlangen & Insel-Fähren ab 12 €',
    avgTempMayOct: 25,
    mealCostIndex: 11.5,
    localTransitDayPass: 4.1,
    historicalAvgTotal: 465,
    cheapestMonth: 'November & Januar',
    bestBookingLeadWeeks: 6,
    cheapestWeekday: 'Dienstag',
    svgTheme: {
      primaryFrom: '#1e3a8a',
      primaryTo: '#0284c7',
      accentColor: '#fde047',
      landmarkType: 'acropolis',
    },
    routesByOrigin: buildRoutesForAllHubs('ATH', 'Athen Eleftherios Venizelos', 72, 165, 'Ryanair', 'Aegean Airlines'),
    hotels: [
      {
        id: 'ath-h1',
        name: 'Psyrri Artisan Lofts',
        neighborhood: 'Psyrri & Monastiraki · Zentrum',
        category: 'Urban Aparthotel',
        rating: 8.8,
        reviewCount: 830,
        pricePerNightTwoAdults: 52,
        boardType: 'Nur Übernachtung',
        cancellation: 'Nicht erstattbar (Sparpreis)',
        distanceToCenterKm: 0.3,
        highlights: ['Blick auf die beleuchtete Akropolis', 'Umgeben von authentischen Tavernen', 'Direkte Metro M3 vom Flughafen'],
      },
      {
        id: 'ath-h2',
        name: 'Plaka Acropolis View Hotel',
        neighborhood: 'Plaka Altstadt · Autofreie Zone',
        category: '3.5★ Klassik-Hotel',
        rating: 9.0,
        reviewCount: 1040,
        pricePerNightTwoAdults: 69,
        boardType: 'Frühstück inklusive',
        cancellation: 'Kostenlos stornierbar',
        distanceToCenterKm: 0.5,
        highlights: ['Griechisches Joghurt- & Honig-Frühstück auf dem Dach', '5 Gehminuten zum Akropolis-Eingang', 'Nebensaison-Eintritt vor Ort -50%'],
      },
      {
        id: 'ath-h3',
        name: 'Glyfada Riviera Seafront',
        neighborhood: 'Athener Riviera · Strandpromenade',
        category: '4★ Strand- & Stadthotel',
        rating: 9.2,
        reviewCount: 490,
        pricePerNightTwoAdults: 95,
        boardType: 'Halbpension',
        cancellation: 'Kostenlos stornierbar',
        distanceToCenterKm: 8.5,
        highlights: ['Direkter Strandzugang & Tram in die City', 'Beheizter Außenpool', 'Abendessen am Meer inklusive'],
      },
    ],
    monthlyCalendar: buildCalendarForDestination(39, 52, 15),
    priceHistory30Days: [
      { dayLabel: 'Vor 30T', price: 440 },
      { dayLabel: 'Vor 24T', price: 410 },
      { dayLabel: 'Vor 18T', price: 375 },
      { dayLabel: 'Vor 12T', price: 330 },
      { dayLabel: 'Vor 6T', price: 289 },
      { dayLabel: 'Heute', price: 256 },
    ],
  },
  {
    id: 'porto-douro',
    city: 'Porto & Douro-Tal',
    country: 'Portugal',
    regionTag: 'Atlantik & Inseln',
    iata: 'OPO',
    tagline: 'Ribeira-Altstadt, Atlantikstrände & extrem günstige Direktflüge ab Nachbarflughäfen',
    avgTempMayOct: 21,
    mealCostIndex: 10.5,
    localTransitDayPass: 7.0,
    historicalAvgTotal: 430,
    cheapestMonth: 'Januar & November',
    bestBookingLeadWeeks: 5,
    cheapestWeekday: 'Dienstag',
    svgTheme: {
      primaryFrom: '#0f172a',
      primaryTo: '#0369a1',
      accentColor: '#f97316',
      landmarkType: 'porto_bridge',
    },
    routesByOrigin: buildRoutesForAllHubs('OPO', 'Porto Francisco Sá Carneiro', 62, 170, 'Ryanair', 'TAP Air Portugal'),
    hotels: [
      {
        id: 'opo-h1',
        name: 'São Bento Azulejo Guesthouse',
        neighborhood: 'Zentrum Aliados · 200m zum Bahnhof',
        category: 'Boutique Guesthouse',
        rating: 8.9,
        reviewCount: 970,
        pricePerNightTwoAdults: 49,
        boardType: 'Nur Übernachtung',
        cancellation: 'Nicht erstattbar (Sparpreis)',
        distanceToCenterKm: 0.2,
        highlights: ['Balkon zur Altstadt', 'Metro Linie E direkt vom Airport (2,20 €)', 'Kaffee & Tee ganztägig gratis'],
      },
      {
        id: 'opo-h2',
        name: 'Ribeira Riverfront Lodge',
        neighborhood: 'Vila Nova de Gaia · Blick auf Dom Luís I',
        category: '3.5★ Wein- & Stadthotel',
        rating: 9.1,
        reviewCount: 740,
        pricePerNightTwoAdults: 66,
        boardType: 'Frühstück inklusive',
        cancellation: 'Kostenlos stornierbar',
        distanceToCenterKm: 0.6,
        highlights: ['Inklusive Portwein-Verkostung nebenan', 'Frühstück mit Flussblick', '30% Nebensaison-Rabatt'],
      },
      {
        id: 'opo-h3',
        name: 'Foz do Douro Ocean Suites',
        neighborhood: 'Foz Atlantikküste · Historische Tram 1',
        category: '4★ Boutique-Aparthotel',
        rating: 9.3,
        reviewCount: 380,
        pricePerNightTwoAdults: 88,
        boardType: 'Frühstück inklusive',
        cancellation: 'Kostenlos stornierbar',
        distanceToCenterKm: 4.2,
        highlights: ['Direkt an der Atlantikpromenade', 'Kostenlose Leihfahrräder', 'Große Suite mit Wohnbereich'],
      },
    ],
    monthlyCalendar: buildCalendarForDestination(32, 49, 19),
    priceHistory30Days: [
      { dayLabel: 'Vor 30T', price: 405 },
      { dayLabel: 'Vor 24T', price: 375 },
      { dayLabel: 'Vor 18T', price: 340 },
      { dayLabel: 'Vor 12T', price: 295 },
      { dayLabel: 'Vor 6T', price: 258 },
      { dayLabel: 'Heute', price: 229 },
    ],
  },
  {
    id: 'krakau-hohe-tatra',
    city: 'Krakau & Zakopane Bergwelt',
    country: 'Polen',
    regionTag: 'Städtetrip',
    iata: 'KRK',
    tagline: 'Europas bestbewertete Altstadt-Hotellerie & Gourmet-Küche zu Kleinstadtpreisen',
    avgTempMayOct: 19,
    mealCostIndex: 8.0,
    localTransitDayPass: 3.9,
    historicalAvgTotal: 295,
    cheapestMonth: 'November & Januar',
    bestBookingLeadWeeks: 3,
    cheapestWeekday: 'Mittwoch',
    svgTheme: {
      primaryFrom: '#064e3b',
      primaryTo: '#0d9488',
      accentColor: '#fbbf24',
      landmarkType: 'tatra',
    },
    routesByOrigin: buildRoutesForAllHubs('KRK', 'Krakau Balice', 44, 85, 'Ryanair', 'LOT Polish Airlines'),
    hotels: [
      {
        id: 'krk-h1',
        name: 'Kazimierz Artisan Aparthotel',
        neighborhood: 'Kazimierz Kreativviertel · Wawel 600m',
        category: 'Design-Studios',
        rating: 8.9,
        reviewCount: 1320,
        pricePerNightTwoAdults: 38,
        boardType: 'Nur Übernachtung',
        cancellation: 'Nicht erstattbar (Sparpreis)',
        distanceToCenterKm: 0.7,
        highlights: ['Backstein-Lofts mit Fußbodenheizung', 'Flughafenzug SKA1 in 17 Minuten', 'Top-Bewertung für Sauberkeit'],
      },
      {
        id: 'krk-h2',
        name: 'Stare Miasto Amber Boutique',
        neighborhood: 'Altstadt-Ring (Planty) · Tuchhallen 300m',
        category: '4★ Boutique-Hotel',
        rating: 9.2,
        reviewCount: 860,
        pricePerNightTwoAdults: 54,
        boardType: 'Frühstück inklusive',
        cancellation: 'Kostenlos stornierbar',
        distanceToCenterKm: 0.3,
        highlights: ['Regionales Bio-Frühstücksbuffet', 'Kostenlose Sauna-Nutzung am Abend', '4★-Luxus zum Hostel-Preis'],
      },
      {
        id: 'krk-h3',
        name: 'Grand Wawel Royal Suites',
        neighborhood: 'Am Fuß des Wawel-Schlosses',
        category: '5★ Heritage Hotel',
        rating: 9.5,
        reviewCount: 470,
        pricePerNightTwoAdults: 78,
        boardType: 'Halbpension',
        cancellation: 'Kostenlos stornierbar',
        distanceToCenterKm: 0.5,
        highlights: ['Abendmenü im preisgekrönten Restaurant', 'Inklusive Zakopane-Tagesbus-Ticket', 'Garantierter Late Check-out'],
      },
    ],
    monthlyCalendar: buildCalendarForDestination(22, 38, 23),
    priceHistory30Days: [
      { dayLabel: 'Vor 30T', price: 280 },
      { dayLabel: 'Vor 24T', price: 265 },
      { dayLabel: 'Vor 18T', price: 245 },
      { dayLabel: 'Vor 12T', price: 215 },
      { dayLabel: 'Vor 6T', price: 192 },
      { dayLabel: 'Heute', price: 174 },
    ],
  },
  {
    id: 'marrakesch-atlas',
    city: 'Marrakesch & Hoher Atlas',
    country: 'Marokko',
    regionTag: 'Fernreise-Budget',
    iata: 'RAK',
    tagline: '25°C Wintersonne, orientalische Riads mit Innenhof-Pool & Direktflüge ab 39 €',
    avgTempMayOct: 27,
    mealCostIndex: 7.0,
    localTransitDayPass: 3.0,
    historicalAvgTotal: 480,
    cheapestMonth: 'November & Januar',
    bestBookingLeadWeeks: 6,
    cheapestWeekday: 'Dienstag',
    svgTheme: {
      primaryFrom: '#7c2d12',
      primaryTo: '#b45309',
      accentColor: '#fde68a',
      landmarkType: 'medina',
    },
    routesByOrigin: buildRoutesForAllHubs('RAK', 'Marrakesch Menara', 78, 225, 'Ryanair', 'Eurowings'),
    hotels: [
      {
        id: 'rak-h1',
        name: 'Riad Zitoune Cedar Courtyard',
        neighborhood: 'Medina Süd · 5 Min. zum Bahia-Palast',
        category: 'Traditionelles Riad',
        rating: 8.9,
        reviewCount: 1150,
        pricePerNightTwoAdults: 48,
        boardType: 'Frühstück inklusive',
        cancellation: 'Nicht erstattbar (Sparpreis)',
        distanceToCenterKm: 0.6,
        highlights: ['Hausgemachtes marokkanisches Frühstück inklusive', 'Dachterrasse mit Blick auf den Hohen Atlas', 'Minztee zur Begrüßung'],
      },
      {
        id: 'rak-h2',
        name: 'Riad Jardin Secret & Spa',
        neighborhood: 'Mouassine · Ruhige Seitengasse',
        category: '4★ Boutique-Riad mit beheiztem Pool',
        rating: 9.3,
        reviewCount: 840,
        pricePerNightTwoAdults: 68,
        boardType: 'Frühstück inklusive',
        cancellation: 'Kostenlos stornierbar',
        distanceToCenterKm: 0.4,
        highlights: ['Beheiztes Tauchbecken im Orangen-Patio', 'Kostenloser Flughafen-Abholservice', 'Direktbucher-Vorteil -30%'],
      },
      {
        id: 'rak-h3',
        name: 'Palmeraie Oasis Resort & Villas',
        neighborhood: 'Palmenhain · 15 Min. Shuttle in die Medina',
        category: '4.5★ Garten-Resort',
        rating: 9.1,
        reviewCount: 610,
        pricePerNightTwoAdults: 94,
        boardType: 'Halbpension',
        cancellation: 'Kostenlos stornierbar',
        distanceToCenterKm: 5.5,
        highlights: ['Große Poollandschaft unter Palmen', 'Tajine-Abendbuffet inklusive', 'Stündlicher Gratis-Shuttle ins Zentrum'],
      },
    ],
    monthlyCalendar: buildCalendarForDestination(44, 48, 29),
    priceHistory30Days: [
      { dayLabel: 'Vor 30T', price: 465 },
      { dayLabel: 'Vor 24T', price: 425 },
      { dayLabel: 'Vor 18T', price: 390 },
      { dayLabel: 'Vor 12T', price: 340 },
      { dayLabel: 'Vor 6T', price: 295 },
      { dayLabel: 'Heute', price: 262 },
    ],
  },
  // --- SPANIEN SPEZIAL-ANGEBOTE ---
  {
    id: 'barcelona-costa-brava',
    city: 'Barcelona & Costa Brava',
    country: 'Spanien',
    regionTag: 'Mittelmeer',
    iata: 'BCN',
    tagline: 'Gotisches Viertel, Gaudí-Architektur & Sandbuchten der Costa Brava zum Nebensaison-Tarif',
    avgTempMayOct: 23,
    mealCostIndex: 12.5,
    localTransitDayPass: 5.5,
    historicalAvgTotal: 395,
    cheapestMonth: 'November & Januar',
    bestBookingLeadWeeks: 5,
    cheapestWeekday: 'Dienstag',
    svgTheme: {
      primaryFrom: '#0c4a6e',
      primaryTo: '#0284c7',
      accentColor: '#38bdf8',
      landmarkType: 'cove',
    },
    routesByOrigin: buildRoutesForAllHubs('BCN', 'Barcelona', 54, 130, 'Vueling', 'Lufthansa'),
    hotels: [
      {
        id: 'bcn-h1',
        name: 'Hostal & Studios Eixample Smart',
        neighborhood: 'Eixample · 400m zur Passeig de Gràcia',
        category: 'Smart-Aparthotel (Sparpreis)',
        rating: 8.6,
        reviewCount: 920,
        pricePerNightTwoAdults: 58,
        boardType: 'Nur Übernachtung',
        cancellation: 'Nicht erstattbar (Sparpreis)',
        distanceToCenterKm: 0.7,
        highlights: ['Direkte U-Bahn L9/R2 vom Flughafen', 'Eigene Pantry-Küche & Balkon', '24h Self-Check-in'],
      },
      {
        id: 'bcn-h2',
        name: 'Hotel Poblenou Beach & Design',
        neighborhood: 'Poblenou · 5 Gehminuten zum Strand Bogatell',
        category: '4★ Boutique-Hotel',
        rating: 9.0,
        reviewCount: 740,
        pricePerNightTwoAdults: 76,
        boardType: 'Frühstück inklusive',
        cancellation: 'Kostenlos stornierbar',
        distanceToCenterKm: 1.9,
        highlights: ['Katalanisches Frühstücksbuffet inklusive', 'Dachterrasse mit Meerblick-Pool', 'Sonderkontingent -28%'],
      },
      {
        id: 'bcn-h3',
        name: 'Costa Brava Cala Suites & Spa (Tossa / Lloret)',
        neighborhood: 'Costa Brava Küste · Direkt über der Felsenbucht',
        category: '4.5★ Küsten-Resort',
        rating: 9.2,
        reviewCount: 530,
        pricePerNightTwoAdults: 94,
        boardType: 'Halbpension',
        cancellation: 'Kostenlos stornierbar',
        distanceToCenterKm: 0.4,
        highlights: ['Frühstück & mediterranes Abendbuffet inklusive', 'Beheizter Infinity-Pool über dem Meer', 'Kostenfreier Parkplatz für Mietwagen'],
      },
    ],
    monthlyCalendar: buildCalendarForDestination(42, 58, 9),
    priceHistory30Days: [
      { dayLabel: 'Vor 30T', price: 398 },
      { dayLabel: 'Vor 24T', price: 365 },
      { dayLabel: 'Vor 18T', price: 332 },
      { dayLabel: 'Vor 12T', price: 298 },
      { dayLabel: 'Vor 6T', price: 264 },
      { dayLabel: 'Heute', price: 239 },
    ],
  },
  {
    id: 'teneriffa-adeje',
    city: 'Teneriffa & Costa Adeje',
    country: 'Spanien',
    regionTag: 'Atlantik & Inseln',
    iata: 'TFS',
    tagline: 'Ganzjährig 23–25 °C Frühlingsklima auf den Kanaren mit Teide-Nationalpark & Atlantikstränden',
    avgTempMayOct: 25,
    mealCostIndex: 10.5,
    localTransitDayPass: 5.0,
    historicalAvgTotal: 495,
    cheapestMonth: 'November & Januar',
    bestBookingLeadWeeks: 6,
    cheapestWeekday: 'Mittwoch',
    svgTheme: {
      primaryFrom: '#1e3a8a',
      primaryTo: '#0284c7',
      accentColor: '#f59e0b',
      landmarkType: 'canary_volcano',
    },
    routesByOrigin: buildRoutesForAllHubs('TFS', 'Teneriffa', 78, 270, 'Ryanair', 'Condor'),
    hotels: [
      {
        id: 'tfs-h1',
        name: 'Apartamentos Sol del Teide Süd',
        neighborhood: 'Los Cristianos · 350m zur Strandpromenade',
        category: 'Sonnen-Aparthotel (Sparpreis)',
        rating: 8.6,
        reviewCount: 840,
        pricePerNightTwoAdults: 56,
        boardType: 'Nur Übernachtung',
        cancellation: 'Nicht erstattbar (Sparpreis)',
        distanceToCenterKm: 0.5,
        highlights: ['Sonnenterrasse mit Blick auf La Gomera', 'Voll ausgestattete Küche spart Restaurantkosten', 'Linienbus 111 direkt ab Flughafen TFS'],
      },
      {
        id: 'tfs-h2',
        name: 'Costa Adeje Ocean Breeze Hotel',
        neighborhood: 'Costa Adeje · 250m zur Playa Fañabé',
        category: '4★ Strandhotel',
        rating: 9.0,
        reviewCount: 1120,
        pricePerNightTwoAdults: 74,
        boardType: 'Frühstück inklusive',
        cancellation: 'Kostenlos stornierbar',
        distanceToCenterKm: 0.4,
        highlights: ['Großes Frühstücksbuffet auf der Meerblick-Terrasse', '2 ganzjährig beheizte Außenpools', 'Kostenlose Stornierung bis 24h vor Anreise'],
      },
      {
        id: 'tfs-h3',
        name: 'Gran Resort Atlántico & Thalasso Spa',
        neighborhood: 'Playa del Duque · 1. Strandreihe',
        category: '4.5★ Premium-Resort',
        rating: 9.3,
        reviewCount: 680,
        pricePerNightTwoAdults: 98,
        boardType: 'Halbpension',
        cancellation: 'Kostenlos stornierbar',
        distanceToCenterKm: 0.6,
        highlights: ['Frühstück & kanarisches Show-Cooking am Abend', 'Direkter Zugang zum hellen Sandstrand', 'Kostenfreier Wellness-Zugang'],
      },
    ],
    monthlyCalendar: buildCalendarForDestination(64, 56, 15),
    priceHistory30Days: [
      { dayLabel: 'Vor 30T', price: 485 },
      { dayLabel: 'Vor 24T', price: 448 },
      { dayLabel: 'Vor 18T', price: 412 },
      { dayLabel: 'Vor 12T', price: 369 },
      { dayLabel: 'Vor 6T', price: 328 },
      { dayLabel: 'Heute', price: 294 },
    ],
  },
  {
    id: 'malaga-andalusien',
    city: 'Málaga & Andalusien',
    country: 'Spanien',
    regionTag: 'Mittelmeer',
    iata: 'AGP',
    tagline: '320 Sonnentage an der Costa del Sol, weiße Dörfer (Ronda & Mijas) und Tapas-Kultur zum Bestpreis',
    avgTempMayOct: 25,
    mealCostIndex: 10.0,
    localTransitDayPass: 4.5,
    historicalAvgTotal: 380,
    cheapestMonth: 'November & Februar',
    bestBookingLeadWeeks: 5,
    cheapestWeekday: 'Dienstag',
    svgTheme: {
      primaryFrom: '#7c2d12',
      primaryTo: '#ea580c',
      accentColor: '#fbbf24',
      landmarkType: 'cove',
    },
    routesByOrigin: buildRoutesForAllHubs('AGP', 'Málaga', 52, 165, 'Ryanair', 'Eurowings'),
    hotels: [
      {
        id: 'agp-h1',
        name: 'Alcazaba Old Town Smart Suites',
        neighborhood: 'Centro Histórico · 400m zum Picasso-Museum',
        category: 'Boutique-Studios (Sparpreis)',
        rating: 8.8,
        reviewCount: 690,
        pricePerNightTwoAdults: 52,
        boardType: 'Nur Übernachtung',
        cancellation: 'Nicht erstattbar (Sparpreis)',
        distanceToCenterKm: 0.3,
        highlights: ['12 Min. S-Bahn direkt vom Flughafen AGP', 'Mitten in der historischen Tapas-Altstadt', 'Dachterrasse mit Blick auf die Festung'],
      },
      {
        id: 'agp-h2',
        name: 'Sol & Mar Promenade Hotel Torremolinos/Benalmádena',
        neighborhood: 'Carihuela Strandpromenade · Direkt am Meer',
        category: '4★ Strandhotel',
        rating: 8.9,
        reviewCount: 950,
        pricePerNightTwoAdults: 68,
        boardType: 'Frühstück inklusive',
        cancellation: 'Kostenlos stornierbar',
        distanceToCenterKm: 0.5,
        highlights: ['Andalusisches Frühstücksbuffet inklusive', 'Direkt am breiten Sandstrand gelegen', 'Sonderkontingent -31% ggü. Einzelbuchung'],
      },
      {
        id: 'agp-h3',
        name: 'Gran Hotel Costa del Sol & Golf Spa',
        neighborhood: 'Marbella / Estepona Küste · Ruhige Strandbucht',
        category: '4.5★ Andalusien-Resort',
        rating: 9.2,
        reviewCount: 540,
        pricePerNightTwoAdults: 89,
        boardType: 'Halbpension',
        cancellation: 'Kostenlos stornierbar',
        distanceToCenterKm: 1.4,
        highlights: ['Frühstück & Abendbuffet mit Meeresfrüchten', 'Beheizter Außenpool & Palmengarten', 'Idealer Ausgangspunkt für Ausflüge nach Ronda & Granada'],
      },
    ],
    monthlyCalendar: buildCalendarForDestination(40, 52, 19),
    priceHistory30Days: [
      { dayLabel: 'Vor 30T', price: 375 },
      { dayLabel: 'Vor 24T', price: 342 },
      { dayLabel: 'Vor 18T', price: 315 },
      { dayLabel: 'Vor 12T', price: 279 },
      { dayLabel: 'Vor 6T', price: 248 },
      { dayLabel: 'Heute', price: 218 },
    ],
  },
  // --- TÜRKEI SPEZIAL-ANGEBOTE ---
  {
    id: 'antalya-riviera',
    city: 'Antalya & Türkische Riviera',
    country: 'Türkei',
    regionTag: 'Mittelmeer',
    iata: 'AYT',
    tagline: '4★ & 5★ Strandresorts in Lara, Side & Belek zu unschlagbaren Vor- und Nachsaison-Pauschalpreisen',
    avgTempMayOct: 27,
    mealCostIndex: 7.5,
    localTransitDayPass: 2.5,
    historicalAvgTotal: 420,
    cheapestMonth: 'November & Januar',
    bestBookingLeadWeeks: 5,
    cheapestWeekday: 'Dienstag',
    svgTheme: {
      primaryFrom: '#0f172a',
      primaryTo: '#0369a1',
      accentColor: '#38bdf8',
      landmarkType: 'cove',
    },
    routesByOrigin: buildRoutesForAllHubs('AYT', 'Antalya', 59, 205, 'SunExpress', 'Pegasus'),
    hotels: [
      {
        id: 'ayt-h1',
        name: 'Kaleiçi Marina Boutique Konak',
        neighborhood: 'Historische Altstadt Kaleiçi · 250m zum Mermerli-Strand',
        category: 'Boutique-Hotel (Sparpreis)',
        rating: 8.8,
        reviewCount: 780,
        pricePerNightTwoAdults: 42,
        boardType: 'Frühstück inklusive',
        cancellation: 'Nicht erstattbar (Sparpreis)',
        distanceToCenterKm: 0.3,
        highlights: ['Direkte Straßenbahn (Antray) ab Flughafen AYT', 'Traditionelles türkisches Frühstück im Orangengarten', 'Nur wenige Schritte zum alten Yachthafen'],
      },
      {
        id: 'ayt-h2',
        name: 'Lara Beach Resort & Spa',
        neighborhood: 'Lara Sandstrand · Direkt am Meer',
        category: '4.5★ Strand-Resort',
        rating: 9.0,
        reviewCount: 1340,
        pricePerNightTwoAdults: 62,
        boardType: 'Halbpension',
        cancellation: 'Kostenlos stornierbar',
        distanceToCenterKm: 0.8,
        highlights: ['Frühstück & großes Abendbuffet inklusive', 'Privatstrand mit kostenfreien Liegen & Badetüchern', 'Großes Hamam & beheiztes Hallenbad inklusive'],
      },
      {
        id: 'ayt-h3',
        name: 'Side Royal Palace & Wellness Grand',
        neighborhood: 'Side-Evrenseki · 150m zur flach abfallenden Strandbucht',
        category: '5★ Luxus-Strandhotel',
        rating: 9.3,
        reviewCount: 990,
        pricePerNightTwoAdults: 82,
        boardType: 'Halbpension',
        cancellation: 'Kostenlos stornierbar',
        distanceToCenterKm: 1.2,
        highlights: ['5★ Komfort zum Nebensaison-Spezialpreis (-38%)', 'Große Wellness- & Saunawelt inklusive', 'Flughafentransfer bequem zubuchbar'],
      },
    ],
    monthlyCalendar: buildCalendarForDestination(48, 42, 12),
    priceHistory30Days: [
      { dayLabel: 'Vor 30T', price: 418 },
      { dayLabel: 'Vor 24T', price: 382 },
      { dayLabel: 'Vor 18T', price: 345 },
      { dayLabel: 'Vor 12T', price: 305 },
      { dayLabel: 'Vor 6T', price: 268 },
      { dayLabel: 'Heute', price: 234 },
    ],
  },
  {
    id: 'izmir-aegaeis',
    city: 'Izmir, Çeşme & Türkische Ägäis',
    country: 'Türkei',
    regionTag: 'Mittelmeer',
    iata: 'ADB',
    tagline: 'Türkisblaue Ägäis-Buchten auf der Çeşme-Halbinsel, Alaçatı-Steinhäuser & antikes Ephesos zum Lira-Vorteil',
    avgTempMayOct: 26,
    mealCostIndex: 7.2,
    localTransitDayPass: 2.2,
    historicalAvgTotal: 410,
    cheapestMonth: 'November & Februar',
    bestBookingLeadWeeks: 5,
    cheapestWeekday: 'Mittwoch',
    svgTheme: {
      primaryFrom: '#164e63',
      primaryTo: '#0891b2',
      accentColor: '#22d3ee',
      landmarkType: 'bosphorus',
    },
    routesByOrigin: buildRoutesForAllHubs('ADB', 'Izmir', 56, 185, 'SunExpress', 'Corendon'),
    hotels: [
      {
        id: 'adb-h1',
        name: 'Kordon Promenade Bay Hotel Izmir',
        neighborhood: 'Alsancak Uferpromenade · Direkt an der Ägäis-Bucht',
        category: '3.5★ City- & Meerblick-Hotel',
        rating: 8.7,
        reviewCount: 620,
        pricePerNightTwoAdults: 44,
        boardType: 'Frühstück inklusive',
        cancellation: 'Nicht erstattbar (Sparpreis)',
        distanceToCenterKm: 0.4,
        highlights: ['Direkte S-Bahn İZBAN vom Flughafen ADB', 'Frühstück mit Blick auf die Bucht von Izmir', 'Fähren & Basar Karşıyaka direkt erreichbar'],
      },
      {
        id: 'adb-h2',
        name: 'Alaçatı & Çeşme Stone Boutique Hotel',
        neighborhood: 'Çeşme / Alaçatı · 10 Min. zum Ilıca-Thermalstrand',
        category: '4★ Ägäis-Boutiquehotel',
        rating: 9.1,
        reviewCount: 540,
        pricePerNightTwoAdults: 60,
        boardType: 'Frühstück inklusive',
        cancellation: 'Kostenlos stornierbar',
        distanceToCenterKm: 0.5,
        highlights: ['Ägäisches Bio-Frühstück im Innenhof unter Bougainvillea', 'Außenpool & windgeschützte Sonnenterrasse', 'Kostenlose Stornierung bis 24h vor Anreise'],
      },
      {
        id: 'adb-h3',
        name: 'Kuşadası Aegean Sea Resort & Thermal Spa',
        neighborhood: 'Kuşadası Küste · Nahe den antiken Stätten von Ephesos',
        category: '4.5★ Strand- & Thermal-Resort',
        rating: 9.2,
        reviewCount: 790,
        pricePerNightTwoAdults: 78,
        boardType: 'Halbpension',
        cancellation: 'Kostenlos stornierbar',
        distanceToCenterKm: 1.1,
        highlights: ['Frühstück & Abendbuffet direkt über dem Meer', 'Natürliche Thermal-Pools & Türkisches Bad', 'Tagesausflüge nach Ephesos & Pamukkale direkt ab Hotel'],
      },
    ],
    monthlyCalendar: buildCalendarForDestination(46, 44, 17),
    priceHistory30Days: [
      { dayLabel: 'Vor 30T', price: 405 },
      { dayLabel: 'Vor 24T', price: 372 },
      { dayLabel: 'Vor 18T', price: 339 },
      { dayLabel: 'Vor 12T', price: 299 },
      { dayLabel: 'Vor 6T', price: 262 },
      { dayLabel: 'Heute', price: 229 },
    ],
  },
  {
    id: 'bodrum-kappadokien',
    city: 'Bodrum & Ägäis-Buchten',
    country: 'Türkei',
    regionTag: 'Mittelmeer',
    iata: 'BJV',
    tagline: 'Weiße Kaskadenhäuser, kristallklare Buchten von Gümbet & Bitez und Kreuzfahrer-Flair zum Nebensaison-Preis',
    avgTempMayOct: 26,
    mealCostIndex: 8.0,
    localTransitDayPass: 2.5,
    historicalAvgTotal: 445,
    cheapestMonth: 'November & Mai',
    bestBookingLeadWeeks: 6,
    cheapestWeekday: 'Dienstag',
    svgTheme: {
      primaryFrom: '#1e3a8a',
      primaryTo: '#0284c7',
      accentColor: '#38bdf8',
      landmarkType: 'cove',
    },
    routesByOrigin: buildRoutesForAllHubs('BJV', 'Bodrum', 64, 190, 'SunExpress', 'Turkish Airlines'),
    hotels: [
      {
        id: 'bjv-h1',
        name: 'Bodrum White Castle View Suites',
        neighborhood: 'Zentrum · 350m zum Kastell St. Peter & Marina',
        category: 'Weiße Ägäis-Studios (Sparpreis)',
        rating: 8.7,
        reviewCount: 480,
        pricePerNightTwoAdults: 46,
        boardType: 'Frühstück inklusive',
        cancellation: 'Nicht erstattbar (Sparpreis)',
        distanceToCenterKm: 0.4,
        highlights: ['Typisch weiße Bodrum-Architektur mit Meerblick', 'Frühstück auf der Panorama-Terrasse inklusive', 'Direkter Havaş-Shuttle vom Flughafen BJV'],
      },
      {
        id: 'bjv-h2',
        name: 'Bitez Bay Mandarin Garden Hotel',
        neighborhood: 'Bitez-Bucht · 100m zum ruhigen Sand-/Kiesstrand',
        category: '4★ Wohlfühl-Hotel',
        rating: 9.0,
        reviewCount: 640,
        pricePerNightTwoAdults: 64,
        boardType: 'Frühstück inklusive',
        cancellation: 'Kostenlos stornierbar',
        distanceToCenterKm: 0.8,
        highlights: ['Ruhige Lage inmitten von Mandarinenhainen', 'Eigener Strandabschnitt mit Liegen inklusive', 'Dolmuş alle 10 Min. in die Altstadt von Bodrum'],
      },
      {
        id: 'bjv-h3',
        name: 'Torba Luxury Cove Resort & Spa',
        neighborhood: 'Torba-Bucht · Privatstrand mit Holzstegen über dem Meer',
        category: '5★ Boutique-Resort',
        rating: 9.3,
        reviewCount: 510,
        pricePerNightTwoAdults: 88,
        boardType: 'Halbpension',
        cancellation: 'Kostenlos stornierbar',
        distanceToCenterKm: 1.5,
        highlights: ['Frühstück & gehobenes Ägäis-Abendbuffet inklusive', 'Beheizter Infinity-Pool & Hamam', 'Sonderkontingent -34% ggü. Einzelbuchung'],
      },
    ],
    monthlyCalendar: buildCalendarForDestination(52, 46, 21),
    priceHistory30Days: [
      { dayLabel: 'Vor 30T', price: 442 },
      { dayLabel: 'Vor 24T', price: 405 },
      { dayLabel: 'Vor 18T', price: 368 },
      { dayLabel: 'Vor 12T', price: 325 },
      { dayLabel: 'Vor 6T', price: 288 },
      { dayLabel: 'Heute', price: 252 },
    ],
  },
  // --- ITALIEN SPEZIAL-ANGEBOTE ---
  {
    id: 'rom-latium',
    city: 'Rom & Latium Küste',
    country: 'Italien',
    regionTag: 'Städtetrip',
    iata: 'FCO',
    tagline: 'Ewige Stadt ohne Warteschlangen: Kolosseum, Trastevere & S-Bahn-Abstecher ans Meer nach Ostia zum Sparpreis',
    avgTempMayOct: 23,
    mealCostIndex: 11.5,
    localTransitDayPass: 7.0,
    historicalAvgTotal: 390,
    cheapestMonth: 'November & Januar',
    bestBookingLeadWeeks: 5,
    cheapestWeekday: 'Dienstag',
    svgTheme: {
      primaryFrom: '#7c2d12',
      primaryTo: '#b45309',
      accentColor: '#fbbf24',
      landmarkType: 'acropolis',
    },
    routesByOrigin: buildRoutesForAllHubs('FCO', 'Rom', 46, 110, 'Ryanair', 'ITA Airways'),
    hotels: [
      {
        id: 'fco-h1',
        name: 'Trastevere Station Smart Rooms',
        neighborhood: 'Trastevere · Direkt an der Flughafen-Bahn FL1',
        category: 'Smart-Guesthouse (Sparpreis)',
        rating: 8.7,
        reviewCount: 890,
        pricePerNightTwoAdults: 54,
        boardType: 'Nur Übernachtung',
        cancellation: 'Nicht erstattbar (Sparpreis)',
        distanceToCenterKm: 0.9,
        highlights: ['Direktzug FL1 ab Flughafen FCO für nur 8 €', 'Mitten im beliebtesten Restaurantviertel Roms', 'Straßenbahn Linie 8 in 8 Min. zur Piazza Venezia'],
      },
      {
        id: 'fco-h2',
        name: 'Hotel Boutique Monti & Colosseo',
        neighborhood: 'Rione Monti · 500m zum Kolosseum & Forum Romanum',
        category: '3.5★ Boutique-Hotel',
        rating: 9.0,
        reviewCount: 740,
        pricePerNightTwoAdults: 74,
        boardType: 'Frühstück inklusive',
        cancellation: 'Kostenlos stornierbar',
        distanceToCenterKm: 0.4,
        highlights: ['Italienisches Frühstück mit Espresso-Bar inklusive', 'Alle Hauptsehenswürdigkeiten bequem zu Fuß erreichbar', 'Kostenlose Stornierung bis 24h vor Anreise'],
      },
      {
        id: 'fco-h3',
        name: 'Grand Palazzo Navona & Rooftop Suites',
        neighborhood: 'Centro Storico · Nahe Pantheon & Piazza Navona',
        category: '4★ Superior Hotel',
        rating: 9.3,
        reviewCount: 520,
        pricePerNightTwoAdults: 96,
        boardType: 'Halbpension',
        cancellation: 'Kostenlos stornierbar',
        distanceToCenterKm: 0.2,
        highlights: ['Frühstück auf der Dachterrasse & 3-Gänge-Abendmenü', 'Historischer Palazzo mit ruhigem Innenhof', 'Sonderkontingent -29% ggü. Einzelbuchung'],
      },
    ],
    monthlyCalendar: buildCalendarForDestination(36, 54, 11),
    priceHistory30Days: [
      { dayLabel: 'Vor 30T', price: 388 },
      { dayLabel: 'Vor 24T', price: 354 },
      { dayLabel: 'Vor 18T', price: 319 },
      { dayLabel: 'Vor 12T', price: 284 },
      { dayLabel: 'Vor 6T', price: 252 },
      { dayLabel: 'Heute', price: 224 },
    ],
  },
  {
    id: 'mailand-comer-see',
    city: 'Mailand & Comer See',
    country: 'Italien',
    regionTag: 'Städtetrip',
    iata: 'BGY',
    tagline: 'Extrem günstige Flüge nach Mailand-Bergamo kombiniert mit 40-Minuten-Regionalbahn direkt an den Comer See',
    avgTempMayOct: 21,
    mealCostIndex: 12.0,
    localTransitDayPass: 6.5,
    historicalAvgTotal: 365,
    cheapestMonth: 'November & Februar',
    bestBookingLeadWeeks: 4,
    cheapestWeekday: 'Dienstag',
    svgTheme: {
      primaryFrom: '#0f172a',
      primaryTo: '#1d4ed8',
      accentColor: '#38bdf8',
      landmarkType: 'tram',
    },
    routesByOrigin: buildRoutesForAllHubs('BGY', 'Mailand', 32, 75, 'Ryanair', 'ITA Airways'),
    hotels: [
      {
        id: 'bgy-h1',
        name: 'Navigli Design Studios Milano',
        neighborhood: 'Navigli Kanalviertel · 300m zur Metro Porta Genova',
        category: 'Smart-Aparthotel (Sparpreis)',
        rating: 8.7,
        reviewCount: 810,
        pricePerNightTwoAdults: 56,
        boardType: 'Nur Übernachtung',
        cancellation: 'Nicht erstattbar (Sparpreis)',
        distanceToCenterKm: 0.8,
        highlights: ['Direkt im historischen Kanalviertel mit Aperitivo-Bars', 'Moderne Kitchenette & schnelles WLAN', '10 Min. mit der Straßenbahn zum Mailänder Dom'],
      },
      {
        id: 'bgy-h2',
        name: 'Hotel Lago di Como & Bellagio Ferry View',
        neighborhood: 'Como / Lecco Seeufer · 200m zum Fähranleger',
        category: '3.5★ Seehotel',
        rating: 9.0,
        reviewCount: 670,
        pricePerNightTwoAdults: 74,
        boardType: 'Frühstück inklusive',
        cancellation: 'Kostenlos stornierbar',
        distanceToCenterKm: 0.3,
        highlights: ['Frühstücksbuffet mit Blick auf den Comer See', 'Direktzug ab Milano Centrale in 39 Min. (5,20 €)', 'Kostenlose Stornierung bis 24h vor Anreise'],
      },
      {
        id: 'bgy-h3',
        name: 'Villa Lario Panorama Resort & Spa',
        neighborhood: 'Comer See Westufer · Parkanlage direkt am Wasser',
        category: '4★ Superior Villa-Hotel',
        rating: 9.3,
        reviewCount: 450,
        pricePerNightTwoAdults: 98,
        boardType: 'Halbpension',
        cancellation: 'Kostenlos stornierbar',
        distanceToCenterKm: 0.6,
        highlights: ['Frühstück & lombardisches 3-Gänge-Abendmenü', 'Beheizter Panorama-Pool über dem See', 'Sonderkontingent -32% in der Nebensaison'],
      },
    ],
    monthlyCalendar: buildCalendarForDestination(26, 56, 7),
    priceHistory30Days: [
      { dayLabel: 'Vor 30T', price: 360 },
      { dayLabel: 'Vor 24T', price: 328 },
      { dayLabel: 'Vor 18T', price: 295 },
      { dayLabel: 'Vor 12T', price: 264 },
      { dayLabel: 'Vor 6T', price: 232 },
      { dayLabel: 'Heute', price: 199 },
    ],
  },
  {
    id: 'neapel-amalfi',
    city: 'Neapel, Sorrent & Amalfiküste',
    country: 'Italien',
    regionTag: 'Mittelmeer',
    iata: 'NAP',
    tagline: 'Pompeji, Capri-Fähren, Zitronenhaine in Sorrent & die spektakuläre Amalfiküste ohne Hochsaison-Aufschlag',
    avgTempMayOct: 24,
    mealCostIndex: 9.5,
    localTransitDayPass: 4.5,
    historicalAvgTotal: 415,
    cheapestMonth: 'November & März',
    bestBookingLeadWeeks: 5,
    cheapestWeekday: 'Mittwoch',
    svgTheme: {
      primaryFrom: '#0c4a6e',
      primaryTo: '#0284c7',
      accentColor: '#facc15',
      landmarkType: 'cove',
    },
    routesByOrigin: buildRoutesForAllHubs('NAP', 'Neapel', 48, 120, 'Ryanair', 'EasyJet'),
    hotels: [
      {
        id: 'nap-h1',
        name: 'Santa Lucia Bay & Castel dell’Ovo Rooms',
        neighborhood: 'Neapel Uferpromenade · 400m zur Piazza del Plebiscito',
        category: 'Boutique-Guesthouse (Sparpreis)',
        rating: 8.8,
        reviewCount: 760,
        pricePerNightTwoAdults: 50,
        boardType: 'Frühstück inklusive',
        cancellation: 'Nicht erstattbar (Sparpreis)',
        distanceToCenterKm: 0.4,
        highlights: ['Alibus direkt vom Flughafen NAP bis zum Hafen Beverello', 'Original neapolitanisches Frühstück inklusive', 'Fähren nach Capri & Ischia in 5 Gehminuten'],
      },
      {
        id: 'nap-h2',
        name: 'Hotel Sorrento Lemon Cliff & Sea View',
        neighborhood: 'Sorrento Küste · Mit Blick auf den Golf von Neapel & Vesuv',
        category: '4★ Panorama-Hotel',
        rating: 9.1,
        reviewCount: 890,
        pricePerNightTwoAdults: 70,
        boardType: 'Frühstück inklusive',
        cancellation: 'Kostenlos stornierbar',
        distanceToCenterKm: 0.6,
        highlights: ['Frühstücksterrasse über den Klippen von Sorrent', 'Idealer Startpunkt für Positano, Amalfi & Pompeji', 'Kostenlose Stornierung bis 24h vor Anreise'],
      },
      {
        id: 'nap-h3',
        name: 'Grand Hotel Amalfi Coast & Ravello Gardens',
        neighborhood: 'Amalfiküste · Terrassenlage direkt über dem Meer',
        category: '4.5★ Küsten-Resort',
        rating: 9.3,
        reviewCount: 540,
        pricePerNightTwoAdults: 94,
        boardType: 'Halbpension',
        cancellation: 'Kostenlos stornierbar',
        distanceToCenterKm: 0.8,
        highlights: ['Frühstück & süditalienisches Abendmenü mit Meerblick', 'Panorama-Pool in historischem Zitronengarten', 'Sonderkontingent -35% ggü. Sommerpreisen'],
      },
    ],
    monthlyCalendar: buildCalendarForDestination(38, 50, 14),
    priceHistory30Days: [
      { dayLabel: 'Vor 30T', price: 412 },
      { dayLabel: 'Vor 24T', price: 376 },
      { dayLabel: 'Vor 18T', price: 342 },
      { dayLabel: 'Vor 12T', price: 304 },
      { dayLabel: 'Vor 6T', price: 268 },
      { dayLabel: 'Heute', price: 232 },
    ],
  },
  {
    id: 'sizilien-catania',
    city: 'Sizilien, Taormina & Ätna',
    country: 'Italien',
    regionTag: 'Mittelmeer',
    iata: 'CTA',
    tagline: 'Spätsommer-Wärme in Süditalien: Barockstadt Catania, griechisches Theater in Taormina & Küstenstrände',
    avgTempMayOct: 25,
    mealCostIndex: 9.0,
    localTransitDayPass: 4.0,
    historicalAvgTotal: 425,
    cheapestMonth: 'November & Februar',
    bestBookingLeadWeeks: 5,
    cheapestWeekday: 'Dienstag',
    svgTheme: {
      primaryFrom: '#7f1d1d',
      primaryTo: '#ea580c',
      accentColor: '#fbbf24',
      landmarkType: 'canary_volcano',
    },
    routesByOrigin: buildRoutesForAllHubs('CTA', 'Catania', 54, 145, 'Ryanair', 'Eurowings'),
    hotels: [
      {
        id: 'cta-h1',
        name: 'Via Etnea Baroque Suites Catania',
        neighborhood: 'Catania Altstadt · 300m zum Domplatz & Fischmarkt',
        category: 'Barock-Aparthotel (Sparpreis)',
        rating: 8.8,
        reviewCount: 680,
        pricePerNightTwoAdults: 48,
        boardType: 'Frühstück inklusive',
        cancellation: 'Nicht erstattbar (Sparpreis)',
        distanceToCenterKm: 0.3,
        highlights: ['Alibus vom Flughafen CTA in 15 Min. direkt vor das Haus', 'Sizilianisches Frühstück mit Cannoli & Granita', 'Direktzug nach Taormina & Syrakus ab Hauptbahnhof'],
      },
      {
        id: 'cta-h2',
        name: 'Giardini Naxos & Taormina Bay Hotel',
        neighborhood: 'Bucht von Taormina · Direkt an der Strandpromenade',
        category: '4★ Strandhotel',
        rating: 9.0,
        reviewCount: 820,
        pricePerNightTwoAdults: 66,
        boardType: 'Frühstück inklusive',
        cancellation: 'Kostenlos stornierbar',
        distanceToCenterKm: 0.5,
        highlights: ['Freier Blick auf den Ätna und die Bucht von Taormina', 'Direkt am Strand von Giardini Naxos gelegen', 'Kostenlose Stornierung bis 24h vor Anreise'],
      },
      {
        id: 'cta-h3',
        name: 'Taormina Panoramic Cliff Resort & Spa',
        neighborhood: 'Taormina Mare / Isola Bella · Über der Felsenbucht',
        category: '4.5★ Panorama-Resort',
        rating: 9.3,
        reviewCount: 590,
        pricePerNightTwoAdults: 90,
        boardType: 'Halbpension',
        cancellation: 'Kostenlos stornierbar',
        distanceToCenterKm: 0.7,
        highlights: ['Frühstück & sizilianisches 4-Gänge-Abendmenü', 'Seilbahn in die Altstadt von Taormina direkt nebenan', 'Sonderkontingent -33% in der Vor- und Nachsaison'],
      },
    ],
    monthlyCalendar: buildCalendarForDestination(42, 48, 22),
    priceHistory30Days: [
      { dayLabel: 'Vor 30T', price: 420 },
      { dayLabel: 'Vor 24T', price: 385 },
      { dayLabel: 'Vor 18T', price: 348 },
      { dayLabel: 'Vor 12T', price: 308 },
      { dayLabel: 'Vor 6T', price: 272 },
      { dayLabel: 'Heute', price: 236 },
    ],
  },
];

const KNOWN_GLOBAL_DESTINATIONS: Record<
  string,
  {
    city: string;
    country: string;
    iata: string;
    regionTag: DestinationDeal['regionTag'];
    baseFlight: number;
    baseHotel: number;
    durationMin: number;
    temp: number;
    mealEur: number;
    transitEur: number;
    lcc: string;
    legacy: string;
    currency: UserCurrencyCode;
    fxTip: string;
  }
> = {
  barcelona: {
    city: 'Barcelona & Costa Brava',
    country: 'Spanien',
    iata: 'BCN',
    regionTag: 'Mittelmeer',
    baseFlight: 54,
    baseHotel: 62,
    durationMin: 130,
    temp: 22,
    mealEur: 13.5,
    transitEur: 5.5,
    lcc: 'Vueling',
    legacy: 'Lufthansa',
    currency: 'EUR',
    fxTip: 'Euroraum: Mit dem T-Casual 10er-Ticket fahren Sie inkl. Flughafen-Zug R2 Nord für nur 1,22 € pro Fahrt.',
  },
  rom: {
    city: 'Rom & Latium Küste',
    country: 'Italien',
    iata: 'FCO',
    regionTag: 'Städtetrip',
    baseFlight: 49,
    baseHotel: 58,
    durationMin: 115,
    temp: 23,
    mealEur: 12.5,
    transitEur: 7.0,
    lcc: 'Ryanair',
    legacy: 'ITA Airways',
    currency: 'EUR',
    fxTip: 'Spartipp Rom: Der Regionalzug FL1 ab Fiumicino nach Trastevere kostet 8 € statt 14 € für den Leonardo Express.',
  },
  london: {
    city: 'London & Westminster',
    country: 'Großbritannien',
    iata: 'STN',
    regionTag: 'Städtetrip',
    baseFlight: 38,
    baseHotel: 76,
    durationMin: 95,
    temp: 17,
    mealEur: 15.0,
    transitEur: 9.5,
    lcc: 'Ryanair',
    legacy: 'British Airways',
    currency: 'GBP',
    fxTip: 'Währungs-Tipp: In der Tube & im Bus direkt kontaktlos mit Kreditkarte in GBP („Contactless Cap“) zahlen statt Oyster-Card kaufen.',
  },
  paris: {
    city: 'Paris & Île-de-France',
    country: 'Frankreich',
    iata: 'BVA',
    regionTag: 'Städtetrip',
    baseFlight: 46,
    baseHotel: 68,
    durationMin: 85,
    temp: 19,
    mealEur: 14.5,
    transitEur: 8.4,
    lcc: 'EasyJet',
    legacy: 'Air France',
    currency: 'EUR',
    fxTip: 'Euroraum: Mittagsmenüs („Formule Midi“) in Bistros sparen bis zu 40 % gegenüber dem Abendkartenpreis.',
  },
  amsterdam: {
    city: 'Amsterdam & Nordholland',
    country: 'Niederlande',
    iata: 'AMS',
    regionTag: 'Städtetrip',
    baseFlight: 58,
    baseHotel: 74,
    durationMin: 75,
    temp: 18,
    mealEur: 15.0,
    transitEur: 9.0,
    lcc: 'EasyJet',
    legacy: 'KLM',
    currency: 'EUR',
    fxTip: 'Sprinter-Zug vom Flughafen Schiphol zum Hauptbahnhof dauert nur 14 Minuten (4,90 €).',
  },
  prag: {
    city: 'Prag & Moldau-Altstadt',
    country: 'Tschechien',
    iata: 'PRG',
    regionTag: 'Balkan & Osteuropa',
    baseFlight: 42,
    baseHotel: 44,
    durationMin: 70,
    temp: 19,
    mealEur: 8.5,
    transitEur: 4.8,
    lcc: 'Eurowings',
    legacy: 'Lufthansa',
    currency: 'EUR',
    fxTip: 'In Prag niemals auf der Straße wechseln – im Restaurant immer Kartenzahlung in CZK (ohne DCC-Euro-Umrechnung) wählen.',
  },
  teneriffa: {
    city: 'Teneriffa & Costa Adeje',
    country: 'Spanien (Kanaren)',
    iata: 'TFS',
    regionTag: 'Atlantik & Inseln',
    baseFlight: 84,
    baseHotel: 58,
    durationMin: 270,
    temp: 26,
    mealEur: 11.0,
    transitEur: 5.0,
    lcc: 'Ryanair',
    legacy: 'Condor',
    currency: 'EUR',
    fxTip: 'Kanaren-Sondersteuerzone (IGIC nur 7 % statt 21 % MwSt.): Mietwagen & Gastronomie sind deutlich günstiger als auf dem Festland.',
  },
  gran_canaria: {
    city: 'Gran Canaria & Maspalomas',
    country: 'Spanien (Kanaren)',
    iata: 'LPA',
    regionTag: 'Atlantik & Inseln',
    baseFlight: 82,
    baseHotel: 56,
    durationMin: 265,
    temp: 26,
    mealEur: 11.0,
    transitEur: 5.0,
    lcc: 'Ryanair',
    legacy: 'Eurowings',
    currency: 'EUR',
    fxTip: 'Global-Bus 60 fährt für 2,95 € direkt vom Flughafen LPA nach Las Palmas oder Bus 66 für 3,50 € nach Maspalomas.',
  },
  antalya: {
    city: 'Antalya & Türkische Riviera',
    country: 'Türkei',
    iata: 'AYT',
    regionTag: 'Mittelmeer',
    baseFlight: 68,
    baseHotel: 42,
    durationMin: 205,
    temp: 27,
    mealEur: 7.5,
    transitEur: 2.5,
    lcc: 'SunExpress',
    legacy: 'Turkish Airlines',
    currency: 'TRY',
    fxTip: 'Die moderne Straßenbahn AntRay fährt direkt vom Flughafen-Terminal für unter 0,80 € in die Altstadt Kaleiçi.',
  },
  hurghada: {
    city: 'Hurghada & Rotes Meer',
    country: 'Ägypten',
    iata: 'HRG',
    regionTag: 'Fernreise-Budget',
    baseFlight: 96,
    baseHotel: 46,
    durationMin: 265,
    temp: 29,
    mealEur: 6.5,
    transitEur: 2.5,
    lcc: 'EasyJet',
    legacy: 'Condor',
    currency: 'USD',
    fxTip: 'Visum am Flughafen-Bankschalter für exakt 25 USD kaufen statt 35 € bei Reiseleitern.',
  },
  dubai: {
    city: 'Dubai & Creek Marina',
    country: 'Vereinigte Arabische Emirate',
    iata: 'DXB',
    regionTag: 'Fernreise-Budget',
    baseFlight: 158,
    baseHotel: 68,
    durationMin: 365,
    temp: 31,
    mealEur: 11.5,
    transitEur: 5.5,
    lcc: 'Eurowings',
    legacy: 'Emirates',
    currency: 'USD',
    fxTip: 'Hotels in Deira & Al Barsha direkt an der Red Line Metro sind bis zu 55 % günstiger als Strandhotels auf der Palm.',
  },
  bangkok: {
    city: 'Bangkok & Golf von Thailand',
    country: 'Thailand',
    iata: 'BKK',
    regionTag: 'Fernreise-Budget',
    baseFlight: 540,
    baseHotel: 66,
    durationMin: 640,
    temp: 30,
    mealEur: 4.5,
    transitEur: 3.2,
    lcc: 'Scoot / Norse',
    legacy: 'Thai Airways / Lufthansa',
    currency: 'USD',
    fxTip: 'Airport Rail Link vom Flughafen Suvarnabhumi ins Zentrum Phaya Thai kostet nur 45 Baht (ca. 1,20 €).',
  },
  new_york: {
    city: 'New York City & Manhattan',
    country: 'USA',
    iata: 'JFK',
    regionTag: 'Fernreise-Budget',
    baseFlight: 420,
    baseHotel: 118,
    durationMin: 505,
    temp: 20,
    mealEur: 16.5,
    transitEur: 8.5,
    lcc: 'Norse Atlantic',
    legacy: 'Lufthansa / Delta',
    currency: 'USD',
    fxTip: 'Hotels in Long Island City (Queens) liegen nur 1 U-Bahn-Station von Midtown Manhattan entfernt und sparen 35–45 % Übernachtungskosten.',
  },
  tokio: {
    city: 'Tokio & Kanto-Region',
    country: 'Japan',
    iata: 'HND',
    regionTag: 'Fernreise-Budget',
    baseFlight: 285,
    baseHotel: 56,
    durationMin: 710,
    temp: 21,
    mealEur: 8.0,
    transitEur: 5.2,
    lcc: 'Zipair / Scoot',
    legacy: 'ANA / Lufthansa',
    currency: 'USD',
    fxTip: 'Durch den historisch günstigen Yen-Kurs sind Business-Hotels (APA / Sotetsu Fresa) und Restaurants in Tokio aktuell extrem preiswert.',
  },
  mailand: {
    city: 'Mailand & Comer See',
    country: 'Italien',
    iata: 'BGY',
    regionTag: 'Städtetrip',
    baseFlight: 32,
    baseHotel: 62,
    durationMin: 75,
    temp: 21,
    mealEur: 13.0,
    transitEur: 6.5,
    lcc: 'Ryanair',
    legacy: 'ITA Airways',
    currency: 'EUR',
    fxTip: 'Ab Bergamo (BGY) fährt der Regionalzug ab Bahnhof Bergamo für 6,00 € direkt nach Milano Centrale und weiter an den Comer See.',
  },
  split: {
    city: 'Split & Dalmatinische Inseln',
    country: 'Kroatien',
    iata: 'SPU',
    regionTag: 'Balkan & Osteuropa',
    baseFlight: 48,
    baseHotel: 49,
    durationMin: 100,
    temp: 24,
    mealEur: 11.0,
    transitEur: 4.5,
    lcc: 'Wizz Air',
    legacy: 'Croatia Airlines',
    currency: 'EUR',
    fxTip: 'Kroatien nutzt den Euro – Linienbus 37 fährt direkt vor dem Terminal für 4,00 € nach Trogir und Split.',
  },
};

export function createCustomDestinationDeal(rawQuery: string): DestinationDeal {
  const clean = rawQuery.trim();
  const normalized = clean
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/\s+/g, '_');

  // Check if query matches one of our known global destinations
  const matchedKey = Object.keys(KNOWN_GLOBAL_DESTINATIONS).find(
    (k) =>
      normalized.includes(k) ||
      k.includes(normalized) ||
      KNOWN_GLOBAL_DESTINATIONS[k].city.toLowerCase().includes(clean.toLowerCase()) ||
      KNOWN_GLOBAL_DESTINATIONS[k].country.toLowerCase().includes(clean.toLowerCase()) ||
      KNOWN_GLOBAL_DESTINATIONS[k].iata.toLowerCase() === clean.toLowerCase()
  );

  const preset = matchedKey ? KNOWN_GLOBAL_DESTINATIONS[matchedKey] : null;

  // Deterministic seed from query string
  let hash = 0;
  for (let i = 0; i < clean.length; i++) {
    hash = (hash * 31 + clean.charCodeAt(i)) % 10000;
  }

  const displayTitle = preset
    ? preset.city
    : clean.charAt(0).toUpperCase() + clean.slice(1);
  const country = preset ? preset.country : 'Individuelle Tiefpreis-Suche';
  const iata = preset
    ? preset.iata
    : clean
        .replace(/[^a-zA-Z]/g, '')
        .slice(0, 3)
        .toUpperCase()
        .padEnd(3, 'X');
  const baseFlight = preset ? preset.baseFlight : 48 + (hash % 55);
  const baseHotel = preset ? preset.baseHotel : 46 + (hash % 32);
  const durationMin = preset ? preset.durationMin : 115 + (hash % 95);
  const lcc = preset ? preset.lcc : 'Ryanair / Eurowings';
  const legacy = preset ? preset.legacy : 'Lufthansa';

  const id = `custom-${normalized.replace(/[^a-z0-9]/g, '-')}`;

  // Register local currency tip dynamically
  DESTINATION_LOCAL_CURRENCY[id] = {
    code: preset ? preset.currency : 'EUR',
    name: preset ? SUPPORTED_CURRENCIES[preset.currency].name : 'Euro (EUR)',
    fxSavingTip: preset
      ? preset.fxTip
      : `Währungs-Tipp für ${displayTitle}: Zahlen Sie vor Ort am Kartenterminal immer in der Landeswährung ohne Sofort-Umrechnung (DCC), um 5–8 % Bankaufschlag zu sparen.`,
  };

  const historicalAvg = Math.round((baseFlight + baseHotel * 4) * 1.38);

  return {
    id,
    city: displayTitle,
    country,
    regionTag: preset ? preset.regionTag : 'Städtetrip',
    iata,
    tagline: `Live berechnete Tiefpreis-Kombination für ${displayTitle} inkl. Nachbarflughafen- & Split-Ticket-Prüfung`,
    avgTempMayOct: preset ? preset.temp : 21 + (hash % 6),
    mealCostIndex: preset ? preset.mealEur : 9.5 + (hash % 5),
    localTransitDayPass: preset ? preset.transitEur : 4.5,
    historicalAvgTotal: historicalAvg,
    cheapestMonth: 'November & Januar',
    bestBookingLeadWeeks: 5,
    cheapestWeekday: 'Dienstag',
    svgTheme: {
      primaryFrom: '#0f172a',
      primaryTo: '#1d4ed8',
      accentColor: '#38bdf8',
      landmarkType: 'cove',
    },
    routesByOrigin: buildRoutesForAllHubs(
      iata,
      displayTitle.split(' ')[0],
      baseFlight,
      durationMin,
      lcc,
      legacy
    ),
    hotels: [
      {
        id: `${id}-h1`,
        name: `3★–4★ Hotels & Studios in ${displayTitle.split(' ')[0]} (Live-Auswahl)`,
        neighborhood: 'Zentrale Lage · Direkte ÖPNV-Anbindung',
        category: '3★–4★ Hotels & Aparthotels (Live-Suche)',
        rating: 8.7,
        reviewCount: 540 + (hash % 400),
        pricePerNightTwoAdults: baseHotel,
        boardType: 'Nur Übernachtung',
        cancellation: 'Nicht erstattbar (Sparpreis)',
        distanceToCenterKm: 0.5,
        highlights: [
          'Live-Verfügbarkeit aller freien Unterkünfte beim Partner',
          'Direkte ÖPNV-Anbindung vom Flughafen ins Zentrum',
          'Freie Hotelwahl nach Bewertung & Lage auf der Partnerseite',
        ],
      },
      {
        id: `${id}-h2`,
        name: `4★ Komfort-Hotels in ${displayTitle.split(' ')[0]} inkl. Frühstück`,
        neighborhood: 'Zentrum / Strandnähe · Top-Bewertung',
        category: '4★ Komfort-Hotels (Live-Suche)',
        rating: 9.0,
        reviewCount: 720 + (hash % 300),
        pricePerNightTwoAdults: Math.round(baseHotel * 1.28),
        boardType: 'Frühstück inklusive',
        cancellation: 'Kostenlos stornierbar',
        distanceToCenterKm: 0.4,
        highlights: [
          'Frühstücksbuffet & flexible Stornierungsoptionen wählbar',
          'Tagesaktuelle Sonderpreise direkt beim Partner',
          'Hunderte echte Gästebewertungen im Live-Vergleich',
        ],
      },
      {
        id: `${id}-h3`,
        name: `4.5★–5★ Resorts & Boutique-Hotels in ${displayTitle.split(' ')[0]}`,
        neighborhood: 'Premium-Lage · Pool & Wellness',
        category: '4.5★–5★ Superior & Resorts (Live-Suche)',
        rating: 9.3,
        reviewCount: 410 + (hash % 250),
        pricePerNightTwoAdults: Math.round(baseHotel * 1.65),
        boardType: 'Halbpension',
        cancellation: 'Kostenlos stornierbar',
        distanceToCenterKm: 1.2,
        highlights: [
          'Gehobene Resorts mit Pool, Wellness & Halbpension',
          'Tagesaktuelle Paket- und Hotelpreise beim Partner',
          'Freie Auswahl im Live-Suchergebnis',
        ],
      },
    ],
    monthlyCalendar: buildCalendarForDestination(
      Math.round(baseFlight * 0.72),
      baseHotel,
      hash % 25
    ),
    priceHistory30Days: [
      { dayLabel: 'Vor 30T', price: Math.round(historicalAvg * 0.96) },
      { dayLabel: 'Vor 24T', price: Math.round(historicalAvg * 0.9) },
      { dayLabel: 'Vor 18T', price: Math.round(historicalAvg * 0.84) },
      { dayLabel: 'Vor 12T', price: Math.round(historicalAvg * 0.77) },
      { dayLabel: 'Vor 6T', price: Math.round(historicalAvg * 0.71) },
      { dayLabel: 'Heute', price: Math.round(historicalAvg * 0.65) },
    ],
  };
}

