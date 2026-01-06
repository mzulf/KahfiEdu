import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    if (window.gtag) {
      window.gtag("config", "G-LY309NPYD0", {
        page_path: location.pathname,
      });
    }
  }, [location]);

  return null;
}

export default AnalyticsTracker;
