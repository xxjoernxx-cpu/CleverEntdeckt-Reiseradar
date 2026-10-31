import React from 'react';
import { Calendar, TrendingDown, ExternalLink } from 'lucide-react';
import {
  DailyPricePoint,
  DestinationDeal,
  UserCurrencyCode,
  formatMoney,
  buildProviderBookingLinks,
  AffiliatePartnerConfig,
} from '../data/travelData';

interface PriceCalendarSectionProps {
  destination: DestinationDeal;
  selectedMonth: string;
  onSelectMonth: (monthKey: string) => void;
  selectedDateStr: string;
  onSelectDate: (dateStr: string) => void;
  durationNights: number;
  luggageFeePerPerson: number;
  includeNearbyAirports: boolean;
  includeSplitTickets: boolean;
  originCode: string;
  userCurrency: UserCurrencyCode;
  travelers?: number;
  affiliateConfig?: AffiliatePartnerConfig;
  isCampingMode?: boolean;
}

const MONTH_LABELS: Record<string, string> = {
  '2026-11': 'November 2026',
  '2026-12': 'Dezember 2026',
  '2027-01': 'Januar 2027',
  '2027-02': 'Februar 2027',
};

export const PriceCalendarSection: React.FC<PriceCalendarSectionProps> = ({
  destination,
  selectedMonth,
  onSelectMonth,
  selectedDateStr,
  onSelectDate,
  durationNights,
  luggageFeePerPerson,
  includeNearbyAirports,
  includeSplitTickets,
  originCode,
  userCurrency,
  travelers = 2,
  affiliateConfig,
  isCampingMode = false,
}) => {
  const days: DailyPricePoint[] = destination.monthlyCalendar[selectedMonth] || [];

  // Calculate optimization discount factor based on enabled smart rules
  const discountMultiplier =
    includeNearbyAirports ? 0.76 : includeSplitTickets ? 0.85 : 1.0;

  const computeTotalPerPerson = (day: DailyPricePoint) => {
    if (isCampingMode) {
      // Realistic camping pitch / nature trip orientation per person for durationNights
      const basePitchPerPersonPerNight = Math.max(12, Math.round(day.hotelPerNight * 0.28));
      return basePitchPerPersonPerNight * durationNights;
    }
    const optimizedFlight = Math.round(day.flightPrice * discountMultiplier) + luggageFeePerPerson;
    const hotelSharePerPerson = Math.round((day.hotelPerNight * durationNights) / 2);
    return optimizedFlight + hotelSharePerPerson;
  };

  const allTotals = days.map(computeTotalPerPerson);
  const minTotal = Math.min(...allTotals);
  const maxTotal = Math.max(...allTotals);
  const avgTotal = Math.round(allTotals.reduce((a, b) => a + b, 0) / (allTotals.length || 1));

  // Find first day offset so Monday is first column
  const firstDayDate = days.length > 0 ? new Date(days[0].dateStr) : new Date();
  const jsDay = firstDayDate.getDay(); // 0 = Sun, 1 = Mon ...
  const mondayOffset = jsDay === 0 ? 6 : jsDay - 1;

  const selectedDayObj = days.find((d) => d.dateStr === selectedDateStr) || days[0];
  const selectedTotal = selectedDayObj ? computeTotalPerPerson(selectedDayObj) : minTotal;

  const calendarLinks = buildProviderBookingLinks({
    originCode,
    destCode: destination.iata,
    destCity: destination.city,
    hotelName: destination.city,
    carrierName: 'Lufthansa',
    departureDateStr: selectedDayObj?.dateStr || selectedDateStr,
    durationNights,
    travelers,
    userCurrency,
    affiliateConfig,
    travelMode: isCampingMode ? 'camping_nature' : 'standard',
  });

  return (
    <section id="preiskalender" className="py-12 border-t border-slate-200">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
          <div>
            <p className="text-xs font-medium text-slate-500">
              02. Flexibler Tiefpreis-Kalender <span aria-hidden="true">·</span> {destination.city} ({destination.iata}) <span aria-hidden="true">·</span> Währung: {userCurrency}
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mt-1 text-balance">
              {isCampingMode
                ? `Günstigste Anreisetage für ${durationNights} Nächte Camping-, Camper- & Natururlaub finden`
                : `Günstigste Anreisetage für ${durationNights} Nächte finden (Richtwerte inkl. Flug & Unterkunft)`}
            </h2>
          </div>

          {/* Interactive Month Segmented Selector */}
          <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-lg self-start overflow-x-auto">
            {Object.keys(MONTH_LABELS).map((mKey) => (
              <button
                key={mKey}
                type="button"
                onClick={() => onSelectMonth(mKey)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  selectedMonth === mKey
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {MONTH_LABELS[mKey]}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Calendar Heatmap Grid (8 cols) */}
          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-5">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-4 border-b border-slate-100 text-xs text-slate-600">
              <div className="flex flex-wrap items-center gap-4">
                <span className="font-semibold text-slate-900">
                  {isCampingMode
                    ? `Richtwerte (${durationNights} Nächte Stellplatz/Unterkunft p.P.):`
                    : `Richtwerte (Flug + ${durationNights} Nächte p.P.):`}
                </span>
                <span className="text-emerald-700 font-semibold">
                  Günstigster Tag ab {formatMoney(minTotal, userCurrency)}
                </span>
                <span aria-hidden="true">·</span>
                <span>Monatsmittel {formatMoney(avgTotal, userCurrency)}</span>
                <span aria-hidden="true">·</span>
                <span className="text-slate-500">Spitzenwert {formatMoney(maxTotal, userCurrency)}</span>
              </div>
              <span className="text-slate-500">
                Klick auf einen Tag übernimmt das Datum in den Tiefpreis-Vergleich
              </span>
            </div>

            {/* Weekday Header */}
            <div className="grid grid-cols-7 gap-1.5 mb-2 text-center text-xs font-semibold text-slate-500">
              <div>Mo</div>
              <div className="text-emerald-700">Di (Spar-Tag)</div>
              <div className="text-emerald-700">Mi (Spar-Tag)</div>
              <div className="text-emerald-700">Do (Spar-Tag)</div>
              <div>Fr</div>
              <div>Sa</div>
              <div>So</div>
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1.5">
              {Array.from({ length: mondayOffset }).map((_, idx) => (
                <div key={`empty-${idx}`} className="h-16 rounded-lg bg-slate-50/60" />
              ))}

              {days.map((day) => {
                const total = computeTotalPerPerson(day);
                const isSelected = day.dateStr === selectedDayObj?.dateStr;
                const isBestDeal = total <= minTotal + (isCampingMode ? 5 : 12);
                const isAboveAvg = total > avgTotal + (isCampingMode ? 10 : 25);

                return (
                  <button
                    key={day.dateStr}
                    type="button"
                    onClick={() => onSelectDate(day.dateStr)}
                    className={`h-16 rounded-lg p-2 text-left flex flex-col justify-between transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600 ring-2 ring-blue-600/30'
                        : isBestDeal
                        ? 'bg-emerald-50/70 hover:bg-emerald-100/80 border-emerald-200 text-slate-900'
                        : isAboveAvg
                        ? 'bg-slate-50 hover:bg-slate-100 border-slate-200/70 text-slate-600'
                        : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span
                        className={`text-xs font-mono tabular-nums ${
                          isSelected ? 'text-white/90 font-semibold' : 'text-slate-500'
                        }`}
                      >
                        {day.dayOfMonth}.
                      </span>
                      {isBestDeal && !isSelected && (
                        <span className="text-[10px] font-semibold text-emerald-700">
                          Spartag
                        </span>
                      )}
                    </div>

                    <div className="mt-auto">
                      <span
                        className={`text-xs sm:text-sm font-mono font-semibold tabular-nums block leading-none truncate ${
                          isSelected
                            ? 'text-white'
                            : isBestDeal
                            ? 'text-emerald-800'
                            : 'text-slate-900'
                        }`}
                      >
                        ab {formatMoney(total, userCurrency)}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Selected Date Deep Breakdown & Direct Lowest-Price Check (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <div>
                  <span className="text-xs text-slate-500 block">Gewähltes Anreisedatum</span>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mt-0.5">
                    <Calendar className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>
                      {selectedDayObj?.weekdayShort}, {selectedDayObj?.dayOfMonth}.{' '}
                      {MONTH_LABELS[selectedMonth]}
                    </span>
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-500 block">Richtwert p.P.</span>
                  <span className="text-xl font-mono font-bold text-emerald-700 tabular-nums">
                    ab {formatMoney(selectedTotal, userCurrency)}
                  </span>
                </div>
              </div>

              {selectedDayObj && (
                <div className="space-y-2 text-xs">
                  {isCampingMode ? (
                    <>
                      <div className="flex items-center justify-between text-slate-600">
                        <span>Stellplatz / Camping ({durationNights} Nächte p.P.)</span>
                        <span className="font-mono font-medium text-slate-900 tabular-nums">
                          ab {formatMoney(selectedTotal, userCurrency)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-slate-600">
                        <span>Reisezeitraum:</span>
                        <span className="font-mono font-medium text-slate-900">
                          {selectedDayObj.dateStr} bis {calendarLinks.returnDateStr}
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center justify-between text-slate-600">
                        <span>Hin- & Rückflug (Richtwert)</span>
                        <span className="font-mono font-medium text-slate-900 tabular-nums">
                          ab {formatMoney(Math.round(selectedDayObj.flightPrice * discountMultiplier), userCurrency)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-slate-600">
                        <span>
                          Günstigste 3★–4★ Unterkunft ({durationNights} Nächte p.P.)
                        </span>
                        <span className="font-mono font-medium text-slate-900 tabular-nums">
                          ab {formatMoney(Math.round((selectedDayObj.hotelPerNight * durationNights) / 2), userCurrency)}
                        </span>
                      </div>
                    </>
                  )}
                  <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-emerald-700 font-medium">
                    <span>Vorteil gegenüber Monats-Spitze</span>
                    <span className="font-mono font-semibold tabular-nums">
                      {formatMoney(Math.max(0, maxTotal - selectedTotal), userCurrency, { showMinus: true })} p.P.
                    </span>
                  </div>
                </div>
              )}

              {/* Direct Lowest-Price Live Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                {isCampingMode ? (
                  <>
                    <a
                      href={calendarLinks.campingInfoUrl}
                      target="_blank"
                      rel="sponsored noopener noreferrer"
                      className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span>Günstigste Campingplätze bei camping.info</span>
                      <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                    </a>
                    <div className="grid grid-cols-2 gap-1.5">
                      <a
                        href={calendarLinks.snowTrexUrl}
                        target="_blank"
                        rel="sponsored noopener noreferrer"
                        className="py-1.5 px-2 bg-amber-500 hover:bg-amber-600 text-slate-950 text-[11px] font-semibold rounded-md text-center transition-colors"
                      >
                        ASI Wanderreisen
                      </a>
                      <a
                        href={calendarLinks.camperDaysUrl}
                        target="_blank"
                        rel="sponsored noopener noreferrer"
                        className="py-1.5 px-2 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-semibold rounded-md text-center transition-colors"
                      >
                        CamperDays
                      </a>
                    </div>
                  </>
                ) : (
                  <>
                    <a
                      href={calendarLinks.expediaPackageUrl}
                      target="_blank"
                      rel="sponsored noopener noreferrer"
                      className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span>Günstigste Hotels ({selectedDayObj?.dateStr}) bei Expedia</span>
                      <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                    </a>
                    <div className="grid grid-cols-2 gap-1.5">
                      <a
                        href={calendarLinks.check24HolidayUrl}
                        target="_blank"
                        rel="sponsored noopener noreferrer"
                        className="py-1.5 px-2 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-semibold rounded-md text-center transition-colors"
                      >
                        CHECK24 Tiefpreis
                      </a>
                      <a
                        href={calendarLinks.tripComUrl}
                        target="_blank"
                        rel="sponsored noopener noreferrer"
                        className="py-1.5 px-2 bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-semibold rounded-md text-center transition-colors"
                      >
                        Trip.com Flüge
                      </a>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* 30-Day Historical Price Curve */}
            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <TrendingDown className="w-4 h-4 text-emerald-600" />
                  <span>Preisentwicklung (letzte 30 Tage)</span>
                </h4>
                <span className="text-xs font-mono text-emerald-700 font-semibold tabular-nums">
                  Günstiges Buchungsfenster
                </span>
              </div>

              <div className="grid grid-cols-6 gap-2 items-end h-28 pt-4 pb-1 border-b border-slate-100">
                {destination.priceHistory30Days.map((pt, i) => {
                  const maxHist = Math.max(...destination.priceHistory30Days.map((x) => x.price));
                  const heightPct = Math.max(25, Math.round((pt.price / maxHist) * 100));
                  const isLast = i === destination.priceHistory30Days.length - 1;
                  return (
                    <div key={pt.dayLabel} className="flex flex-col items-center gap-1.5 h-full justify-end">
                      <span
                        className={`text-[10px] font-mono tabular-nums truncate max-w-full ${
                          isLast ? 'font-bold text-emerald-700' : 'text-slate-500'
                        }`}
                      >
                        {formatMoney(pt.price, userCurrency)}
                      </span>
                      <div
                        className={`w-full rounded-t transition-all ${
                          isLast ? 'bg-emerald-600' : 'bg-slate-200'
                        }`}
                        style={{ height: `${heightPct}%` }}
                      />
                    </div>
                  );
                })}
              </div>
              <div className="grid grid-cols-6 gap-2 mt-1.5 text-center">
                {destination.priceHistory30Days.map((pt) => (
                  <span key={pt.dayLabel} className="text-[10px] text-slate-500 truncate">
                    {pt.dayLabel}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
