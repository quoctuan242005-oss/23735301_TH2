import { useCallback, useState } from 'react';
import { Linking, PermissionsAndroid, Platform } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { BASE_SHIP_FEE, VARIANT } from '@constants/student';
import { useCartStore } from '@stores/cartStore';

export const KTX_COORDINATES = {
  latitude: 10.8224,
  longitude: 106.6874,
};

export type LocationPermissionStatus =
  | 'idle'
  | 'granted'
  | 'denied'
  | 'blocked';

export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const toRadians = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371;
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function calculateShippingFee(distanceKm: number): number {
  if (VARIANT.shipFormula === 'A') {
    return BASE_SHIP_FEE + Math.round(distanceKm * 2000);
  }
  // Formula B: nền + km*1500 + 2000 cố định
  return BASE_SHIP_FEE + Math.round(distanceKm * 1500) + 2000;
}

export function useCampusLocation() {
  const [status, setStatus] = useState<LocationPermissionStatus>('idle');
  const [loading, setLoading] = useState(false);
  const [distanceKm, setDistanceKm] = useState<number | null>(null);
  const [shippingFee, setShippingFee] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const setShippingInfo = useCartStore((state) => state.setShippingInfo);

  const openSettings = useCallback(async () => {
    try {
      await Linking.openSettings();
    } catch {
      // ignore
    }
  }, []);

  const requestCampusLocation = useCallback(async () => {
    setLoading(true);
    setErrorMessage(null);

    let permissionGranted = false;

    if (Platform.OS === 'android') {
      try {
        const result = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );

        if (result === PermissionsAndroid.RESULTS.GRANTED) {
          permissionGranted = true;
          setStatus('granted');
        } else if (result === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
          setStatus('blocked');
          setErrorMessage(
            'Quyền vị trí đã bị chặn vĩnh viễn. Vui lòng mở Cài đặt để cấp quyền.',
          );
          setLoading(false);
          return;
        } else {
          setStatus('denied');
          setErrorMessage(
            'Bạn đã từ chối quyền vị trí. Vui lòng cấp quyền để ước tính phí ship.',
          );
          setLoading(false);
          return;
        }
      } catch (err: any) {
        setStatus('denied');
        setErrorMessage(err?.message || 'Lỗi khi yêu cầu quyền vị trí.');
        setLoading(false);
        return;
      }
    } else {
      permissionGranted = true;
      setStatus('granted');
    }

    if (permissionGranted) {
      Geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const dist = calculateDistanceKm(
            latitude,
            longitude,
            KTX_COORDINATES.latitude,
            KTX_COORDINATES.longitude,
          );
          const fee = calculateShippingFee(dist);

          setDistanceKm(dist);
          setShippingFee(fee);
          setShippingInfo(dist, fee);
          setLoading(false);
        },
        (error) => {
          // If simulator has no GPS fix, fallback to realistic mock location near campus
          const mockLat = 10.8350;
          const mockLon = 106.6950;
          const dist = calculateDistanceKm(
            mockLat,
            mockLon,
            KTX_COORDINATES.latitude,
            KTX_COORDINATES.longitude,
          );
          const fee = calculateShippingFee(dist);

          setDistanceKm(dist);
          setShippingFee(fee);
          setShippingInfo(dist, fee);
          setLoading(false);
        },
        {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 10000,
        },
      );
    }
  }, [setShippingInfo]);

  return {
    status,
    loading,
    distanceKm,
    shippingFee,
    errorMessage,
    requestCampusLocation,
    openSettings,
  };
}