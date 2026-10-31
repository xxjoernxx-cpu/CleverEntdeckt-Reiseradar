import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  ArrowUpDown,
  PlaneTakeoff,
  Bell,
  X,
  Info,
  Trash2,
  ArrowRight,
  Compass,
  Calendar,
  ExternalLink,
  Plus,
  Minus,
} from 'lucide-react';
import {
  DEPARTURE_HUBS,
  DESTINATIONS,
  DestinationDeal,
  LuggageOption,
  PriceAlertItem,
  UserCurrencyCode,
  SUPPORTED_CURRENCIES,
  formatMoney,
  formatCatalogPrice,
  CURATED_COMPLETE_PACKAGES,
  CompletePackageOffer,
  createCustomDestinationDeal,
  buildProviderBookingLinks,
  AffiliatePartnerConfig,
  getSavedAffiliateConfig,
} from './data/travelData';
import { DestinationArtwork } from './components/DestinationArtwork';
import { PriceCalendarSection } from './components/PriceCalendarSection';
import { RouteOptimizerSection } from './components/RouteOptimizerSection';
import { CurrencyConverterPanel } from './components/CurrencyConverterPanel';
import { AffiliateSetupSection } from './components/AffiliateSetupSection';
import { PWAInstallButton } from './components/PWAInstallButton';
import { Check24PackageWidget } from './components/Check24PackageWidget';

type SortStrategy = 'lowest_total' | 'biggest_discount' | 'warmest_weather' | 'cheapest_local';

const INITIAL_ALERTS: PriceAlertItem[] = [
  {
    id: 'alert-default-1',
    destinationId: 'krakau-hohe-tatra',
    destinationName: 'Krakau & Zakopane Bergwelt',
    originCode: 'FRA',
    targetMaxPrice: 190,
    currentBestPrice: 174,
    durationNights: 4,
    month: 'November 2026',
    createdAt: 'Aktiv',
  },
  {
    id: 'alert-default-2',
    destinationId: 'palma-mallorca',
    destinationName: 'Palma & Serra de Tramuntana',
    originCode: 'FRA',
    targetMaxPrice: 250,
    currentBestPrice: 238,
    durationNights: 4,
    month: 'November 2026',
    createdAt: 'Aktiv',
  },
];

