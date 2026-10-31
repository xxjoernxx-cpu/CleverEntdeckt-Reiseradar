import React from 'react';
import { Plane, Train, Check, ShieldCheck, Luggage, Sparkles, ExternalLink } from 'lucide-react';
import {
  DestinationDeal,
  LuggageOption,
  RouteOption,
  UserCurrencyCode,
  DESTINATION_LOCAL_CURRENCY,
  formatMoney,
  buildProviderBookingLinks,
  AffiliatePartnerConfig,
} from '../data/travelData';

interface RouteOptimizerSectionProps {
  destination: DestinationDeal;
  originCode: string;
  selectedDateStr: string;
  durationNights: number;
  travelers: number;
  luggage: LuggageOption;
  onSelectLuggage: (luggage: LuggageOption) => void;
  selectedRouteId: string;
  onSelectRoute: (routeId: string) => void;
  selectedHotelId: string;
  onSelectHotel: (hotelId: string) => void;
  onSavePriceAlert: () => void;
  onOpenBookingSummary: () => void;
  isAlertSaved: boolean;
  userCurrency: UserCurrencyCode;
  affiliateConfig: AffiliatePartnerConfig;
}

export const RouteOptimizerSection: React.FC<RouteOptimizerSectionProps> = ({
  destination,
  originCode,
  selectedDateStr,
  durationNights,
  travelers,
  luggage,
  onSelectLuggage,
  selectedRouteId,
  onSelectRoute,
  selectedHotelId,
  onSelectHotel,
  onSavePriceAlert,
  onOpenBookingSummary,
  isAlertSaved,
  userCurrency,
  affiliateConfig,
}) => {
  const routes: RouteOption[] =
    destination.routesByOrigin[originCode] ||
    Object.values(destination.routesByOrigin)[0] ||
    [];

  const activeRoute = routes.find((r) => r.id === selectedRouteId) || routes[0];
  const activeHotel =
    destination.hotels.find((h) => h.id === selectedHotelId) || destination.hotels[0];

  const destLocalCurrency =
    DESTINATION_LOCAL_CURRENCY[destination.id]?.code || 'EUR';

  // Calculate date-based price adjustment if a specific date from the calendar is active
  const monthKey = selectedDateStr.slice(0, 7);
  const dayObj = destination.monthlyCalendar[monthKey]?.find(
    (d) => d.dateStr === selectedDateStr
  );

  const getRouteTotalFlightPerPerson = (route: RouteOption) => {
    const calendarRatio = dayObj
      ? dayObj.flightPrice / (routes[2]?.baseFlightPricePerPerson || 60)
      : 1;
    const clampedRatio = Math.max(0.72, Math.min(1.35, calendarRatio));
    const adjustedFlight = Math.round(route.baseFlightPricePerPerson * clampedRatio);
    const lugFee = route.luggageFees[luggage];
    return adjustedFlight + lugFee + route.railTransferFeePerPerson;
  };

  const activeFlightPerPerson = activeRoute ? getRouteTotalFlightPerPerson(activeRoute) : 0;
  const standardRoute = routes.find((r) => r.type === 'direct') || routes[routes.length - 1];
  const standardFlightPerPerson = standardRoute
    ? getRouteTotalFlightPerPerson(standardRoute)
    : activeFlightPerPerson;

  const hotelTotalForGroup = activeHotel
    ? Math.round(
        activeHotel.pricePerNightTwoAdults *
          durationNights *
          Math.ceil(travelers / 2)
      )
    : 0;
  const hotelPerPerson = Math.round(hotelTotalForGroup / travelers);

  const grandTotalPerPerson = activeFlightPerPerson + hotelPerPerson;
  const grandTotalGroup = grandTotalPerPerson * travelers;

  const totalSavingsGroup = Math.max(
    0,
    (destination.historicalAvgTotal - grandTotalPerPerson) * travelers
  );

  // Build real provider deep links for active configuration
  const activeLinks = buildProviderBookingLinks({
    originCode: activeRoute?.outbound.originCode || originCode,
    destCode: activeRoute?.outbound.destCode || destination.iata,
    destCity: destination.city,
    hotelName: activeHotel?.name || destination.city,
    carrierName: activeRoute?.outbound.carrier || 'Ryanair',
    departureDateStr: selectedDateStr,
    durationNights,
    travelers,
    userCurrency,
    affiliateConfig,
  });

  return (
    <section id="routenoptimierer" className="py-12 border-t border-slate-200 bg-white">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
          <div>
            <p className="text-xs font-medium text-slate-500">
              03. Multi-Airport- & Split-Ticket-Optimierer <span aria-hidden="true">·</span>{' '}
              {destination.city} <span aria-hidden="true">·</span> Währung: {userCurrency}
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mt-1 text-balance">
              Wahre Endpreise & Direktbuchung beim Reiseanbieter ohne Aufschlag
            </h2>
          </div>

          {/* True Cost Luggage Selector */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <span className="text-xs font-medium text-slate-600 flex items-center gap-1.5">
              <Luggage className="w-4 h-4 text-slate-500" />
              <span>Echte Gepäckkalkulation:</span>
            </span>
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
              {(
                [
                  { id: 'personal', label: `Kleines Handgepäck (${formatMoney(0, userCurrency)})` },
                  { id: 'cabin', label: 'Kabinentrolley (8 kg)' },
                  { id: 'checked', label: 'Aufgabegepäck (23 kg)' },
                ] as { id: LuggageOption; label: string }[]
              ).map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => onSelectLuggage(opt.id)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    luggage === opt.id
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left 8 Columns: Route Comparison + Hotel Tier Selection */}
          <div className="lg:col-span-8 space-y-8">
            {/* Step A: Flight & Route Tricks */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-bold text-slate-900">
                  Schritt 1: Günstigste Anreise-Strategie wählen & Flug direkt beim Anbieter buchen
                </h3>
                <span className="text-xs text-slate-500">
                  Alle Preise in {userCurrency} inkl. Steuern, Gepäck & Bahnzubringer
                </span>
              </div>

              <div className="space-y-3">
                {routes.map((route) => {
                  const isSelected = route.id === activeRoute?.id;
                  const routePricePP = getRouteTotalFlightPerPerson(route);
                  const diffVsDirect = standardFlightPerPerson - routePricePP;
                  const routeLinks = buildProviderBookingLinks({
                    originCode: route.outbound.originCode,
                    destCode: route.outbound.destCode,
                    destCity: destination.city,
                    hotelName: activeHotel?.name || destination.city,
                    carrierName: route.outbound.carrier,
                    departureDateStr: selectedDateStr,
                    durationNights,
                    travelers,
                    userCurrency,
                    affiliateConfig,
                  });

                  return (
                    <div
                      key={route.id}
                      onClick={() => onSelectRoute(route.id)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          onSelectRoute(route.id);
                        }
                      }}
                      className={`p-4 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/25 ring-1 ring-blue-600'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                        <div>
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <span className="font-semibold text-slate-800">{route.label}</span>
                            <span aria-hidden="true">·</span>
                            <span>{route.summary}</span>
                          </div>
                        </div>
                        <div className="flex items-baseline gap-3 shrink-0">
                          {diffVsDirect > 0 && (
                            <span className="text-xs font-medium text-emerald-700">
                              Spart {formatMoney(diffVsDirect, userCurrency)} p.P. ggü. Direktflug
                            </span>
                          )}
                          <span className="text-lg font-mono font-bold text-slate-900 tabular-nums">
                            {formatMoney(routePricePP, userCurrency)} p.P.
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 text-xs">
                        {/* Outbound */}
                        <div className="flex items-center justify-between bg-slate-50 rounded-lg px-3 py-2">
                          <div>
                            <span className="text-slate-500 block">
                              Hinflug · {route.outbound.carrier} ({route.outbound.flightNumber})
                            </span>
                            <span className="font-semibold text-slate-900 mt-0.5 block">
                              {route.outbound.originCode} {route.outbound.departureTime} →{' '}
                              {route.outbound.destCode} {route.outbound.arrivalTime}
                            </span>
                          </div>
                          <div className="text-right font-mono text-slate-600 tabular-nums">
                            {Math.floor(route.outbound.durationMinutes / 60)}h{' '}
                            {route.outbound.durationMinutes % 60}m · Direkt
                          </div>
                        </div>

                        {/* Inbound */}
                        <div className="flex items-center justify-between bg-slate-50 rounded-lg px-3 py-2">
                          <div>
                            <span className="text-slate-500 block">
                              Rückflug · {route.inbound.carrier} ({route.inbound.flightNumber})
                            </span>
                            <span className="font-semibold text-slate-900 mt-0.5 block">
                              {route.inbound.originCode} {route.inbound.departureTime} →{' '}
                              {route.inbound.destCode} {route.inbound.arrivalTime}
                            </span>
                          </div>
                          <div className="text-right font-mono text-slate-600 tabular-nums">
                            {Math.floor(route.inbound.durationMinutes / 60)}h{' '}
                            {route.inbound.durationMinutes % 60}m · Direkt
                          </div>
                        </div>
                      </div>

                      {/* Direct Flight Provider Links Row */}
                      <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                        <span className="text-slate-500 flex items-center gap-1.5">
                          {route.railTransferFeePerPerson > 0 ? (
                            <Train className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          ) : (
                            <Plane className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          )}
                          <span>{route.savingReason}</span>
                        </span>

                        <div
                          className="flex flex-wrap items-center gap-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <a
                            href={routeLinks.tripComUrl}
                            target="_blank"
                            rel="sponsored noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-md transition-colors whitespace-nowrap"
                          >
                            <span>Flug auf Trip.com buchen</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                          <a
                            href={routeLinks.expediaFlightUrl}
                            target="_blank"
                            rel="sponsored noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold rounded-md transition-colors whitespace-nowrap"
                          >
                            <span>Flug auf Expedia</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                          <a
                            href={routeLinks.check24HolidayUrl}
                            target="_blank"
                            rel="sponsored noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-md transition-colors whitespace-nowrap"
                          >
                            <span>Kombi bei CHECK24</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step B: Hotel & Board Tier Comparison */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-bold text-slate-900">
                  Schritt 2: Bestpreis-Unterkunft für {durationNights} Nächte wählen & direkt buchen
                </h3>
                <span className="text-xs text-slate-500">
                  Preise pro Person bei {travelers} Reisenden
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {destination.hotels.map((hotel) => {
                  const isSelected = hotel.id === activeHotel?.id;
                  const hotelSharePP = Math.round(
                    (hotel.pricePerNightTwoAdults * durationNights * Math.ceil(travelers / 2)) /
                      travelers
                  );
                  const hotelLinks = buildProviderBookingLinks({
                    originCode: activeRoute?.outbound.originCode || originCode,
                    destCode: activeRoute?.outbound.destCode || destination.iata,
                    destCity: destination.city,
                    hotelName: hotel.name,
                    carrierName: activeRoute?.outbound.carrier || 'Ryanair',
                    departureDateStr: selectedDateStr,
                    durationNights,
                    travelers,
                    userCurrency,
                    affiliateConfig,
                  });

                  return (
                    <div
                      key={hotel.id}
                      onClick={() => onSelectHotel(hotel.id)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          onSelectHotel(hotel.id);
                        }
                      }}
                      className={`p-4 rounded-xl border flex flex-col justify-between transition-all cursor-pointer ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/25 ring-1 ring-blue-600'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div>
                        <div className="text-xs text-slate-500">
                          {hotel.category} <span aria-hidden="true">·</span> ★ {hotel.rating} (
                          {hotel.reviewCount})
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 mt-1">{hotel.name}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">{hotel.neighborhood}</p>

                        <div className="mt-3 pt-3 border-t border-slate-100 space-y-1 text-xs text-slate-600">
                          <div className="font-medium text-slate-800">{hotel.boardType}</div>
                          <div className="text-slate-500">{hotel.cancellation}</div>
                          {hotel.highlights.map((hl) => (
                            <div key={hl} className="text-slate-600 flex items-start gap-1.5 pt-0.5">
                              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                              <span>{hl}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 space-y-2.5">
                        <div className="flex items-baseline justify-between">
                          <span className="text-xs text-slate-500">
                            {formatMoney(Math.round(hotel.pricePerNightTwoAdults / 2), userCurrency)} / Nacht p.P.
                          </span>
                          <span className="text-base font-mono font-bold text-slate-900 tabular-nums">
                            {formatMoney(hotelSharePP, userCurrency, { showPlus: true })} p.P.
                          </span>
                        </div>

                        <div className="space-y-1.5" onClick={(e) => e.stopPropagation()}>
                          <a
                            href={hotelLinks.expediaPackageUrl}
                            target="_blank"
                            rel="sponsored noopener noreferrer"
                            className="w-full py-1.5 px-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap"
                          >
                            <span>Auf Expedia buchen</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                          <div className="grid grid-cols-2 gap-1.5">
                            <a
                              href={hotelLinks.check24HolidayUrl}
                              target="_blank"
                              rel="sponsored noopener noreferrer"
                              className="py-1 px-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-semibold rounded-md transition-colors flex items-center justify-center gap-1 whitespace-nowrap"
                            >
                              <span>CHECK24</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                            <a
                              href={hotelLinks.abInDenUrlaubUrl}
                              target="_blank"
                              rel="sponsored noopener noreferrer"
                              className="py-1 px-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-semibold rounded-md transition-colors flex items-center justify-center gap-1 whitespace-nowrap"
                            >
                              <span>Ab in d. Urlaub</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right 4 Columns: Contiguous Total Cost Calculator & Direct Provider Booking Links */}
          <div className="lg:col-span-4 lg:sticky lg:top-20">
            <div className="bg-slate-900 text-white rounded-xl p-6">
              <div className="pb-4 border-b border-slate-800">
                <div className="text-xs text-slate-400">
                  Direktbuchung beim Reiseanbieter ({userCurrency}) <span aria-hidden="true">·</span> {durationNights}{' '}
                  Nächte
                </div>
                <h3 className="text-lg font-bold text-white mt-0.5">
                  {destination.city} ({destination.iata})
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {selectedDateStr} bis {activeLinks.returnDateStr} · {travelers}{' '}
                  {travelers === 1 ? 'Erwachsener' : 'Erwachsene'}
                </p>
              </div>

              <div className="py-4 space-y-3 text-sm border-b border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">
                    Flug ({activeRoute?.outbound.originCode} ⇄ {activeRoute?.outbound.destCode})
                  </span>
                  <span className="font-mono font-medium text-white tabular-nums">
                    {formatMoney(
                      activeFlightPerPerson -
                        (activeRoute?.luggageFees[luggage] || 0) -
                        (activeRoute?.railTransferFeePerPerson || 0),
                      userCurrency
                    )}{' '}
                    p.P.
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-300">
                    Gepäck ({luggage === 'personal' ? 'Handgepäck' : luggage === 'cabin' ? 'Trolley 8kg' : 'Koffer 23kg'})
                  </span>
                  <span className="font-mono font-medium text-white tabular-nums">
                    {formatMoney(activeRoute?.luggageFees[luggage] || 0, userCurrency)} p.P.
                  </span>
                </div>

                {(activeRoute?.railTransferFeePerPerson || 0) > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">ÖPNV- / Bahnzubringer zum Airport</span>
                    <span className="font-mono font-medium text-white tabular-nums">
                      {formatMoney(activeRoute?.railTransferFeePerPerson || 0, userCurrency)} p.P.
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-slate-300 truncate pr-2">
                    {activeHotel?.name} ({durationNights} Nächte)
                  </span>
                  <span className="font-mono font-medium text-white tabular-nums shrink-0">
                    {formatMoney(hotelPerPerson, userCurrency)} p.P.
                  </span>
                </div>
              </div>

              {/* Total Price Output */}
              <div className="py-4 border-b border-slate-800">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm font-medium text-slate-300">
                    Komplettpreis pro Person
                  </span>
                  <span className="text-3xl font-mono font-bold text-emerald-400 tabular-nums">
                    {formatMoney(grandTotalPerPerson, userCurrency)}
                  </span>
                </div>

                {userCurrency !== 'EUR' && (
                  <div className="flex items-center justify-between text-xs text-slate-400 mt-1">
                    <span>Entspricht in Euro (Referenzkurs)</span>
                    <span className="font-mono tabular-nums">{grandTotalPerPerson} € p.P.</span>
                  </div>
                )}

                {destLocalCurrency !== userCurrency && (
                  <div className="flex items-center justify-between text-xs text-slate-400 mt-1">
                    <span>Entspricht in Ziel-Landeswährung ({destLocalCurrency})</span>
                    <span className="font-mono tabular-nums">
                      {formatMoney(grandTotalPerPerson, destLocalCurrency)} p.P.
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-slate-300 mt-2 pt-2 border-t border-slate-800/80">
                  <span>Gesamtsumme für {travelers} Reisende</span>
                  <span className="font-mono font-semibold text-white tabular-nums">
                    {formatMoney(grandTotalGroup, userCurrency)} inkl. Gebühren
                  </span>
                </div>
                {totalSavingsGroup > 0 && (
                  <div className="mt-3 text-xs text-emerald-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 shrink-0" />
                    <span>
                      Sie sparen insgesamt{' '}
                      <strong className="font-mono tabular-nums">
                        {formatMoney(totalSavingsGroup, userCurrency)}
                      </strong>{' '}
                      ggü. dem 20-Wochen-Marktdurchschnitt
                    </span>
                  </div>
                )}
              </div>

              {/* Single Primary Best-Price Affiliate Button */}
              <div className="pt-4 space-y-2.5">
                <a
                  href={activeLinks.bestDealDirectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-2 whitespace-nowrap shadow-sm"
                >
                  <span>Zum günstigsten Angebot ({activeLinks.bestDealProviderName})</span>
                  <ExternalLink className="w-4 h-4 shrink-0" />
                </a>

                <div className="pt-1 flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={onOpenBookingSummary}
                    className="w-full py-2 px-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Einzelbuchung & Mietwagen-Optionen anzeigen
                  </button>
                  <button
                    type="button"
                    onClick={onSavePriceAlert}
                    className={`w-full py-2 px-4 text-xs font-semibold rounded-lg border transition-colors cursor-pointer whitespace-nowrap ${
                      isAlertSaved
                        ? 'bg-emerald-950/60 border-emerald-700 text-emerald-300'
                        : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700 text-slate-300'
                    }`}
                  >
                    {isAlertSaved
                      ? 'Im Preis-Wächter gespeichert (Aktiv)'
                      : 'Auf Preis-Wächter-Merkliste setzen'}
                  </button>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 text-[11px] text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Direktweiterleitung ohne Vermittlungsgebühr an offizielle Buchungsportale</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
