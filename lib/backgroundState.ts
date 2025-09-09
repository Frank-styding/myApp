import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import uuid from "react-native-uuid";
export interface QueueItem {
  id: string;
  place: string;
  dni: string;
  name: string;
  time: string;
  state: string;
  reason: string;
  timestamp: number;
}

const REQUESTS_KEY = "background_requests";

async function addRequest(
  item: Omit<QueueItem, "id" | "timestamp">
): Promise<string> {
  try {
    const requests = await getRequests();
    const newItem: QueueItem = {
      ...item,
      id: uuid.v4(),
      timestamp: Date.now(),
    };

    requests.push(newItem);
    await AsyncStorage.setItem(REQUESTS_KEY, JSON.stringify(requests));
    return newItem.id;
  } catch (error) {
    console.error("Error adding request:", error);
    throw error;
  }
}
async function getRequests(): Promise<QueueItem[]> {
  try {
    const stored = await AsyncStorage.getItem(REQUESTS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error getting requests:", error);
    return [];
  }
}

async function deleteRequest(id: string): Promise<void> {
  try {
    const requests = await getRequests();
    const filtered = requests.filter((item) => item.id !== id);
    await AsyncStorage.setItem(REQUESTS_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error("Error deleting request:", error);
  }
}
async function hasPendingWork(batches: Map<string, any[]>): Promise<boolean> {
  try {
    const requests = await getRequests();
    return requests.length > 0 || batches.size > 0;
  } catch (error) {
    console.error("Error checking pending work:", error);
    return false;
  }
}
export const BackgroundState = {
  addRequest,
  getRequests,
  deleteRequest,
  hasPendingWork,
};
