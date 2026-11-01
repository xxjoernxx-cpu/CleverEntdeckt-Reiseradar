import React, { useState, useMemo } from 'react';
import {
  Search,
  Calendar,
  Users,
  Plane,
  Building2,
  Briefcase,
  ExternalLink,
  CheckCircle2,
  Info,
  Copy,
  Check,
  Car,
  Mountain,
  Tent,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  AlertCircle,
  MapPin,
} from 'lucide-react';
import {
  CLEVERENTDECKT_DESTINATIONS,
  AIRPORT_OPTIONS,
  PrimaryTravelType,
  AddonFilterType,
  resolveDestinationInfo,
  calculateNights,
  formatGermanDate,
  buildVerifiedPartnerOffers,
  trackReiseRadarSearch,
  trackReiseRadarPartnerClick,
} from './data/reiseradarPartners';
import {
  SUPPORTED_CURRENCIES,
  UserCurrencyCode,
  formatMoney,
} from './data/travelData';

function getDefaultDates(): { checkIn: string; checkOut: string } {
  const now = new Date();
  const checkInDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 21);
  const checkOutDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 28);
  const fmt = (d: Date) => {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };
  return { checkIn: fmt(checkInDate), checkOut: fmt(checkOutDate) };
}

export default function App() {
  const defaultDates = useMemo(() => getDefaultDates(), []);

  // Parse URL parameters from CleverEntdeckt country & region guides (e.g. ?ziel=Tuerkei, ?ziel=Side, ?ziel=Spanien, ?ziel=Italien)
  const initialUrlState = useMemo(() => {
    if (typeof window === 'undefined') {
      return {
        travelType: 'pauschal' as PrimaryTravelType,
        presetId: '',
        destinationText: '',
        originCode: 'FRA',
        adults: 2,
        fromGuideParam: '',
      };
    }

    const sp = new URLSearchParams(window.location.search);
    const rawTarget = (
      sp.get('ziel') ||
      sp.get('region') ||
      sp.get('land') ||
      sp.get('country') ||
      sp.get('q') ||
      ''
    ).trim();

    const rawPath = decodeURIComponent(window.location.pathname.replace(/^\/+|\/+$/g, '')).trim();
    const ignoredPaths = new Set(['', 'index.html', 'app']);
    const rawHash = decodeURIComponent(window.location.hash.replace(/^#+/, '')).trim();
    const knownAnchors = new Set(['suche', 'angebote', 'reisefuehrer', 'transparenz', 'waehrung']);

    const effectiveQuery =
      rawTarget ||
      (!ignoredPaths.has(rawPath.toLowerCase()) ? rawPath : '') ||
      (rawHash && !knownAnchors.has(rawHash.toLowerCase()) ? rawHash : '');

    const rawType = (sp.get('reiseart') || sp.get('type') || '').toLowerCase();
    const travelType: PrimaryTravelType =
      rawType === 'hotel' ? 'hotel' : rawType === 'flug' ? 'flug' : 'pauschal';

    const rawOrigin = (sp.get('ab') || sp.get('origin') || 'FRA').trim().toUpperCase();
    const validOrigin = AIRPORT_OPTIONS.some((a) => a.code === rawOrigin) ? rawOrigin : 'FRA';

    const rawAdults = parseInt(sp.get('erwachsene') || sp.get('adults') || '2', 10);
    const validAdults = !isNaN(rawAdults) && rawAdults >= 1 && rawAdults <= 6 ? rawAdults : 2;

    // Neutral start page when called without URL parameters (Requirement 1)
    if (!effectiveQuery) {
      return {
        travelType,
        presetId: '',
        destinationText: '',
        originCode: validOrigin,
        adults: validAdults,
        fromGuideParam: '',
      };
    }

    const lower = effectiveQuery.toLowerCase();
    // Map CleverEntdeckt country & regional guides accurately
    if (lower.includes('side') || lower.includes('kumköy') || lower.includes('kumkoey')) {
      const preset = CLEVERENTDECKT_DESTINATIONS.find((d) => d.id === 'side-kumkoey-antalya')!;
      return {
        travelType,
        presetId: preset.id,
        destinationText: preset.label,
        originCode: validOrigin,
        adults: validAdults,
        fromGuideParam: effectiveQuery,
      };
    }

    if (
      lower === 'tuerkei' ||
      lower === 'turkei' ||
      lower === 'türkei' ||
      lower === 'turkey' ||
      lower.includes('antalya') ||
      lower.includes('riviera')
    ) {
      const preset = CLEVERENTDECKT_DESTINATIONS.find((d) => d.id === 'antalya-belek-lara')!;
      return {
        travelType,
        presetId: preset.id,
        destinationText: preset.label,
        originCode: validOrigin,
        adults: validAdults,
        fromGuideParam: effectiveQuery,
      };
    }

    if (lower === 'spanien' || lower === 'spain' || lower.includes('mallorca')) {
      const preset = CLEVERENTDECKT_DESTINATIONS.find((d) => d.id === 'mallorca-balearen')!;
      return {
        travelType,
        presetId: preset.id,
        destinationText: preset.label,
        originCode: validOrigin,
        adults: validAdults,
        fromGuideParam: effectiveQuery,
      };
    }

    if (lower === 'italien' || lower === 'italy' || lower.includes('rom')) {
      const preset = CLEVERENTDECKT_DESTINATIONS.find((d) => d.id === 'rom-latium')!;
      return {
        travelType,
        presetId: preset.id,
        destinationText: preset.label,
        originCode: validOrigin,
        adults: validAdults,
        fromGuideParam: effectiveQuery,
      };
    }

    const matchedPreset = CLEVERENTDECKT_DESTINATIONS.find(
      (d) =>
        d.label.toLowerCase().includes(lower) ||
        d.searchTerm.toLowerCase().includes(lower) ||
        d.country.toLowerCase().includes(lower)
    );

    if (matchedPreset) {
      return {
        travelType,
        presetId: matchedPreset.id,
        destinationText: matchedPreset.label,
        originCode: validOrigin,
        adults: validAdults,
        fromGuideParam: effectiveQuery,
      };
    }

    return {
      travelType,
      presetId: 'custom',
      destinationText: effectiveQuery,
      originCode: validOrigin,
      adults: validAdults,
      fromGuideParam: effectiveQuery,
    };
  }, []);

  // Form State
  const [travelType, setTravelType] = useState<PrimaryTravelType>(initialUrlState.travelType);
  const [selectedPresetId, setSelectedPresetId] = useState<string>(initialUrlState.presetId);
  const [destinationText, setDestinationText] = useState<string>(initialUrlState.destinationText);
  const [originCode, setOriginCode] = useState<string>(initialUrlState.originCode);
  const [checkInDate, setCheckInDate] = useState<string>(defaultDates.checkIn);
  const [checkOutDate, setCheckOutDate] = useState<string>(defaultDates.checkOut);
  const [adults, setAdults] = useState<number>(initialUrlState.adults);
  const [childrenAges, setChildrenAges] = useState<number[]>([]);
  const [boardFilter, setBoardFilter] = useState<string>('Beliebig');

  // Results & Filter State
  const [addonFilter, setAddonFilter] = useState<AddonFilterType>('alle_passenden');
  const [sortOrder, setSortOrder] = useState<'deeplink_first' | 'alphabetical'>('deeplink_first');
  const [formError, setFormError] = useState<string>('');
  const [copiedPartnerId, setCopiedPartnerId] = useState<string | null>(null);
  const [guideBannerDismissed, setGuideBannerDismissed] = useState<boolean>(false);

  // Optional Currency Helper State
  const [isCurrencyOpen, setIsCurrencyOpen] = useState<boolean>(false);
  const [currencyAmountEur, setCurrencyAmountEur] = useState<number>(500);
  const [targetCurrency, setTargetCurrency] = useState<UserCurrencyCode>('TRY');

  const hasActiveDestination = Boolean(
    destinationText.trim().length > 0 ||
      (selectedPresetId && selectedPresetId !== 'custom')
  );

  const resolvedDest = useMemo(
    () => resolveDestinationInfo(destinationText, selectedPresetId),
    [destinationText, selectedPresetId]
  );

  const durationNights = useMemo(
    () => calculateNights(checkInDate, checkOutDate),
    [checkInDate, checkOutDate]
  );

  const allPartnerOffers = useMemo(
    () =>
      buildVerifiedPartnerOffers({
        travelType,
        destinationText,
        selectedPresetId,
        originCode,
        checkInDate,
        checkOutDate,
        adults,
        childrenAges,
        boardFilter,
      }),
    [
      travelType,
      destinationText,
      selectedPresetId,
      originCode,
      checkInDate,
      checkOutDate,
      adults,
      childrenAges,
      boardFilter,
    ]
  );

  const filteredAndSortedOffers = useMemo(() => {
    let list = allPartnerOffers.filter((offer) => {
      if (addonFilter === 'inkl_mietwagen') {
        return offer.isSpecialistAddon === 'mietwagen';
      }
      if (addonFilter === 'aktiv_wandern') {
        return offer.isSpecialistAddon === 'wandern';
      }
      if (addonFilter === 'camping_camper') {
        return offer.isSpecialistAddon === 'camping';
      }
      // Standard: show ONLY primary providers matching the selected travelType
      return offer.primaryForTypes.includes(travelType);
    });

    if (sortOrder === 'alphabetical') {
      list = [...list].sort((a, b) => a.partnerName.localeCompare(b.partnerName, 'de'));
    } else {
      // Sort by technical parameter transfer support first (never by affiliate commission)
      list = [...list].sort(
        (a, b) => Number(b.supportsFullDeepLink) - Number(a.supportsFullDeepLink)
      );
    }

    return list;
  }, [allPartnerOffers, addonFilter, travelType, sortOrder]);

  const handleSelectPreset = (presetId: string) => {
    if (!presetId) {
      setSelectedPresetId('');
      setDestinationText('');
      return;
    }
    setSelectedPresetId(presetId);
    const found = CLEVERENTDECKT_DESTINATIONS.find((d) => d.id === presetId);
    if (found) {
      setDestinationText(found.label);
      setFormError('');
      if (found.country === 'Türkei') {
        setTargetCurrency('TRY');
      }
    }
  };

  const handleDestinationInputChange = (val: string) => {
    setDestinationText(val);
    setSelectedPresetId(val.trim() ? 'custom' : '');
    if (val.trim()) {
      setFormError('');
    }
  };

  const handleSetChildrenCount = (newCount: number) => {
    const clamped = Math.max(0, Math.min(4, newCount));
    setChildrenAges((prev) => {
      if (clamped > prev.length) {
        return [...prev, ...Array(clamped - prev.length).fill(8)];
      }
      return prev.slice(0, clamped);
    });
  };

  const handleChildAgeChange = (index: number, age: number) => {
    setChildrenAges((prev) => prev.map((a, idx) => (idx === index ? age : a)));
  };

  const handleCheckInChange = (newCheckIn: string) => {
    setCheckInDate(newCheckIn);
    if (newCheckIn && checkOutDate && newCheckIn >= checkOutDate) {
      const d = new Date(newCheckIn);
      if (!isNaN(d.getTime())) {
        d.setDate(d.getDate() + 7);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        setCheckOutDate(`${yyyy}-${mm}-${dd}`);
      }
    }
    setFormError('');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destinationText.trim()) {
      setFormError('Bitte wähle ein Reiseziel aus oder gib dein Wunschziel ein.');
      return;
    }
    if (!checkInDate || !checkOutDate || checkOutDate <= checkInDate) {
      setFormError('Das Abreisedatum muss nach dem Anreisedatum liegen.');
      return;
    }

    setFormError('');
    setAddonFilter('alle_passenden');
    trackReiseRadarSearch(travelType, resolvedDest.searchTerm);

    const resultsEl = document.getElementById('angebote');
    if (resultsEl) {
      resultsEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCopyDestination = (partnerId: string, textToCopy: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard && textToCopy) {
      navigator.clipboard.writeText(textToCopy).catch(() => {});
      setCopiedPartnerId(partnerId);
      setTimeout(() => setCopiedPartnerId(null), 2500);
    }
  };

  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const selectedAirportObj =
    AIRPORT_OPTIONS.find((a) => a.code === originCode) || AIRPORT_OPTIONS[0];

  const travelTypeLabel =
    travelType === 'pauschal'
      ? 'Pauschalreise (Flug + Hotel)'
      : travelType === 'hotel'
      ? 'Hotel (Eigenanreise)'
      : 'Flug (Hin- & Rückflug)';

  const primaryResultsHeading =
    travelType === 'pauschal'
      ? 'Passende Pauschalreise-Anbieter'
      : travelType === 'hotel'
      ? 'Passende Hotelanbieter'
      : 'Passende Fluganbieter';

  const currentSectionHeading =
    addonFilter === 'inkl_mietwagen'
      ? 'Mietwagen-Anbieter am Urlaubsort'
      : addonFilter === 'aktiv_wandern'
      ? 'Anbieter für Wanderreisen, Rundreisen & Ausflüge'
      : addonFilter === 'camping_camper'
      ? 'Anbieter für Campingplätze & Wohnmobile'
      : primaryResultsHeading;

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900">
      {/* Top Bar Contract: 3 Zones separated by gap-8 */}
      <header className="sticky top-0 z-30 bg-[#0B3C6D] text-white border-b border-white/15 px-3 sm:px-6 py-2">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 sm:gap-8">
          {/* Zone 1: Original CleverEntdeckt Logo oben links */}
          <a
            href="#suche"
            aria-label="CleverEntdeckt ReiseRadar – Zurück zur Suchmaske"
            className="inline-flex items-center gap-2.5 shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F4B400] rounded-lg"
          >
            <img
              src="/assets/aistudio/Logo_perfekt_524e9520.png"
              alt="CleverEntdeckt – Clever entdecken. Besser entscheiden."
              className="h-12 sm:h-14 md:h-16 w-auto object-contain rounded-md"
            />
          </a>

          {/* Zone 2: Clean single-line navigation links */}
          <nav
            aria-label="Hauptnavigation"
            className="hidden md:flex items-center gap-6 text-sm font-medium text-white/90"
          >
            <a
              href="#suche"
              className="hover:text-[#F4B400] transition-colors whitespace-nowrap shrink-0"
            >
              Reisesuche
            </a>
            <a
              href="#angebote"
              className="hover:text-[#F4B400] transition-colors whitespace-nowrap shrink-0"
            >
              Reiseangebote
            </a>
            <a
              href="#reisefuehrer"
              className="hover:text-[#F4B400] transition-colors whitespace-nowrap shrink-0"
            >
              Länder & Regionen
            </a>
            <a
              href="#transparenz"
              className="hover:text-[#F4B400] transition-colors whitespace-nowrap shrink-0"
            >
              Transparenz & Hilfe
            </a>
          </nav>

          {/* Zone 3: 1 Primary Action */}
          <div className="flex items-center shrink-0">
            <a
              href="https://cleverentdeckt.de/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 text-xs sm:text-sm font-semibold bg-[#F4B400] text-[#0B3C6D] rounded-lg hover:bg-[#f6c12b] transition-colors whitespace-nowrap shrink-0"
            >
              Zu CleverEntdeckt.de
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* SECTION 1: Hero & Single Simple Search Mask (Immediately visible on smartphone) */}
        <section
          id="suche"
          className="bg-gradient-to-b from-[#0B3C6D] to-[#092f56] text-white pt-6 pb-8 sm:pt-10 sm:pb-12 px-4 sm:px-6"
        >
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-white text-balance">
              ReiseRadar – Finde die Reise, die zu dir passt.
            </h1>
            <p className="mt-2 text-base sm:text-lg text-white/90 leading-relaxed">
              Wähle dein Reiseziel und vergleiche passende Reiseangebote unserer Partner.
            </p>

            {/* Visible pre-selection notice when arriving via ?ziel=... link (Requirement 8) */}
            {initialUrlState.fromGuideParam && !guideBannerDismissed && hasActiveDestination && (
              <div
                role="status"
                className="mt-4 bg-white/10 border border-white/25 rounded-xl px-4 py-3 flex flex-wrap items-center justify-between gap-3 text-sm"
              >
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#F4B400] shrink-0" />
                  <span>
                    Vorauswahl aus deinem Reiseführer aktiv:{' '}
                    <strong className="text-[#F4B400]">{resolvedDest.displayTitle}</strong>. Du
                    kannst das Reiseziel jederzeit ändern.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setGuideBannerDismissed(true)}
                  className="text-xs underline text-white/85 hover:text-white cursor-pointer"
                >
                  Hinweis ausblenden
                </button>
              </div>
            )}

            {/* Single Clean Search Card */}
            <form
              onSubmit={handleSearchSubmit}
              aria-label="Reiseangebote suchen"
              className="mt-5 bg-white text-slate-900 rounded-2xl shadow-lg border border-slate-200 p-4 sm:p-6"
            >
              {/* 1. Reiseart: Pauschalreise, Hotel oder Flug */}
              <div>
                <span
                  id="travel-type-label"
                  className="block text-sm font-bold text-slate-800 mb-2"
                >
                  1. Welche Reiseart suchst du?
                </span>
                <div
                  role="radiogroup"
                  aria-labelledby="travel-type-label"
                  className="grid grid-cols-3 gap-2 sm:gap-3"
                >
                  {[
                    {
                      id: 'pauschal' as PrimaryTravelType,
                      label: 'Pauschalreise',
                      sub: 'Flug + Hotel',
                      icon: Briefcase,
                    },
                    {
                      id: 'hotel' as PrimaryTravelType,
                      label: 'Hotel',
                      sub: 'Eigene Anreise',
                      icon: Building2,
                    },
                    {
                      id: 'flug' as PrimaryTravelType,
                      label: 'Flug',
                      sub: 'Hin & Zurück',
                      icon: Plane,
                    },
                  ].map((item) => {
                    const Icon = item.icon;
                    const active = travelType === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        onClick={() => {
                          setTravelType(item.id);
                          setAddonFilter('alle_passenden');
                        }}
                        className={`min-h-[52px] px-3 py-2.5 rounded-xl border text-left transition-colors cursor-pointer flex items-center gap-2.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B3C6D] ${
                          active
                            ? 'bg-[#0B3C6D] text-white border-[#0B3C6D]'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-300'
                        }`}
                      >
                        <Icon
                          className={`w-5 h-5 shrink-0 ${
                            active ? 'text-[#F4B400]' : 'text-[#0B3C6D]'
                          }`}
                        />
                        <div className="min-w-0">
                          <div className="text-sm sm:text-base font-bold leading-tight truncate">
                            {item.label}
                          </div>
                          <div
                            className={`text-xs truncate ${
                              active ? 'text-white/85' : 'text-slate-500'
                            }`}
                          >
                            {item.sub}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Reiseziel & Abflughafen (Abflughafen nur bei Pauschalreise oder Flug) */}
              <div className="mt-5 grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className={travelType === 'hotel' ? 'md:col-span-12' : 'md:col-span-7'}>
                  <label
                    htmlFor="destination-select"
                    className="block text-sm font-bold text-slate-800 mb-1.5"
                  >
                    2. Wohin möchtest du reisen? (Land, Region oder Stadt)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <select
                      id="destination-select"
                      value={selectedPresetId}
                      onChange={(e) => {
                        if (e.target.value === 'custom') {
                          setSelectedPresetId('custom');
                        } else {
                          handleSelectPreset(e.target.value);
                        }
                      }}
                      aria-label="Reiseziel aus Liste auswählen"
                      className="w-full min-h-[48px] px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-base text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#0B3C6D]"
                    >
                      <option value="">Wohin möchtest du reisen? (Auswählen…)</option>
                      <optgroup label="Türkei (CleverEntdeckt Empfehlung)">
                        {CLEVERENTDECKT_DESTINATIONS.filter(
                          (d) => d.countryGroup === 'Türkei'
                        ).map((d) => (
                          <option key={d.id} value={d.id}>
                            {d.label}
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="Spanien">
                        {CLEVERENTDECKT_DESTINATIONS.filter(
                          (d) => d.countryGroup === 'Spanien'
                        ).map((d) => (
                          <option key={d.id} value={d.id}>
                            {d.label}
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="Italien">
                        {CLEVERENTDECKT_DESTINATIONS.filter(
                          (d) => d.countryGroup === 'Italien'
                        ).map((d) => (
                          <option key={d.id} value={d.id}>
                            {d.label}
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="Griechenland & Ägypten">
                        {CLEVERENTDECKT_DESTINATIONS.filter(
                          (d) => d.countryGroup === 'Griechenland & Ägypten'
                        ).map((d) => (
                          <option key={d.id} value={d.id}>
                            {d.label}
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="Weitere Reiseziele">
                        {CLEVERENTDECKT_DESTINATIONS.filter(
                          (d) => d.countryGroup === 'Weitere beliebte Ziele'
                        ).map((d) => (
                          <option key={d.id} value={d.id}>
                            {d.label}
                          </option>
                        ))}
                      </optgroup>
                      <option value="custom">Eigenes Reiseziel frei eingeben…</option>
                    </select>

                    <div className="relative">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        id="destination-custom-input"
                        type="text"
                        value={destinationText}
                        onChange={(e) => handleDestinationInputChange(e.target.value)}
                        placeholder="Wohin möchtest du reisen? (z. B. Mallorca, Side, Rom…)"
                        aria-label="Reiseziel frei eingeben"
                        className="w-full min-h-[48px] pl-10 pr-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0B3C6D]"
                      />
                    </div>
                  </div>

                  {/* Quick Country / Guide Buttons */}
                  <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs">
                    <span className="text-slate-500 font-medium mr-1">Schnellwahl:</span>
                    {[
                      { id: 'side-kumkoey-antalya', short: 'Side & Kumköy (Antalya)' },
                      { id: 'antalya-belek-lara', short: 'Türkei (Riviera)' },
                      { id: 'mallorca-balearen', short: 'Mallorca (Spanien)' },
                      { id: 'teneriffa-kanaren', short: 'Teneriffa' },
                      { id: 'rom-latium', short: 'Rom (Italien)' },
                      { id: 'kreta-griechenland', short: 'Kreta' },
                      { id: 'hurghada-rotes-meer', short: 'Hurghada' },
                    ].map((quick) => (
                      <button
                        key={quick.id}
                        type="button"
                        onClick={() => handleSelectPreset(quick.id)}
                        className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap ${
                          selectedPresetId === quick.id
                            ? 'bg-[#0B3C6D] text-white'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        {quick.short}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Abflughafen: NUR anzeigen, wenn für die Reiseart erforderlich (Pauschalreise oder Flug) */}
                {travelType !== 'hotel' ? (
                  <div className="md:col-span-5">
                    <label
                      htmlFor="airport-select"
                      className="block text-sm font-bold text-slate-800 mb-1.5"
                    >
                      3. Abflughafen
                    </label>
                    <select
                      id="airport-select"
                      value={originCode}
                      onChange={(e) => setOriginCode(e.target.value)}
                      className="w-full min-h-[48px] px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-base text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#0B3C6D]"
                    >
                      {AIRPORT_OPTIONS.map((airport) => (
                        <option key={airport.code} value={airport.code}>
                          {airport.label}
                        </option>
                      ))}
                    </select>
                    <p className="mt-1.5 text-xs text-slate-500">
                      Wird direkt an Flug- und Pauschalreise-Partner übergeben.
                    </p>
                  </div>
                ) : (
                  <div className="md:col-span-5">
                    <label
                      htmlFor="board-select-hotel"
                      className="block text-sm font-bold text-slate-800 mb-1.5"
                    >
                      3. Gewünschte Verpflegung (optional)
                    </label>
                    <select
                      id="board-select-hotel"
                      value={boardFilter}
                      onChange={(e) => setBoardFilter(e.target.value)}
                      className="w-full min-h-[48px] px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-base text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#0B3C6D]"
                    >
                      <option value="Beliebig">Alle Verpflegungsarten</option>
                      <option value="All Inclusive">All Inclusive</option>
                      <option value="Halbpension">Ab Halbpension</option>
                      <option value="Frühstück">Mit Frühstück</option>
                      <option value="Nur Übernachtung">Nur Übernachtung</option>
                    </select>
                    <p className="mt-1.5 text-xs text-slate-500">
                      Kein Abflughafen erforderlich bei eigener Anreise.
                    </p>
                  </div>
                )}
              </div>

              {/* 3. Reisezeitraum (Anreise & Abreise mit Kalender) + Reisende */}
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4">
                <div className="lg:col-span-3">
                  <label
                    htmlFor="checkin-date"
                    className="block text-sm font-bold text-slate-800 mb-1.5"
                  >
                    <Calendar className="w-4 h-4 inline-block mr-1 text-[#0B3C6D]" />
                    Anreise
                  </label>
                  <input
                    id="checkin-date"
                    type="date"
                    value={checkInDate}
                    onChange={(e) => handleCheckInChange(e.target.value)}
                    className="w-full min-h-[48px] px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-base text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#0B3C6D] tabular-nums"
                  />
                </div>

                <div className="lg:col-span-3">
                  <label
                    htmlFor="checkout-date"
                    className="block text-sm font-bold text-slate-800 mb-1.5"
                  >
                    <Calendar className="w-4 h-4 inline-block mr-1 text-[#0B3C6D]" />
                    Abreise ({durationNights} {durationNights === 1 ? 'Nacht' : 'Nächte'})
                  </label>
                  <input
                    id="checkout-date"
                    type="date"
                    min={checkInDate}
                    value={checkOutDate}
                    onChange={(e) => {
                      setCheckOutDate(e.target.value);
                      setFormError('');
                    }}
                    className="w-full min-h-[48px] px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-base text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#0B3C6D] tabular-nums"
                  />
                </div>

                {/* 4. Reisende: Erwachsene und Kinder (mit Alter) */}
                <div className="lg:col-span-3">
                  <label
                    htmlFor="adults-select"
                    className="block text-sm font-bold text-slate-800 mb-1.5"
                  >
                    <Users className="w-4 h-4 inline-block mr-1 text-[#0B3C6D]" />
                    Erwachsene
                  </label>
                  <select
                    id="adults-select"
                    value={adults}
                    onChange={(e) => setAdults(Number(e.target.value))}
                    className="w-full min-h-[48px] px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-base text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#0B3C6D]"
                  >
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'Erwachsener' : 'Erwachsene'}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="lg:col-span-3">
                  <label
                    htmlFor="children-select"
                    className="block text-sm font-bold text-slate-800 mb-1.5"
                  >
                    Kinder (0–17 Jahre)
                  </label>
                  <select
                    id="children-select"
                    value={childrenAges.length}
                    onChange={(e) => handleSetChildrenCount(Number(e.target.value))}
                    className="w-full min-h-[48px] px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-base text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#0B3C6D]"
                  >
                    <option value={0}>Keine Kinder</option>
                    <option value={1}>1 Kind</option>
                    <option value={2}>2 Kinder</option>
                    <option value={3}>3 Kinder</option>
                    <option value={4}>4 Kinder</option>
                  </select>
                </div>
              </div>

              {/* Dynamische Altersauswahl für jedes Kind */}
              {childrenAges.length > 0 && (
                <div className="mt-4 p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="block text-xs font-bold text-slate-700 mb-2">
                    Bitte gib das Alter der Kinder bei Reiseantritt an (wichtig für Kinderfestpreise):
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {childrenAges.map((age, idx) => (
                      <div key={idx}>
                        <label
                          htmlFor={`child-age-${idx}`}
                          className="block text-xs font-medium text-slate-600 mb-1"
                        >
                          Alter Kind {idx + 1}
                        </label>
                        <select
                          id={`child-age-${idx}`}
                          value={age}
                          onChange={(e) => handleChildAgeChange(idx, Number(e.target.value))}
                          className="w-full min-h-[44px] px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0B3C6D]"
                        >
                          {Array.from({ length: 18 }, (_, i) => i).map((yr) => (
                            <option key={yr} value={yr}>
                              {yr === 0 ? 'Unter 1 Jahr (Baby)' : `${yr} Jahre`}
                            </option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Fehlermeldung (falls Eingabe unvollständig) */}
              {formError && (
                <div
                  role="alert"
                  className="mt-4 p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-800 text-sm font-medium flex items-center gap-2"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Großer, deutlich sichtbarer Haupt-Button: „Reiseangebote finden“ */}
              <div className="mt-6">
                <button
                  type="submit"
                  className="w-full min-h-[54px] px-6 py-3.5 bg-[#F4B400] hover:bg-[#e5a800] text-[#0B3C6D] font-bold text-base sm:text-lg rounded-xl shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-2.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B3C6D]"
                >
                  <Search className="w-5 h-5 stroke-[2.5]" />
                  <span>Reiseangebote finden</span>
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* SECTION 2: Übersichtliche Darstellung der passenden Reiseangebote */}
        <section id="angebote" className="py-8 sm:py-12 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            {/* Kategorien-Wahl: Hauptsuchergebnisse (Reiseart) vs. getrennte Spezialkategorien */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div
                role="tablist"
                aria-label="Angebotskategorien"
                className="flex flex-wrap items-center gap-2"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={addonFilter === 'alle_passenden'}
                  onClick={() => setAddonFilter('alle_passenden')}
                  className={`min-h-[44px] px-4 py-2 rounded-xl text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                    addonFilter === 'alle_passenden'
                      ? 'bg-[#0B3C6D] text-white'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-300'
                  }`}
                >
                  {primaryResultsHeading}
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={addonFilter === 'aktiv_wandern'}
                  onClick={() => setAddonFilter('aktiv_wandern')}
                  className={`min-h-[44px] px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors cursor-pointer inline-flex items-center gap-1.5 whitespace-nowrap ${
                    addonFilter === 'aktiv_wandern'
                      ? 'bg-[#0B3C6D] text-white'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-300'
                  }`}
                >
                  <Mountain className="w-4 h-4" />
                  <span>Wander- & Rundreisen</span>
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={addonFilter === 'inkl_mietwagen'}
                  onClick={() => setAddonFilter('inkl_mietwagen')}
                  className={`min-h-[44px] px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors cursor-pointer inline-flex items-center gap-1.5 whitespace-nowrap ${
                    addonFilter === 'inkl_mietwagen'
                      ? 'bg-[#0B3C6D] text-white'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-300'
                  }`}
                >
                  <Car className="w-4 h-4" />
                  <span>Mietwagen vor Ort</span>
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={addonFilter === 'camping_camper'}
                  onClick={() => setAddonFilter('camping_camper')}
                  className={`min-h-[44px] px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors cursor-pointer inline-flex items-center gap-1.5 whitespace-nowrap ${
                    addonFilter === 'camping_camper'
                      ? 'bg-[#0B3C6D] text-white'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-300'
                  }`}
                >
                  <Tent className="w-4 h-4" />
                  <span>Camping & Wohnmobil</span>
                </button>
              </div>

              {(hasActiveDestination || addonFilter !== 'alle_passenden') && (
                <div className="flex items-center gap-2 shrink-0">
                  <label htmlFor="sort-select" className="text-xs font-semibold text-slate-600">
                    Sortierung:
                  </label>
                  <select
                    id="sort-select"
                    value={sortOrder}
                    onChange={(e) =>
                      setSortOrder(e.target.value as 'deeplink_first' | 'alphabetical')
                    }
                    className="min-h-[44px] px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0B3C6D]"
                  >
                    <option value="deeplink_first">Direkte Datenübernahme zuerst</option>
                    <option value="alphabetical">Alphabetisch (A–Z)</option>
                  </select>
                </div>
              )}
            </div>

            {/* Neutrale Startansicht vor Auswahl eines Reiseziels (Anforderung 1) */}
            {!hasActiveDestination && addonFilter === 'alle_passenden' ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 text-center">
                <MapPin className="w-8 h-8 text-[#0B3C6D] mx-auto mb-2.5" />
                <h2 className="text-xl sm:text-2xl font-bold text-[#0B3C6D]">
                  Wohin möchtest du reisen?
                </h2>
                <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
                  Bitte wähle oben im Suchformular ein Reiseziel aus oder gib dein Wunschziel frei
                  ein. Danach erscheinen hier sofort die passenden{' '}
                  <strong>
                    {travelType === 'pauschal'
                      ? 'Pauschalreise-Anbieter'
                      : travelType === 'hotel'
                      ? 'Hotelanbieter'
                      : 'Fluganbieter'}
                  </strong>{' '}
                  mit deinen Reisedaten.
                </p>
                <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
                  {[
                    { id: 'side-kumkoey-antalya', label: 'Side & Kumköy (Antalya)' },
                    { id: 'antalya-belek-lara', label: 'Türkei (Türkische Riviera)' },
                    { id: 'mallorca-balearen', label: 'Mallorca (Spanien)' },
                    { id: 'rom-latium', label: 'Rom (Italien)' },
                    { id: 'kreta-griechenland', label: 'Kreta (Griechenland)' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelectPreset(item.id)}
                      className="min-h-[42px] px-4 py-2 bg-slate-100 hover:bg-[#0B3C6D] hover:text-white text-slate-800 text-sm font-semibold rounded-xl transition-colors cursor-pointer"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {/* Deine Reiseauswahl (Anforderung 5: ohne Uhrzeit / ohne „Abfragezeitpunkt“) */}
                <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 mb-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wide text-[#0B3C6D]">
                        Deine Reiseauswahl
                      </div>
                      <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                        {currentSectionHeading}
                        {hasActiveDestination ? ` – ${resolvedDest.displayTitle}` : ''}
                      </h2>
                      <p className="text-sm sm:text-base text-slate-700 mt-1">
                        <span>{travelTypeLabel}</span>
                        {travelType !== 'hotel' ? (
                          <>
                            <span aria-hidden="true"> · </span>
                            <span>Ab {selectedAirportObj.label}</span>
                          </>
                        ) : (
                          boardFilter !== 'Beliebig' && (
                            <>
                              <span aria-hidden="true"> · </span>
                              <span>Verpflegung: {boardFilter}</span>
                            </>
                          )
                        )}
                        <span aria-hidden="true"> · </span>
                        <span className="tabular-nums">
                          {formatGermanDate(checkInDate)} bis {formatGermanDate(checkOutDate)} (
                          {durationNights} {durationNights === 1 ? 'Nacht' : 'Nächte'})
                        </span>
                        <span aria-hidden="true"> · </span>
                        <span>
                          {adults} {adults === 1 ? 'Erwachsener' : 'Erwachsene'}
                          {childrenAges.length > 0
                            ? `, ${childrenAges.length} ${
                                childrenAges.length === 1 ? 'Kind' : 'Kinder'
                              } (${childrenAges.map((a) => `${a} J.`).join(', ')})`
                            : ''}
                        </span>
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => scrollToId('suche')}
                        className="min-h-[44px] px-4 py-2 text-sm font-semibold text-[#0B3C6D] bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer inline-flex items-center gap-1.5"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>Suche oben anpassen</span>
                      </button>
                    </div>
                  </div>

                  {/* Ehrlicher Hinweis zur Preisprüfung beim Anbieter */}
                  <div className="mt-4 pt-4 border-t border-slate-200 flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                    <Info className="w-4 h-4 text-[#0B3C6D] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900">
                        Aktuelle Preise direkt beim Anbieter prüfen:
                      </strong>{' '}
                      Verfügbarkeit und tatsächlicher Endpreis werden direkt beim jeweiligen
                      Reiseanbieter angezeigt.
                    </div>
                  </div>
                </div>

                {/* Vereinfachte Partnerkarten (Anforderung 4) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {filteredAndSortedOffers.map((offer) => (
                    <article
                      key={offer.id}
                      className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 flex flex-col justify-between shadow-2xs"
                    >
                      <div>
                        {/* 1. Name des Reiseanbieters + dezente Affiliate-Kennzeichnung */}
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-xs font-semibold text-[#0B3C6D]">
                              {offer.categoryLabel}
                            </span>
                            <h3 className="text-xl font-bold text-slate-900 mt-0.5">
                              {offer.partnerName}
                            </h3>
                          </div>
                          <span className="text-xs text-slate-400 shrink-0">*Anzeige</span>
                        </div>

                        {/* 2. Kurze Erklärung, welche Reisen dort angeboten werden */}
                        <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                          {offer.description}
                        </p>

                        {/* 3. Automatisch übernommen & 4. Ggf. noch beim Anbieter einzugeben */}
                        <div className="mt-4 pt-3.5 border-t border-slate-100 space-y-2 text-xs sm:text-sm">
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                            <div>
                              <span className="font-semibold text-slate-800">
                                Automatisch übernommen:{' '}
                              </span>
                              <span className="text-slate-600">
                                {offer.transferredParams.join(' · ')}
                              </span>
                            </div>
                          </div>

                          {offer.manualParamsAtProvider.length > 0 && (
                            <div className="flex items-start justify-between gap-2 bg-amber-50/70 border border-amber-200/80 rounded-xl p-2.5 text-xs text-slate-700">
                              <div>
                                <strong className="text-slate-900">Beim Anbieter wählen: </strong>
                                <span>{offer.manualParamsAtProvider.join(' · ')}</span>
                              </div>
                              {hasActiveDestination && resolvedDest.searchTerm && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleCopyDestination(offer.id, resolvedDest.searchTerm)
                                  }
                                  title="Reiseziel kopieren"
                                  className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 shrink-0 inline-flex items-center gap-1 cursor-pointer"
                                >
                                  {copiedPartnerId === offer.id ? (
                                    <>
                                      <Check className="w-3.5 h-3.5 text-emerald-700" />
                                      <span>Kopiert</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-3.5 h-3.5" />
                                      <span>Ziel kopieren</span>
                                    </>
                                  )}
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* 5. Großer, deutlich sichtbarer Button „Angebote prüfen“ */}
                      <div className="mt-5 pt-4 border-t border-slate-100">
                        <a
                          href={offer.url}
                          target="_blank"
                          rel="sponsored noopener noreferrer"
                          onClick={() =>
                            trackReiseRadarPartnerClick(
                              offer.id,
                              offer.partnerName,
                              travelType,
                              resolvedDest.searchTerm || 'Allgemein'
                            )
                          }
                          className="w-full min-h-[48px] px-5 py-3 bg-[#0B3C6D] hover:bg-[#082d54] text-white font-bold text-sm sm:text-base rounded-xl transition-colors flex items-center justify-center gap-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F4B400]"
                        >
                          <span>{offer.ctaLabel}</span>
                          <ExternalLink className="w-4 h-4 shrink-0 text-[#F4B400]" />
                        </a>

                        {offer.secondaryAction && (
                          <a
                            href={offer.secondaryAction.url}
                            target="_blank"
                            rel="sponsored noopener noreferrer"
                            onClick={() =>
                              trackReiseRadarPartnerClick(
                                `${offer.id}-secondary`,
                                offer.partnerName,
                                travelType,
                                resolvedDest.searchTerm || 'Allgemein'
                              )
                            }
                            className="mt-2.5 w-full min-h-[42px] px-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[#0B3C6D] font-semibold text-xs sm:text-sm rounded-xl transition-colors flex items-center justify-center gap-1.5"
                          >
                            <span>{offer.secondaryAction.label}</span>
                            <ExternalLink className="w-3.5 h-3.5 shrink-0 text-[#0B3C6D]" />
                          </a>
                        )}

                        {offer.additionalActions?.map((action, idx) => (
                          <a
                            key={action.url}
                            href={action.url}
                            target="_blank"
                            rel="sponsored noopener noreferrer"
                            onClick={() =>
                              trackReiseRadarPartnerClick(
                                `${offer.id}-extra-${idx}`,
                                offer.partnerName,
                                travelType,
                                resolvedDest.searchTerm || 'Allgemein'
                              )
                            }
                            className="mt-2 w-full min-h-[42px] px-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[#0B3C6D] font-semibold text-xs sm:text-sm rounded-xl transition-colors flex items-center justify-center gap-1.5"
                          >
                            <span>{action.label}</span>
                            <ExternalLink className="w-3.5 h-3.5 shrink-0 text-[#0B3C6D]" />
                          </a>
                        ))}
                      </div>
                    </article>
                  ))}
                </div>
              </>
            )}

            {/* Pflicht-Affiliate-Kennzeichnung direkt unter den Angeboten */}
            <p className="mt-5 text-xs sm:text-sm text-slate-600 leading-relaxed">
              *Anzeige: Bei einer Buchung über unsere Partnerlinks können wir eine Provision
              erhalten. Für dich entstehen dadurch keine zusätzlichen Kosten durch CleverEntdeckt.
            </p>
          </div>
        </section>

        {/* SECTION 3: Verbindung zu den CleverEntdeckt Länder- & Regionalführern (Abschnitt 8) */}
        <section
          id="reisefuehrer"
          className="py-8 sm:py-12 px-4 sm:px-6 bg-white border-t border-slate-200"
        >
          <div className="max-w-6xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-bold text-[#0B3C6D]">
              Beliebte Reiseziele aus den CleverEntdeckt-Reiseführern
            </h2>
            <p className="mt-1.5 text-sm sm:text-base text-slate-600">
              Wähle ein Land oder eine Region aus unseren Reiseführern. Die Vorauswahl wird oben in
              die Suchmaske übernommen – ohne automatische Weiterleitung zu externen Seiten.
            </p>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  title: 'Side & Kumköy (Antalya)',
                  sub: 'Türkische Riviera · Flache Sandstrände & Familienresorts',
                  presetId: 'side-kumkoey-antalya',
                  paramExample: '?ziel=Side',
                },
                {
                  title: 'Türkei (Alle Regionen)',
                  sub: 'Antalya, Alanya, Izmir, Bodrum & Istanbul',
                  presetId: 'antalya-belek-lara',
                  paramExample: '?ziel=Tuerkei',
                },
                {
                  title: 'Spanien & Inseln',
                  sub: 'Mallorca, Teneriffa, Gran Canaria & Andalusien',
                  presetId: 'mallorca-balearen',
                  paramExample: '?ziel=Spanien',
                },
                {
                  title: 'Italien entdecken',
                  sub: 'Rom, Sizilien, Amalfiküste & Oberitalienische Seen',
                  presetId: 'rom-latium',
                  paramExample: '?ziel=Italien',
                },
              ].map((card) => {
                const isSelected = selectedPresetId === card.presetId;
                return (
                  <button
                    key={card.presetId}
                    type="button"
                    onClick={() => {
                      handleSelectPreset(card.presetId);
                      scrollToId('suche');
                    }}
                    className={`p-4 rounded-2xl border text-left transition-colors cursor-pointer flex flex-col justify-between min-h-[124px] ${
                      isSelected
                        ? 'bg-[#0B3C6D]/5 border-[#0B3C6D]'
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                    }`}
                  >
                    <div>
                      <div className="text-base font-bold text-[#0B3C6D]">{card.title}</div>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">{card.sub}</p>
                    </div>
                    <div className="mt-3 text-xs font-semibold text-[#0B3C6D] flex items-center justify-between">
                      <span>{isSelected ? '✓ Aktuell ausgewählt' : 'Als Reiseziel übernehmen →'}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* SECTION 4: Optionaler Währungsrechner für die Urlaubskasse vor Ort (Abschnitt 7) */}
        <section id="waehrung" className="py-6 px-4 sm:px-6 border-t border-slate-200 bg-slate-50">
          <div className="max-w-6xl mx-auto">
            <button
              type="button"
              onClick={() => setIsCurrencyOpen((prev) => !prev)}
              aria-expanded={isCurrencyOpen}
              className="w-full min-h-[48px] bg-white border border-slate-200 rounded-2xl px-5 py-3.5 flex items-center justify-between text-left cursor-pointer hover:bg-slate-100 transition-colors"
            >
              <div>
                <span className="text-sm sm:text-base font-bold text-[#0B3C6D]">
                  Optionales Hilfsmittel: Währungsrechner für die Reisekasse vor Ort
                </span>
                <span className="block text-xs text-slate-500 mt-0.5">
                  Praktisch für Ausgaben in der Türkei (TRY), Schweiz (CHF), Großbritannien (GBP),
                  Polen (PLN) oder Übersee (USD)
                </span>
              </div>
              {isCurrencyOpen ? (
                <ChevronUp className="w-5 h-5 text-slate-600 shrink-0" />
              ) : (
                <ChevronDown className="w-5 h-5 text-slate-600 shrink-0" />
              )}
            </button>

            {isCurrencyOpen && (
              <div className="mt-3 bg-white border border-slate-200 rounded-2xl p-5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                  <div>
                    <label
                      htmlFor="calc-eur-input"
                      className="block text-xs font-bold text-slate-700 mb-1.5"
                    >
                      Betrag in Euro (EUR)
                    </label>
                    <input
                      id="calc-eur-input"
                      type="number"
                      min={1}
                      step={10}
                      value={currencyAmountEur}
                      onChange={(e) => setCurrencyAmountEur(Math.max(0, Number(e.target.value)))}
                      className="w-full min-h-[44px] px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-base font-bold text-slate-900 tabular-nums"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="calc-target-curr"
                      className="block text-xs font-bold text-slate-700 mb-1.5"
                    >
                      Zielwährung im Reiseland
                    </label>
                    <select
                      id="calc-target-curr"
                      value={targetCurrency}
                      onChange={(e) => setTargetCurrency(e.target.value as UserCurrencyCode)}
                      className="w-full min-h-[44px] px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-base font-medium text-slate-900"
                    >
                      {(Object.keys(SUPPORTED_CURRENCIES) as UserCurrencyCode[])
                        .filter((c) => c !== 'EUR')
                        .map((code) => (
                          <option key={code} value={code}>
                            {SUPPORTED_CURRENCIES[code].name}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 min-h-[44px] flex flex-col justify-center">
                    <span className="text-xs text-slate-500">Richtwert zum Orientierungskurs:</span>
                    <span className="text-lg font-bold text-[#0B3C6D] tabular-nums">
                      {formatMoney(currencyAmountEur, targetCurrency)}
                    </span>
                  </div>
                </div>
                <p className="mt-3 text-xs text-slate-500">
                  Hinweis: Unverbindlicher Orientierungskurs für deine Urlaubsplanung. Beim Bezahlen
                  mit Karte im Ausland (z. B. in der Türkei) empfiehlt es sich, am Kartenterminal
                  stets die Abrechnung in der Landeswährung (ohne Sofortumrechnung/DCC) zu wählen.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* SECTION 5: Transparenz, Funktionsweise & Datenschutz (Abschnitt 9) */}
        <section
          id="transparenz"
          className="py-8 sm:py-12 px-4 sm:px-6 bg-white border-t border-slate-200"
        >
          <div className="max-w-6xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-bold text-[#0B3C6D]">
              Transparenz, Partnerauswahl & Datenschutz
            </h2>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-slate-600 leading-relaxed">
              <div>
                <h3 className="font-bold text-slate-900 mb-1.5">
                  1. Wie funktioniert das CleverEntdeckt ReiseRadar?
                </h3>
                <p>
                  ReiseRadar ist ein unabhängiger Reiseangebots-Finder für Besucher von
                  CleverEntdeckt.de. Wir bündeln die Suche für ausgewählte Reisepartner (CHECK24,
                  Expedia, ab-in-den-urlaub, Trip.com, Aviasales, DiscoverCars, ASI Reisen,
                  camping.info, CamperDays, TUI Camper und Klook) und übergeben deine Suchkriterien
                  – soweit vom jeweiligen Anbieter technisch unterstützt – direkt in dessen
                  Suchmaske.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 mb-1.5">
                  2. Ehrlicher Vergleich ohne erfundene Preise
                </h3>
                <p>
                  Wir führen keinen vollständigen Marktvergleich aller weltweit existierenden
                  Reiseveranstalter durch und zeigen keine simulierten Lockpreise an. Die
                  Sortierung unserer Partner richtet sich ausschließlich nach der gewählten
                  Reiseart und der technischen Direktübernahme deiner Suchangaben – niemals nach der
                  Höhe einer Provision. Verfügbarkeit und Endpreis werden immer direkt beim Anbieter
                  bestätigt.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 mb-1.5">
                  3. Datensparsamkeit & Affiliate-Hinweis
                </h3>
                <p>
                  Deine Eingaben in der Suchmaske (Reiseziel, Reisedaten, Personenanzahl) werden
                  ausschließlich lokal in deinem Browser verarbeitet. Es erfolgt keine automatische
                  Weiterleitung und keine Datenübermittlung an Reisepartner, solange du nicht aktiv
                  auf einen Anbieter-Button klickst. *Anzeige: Bei einer Buchung über unsere
                  Partnerlinks können wir eine Provision erhalten, ohne dass für dich Mehrkosten
                  entstehen.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Quiet Footer */}
      <footer className="bg-[#0B3C6D] text-white/85 py-6 px-4 sm:px-6 text-xs sm:text-sm border-t border-white/10">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">CleverEntdeckt ReiseRadar</span>
            <span aria-hidden="true">·</span>
            <span>Einfache & ehrliche Reiseangebots-Suche</span>
          </div>
          <div className="flex flex-wrap items-center gap-5">
            <a
              href="https://cleverentdeckt.de/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#F4B400] transition-colors"
            >
              Startseite CleverEntdeckt.de
            </a>
            <a
              href="https://cleverentdeckt.de/impressum/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#F4B400] transition-colors"
            >
              Impressum
            </a>
            <a
              href="https://cleverentdeckt.de/datenschutzerklaerung/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#F4B400] transition-colors"
            >
              Datenschutz
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
