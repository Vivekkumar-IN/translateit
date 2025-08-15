import { useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "react-router-dom";

export const useBackButtonHandler = () => {
  const { toast } = useToast();
  const location = useLocation();
  const lastBackPressRef = useRef<number>(0);
  const DOUBLE_PRESS_DELAY = 2000; // 2 seconds

  // Only handle back button on main page
  useEffect(() => {
    // Only enable on root path
    if (location.pathname !== "/") {
      return;
    }

    const handlePopState = (event: PopStateEvent) => {
      event.preventDefault();

      const now = Date.now();
      const timeSinceLastPress = now - lastBackPressRef.current;

      if (timeSinceLastPress < DOUBLE_PRESS_DELAY) {
        // Double tap detected - quit the app
        window.close();
      } else {
        // First tap - show toast message
        lastBackPressRef.current = now;
        toast({
          title: "Tap again to quit",
          description:
            "Press back button again within 2 seconds to exit the application",
          duration: 2000,
        });
      }

      // Push state back to prevent navigation
      window.history.pushState(null, "", window.location.href);
    };

    // Push initial state to prevent immediate back navigation
    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [location.pathname, toast]);

  return {};
};
