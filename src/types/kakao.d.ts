// 카카오 맵 SDK 전역 네임스페이스 최소 타입 선언
declare namespace kakao {
  namespace maps {
    class Map {
      setCenter(latlng: LatLng): void;
      getCenter(): LatLng;
      getLevel(): number;
      setLevel(level: number): void;
      setBounds(bounds: LatLngBounds): void;
    }

    class LatLng {
      constructor(lat: number, lng: number);
      getLat(): number;
      getLng(): number;
    }

    class LatLngBounds {
      constructor();
      extend(latlng: LatLng): void;
      isEmpty(): boolean;
    }

    namespace event {
      interface MouseEvent {
        latLng: LatLng;
      }
    }

    namespace services {
      enum Status {
        OK = "OK",
        ZERO_RESULT = "ZERO_RESULT",
        ERROR = "ERROR",
      }

      interface AddressResult {
        address_name: string;
        road_address_name?: string;
        x: string;
        y: string;
        road_address?: { address_name: string } | null;
        address?: { address_name: string } | null;
      }

      class Geocoder {
        addressSearch(
          address: string,
          callback: (result: AddressResult[], status: Status) => void
        ): void;
        coord2Address(
          lng: number,
          lat: number,
          callback: (result: AddressResult[], status: Status) => void
        ): void;
      }
    }
  }
}
