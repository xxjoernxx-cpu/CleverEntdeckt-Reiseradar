import React, { useState } from 'react';
import { Download, Smartphone, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuideModal, setShowGuideModal] = useState(false);

  if (isInstalled) {
    return null;
  }

  if (isInstallable) {
    return (
      <button
        type="button"
        onClick={install}
        className="px-3 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5 shadow-2xs"
      >
        <Download className="w-3.5 h-3.5" />
        <span>App installieren</span>
      </button>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setShowGuideModal(true)}
        className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5"
      >
        <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
        <span>Als App installieren</span>
      </button>

      {showGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-2xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-xs font-semibold text-emerald-700 block">
                  Smartphone & Tablet App (Android & iOS)
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">
                  CleverEntdeckt, Sparflug & Reiseradar auf dem Startbildschirm installieren
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowGuideModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {isIOS ? (
              <div className="text-xs text-slate-700 space-y-2 bg-slate-50 border border-slate-200 rounded-xl p-3.5">
                <div className="font-bold text-slate-900">Auf iPhone / iPad (Safari):</div>
                <ol className="list-decimal list-inside space-y-1.5">
                  <li>
                    Tippen Sie unten in der Safari-Leiste auf das <strong>Teilen-Symbol</strong>{' '}
                    (Viereck mit Pfeil nach oben).
                  </li>
                  <li>
                    Wählen Sie im Menü den Punkt <strong>„Zum Home-Bildschirm“</strong>.
                  </li>
                  <li>
                    Bestätigen Sie oben rechts mit <strong>„Hinzufügen“</strong>.
                  </li>
                </ol>
              </div>
            ) : (
              <div className="text-xs text-slate-700 space-y-2 bg-slate-50 border border-slate-200 rounded-xl p-3.5">
                <div className="font-bold text-slate-900">
                  Auf Android (Chrome) & Desktop:
                </div>
                <ol className="list-decimal list-inside space-y-1.5">
                  <li>
                    Tippen Sie oben rechts im Browser auf das <strong>Drei-Punkte-Menü (⋮)</strong>{' '}
                    oder das Installations-Symbol in der Adresszeile.
                  </li>
                  <li>
                    Wählen Sie <strong>„App installieren“</strong> bzw.{' '}
                    <strong>„Zum Startbildschirm hinzufügen“</strong>.
                  </li>
                </ol>
              </div>
            )}

            <button
              type="button"
              onClick={() => setShowGuideModal(false)}
              className="w-full rounded-lg bg-slate-900 hover:bg-slate-800 py-2.5 text-xs font-semibold text-white transition-colors cursor-pointer"
            >
              Verstanden
            </button>
          </div>
        </div>
      )}
    </>
  );
};
