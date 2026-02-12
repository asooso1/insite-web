"use client";

import {
  type ReactNode,
  useState,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import {
  Map,
  MapMarker,
  MarkerClusterer,
  CustomOverlayMap,
  useKakaoLoader,
  type MapProps as KakaoMapProps,
} from "react-kakao-maps-sdk";
import { cn } from "@/lib/utils";
import { Loader2, MapPin, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";

// ============================================================================
// Types
// ============================================================================

/**
 * 좌표 타입
 */
export interface LatLng {
  /** 위도 */
  lat: number;
  /** 경도 */
  lng: number;
}

/**
 * 마커 데이터 타입
 */
export interface MapMarkerData {
  /** 마커 ID */
  id: string;
  /** 위치 */
  position: LatLng;
  /** 마커 제목 (툴팁) */
  title?: string;
  /** 인포윈도우 콘텐츠 */
  content?: ReactNode;
  /** 마커 이미지 URL */
  image?: string;
  /** 마커 이미지 크기 */
  imageSize?: { width: number; height: number };
  /** 클릭 가능 여부 */
  clickable?: boolean;
  /** 추가 데이터 */
  data?: Record<string, unknown>;
}

/**
 * 카카오맵 Props
 */
export interface KakaoMapComponentProps {
  /** 지도 중심 좌표 */
  center: LatLng;
  /** 줌 레벨 (1~14, 작을수록 확대) */
  level?: number;
  /** 마커 목록 */
  markers?: MapMarkerData[];
  /** 클러스터링 사용 여부 */
  enableClustering?: boolean;
  /** 클러스터 최소 레벨 */
  clusterMinLevel?: number;
  /** 마커 클릭 핸들러 */
  onMarkerClick?: (marker: MapMarkerData) => void;
  /** 지도 클릭 핸들러 */
  onMapClick?: (position: LatLng) => void;
  /** 지도 이동 완료 핸들러 */
  onDragEnd?: (map: kakao.maps.Map) => void;
  /** 줌 변경 핸들러 */
  onZoomChanged?: (level: number) => void;
  /** 지도 컨트롤 표시 여부 */
  showControls?: boolean;
  /** 현재 위치 버튼 표시 여부 */
  showCurrentLocation?: boolean;
  /** 드래그 가능 여부 */
  draggable?: boolean;
  /** 줌 가능 여부 */
  zoomable?: boolean;
  /** 지도 높이 */
  height?: number | string;
  /** 클래스명 */
  className?: string;
}

// ============================================================================
// Constants
// ============================================================================

/** 서울시청 좌표 (기본 중심) */
const DEFAULT_CENTER: LatLng = {
  lat: 37.5665,
  lng: 126.978,
};

/** 기본 줌 레벨 */
const DEFAULT_LEVEL = 3;

// ============================================================================
// Loading Component
// ============================================================================

function MapLoading(): ReactNode {
  return (
    <div className="flex h-full w-full items-center justify-center bg-muted">
      <div className="flex flex-col items-center gap-2 text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="text-sm">지도를 불러오는 중...</span>
      </div>
    </div>
  );
}

// ============================================================================
// Error Component
// ============================================================================

function MapError({ message }: { message: string }): ReactNode {
  return (
    <div className="flex h-full w-full items-center justify-center bg-muted">
      <div className="flex flex-col items-center gap-2 text-destructive">
        <MapPin className="h-8 w-8" />
        <span className="text-sm">{message}</span>
      </div>
    </div>
  );
}

// ============================================================================
// Custom Overlay (InfoWindow)
// ============================================================================

interface InfoWindowProps {
  position: LatLng;
  content: ReactNode;
  onClose: () => void;
}

function InfoWindow({ position, content, onClose }: InfoWindowProps): ReactNode {
  return (
    <CustomOverlayMap position={position} yAnchor={1.4}>
      <div className="relative rounded-lg bg-background p-3 shadow-lg border min-w-[150px]">
        <button
          onClick={onClose}
          className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-background border shadow-sm text-muted-foreground hover:text-foreground"
        >
          ×
        </button>
        {content}
      </div>
    </CustomOverlayMap>
  );
}

// ============================================================================
// Main Component
// ============================================================================

/**
 * 카카오맵 컴포넌트
 *
 * react-kakao-maps-sdk 기반의 지도 컴포넌트입니다.
 *
 * @features
 * - 마커 표시 및 클러스터링
 * - 인포윈도우 (커스텀 오버레이)
 * - 현재 위치 버튼
 * - 드래그 및 줌 제어
 *
 * @note
 * 카카오 지도 API 키를 환경 변수에 설정해야 합니다:
 * NEXT_PUBLIC_KAKAO_MAP_API_KEY=your_api_key
 *
 * @example
 * ```tsx
 * const markers = [
 *   { id: "1", position: { lat: 37.5665, lng: 126.978 }, title: "서울시청" },
 *   { id: "2", position: { lat: 37.5512, lng: 126.9882 }, title: "명동" },
 * ];
 *
 * <KakaoMapComponent
 *   center={{ lat: 37.5665, lng: 126.978 }}
 *   markers={markers}
 *   onMarkerClick={(marker) => console.log(marker)}
 *   enableClustering
 *   showCurrentLocation
 *   height={400}
 * />
 * ```
 */
export function KakaoMapComponent({
  center = DEFAULT_CENTER,
  level = DEFAULT_LEVEL,
  markers = [],
  enableClustering = false,
  clusterMinLevel = 10,
  onMarkerClick,
  onMapClick,
  onDragEnd,
  onZoomChanged,
  showControls = true,
  showCurrentLocation = false,
  draggable = true,
  zoomable = true,
  height = 400,
  className,
}: KakaoMapComponentProps): ReactNode {
  const apiKey = process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY;

  // SDK 로드 상태
  const [loading, error] = useKakaoLoader({
    appkey: apiKey ?? "",
    libraries: ["clusterer", "services"],
  });

  // 지도 인스턴스
  const [map, setMap] = useState<kakao.maps.Map | null>(null);

  // 선택된 마커 (인포윈도우용)
  const [selectedMarker, setSelectedMarker] = useState<MapMarkerData | null>(null);

  // 현재 줌 레벨
  const [currentLevel, setCurrentLevel] = useState(level);

  // 마커 클릭 핸들러
  const handleMarkerClick = useCallback(
    (marker: MapMarkerData) => {
      if (marker.content) {
        setSelectedMarker(marker);
      }
      onMarkerClick?.(marker);
    },
    [onMarkerClick]
  );

  // 지도 클릭 핸들러
  const handleMapClick = useCallback(
    (_: kakao.maps.Map, mouseEvent: kakao.maps.event.MouseEvent) => {
      setSelectedMarker(null);
      const latlng = mouseEvent.latLng;
      onMapClick?.({
        lat: latlng.getLat(),
        lng: latlng.getLng(),
      });
    },
    [onMapClick]
  );

  // 줌 변경 핸들러
  const handleZoomChanged = useCallback(
    (map: kakao.maps.Map) => {
      const newLevel = map.getLevel();
      setCurrentLevel(newLevel);
      onZoomChanged?.(newLevel);
    },
    [onZoomChanged]
  );

  // 현재 위치로 이동
  const moveToCurrentLocation = useCallback(() => {
    if (!map || !navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        map.setCenter(new kakao.maps.LatLng(latitude, longitude));
        map.setLevel(3);
      },
      (error) => {
        console.error("현재 위치를 가져올 수 없습니다:", error);
      }
    );
  }, [map]);

  // 마커 렌더링
  const renderMarkers = useMemo(() => {
    return markers.map((marker) => (
      <MapMarker
        key={marker.id}
        position={marker.position}
        title={marker.title}
        clickable={marker.clickable !== false}
        onClick={() => handleMarkerClick(marker)}
        image={
          marker.image
            ? {
                src: marker.image,
                size: marker.imageSize ?? { width: 24, height: 35 },
              }
            : undefined
        }
      />
    ));
  }, [markers, handleMarkerClick]);

  // API 키 없음
  if (!apiKey) {
    return (
      <div
        className={cn("relative overflow-hidden rounded-lg border", className)}
        style={{ height }}
      >
        <MapError message="카카오 지도 API 키가 설정되지 않았습니다" />
      </div>
    );
  }

  // 로딩 중
  if (loading) {
    return (
      <div
        className={cn("relative overflow-hidden rounded-lg border", className)}
        style={{ height }}
      >
        <MapLoading />
      </div>
    );
  }

  // 에러
  if (error) {
    return (
      <div
        className={cn("relative overflow-hidden rounded-lg border", className)}
        style={{ height }}
      >
        <MapError message="지도를 불러오는 데 실패했습니다" />
      </div>
    );
  }

  return (
    <div
      className={cn("relative overflow-hidden rounded-lg border", className)}
      style={{ height }}
    >
      <Map
        center={center}
        level={level}
        style={{ width: "100%", height: "100%" }}
        draggable={draggable}
        zoomable={zoomable}
        onCreate={setMap}
        onClick={handleMapClick}
        onDragEnd={onDragEnd}
        onZoomChanged={handleZoomChanged}
      >
        {/* 지도 컨트롤 */}
        {showControls && (
          <>
            {/* 기본 컨트롤은 카카오맵 SDK에서 제공 */}
          </>
        )}

        {/* 마커 렌더링 */}
        {enableClustering ? (
          <MarkerClusterer
            averageCenter={true}
            minLevel={clusterMinLevel}
            styles={[
              {
                width: "40px",
                height: "40px",
                background: "hsl(var(--primary))",
                borderRadius: "50%",
                color: "hsl(var(--primary-foreground))",
                textAlign: "center",
                fontWeight: "bold",
                lineHeight: "40px",
                fontSize: "14px",
              },
            ]}
          >
            {renderMarkers}
          </MarkerClusterer>
        ) : (
          renderMarkers
        )}

        {/* 선택된 마커 인포윈도우 */}
        {selectedMarker?.content && (
          <InfoWindow
            position={selectedMarker.position}
            content={selectedMarker.content}
            onClose={() => setSelectedMarker(null)}
          />
        )}
      </Map>

      {/* 현재 위치 버튼 */}
      {showCurrentLocation && (
        <Button
          variant="outline"
          size="icon"
          className="absolute bottom-4 right-4 z-10 bg-background shadow-md"
          onClick={moveToCurrentLocation}
          title="현재 위치로 이동"
        >
          <Navigation className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}

// ============================================================================
// Hooks
// ============================================================================

/**
 * 마커 목록을 기반으로 지도 범위를 계산하는 훅
 */
export function useMapBounds(markers: MapMarkerData[]): {
  bounds: kakao.maps.LatLngBounds | null;
  center: LatLng;
} {
  const result = useMemo(() => {
    if (markers.length === 0) {
      return { bounds: null, center: DEFAULT_CENTER };
    }

    const firstMarker = markers[0];
    if (!firstMarker) {
      return { bounds: null, center: DEFAULT_CENTER };
    }

    if (typeof kakao === "undefined" || !kakao.maps) {
      return { bounds: null, center: firstMarker.position };
    }

    const bounds = new kakao.maps.LatLngBounds();
    let totalLat = 0;
    let totalLng = 0;

    markers.forEach((marker) => {
      bounds.extend(
        new kakao.maps.LatLng(marker.position.lat, marker.position.lng)
      );
      totalLat += marker.position.lat;
      totalLng += marker.position.lng;
    });

    return {
      bounds,
      center: {
        lat: totalLat / markers.length,
        lng: totalLng / markers.length,
      },
    };
  }, [markers]);

  return result;
}

/**
 * 주소를 좌표로 변환하는 훅
 */
export function useGeocode(): {
  geocode: (address: string) => Promise<LatLng | null>;
  reverseGeocode: (position: LatLng) => Promise<string | null>;
} {
  const geocode = useCallback(async (address: string): Promise<LatLng | null> => {
    if (typeof kakao === "undefined" || !kakao.maps?.services) {
      return null;
    }

    return new Promise((resolve) => {
      const geocoder = new kakao.maps.services.Geocoder();
      geocoder.addressSearch(address, (result, status) => {
        const firstResult = result[0];
        if (status === kakao.maps.services.Status.OK && firstResult) {
          resolve({
            lat: Number(firstResult.y),
            lng: Number(firstResult.x),
          });
        } else {
          resolve(null);
        }
      });
    });
  }, []);

  const reverseGeocode = useCallback(
    async (position: LatLng): Promise<string | null> => {
      if (typeof kakao === "undefined" || !kakao.maps?.services) {
        return null;
      }

      return new Promise((resolve) => {
        const geocoder = new kakao.maps.services.Geocoder();
        geocoder.coord2Address(position.lng, position.lat, (result, status) => {
          const firstResult = result[0];
          if (status === kakao.maps.services.Status.OK && firstResult) {
            const address = firstResult.road_address?.address_name ??
                           firstResult.address?.address_name ?? null;
            resolve(address);
          } else {
            resolve(null);
          }
        });
      });
    },
    []
  );

  return { geocode, reverseGeocode };
}

// ============================================================================
// Static Map Component
// ============================================================================

export interface StaticMapProps {
  /** 중심 좌표 */
  center: LatLng;
  /** 줌 레벨 */
  level?: number;
  /** 마커 표시 여부 */
  showMarker?: boolean;
  /** 너비 */
  width?: number | string;
  /** 높이 */
  height?: number | string;
  /** 클래스명 */
  className?: string;
}

/**
 * 정적 지도 컴포넌트
 *
 * 인터랙션이 없는 정적 지도 이미지입니다.
 *
 * @example
 * ```tsx
 * <StaticMap
 *   center={{ lat: 37.5665, lng: 126.978 }}
 *   level={3}
 *   showMarker
 *   width={300}
 *   height={200}
 * />
 * ```
 */
export function StaticMap({
  center,
  level = 3,
  showMarker = true,
  width = "100%",
  height = 200,
  className,
}: StaticMapProps): ReactNode {
  const apiKey = process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY;

  if (!apiKey) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-muted rounded-lg border",
          className
        )}
        style={{ width, height }}
      >
        <span className="text-sm text-muted-foreground">
          API 키가 설정되지 않았습니다
        </span>
      </div>
    );
  }

  // 정적 지도 API URL 생성
  const staticMapUrl = useMemo(() => {
    const params = new URLSearchParams({
      appkey: apiKey,
      lat: center.lat.toString(),
      lng: center.lng.toString(),
      level: level.toString(),
      width: typeof width === "number" ? width.toString() : "400",
      height: typeof height === "number" ? height.toString() : "200",
      ...(showMarker && {
        markers: `type:d|pos:${center.lng},${center.lat}`,
      }),
    });

    return `https://dapi.kakao.com/v2/maps/api/staticMap?${params.toString()}`;
  }, [apiKey, center, level, width, height, showMarker]);

  return (
    <div
      className={cn("overflow-hidden rounded-lg border", className)}
      style={{ width, height }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={staticMapUrl}
        alt="지도"
        className="h-full w-full object-cover"
        loading="lazy"
      />
    </div>
  );
}
