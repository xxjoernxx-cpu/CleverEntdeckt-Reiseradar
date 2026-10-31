import React, { useState, useEffect } from 'react';
import { ArrowLeftRight, ShieldAlert, Calculator } from 'lucide-react';
import {
  DestinationDeal,
  UserCurrencyCode,
  SUPPORTED_CURRENCIES,
  DESTINATION_LOCAL_CURRENCY,
  formatMoney,
} from '../data/travelData';

interface CurrencyConverterPanelProps {
  userCurrency: UserCurrencyCode;
  onChangeUserCurrency: (currency: UserCurrencyCode) => void;
  activeDestination: DestinationDeal;
  tripTotalEurPerPerson?: number;
  travelers?: number;
}

export const CurrencyConverterPanel: React.FC<CurrencyConverterPanelProps> = ({
  userCurrency,
  onChangeUserCurrency,
  activeDestination,
}) => {
  const destLocalMeta =
    DESTINATION_LOCAL_CURRENCY[activeDestination.id] || {
      code: 'EUR' as UserCurrencyCode,
      name: 'Euro (EUR)',
      fxSavingTip: 'Zahlen Sie vor Ort immer in der Landeswährung ohne dynamische Währungsumrechnung.',
    };

  const [customAmount, setCustomAmount] = useState<string>('100');
  const [fromCurrency, setFromCurrency] = useState<UserCurrencyCode>(userCurrency);
  const [toCurrency, setToCurrency] = useState<UserCurrencyCode>(
    destLocalMeta.code !== userCurrency ? destLocalMeta.code : 'EUR'
  );

  // Sync converter currencies when user changes home currency or destination
  useEffect(() => {
    setFromCurrency(userCurrency);

    if (destLocalMeta.code !== userCurrency) {
      setToCurrency(destLocalMeta.code);
    } else if (userCurrency !== 'EUR') {
      setToCurrency('EUR');
    } else {
      setToCurrency('CHF');
    }
  }, [userCurrency, activeDestination.id, destLocalMeta.code]);

  const numericInput = Math.max(0, Number(customAmount) || 0);
  const fromRate = SUPPORTED_CURRENCIES[fromCurrency].rateFromEur;
  const toRate = SUPPORTED_CURRENCIES[toCurrency].rateFromEur;

  // Convert from `fromCurrency` -> EUR -> `toCurrency`
  const amountInEur = numericInput / (fromRate || 1);
  const convertedResult = amountInEur * toRate;
  const effectiveCrossRate = toRate / (fromRate || 1);

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <span className="text-xs font-medium text-slate-500 block">
            Währungsrechner & Urlaubskassen-Umrechner <span aria-hidden="true">·</span> EZB-Referenzkurse
          </span>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mt-0.5">
            <Calculator className="w-4 h-4 text-blue-600 shrink-0" />
            <span>
              Heimatwährung ({userCurrency}) ⇄ Landeswährung in {activeDestination.city.split(' ')[0]} ({destLocalMeta.code})
            </span>
          </h3>
        </div>

        {/* Quick Home Currency Selector */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg self-start">
          {(['EUR', 'CHF', 'USD', 'GBP'] as UserCurrencyCode[]).map((code) => (
            <button
              key={code}
              type="button"
              onClick={() => onChangeUserCurrency(code)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                userCurrency === code
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {code} ({SUPPORTED_CURRENCIES[code].symbol})
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-4 items-center">
        {/* Interactive Two-Way Calculator (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-11 gap-2.5 items-end">
            {/* From Input */}
            <div className="sm:col-span-5">
              <label
                htmlFor="fx-amount-input"
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                Betrag in Zahlungswährung
              </label>
              <div className="flex rounded-lg border border-slate-300 bg-slate-50 focus-within:ring-2 focus-within:ring-blue-600 focus-within:bg-white overflow-hidden">
                <input
                  id="fx-amount-input"
                  type="number"
                  min="0"
                  step="10"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="w-full px-3 py-2 text-sm font-mono font-semibold text-slate-900 bg-transparent focus:outline-none tabular-nums"
                />
                <select
                  aria-label="Ausgangswährung"
                  value={fromCurrency}
                  onChange={(e) => setFromCurrency(e.target.value as UserCurrencyCode)}
                  className="px-2.5 py-2 bg-slate-100 border-l border-slate-300 text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
                >
                  {Object.keys(SUPPORTED_CURRENCIES).map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Swap Button */}
            <div className="sm:col-span-1 flex justify-center">
              <button
                type="button"
                onClick={handleSwapCurrencies}
                title="Währungen tauschen"
                className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
              >
                <ArrowLeftRight className="w-4 h-4" />
              </button>
            </div>

            {/* To Output */}
            <div className="sm:col-span-5">
              <label
                htmlFor="fx-target-select"
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                Umgerechneter Zielbetrag
              </label>
              <div className="flex rounded-lg border border-blue-200 bg-blue-50/40 overflow-hidden">
                <div className="w-full px-3 py-2 text-sm font-mono font-bold text-blue-950 tabular-nums truncate">
                  {convertedResult.toLocaleString('de-DE', {
                    minimumFractionDigits: convertedResult < 20 ? 2 : 0,
                    maximumFractionDigits: convertedResult < 20 ? 2 : 0,
                  })}
                </div>
                <select
                  id="fx-target-select"
                  aria-label="Zielwährung"
                  value={toCurrency}
                  onChange={(e) => setToCurrency(e.target.value as UserCurrencyCode)}
                  className="px-2.5 py-2 bg-blue-100/70 border-l border-blue-200 text-xs font-bold text-blue-950 focus:outline-none cursor-pointer"
                >
                  {Object.keys(SUPPORTED_CURRENCIES).map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Preset Quick Amounts */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 pt-1">
            <span>
              Wechselkurs:{' '}
              <strong className="font-mono text-slate-800 tabular-nums">
                1 {fromCurrency} ={' '}
                {effectiveCrossRate.toLocaleString('de-DE', {
                  minimumFractionDigits: effectiveCrossRate < 2 ? 4 : 2,
                  maximumFractionDigits: effectiveCrossRate < 2 ? 4 : 2,
                })}{' '}
                {toCurrency}
              </strong>
            </span>

            <div className="flex flex-wrap items-center gap-1.5">
              <span>Schnellwahl:</span>
              {[50, 100, 250, 500, 1000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => {
                    setFromCurrency(userCurrency);
                    setCustomAmount(String(amt));
                  }}
                  className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded transition-colors cursor-pointer"
                >
                  {amt} {userCurrency}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Local Price Orientation & No-DCC Fee Tip (5 cols) */}
        <div className="lg:col-span-5 bg-slate-50 border border-slate-200/80 rounded-lg p-3.5 text-xs space-y-2">
          <div className="flex items-center justify-between border-b border-slate-200/70 pb-2">
            <span className="font-semibold text-slate-800">
              Nebenkosten-Orientierung in {activeDestination.city.split(' ')[0]}
            </span>
            <span className="font-mono text-emerald-700 font-semibold">
              Landeswährung: {destLocalMeta.code}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-slate-600">
            <div>
              <span className="text-slate-500 block">Ø Hauptgericht im Lokal:</span>
              <strong className="font-mono text-slate-900 tabular-nums">
                ca. {formatMoney(activeDestination.mealCostIndex, userCurrency, { exactDecimals: true })}
              </strong>
              {destLocalMeta.code !== userCurrency && (
                <span className="text-slate-500 font-mono tabular-nums ml-1">
                  ({formatMoney(activeDestination.mealCostIndex, destLocalMeta.code)})
                </span>
              )}
            </div>
            <div>
              <span className="text-slate-500 block">Ø 24h ÖPNV-Tagesticket:</span>
              <strong className="font-mono text-slate-900 tabular-nums">
                ca. {formatMoney(activeDestination.localTransitDayPass, userCurrency, { exactDecimals: true })}
              </strong>
              {destLocalMeta.code !== userCurrency && (
                <span className="text-slate-500 font-mono tabular-nums ml-1">
                  ({formatMoney(activeDestination.localTransitDayPass, destLocalMeta.code)})
                </span>
              )}
            </div>
          </div>

          <p className="text-[11px] text-slate-600 pt-1 border-t border-slate-200/60 flex items-start gap-1.5 leading-relaxed">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
            <span>{destLocalMeta.fxSavingTip}</span>
          </p>
        </div>
      </div>
    </div>
  );
};
