import * as FileSystem from 'expo-file-system';

const FILE = `${FileSystem.documentDirectory}rides.json`;

export const loadRides = async () => {
  try {
    const info = await FileSystem.getInfoAsync(FILE);
    if (!info.exists) return [];
    const raw = await FileSystem.readAsStringAsync(FILE);
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

export const saveRides = async (rides) => FileSystem.writeAsStringAsync(FILE, JSON.stringify(rides));
