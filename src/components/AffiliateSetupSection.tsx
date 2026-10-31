import React, { useState } from 'react';
import {
  ExternalLink,
  Check,
  TrendingUp,
  Settings,
  ShieldCheck,
  Copy,
  Car,
  Smartphone,
  Scale,
  Plus,
  Trash2,
} from 'lucide-react';
import {
  AffiliatePartnerConfig,
  CustomAffiliatePartner,
  UserCurrencyCode,
  formatMoney,
  ProviderBookingLinks,
} from '../data/travelData';

interface AffiliateSetupSectionProps {
  affiliateConfig: AffiliatePartnerConfig;
  onSaveAffiliateConfig: (newConfig: AffiliatePartnerConfig) => void;
  userCurrency: UserCurrencyCode;
  sampleLinks: ProviderBookingLinks;
  activeDestinationCity: string;
}

export const AffiliateSetupSection: React.FC<AffiliateSetupSectionProps> = ({
  affiliateConfig,
  onSaveAffiliateConfig,
  userCurrency,
  sampleLinks,
  activeDestinationCity,
}) => {
  const [markerInput, setMarkerInput] = useState<string>(affiliateConfig.travelpayoutsMarker);
  const [bookingAidInput, setBookingAidInput] = useState<string>(affiliateConfig.bookingAid);
  const [awinIdInput, setAwinIdInput] = useState<string>(affiliateConfig.awinPublisherId);

  // Direct Affiliate URL inputs for users who already have partner links
  const [expediaUrlInput, setExpediaUrlInput] = useState<string>(
    affiliateConfig.customExpediaUrl || ''
  );
  const [discoverCarsUrlInput, setDiscoverCarsUrlInput] = useState<string>(
    affiliateConfig.customDiscoverCarsUrl || ''
  );
  const [check24UrlInput, setCheck24UrlInput] = useState<string>(
    affiliateConfig.customCheck24Url || ''
  );
  const [abInDenUrlaubUrlInput, setAbInDenUrlaubUrlInput] = useState<string>(
    affiliateConfig.customAbInDenUrlaubUrl || ''
  );
  const [tripComUrlInput, setTripComUrlInput] = useState<string>(
    affiliateConfig.customTripComUrl || ''
  );
  const [snowTrexUrlInput, setSnowTrexUrlInput] = useState<string>(
    affiliateConfig.customSnowTrexUrl || ''
  );
  const [bookingUrlInput, setBookingUrlInput] = useState<string>(
    affiliateConfig.customBookingUrl || ''
  );
  const [skyscannerUrlInput, setSkyscannerUrlInput] = useState<string>(
    affiliateConfig.customSkyscannerUrl || ''
  );
  const [extraPartnersInput, setExtraPartnersInput] = useState<CustomAffiliatePartner[]>(
    affiliateConfig.extraPartners || []
  );
  const [useExpediaForFlights, setUseExpediaForFlights] = useState<boolean>(
    affiliateConfig.useExpediaForFlightsIfNoSkyscanner ?? true
  );

  const [savedNotice, setSavedNotice] = useState<boolean>(false);
  const [copiedLinkKey, setCopiedLinkKey] = useState<string>('');
  const [embedTargetDestination, setEmbedTargetDestination] = useState<string>('');

  // Interactive Revenue Simulator State
  const [monthlyVisitors, setMonthlyVisitors] = useState<number>(3500);
  const [bookingConversionPct, setBookingConversionPct] = useState<number>(3.5);

  const isAnyIdActive = Boolean(
    affiliateConfig.travelpayoutsMarker.trim() ||
      affiliateConfig.bookingAid.trim() ||
      affiliateConfig.awinPublisherId.trim() ||
      affiliateConfig.customExpediaUrl?.trim() ||
      affiliateConfig.customDiscoverCarsUrl?.trim() ||
      affiliateConfig.customCheck24Url?.trim() ||
      affiliateConfig.customAbInDenUrlaubUrl?.trim() ||
      affiliateConfig.customTripComUrl?.trim() ||
      affiliateConfig.customSnowTrexUrl?.trim() ||
      affiliateConfig.customBookingUrl?.trim() ||
      affiliateConfig.customSkyscannerUrl?.trim() ||
      (affiliateConfig.extraPartners && affiliateConfig.extraPartners.some((p) => p.url.trim()))
  );

  // Calculate realistic monthly affiliate earnings
  const monthlyBookings = Math.round(monthlyVisitors * (bookingConversionPct / 100));
  const flightClickRevenueEur = Math.round(monthlyVisitors * 0.42 * 0.45); // 42% click flight search * 0.45€ CPC/CPA
  const hotelCommissionEur = Math.round(monthlyBookings * 0.65 * 29); // 65% book hotel * avg 29€ commission
  const extrasCommissionEur = Math.round(monthlyBookings * 0.25 * 34); // 25% book package/rental car/eSIM * 34€
  const totalMonthlyProfitEur =
    flightClickRevenueEur + hotelCommissionEur + extrasCommissionEur;

  const handleAddExtraPartner = () => {
    setExtraPartnersInput((prev) => [
      ...prev,
      {
        id: `partner-${Date.now()}`,
        name: '',
        url: '',
        category: 'package',
      },
    ]);
  };

  const handleUpdateExtraPartner = (
    id: string,
    field: keyof CustomAffiliatePartner,
    value: string
  ) => {
    setExtraPartnersInput((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleRemoveExtraPartner = (id: string) => {
    setExtraPartnersInput((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanedExtras = extraPartnersInput
      .map((p) => ({
        ...p,
        name: p.name.trim(),
        url: p.url.trim(),
      }))
      .filter((p) => p.name && p.url);
    setExtraPartnersInput(cleanedExtras);
    onSaveAffiliateConfig({
      travelpayoutsMarker: markerInput.trim(),
      bookingAid: bookingAidInput.trim(),
      awinPublisherId: awinIdInput.trim(),
      customExpediaUrl: expediaUrlInput.trim(),
      customDiscoverCarsUrl: discoverCarsUrlInput.trim(),
      customCheck24Url: check24UrlInput.trim(),
      customAbInDenUrlaubUrl: abInDenUrlaubUrlInput.trim(),
      customTripComUrl: tripComUrlInput.trim(),
      customSnowTrexUrl: snowTrexUrlInput.trim(),
      customBookingUrl: bookingUrlInput.trim(),
      customSkyscannerUrl: skyscannerUrlInput.trim(),
      extraPartners: cleanedExtras,
      useExpediaForFlightsIfNoSkyscanner: useExpediaForFlights,
    });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3500);
  };

  const handleActivateDemoId = () => {
    const demoConfig: AffiliatePartnerConfig = {
      travelpayoutsMarker: '584920',
      bookingAid: '2409182',
      awinPublisherId: '1149201',
      customExpediaUrl: 'https://www.expedia.de/?affcid=DE.DIRECT.PARTNER.584920',
      customDiscoverCarsUrl: 'https://www.discovercars.com/de?a_aid=partner_584920',
      customCheck24Url: 'https://urlaub.check24.de/?partnerid=c24_partner_584920',
      customAbInDenUrlaubUrl: abInDenUrlaubUrlInput.trim(),
      customTripComUrl: tripComUrlInput.trim(),
      customSnowTrexUrl: snowTrexUrlInput.trim(),
      customBookingUrl: bookingUrlInput.trim(),
      customSkyscannerUrl: skyscannerUrlInput.trim(),
      extraPartners: extraPartnersInput,
      useExpediaForFlightsIfNoSkyscanner: useExpediaForFlights,
    };
    setMarkerInput(demoConfig.travelpayoutsMarker);
    setBookingAidInput(demoConfig.bookingAid);
    setAwinIdInput(demoConfig.awinPublisherId);
    setExpediaUrlInput(demoConfig.customExpediaUrl || '');
    setDiscoverCarsUrlInput(demoConfig.customDiscoverCarsUrl || '');
    setCheck24UrlInput(demoConfig.customCheck24Url || '');
    onSaveAffiliateConfig(demoConfig);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3500);
  };

  const handleCopyUrl = (key: string, url: string) => {
    try {
      navigator.clipboard.writeText(url);
      setCopiedLinkKey(key);
      setTimeout(() => setCopiedLinkKey(''), 2500);
    } catch {
      // ignore clipboard errors
    }
  };

  const currentAppUrl =
    typeof window !== 'undefined'
      ? window.location.origin
      : 'https://ais-pre-kcnayrb45eutckxqz7vq7d-231109000256.europe-west3.run.app';

  return (
    <section id="monetarisierung" className="py-12 border-t border-slate-200 bg-white">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
          <div>
            <p className="text-xs font-medium text-slate-500">
              04. Schritt-für-Schritt zum profitablen Reiseportal <span aria-hidden="true">·</span>{' '}
              Eigene Affiliate-Links (Expedia, DiscoverCars, Check24) & Skyscanner-Anleitung
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mt-1 text-balance">
              Eigene Affiliate-Links direkt einfügen & an jeder Buchung mitverdienen
            </h2>
          </div>

          <div className="flex items-center gap-3 self-start">
            <span className="text-xs font-medium text-slate-600">
              Status Ihrer Buchungs-Links:
            </span>
            <span
              className={`text-xs font-mono font-bold tabular-nums ${
                isAnyIdActive ? 'text-emerald-700' : 'text-amber-700'
              }`}
            >
              {isAnyIdActive
                ? '✓ Eigene Affiliate-Links aktiv verknüpft'
                : 'Standard-Links (Noch keine eigenen Links hinterlegt)'}
            </span>
          </div>
        </div>

        {/* 3-Step Quickstart Guide */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col justify-between">
            <div>
              <div className="text-xs font-mono font-semibold text-emerald-700 tabular-nums">
                Option A · Vorhandene Links (Expedia, DiscoverCars, Check24)
              </div>
              <h3 className="text-base font-bold text-slate-900 mt-1">
                Ihre bestehenden Links unten 1:1 einfügen
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Kopieren Sie Ihre fertigen Affiliate-Links von <strong>Expedia, DiscoverCars und Check24</strong> einfach unten in die Felder. Die App verknüpft sie automatisch mit dem vom Nutzer gewählten Reiseziel & Datum!
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200/80">
              <button
                type="button"
                onClick={handleActivateDemoId}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 cursor-pointer"
              >
                Beispiel-Links für Expedia, DiscoverCars & Check24 testen →
              </button>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col justify-between">
            <div>
              <div className="text-xs font-mono font-semibold text-blue-600 tabular-nums">
                Option B · Warum Skyscanner nicht in Travelpayouts ist
              </div>
              <h3 className="text-base font-bold text-slate-900 mt-1">
                In Travelpayouts heißen die Flug-Partner „Aviasales“, „Kiwi.com“ & „Trip.com“
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                <strong>Skyscanner</strong> ist vor einiger Zeit zu einem eigenen Netzwerk (<strong>Impact.com</strong>) gewechselt. Bei <strong>Travelpayouts</strong> finden Sie stattdessen unter <em>Programs</em> direkt <strong>Aviasales</strong> (sofort ohne Prüfung voraktiviert!), <strong>Kiwi.com</strong> und <strong>Trip.com</strong>.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-2 text-xs">
              <a
                href="https://www.partners.skyscanner.net/affiliates"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-semibold"
              >
                <span>Skyscanner direkt (via Impact)</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <button
                type="button"
                onClick={() => handleCopyUrl('app-url', currentAppUrl)}
                className="inline-flex items-center gap-1 text-slate-700 hover:text-slate-900 font-semibold cursor-pointer"
              >
                <Copy className="w-3 h-3" />
                <span>
                  {copiedLinkKey === 'app-url' ? 'App-URL kopiert!' : 'App-URL kopieren'}
                </span>
              </button>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col justify-between">
            <div>
              <div className="text-xs font-mono font-semibold text-emerald-700 tabular-nums">
                Option C · Beste Lösung für Ihre Flug-Buttons
              </div>
              <h3 className="text-base font-bold text-slate-900 mt-1">
                Expedia-Flugsuche ODER Travelpayouts-Aviasales nutzen
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Sie brauchen Skyscanner gar nicht zwingend: Entweder rechnen Sie alle <strong>„Flug buchen“-Buttons</strong> direkt über Ihren <strong>vorhandenen Expedia-Link</strong> ab (Haken unten aktiv) – oder über Ihre <strong>Travelpayouts Marker-ID</strong> (leitet dann automatisch auf <strong>Aviasales</strong> weiter).
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center gap-4 text-xs">
              <a
                href="https://www.travelpayouts.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-semibold"
              >
                <span>Zu Travelpayouts (Aviasales / Kiwi / Trip.com)</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Main Configuration & Revenue Calculator Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left 7 Columns: Direct Affiliate Link Form & Live Link Verification */}
          <form
            onSubmit={handleSave}
            className="lg:col-span-7 bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-5"
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Settings className="w-4 h-4 text-blue-600" />
                  <span>1. Ihre vorhandenen Affiliate-Links direkt eintragen</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Fügen Sie hier einfach Ihre kompletten Partner-Links (Expedia, Check24, Ab in den Urlaub, Trip.com, SnowTrex, DiscoverCars & beliebig viele weitere) ein
                </p>
              </div>
            </div>

            {/* Direct URL Inputs for Expedia, DiscoverCars, Check24, Ab in den Urlaub, Trip.com, SnowTrex */}
            <div className="space-y-3.5">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label
                    htmlFor="custom-expedia-url"
                    className="text-xs font-semibold text-slate-800"
                  >
                    Ihr Expedia Affiliate-Link (Komplettreisen, Hotels & Flug-Überbrückung)
                  </label>
                  <span className="text-[11px] font-mono text-emerald-700 font-semibold">
                    ✓ Expedia Partnerize (camref: 1100l6tjov) fest hinterlegt & aktiv
                  </span>
                </div>
                <input
                  id="custom-expedia-url"
                  type="text"
                  placeholder="z.B. 1100l6tjov, https://prf.hn/click/camref:1100l6tjov oder Expedia Banner-Code"
                  value={expediaUrlInput}
                  onChange={(e) => setExpediaUrlInput(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label
                    htmlFor="custom-check24-url"
                    className="text-xs font-semibold text-slate-800"
                  >
                    Ihr Check24 Affiliate-Link (Pauschalreisen & Hotelvergleich)
                  </label>
                  <span className="text-[11px] font-mono text-emerald-700 font-semibold">
                    ✓ Check24 Partner-ID 1176801 fest hinterlegt & aktiv
                  </span>
                </div>
                <input
                  id="custom-check24-url"
                  type="text"
                  placeholder="z.B. 1176801 oder Check24 Widget-Code"
                  value={check24UrlInput}
                  onChange={(e) => setCheck24UrlInput(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label
                    htmlFor="custom-abindenurlaub-url"
                    className="text-xs font-semibold text-slate-800"
                  >
                    Ihr „Ab in den Urlaub“ Affiliate-Link (Pauschalreisen & Last Minute)
                  </label>
                  <span className="text-[11px] font-mono text-emerald-700 font-semibold">
                    ✓ Awin-Link (Publisher-ID 3034525) fest hinterlegt & aktiv
                  </span>
                </div>
                <input
                  id="custom-abindenurlaub-url"
                  type="text"
                  placeholder="z.B. https://www.awin1.com/cread.php?s=2307983&v=9369&q=339342&r=3034525"
                  value={abInDenUrlaubUrlInput}
                  onChange={(e) => setAbInDenUrlaubUrlInput(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label
                      htmlFor="custom-tripcom-url"
                      className="text-xs font-semibold text-slate-800"
                    >
                      Ihr Trip.com Affiliate-Link (Flüge & Hotels)
                    </label>
                    <span className="text-[11px] font-mono text-emerald-700 font-semibold">
                      ✓ Allianceid 10486295 aktiv
                    </span>
                  </div>
                  <input
                    id="custom-tripcom-url"
                    type="text"
                    placeholder="z.B. https://de.trip.com/?Allianceid=10486295&SID=330669011&locale=de_de oder <a href=...>"
                    value={tripComUrlInput}
                    onChange={(e) => setTripComUrlInput(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label
                      htmlFor="custom-snowtrex-url"
                      className="text-xs font-semibold text-slate-800"
                    >
                      Ihr ASI Reisen / Berg- & Winter-Link
                    </label>
                    <span className="text-[11px] font-mono text-emerald-700 font-semibold">
                      ✓ ASI Reisen (v=126961) aktiv
                    </span>
                  </div>
                  <input
                    id="custom-snowtrex-url"
                    type="text"
                    placeholder="z.B. https://www.awin1.com/cread.php?s=4805736&v=126961&q=607249&r=3034525"
                    value={snowTrexUrlInput}
                    onChange={(e) => setSnowTrexUrlInput(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label
                    htmlFor="custom-discovercars-url"
                    className="text-xs font-semibold text-slate-800"
                  >
                    Ihr DiscoverCars Affiliate-Link (Mietwagen ab Zielflughafen)
                  </label>
                  <span className="text-[11px] font-mono text-emerald-700 font-semibold">
                    ✓ DiscoverCars (a_aid: CleverEntdeckt / a_bid: 61a4ac81) fest hinterlegt & aktiv
                  </span>
                </div>
                <input
                  id="custom-discovercars-url"
                  type="text"
                  placeholder="z.B. https://www.discovercars.com/de?a_aid=CleverEntdeckt&a_bid=61a4ac81"
                  value={discoverCarsUrlInput}
                  onChange={(e) => setDiscoverCarsUrlInput(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label
                    htmlFor="custom-booking-url"
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    Optional: Eigener Booking.com Affiliate-Link
                  </label>
                  <input
                    id="custom-booking-url"
                    type="text"
                    placeholder="z.B. https://www.booking.com/index.html?aid=..."
                    value={bookingUrlInput}
                    onChange={(e) => setBookingUrlInput(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label
                    htmlFor="custom-skyscanner-url"
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    Optional: Weiterer Flug-Link (Aviasales, Kiwi, Skyscanner)
                  </label>
                  <input
                    id="custom-skyscanner-url"
                    type="text"
                    placeholder="z.B. Aviasales/Kiwi/Skyscanner Link"
                    value={skyscannerUrlInput}
                    onChange={(e) => setSkyscannerUrlInput(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              {/* Dynamic Extra Partners Section ("usw.") */}
              <div className="bg-white border border-slate-200 rounded-xl p-3.5 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <div className="text-xs font-bold text-slate-900">
                      Weitere eigene Affiliate-Partner hinzufügen (z. B. TUI, Lidl Reisen, Berge & Meer, HolidayCheck usw.)
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Sie können hier beliebig viele weitere Partner-Links eintragen – alle nehmen automatisch am Preisvergleich teil.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddExtraPartner}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Weiteren Partner hinzufügen</span>
                  </button>
                </div>

                {extraPartnersInput.length > 0 && (
                  <div className="space-y-2.5 pt-1">
                    {extraPartnersInput.map((partner, idx) => (
                      <div
                        key={partner.id || idx}
                        className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center bg-slate-50 border border-slate-200 rounded-lg p-2.5"
                      >
                        <div className="sm:col-span-3">
                          <input
                            type="text"
                            placeholder="Anbieter (z.B. TUI)"
                            value={partner.name}
                            onChange={(e) =>
                              handleUpdateExtraPartner(partner.id, 'name', e.target.value)
                            }
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-md text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                          />
                        </div>
                        <div className="sm:col-span-6">
                          <input
                            type="text"
                            placeholder="Affiliate-Link (https://...)"
                            value={partner.url}
                            onChange={(e) =>
                              handleUpdateExtraPartner(partner.id, 'url', e.target.value)
                            }
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-md text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <select
                            value={partner.category}
                            onChange={(e) =>
                              handleUpdateExtraPartner(
                                partner.id,
                                'category',
                                e.target.value as CustomAffiliatePartner['category']
                              )
                            }
                            className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded-md text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                          >
                            <option value="package">Pauschal</option>
                            <option value="flight">Flug</option>
                            <option value="hotel">Hotel</option>
                            <option value="winter">Winter/Ski</option>
                            <option value="extra">Extras</option>
                          </select>
                        </div>
                        <div className="sm:col-span-1 flex justify-end">
                          <button
                            type="button"
                            onClick={() => handleRemoveExtraPartner(partner.id)}
                            title="Partner entfernen"
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Automatic Flight Monetization Fallback via Expedia when Skyscanner link is not yet available */}
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3">
                <label className="flex items-start gap-2.5 text-xs text-slate-800 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={useExpediaForFlights}
                    onChange={(e) => setUseExpediaForFlights(e.target.checked)}
                    className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-600 w-4 h-4 shrink-0"
                  />
                  <div>
                    <strong className="font-semibold text-slate-900 block">
                      Flug-Buttons automatisch über Trip.com / Expedia abrechnen (Empfohlen):
                    </strong>
                    <span className="text-slate-600 mt-0.5 block">
                      Wenn Sie oben Ihren <strong>Trip.com</strong> oder <strong>Expedia</strong> Link eingetragen haben, laufen auch alle Flug-Buttons automatisch über Ihren Partner-Link.
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* Secondary: Global Network IDs */}
            <div className="pt-4 border-t border-slate-200/80">
              <div className="text-xs font-bold text-slate-800 mb-1">
                2. Optional: Übergeordnete Netzwerk-IDs (mit 100 % Link-Schutz für Ihre Direktlinks)
              </div>
              <p className="text-[11px] text-slate-600 mb-2.5">
                <strong>Garantie:</strong> Ihre oben eingetragenen Direkt-Links (Expedia, Check24, Ab in den Urlaub, Trip.com, SnowTrex, DiscoverCars) haben immer <strong>100 % Vorrang</strong> und werden niemals von der Travelpayouts Marker-ID überschrieben.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label
                    htmlFor="tp-marker-input"
                    className="block text-[11px] font-semibold text-slate-700 mb-1"
                  >
                    Travelpayouts Marker-ID
                  </label>
                  <input
                    id="tp-marker-input"
                    type="text"
                    placeholder="z.B. 584920"
                    value={markerInput}
                    onChange={(e) => setMarkerInput(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label
                    htmlFor="booking-aid-input"
                    className="block text-[11px] font-semibold text-slate-700 mb-1"
                  >
                    Booking.com Partner-AID
                  </label>
                  <input
                    id="booking-aid-input"
                    type="text"
                    placeholder="z.B. 2409182"
                    value={bookingAidInput}
                    onChange={(e) => setBookingAidInput(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label
                    htmlFor="awin-id-input"
                    className="block text-[11px] font-semibold text-slate-700 mb-1"
                  >
                    Awin Publisher-ID
                  </label>
                  <input
                    id="awin-id-input"
                    type="text"
                    placeholder="z.B. 1149201"
                    value={awinIdInput}
                    onChange={(e) => setAwinIdInput(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>
            </div>

            {/* Live Generated Affiliate URL Preview */}
            <div className="bg-white border border-slate-200 rounded-xl p-3.5 text-xs space-y-2.5">
              <div className="font-semibold text-slate-800">
                Live-Kontrolle Ihrer aktiven Ziel-Links (aktuelles Ziel: {activeDestinationCity.split(' ')[0]}):
              </div>

              {(
                [
                  {
                    key: 'bestdeal',
                    label: `1-Button Hauptlink auf den Reisekarten (${sampleLinks.bestDealProviderName})`,
                    url: sampleLinks.bestDealDirectUrl,
                  },
                  {
                    key: 'expedia',
                    label: 'Expedia Link (Pakete, Hotels & Flüge)',
                    url: sampleLinks.expediaPackageUrl,
                  },
                  {
                    key: 'check24',
                    label: 'CHECK24 Link (Pauschalreisen)',
                    url: sampleLinks.check24HolidayUrl,
                  },
                  {
                    key: 'abindenurlaub',
                    label: 'Ab in den Urlaub Link (Pauschal & Last Minute)',
                    url: sampleLinks.abInDenUrlaubUrl,
                  },
                  {
                    key: 'tripcom',
                    label: 'Trip.com Link (Flüge & Hotels)',
                    url: sampleLinks.tripComUrl,
                  },
                  {
                    key: 'snowtrex',
                    label: 'ASI Reisen Link (Rund-, Berg- & Aktivreisen)',
                    url: sampleLinks.snowTrexUrl,
                  },
                  {
                    key: 'klook',
                    label: 'Klook Link (Touren, Aktivitäten & Transfers)',
                    url: sampleLinks.klookActivitiesUrl,
                  },
                  {
                    key: 'discovercars',
                    label: 'DiscoverCars Link (Mietwagen)',
                    url: sampleLinks.rentalCarUrl,
                  },
                ] as const
              ).map((item) => (
                <div
                  key={item.key}
                  className="bg-slate-50 border border-slate-100 rounded-lg p-2 space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-700 text-[11px]">{item.label}:</span>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleCopyUrl(item.key, item.url)}
                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-semibold cursor-pointer text-[11px]"
                      >
                        <Copy className="w-3 h-3" />
                        <span>{copiedLinkKey === item.key ? 'Kopiert!' : 'Kopieren'}</span>
                      </button>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-900 font-semibold text-[11px]"
                      >
                        <span>Testen</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                  <div className="font-mono text-[11px] text-slate-600 break-all">{item.url}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Für Ihre Besucher entstehen durch Affiliate-Links 0,00 € Mehrkosten.</span>
              </div>

              <div className="flex items-center gap-3">
                {savedNotice && (
                  <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                    <Check className="w-4 h-4" />
                    <span>Affiliate-Links aktiviert!</span>
                  </span>
                )}
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                >
                  Eigene Affiliate-Links speichern & aktivieren
                </button>
              </div>
            </div>
          </form>

          {/* Right 5 Columns: Interactive Monthly Commission Calculator & High-Margin Extras */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900 text-white rounded-2xl p-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <div>
                  <span className="text-xs text-slate-400 block">Einnahmen-Simulator</span>
                  <h3 className="text-base font-bold text-white flex items-center gap-2 mt-0.5">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    <span>Ihr monatliches Provisions-Potenzial</span>
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 block">Geschätzter Gewinn / Monat</span>
                  <span className="text-2xl font-mono font-bold text-emerald-400 tabular-nums">
                    {formatMoney(totalMonthlyProfitEur, userCurrency)}
                  </span>
                </div>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-300">Monatliche App-Besucher:</span>
                    <strong className="font-mono text-white tabular-nums">
                      {monthlyVisitors.toLocaleString('de-DE')} Besucher
                    </strong>
                  </div>
                  <input
                    type="range"
                    min={500}
                    max={50000}
                    step={500}
                    value={monthlyVisitors}
                    onChange={(e) => setMonthlyVisitors(Number(e.target.value))}
                    className="w-full accent-emerald-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-300">Buchungsquote (Conversion-Rate):</span>
                    <strong className="font-mono text-white tabular-nums">
                      {bookingConversionPct.toFixed(1)} % ({monthlyBookings} Buchungen)
                    </strong>
                  </div>
                  <input
                    type="range"
                    min={1.0}
                    max={8.0}
                    step={0.5}
                    value={bookingConversionPct}
                    onChange={(e) => setBookingConversionPct(Number(e.target.value))}
                    className="w-full accent-emerald-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                  />
                </div>

                <div className="pt-3 border-t border-slate-800 space-y-1.5 text-slate-300">
                  <div className="flex justify-between">
                    <span>1. Flug-Buchungen (Trip.com & Expedia Flights)</span>
                    <span className="font-mono text-white tabular-nums">
                      +{formatMoney(flightClickRevenueEur, userCurrency)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>2. Pauschal & Hotels (CHECK24, Ab in den Urlaub, Expedia, ASI Reisen)</span>
                    <span className="font-mono text-white tabular-nums">
                      +{formatMoney(hotelCommissionEur, userCurrency)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>3. Mietwagen & Erlebnisse (DiscoverCars & Klook)</span>
                    <span className="font-mono text-white tabular-nums">
                      +{formatMoney(extrasCommissionEur, userCurrency)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* High-Margin Cross-Selling Preview (only user's real extra partners) */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <div className="text-xs font-bold text-slate-900 mb-2">
                Zusätzliche Hochprovisions-Partner (aktiv verknüpft für {activeDestinationCity.split(' ')[0]}):
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <a
                  href={sampleLinks.rentalCarUrl}
                  target="_blank"
                  rel="sponsored noopener noreferrer"
                  className="p-2.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg flex flex-col justify-between transition-colors"
                >
                  <div className="flex items-center justify-between text-slate-700 font-semibold">
                    <span className="flex items-center gap-1">
                      <Car className="w-3.5 h-3.5 text-blue-600" />
                      <span>DiscoverCars</span>
                    </span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </div>
                  <span className="text-[10px] text-emerald-700 font-mono mt-1 block">
                    ✓ a_aid: CleverEntdeckt
                  </span>
                </a>

                <a
                  href={sampleLinks.klookActivitiesUrl}
                  target="_blank"
                  rel="sponsored noopener noreferrer"
                  className="p-2.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg flex flex-col justify-between transition-colors"
                >
                  <div className="flex items-center justify-between text-slate-700 font-semibold">
                    <span className="flex items-center gap-1">
                      <Smartphone className="w-3.5 h-3.5 text-blue-600" />
                      <span>Klook Touren</span>
                    </span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </div>
                  <span className="text-[10px] text-emerald-700 font-mono mt-1 block">
                    ✓ Marker: 771810
                  </span>
                </a>

                <a
                  href={sampleLinks.snowTrexUrl}
                  target="_blank"
                  rel="sponsored noopener noreferrer"
                  className="p-2.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg flex flex-col justify-between transition-colors"
                >
                  <div className="flex items-center justify-between text-slate-700 font-semibold">
                    <span className="flex items-center gap-1">
                      <Scale className="w-3.5 h-3.5 text-blue-600" />
                      <span>ASI Reisen</span>
                    </span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </div>
                  <span className="text-[10px] text-emerald-700 font-mono mt-1 block">
                    ✓ Awin: 3034525
                  </span>
                </a>
              </div>
            </div>

            {/* 1-Click Homepage Embed Code Generator (with Country Pre-selection for Spain, Turkey, Italy reports) */}
            {(() => {
              const baseAppUrl =
                typeof window !== 'undefined' &&
                window.location.origin &&
                !window.location.origin.includes('run.app')
                  ? window.location.origin
                  : 'https://cleverentdeckt-reiseradar.netlify.app';
              const trimmedTarget = embedTargetDestination.trim();
              const fullEmbedUrl = trimmedTarget
                ? `${baseAppUrl}/?view=public&ziel=${encodeURIComponent(trimmedTarget)}`
                : `${baseAppUrl}/?view=public`;

              const iframeTitle = trimmedTarget
                ? `CleverEntdeckt – Günstige Reisen nach ${trimmedTarget}`
                : 'CleverEntdeckt, Sparflug & Reiseradar';

              const iframeCode = `<div style="width: 100%; max-width: 1400px; margin: 0 auto;">\n  <iframe\n    src="${fullEmbedUrl}"\n    width="100%"\n    height="1850"\n    style="border: none; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.08); width: 100%; display: block;"\n    loading="lazy"\n    allow="clipboard-write"\n    title="${iframeTitle}"\n  ></iframe>\n</div>`;

              return (
                <div className="bg-slate-900 text-white rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <span className="text-[11px] font-semibold text-emerald-400 block">
                        Fertiger Code für Ihre Homepage & Länderberichte (WordPress, HTML)
                      </span>
                      <h4 className="text-xs font-bold text-white">
                        {trimmedTarget
                          ? `Einbettungscode direkt für „${trimmedTarget}“ (ohne Neueingabe für Besucher)`
                          : 'Homepage-Einbettungscode (Alle Reiseziele)'}
                      </h4>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopyUrl('embed-iframe', iframeCode)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition-colors inline-flex items-center gap-1.5 cursor-pointer shrink-0"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>
                        {copiedLinkKey === 'embed-iframe' ? 'Code kopiert!' : 'HTML-Code kopieren'}
                      </span>
                    </button>
                  </div>

                  {/* Country / Article Page Selector */}
                  <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-2.5 space-y-2">
                    <span className="text-[11px] font-semibold text-slate-300 block">
                      Für welche Seite auf Ihrer Homepage möchten Sie den Code kopieren?
                    </span>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {[
                        { label: 'Hauptseite (Alle Ziele)', value: '' },
                        { label: 'Spanien-Bericht', value: 'Spanien' },
                        { label: 'Türkei-Bericht', value: 'Türkei' },
                        { label: 'Italien-Bericht', value: 'Italien' },
                      ].map((preset) => {
                        const isSelected =
                          embedTargetDestination.trim().toLowerCase() ===
                          preset.value.toLowerCase();
                        return (
                          <button
                            key={preset.label}
                            type="button"
                            onClick={() => setEmbedTargetDestination(preset.value)}
                            className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                              isSelected
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                            }`}
                          >
                            {preset.label}
                          </button>
                        );
                      })}
                      <input
                        type="text"
                        value={embedTargetDestination}
                        onChange={(e) => setEmbedTargetDestination(e.target.value)}
                        placeholder="Oder anderes Land/Ziel..."
                        aria-label="Anderes Land oder Reiseziel für Einbettungscode"
                        className="px-2.5 py-1 bg-slate-900 border border-slate-700 rounded text-[11px] text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 w-44"
                      />
                    </div>
                  </div>

                  {/* Option A: Simple Direct URL Link (for Buttons or Text Links in WordPress) */}
                  <div className="bg-slate-950 border border-slate-800 rounded-lg p-2.5 space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-semibold text-emerald-400">
                        Variante 1: Einfacher Direkt-Link (für Buttons oder Text-Links im Bericht)
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyUrl('direct-country-url', fullEmbedUrl)}
                        className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-semibold rounded transition-colors inline-flex items-center gap-1 cursor-pointer shrink-0"
                      >
                        <Copy className="w-3 h-3" />
                        <span>
                          {copiedLinkKey === 'direct-country-url'
                            ? 'Link kopiert!'
                            : 'Nur Link kopieren'}
                        </span>
                      </button>
                    </div>
                    <code className="block text-[11px] font-mono text-white break-all select-all">
                      {fullEmbedUrl}
                    </code>
                  </div>

                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    <strong>Variante 2 (HTML-Einbettung):</strong> Wenn Sie die komplette App direkt
                    sichtbar in Ihren Bericht einbetten möchten, kopieren Sie diesen Code:
                  </p>
                  <pre className="bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-[10px] font-mono text-emerald-300 overflow-x-auto whitespace-pre-wrap break-all">
                    {iframeCode}
                  </pre>
                </div>
              );
            })()}
          </div>
        </div>
      </div>
    </section>
  );
};
