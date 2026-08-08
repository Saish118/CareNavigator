import React from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { HOSPITALS_DATA } from "../../data/hospitalsData";

export const PageHeader = () => {
  const location = useLocation();
  const params = useParams();

  const currentPath = location.pathname;

  // Do not render PageHeader on Landing Page (/), Login (/login), or Register (/register)
  if (currentPath === "/" || currentPath === "/home" || currentPath === "/login" || currentPath === "/register") {
    return null;
  }

  // Dynamic route resolution helper
  const getPageDetails = () => {
    // Hospital Detail Route (/hospital/:id)
    if (currentPath.startsWith("/hospital/")) {
      const hospital = HOSPITALS_DATA.find((h) => h.id === params.id) || HOSPITALS_DATA[0];
      return {
        title: hospital.name,
        description: "Live hospital resources, doctors, reviews and facilities.",
        breadcrumbs: [
          { label: "Home", path: "/" },
          { label: "Hospitals", path: "/hospitals" },
          { label: hospital.name, active: true },
        ],
      };
    }

    // Static Route Mappings
    switch (currentPath) {
      case "/dashboard":
      case "/user-dashboard":
        return {
          title: "User Dashboard",
          description: "Welcome back, Sai 👋 Manage your saved facilities and health telemetry.",
          breadcrumbs: [
            { label: "Home", path: "/" },
            { label: "Dashboard", active: true },
          ],
        };

      case "/hospitals":
      case "/recommendations":
      case "/hospital":
        return {
          title: "Hospital Discovery",
          description: "Discover hospitals with real-time bed telemetry, wait times, and specialized care.",
          breadcrumbs: [
            { label: "Home", path: "/" },
            { label: "Hospitals", active: true },
          ],
        };

      case "/map":
      case "/navigation":
      case "/emergency":
        return {
          title: "Emergency Services Directory",
          description: "Verified emergency hotlines, hospital ambulance fleets, and private emergency providers.",
          breadcrumbs: [
            { label: "Home", path: "/" },
            { label: "Emergency Services", active: true },
          ],
        };

      case "/triage":
      case "/symptom-checker":
      case "/symptoms":
        return {
          title: "Search by Symptoms",
          description: "Step-by-step clinical evaluation wizard generating immediate severity guidance.",
          breadcrumbs: [
            { label: "Home", path: "/" },
            { label: "Search by Symptoms", active: true },
          ],
        };

      case "/appointments":
        return {
          title: "View Details",
          description: "View saved healthcare details and active facility information.",
          breadcrumbs: [
            { label: "Dashboard", path: "/dashboard" },
            { label: "Details", active: true },
          ],
        };

      case "/favorites":
        return {
          title: "Saved Favorites",
          description: "Quick access to your bookmarked emergency trauma centers and preferred facilities.",
          breadcrumbs: [
            { label: "Dashboard", path: "/dashboard" },
            { label: "Saved Favorites", active: true },
          ],
        };

      case "/analytics":
        return {
          title: "Analytics",
          description: "View healthcare insights and statistics across regional hospital networks.",
          breadcrumbs: [
            { label: "Dashboard", path: "/dashboard" },
            { label: "Analytics", active: true },
          ],
        };

      case "/profile":
        return {
          title: "Profile",
          description: "Manage your healthcare profile, emergency contact identity, and blood passport.",
          breadcrumbs: [
            { label: "Dashboard", path: "/dashboard" },
            { label: "Profile", active: true },
          ],
        };

      case "/admin":
        return {
          title: "Admin Console",
          description: "Manage regional hospital telemetry, Emergency Services access, and ICU bed quotas.",
          breadcrumbs: [
            { label: "Dashboard", path: "/dashboard" },
            { label: "Admin Console", active: true },
          ],
        };

      case "/settings":
        return {
          title: "Settings",
          description: "Configure emergency SOS triggers, telemetry alerts, and personal preferences.",
          breadcrumbs: [
            { label: "Dashboard", path: "/dashboard" },
            { label: "Settings", active: true },
          ],
        };

      case "/notifications":
        return {
          title: "Notifications",
          description: "View real-time updates regarding telemetry changes and emergency alerts.",
          breadcrumbs: [
            { label: "Dashboard", path: "/dashboard" },
            { label: "Notifications", active: true },
          ],
        };

      case "/design-system":
        return {
          title: "Design System",
          description: "Interactive showcase of CareNavigator reusable component library.",
          breadcrumbs: [
            { label: "Home", path: "/" },
            { label: "Design System", active: true },
          ],
        };

      default:
        return {
          title: "CareNavigator",
          description: "Real-Time Hospital Resource Discovery & Navigation Platform.",
          breadcrumbs: [
            { label: "Home", path: "/" },
            { label: "Page", active: true },
          ],
        };
    }
  };

  const { title, description, breadcrumbs } = getPageDetails();

  return (
    <div className="bg-white border-b border-slate-200/80 py-6 px-4 sm:px-6 lg:px-8 shadow-xs">
      <div className="max-w-7xl mx-auto space-y-3">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-1.5 text-xs text-slate-500 font-medium overflow-x-auto py-0.5">
          {breadcrumbs.map((item, index) => {
            const isLast = index === breadcrumbs.length - 1 || item.active;

            return (
              <React.Fragment key={index}>
                {index > 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-350 shrink-0" />}

                {item.path && !isLast ? (
                  <Link
                    to={item.path}
                    className="hover:text-blue-600 transition-colors flex items-center gap-1 shrink-0 hover:underline"
                  >
                    {index === 0 && <Home className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
                    <span>{item.label}</span>
                  </Link>
                ) : (
                  <span
                    className={`shrink-0 flex items-center gap-1 font-bold ${
                      isLast ? "text-blue-600" : "text-slate-700"
                    }`}
                  >
                    {index === 0 && <Home className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                    <span>{item.label}</span>
                  </span>
                )}
              </React.Fragment>
            );
          })}
        </nav>

        {/* Page Title & Description */}
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
            {title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};
