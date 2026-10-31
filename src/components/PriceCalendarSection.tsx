import React from 'react';
import { Calendar, TrendingDown } from 'lucide-react';
import {
  DailyPricePoint,
  DestinationDeal,
  UserCurrencyCode,
  formatMoney,
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
  userCurrency,
}) => {
  const days: DailyPricePoint[] = destination.monthlyCalendar[selectedMonth] || [];

  // Calculate optimization discount factor based on enabled smart rules
  const discountMultiplier =
    includeNearbyAirports ? 0.76 : includeSplitTickets ? 0.85 : 1.0;

  const computeTotalPerPerson = (day: DailyPricePoint) => {
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

  return (
    <section id="preiskalender" className="py-12 border-t border-slate-200">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
          <div>
            <p className="text-xs font-medium text-slate-500">
              02. Flexibler Tiefpreis-Kalender <span aria-hidden="true">·</span> {destination.city} ({destination.iata}) <span aria-hidden="true">·</span> Währung: {userCurrency}
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mt-1 text-balance">
              Taggenaue Gesamtreisekosten für {durationNights} Nächte inklusive Unterkunft
            </h2>
          </div>

          {/* Interactive Month Segmented Selector */}
          <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-lg self-start">
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
              <div className="flex items-center gap-4">
                <span className="font-semibold text-slate-900">
                  Preisstufen (Flug + {durationNights} Nächte Hotel p.P.):
                </span>
                <span className="text-emerald-700 font-medium">
                  Tiefstpreis ab {formatMoney(minTotal, userCurrency)}
                </span>
                <span aria-hidden="true">·</span>
                <span>Monatsmittel {formatMoney(avgTotal, userCurrency)}</span>
                <span aria-hidden="true">·</span>
                <span className="text-slate-500">Spitzenwert {formatMoney(maxTotal, userCurrency)}</span>
              </div>
              <span className="text-slate-500">
                Klicken Sie auf ein Abflugdatum zur Routenberechnung
              </span>
            </div>

            {/* Weekday Header */}
            <div className="grid grid-cols-7 gap-1.5 mb-2 text-center text-xs font-semibold text-slate-500">
              <div>Mo</div>
              <div>Di (Spar-Tag)</div>
              <div>Mi (Spar-Tag)</div>
              <div>Do</div>
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
                const isBestDeal = total <= minTotal + 12;
                const isAboveAvg = total > avgTotal + 25;

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
                          Tiefpreis
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
                        {formatMoney(total, userCurrency)}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Selected Date Deep Breakdown & 30-Day Trend (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <div>
                  <span className="text-xs text-slate-500 block">Gewähltes Abflugdatum</span>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mt-0.5">
                    <Calendar className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>
                      {selectedDayObj?.weekdayShort}, {selectedDayObj?.dayOfMonth}.{' '}
                      {MONTH_LABELS[selectedMonth]}
                    </span>
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-500 block">Gesamt p.P.</span>
                  <span className="text-xl font-mono font-bold text-emerald-700 tabular-nums">
                    {formatMoney(selectedTotal, userCurrency)}
                  </span>
                </div>
              </div>

              {selectedDayObj && (
                <div className="space-y-2.5 text-sm">
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Hin- & Rückflug (Optimierter Tarif)</span>
                    <span className="font-mono font-medium text-slate-900 tabular-nums">
                      {formatMoney(Math.round(selectedDayObj.flightPrice * discountMultiplier), userCurrency)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Gepäckzuschlag (gewählte Option)</span>
                    <span className="font-mono font-medium text-slate-900 tabular-nums">
                      {formatMoney(luggageFeePerPerson, userCurrency)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span>
                      Unterkunft ({durationNights} Nächte · Anteil p.P.)
                    </span>
                    <span className="font-mono font-medium text-slate-900 tabular-nums">
                      {formatMoney(Math.round((selectedDayObj.hotelPerNight * durationNights) / 2), userCurrency)}
                    </span>
                  </div>
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-emerald-700 font-medium">
                    <span>Ersparnis gegenüber Monats-Spitze</span>
                    <span className="font-mono font-semibold tabular-nums">
                      {formatMoney(Math.max(0, maxTotal - selectedTotal), userCurrency, { showMinus: true })} pro Person
                    </span>
                  </div>
                </div>
              )}

              <div className="mt-5 pt-4 border-t border-slate-100">
                <p className="text-xs text-slate-500 leading-relaxed">
                  <strong className="text-slate-800">Wochentags-Regel:</strong> Abflüge am{' '}
                  {destination.cheapestWeekday} sind auf dieser Strecke im Schnitt{' '}
                  <span className="font-mono text-slate-800 tabular-nums">24 %</span> günstiger als
                  Freitags- oder Samstagsflüge.
                </p>
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
                  Buchungsfenster optimal
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
