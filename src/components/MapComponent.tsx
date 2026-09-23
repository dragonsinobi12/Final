import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Spot, Bug } from '../types';
import { calculateDistanceM, formatDistance } from '../services/geo';
import { Compass, Sparkles } from 'lucide-react';

interface MapComponentProps {
  spots: Spot[];
  bugs: Bug[];
  discoveredBugIds: string[];
  userCoords: { lat: number; lng: number } | null;
  selectedSpotId: string | null;
  onSelectSpot: (spot: Spot) => void;
  onNavigateToSpot: (spot: Spot) => void;
  demoMode: boolean;
}

export const MapComponent: React.FC<MapComponentProps> = ({
  spots,
  bugs,
  discoveredBugIds,
  userCoords,
  selectedSpotId,
  onSelectSpot,
  onNavigateToSpot,
  demoMode
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const circlesRef = useRef<L.Circle[]>([]);
  const userMarkerRef = useRef<L.Marker | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const initialLat = userCoords ? userCoords.lat : 15.5;
      const initialLng = userCoords ? userCoords.lng : 100.5;
      const initialZoom = userCoords ? 13 : 6;

      const map = L.map(mapContainerRef.current, {
        center: [initialLat, initialLng],
        zoom: initialZoom,
        zoomControl: false
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Clean OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    return () => {
      // Keep map alive across small renders or cleanup on unmount
    };
  }, []);

  // Update User Marker
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (userCoords) {
      const userIcon = L.divIcon({
        className: 'custom-user-marker',
        html: `
          <div class="relative flex items-center justify-center">
            <span class="absolute w-8 h-8 rounded-full bg-emerald-500/30 animate-ping"></span>
            <span class="w-5 h-5 rounded-full bg-emerald-500 border-2 border-white shadow-md flex items-center justify-center text-white text-[10px] font-bold">
              •
            </span>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      if (userMarkerRef.current) {
        userMarkerRef.current.setLatLng([userCoords.lat, userCoords.lng]);
      } else {
        userMarkerRef.current = L.marker([userCoords.lat, userCoords.lng], {
          icon: userIcon,
          zIndexOffset: 1000
        })
          .addTo(map)
          .bindPopup('<b>ตำแหน่งของคุณ</b><br/>กำลังสำรวจพื้นที่');
      }
    }
  }, [userCoords]);

  // Update Spots Markers & Circles
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear old markers and circles
    markersRef.current.forEach((m) => m.remove());
    circlesRef.current.forEach((c) => c.remove());
    markersRef.current = [];
    circlesRef.current = [];

    spots.forEach((spot) => {
      const spotBugs = bugs.filter((b) => spot.bugIds.includes(b.id));
      const allCaught =
        spotBugs.length > 0 &&
        spotBugs.every((b) => discoveredBugIds.includes(b.id));

      const isSelected = spot.id === selectedSpotId;

      // Custom HTML Pin
      const iconHtml = `
        <div class="cursor-pointer transition-transform duration-200 transform ${
          isSelected ? 'scale-125 z-50' : 'hover:scale-110'
        }">
          <div class="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg border-2 ${
            allCaught
              ? 'bg-emerald-700 border-emerald-300 text-white'
              : 'bg-stone-900 border-amber-400 text-amber-300'
          }">
            <span class="text-base font-bold">${allCaught ? '✨' : '?'}</span>
          </div>
          <div class="w-2 h-2 bg-stone-900 rotate-45 mx-auto -mt-1 border-r border-b ${
            allCaught ? 'border-emerald-300' : 'border-amber-400'
          }"></div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'spot-pin',
        html: iconHtml,
        iconSize: [40, 48],
        iconAnchor: [20, 46],
        popupAnchor: [0, -44]
      });

      const marker = L.marker([spot.latitude, spot.longitude], {
        icon: customIcon
      }).addTo(map);

      // Radius Circle
      const circle = L.circle([spot.latitude, spot.longitude], {
        radius: spot.radiusM,
        color: allCaught ? '#10b981' : '#f59e0b',
        fillColor: allCaught ? '#10b981' : '#f59e0b',
        fillOpacity: isSelected ? 0.25 : 0.12,
        weight: isSelected ? 2 : 1.5,
        dashArray: allCaught ? undefined : '4, 4'
      }).addTo(map);

      // Distance calculation
      const dist = userCoords
        ? calculateDistanceM(userCoords.lat, userCoords.lng, spot.latitude, spot.longitude)
        : null;

      const popupContent = `
        <div class="p-1 font-['Prompt',sans-serif]">
          <div class="flex items-center gap-1.5 text-xs text-stone-500 font-semibold mb-0.5">
            <span>📍 ${spot.province}</span>
            <span>•</span>
            <span class="text-emerald-600 font-mono">${formatDistance(dist)}</span>
          </div>
          <h4 class="font-bold text-sm text-stone-900 leading-tight">${spot.nameTh}</h4>
          <p class="text-xs text-stone-600 mt-1 line-clamp-2">${spot.description}</p>
          <div class="mt-2.5 pt-2 border-t border-stone-200 flex items-center justify-between text-xs">
            <span class="text-[11px] text-stone-500">รัศมีสำรวจ ${spot.radiusM} ม.</span>
            <button id="popup-btn-${spot.id}" class="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition">
              ดูรายละเอียด
            </button>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);
      marker.on('click', () => {
        onSelectSpot(spot);
      });

      marker.on('popupopen', () => {
        const btn = document.getElementById(`popup-btn-${spot.id}`);
        if (btn) {
          btn.onclick = () => {
            onNavigateToSpot(spot);
          };
        }
      });

      markersRef.current.push(marker);
      circlesRef.current.push(circle);
    });
  }, [spots, bugs, discoveredBugIds, userCoords, selectedSpotId]);

  // Center on Selected Spot
  useEffect(() => {
    if (!selectedSpotId || !mapInstanceRef.current) return;
    const spot = spots.find((s) => s.id === selectedSpotId);
    if (spot) {
      mapInstanceRef.current.flyTo([spot.latitude, spot.longitude], 15, {
        duration: 1.2
      });
    }
  }, [selectedSpotId, spots]);

  const handleCenterUser = () => {
    if (userCoords && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([userCoords.lat, userCoords.lng], 15, {
        duration: 1.2
      });
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-210px)] min-h-[420px] rounded-2xl overflow-hidden border border-stone-800 shadow-xl">
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Top Banner (Demo Mode & Instructions) */}
      <div className="absolute top-3 left-3 right-3 z-[400] flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        <div className="bg-stone-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-stone-700/60 shadow-lg text-xs text-stone-200 pointer-events-auto flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>แตะหมุดเพื่อดูข้อมูลพื้นที่และระยะห่าง</span>
        </div>

        {demoMode && (
          <div className="bg-amber-500/95 backdrop-blur-md px-3 py-1 rounded-xl text-stone-950 font-bold text-xs shadow-lg pointer-events-auto flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>โหมดเดโม: แสดงจุดสำรวจรอบตัวคุณ</span>
          </div>
        )}
      </div>

      {/* Re-center GPS button */}
      <button
        onClick={handleCenterUser}
        className="absolute bottom-4 left-4 z-[400] bg-stone-900/95 hover:bg-stone-800 text-stone-200 hover:text-emerald-400 p-2.5 rounded-xl border border-stone-700/80 shadow-xl transition flex items-center gap-1.5 text-xs font-medium"
        title="จัดกึ่งกลางที่ตำแหน่งของฉัน"
      >
        <Compass className="w-4 h-4 text-emerald-400" />
        <span>ตำแหน่งฉัน</span>
      </button>

      {/* Map Legend */}
      <div className="absolute bottom-4 right-14 z-[400] bg-stone-900/90 backdrop-blur-md px-3 py-2 rounded-xl border border-stone-700/70 shadow-lg text-[11px] text-stone-300 hidden sm:flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-amber-400 border border-stone-950" />
          <span>ยังมีแมลงรอค้นพบ (?)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-emerald-500 border border-stone-950" />
          <span>จับครบแล้ว</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full border border-dashed border-amber-400" />
          <span>วงรัศมีสำรวจ</span>
        </div>
      </div>
    </div>
  );
};