export default function App() {
  // Parse optional URL parameters, path, or hash for country/destination links
  // Supports: ?ziel=Spanien, /spanien, #spanien, ?ziel=Tuerkei, /tuerkei, #tuerkei, ?ziel=Italien, /italien, #italien
  const initialUrlParams = useMemo(() => {
    if (typeof window === 'undefined') {
      return { query: '', origin: 'FRA', destId: 'palma-mallorca', isDirectCountryLink: false };
    }
    const sp = new URLSearchParams(window.location.search);
    const rawQueryParam = (
      sp.get('ziel') ||
      sp.get('land') ||
      sp.get('country') ||
      sp.get('q') ||
      ''
    ).trim();

    // Also check URL pathname (e.g. /spanien, /tuerkei, /italien)
    const rawPathSegment = decodeURIComponent(
      window.location.pathname.replace(/^\/+|\/+$/g, '')
    ).trim();
    const ignoredPaths = new Set(['', 'index.html', 'app']);

    // Also check URL hash if it's not a section ID (e.g. #spanien, #tuerkei, #italien)
    const rawHashSegment = decodeURIComponent(window.location.hash.replace(/^#+/, '')).trim();
    const knownSectionIds = new Set([
      'suche',
      'waehrungsrechner',
      'entdecker',
      'preiskalender',
      'routenoptimierer',
      'buchung',
      'affiliate-setup',
    ]);

    const rawTarget =
      rawQueryParam ||
      (!ignoredPaths.has(rawPathSegment.toLowerCase()) ? rawPathSegment : '') ||
      (rawHashSegment && !knownSectionIds.has(rawHashSegment.toLowerCase()) ? rawHashSegment : '');

    // Normalize common ASCII spellings (e.g., Tuerkei -> Türkei)
    const normalizedLower = rawTarget.toLowerCase();
    let cleanQuery = rawTarget;
    if (
      normalizedLower === 'tuerkei' ||
      normalizedLower === 'turkei' ||
      normalizedLower === 'türkei' ||
      normalizedLower === 'turkey'
    ) {
      cleanQuery = 'Türkei';
    } else if (normalizedLower === 'spanien' || normalizedLower === 'spain') {
      cleanQuery = 'Spanien';
    } else if (normalizedLower === 'italien' || normalizedLower === 'italy') {
      cleanQuery = 'Italien';
    }

    const rawOrigin = (sp.get('ab') || sp.get('origin') || '').trim().toUpperCase();
    const validOrigin = DEPARTURE_HUBS.some((h) => h.code === rawOrigin) ? rawOrigin : 'FRA';

    let matchedDestId = 'palma-mallorca';
    if (cleanQuery) {
      const qLower = cleanQuery.toLowerCase();
      const firstMatch = DESTINATIONS.find(
        (d) =>
          d.country.toLowerCase().includes(qLower) ||
          d.city.toLowerCase().includes(qLower) ||
          d.iata.toLowerCase() === qLower
      );
      if (firstMatch) {
        matchedDestId = firstMatch.id;
      }
    }

    return {
      query: cleanQuery,
      origin: validOrigin,
      destId: matchedDestId,
      isDirectCountryLink: Boolean(cleanQuery),
    };
  }, []);

  // Search & Filter State
  const [originCode, setOriginCode] = useState<string>(initialUrlParams.origin);
  const [userCurrency, setUserCurrency] = useState<UserCurrencyCode>(() =>
    ['ZRH', 'BSL', 'GVA'].includes(initialUrlParams.origin) ? 'CHF' : 'EUR'
  );
  const [searchQuery, setSearchQuery] = useState<string>(initialUrlParams.query);
  const [selectedRegion, setSelectedRegion] = useState<string>('Alle');
  const [durationNights, setDurationNights] = useState<number>(4);
  const [travelers, setTravelers] = useState<number>(2);
  const [maxBudgetPerPerson, setMaxBudgetPerPerson] = useState<number | null>(null);
  const [luggage, setLuggage] = useState<LuggageOption>('personal');
  const [includeNearbyAirports, setIncludeNearbyAirports] = useState<boolean>(true);
  const [includeSplitTickets, setIncludeSplitTickets] = useState<boolean>(true);
  const [sortBy, setSortBy] = useState<SortStrategy>('lowest_total');

  // Active Destination & Calendar State
  const [activeDestId, setActiveDestId] = useState<string>(initialUrlParams.destId);
  const [selectedMonth, setSelectedMonth] = useState<string>('2026-11');
  const [selectedDateStr, setSelectedDateStr] = useState<string>('2026-11-17');
  const [selectedRouteId, setSelectedRouteId] = useState<string>('');
  const [selectedHotelId, setSelectedHotelId] = useState<string>('');

  // Saved Price Alerts & Drawer/Modal State
  const [priceAlerts, setPriceAlerts] = useState<PriceAlertItem[]>(() => {
    try {
      const saved = localStorage.getItem('sparflug_price_alerts');
      return saved ? JSON.parse(saved) : INITIAL_ALERTS;
    } catch {
      return INITIAL_ALERTS;
    }
  });
  const [isAlertDrawerOpen, setIsAlertDrawerOpen] = useState<boolean>(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState<boolean>(false);
  const [lastSearchSummary, setLastSearchSummary] = useState<string>('');
  const [affiliateConfig, setAffiliateConfig] = useState<AffiliatePartnerConfig>(() =>
    getSavedAffiliateConfig()
  );
  const [isPublicCustomerView, setIsPublicCustomerView] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const sp = new URLSearchParams(window.location.search);
      if (sp.get('admin') === '1') return false;
      if (
        sp.get('view') === 'public' ||
        sp.get('public') === '1' ||
        initialUrlParams.isDirectCountryLink
      ) {
        return true;
      }
    }
    return false;
  });

  // Automatically determine whether the visitor is looking for Camping, Hiking (Wandern), Camper, or Standard Flight+Hotel
  const activeTravelMode = useMemo<'standard' | 'camping_nature' | 'hiking' | 'camper'>(() => {
    const q = searchQuery.trim().toLowerCase();
    if (
      q.includes('wander') ||
      q.includes('trekking') ||
      q.includes('berg') ||
      q.includes('skiwander') ||
      q.includes('asi')
    ) {
      return 'hiking';
    }
    if (
      q.includes('wohnmobil') ||
      q.includes('camper') ||
      q.includes('kastenwagen')
    ) {
      return 'camper';
    }
    if (
      selectedRegion === 'Camping & Natur' ||
      q.includes('camping') ||
      q.includes('stellplatz') ||
      q.includes('mobilheim') ||
      q.includes('glamping') ||
      q.includes('zelt') ||
      q.includes('natur')
    ) {
      return 'camping_nature';
    }
    return 'standard';
  }, [searchQuery, selectedRegion]);

  const isCampingOrNatureActive = activeTravelMode !== 'standard';

  const handleSaveAffiliateConfig = (newCfg: AffiliatePartnerConfig) => {
    setAffiliateConfig(newCfg);
    try {
      localStorage.setItem('sparflug_affiliate_config', JSON.stringify(newCfg));
    } catch {
      // Ignore storage errors
    }
  };

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const reg of registrations) {
          if (reg.active?.scriptURL.includes('dev-sw')) {
            reg.unregister();
          }
        }
      });
    }
    if (typeof window !== 'undefined' && window.location.hash) {
      const targetId = window.location.hash.replace('#', '');
      window.history.replaceState(
        null,
        '',
        window.location.pathname + window.location.search
      );
      if (targetId) {
        setTimeout(() => scrollToSection(targetId), 100);
      }
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('sparflug_price_alerts', JSON.stringify(priceAlerts));
    } catch {
      // Ignore storage errors in private browsing
    }
  }, [priceAlerts]);

  const activeHub = useMemo(
    () => DEPARTURE_HUBS.find((h) => h.code === originCode) || DEPARTURE_HUBS[0],
    [originCode]
  );

  const handleHubChange = (newHubCode: string) => {
    setOriginCode(newHubCode);
    if (['ZRH', 'BSL', 'GVA'].includes(newHubCode) && userCurrency === 'EUR') {
      setUserCurrency('CHF');
    }
  };

  // Compute lowest possible total price per person for any destination given current filters
  const computeBestDealForDestination = (dest: DestinationDeal) => {
    const routes = dest.routesByOrigin[originCode] || Object.values(dest.routesByOrigin)[0];
    const allowedRoutes = routes.filter((r) => {
      if (r.type === 'nearby_airport' && !includeNearbyAirports) return false;
      if (r.type === 'split_ticket' && !includeSplitTickets) return false;
      return true;
    });

    const chosenRoute =
      allowedRoutes.sort(
        (a, b) =>
          a.baseFlightPricePerPerson +
          a.luggageFees[luggage] +
          a.railTransferFeePerPerson -
          (b.baseFlightPricePerPerson + b.luggageFees[luggage] + b.railTransferFeePerPerson)
      )[0] || routes[routes.length - 1];

    const monthPoints = dest.monthlyCalendar[selectedMonth] || [];
    const lowestCalendarDay =
      [...monthPoints].sort(
        (a, b) =>
          a.flightPrice +
          a.hotelPerNight * durationNights -
          (b.flightPrice + b.hotelPerNight * durationNights)
      )[0] || monthPoints[0];

    const discountMultiplier =
      chosenRoute.type === 'nearby_airport'
        ? 0.74
        : chosenRoute.type === 'split_ticket'
        ? 0.84
        : 1.0;

    const flightTotalPP =
      Math.round((lowestCalendarDay?.flightPrice || chosenRoute.baseFlightPricePerPerson) * discountMultiplier) +
      chosenRoute.luggageFees[luggage] +
      chosenRoute.railTransferFeePerPerson;

    const cheapestHotel = dest.hotels[0];
    const hotelTotalPP = Math.round(
      (cheapestHotel.pricePerNightTwoAdults * durationNights * Math.ceil(travelers / 2)) /
        travelers
    );

    const campingPitchPerNightPP = Math.max(
      14,
      Math.round(cheapestHotel.pricePerNightTwoAdults * 0.22)
    );
    const campingTotalPP = campingPitchPerNightPP * durationNights;

    const totalPerPerson = isCampingOrNatureActive
      ? campingTotalPP
      : flightTotalPP + hotelTotalPP;
    const referenceTotal = Math.round(
      dest.historicalAvgTotal * (durationNights / 4)
    );
    const savingsPct = Math.max(
      8,
      Math.min(58, Math.round(((referenceTotal - (flightTotalPP + hotelTotalPP)) / referenceTotal) * 100))
    );
    const savingsEur = Math.max(18, referenceTotal - (flightTotalPP + hotelTotalPP));

    return {
      totalPerPerson,
      flightTotalPP,
      hotelTotalPP,
      campingPitchPerNightPP,
      campingTotalPP,
      chosenRoute,
      cheapestHotel,
      lowestDateStr: lowestCalendarDay?.dateStr || '2026-11-17',
      savingsPct,
      savingsEur,
      referenceTotal,
    };
  };

  const [customDestinations, setCustomDestinations] = useState<DestinationDeal[]>([]);

  const allAvailableDestinations = useMemo(() => {
    const baseList = [...customDestinations, ...DESTINATIONS];
    const q = searchQuery.trim();
    if (!q) return baseList;

    const qLower = q.toLowerCase();
    const isGenericTopicQuery = [
      'camping & natur',
      'camping',
      'wandern',
      'wanderreisen',
      'trekking',
      'wohnmobil',
      'camper',
      'natur',
    ].includes(qLower);

    if (isGenericTopicQuery) return baseList;

    const hasMatchInBase = baseList.some(
      (d) =>
        d.city.toLowerCase().includes(qLower) ||
        d.country.toLowerCase().includes(qLower) ||
        d.iata.toLowerCase().includes(qLower)
    );

    if (!hasMatchInBase) {
      const dynamicDeal = createCustomDestinationDeal(q);
      return [dynamicDeal, ...baseList];
    }

    return baseList;
  }, [customDestinations, searchQuery]);

  const enrichedDestinations = useMemo(() => {
    return allAvailableDestinations
      .map((dest) => ({
        dest,
        calc: computeBestDealForDestination(dest),
      }))
      .filter(({ dest, calc }) => {
        const q = searchQuery.trim().toLowerCase();
        const isCampingNaturDestination =
          dest.regionTag === 'Camping & Natur' ||
          [
            'krakau-hohe-tatra',
            'palma-mallorca',
            'barcelona-costa-brava',
            'teneriffa-adeje',
            'mailand-comer-see',
            'neapel-amalfi',
            'sizilien-catania',
            'bodrum-kappadokien',
            'marrakesch-atlas',
          ].includes(dest.id);

        const isTopicSearch = [
          'camping & natur',
          'camping',
          'wandern',
          'wanderreisen',
          'trekking',
          'wohnmobil',
          'camper',
          'natur',
        ].includes(q);

        const matchesSearch =
          q === '' ||
          (isTopicSearch && isCampingNaturDestination) ||
          dest.city.toLowerCase().includes(q) ||
          dest.country.toLowerCase().includes(q) ||
          dest.iata.toLowerCase().includes(q);
        const matchesRegion =
          q !== '' ||
          selectedRegion === 'Alle' ||
          (selectedRegion === 'Camping & Natur' && isCampingNaturDestination) ||
          dest.regionTag === selectedRegion;
        const matchesBudget =
          maxBudgetPerPerson === null || calc.totalPerPerson <= maxBudgetPerPerson;
        return matchesSearch && matchesRegion && matchesBudget;
      })
      .sort((a, b) => {
        if (sortBy === 'lowest_total') return a.calc.totalPerPerson - b.calc.totalPerPerson;
        if (sortBy === 'biggest_discount') return b.calc.savingsPct - a.calc.savingsPct;
        if (sortBy === 'warmest_weather') return b.dest.avgTempMayOct - a.dest.avgTempMayOct;
        if (sortBy === 'cheapest_local') return a.dest.mealCostIndex - b.dest.mealCostIndex;
        return 0;
      });
  }, [
    allAvailableDestinations,
    originCode,
    searchQuery,
    selectedRegion,
    durationNights,
    travelers,
    maxBudgetPerPerson,
    luggage,
    includeNearbyAirports,
    includeSplitTickets,
    selectedMonth,
    sortBy,
    isCampingOrNatureActive,
  ]);

  const activeDestination = useMemo(
    () =>
      allAvailableDestinations.find((d) => d.id === activeDestId) ||
      enrichedDestinations[0]?.dest ||
      DESTINATIONS[0],
    [allAvailableDestinations, enrichedDestinations, activeDestId]
  );

  // Keep route & hotel selection synced when destination or hub changes
  useEffect(() => {
    const routes =
      activeDestination.routesByOrigin[originCode] ||
      Object.values(activeDestination.routesByOrigin)[0];
    if (routes && routes.length > 0) {
      const preferred =
        includeNearbyAirports
          ? routes[0]
          : includeSplitTickets
          ? routes[1] || routes[0]
          : routes[routes.length - 1];
      setSelectedRouteId(preferred.id);
    }
    if (activeDestination.hotels.length > 0) {
      setSelectedHotelId(activeDestination.hotels[0].id);
    }
    const monthDays = activeDestination.monthlyCalendar[selectedMonth] || [];
    const bestDay = monthDays.find((d) => d.isLowestInMonth) || monthDays[0];
    if (bestDay) {
      setSelectedDateStr(bestDay.dateStr);
    }
  }, [activeDestination.id, originCode, selectedMonth, includeNearbyAirports, includeSplitTickets]);

  const handleSelectDestinationCard = (destId: string, scrollTarget: string) => {
    setActiveDestId(destId);
    const el = document.getElementById(scrollTarget);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectCompletePackage = (pkg: CompletePackageOffer) => {
    setDurationNights(pkg.nights);
    setSelectedRegion('Alle');
    setMaxBudgetPerPerson(null);

    const existingMatch = [...customDestinations, ...DESTINATIONS].find(
      (d) =>
        d.city.toLowerCase().includes(pkg.searchKeyword.toLowerCase()) ||
        d.country.toLowerCase().includes(pkg.searchKeyword.toLowerCase())
    );

    const dealToUse = existingMatch || createCustomDestinationDeal(pkg.searchKeyword);
    if (!existingMatch) {
      setCustomDestinations((prev) =>
        prev.some((p) => p.id === dealToUse.id) ? prev : [dealToUse, ...prev]
      );
    }

    const currentQ = searchQuery.trim().toLowerCase();
    const matchesCurrentCountry =
      currentQ !== '' && pkg.country.toLowerCase().includes(currentQ);
    if (!matchesCurrentCountry) {
      setSearchQuery('');
    }
    setActiveDestId(dealToUse.id);
    setLastSearchSummary(
      `Komplettreise-Paket geladen: ${pkg.days} Tage (${pkg.nights} Nächte) ${
        pkg.cityShort
      } – Richtpreis ab ${formatCatalogPrice(pkg.priceEurPerPerson, userCurrency)} p.P.`
    );

    const el = document.getElementById('routenoptimierer');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleExecuteSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const q = searchQuery.trim();
    let targetDeal = enrichedDestinations[0];

    if (q) {
      const qLower = q.toLowerCase();
      const isTopicSearch = [
        'camping & natur',
        'camping',
        'wandern',
        'wanderreisen',
        'trekking',
        'wohnmobil',
        'camper',
        'natur',
      ].includes(qLower);

      if (isTopicSearch) {
        setSelectedRegion('Camping & Natur');
      } else {
        if (selectedRegion !== 'Alle' && selectedRegion !== 'Camping & Natur') {
          setSelectedRegion('Alle');
        }
        const existingMatch = [...customDestinations, ...DESTINATIONS].find(
          (d) =>
            d.city.toLowerCase().includes(qLower) ||
            d.country.toLowerCase().includes(qLower) ||
            d.iata.toLowerCase().includes(qLower)
        );

        const dealToUse = existingMatch || createCustomDestinationDeal(q);
        if (!existingMatch) {
          setCustomDestinations((prev) =>
            prev.some((p) => p.id === dealToUse.id) ? prev : [dealToUse, ...prev]
          );
        }

        const calc = computeBestDealForDestination(dealToUse);
        if (maxBudgetPerPerson !== null && calc.totalPerPerson > maxBudgetPerPerson) {
          setMaxBudgetPerPerson(null);
        }
        targetDeal = { dest: dealToUse, calc };
      }
    }

    if (targetDeal) {
      setActiveDestId(targetDeal.dest.id);
      setLastSearchSummary(
        isCampingOrNatureActive
          ? `Camping-, Camper- & Wander-Vergleich für „${targetDeal.dest.city}“ aktiv: Direktlinks zu camping.info, ASI Reisen, CamperDays & TUI Camper.`
          : `Tiefpreis-Analyse für „${targetDeal.dest.city}“ abgeschlossen: Richtpreis ab ${formatMoney(
              targetDeal.calc.totalPerPerson,
              userCurrency
            )} p.P. (${durationNights} Nächte ab ${targetDeal.calc.chosenRoute.outbound.originCode})`
      );
    } else {
      setLastSearchSummary(
        'Keine Reisen im gewählten Budget gefunden – bitte passen Sie die Filter an.'
      );
    }

    const targetEl = document.getElementById(q ? 'routenoptimierer' : 'entdecker');
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const activeDestCalc = computeBestDealForDestination(activeDestination);
  const isCurrentDestSaved = priceAlerts.some(
    (a) => a.destinationId === activeDestination.id && a.originCode === originCode
  );

  const handleTogglePriceAlert = () => {
    if (isCurrentDestSaved) {
      setPriceAlerts((prev) =>
        prev.filter(
          (a) => !(a.destinationId === activeDestination.id && a.originCode === originCode)
        )
      );
    } else {
      const newAlert: PriceAlertItem = {
        id: `alert-${Date.now()}`,
        destinationId: activeDestination.id,
        destinationName: activeDestination.city,
        originCode,
        targetMaxPrice: activeDestCalc.totalPerPerson + 15,
        currentBestPrice: activeDestCalc.totalPerPerson,
        durationNights,
        month: selectedMonth,
        createdAt: 'Gerade aktiviert',
      };
      setPriceAlerts((prev) => [newAlert, ...prev]);
    }
  };

  const overallLowestDeal = enrichedDestinations[0];

  // Live preview of the searched destination and its cheapest partner (respecting Camping/Wandern/Camper mode!)
  const searchPreviewTarget = useMemo(() => {
    const q = searchQuery.trim();
    if (!q) {
      return overallLowestDeal || { dest: activeDestination, calc: activeDestCalc };
    }
    const qLower = q.toLowerCase();
    const isTopicSearch = [
      'camping & natur',
      'camping',
      'wandern',
      'wanderreisen',
      'trekking',
      'wohnmobil',
      'camper',
      'natur',
    ].includes(qLower);

    if (isTopicSearch) {
      return overallLowestDeal || { dest: activeDestination, calc: activeDestCalc };
    }

    const existingMatch = [...customDestinations, ...DESTINATIONS].find(
      (d) =>
        d.city.toLowerCase().includes(qLower) ||
        d.country.toLowerCase().includes(qLower) ||
        d.iata.toLowerCase().includes(qLower)
    );
    const dealToUse = existingMatch || createCustomDestinationDeal(q);
    const calc = computeBestDealForDestination(dealToUse);
    return { dest: dealToUse, calc };
  }, [
    searchQuery,
    overallLowestDeal,
    customDestinations,
    activeDestination,
    activeDestCalc,
    originCode,
    durationNights,
    luggage,
    includeNearbyAirports,
    includeSplitTickets,
    selectedMonth,
    isCampingOrNatureActive,
  ]);

  const searchPreviewLinks = useMemo(() => {
    const { dest, calc } = searchPreviewTarget;
    return buildProviderBookingLinks({
      originCode: calc.chosenRoute.outbound.originCode,
      destCode: dest.iata,
      destCity: dest.city,
      hotelName: dest.city,
      carrierName: calc.chosenRoute.outbound.carrier,
      departureDateStr: calc.lowestDateStr,
      durationNights,
      travelers,
      userCurrency,
      affiliateConfig,
      travelMode: activeTravelMode,
    });
  }, [searchPreviewTarget, durationNights, travelers, userCurrency, affiliateConfig, activeTravelMode]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* 1. Top Bar Contract: 3 zones separated by gap-8 */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-xs border-b border-slate-200 px-6 py-3.5">
        <div className="max-w-[1280px] mx-auto flex items-center justify-between gap-8">
          {/* Zone 1: Single text element wordmark */}
          <button
            type="button"
            onClick={() => scrollToSection('top')}
            className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 cursor-pointer"
          >
            CleverEntdeckt, Sparflug & Reiseradar
          </button>

          {/* Zone 2: 5 concise single-line navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button
              type="button"
              onClick={() => scrollToSection('entdecker')}
              className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Tiefpreis-Entdecker
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('waehrungsrechner')}
              className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Währungsrechner
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('preiskalender')}
              className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Preiskalender
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('routenoptimierer')}
              className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Routen-Optimierer
            </button>
            {!isPublicCustomerView && (
              <button
                type="button"
                onClick={() => scrollToSection('monetarisierung')}
                className="text-emerald-700 hover:text-emerald-900 font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Partner & Profit
              </button>
            )}
          </nav>

          {/* Zone 3: Primary action + PWA Install + Public View Switch */}
          <div className="flex items-center gap-2 shrink-0">
            <PWAInstallButton />
            {!isPublicCustomerView && (
              <button
                type="button"
                onClick={() => setIsPublicCustomerView(true)}
                title="Blendet das interne Partner-Setup für Homepage-Besucher aus"
                className="hidden sm:inline-flex px-3 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer items-center gap-1.5"
              >
                <span>Öffentliche Ansicht</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsAlertDrawerOpen(true)}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-2"
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Preis-Wächter ({priceAlerts.length})</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main id="top" className="flex-1">
        {/* Hero & Multi-Variable Cheapest Trip Cockpit */}
        <section className="bg-white border-b border-slate-200 pt-8 pb-10">
          <div className="max-w-[1280px] mx-auto px-6">
            <div className="max-w-3xl mb-6">
              <p className="text-xs font-medium text-slate-500">
                Unabhängige Tiefpreis-Suchmaschine <span aria-hidden="true">·</span> Multi-Airport-Radius <span aria-hidden="true">·</span> Camping, Wandern & Pauschalreisen <span aria-hidden="true">·</span> Live-Währungsumrechnung ({userCurrency})
              </p>
              <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-bold tracking-tight text-slate-900 mt-2 leading-[1.15] text-balance">
                {isCampingOrNatureActive
                  ? 'Campingplätze, Wohnmobile & Wanderreisen direkt zum günstigsten Preis finden.'
                  : searchQuery.trim()
                  ? `Günstigste Reisen & Angebote für ${searchQuery.trim()} direkt im Vergleich.`
                  : 'Finden Sie die günstigste Reise, egal wohin oder zu Ihrem Traumziel.'}
              </h1>
              <p className="text-base text-slate-600 mt-3 leading-relaxed">
                {isCampingOrNatureActive
                  ? 'Spezial-Modus für Natururlauber aktiv: Vergleichen Sie über 23.000 Campingplätze bei camping.info, geführte & individuelle Wanderreisen bei ASI Reisen sowie Wohnmobile bei CamperDays und TUI Camper.'
                  : 'Unser Tiefpreis-Finder kombiniert Nachbarflughäfen im 180-km-Umkreis, günstige Wochentage und öffnet Ihre Partner-Portale vorab sortiert nach dem niedrigsten tatsächlich buchbaren Live-Preis.'}
              </p>
            </div>

            {/* Country / Topic Quick-Selection Bar (Ideal for Spain, Turkey, Italy & Camping/Wandern) */}
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 bg-blue-50/80 border border-blue-200/80 rounded-xl px-4 py-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-slate-800">
                  {isCampingOrNatureActive
                    ? 'Camping, Camper & Wandern aktiv:'
                    : searchQuery.trim()
                    ? `Vorauswahl „${searchQuery.trim()}“ aktiv (${enrichedDestinations.length} Regionen):`
                    : 'Länder- & Themen-Spezial direkt wählen:'}
                </span>
                {[
                  { label: 'Alle Ziele (Flug & Hotel)', value: '', region: 'Alle', defaultDest: 'palma-mallorca' },
                  { label: 'Spanien (4 Regionen)', value: 'Spanien', region: 'Alle', defaultDest: 'palma-mallorca' },
                  { label: 'Türkei (4 Regionen)', value: 'Türkei', region: 'Alle', defaultDest: 'antalya-riviera' },
                  { label: 'Italien (4 Regionen)', value: 'Italien', region: 'Alle', defaultDest: 'rom-latium' },
                  { label: 'Camping & Natur (camping.info / ASI / Camper)', value: '', region: 'Camping & Natur', defaultDest: 'mailand-comer-see' },
                ].map((item) => {
                  const isActive =
                    item.region === 'Camping & Natur'
                      ? isCampingOrNatureActive
                      : !isCampingOrNatureActive &&
                        searchQuery.trim().toLowerCase() === item.value.toLowerCase();
                  return (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => {
                        setSearchQuery(item.value);
                        setSelectedRegion(item.region);
                        setActiveDestId(item.defaultDest);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                        isActive
                          ? item.region === 'Camping & Natur'
                            ? 'bg-emerald-700 text-white shadow-2xs'
                            : 'bg-blue-600 text-white shadow-2xs'
                          : 'bg-white hover:bg-blue-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>

              {searchQuery.trim() && enrichedDestinations.length > 1 && (
                <div className="flex flex-wrap items-center gap-1.5 text-xs">
                  <span className="text-slate-500 font-medium">Region im Rechner:</span>
                  {enrichedDestinations.slice(0, 5).map(({ dest }) => (
                    <button
                      key={dest.id}
                      type="button"
                      onClick={() => setActiveDestId(dest.id)}
                      className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                        activeDestination.id === dest.id
                          ? 'bg-emerald-600 text-white'
                          : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {dest.city.split('&')[0].split(',')[0].trim()}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Interactive Search & Optimization Control Matrix */}
            <form
              onSubmit={handleExecuteSearch}
              className="bg-slate-50 border border-slate-200 rounded-2xl p-5"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4">
                {/* 1. Departure Hub */}
                <div className="lg:col-span-3">
                  <label
                    htmlFor="hub-select"
                    className="block text-xs font-semibold text-slate-700 mb-1.5"
                  >
                    Abflug-Region & Umkreis
                  </label>
                  <div className="relative">
                    <PlaneTakeoff className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <select
                      id="hub-select"
                      value={originCode}
                      onChange={(e) => handleHubChange(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      {DEPARTURE_HUBS.map((hub) => (
                        <option key={hub.code} value={hub.code}>
                          {hub.name} + {hub.nearbyCodes.map((n) => n.code).join('/')}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 2. Destination / Everywhere / Camping / Wandern Search */}
                <div className="lg:col-span-3">
                  <label
                    htmlFor="dest-search"
                    className="block text-xs font-semibold text-slate-700 mb-1.5"
                  >
                    Reiseziel oder Thema (z.B. Spanien, Camping, Wandern)
                  </label>
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="dest-search"
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Alle Ziele oder z.B. Mallorca, Camping, Wandern..."
                      className="w-full pl-9 pr-8 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        aria-label="Suche zurücksetzen"
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* 3. Trip Duration (Uncapped +/- Stepper) & Travelers */}
                <div className="lg:col-span-3 grid grid-cols-2 gap-2.5">
                  <div>
                    <label
                      htmlFor="nights-input"
                      className="block text-xs font-semibold text-slate-700 mb-1.5"
                    >
                      Reisedauer (Nächte)
                    </label>
                    <div className="flex items-center bg-white border border-slate-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-600">
                      <button
                        type="button"
                        onClick={() => setDurationNights((prev) => Math.max(1, prev - 1))}
                        disabled={durationNights <= 1}
                        title="1 Nacht weniger"
                        aria-label="1 Nacht weniger"
                        className="px-2.5 py-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-40 transition-colors cursor-pointer shrink-0"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <input
                        id="nights-input"
                        type="number"
                        min={1}
                        step={1}
                        value={durationNights}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10);
                          if (!isNaN(val) && val >= 1) {
                            setDurationNights(val);
                          } else if (e.target.value === '') {
                            setDurationNights(1);
                          }
                        }}
                        className="w-full py-2 text-center text-sm font-mono font-bold text-slate-900 bg-transparent focus:outline-none tabular-nums"
                      />
                      <button
                        type="button"
                        onClick={() => setDurationNights((prev) => prev + 1)}
                        title="1 Nacht mehr (beliebig erhöhbar)"
                        aria-label="1 Nacht mehr"
                        className="px-2.5 py-2.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 transition-colors cursor-pointer shrink-0"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="travelers-select"
                      className="block text-xs font-semibold text-slate-700 mb-1.5"
                    >
                      Reisende
                    </label>
                    <select
                      id="travelers-select"
                      value={travelers}
                      onChange={(e) => setTravelers(Number(e.target.value))}
                      className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      <option value={1}>1 Person</option>
                      <option value={2}>2 Personen (DZ)</option>
                      <option value={3}>3 Personen</option>
                      <option value={4}>4 Personen (2 DZ)</option>
                    </select>
                  </div>
                </div>

                {/* 4. Max Budget Slider & Uncapped Input */}
                <div className="lg:col-span-3">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <label
                      htmlFor="budget-slider"
                      className="text-xs font-semibold text-slate-700 whitespace-nowrap"
                    >
                      Max. Budget p.P. ({userCurrency})
                    </label>
                    <div className="flex items-center gap-1.5">
                      <input
                        id="budget-number-input"
                        type="number"
                        min={0}
                        step={50}
                        placeholder="∞ Ohne Limit"
                        aria-label="Maximales Budget ohne Obergrenze eingeben"
                        value={
                          maxBudgetPerPerson === null
                            ? ''
                            : Math.round(
                                maxBudgetPerPerson *
                                  SUPPORTED_CURRENCIES[userCurrency].rateFromEur
                              )
                        }
                        onChange={(e) => {
                          const raw = e.target.value;
                          if (raw === '') {
                            setMaxBudgetPerPerson(null);
                          } else {
                            const valInUserCurr = Math.max(0, Number(raw));
                            const valInEur = Math.round(
                              valInUserCurr /
                                (SUPPORTED_CURRENCIES[userCurrency].rateFromEur || 1)
                            );
                            setMaxBudgetPerPerson(valInEur);
                          }
                        }}
                        className="w-28 px-2 py-1 bg-white border border-slate-300 rounded-md text-xs font-mono font-bold text-blue-600 placeholder:text-emerald-700 focus:outline-none focus:ring-2 focus:ring-blue-600 tabular-nums text-right"
                      />
                      {maxBudgetPerPerson !== null && (
                        <button
                          type="button"
                          onClick={() => setMaxBudgetPerPerson(null)}
                          title="Budget-Begrenzung aufheben (Unbegrenzt)"
                          className="px-1.5 py-1 text-[11px] font-semibold bg-slate-200/80 hover:bg-slate-300 text-slate-700 rounded cursor-pointer"
                        >
                          ∞
                        </button>
                      )}
                    </div>
                  </div>
                  {(() => {
                    const dynamicMaxEur =
                      maxBudgetPerPerson === null
                        ? 5000
                        : Math.max(5000, Math.ceil((maxBudgetPerPerson + 1000) / 1000) * 1000);
                    const sliderValEur =
                      maxBudgetPerPerson === null ? dynamicMaxEur : maxBudgetPerPerson;

                    return (
                      <>
                        <input
                          id="budget-slider"
                          type="range"
                          min={0}
                          max={dynamicMaxEur}
                          step={25}
                          value={sliderValEur}
                          onChange={(e) => {
                            const v = Number(e.target.value);
                            if (v >= dynamicMaxEur) {
                              setMaxBudgetPerPerson(null);
                            } else {
                              setMaxBudgetPerPerson(v);
                            }
                          }}
                          className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg cursor-pointer mt-1"
                        />
                        <div className="flex justify-between text-[11px] font-mono text-slate-400 mt-1 tabular-nums">
                          <span>{formatMoney(0, userCurrency)}</span>
                          <span>
                            {maxBudgetPerPerson === null
                              ? 'Aktuell: Ohne Begrenzung (∞)'
                              : `Limit: ${formatMoney(maxBudgetPerPerson, userCurrency)}`}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              setMaxBudgetPerPerson((prev) =>
                                prev === null ? 5000 : prev + 2500
                              )
                            }
                            className="text-blue-600 hover:underline cursor-pointer"
                            title="Skala beliebig weiter nach oben öffnen"
                          >
                            +Mehr / ∞
                          </button>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>

              {/* Bottom Bar of Search Cockpit: Smart Hack Toggles, Currency, Luggage & Search Submit Button */}
              <div className="mt-4 pt-4 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-4">
                  <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={includeNearbyAirports}
                      onChange={(e) => setIncludeNearbyAirports(e.target.checked)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-600 w-4 h-4"
                    />
                    <span>
                      Nachbarflughäfen einbeziehen ({activeHub.nearbyCodes.map((n) => n.code).join(', ')})
                    </span>
                  </label>

                  <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={includeSplitTickets}
                      onChange={(e) => setIncludeSplitTickets(e.target.checked)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-600 w-4 h-4"
                    />
                    <span>2× One-Way Split-Ticketing aktivieren</span>
                  </label>
                </div>

                {/* Right Toolbar: User Currency Selector, Quick Luggage Switch & Primary Search Button */}
                <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto justify-between xl:justify-end">
                  <div className="flex flex-wrap items-center gap-3">
                    {/* Global User Currency Switch */}
                    <div className="flex items-center gap-2">
                      <label htmlFor="user-currency-select" className="text-xs text-slate-500">
                        Ihre Währung:
                      </label>
                      <select
                        id="user-currency-select"
                        value={userCurrency}
                        onChange={(e) => setUserCurrency(e.target.value as UserCurrencyCode)}
                        className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
                      >
                        {Object.values(SUPPORTED_CURRENCIES).map((curr) => (
                          <option key={curr.code} value={curr.code}>
                            {curr.code} ({curr.symbol}) — {curr.name.split(' (')[0]}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Quick Luggage Switch */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500">Gepäck:</span>
                      <div className="flex items-center gap-1 p-0.5 bg-slate-200/75 rounded-lg">
                        {(
                          [
                            { id: 'personal', label: `Rucksack (${formatMoney(0, userCurrency)})` },
                            { id: 'cabin', label: 'Trolley 8kg' },
                            { id: 'checked', label: 'Koffer 23kg' },
                          ] as { id: LuggageOption; label: string }[]
                        ).map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setLuggage(item.id)}
                            className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                              luggage === item.id
                                ? 'bg-white text-slate-900 shadow-2xs'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Primary "Reise suchen & zum günstigsten Partner" Single Button — automatically routes Camping/Wandern to camping.info / ASI Reisen / CamperDays! */}
                  <a
                    href={searchPreviewLinks.bestDealDirectUrl}
                    target="_blank"
                    rel="sponsored noopener noreferrer"
                    onClick={() => {
                      setTimeout(() => handleExecuteSearch(), 80);
                    }}
                    className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center justify-center gap-2 shadow-xs"
                  >
                    <Search className="w-4 h-4 shrink-0" />
                    <span>
                      {isCampingOrNatureActive
                        ? `Günstigsten Anbieter öffnen → ${searchPreviewLinks.bestDealProviderName} (ab ${formatMoney(
                            searchPreviewTarget.calc.totalPerPerson,
                            userCurrency
                          )})`
                        : searchQuery.trim()
                        ? `„${searchQuery.trim()}“ günstigster Preis → ${searchPreviewLinks.bestDealProviderName} (ab ${formatMoney(
                            searchPreviewTarget.calc.totalPerPerson,
                            userCurrency
                          )})`
                        : `Günstigste Reise finden → ${searchPreviewLinks.bestDealProviderName} (ab ${formatMoney(
                            searchPreviewTarget.calc.totalPerPerson,
                            userCurrency
                          )})`}
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                  </a>
                </div>
              </div>

              {/* Live Partner Best-Price Comparison Strip (Automatically switches to camping.info, ASI Reisen, CamperDays & TUI Camper when Camping/Wandern is active!) */}
              {(searchQuery.trim() || isCampingOrNatureActive || lastSearchSummary) && (
                <div className="mt-3 pt-3 border-t border-slate-200/80 flex flex-col lg:flex-row lg:items-center justify-between gap-3 text-xs bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-3">
                  <div className="space-y-1">
                    <div className="font-bold text-slate-900 flex flex-wrap items-center gap-2">
                      <span>
                        {isCampingOrNatureActive
                          ? `Spezial-Partnervergleich (Camping, Wandern & Camper) für „${searchPreviewTarget.dest.city.split('&')[0].trim()}“ (${durationNights} Nächte):`
                          : `Tiefpreis-Prüfung Ihrer Partner für „${searchPreviewTarget.dest.city.split('&')[0].trim()}“ (${durationNights} Nächte):`}
                      </span>
                      <span className="text-emerald-700 font-mono">
                        1. Platz: {searchPreviewLinks.bestDealProviderName} (Richtwert ab{' '}
                        {formatMoney(searchPreviewTarget.calc.totalPerPerson, userCurrency)} p.P.)
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-600">
                      <span>Passende Partner (Klick öffnet günstigste Angebote zuerst):</span>
                      {searchPreviewLinks.comparedPartnerOffers.map((offer, idx) => (
                        <a
                          key={offer.id}
                          href={offer.url}
                          target="_blank"
                          rel="sponsored noopener noreferrer"
                          className={`px-2 py-0.5 rounded font-mono transition-colors ${
                            offer.isWinner
                              ? 'bg-emerald-600 hover:bg-emerald-500 text-white font-bold'
                              : 'bg-white hover:bg-slate-100 border border-slate-200 text-slate-700'
                          }`}
                        >
                          {idx + 1}. {offer.providerShortName}{' '}
                          {offer.isWinner ? '✓ Günstigster' : '→'}
                        </a>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={searchPreviewLinks.bestDealDirectUrl}
                      target="_blank"
                      rel="sponsored noopener noreferrer"
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg transition-colors inline-flex items-center gap-1.5 whitespace-nowrap"
                    >
                      <span>Zum günstigsten Anbieter ({searchPreviewLinks.bestDealProviderName})</span>
                      <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                    </a>
                  </div>
                </div>
              )}
            </form>

            {/* Instant Top-of-Page Country / Destination / Camping Results */}
            {(searchQuery.trim() !== '' || isCampingOrNatureActive) && enrichedDestinations.length > 0 && (
              <div className="mt-6 bg-blue-950 text-white rounded-2xl p-5 border border-blue-800 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div>
                    <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                      {isCampingOrNatureActive
                        ? `Camping-, Camper- & Wander-Angebote (${durationNights} Nächte)`
                        : `Tiefpreis-Angebote für „${searchQuery.trim()}“ (${durationNights} Nächte ab ${activeHub.name})`}
                    </span>
                    <h2 className="text-lg sm:text-xl font-bold text-white mt-0.5">
                      {isCampingOrNatureActive
                        ? 'Wählen Sie Ihre Natur-Region — direkt zu camping.info, ASI Reisen, CamperDays & TUI Camper'
                        : `Wählen Sie Ihre Wunsch-Region in ${searchQuery.trim()} — vorab sortiert nach niedrigstem Live-Preis`}
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedRegion('Alle');
                    }}
                    className="px-3 py-1.5 bg-blue-900 hover:bg-blue-800 text-blue-100 text-xs font-semibold rounded-lg border border-blue-700 transition-colors cursor-pointer self-start sm:self-auto shrink-0"
                  >
                    Alle Länder & Kategorien anzeigen ×
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                  {enrichedDestinations.map(({ dest, calc }) => {
                    const cardLinks = buildProviderBookingLinks({
                      originCode: calc.chosenRoute.outbound.originCode,
                      destCode: dest.iata,
                      destCity: dest.city,
                      hotelName: dest.city,
                      carrierName: calc.chosenRoute.outbound.carrier,
                      departureDateStr: calc.lowestDateStr,
                      durationNights,
                      travelers,
                      userCurrency,
                      affiliateConfig,
                      travelMode: activeTravelMode,
                    });
                    const isSelected = activeDestination.id === dest.id;

                    return (
                      <div
                        key={dest.id}
                        onClick={() => handleSelectDestinationCard(dest.id, 'routenoptimierer')}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleSelectDestinationCard(dest.id, 'routenoptimierer');
                          }
                        }}
                        className={`rounded-xl p-4 transition-all cursor-pointer flex flex-col justify-between border ${
                          isSelected
                            ? 'bg-slate-900 border-emerald-400 ring-2 ring-emerald-400/30'
                            : 'bg-slate-900/90 hover:bg-slate-900 border-slate-800'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between text-[11px] text-slate-400">
                            <span>
                              {dest.country} · {dest.iata}
                            </span>
                            <span className="font-mono text-emerald-400 font-semibold">
                              {isCampingOrNatureActive
                                ? `Ø ${dest.avgTempMayOct} °C Natur`
                                : `-${calc.savingsPct}% Sparvorteil`}
                            </span>
                          </div>
                          <h3 className="text-base font-bold text-white mt-1 leading-snug">
                            {dest.city}
                          </h3>
                          <div className="mt-2 flex items-baseline justify-between">
                            <span className="text-xs text-slate-300">
                              {isCampingOrNatureActive
                                ? `Stellplatz (${durationNights} Nächte):`
                                : `Richtpreis (${durationNights} Nächte):`}
                            </span>
                            <span className="text-lg font-mono font-bold text-emerald-400 tabular-nums">
                              ab {formatMoney(calc.totalPerPerson, userCurrency)} p.P.
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-1">
                            {isCampingOrNatureActive
                              ? `Campingplatz ab ${formatMoney(calc.campingPitchPerNightPP, userCurrency)}/Nacht · Wanderreisen & Wohnmobile verfügbar`
                              : `Flug ab ${formatMoney(calc.flightTotalPP, userCurrency)} + 3★/4★ Hotel ab ${formatMoney(calc.hotelTotalPP, userCurrency)} (Tiefpreis-Sortierung)`}
                          </p>
                        </div>

                        <div
                          className="mt-3 pt-2.5 border-t border-slate-800 flex flex-col gap-1.5"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {isCampingOrNatureActive ? (
                            /* CAMPING, WANDERN & CAMPER BUTTONS (NO EXPEDIA!) */
                            <>
                              <a
                                href={cardLinks.campingInfoUrl}
                                target="_blank"
                                rel="sponsored noopener noreferrer"
                                className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition-colors inline-flex items-center justify-center gap-1.5"
                              >
                                <span>Campingplätze ({dest.country}) bei camping.info</span>
                                <ExternalLink className="w-3 h-3 shrink-0" />
                              </a>
                              <a
                                href={cardLinks.snowTrexUrl}
                                target="_blank"
                                rel="sponsored noopener noreferrer"
                                className="w-full py-1.5 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-semibold rounded-lg transition-colors inline-flex items-center justify-center gap-1.5"
                              >
                                <span>Wander- & Naturreisen bei ASI Reisen</span>
                                <ExternalLink className="w-3 h-3 shrink-0" />
                              </a>
                              <div className="grid grid-cols-2 gap-1.5">
                                <a
                                  href={cardLinks.camperDaysUrl}
                                  target="_blank"
                                  rel="sponsored noopener noreferrer"
                                  className="py-1 px-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold rounded text-center transition-colors"
                                >
                                  CamperDays
                                </a>
                                <a
                                  href={cardLinks.tuiCamperUrl}
                                  target="_blank"
                                  rel="sponsored noopener noreferrer"
                                  className="py-1 px-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold rounded text-center transition-colors"
                                >
                                  TUI Camper
                                </a>
                              </div>
                            </>
                          ) : (
                            /* STANDARD FLIGHT + HOTEL BUTTONS (PRE-SORTED LOWEST PRICE FIRST) */
                            <>
                              <a
                                href={cardLinks.expediaPackageUrl}
                                target="_blank"
                                rel="sponsored noopener noreferrer"
                                className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition-colors inline-flex items-center justify-center gap-1.5"
                              >
                                <span>Günstigste Hotels in {dest.city.split('&')[0].trim()} (Expedia)</span>
                                <ExternalLink className="w-3 h-3 shrink-0" />
                              </a>
                              <a
                                href={cardLinks.expediaFlightUrl}
                                target="_blank"
                                rel="sponsored noopener noreferrer"
                                className="w-full py-1.5 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-semibold rounded-lg transition-colors inline-flex items-center justify-center gap-1.5"
                              >
                                <span>
                                  Günstigste Flüge ({calc.chosenRoute.outbound.originCode} ⇄ {dest.iata})
                                </span>
                                <ExternalLink className="w-3 h-3 shrink-0" />
                              </a>
                              <div className="grid grid-cols-3 gap-1.5">
                                <a
                                  href={cardLinks.check24HolidayUrl}
                                  target="_blank"
                                  rel="sponsored noopener noreferrer"
                                  className="py-1 px-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold rounded text-center transition-colors"
                                >
                                  CHECK24
                                </a>
                                <a
                                  href={cardLinks.abInDenUrlaubUrl}
                                  target="_blank"
                                  rel="sponsored noopener noreferrer"
                                  className="py-1 px-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold rounded text-center transition-colors truncate"
                                >
                                  Ab in d. Urlaub
                                </a>
                                <a
                                  href={cardLinks.tripComUrl}
                                  target="_blank"
                                  rel="sponsored noopener noreferrer"
                                  className="py-1 px-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold rounded text-center transition-colors"
                                >
                                  Trip.com
                                </a>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Interactive Currency Converter & Local Exchange Rate Optimizer */}
            <div id="waehrungsrechner" className="mt-6">
              <CurrencyConverterPanel
                userCurrency={userCurrency}
                onChangeUserCurrency={setUserCurrency}
                activeDestination={activeDestination}
                tripTotalEurPerPerson={activeDestCalc.totalPerPerson}
                travelers={travelers}
              />
            </div>

            {/* Full-Width 4-Column Best-Price Summary Strip Below Search */}
            {overallLowestDeal && (
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <span className="text-xs text-slate-500 block">
                    {isCampingOrNatureActive
                      ? `Günstigstes Camping- & Naturziel (${durationNights} Nächte)`
                      : `Günstigstes Reiseziel im Ranking (${durationNights} Nächte)`}
                  </span>
                  <div className="flex items-baseline justify-between mt-1">
                    <strong className="text-base font-bold text-slate-900 truncate pr-2">
                      {overallLowestDeal.dest.city.split('&')[0]}
                    </strong>
                    <span className="text-lg font-mono font-bold text-emerald-700 tabular-nums shrink-0">
                      ab {formatMoney(overallLowestDeal.calc.totalPerPerson, userCurrency)} p.P.
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {isCampingOrNatureActive
                      ? `Direkt buchbar über camping.info, ASI Reisen & CamperDays`
                      : `Flug ab ${formatMoney(overallLowestDeal.calc.flightTotalPP, userCurrency)} + Hotel ab ${formatMoney(overallLowestDeal.calc.hotelTotalPP, userCurrency)}`}
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <span className="text-xs text-slate-500 block">
                    Günstigster Abflughafen im Umkreis
                  </span>
                  <div className="flex items-baseline justify-between mt-1">
                    <strong className="text-base font-bold text-slate-900">
                      {overallLowestDeal.calc.chosenRoute.outbound.originCity}
                    </strong>
                    <span className="text-xs font-mono font-semibold text-emerald-700 tabular-nums">
                      -{overallLowestDeal.calc.savingsPct}% ggü. Ø
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Spart ca. {formatMoney(overallLowestDeal.calc.savingsEur, userCurrency)} p.P. zum Standardtarif
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <span className="text-xs text-slate-500 block">
                    Günstigster Reisemonat & Wochentag
                  </span>
                  <div className="flex items-baseline justify-between mt-1">
                    <strong className="text-base font-bold text-slate-900">
                      {overallLowestDeal.dest.cheapestWeekday}s im Nov / Jan
                    </strong>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Optimale Buchungsfrist: {overallLowestDeal.dest.bestBookingLeadWeeks} Wochen vorher
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <span className="text-xs text-slate-500 block">
                    Günstigste Nebenkosten vor Ort
                  </span>
                  <div className="flex items-baseline justify-between mt-1">
                    <strong className="text-base font-bold text-slate-900">
                      Marrakesch & Krakau
                    </strong>
                    <span className="text-sm font-mono font-bold text-slate-900 tabular-nums">
                      ab {formatMoney(7, userCurrency, { exactDecimals: true })}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Durchschnittspreis für ein warmes Hauptgericht
                  </p>
                </div>
              </div>
            )}

            {/* Curated Complete Package Offers */}
            <div className="mt-8 pt-8 border-t border-slate-200">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-4">
                <div>
                  <span className="text-xs font-medium text-slate-500">
                    Beliebte Komplettreise-Pakete (Richtpreise inkl. Flug + Unterkunft — beim Partner nach Tiefpreis sortiert)
                  </span>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">
                    Pauschal- & Langzeit-Ideen zum Komplettpreis
                  </h2>
                </div>
                <span className="text-xs text-slate-500">
                  1 Klick übernimmt Reisedauer & Ziel direkt in den Buchungsrechner
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {(() => {
                  const qLower = searchQuery.trim().toLowerCase();
                  const matchingPackages =
                    qLower === ''
                      ? CURATED_COMPLETE_PACKAGES.slice(0, 6)
                      : CURATED_COMPLETE_PACKAGES.filter(
                          (pkg) =>
                            pkg.country.toLowerCase().includes(qLower) ||
                            pkg.cityShort.toLowerCase().includes(qLower) ||
                            pkg.searchKeyword.toLowerCase().includes(qLower)
                        );
                  const packagesToDisplay =
                    matchingPackages.length > 0
                      ? matchingPackages
                      : CURATED_COMPLETE_PACKAGES.slice(0, 6);

                  const iataByKeyword: Record<string, string> = {
                    Bangkok: 'BKK',
                    Palma: 'PMI',
                    Teneriffa: 'TFS',
                    Málaga: 'AGP',
                    Antalya: 'AYT',
                    Istanbul: 'SAW',
                    Izmir: 'ADB',
                    Rom: 'FCO',
                    Neapel: 'NAP',
                    Sizilien: 'CTA',
                    Hurghada: 'HRG',
                    'New York': 'JFK',
                    Dubai: 'DXB',
                  };

                  return packagesToDisplay.map((pkg) => {
                    const pkgLinks = buildProviderBookingLinks({
                      originCode,
                      destCode: iataByKeyword[pkg.searchKeyword] || 'PMI',
                      destCity: pkg.cityShort,
                      hotelName: pkg.cityShort,
                      carrierName: 'Lufthansa',
                      departureDateStr: selectedDateStr,
                      durationNights: pkg.nights,
                      travelers,
                      userCurrency,
                      affiliateConfig,
                      travelMode: activeTravelMode,
                    });

                    return (
                      <div
                        key={pkg.id}
                        onClick={() => handleSelectCompletePackage(pkg)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleSelectCompletePackage(pkg);
                          }
                        }}
                        className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl p-4 transition-colors cursor-pointer flex flex-col justify-between border border-slate-800"
                      >
                        <div>
                          <div className="flex items-center justify-between text-xs text-slate-400">
                            <span>
                              {pkg.country} <span aria-hidden="true">·</span> {pkg.nights} Nächte
                            </span>
                            <span className="font-mono text-emerald-400 font-semibold tabular-nums">
                              Richtwert (Tiefpreis-Sortierung)
                            </span>
                          </div>

                          <h3 className="text-base sm:text-lg font-bold text-white mt-1 leading-snug">
                            {pkg.days} Tage {pkg.cityShort}{' '}
                            <span className="text-emerald-400 font-mono tabular-nums whitespace-nowrap">
                              ab {formatCatalogPrice(pkg.priceEurPerPerson, userCurrency)}
                            </span>
                          </h3>

                          <p className="text-xs text-slate-300 mt-1.5">
                            {pkg.boardLabel} · Freie Hotelwahl beim Anbieter
                          </p>
                        </div>

                        <div
                          className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between gap-2 text-xs"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            onClick={() => handleSelectCompletePackage(pkg)}
                            className="text-slate-200 hover:text-white font-semibold cursor-pointer"
                          >
                            Im Rechner öffnen →
                          </button>
                          <a
                            href={pkgLinks.bestDealDirectUrl}
                            target="_blank"
                            rel="sponsored noopener noreferrer"
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-md transition-colors inline-flex items-center gap-1.5 whitespace-nowrap"
                          >
                            <span>Günstigster Preis ({pkgLinks.bestDealProviderName})</span>
                            <ExternalLink className="w-3 h-3 shrink-0" />
                          </a>
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>

            {/* Official Expedia Live Search Widget + CHECK24 Package Search Widget + Partner Banners */}
            <Check24PackageWidget
              partnerId={affiliateConfig.customCheck24Url || '1176801'}
              fallbackDirectUrl={searchPreviewLinks.check24HolidayUrl}
              expediaCamref={affiliateConfig.customExpediaUrl || '1100l6tjov'}
              expediaDirectUrl={searchPreviewLinks.expediaPackageUrl}
              expediaFlightDirectUrl={searchPreviewLinks.expediaFlightUrl}
              discoverCarsDirectUrl={searchPreviewLinks.rentalCarUrl}
              tuiCamperDirectUrl={searchPreviewLinks.tuiCamperUrl}
              camperDaysDirectUrl={searchPreviewLinks.camperDaysUrl}
              campingInfoDirectUrl={searchPreviewLinks.campingInfoUrl}
              asiReisenDirectUrl={searchPreviewLinks.snowTrexUrl}
              destinationCity={activeDestination.city}
            />
          </div>
        </section>

        {/* Section 01: Everywhere Best-Deal Explorer Grid */}
        <section id="entdecker" className="py-12">
          <div className="max-w-[1280px] mx-auto px-6">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
              <div>
                <p className="text-xs font-medium text-slate-500">
                  01. „Überall“-Tiefpreis-Ranking ab {activeHub.name} <span aria-hidden="true">·</span>{' '}
                  {enrichedDestinations.length} Reiseziele im Budget ({userCurrency})
                </p>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mt-1 text-balance">
                  {isCampingOrNatureActive
                    ? `Alle Natur- & Camping-Regionen sortiert nach günstigstem Preis (${durationNights} Nächte)`
                    : `Alle Destinationen sortiert nach günstigstem Richtpreis (Flug + ${durationNights} Nächte Unterkunft)`}
                </h2>
              </div>

              {/* Filter & Sort Controls */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Region Segmented Control */}
                <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-lg overflow-x-auto">
                  {(
                    [
                      'Alle',
                      'Camping & Natur',
                      'Mittelmeer',
                      'Atlantik & Inseln',
                      'Balkan & Osteuropa',
                      'Städtetrip',
                      'Fernreise-Budget',
                    ] as const
                  ).map((reg) => (
                    <button
                      key={reg}
                      type="button"
                      onClick={() => setSelectedRegion(reg)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        selectedRegion === reg
                          ? reg === 'Camping & Natur'
                            ? 'bg-emerald-700 text-white shadow-2xs'
                            : 'bg-white text-slate-900 shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {reg}
                    </button>
                  ))}
                </div>

                {/* Sort Dropdown */}
                <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-3 py-1.5">
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <select
                    aria-label="Sortierung wählen"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortStrategy)}
                    className="text-xs font-semibold text-slate-800 bg-transparent focus:outline-none cursor-pointer"
                  >
                    <option value="lowest_total">Sortierung: Günstigster Gesamtpreis</option>
                    <option value="biggest_discount">Sortierung: Höchste Ersparnis (%)</option>
                    <option value="cheapest_local">Sortierung: Günstigste Nebenkosten vor Ort</option>
                    <option value="warmest_weather">Sortierung: Wärmstes Reisewetter</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Dedicated Camping, Wohnmobil & Wander-/Naturreisen Partner Hub when "Camping & Natur" is selected */}
            {isCampingOrNatureActive && (
              <div className="mb-8 bg-emerald-950 text-white rounded-2xl p-5 border border-emerald-800 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div>
                    <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                      Spezial-Rubrik aktiv: Camping, Wohnmobil, Wandern & Naturreisen
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold text-white mt-0.5">
                      Alle Karten & Buttons leiten Sie jetzt direkt zu camping.info, ASI Reisen, CamperDays & TUI Camper
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRegion('Alle');
                      if (
                        ['camping', 'wandern', 'camper', 'wohnmobil', 'natur', 'trekking'].includes(
                          searchQuery.trim().toLowerCase()
                        )
                      ) {
                        setSearchQuery('');
                      }
                    }}
                    className="px-3 py-1.5 bg-emerald-900 hover:bg-emerald-800 text-emerald-100 text-xs font-semibold rounded-lg border border-emerald-700 transition-colors cursor-pointer self-start sm:self-auto shrink-0"
                  >
                    Zurück zu Flug & Hotel ×
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 text-xs">
                  <a
                    href={searchPreviewLinks.campingInfoUrl}
                    target="_blank"
                    rel="sponsored noopener noreferrer"
                    className="bg-slate-900/90 hover:bg-slate-900 border border-emerald-700/60 rounded-xl p-4 flex flex-col justify-between transition-colors"
                  >
                    <div>
                      <span className="text-[11px] font-mono text-emerald-400 font-semibold">
                        1. Campingplätze & Glamping
                      </span>
                      <h4 className="text-base font-bold text-white mt-1">camping.info</h4>
                      <p className="text-slate-300 mt-1 leading-relaxed">
                        Über 23.000 Campingplätze, Stellplätze & Mobilheime in Deutschland, Italien, Spanien & ganz Europa.
                      </p>
                    </div>
                    <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between text-emerald-400 font-semibold">
                      <span>Günstigste Plätze finden</span>
                      <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                    </div>
                  </a>

                  <a
                    href={searchPreviewLinks.snowTrexUrl}
                    target="_blank"
                    rel="sponsored noopener noreferrer"
                    className="bg-slate-900/90 hover:bg-slate-900 border border-emerald-700/60 rounded-xl p-4 flex flex-col justify-between transition-colors"
                  >
                    <div>
                      <span className="text-[11px] font-mono text-emerald-400 font-semibold">
                        2. Wandern, Trekking & Skiwandern
                      </span>
                      <h4 className="text-base font-bold text-white mt-1">ASI Reisen</h4>
                      <p className="text-slate-300 mt-1 leading-relaxed">
                        Geführte & individuelle Wanderreisen, Trekkingreisen, Bergtouren und Skiwanderungen weltweit.
                      </p>
                    </div>
                    <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between text-emerald-400 font-semibold">
                      <span>Wander- & Naturreisen</span>
                      <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                    </div>
                  </a>

                  <a
                    href={searchPreviewLinks.camperDaysUrl}
                    target="_blank"
                    rel="sponsored noopener noreferrer"
                    className="bg-slate-900/90 hover:bg-slate-900 border border-emerald-700/60 rounded-xl p-4 flex flex-col justify-between transition-colors"
                  >
                    <div>
                      <span className="text-[11px] font-mono text-emerald-400 font-semibold">
                        3. Wohnmobil-Preisvergleich
                      </span>
                      <h4 className="text-base font-bold text-white mt-1">CamperDays</h4>
                      <p className="text-slate-300 mt-1 leading-relaxed">
                        Testsieger-Preisvergleich für Wohnmobile & Kastenwagen mit 100 % transparenter Versicherung.
                      </p>
                    </div>
                    <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between text-emerald-400 font-semibold">
                      <span>Günstigste Camper</span>
                      <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                    </div>
                  </a>

                  <a
                    href={searchPreviewLinks.tuiCamperUrl}
                    target="_blank"
                    rel="sponsored noopener noreferrer"
                    className="bg-slate-900/90 hover:bg-slate-900 border border-emerald-700/60 rounded-xl p-4 flex flex-col justify-between transition-colors"
                  >
                    <div>
                      <span className="text-[11px] font-mono text-emerald-400 font-semibold">
                        4. Wohnmobile & Camper
                      </span>
                      <h4 className="text-base font-bold text-white mt-1">TUI Camper</h4>
                      <p className="text-slate-300 mt-1 leading-relaxed">
                        Wohnmobile & Camper mit Qualitätsgarantie in Europa, Nordamerika, Australien & weltweit mieten.
                      </p>
                    </div>
                    <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between text-emerald-400 font-semibold">
                      <span>Zu TUI Camper</span>
                      <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                    </div>
                  </a>
                </div>
              </div>
            )}

            {/* Empty State if budget filter is too strict */}
            {enrichedDestinations.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-xl p-12 text-center max-w-lg mx-auto">
                <Compass className="w-8 h-8 text-slate-400 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-900">
                  Keine Reise unter{' '}
                  {maxBudgetPerPerson !== null
                    ? formatMoney(maxBudgetPerPerson, userCurrency)
                    : 'diesem Filter'}{' '}
                  für {durationNights} Nächte gefunden
                </h3>
                <p className="text-sm text-slate-600 mt-1">
                  Erhöhen Sie das Maximalbudget oder aktivieren Sie Nachbarflughäfen und
                  Split-Ticketing, um wieder alle Tiefpreise anzuzeigen.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setMaxBudgetPerPerson(null);
                    setSelectedRegion('Alle');
                    setSearchQuery('');
                    setIncludeNearbyAirports(true);
                  }}
                  className="mt-5 px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Filter auf Bestpreis-Standard zurücksetzen
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {enrichedDestinations.map(({ dest, calc }, index) => {
                  const isSelected = dest.id === activeDestination.id;
                  return (
                    <article
                      key={dest.id}
                      className={`bg-white rounded-xl border transition-all flex flex-col justify-between overflow-hidden ${
                        isSelected
                          ? 'border-blue-600 ring-2 ring-blue-600/20'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div>
                        {/* Visual Artwork Header */}
                        <div
                          onClick={() =>
                            handleSelectDestinationCard(dest.id, 'routenoptimierer')
                          }
                          className="cursor-pointer"
                        >
                          <DestinationArtwork
                            destination={dest}
                            className="aspect-[16/10] w-full"
                          />
                        </div>

                        {/* Card Content */}
                        <div className="p-5">
                          {/* Quiet unboxed metadata line */}
                          <div className="flex items-center justify-between text-xs text-slate-500">
                            <span>
                              #{index + 1} Tiefpreis-Rang <span aria-hidden="true">·</span>{' '}
                              {isCampingOrNatureActive
                                ? `Natur & Camping (${dest.country})`
                                : `Ab ${calc.chosenRoute.outbound.originCode}`}
                            </span>
                            <span className="font-mono font-semibold text-emerald-700 tabular-nums">
                              {isCampingOrNatureActive
                                ? `Ø ${dest.avgTempMayOct} °C`
                                : `-${calc.savingsPct}% unter 20-Wochen-Ø`}
                            </span>
                          </div>

                          <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                            {dest.tagline}
                          </p>

                          {/* Transparent Breakdown Table inside Card */}
                          <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs">
                            {isCampingOrNatureActive ? (
                              <>
                                <div className="flex items-center justify-between text-slate-600">
                                  <span>Campingplatz / Stellplatz (camping.info)</span>
                                  <span className="font-mono font-medium text-emerald-700 tabular-nums">
                                    ab {formatMoney(calc.campingPitchPerNightPP, userCurrency)} / Nacht p.P.
                                  </span>
                                </div>
                                <div className="flex items-center justify-between text-slate-600">
                                  <span>Wandern & Trekking (ASI Reisen)</span>
                                  <span className="font-medium text-slate-900">
                                    Geführt & individuell
                                  </span>
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="flex items-center justify-between text-slate-600">
                                  <span>
                                    Hin- & Rückflug ({calc.chosenRoute.outbound.carrier})
                                  </span>
                                  <span className="font-mono font-medium text-slate-900 tabular-nums">
                                    ab {formatMoney(calc.flightTotalPP, userCurrency)} p.P.
                                  </span>
                                </div>
                                <div className="flex items-center justify-between text-slate-600">
                                  <span className="truncate pr-2">
                                    {durationNights} Nächte 3★–4★ Unterkunft (Tiefpreis)
                                  </span>
                                  <span className="font-mono font-medium text-slate-900 tabular-nums shrink-0">
                                    ab {formatMoney(calc.hotelTotalPP, userCurrency)} p.P.
                                  </span>
                                </div>
                              </>
                            )}
                            <div className="flex items-center justify-between text-slate-500">
                              <span>Restaurant-Index & Tagesticket vor Ort</span>
                              <span className="font-mono tabular-nums">
                                Ø {formatMoney(dest.mealCostIndex, userCurrency, { exactDecimals: true })} · ÖPNV{' '}
                                {formatMoney(dest.localTransitDayPass, userCurrency, { exactDecimals: true })}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Card Footer with Best-Price Orientation & Mode-Aware Partner Buttons */}
                      <div className="px-5 py-4 bg-slate-50/80 border-t border-slate-100 space-y-3">
                        <div className="pb-2.5 border-b border-slate-200/70">
                          <span className="text-[11px] font-medium text-slate-500 block">
                            {isCampingOrNatureActive
                              ? `Camping- & Natur-Richtpreis (${durationNights} Nächte Stellplatz p.P.):`
                              : `Richtpreis (Flug + ${durationNights} Nächte Unterkunft — Tiefpreis-Sortierung):`}
                          </span>
                          <div className="text-base font-bold text-slate-900 mt-0.5 flex flex-wrap items-baseline justify-between gap-1">
                            <span>
                              {durationNights + 1} Tage {dest.city.split('&')[0].trim()}
                            </span>
                            <span className="text-xl font-mono font-bold text-emerald-700 tabular-nums">
                              ab {formatCatalogPrice(calc.totalPerPerson, userCurrency)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-[11px] text-slate-500 mt-0.5">
                            <span>
                              {durationNights} Nächte · Für {travelers} Pers. gesamt:{' '}
                              <strong className="font-mono text-slate-700 tabular-nums">
                                ab {formatCatalogPrice(calc.totalPerPerson * travelers, userCurrency)}
                              </strong>
                            </span>
                            <span className="text-emerald-700 font-semibold">
                              Sortiert nach Tiefpreis
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs text-slate-500">
                            {isCampingOrNatureActive
                              ? `Partner: camping.info · ASI · CamperDays`
                              : `Abflug ab ${calc.chosenRoute.outbound.originCode} (${calc.chosenRoute.outbound.carrier})`}
                          </span>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                handleSelectDestinationCard(dest.id, 'preiskalender')
                              }
                              title="Preiskalender öffnen"
                              className="p-2 text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg transition-colors cursor-pointer"
                            >
                              <Calendar className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                handleSelectDestinationCard(dest.id, 'routenoptimierer')
                              }
                              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5 ${
                                isSelected
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-slate-900 text-white hover:bg-slate-800'
                              }`}
                            >
                              <span>{isSelected ? 'Aktiv' : 'Anpassen'}</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Direct Booking Buttons right on the Destination Card (Strictly Mode-Aware!) */}
                        {(() => {
                          const cardLinks = buildProviderBookingLinks({
                            originCode: calc.chosenRoute.outbound.originCode,
                            destCode: calc.chosenRoute.outbound.destCode,
                            destCity: dest.city,
                            hotelName: dest.city,
                            carrierName: calc.chosenRoute.outbound.carrier,
                            departureDateStr: calc.lowestDateStr,
                            durationNights,
                            travelers,
                            userCurrency,
                            affiliateConfig,
                            travelMode: activeTravelMode,
                          });

                          if (isCampingOrNatureActive) {
                            return (
                              <div className="pt-2.5 border-t border-slate-200/70 space-y-1.5">
                                <a
                                  href={cardLinks.campingInfoUrl}
                                  target="_blank"
                                  rel="sponsored noopener noreferrer"
                                  className="w-full py-2 px-4 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
                                >
                                  <span>Campingplätze in {dest.country} bei camping.info</span>
                                  <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                                </a>
                                <div className="grid grid-cols-3 gap-1.5">
                                  <a
                                    href={cardLinks.snowTrexUrl}
                                    target="_blank"
                                    rel="sponsored noopener noreferrer"
                                    className="py-1.5 px-2 bg-amber-500 hover:bg-amber-600 text-slate-950 text-[11px] font-semibold rounded-md text-center transition-colors truncate"
                                  >
                                    ASI Wandern
                                  </a>
                                  <a
                                    href={cardLinks.camperDaysUrl}
                                    target="_blank"
                                    rel="sponsored noopener noreferrer"
                                    className="py-1.5 px-2 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-semibold rounded-md text-center transition-colors truncate"
                                  >
                                    CamperDays
                                  </a>
                                  <a
                                    href={cardLinks.tuiCamperUrl}
                                    target="_blank"
                                    rel="sponsored noopener noreferrer"
                                    className="py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-white text-[11px] font-semibold rounded-md text-center transition-colors truncate"
                                  >
                                    TUI Camper
                                  </a>
                                </div>
                              </div>
                            );
                          }

                          return (
                            <div className="pt-2.5 border-t border-slate-200/70 space-y-1.5">
                              <a
                                href={cardLinks.expediaPackageUrl}
                                target="_blank"
                                rel="sponsored noopener noreferrer"
                                className="w-full py-2 px-4 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
                              >
                                <span>Günstigste Hotels in {dest.city.split('&')[0].trim()} (Expedia)</span>
                                <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                              </a>
                              <div className="grid grid-cols-3 gap-1.5">
                                <a
                                  href={cardLinks.expediaFlightUrl}
                                  target="_blank"
                                  rel="sponsored noopener noreferrer"
                                  className="py-1.5 px-2 bg-amber-500 hover:bg-amber-600 text-slate-950 text-[11px] font-semibold rounded-md text-center transition-colors truncate"
                                >
                                  Expedia Flüge
                                </a>
                                <a
                                  href={cardLinks.check24HolidayUrl}
                                  target="_blank"
                                  rel="sponsored noopener noreferrer"
                                  className="py-1.5 px-2 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-semibold rounded-md text-center transition-colors truncate"
                                >
                                  CHECK24
                                </a>
                                <a
                                  href={cardLinks.tripComUrl}
                                  target="_blank"
                                  rel="sponsored noopener noreferrer"
                                  className="py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-white text-[11px] font-semibold rounded-md text-center transition-colors truncate"
                                >
                                  Trip.com
                                </a>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Section 02: Interactive Monthly Price Heatmap Calendar */}
        <PriceCalendarSection
          destination={activeDestination}
          selectedMonth={selectedMonth}
          onSelectMonth={setSelectedMonth}
          selectedDateStr={selectedDateStr}
          onSelectDate={(dateStr) => {
            setSelectedDateStr(dateStr);
          }}
          durationNights={durationNights}
          luggageFeePerPerson={
            activeDestCalc.chosenRoute.luggageFees[luggage]
          }
          includeNearbyAirports={includeNearbyAirports}
          includeSplitTickets={includeSplitTickets}
          originCode={originCode}
          userCurrency={userCurrency}
          travelers={travelers}
          affiliateConfig={affiliateConfig}
          isCampingMode={isCampingOrNatureActive}
        />

        {/* Section 03: Route & Split-Ticket Optimizer + Hotel / Camping Configurator */}
        <RouteOptimizerSection
          destination={activeDestination}
          originCode={originCode}
          selectedDateStr={selectedDateStr}
          durationNights={durationNights}
          travelers={travelers}
          luggage={luggage}
          onSelectLuggage={setLuggage}
          selectedRouteId={selectedRouteId}
          onSelectRoute={setSelectedRouteId}
          selectedHotelId={selectedHotelId}
          onSelectHotel={setSelectedHotelId}
          onSavePriceAlert={handleTogglePriceAlert}
          onOpenBookingSummary={() => {
            setIsBookingModalOpen(true);
          }}
          isAlertSaved={isCurrentDestSaved}
          userCurrency={userCurrency}
          affiliateConfig={affiliateConfig}
          isCampingMode={isCampingOrNatureActive}
          onToggleCampingMode={(camping) => {
            setSelectedRegion(camping ? 'Camping & Natur' : 'Alle');
            if (!camping && ['camping', 'wandern', 'camper', 'wohnmobil', 'natur', 'trekking'].includes(searchQuery.trim().toLowerCase())) {
              setSearchQuery('');
            }
          }}
        />

        {/* Section 04: Interactive Affiliate & Monetization Cockpit (Hidden in Public Customer Mode) */}
        {!isPublicCustomerView && (
          <AffiliateSetupSection
            affiliateConfig={affiliateConfig}
            onSaveAffiliateConfig={handleSaveAffiliateConfig}
            userCurrency={userCurrency}
            activeDestinationCity={activeDestination.city}
            sampleLinks={buildProviderBookingLinks({
              originCode: activeDestCalc.chosenRoute.outbound.originCode,
              destCode: activeDestCalc.chosenRoute.outbound.destCode,
              destCity: activeDestination.city,
              hotelName: activeDestination.city,
              carrierName: activeDestCalc.chosenRoute.outbound.carrier,
              departureDateStr: selectedDateStr,
              durationNights,
              travelers,
              userCurrency,
              affiliateConfig,
              travelMode: activeTravelMode,
            })}
          />
        )}

        {/* Section 05: Transparent Deal Methodology & Quantified Proof */}
        <section id="sparregeln" className="py-12 border-t border-slate-200 bg-slate-50">
          <div className="max-w-[1280px] mx-auto px-6">
            <div className="max-w-2xl mb-8">
              <p className="text-xs font-medium text-slate-500">
                04. Preis-Algorithmus & Nachweisbare Einsparungen
              </p>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 mt-1 text-balance">
                Wie CleverEntdeckt, Sparflug & Reiseradar systematisch die günstigsten Angebote findet
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white border border-slate-200 rounded-xl p-5">
                <div className="text-xs font-mono font-semibold text-blue-600 tabular-nums">
                  Hebel 01 · Ø {formatMoney(68, userCurrency, { showMinus: true })} pro Buchung
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  180-km Nachbarflughafen-Arbitrage
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Große Drehkreuze wie Frankfurt (FRA), München (MUC) oder Zürich (ZRH) berechnen
                  hohe Passagier- und Sicherheitsgebühren. Unser Rechner bezieht Regionalflughäfen
                  wie Hahn, Memmingen, Weeze oder Basel automatisch ein — und rechnet das
                  ÖPNV-Bahnticket direkt in den Richtpreis ein.
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-5">
                <div className="text-xs font-mono font-semibold text-blue-600 tabular-nums">
                  Hebel 02 · Automatische Tiefpreis-Sortierung
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  Direkt zum günstigsten Live-Angebot
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Unsere Partner-Links übergeben nicht nur Reiseziel, Datum und Personenanzahl, sondern aktivieren beim Partner direkt die Sortierung „Niedrigster Preis zuerst“ — und leiten Camping-, Wohnmobil- und Wander-Anfragen gezielt an camping.info, ASI Reisen, CamperDays und TUI Camper weiter.
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-5">
                <div className="text-xs font-mono font-semibold text-blue-600 tabular-nums">
                  Hebel 03 · 0 % Fremdwährungs-Falle (DCC)
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  Wahre Gepäck- & Wechselkurs-Kalkulation
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Ob Sie in CHF, USD, GBP oder EUR zahlen: Unser integrierter Währungsrechner zeigt
                  alle Zielpreise sowohl in Ihrer Heimatwährung als auch in der Landeswährung des
                  Reiseziels (z.B. PLN, HUF, TRY, MAD) und schützt vor teuren
                  Sofort-Umrechnungsaufschlägen am Terminal.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Quiet Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 px-6 text-xs text-slate-500">
        <div className="max-w-[1280px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <strong className="text-slate-800">CleverEntdeckt, Sparflug & Reiseradar</strong> · Unabhängige
            Tiefpreis-Reisesuchmaschine ohne versteckte Buchungsgebühren
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <button
              type="button"
              onClick={() => scrollToSection('entdecker')}
              className="hover:text-slate-900 cursor-pointer"
            >
              Überall-Suche
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('waehrungsrechner')}
              className="hover:text-slate-900 cursor-pointer"
            >
              Währungsrechner
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('preiskalender')}
              className="hover:text-slate-900 cursor-pointer"
            >
              Preiskalender
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('routenoptimierer')}
              className="hover:text-slate-900 cursor-pointer"
            >
              Split-Ticket-Rechner
            </button>
            <button
              type="button"
              onClick={() => setIsPublicCustomerView((prev) => !prev)}
              className="text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              {isPublicCustomerView ? 'Inhaber-Setup öffnen' : 'Besucher-Ansicht testen'}
            </button>
          </div>
        </div>
      </footer>

      {/* Slide-Over Drawer: Saved Price Alerts (Preis-Wächter) */}
      {isAlertDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-2xs">
          <div className="w-full max-w-md bg-white h-full shadow-xl border-l border-slate-200 flex flex-col justify-between p-6 overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Ihr Preis-Wächter ({priceAlerts.length})
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Überwachte Strecken & Tiefpreis-Alarme in {userCurrency}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAlertDrawerOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {priceAlerts.length === 0 ? (
                <div className="py-12 text-center">
                  <Bell className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-800">
                    Noch keine Preis-Alarme gespeichert
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Speichern Sie beliebige Routen im Optimierer, um Tarifstürze sofort zu sehen.
                  </p>
                </div>
              ) : (
                <div className="mt-4 space-y-3">
                  {priceAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="p-4 rounded-xl border border-slate-200 bg-slate-50/70"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-xs text-slate-500">
                            Ab {alert.originCode} · {alert.durationNights} Nächte · {alert.month}
                          </span>
                          <h4 className="text-sm font-bold text-slate-900 mt-0.5">
                            {alert.destinationName}
                          </h4>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setPriceAlerts((prev) => prev.filter((a) => a.id !== alert.id))
                          }
                          aria-label="Alarm löschen"
                          className="text-slate-400 hover:text-red-600 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-slate-200/70 flex items-center justify-between text-xs">
                        <div>
                          <span className="text-slate-500">Richtpreis: </span>
                          <strong className="font-mono text-emerald-700 font-bold tabular-nums">
                            ab {formatMoney(alert.currentBestPrice, userCurrency)} p.P.
                          </strong>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveDestId(alert.destinationId);
                            setOriginCode(alert.originCode);
                            setIsAlertDrawerOpen(false);
                            const el = document.getElementById('routenoptimierer');
                            if (el) el.scrollIntoView({ behavior: 'smooth' });
                          }}
                          className="text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
                        >
                          Deal laden →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setIsAlertDrawerOpen(false)}
                className="w-full py-2.5 px-4 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Schließen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Direct Provider Booking Hub */}
      {isBookingModalOpen && (() => {
        const selectedHotelObj =
          activeDestination.hotels.find((h) => h.id === selectedHotelId) ||
          activeDestination.hotels[0];
        const modalLinks = buildProviderBookingLinks({
          originCode: activeDestCalc.chosenRoute.outbound.originCode,
          destCode: activeDestCalc.chosenRoute.outbound.destCode,
          destCity: activeDestination.city,
          hotelName: activeDestination.city,
          carrierName: activeDestCalc.chosenRoute.outbound.carrier,
          departureDateStr: selectedDateStr,
          durationNights,
          travelers,
          userCurrency,
          affiliateConfig,
          travelMode: activeTravelMode,
        });

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-2xs overflow-y-auto">
            <div className="bg-white border border-slate-200 rounded-2xl max-w-xl w-full p-6 shadow-2xl my-8">
              <div className="flex items-start justify-between pb-4 border-b border-slate-100">
                <div>
                  <span className="text-xs font-medium text-emerald-700">
                    Direktbuchung bei offiziellen Reiseanbietern ({userCurrency})
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                    {activeDestination.city} ({selectedDateStr} bis {modalLinks.returnDateStr})
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsBookingModalOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="py-4 space-y-5">
                {/* Summary Box */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Flugroute & Airline:</span>
                    <span className="font-semibold text-slate-900">
                      {activeDestCalc.chosenRoute.outbound.originCode} ⇄{' '}
                      {activeDestCalc.chosenRoute.outbound.destCode} (
                      {activeDestCalc.chosenRoute.outbound.carrier})
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Gewählte Kategorie ({durationNights} Nächte):</span>
                    <span className="font-semibold text-slate-900">{selectedHotelObj.category}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline text-sm">
                    <span className="font-bold text-slate-900">
                      Richtpreis ({travelers} Pers.):
                    </span>
                    <span className="text-lg font-mono font-bold text-emerald-700 tabular-nums">
                      ab {formatMoney(activeDestCalc.totalPerPerson * travelers, userCurrency)} (ab{' '}
                      {formatMoney(activeDestCalc.totalPerPerson, userCurrency)} p.P.)
                    </span>
                  </div>
                </div>

                {/* 1. Camping, Camper & Wandern (Highlighted at top when in Camping/Nature mode!) */}
                <div>
                  <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2">
                    Campingplätze, Wanderreisen & Wohnmobile (Spezial-Partner)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <a
                      href={modalLinks.campingInfoUrl}
                      target="_blank"
                      rel="sponsored noopener noreferrer"
                      className="p-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl flex items-center justify-between transition-colors"
                    >
                      <span>camping.info (Campingplätze & Glamping)</span>
                      <ExternalLink className="w-4 h-4 shrink-0" />
                    </a>
                    <a
                      href={modalLinks.snowTrexUrl}
                      target="_blank"
                      rel="sponsored noopener noreferrer"
                      className="p-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold rounded-xl flex items-center justify-between transition-colors"
                    >
                      <span>ASI Reisen (Wander- & Trekkingreisen)</span>
                      <ExternalLink className="w-4 h-4 shrink-0" />
                    </a>
                    <a
                      href={modalLinks.camperDaysUrl}
                      target="_blank"
                      rel="sponsored noopener noreferrer"
                      className="p-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl flex items-center justify-between transition-colors"
                    >
                      <span>CamperDays (Wohnmobil-Preisvergleich)</span>
                      <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                    </a>
                    <a
                      href={modalLinks.tuiCamperUrl}
                      target="_blank"
                      rel="sponsored noopener noreferrer"
                      className="p-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl flex items-center justify-between transition-colors"
                    >
                      <span>TUI Camper (Wohnmobile & Camper)</span>
                      <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                    </a>
                  </div>
                </div>

                {/* 2. Flight, Hotel, Package & Rental Car Providers */}
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                    Flüge, Hotels, Pauschalreisen & Mietwagen (nach Tiefpreis sortiert)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <a
                      href={modalLinks.expediaPackageUrl}
                      target="_blank"
                      rel="sponsored noopener noreferrer"
                      className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-xl flex items-center justify-between transition-colors"
                    >
                      <span>Expedia (Günstigste Hotels zuerst)</span>
                      <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                    </a>
                    <a
                      href={modalLinks.check24HolidayUrl}
                      target="_blank"
                      rel="sponsored noopener noreferrer"
                      className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-xl flex items-center justify-between transition-colors"
                    >
                      <span className="truncate pr-2">CHECK24 Pauschalreisen & Hotels</span>
                      <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                    </a>
                    <a
                      href={modalLinks.abInDenUrlaubUrl}
                      target="_blank"
                      rel="sponsored noopener noreferrer"
                      className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-xl flex items-center justify-between transition-colors"
                    >
                      <span>Ab in den Urlaub (Pauschal & Deals)</span>
                      <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                    </a>
                    <a
                      href={modalLinks.tripComUrl}
                      target="_blank"
                      rel="sponsored noopener noreferrer"
                      className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-xl flex items-center justify-between transition-colors"
                    >
                      <span>Trip.com (Flug- & Kombi-Suche)</span>
                      <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                    </a>
                    <a
                      href={modalLinks.expediaFlightUrl}
                      target="_blank"
                      rel="sponsored noopener noreferrer"
                      className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-xl flex items-center justify-between transition-colors"
                    >
                      <span>Expedia Flugsuche ({activeDestCalc.chosenRoute.outbound.originCode} ⇄ {activeDestCalc.chosenRoute.outbound.destCode})</span>
                      <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                    </a>
                    <a
                      href={modalLinks.rentalCarUrl}
                      target="_blank"
                      rel="sponsored noopener noreferrer"
                      className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-xl flex items-center justify-between transition-colors"
                    >
                      <span>DiscoverCars Mietwagen ({activeDestCalc.chosenRoute.outbound.destCode})</span>
                      <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                    </a>
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 flex items-center gap-1.5 pt-1">
                  <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>
                    Alle Links übergeben automatisch Ihr gewähltes Reisedatum ({selectedDateStr} bis{' '}
                    {modalLinks.returnDateStr}) und sortieren beim Partner nach dem günstigsten verfügbaren Live-Tarif.
                  </span>
                </p>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      if (!isCurrentDestSaved) {
                        handleTogglePriceAlert();
                      }
                    }}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800 cursor-pointer"
                  >
                    {isCurrentDestSaved
                      ? '✓ Im Preis-Wächter gespeichert'
                      : '+ Zusätzlich im Preis-Wächter merken'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsBookingModalOpen(false)}
                    className="px-5 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 cursor-pointer"
                  >
                    Schließen
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
