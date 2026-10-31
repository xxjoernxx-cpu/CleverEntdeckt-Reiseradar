import React, { useEffect, useRef, useState } from 'react';
import { ExternalLink, ShieldCheck, Search } from 'lucide-react';

interface Check24PackageWidgetProps {
  partnerId?: string;
  fallbackDirectUrl: string;
  expediaCamref?: string;
  expediaDirectUrl?: string;
  expediaFlightDirectUrl?: string;
  discoverCarsDirectUrl?: string;
  tuiCamperDirectUrl?: string;
  camperDaysDirectUrl?: string;
  campingInfoDirectUrl?: string;
  asiReisenDirectUrl?: string;
  destinationCity?: string;
}

export const Check24PackageWidget: React.FC<Check24PackageWidgetProps> = ({
  partnerId = '1176801',
  fallbackDirectUrl,
  expediaCamref = '1100l6tjov',
  expediaDirectUrl,
  expediaFlightDirectUrl,
  discoverCarsDirectUrl = 'https://www.discovercars.com/de?a_aid=CleverEntdeckt&a_bid=61a4ac81',
  tuiCamperDirectUrl = 'https://www.awin1.com/cread.php?awinmid=11934&awinaffid=3034525&ued=https%3A%2F%2Fwww.tuicamper.com%2F',
  camperDaysDirectUrl = 'https://www.awin1.com/cread.php?awinmid=52889&awinaffid=3034525&ued=https%3A%2F%2Fwww.camperdays.de%2F',
  campingInfoDirectUrl = 'https://www.awin1.com/cread.php?awinmid=44063&awinaffid=3034525&ued=https%3A%2F%2Fwww.camping.info%2Fde%2Fland%2Fdeutschland',
  asiReisenDirectUrl = 'https://www.awin1.com/cread.php?s=4805736&v=126961&q=607249&r=3034525',
  destinationCity,
}) => {
  const widgetContainerRef = useRef<HTMLDivElement>(null);
  const expediaWidgetRef = useRef<HTMLDivElement>(null);
  const [activeLiveSearchTab, setActiveLiveSearchTab] = useState<'expedia' | 'check24'>('expedia');

  // Extract numeric CHECK24 Partner ID if a full snippet or URL was passed
  const cleanPartnerId = (() => {
    const raw = partnerId.trim();
    const digitsMatch = raw.match(/\/widgets\/auto\/(\d+)\//i) || raw.match(/\b(\d{5,10})\b/);
    return digitsMatch ? digitsMatch[1] : '1176801';
  })();

  // Extract clean Expedia Partnerize camref (default: 1100l6tjov)
  const cleanExpediaCamref = (() => {
    const raw = expediaCamref.trim();
    const camrefMatch =
      raw.match(/camref[:=]([a-zA-Z0-9]+)/i) || raw.match(/\b(1100[a-zA-Z0-9]+)\b/);
    return camrefMatch ? camrefMatch[1] : '1100l6tjov';
  })();

  const finalExpediaUrl =
    expediaDirectUrl ||
    `https://www.expedia.de/affiliate?siteid=6&landingPage=${encodeURIComponent(
      'https://www.expedia.de/Hotel-Search?siteid=6&langid=1031'
    )}&camref=${encodeURIComponent(cleanExpediaCamref)}&creativeref=1101l87346`;

  // Load CHECK24 Live Widget script
  useEffect(() => {
    if (activeLiveSearchTab !== 'check24') return;
    const container = widgetContainerRef.current;
    if (!container) return;

    container.innerHTML = '';

    const widgetDiv = document.createElement('div');
    widgetDiv.id = 'c24pp-package-iframe';
    widgetDiv.setAttribute('data- partner', cleanPartnerId);
    widgetDiv.setAttribute('data-partner', cleanPartnerId);
    container.appendChild(widgetDiv);

    const script = document.createElement('script');
    script.src = `https://files.check24.net/widgets/auto/${cleanPartnerId}/c24pp-package-iframe/package-iframe.js`;
    script.async = true;
    container.appendChild(script);

    return () => {
      container.innerHTML = '';
    };
  }, [cleanPartnerId, activeLiveSearchTab]);

  // Load Official Expedia Group Live Search Widget script (eg-widgets.js)
  useEffect(() => {
    if (activeLiveSearchTab !== 'expedia') return;
    const container = expediaWidgetRef.current;
    if (!container) return;

    container.innerHTML = '';

    const egDiv = document.createElement('div');
    egDiv.className = 'eg-widget';
    egDiv.setAttribute('data-widget', 'search');
    egDiv.setAttribute('data-program', 'de-expedia');
    egDiv.setAttribute('data-lobs', 'stays,flights');
    egDiv.setAttribute('data-network', 'pz');
    egDiv.setAttribute('data-camref', cleanExpediaCamref);
    container.appendChild(egDiv);

    const script = document.createElement('script');
    script.className = 'eg-widgets-script';
    script.src = 'https://creator.expediagroup.com/products/widgets/assets/eg-widgets.js';
    script.async = true;
    container.appendChild(script);

    return () => {
      container.innerHTML = '';
    };
  }, [cleanExpediaCamref, activeLiveSearchTab]);

  const cleanCity = destinationCity ? destinationCity.split('&')[0].trim() : '';

  return (
    <div className="mt-8 pt-8 border-t border-slate-200 space-y-6">
      {/* Live Search Widgets Header & Switcher (Expedia Live-Suche + CHECK24 Live-Suche) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 mb-4 border-b border-slate-100">
          <div>
            <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
              <span>
                100 % echte Live-Tagespreise direkt von Expedia.de & CHECK24 (keine Schätzpreise)
              </span>
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">
              Offizielle Live-Buchungsmaske: Echtzeit-Preise direkt prüfen & buchen
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
              <button
                type="button"
                onClick={() => setActiveLiveSearchTab('expedia')}
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeLiveSearchTab === 'expedia'
                    ? 'bg-amber-500 text-slate-950 shadow-2xs'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                <Search className="w-3.5 h-3.5" />
                <span>Expedia Live-Suche (Hotels & Flüge)</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveLiveSearchTab('check24')}
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeLiveSearchTab === 'check24'
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                <Search className="w-3.5 h-3.5" />
                <span>CHECK24 Pauschalreise-Maske</span>
              </button>
            </div>
          </div>
        </div>

        {/* Active Official Live Search Widget */}
        {activeLiveSearchTab === 'expedia' ? (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 bg-amber-50/70 border border-amber-200/80 rounded-xl px-4 py-2.5 text-xs">
              <span className="text-slate-800 font-medium">
                Geben Sie Ihr Wunschziel direkt in die offizielle <strong>Expedia.de Live-Maske</strong> ein oder öffnen Sie mit 1 Klick die vorausgefüllte Suche{cleanCity ? ` für „${cleanCity}“` : ''}:
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <a
                  href={finalExpediaUrl}
                  target="_blank"
                  rel="sponsored noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg transition-colors whitespace-nowrap"
                >
                  <span>
                    {cleanCity
                      ? `Live-Hotels in ${cleanCity} auf Expedia.de öffnen`
                      : 'Expedia.de Hotels öffnen'}
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                </a>
                {expediaFlightDirectUrl && (
                  <a
                    href={expediaFlightDirectUrl}
                    target="_blank"
                    rel="sponsored noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg transition-colors whitespace-nowrap"
                  >
                    <span>
                      {cleanCity
                        ? `Live-Flüge nach ${cleanCity} auf Expedia.de`
                        : 'Expedia.de Flüge öffnen'}
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                  </a>
                )}
              </div>
            </div>

            <div
              ref={expediaWidgetRef}
              className="w-full min-h-[200px] rounded-xl overflow-hidden bg-slate-50 border border-slate-200/80 p-3"
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 bg-blue-50/70 border border-blue-200/80 rounded-xl px-4 py-2.5 text-xs">
              <span className="text-slate-800 font-medium">
                Offizielles <strong>CHECK24 Pauschalreise-Widget</strong> (Partner-ID {cleanPartnerId}) – vergleicht TUI, DERTOUR, Alltours & über 50 Veranstalter in Echtzeit:
              </span>
              <a
                href={fallbackDirectUrl}
                target="_blank"
                rel="sponsored noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-colors whitespace-nowrap"
              >
                <span>
                  {cleanCity
                    ? `${cleanCity}-Pauschalreisen direkt bei CHECK24 öffnen`
                    : 'CHECK24 im Vollbild öffnen'}
                </span>
                <ExternalLink className="w-3.5 h-3.5 shrink-0" />
              </a>
            </div>

            <div
              ref={widgetContainerRef}
              className="w-full min-h-[140px] rounded-xl overflow-hidden"
            />
          </div>
        )}
      </div>

      {/* Official Partner Banners: Expedia, DiscoverCars, ASI Reisen, camping.info, TUI Camper & CamperDays */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
        {/* 1. Official Expedia Partnerize Banner (creativeref: 1101l87346 / camref: 1100l6tjov) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div>
              <span className="text-[11px] font-medium text-slate-500 block">
                Offizieller Partner · Expedia.de (ID {cleanExpediaCamref})
              </span>
              <h3 className="text-sm font-bold text-slate-900">
                Expedia Live-Tagespreise: Hotels, Flüge & Pakete
              </h3>
            </div>
            <a
              href={finalExpediaUrl}
              target="_blank"
              rel="sponsored noopener noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-semibold rounded-lg transition-colors shrink-0"
            >
              <span>Zu Expedia</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <a
            href={finalExpediaUrl}
            target="_blank"
            rel="sponsored noopener noreferrer"
            className="block rounded-xl overflow-hidden border border-slate-100 bg-slate-950 hover:opacity-95 transition-opacity text-center"
          >
            <img
              src="https://prf.hn/ad/camref:1100l6tjov/creativeref:1101l87346"
              alt="Expedia.de – Hotels, Flüge und Komplettreisen zu Live-Preisen"
              width={728}
              height={90}
              className="w-full h-auto max-h-[90px] object-contain mx-auto"
              loading="lazy"
            />
          </a>
        </div>

        {/* 2. Official DiscoverCars Affiliate Banner (a_aid=CleverEntdeckt&a_bid=61a4ac81) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div>
              <span className="text-[11px] font-medium text-slate-500 block">
                Offizieller Mietwagen-Partner · DiscoverCars.com
              </span>
              <h3 className="text-sm font-bold text-slate-900">
                Mietwagen-Preisvergleich ab Zielflughafen
              </h3>
            </div>
            <a
              href={discoverCarsDirectUrl}
              target="_blank"
              rel="sponsored noopener noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition-colors shrink-0"
            >
              <span>Mietwagen prüfen</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <a
            href={discoverCarsDirectUrl}
            target="_blank"
            rel="sponsored noopener noreferrer"
            className="block rounded-xl overflow-hidden border border-slate-100 bg-slate-900 hover:opacity-95 transition-opacity text-center"
          >
            <img
              src="https://discovercars.postaffiliatepro.com/accounts/default1/banners/61a4ac81.jpg"
              alt="DiscoverCars.com – Mietwagen weltweit vergleichen und sparen"
              width={300}
              height={100}
              className="w-full h-[84px] object-contain mx-auto"
              loading="lazy"
            />
            <img
              src="https://discovercars.postaffiliatepro.com/scripts/imp.php?a_aid=CleverEntdeckt&a_bid=61a4ac81"
              width={1}
              height={1}
              alt=""
              className="hidden"
            />
          </a>
        </div>

        {/* 3. Official Camping, Wohnmobil & Wanderreisen Partner Card (camping.info, ASI Reisen, TUI Camper & CamperDays) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs flex flex-col justify-between md:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div>
              <span className="text-[11px] font-medium text-emerald-700 block">
                Camping, Natur & Aktivreisen · Offizielle Partner
              </span>
              <h3 className="text-sm font-bold text-slate-900">
                Campingplätze, Wohnmobile & Wanderreisen
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <a
              href={campingInfoDirectUrl}
              target="_blank"
              rel="sponsored noopener noreferrer"
              className="p-2.5 rounded-xl bg-emerald-950 hover:bg-emerald-900 text-white transition-colors flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-mono text-emerald-300 font-semibold block">
                  23.000+ Plätze Europa
                </span>
                <strong className="text-xs font-bold block mt-0.5">camping.info</strong>
              </div>
              <span className="text-[11px] text-emerald-300 font-semibold inline-flex items-center gap-1 mt-1.5">
                <span>Campingplätze</span>
                <ExternalLink className="w-3 h-3 shrink-0" />
              </span>
            </a>

            <a
              href={asiReisenDirectUrl}
              target="_blank"
              rel="sponsored noopener noreferrer"
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white transition-colors flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-mono text-amber-400 font-semibold block">
                  Wandern & Trekking
                </span>
                <strong className="text-xs font-bold block mt-0.5">ASI Reisen</strong>
              </div>
              <span className="text-[11px] text-amber-300 font-semibold inline-flex items-center gap-1 mt-1.5">
                <span>Aktiv- & Naturreisen</span>
                <ExternalLink className="w-3 h-3 shrink-0" />
              </span>
            </a>

            <a
              href={tuiCamperDirectUrl}
              target="_blank"
              rel="sponsored noopener noreferrer"
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white transition-colors flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-mono text-emerald-400 font-semibold block">
                  TUI Qualitäts-Garantie
                </span>
                <strong className="text-xs font-bold block mt-0.5">TUI Camper</strong>
              </div>
              <span className="text-[11px] text-emerald-400 font-semibold inline-flex items-center gap-1 mt-1.5">
                <span>Camper finden</span>
                <ExternalLink className="w-3 h-3 shrink-0" />
              </span>
            </a>

            <a
              href={camperDaysDirectUrl}
              target="_blank"
              rel="sponsored noopener noreferrer"
              className="p-2.5 rounded-xl bg-blue-950 hover:bg-blue-900 text-white transition-colors flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-mono text-blue-300 font-semibold block">
                  Testsieger-Vergleich
                </span>
                <strong className="text-xs font-bold block mt-0.5">CamperDays</strong>
              </div>
              <span className="text-[11px] text-blue-300 font-semibold inline-flex items-center gap-1 mt-1.5">
                <span>Wohnmobile</span>
                <ExternalLink className="w-3 h-3 shrink-0" />
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
