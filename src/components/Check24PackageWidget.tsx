import React, { useEffect, useState } from 'react';
import { ExternalLink, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';

interface Check24PackageWidgetProps {
  partnerId?: string;
  fallbackDirectUrl: string;
  expediaCamref?: string;
  expediaDirectUrl?: string;
  discoverCarsDirectUrl?: string;
  tuiCamperDirectUrl?: string;
  camperDaysDirectUrl?: string;
  campingInfoDirectUrl?: string;
  asiReisenDirectUrl?: string;
  destinationCity: string;
}

export const Check24PackageWidget: React.FC<Check24PackageWidgetProps> = ({
  partnerId = '1176801',
  fallbackDirectUrl,
  expediaCamref = '1100l6tjov',
  expediaDirectUrl,
  discoverCarsDirectUrl = 'https://www.discovercars.com/de?a_aid=CleverEntdeckt&a_bid=61a4ac81',
  tuiCamperDirectUrl = 'https://www.awin1.com/cread.php?awinmid=11934&awinaffid=3034525&ued=https%3A%2F%2Fwww.tuicamper.com%2F',
  camperDaysDirectUrl = 'https://www.awin1.com/cread.php?awinmid=52889&awinaffid=3034525&ued=https%3A%2F%2Fwww.camperdays.de%2F',
  campingInfoDirectUrl = 'https://www.awin1.com/cread.php?awinmid=44063&awinaffid=3034525&ued=https%3A%2F%2Fwww.camping.info%2Fde%2Fland%2Fdeutschland',
  asiReisenDirectUrl = 'https://www.awin1.com/cread.php?s=4805736&v=126961&q=607249&r=3034525',
  destinationCity,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  // Extract numeric widget ID if user pasted full script or URL, otherwise default to 1176801
  const cleanWidgetId = (() => {
    const match = (partnerId || '').match(/widgets\/auto\/(\d+)/);
    if (match && match[1]) return match[1];
    const digitsOnly = (partnerId || '').replace(/\D/g, '');
    return digitsOnly.length >= 5 ? digitsOnly : '1176801';
  })();

  // Extract Expedia Partnerize camref if user pasted HTML banner or ID, otherwise default to 1100l6tjov
  const cleanExpediaCamref = (() => {
    const raw = (expediaCamref || '').trim();
    const match =
      raw.match(/data-camref=["']([^"']+)["']/i) ||
      raw.match(/camref[:=]([a-zA-Z0-9_-]+)/i);
    if (match && match[1]) return match[1].trim();
    if (/^[a-z0-9]{7,15}$/i.test(raw)) return raw;
    return '1100l6tjov';
  })();

  useEffect(() => {
    if (!isExpanded) return;

    // 1. Load CHECK24 Official Package iFrame Script
    const c24ScriptId = `c24pp-package-script-${cleanWidgetId}`;
    const existingC24 = document.getElementById(c24ScriptId);
    if (existingC24) {
      existingC24.remove();
    }

    const c24Script = document.createElement('script');
    c24Script.id = c24ScriptId;
    c24Script.src = `https://files.check24.net/widgets/auto/${cleanWidgetId}/c24pp-package-iframe/package-iframe.js`;
    c24Script.async = true;
    document.body.appendChild(c24Script);

    // 2. Load Expedia Group Official Affiliate Banner Script
    const egScriptId = `eg-affiliate-banners-script-${cleanExpediaCamref}`;
    const existingEg = document.getElementById(egScriptId);
    if (existingEg) {
      existingEg.remove();
    }

    const egScript = document.createElement('script');
    egScript.id = egScriptId;
    egScript.className = 'eg-affiliate-banners-script';
    egScript.src = 'https://creator.expediagroup.com/products/banners/assets/eg-affiliate-banners.js';
    egScript.async = true;
    document.body.appendChild(egScript);

    return () => {
      const elC24 = document.getElementById(c24ScriptId);
      if (elC24) elC24.remove();
      const elEg = document.getElementById(egScriptId);
      if (elEg) elEg.remove();
    };
  }, [cleanWidgetId, cleanExpediaCamref, isExpanded]);

  const cleanCity = destinationCity.split('&')[0].trim();

  return (
    <div className="mt-8 pt-8 border-t border-slate-200">
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-blue-600">
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                Offizielle Partner-Widgets aktiv · CHECK24 (#{cleanWidgetId}) · Expedia ({cleanExpediaCamref}) · DiscoverCars · camping.info · ASI Reisen · TUI Camper & CamperDays
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mt-0.5">
              Direkte Pauschalreise-Suche (CHECK24), Expedia Deals, Mietwagen, Camping & Naturreisen
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Ihre Besucher können hier direkt über Ihre offiziellen Partner-Widgets suchen & buchen – jede Buchung wird automatisch Ihrer CHECK24-ID <strong>{cleanWidgetId}</strong>, Ihrer Expedia-ID <strong>{cleanExpediaCamref}</strong>, Ihrem DiscoverCars-Konto <strong>CleverEntdeckt</strong> bzw. Ihrer Awin-ID <strong>3034525</strong> (camping.info, ASI Reisen, TUI Camper & CamperDays) gutgeschrieben.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start sm:self-center shrink-0">
            <a
              href={fallbackDirectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors inline-flex items-center gap-1.5"
            >
              <span>{cleanCity} bei CHECK24</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            {expediaDirectUrl && (
              <a
                href={expediaDirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-semibold rounded-lg transition-colors inline-flex items-center gap-1.5"
              >
                <span>{cleanCity} bei Expedia</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            <a
              href={discoverCarsDirectUrl}
              target="_blank"
              rel="sponsored noopener noreferrer"
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors inline-flex items-center gap-1.5"
            >
              <span>Mietwagen {cleanCity}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <a
              href={campingInfoDirectUrl}
              target="_blank"
              rel="sponsored noopener noreferrer"
              className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg transition-colors inline-flex items-center gap-1.5"
            >
              <span>camping.info</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <a
              href={asiReisenDirectUrl}
              target="_blank"
              rel="sponsored noopener noreferrer"
              className="px-3.5 py-2 bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold rounded-lg transition-colors inline-flex items-center gap-1.5"
            >
              <span>ASI Reisen (Wandern & Natur)</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <a
              href={tuiCamperDirectUrl}
              target="_blank"
              rel="sponsored noopener noreferrer"
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors inline-flex items-center gap-1.5"
            >
              <span>TUI Camper</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <a
              href={camperDaysDirectUrl}
              target="_blank"
              rel="sponsored noopener noreferrer"
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg transition-colors inline-flex items-center gap-1.5"
            >
              <span>CamperDays</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
              type="button"
              onClick={() => setIsExpanded((prev) => !prev)}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors inline-flex items-center gap-1 cursor-pointer"
            >
              <span>{isExpanded ? 'Einklappen' : 'Widgets anzeigen'}</span>
              {isExpanded ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        {isExpanded && (
          <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
            {/* CHECK24 Pauschalreise iFrame Widget */}
            <div className="lg:col-span-7 bg-slate-50 border border-slate-200/80 rounded-xl p-3 sm:p-4 min-h-[260px]">
              <div className="text-[11px] font-mono font-semibold text-slate-500 mb-2">
                CHECK24 PAUSCHALREISE-RECHNER (ID #{cleanWidgetId})
              </div>
              <div
                style={{ width: '100%' }}
                id="c24pp-package-iframe"
                data-offer="allgemein"
                data-scrollto="begin"
                data-forward-url="no"
              />
            </div>

            {/* Right Column: Official Expedia Banner + Official DiscoverCars Banner */}
            <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
              {/* Official Expedia Group Affiliate Banner (camref: 1100l6tjov) */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 sm:p-4 flex flex-col items-center justify-between">
                <div className="w-full flex items-center justify-between text-[11px] font-mono font-semibold text-slate-500 mb-2">
                  <span>EXPEDIA PARTNER-DEAL ({cleanExpediaCamref})</span>
                  {expediaDirectUrl && (
                    <a
                      href={expediaDirectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Zielsuche →
                    </a>
                  )}
                </div>
                <div className="my-auto flex items-center justify-center w-full overflow-hidden">
                  <div
                    className="eg-affiliate-banners"
                    data-program="de-expedia"
                    data-network="pz"
                    data-layout="medium-rectangle"
                    data-image="tropical"
                    data-message="sun-seeker-find-perfect-beach-getaway"
                    data-camref={cleanExpediaCamref}
                    data-pubref=""
                    data-link="home"
                  />
                </div>
              </div>

              {/* Official DiscoverCars Banner + Tracking Pixel (a_aid=CleverEntdeckt & a_bid=61a4ac81) */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 sm:p-4 flex flex-col items-center justify-between">
                <div className="w-full flex items-center justify-between text-[11px] font-mono font-semibold text-slate-500 mb-2">
                  <span>DISCOVERCARS MIETWAGEN (a_aid: CleverEntdeckt)</span>
                  <a
                    href={discoverCarsDirectUrl}
                    target="_blank"
                    rel="sponsored noopener noreferrer"
                    className="text-emerald-700 hover:underline"
                  >
                    Ab Zielflughafen →
                  </a>
                </div>
                <a
                  href={discoverCarsDirectUrl}
                  target="_blank"
                  rel="sponsored noopener noreferrer"
                  className="block w-full overflow-hidden rounded-lg border border-slate-200 hover:opacity-95 transition-opacity"
                >
                  <img
                    src="https://discover-car-hire.postaffiliatepro.com/accounts/default1/bunyh71e/61a4ac81.jpg"
                    alt="DiscoverCars.com Mietwagen Preisvergleich"
                    width={601}
                    height={397}
                    className="w-full h-auto object-cover"
                    loading="lazy"
                  />
                </a>
                <img
                  src="https://discover-car-hire.postaffiliatepro.com/scripts/iunyh71e?a_aid=CleverEntdeckt&a_bid=61a4ac81"
                  width={1}
                  height={1}
                  alt=""
                  className="sr-only"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
