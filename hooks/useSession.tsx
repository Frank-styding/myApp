import { useAppState } from "@/store/store";
import { useEffect } from "react";

export function useSession() {
  const {
    hasSession: hasSeccion,
    sessionStart,
    sessionDuration,
    endSession,
  } = useAppState();

  const isActive =
    hasSeccion && sessionStart && Date.now() - sessionStart < sessionDuration;

  useEffect(() => {
    if (hasSeccion && sessionStart && sessionDuration) {
      const timeout = setTimeout(() => {
        endSession();
      }, sessionStart + sessionDuration - Date.now());

      return () => clearTimeout(timeout);
    }
  }, [hasSeccion, sessionStart, sessionDuration, endSession]);

  return { isActive, endSession };
}
