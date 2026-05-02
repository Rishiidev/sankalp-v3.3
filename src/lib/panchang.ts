import { getDailyPanchang } from 'panchang-ts';

export const DEFAULT_LOCATION = { latitude: 28.6139, longitude: 77.2090, elevation: 216 };

export async function fetchTodayPanchang(location = DEFAULT_LOCATION) {
  // Use Intl.DateTimeFormat().resolvedOptions().timeZone to get local timezone
  // Note: panchang-ts works well with standard IANA strings on the web.
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata';
  
  try {
    const panchang = getDailyPanchang(new Date(), location, {
      timezone: tz,
      computeEndTimes: false // Fast mode
    });
    return panchang;
  } catch (e) {
    console.error('Failed to compute panchang:', e);
    return null;
  }
}

export function determineCosmicTheme(panchang: any): string | null {
  if (!panchang) return null;
  
  const tithiName = panchang.tithi?.name?.toLowerCase() || '';
  const festivals = panchang.festivals || [];
  
  // 1. Check Festivals
  if (festivals.some((f: any) => f.name.toLowerCase().includes('shivratri'))) {
    return 'shivratri';
  }
  
  // 2. Check Tithi
  if (tithiName.includes('ekadashi')) {
    return 'ekadashi';
  }
  if (tithiName.includes('purnima')) {
    return 'purnima';
  }
  if (tithiName.includes('amavasya')) {
    return 'amavasya';
  }
  
  return null; // normal day
}
