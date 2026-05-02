import { getDailyPanchang } from 'panchang-ts';

try {
  const panchang = getDailyPanchang(
    new Date(), 
    { latitude: 28.6139, longitude: 77.2090, elevation: 216 }, 
    { timezone: 'Asia/Kolkata', computeEndTimes: false }
  );
  console.log(JSON.stringify(panchang, null, 2));
} catch (e) {
  console.error(e);
}
