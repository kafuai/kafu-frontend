export function haversineMeters(
  lat1: number, lng1: number, lat2: number, lng2: number,
): number {
  const R = 6_371_000;
  const rad = (d: number) => (d * Math.PI) / 180;
  const dLat = rad(lat2 - lat1);
  const dLng = rad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

export type GeoDecision =
  | { ok: true; geoStatus: "not_required" | "verified" | "remote_allowed"; distance: number | null }
  | { ok: false; code: "location_unavailable" | "outside_geofence"; distance: number | null };

export function verifyGeo(
  location: {
    latitude: number | null; longitude: number | null;
    geofence_radius_m: number | null; geofence_required: boolean; remote_allowed: boolean;
  } | null,
  client: { latitude?: number; longitude?: number; accuracy?: number },
): GeoDecision {
  if (!location || !location.geofence_required) {
    return { ok: true, geoStatus: location?.remote_allowed ? "remote_allowed" : "not_required", distance: null };
  }
  const { latitude, longitude } = client;
  if (
    typeof latitude !== "number" || typeof longitude !== "number" ||
    !Number.isFinite(latitude) || !Number.isFinite(longitude) ||
    Math.abs(latitude) > 90 || Math.abs(longitude) > 180
  ) {
    return { ok: false, code: "location_unavailable", distance: null };
  }
  const distance = haversineMeters(
    latitude, longitude, location.latitude as number, location.longitude as number,
  );
  // هامش دقة محدود (حد أقصى 50م) كي لا يُستغل لتوسيع النطاق
  const tolerance = Math.min(Math.max(client.accuracy ?? 0, 0), 50);
  if (distance - tolerance > (location.geofence_radius_m as number)) {
    return { ok: false, code: "outside_geofence", distance: Math.round(distance) };
  }
  return { ok: true, geoStatus: "verified", distance: Math.round(distance) };
}