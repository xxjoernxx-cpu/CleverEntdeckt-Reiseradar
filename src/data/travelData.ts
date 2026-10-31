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
];

export const DEFAULT_AFFILIATE_CONFIG: AffiliatePartnerConfig = {
  travelpayoutsMarker: '771810', // User's official Travelpayouts Marker-ID (771810 / trs=568370) pre-configured
  bookingAid: '',
  awinPublisherId: '3034525', // User's official Awin Publisher ID (r=3034525) pre-configured
  customExpediaUrl: '1100l6tjov', // User's official Expedia Partnerize camref (1100l6tjov) pre-configured
  customDiscoverCarsUrl: 'https://www.discovercars.com/de?a_aid=CleverEntdeckt&a_bid=61a4ac81', // User's official DiscoverCars Affiliate Link pre-configured
  customCheck24Url: '1176801', // User's official Check24 Partner/Widget ID 1176801 pre-configured
  customBookingUrl: '',
  customSkyscannerUrl: '',
  customAbInDenUrlaubUrl: 'https://www.awin1.com/cread.php?s=2307983&v=9369&q=339342&r=3034525', // User's official Ab in den Urlaub Awin Link pre-configured
  customTripComUrl: 'https://de.trip.com/?Allianceid=10486295&SID=330669011&locale=de_de', // User's official Trip.com Affiliate Link (Allianceid=10486295, SID=330669011) pre-configured
  customSnowTrexUrl: 'https://www.awin1.com/cread.php?s=4805736&v=126961&q=607249&r=3034525', // User's official ASI Reisen Berg- & Aktivreisen Awin Link pre-configured
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
        customSnowTrexUrl: parsed?.customSnowTrexUrl?.trim()
          ? parsed.customSnowTrexUrl
          : 'https://www.awin1.com/cread.php?s=4805736&v=126961&q=607249&r=3034525',
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
  const expediaCamrefMatch =
    input.match(/data-camref=["']([^"']+)["']/i) ||
    input.match(/camref[:=]([a-zA-Z0-9_-]+)/i) ||
    (providerDomainKeyword.toLowerCase() === 'expedia' && /^[a-z0-9]{7,15}$/i.test(input)
      ? [input, input]
      : null);
  if (expediaCamrefMatch && expediaCamrefMatch[1]) {
    const camref = expediaCamrefMatch[1].trim();
    const sep = defaultDeepUrl.includes('?') ? '&' : '?';
    const deepWithParams = `${defaultDeepUrl}${sep}affcid=DE.DIRECT.PZ.${encodeURIComponent(camref)}&camref=${encodeURIComponent(camref)}`;
    return `https://prf.hn/click/camref:${encodeURIComponent(camref)}/destination:${encodeURIComponent(deepWithParams)}`;
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

    // Case 2a: Awin cread.php wrapper without ued destination -> attach deep search URL automatically when target merchant matches defaultDeepUrl domain
    if (
      parsedCustom.hostname.includes('awin1.com') &&
      !parsedCustom.searchParams.has('ued') &&
      !defaultDeepUrl.includes('awin1.com')
    ) {
      const awinMerchantId = parsedCustom.searchParams.get('v') || parsedCustom.searchParams.get('awinmid') || '';
      if (
        (awinMerchantId === '9369' && defaultDeepUrl.includes('ab-in-den-urlaub')) ||
        parsedCustom.searchParams.has('awinmid')
      ) {
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
}): ProviderBookingLinks {
  const {
    originCode,
    destCode,
    destCity,
    hotelName,
    carrierName,
    departureDateStr,
    durationNights,
    travelers,
    userCurrency,
    affiliateConfig,
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

  // Format DDMM for Aviasales
  const outParts = departureDateStr.split('-');
  const inParts = returnDateStr.split('-');
  const aviaOut = outParts.length === 3 ? `${outParts[2]}${outParts[1]}` : '1711';
  const aviaIn = inParts.length === 3 ? `${inParts[2]}${inParts[1]}` : '2111';

  // Trip.com Deep Link (Flights + Hotels)
  const hasDirectTripCom = Boolean(aff.customTripComUrl?.trim());
  const baseTripComUrl = `https://de.trip.com/flights/${originCode.toLowerCase()}-to-${destCode.toLowerCase()}/tickets-${originCode.toLowerCase()}-${destCode.toLowerCase()}?dcity=${originCode.toLowerCase()}&acity=${destCode.toLowerCase()}&ddate=${departureDateStr}&rdate=${returnDateStr}&flighttype=rt&class=y&quantity=${travelers}`;
  const tripComUrl = resolveCustomAffiliateUrl(
    aff.customTripComUrl,
    baseTripComUrl,
    'trip.com',
    'allianceid'
  );

  // Expedia Flight Search Deep Link (via Partnerize camref:1100l6tjov)
  const baseExpediaFlightUrl = `https://www.expedia.de/Flights-Search?trip=roundtrip&leg1=from:${encodeURIComponent(originCode)},to:${encodeURIComponent(destCode)},departure:${departureDateStr}TANYT&leg2=from:${encodeURIComponent(destCode)},to:${encodeURIComponent(originCode)},departure:${returnDateStr}TANYT&passengers=adults:${travelers}&mode=search`;
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
  const baseAviasalesUrl = `https://www.aviasales.com/search/${originCode.toUpperCase()}${aviaOut}${destCode.toUpperCase()}${aviaIn}${travelers}?currency=${userCurrency.toLowerCase()}${marker ? `&marker=${encodeURIComponent(marker)}` : ''}`;
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
    : hasDirectTripCom
    ? tripComUrl
    : expediaFlightUrl;

  // Map secondary flight links directly to the user's real flight partners (Expedia & Trip.com)
  const kayakFlightUrl = expediaFlightUrl;
  const googleFlightsUrl = tripComUrl;
  const airlineDirectUrl = tripComUrl;

  // 5. Expedia Flight + Hotel Package search (Direct Expedia Link has 100% priority)
  const hasDirectExpedia = Boolean(aff.customExpediaUrl?.trim());
  const baseExpediaUrl = `https://www.expedia.de/Hotel-Search?destination=${encodeURIComponent(cleanCity)}&startDate=${departureDateStr}&endDate=${returnDateStr}&adults=${travelers}${hasDirectExpedia ? '' : markerSuffix}`;
  const expediaPackageUrl = resolveCustomAffiliateUrl(
    aff.customExpediaUrl,
    baseExpediaUrl,
    'expedia',
    'affcid'
  );

  // 6. Booking.com (Only if user explicitly configured a Booking.com link/AID; otherwise falls back to Expedia Hotel partner link)
  const rooms = Math.max(1, Math.ceil(travelers / 2));
  const bookingSearchQuery = encodeURIComponent(`${hotelName} ${cleanCity}`);
  const hasDirectBooking = Boolean(aff.customBookingUrl?.trim() || aid);
  const baseBookingHotelUrl = `https://www.booking.com/searchresults.de.html?ss=${bookingSearchQuery}&checkin=${departureDateStr}&checkout=${returnDateStr}&group_adults=${travelers}&no_rooms=${rooms}&selected_currency=${userCurrency}${aidSuffix}`;
  const bookingHotelUrl = hasDirectBooking
    ? resolveCustomAffiliateUrl(aff.customBookingUrl, baseBookingHotelUrl, 'booking.com', 'aid')
    : expediaPackageUrl;

  const trivagoHotelUrl = expediaPackageUrl;

  // 8. Check24 Pauschalreise comparison (Direct Check24 Link has 100% priority)
  const hasDirectCheck24 = Boolean(aff.customCheck24Url?.trim());
  const baseCheck24Url = `https://urlaub.check24.de/suche/hotel?search=${encodeURIComponent(cleanCity)}&departureDate=${departureDateStr}&returnDate=${returnDateStr}&adultCount=${travelers}${hasDirectCheck24 ? '' : awinSuffix}`;
  const check24HolidayUrl = resolveCustomAffiliateUrl(
    aff.customCheck24Url,
    baseCheck24Url,
    'check24',
    'partnerid'
  );

  // 8b. Ab in den Urlaub Pauschalreise & Last-Minute Deep Link
  const hasDirectAbInDenUrlaub = Boolean(aff.customAbInDenUrlaubUrl?.trim());
  const baseAbInDenUrlaubUrl = `https://www.ab-in-den-urlaub.de/suche?search=${encodeURIComponent(cleanCity)}&depDate=${departureDateStr}&retDate=${returnDateStr}&adults=${travelers}`;
  const abInDenUrlaubUrl = resolveCustomAffiliateUrl(
    aff.customAbInDenUrlaubUrl,
    baseAbInDenUrlaubUrl,
    'ab-in-den-urlaub',
    'partnerid'
  );

  // 8c. ASI Reisen (Rund-, Berg- & Aktivreisen via Awin v=126961)
  const hasDirectSnowTrex = Boolean(aff.customSnowTrexUrl?.trim());
  const baseSnowTrexUrl = `https://www.asi-reisen.de/`;
  const snowTrexUrl = resolveCustomAffiliateUrl(
    aff.customSnowTrexUrl,
    baseSnowTrexUrl,
    'asi-reisen',
    'partnerid'
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
  const esimDataUrl = klookActivitiesUrl;
  const flightCompensationUrl = snowTrexUrl;

  // 11. Smart Single-Button Best-Price Router ("1 Button zum günstigsten Anbieter inkl. aktivem Affiliate-Link")
  // Strictly uses ONLY the user's real affiliate partners
  const citySeed = cleanCity
    .split('')
    .reduce((acc, ch, idx) => acc + ch.charCodeAt(0) * (idx + 1), 0);
  const isBeachHolidayDest = ['PMI', 'AYT', 'HRG', 'RAK', 'LPA', 'SPU', 'RHO', 'HER', 'FAO'].includes(
    destCode.toUpperCase()
  );
  const isLongHaulOrCityDest = ['BKK', 'JFK', 'DXB', 'LIS', 'BUD', 'KRK', 'SAW', 'ATH', 'BCN', 'ROM'].includes(
    destCode.toUpperCase()
  );
  const cityLower = destCity.toLowerCase();
  const isWinterOrMountainDest =
    ['INN', 'SZG', 'ZRH', 'GVA', 'TAT', 'KLU', 'BGY', 'TRN'].includes(destCode.toUpperCase()) ||
    cityLower.includes('tirol') ||
    cityLower.includes('alpen') ||
    cityLower.includes('tatra') ||
    cityLower.includes('ski') ||
    cityLower.includes('innsbruck') ||
    cityLower.includes('salzburg');

  const candidateOffers: {
    id: string;
    providerShortName: string;
    name: string;
    url: string;
    hasActiveAffiliate: boolean;
    rawRankScore: number;
  }[] = [
    {
      id: 'expedia',
      providerShortName: 'Expedia',
      name: 'Expedia Bestpreis',
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
      name: 'Trip.com Kombi-Deal',
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
      rawRankScore: isWinterOrMountainDest ? 0 : 2,
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

  if (customFlightInput) {
    candidateOffers.push({
      id: 'flights',
      providerShortName: 'Flug-Partner',
      name: 'Flug-Direktvergleich',
      url: skyscannerFlightUrl,
      hasActiveAffiliate: true,
      rawRankScore: 2,
    });
  }

  // Include all user-added extra affiliate partners (e.g. Klook)
  activeExtraPartners.forEach((partner, idx) => {
    const pLower = `${partner.name} ${partner.url}`.toLowerCase();
    const extraDeepDefault = pLower.includes('klook')
      ? baseKlookSearchUrl
      : pLower.includes('kiwi')
      ? baseKiwiFlightUrl
      : partner.url;
    const resolvedExtraUrl = resolveCustomAffiliateUrl(
      partner.url,
      extraDeepDefault,
      partner.name.toLowerCase().replace(/[^a-z0-9]/g, ''),
      'partnerid'
    );
    candidateOffers.push({
      id: `extra-${partner.id || idx}`,
      providerShortName: partner.name.trim(),
      name: `${partner.name.trim()} Sparpreis`,
      url: resolvedExtraUrl,
      hasActiveAffiliate: true,
      rawRankScore: partner.category === 'winter' && isWinterOrMountainDest ? 0 : ((citySeed + idx) % 3) + 1,
    });
  });

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
  regionTag: 'Mittelmeer' | 'Städtetrip' | 'Atlantik & Inseln' | 'Balkan & Osteuropa' | 'Fernreise-Budget';
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
    baseFlight: 245,
    baseHotel: 34,
    durationMin: 640,
    temp: 30,
    mealEur: 4.5,
    transitEur: 3.2,
    lcc: 'Scoot / Norse',
    legacy: 'Thai Airways',
    currency: 'USD',
    fxTip: 'Airport Rail Link vom Flughafen Suvarnabhumi ins Zentrum Phaya Thai kostet nur 45 Baht (ca. 1,20 €).',
  },
  new_york: {
    city: 'New York City & Manhattan',
    country: 'USA',
    iata: 'JFK',
    regionTag: 'Fernreise-Budget',
    baseFlight: 215,
    baseHotel: 98,
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
        name: `${displayTitle.split(' ')[0]} Central Smart Studios`,
        neighborhood: 'Zentrum · 350m zur U-Bahn / Altstadt',
        category: 'Smart-Aparthotel (Sparpreis)',
        rating: 8.7,
        reviewCount: 540 + (hash % 400),
        pricePerNightTwoAdults: baseHotel,
        boardType: 'Nur Übernachtung',
        cancellation: 'Nicht erstattbar (Sparpreis)',
        distanceToCenterKm: 0.5,
        highlights: [
          'Direkte ÖPNV-Anbindung vom Flughafen',
          'Voll ausgestattete Kitchenette spart Restaurantkosten',
          '24h Self-Check-in ohne Zusatzgebühren',
        ],
      },
      {
        id: `${id}-h2`,
        name: `Boutique Hotel ${displayTitle.split(' ')[0]} Plaza`,
        neighborhood: 'Historisches Viertel · Fußgängerzone',
        category: '3.5★ Komfort-Hotel',
        rating: 9.0,
        reviewCount: 720 + (hash % 300),
        pricePerNightTwoAdults: Math.round(baseHotel * 1.28),
        boardType: 'Frühstück inklusive',
        cancellation: 'Kostenlos stornierbar',
        distanceToCenterKm: 0.4,
        highlights: [
          'Großes regionales Frühstücksbuffet inklusive',
          'Kostenlose Stornierung bis 24h vor Anreise',
          'Sonderkontingent -27% ggü. Einzelbuchung',
        ],
      },
      {
        id: `${id}-h3`,
        name: `Grand ${displayTitle.split(' ')[0]} Suites & Spa`,
        neighborhood: 'Panorama-Lage · 10 Min. ins Zentrum',
        category: '4★ Superior Hotel',
        rating: 9.3,
        reviewCount: 410 + (hash % 250),
        pricePerNightTwoAdults: Math.round(baseHotel * 1.65),
        boardType: 'Halbpension',
        cancellation: 'Kostenlos stornierbar',
        distanceToCenterKm: 1.2,
        highlights: [
          'Frühstück & 3-Gänge-Abendmenü inklusive',
          'Kostenfreier Zugang zu Wellness & Pool',
          'Später Check-out bis 14:00 Uhr garantiert',
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

