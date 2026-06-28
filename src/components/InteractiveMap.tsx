import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Issue } from '../types';

interface InteractiveMapProps {
  latitude?: number;
  longitude?: number;
  onChangeLocation?: (lat: number, lng: number) => void;
  isDraggable?: boolean;
  issues?: Issue[];
  onSelectIssue?: (issueId: string) => void;
  height?: string;
  zoom?: number;
}

export default function InteractiveMap({
  latitude,
  longitude,
  onChangeLocation,
  isDraggable = false,
  issues,
  onSelectIssue,
  height = '350px',
  zoom = 13
}: InteractiveMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const issuesGroupRef = useRef<L.LayerGroup | null>(null);

  // Chandigarh center fallback
  const defaultLat = 30.7333;
  const defaultLng = 76.7794;

  const currentLat = latitude ?? defaultLat;
  const currentLng = longitude ?? defaultLng;

  // Colors based on priority
  const getColorForIssue = (issue: Issue) => {
    if (issue.status === 'completed') {
      return '#10B981'; // Green
    }
    if (issue.riskScore >= 8) {
      return '#EF4444'; // Red
    }
    if (issue.riskScore >= 4) {
      return '#F59E0B'; // Yellow
    }
    return '#3B82F6'; // Blue for Low
  };

  // Helper to create visual dot icons
  const createDotIcon = (color: string, isMain: boolean = false) => {
    const size = isMain ? 20 : 16;
    const borderSize = isMain ? '3px' : '2px';
    const pulseClass = isMain ? 'animate-pulse' : '';
    return L.divIcon({
      html: `<div class="${pulseClass}" style="background-color: ${color}; width: ${size}px; height: ${size}px; border-radius: 50%; border: ${borderSize} solid #ffffff; box-shadow: 0 0 10px rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center;"></div>`,
      className: 'custom-dot-icon',
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2]
    });
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Create Leaflet Map instance
    const map = L.map(mapContainerRef.current, {
      center: [currentLat, currentLng],
      zoom: zoom,
      scrollWheelZoom: true
    });

    // Dark Theme Leaflet Tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(map);

    mapRef.current = map;
    issuesGroupRef.current = L.layerGroup().addTo(map);

    // Map Click Listener for placing marker
    if (onChangeLocation) {
      map.on('click', (e: L.LeafletMouseEvent) => {
        onChangeLocation(e.latlng.lat, e.latlng.lng);
      });
    }

    // Force tile recalculation on load
    setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Sync main single marker with coordinates state
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Pan to position if valid coordinates are supplied
    if (latitude !== undefined && longitude !== undefined) {
      map.setView([latitude, longitude], map.getZoom());

      if (markerRef.current) {
        markerRef.current.setLatLng([latitude, longitude]);
      } else {
        const markerIcon = createDotIcon('#6366F1', true); // Purple main active reporter marker
        const marker = L.marker([latitude, longitude], {
          icon: markerIcon,
          draggable: isDraggable
        }).addTo(map);

        if (isDraggable && onChangeLocation) {
          marker.on('dragend', () => {
            const position = marker.getLatLng();
            onChangeLocation(position.lat, position.lng);
          });
        }

        markerRef.current = marker;
      }
    } else {
      // If lat/lng is cleared, remove primary marker
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
    }
  }, [latitude, longitude, isDraggable]);

  // Sync cluster of city issues on map
  useEffect(() => {
    const map = mapRef.current;
    const group = issuesGroupRef.current;
    if (!map || !group) return;

    group.clearLayers();

    if (issues && issues.length > 0) {
      issues.forEach((issue) => {
        if (issue.latitude === undefined || issue.longitude === undefined) return;

        const color = getColorForIssue(issue);
        const marker = L.marker([issue.latitude, issue.longitude], {
          icon: createDotIcon(color, false)
        });

        // Generate gorgeous HTML details popup
        const priorityLabel = issue.riskScore >= 8 ? 'High Priority' : issue.riskScore >= 4 ? 'Medium Priority' : 'Low Priority';
        const priorityColor = issue.riskScore >= 8 ? 'text-red-400 bg-red-500/10 border-red-500/20' : issue.riskScore >= 4 ? 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' : 'text-green-400 bg-green-500/10 border-green-500/20';

        const popupContent = document.createElement('div');
        popupContent.className = 'p-3 bg-[#09090B] text-slate-200 font-sans text-xs rounded-xl border border-white/10 max-w-[260px] shadow-2xl';
        popupContent.style.minWidth = '220px';
        
        popupContent.innerHTML = `
          <div class="mb-2.5 relative">
            <img src="${issue.image}" class="w-full h-24 object-cover rounded-lg border border-white/10" style="referrerpolicy: no-referrer" />
            <div class="absolute bottom-1 right-1 bg-black/85 text-[9px] px-1.5 py-0.5 rounded font-mono text-slate-400">
              Risk: ${issue.riskScore}/10
            </div>
          </div>
          <div class="font-bold text-white text-sm tracking-tight mb-1">${issue.category}</div>
          <div class="text-[10px] text-slate-400 mb-2 truncate">📍 ${issue.location}</div>
          <div class="grid grid-cols-2 gap-1.5 mb-3">
            <div class="bg-white/5 p-1 px-1.5 rounded border border-white/5 text-[9px]">
              <span class="text-slate-500 block">Department</span>
              <span class="text-slate-300 font-semibold truncate block">${issue.department}</span>
            </div>
            <div class="bg-white/5 p-1 px-1.5 rounded border border-white/5 text-[9px]">
              <span class="text-slate-500 block">Status</span>
              <span class="text-slate-300 font-semibold uppercase block">${issue.status}</span>
            </div>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-mono font-semibold px-2 py-0.5 rounded border ${priorityColor}">
              ${priorityLabel}
            </span>
            <button id="view-details-${issue.id}" class="bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] px-2.5 py-1 rounded font-semibold cursor-pointer active:scale-95 transition-all">
              View Details
            </button>
          </div>
        `;

        marker.bindPopup(popupContent, {
          maxWidth: 280,
          className: 'custom-leaflet-popup'
        });

        // Listen for popup open to bind button click handler
        marker.on('popupopen', () => {
          const btn = document.getElementById(`view-details-${issue.id}`);
          if (btn && onSelectIssue) {
            btn.onclick = (e) => {
              e.preventDefault();
              onSelectIssue(issue.id);
              map.closePopup();
            };
          }
        });

        group.addLayer(marker);
      });
    }
  }, [issues, onSelectIssue]);

  // Handle map resizing correctly
  useEffect(() => {
    if (!mapRef.current) return;
    const resizeObserver = new ResizeObserver(() => {
      if (mapRef.current) {
        mapRef.current.invalidateSize();
      }
    });
    if (mapContainerRef.current) {
      resizeObserver.observe(mapContainerRef.current);
    }
    return () => resizeObserver.disconnect();
  }, []);

  return (
    <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-inner bg-[#0B0F19]" style={{ height }}>
      <div ref={mapContainerRef} className="w-full h-full z-10" />
      
      {/* Decorative GPS search info label overlays */}
      <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 z-20 text-[10px] font-mono text-slate-400">
        {latitude !== undefined && longitude !== undefined ? (
          <span>📍 Lat: {latitude.toFixed(5)}, Lng: {longitude.toFixed(5)}</span>
        ) : (
          <span>Click Map or Drag to Select Location</span>
        )}
      </div>
    </div>
  );
}
