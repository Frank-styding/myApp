import { useEffect, useState } from "react";
import NetInfo from "@react-native-community/netinfo";

export const useConnection = (onDisconnect?: () => void) => {
  const [hasConnection, setHasConnection] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((netState) => {
      const connected = !!netState.isConnected;
      if (connected != hasConnection) {
        setHasConnection(connected);
      }
      if (!connected && onDisconnect) {
        onDisconnect(); // 👈 dispara callback cuando no hay internet
      }
    });

    return () => unsubscribe();
  }, [onDisconnect]);

  return { hasConnection };
};
