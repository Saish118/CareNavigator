import React from "react";
import { useLocation, Link } from "react-router-dom";
import { ShieldCheck, Lock, Activity, Mail, Phone, MapPin, CheckCircle2, ChevronRight, Sparkles } from "lucide-react";

export const StaticInfoPage = () => {
  const { pathname } = useLocation();

  const getPageContent = () => {
    switch (pathname) {
      case "/about":
        return {
          title: "About CareNavigator",
          subtitle: "Real-Time Hospital Resource Discovery & Navigation Platform",
          icon: Activity,
          badge: "Platform Mission",
          sections: [
            {
              heading: "Our Mission",
              text: "CareNavigator was built to bridge the critical gap between patients seeking urgent medical attention and available hospital resources. By providing real-time telemetry on ICU bed capacity, ER wait times, oxygen availability, and paramedic fleets, CareNavigator empowers individuals to make informed emergency decisions.",
            },
            {
              heading: "Resource Discovery Engine",
              text: "Our intelligent discovery engine aggregates telemetry from partner hospital networks, regional emergency dispatch services (911 / 108), and private ambulance operators. We do not provide direct healthcare services or medical treatment; instead, we enable fast, transparent navigation to the right facility.",
            },
            {
              heading: "Key Platform Metrics",
              stats: [
                { label: "Partner Hospitals", val: "500+" },
                { label: "Live Bed Capacity", val: "10,000+" },
                { label: "Ambulances Listed", val: "300+" },
                { label: "Medical Specialties", val: "120+" },
              ],
            },
          ],
        };
      case "/privacy":
        return {
          title: "Privacy Policy",
          subtitle: "How CareNavigator Protects Your Health Search & Location Data",
          icon: Lock,
          badge: "Data Protection & Privacy",
          sections: [
            {
              heading: "Zero Health Record Storage",
              text: "CareNavigator operates strictly as a discovery and navigation platform. We do not store personal medical records, electronic health records (EHR), diagnostic history, or sensitive health conditions on our servers.",
            },
            {
              heading: "Symptom Search & Location Data",
              text: "When you search for hospitals by symptoms or use Google Maps navigation, location coordinates and search terms are processed in-memory solely to filter nearby facilities and estimate transit times. Location data is never sold, shared with third parties, or retained after your session.",
            },
            {
              heading: "Encrypted Communication",
              text: "All telemetry queries, direct helpline calls, and browser interactions are transmitted over 256-bit TLS/SSL encrypted channels to prevent intercept and guarantee user confidentiality.",
            },
          ],
        };
      case "/terms":
        return {
          title: "Terms of Service",
          subtitle: "Platform Guidelines & Emergency Service Terms",
          icon: ShieldCheck,
          badge: "Terms & Conditions",
          sections: [
            {
              heading: "Resource Telemetry Accuracy",
              text: "Bed availability, ER wait times, and paramedic response ETAs are updated dynamically by partner facilities and regional dispatch networks. While CareNavigator makes every effort to maintain real-time accuracy, capacity fluctuate rapidly during high-volume emergency periods.",
            },
            {
              heading: "Emergency Use Disclaimer",
              text: "CareNavigator is an informational discovery tool and does not substitute for national emergency dispatch. In life-threatening situations requiring immediate resuscitation or trauma response, always dial 911 / 108 immediately.",
            },
            {
              heading: "Acceptable Use",
              text: "Users may query facility availability, search symptoms for resource guidance, and navigate using Google Maps. Scraping, unauthorized API calls, or automated telemetry manipulation is strictly prohibited.",
            },
          ],
        };
      case "/contact":
      default:
        return {
          title: "Contact & Support",
          subtitle: "Get in touch with the CareNavigator Engineering & Operations Team",
          icon: Mail,
          badge: "Support & Inquiries",
          sections: [
            {
              heading: "General & Technical Inquiries",
              text: "Have feedback, bug reports, or feature suggestions for CareNavigator? Our support team is available 24/7 to assist hospital partners and platform users.",
            },
            {
              heading: "Hospital Integration Partnerships",
              text: "Are you a healthcare facility administrator looking to connect your hospital's live bed telemetry or emergency ambulance fleet to CareNavigator? Reach out to our partner operations desk.",
            },
            {
              heading: "Official Contact Channels",
              contactItems: [
                { icon: Mail, label: "Support Email", val: "support@carenavigator.org" },
                { icon: Phone, label: "Partner Desk", val: "+1 (800) 555-CARE" },
                { icon: MapPin, label: "Headquarters", val: "Metro Healthcare Tech Hub, Suite 400" },
              ],
            },
          ],
        };
    }
  };

  const content = getPageContent();
  const Icon = content.icon;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 text-blue-300 text-xs font-black rounded-full border border-blue-500/30">
          <Icon className="w-3.5 h-3.5" />
          <span>{content.badge}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight">{content.title}</h1>
        <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed max-w-xl">
          {content.subtitle}
        </p>
      </div>

      {/* Body Content Sections */}
      <div className="space-y-6">
        {content.sections.map((sec, idx) => (
          <div key={idx} className="bg-white rounded-3xl border border-slate-200/80 shadow-md p-6 sm:p-7 space-y-3">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" /> {sec.heading}
            </h2>

            {sec.text && <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">{sec.text}</p>}

            {sec.stats && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {sec.stats.map((s, i) => (
                  <div key={i} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                    <span className="text-xs text-slate-500 font-bold block">{s.label}</span>
                    <strong className="text-lg font-black text-blue-600">{s.val}</strong>
                  </div>
                ))}
              </div>
            )}

            {sec.contactItems && (
              <div className="space-y-2.5 pt-2">
                {sec.contactItems.map((c, i) => {
                  const CIcon = c.icon;
                  return (
                    <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs sm:text-sm">
                      <CIcon className="w-4 h-4 text-blue-600 shrink-0" />
                      <span className="text-slate-500 font-semibold">{c.label}:</span>
                      <strong className="text-slate-900 font-bold">{c.val}</strong>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Bottom Navigation Shortcut */}
      <div className="flex items-center justify-between pt-4">
        <Link
          to="/hospitals"
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-bold text-xs rounded-xl inline-flex items-center gap-2 transition-all shadow-md shadow-blue-600/20"
        >
          Explore Hospital Discovery <ChevronRight className="w-4 h-4" />
        </Link>

        <Link
          to="/"
          className="text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
        >
          ← Back to Homepage
        </Link>
      </div>
    </div>
  );
};
