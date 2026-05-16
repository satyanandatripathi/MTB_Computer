export const metersToKm = (m = 0) => m / 1000;
export const mpsToKph = (mps = 0) => mps * 3.6;

export const caloriesEstimate = ({ durationSec = 0, avgKph = 0, weightKg = 75 }) => {
  const met = avgKph > 24 ? 12 : avgKph > 19 ? 10 : avgKph > 15 ? 8 : 6;
  return Number(((met * 3.5 * weightKg / 200) * (durationSec / 60)).toFixed(0));
};

export const climbSplit = (altitudeTrack = []) => {
  let up = 0;
  let down = 0;
  for (let i = 1; i < altitudeTrack.length; i += 1) {
    const delta = altitudeTrack[i] - altitudeTrack[i - 1];
    if (delta > 0) up += delta;
    else down += Math.abs(delta);
  }
  return { uphillMeters: Number(up.toFixed(1)), downhillMeters: Number(down.toFixed(1)) };
};
