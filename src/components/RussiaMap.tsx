"use client";
import { useId, useState } from "react";
import { cities, type City } from "@/content/cities";
import { russiaOutline } from "@/content/russia-outline";
import { visualCopy as copy } from "@/content/visuals";
import { Select } from "@/components/ui/interactive";
const origin = cities[0];
const options = cities.map((city) => ({ value: city.id, label: city.name }));
function route(city: City) {
  return `M${origin.x},${origin.y} Q${(origin.x + city.x) / 2},${Math.min(origin.y, city.y) - 60} ${city.x},${city.y}`;
}
export function RussiaMap() {
  const id = useId();
  const [selected, setSelected] = useState<string>("ekaterinburg");
  const [hovered, setHovered] = useState<string | null>(null);
  const active = cities.find((city) => city.id === (hovered ?? selected)) ?? origin;
  return (
    <div className="geography-layout">
      <div className="geography-map">
        <svg viewBox="0 0 1200 650" role="group" aria-label={copy.mapLabel}>
          <path d={russiaOutline} className="map-land" />
          {cities.filter((city) => city.warehouse && city.id !== origin.id).map((city) => (
            <path key={city.id} d={route(city)} className="map-route" />
          ))}
          {active.id !== origin.id && <path d={route(active)} className="map-route map-route-active" />}
          {cities.map((city) => (
            <g key={city.id} role="button" tabIndex={0} aria-label={city.name} aria-pressed={selected === city.id}
              className={`map-city ${active.id === city.id ? "is-active" : ""}`}
              onMouseEnter={() => setHovered(city.id)} onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(city.id)} onBlur={() => setHovered(null)}
              onClick={() => { setSelected(city.id); setHovered(null); }}
              onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setSelected(city.id); setHovered(null); } }}>
              <circle cx={city.x} cy={city.y} r={13} className="map-hit" />
              {city.warehouse ? <rect x={city.x - 5} y={city.y - 5} width={10} height={10} className="map-dot" /> : <circle cx={city.x} cy={city.y} r={4} className="map-dot" />}
            </g>
          ))}
          <text x={origin.x - 12} y={origin.y - 18} textAnchor="end" className="map-label">{origin.name}</text>
          {active.id !== origin.id && <text x={active.x + 12} y={active.y - 16} className="map-label map-active-label">{active.name}</text>}
        </svg>
        <div className="map-legend"><span><i className="legend-square" />{copy.legendWarehouse}</span><span><i className="legend-circle" />{copy.legendCity}</span></div>
        <a className="map-source" href="https://www.naturalearthdata.com/" target="_blank" rel="noreferrer">{copy.source}</a>
      </div>
      <div className="geography-details">
        <Select id={`${id}-city`} label={copy.city} value={selected} options={options} onChange={(value) => { setSelected(value); setHovered(null); }} />
        <div className="route-detail" aria-live="polite" aria-atomic="true">
          <h3>{active.name}</h3><p className="route-time">{active.days}</p>
          {active.id !== origin.id && <p className="muted">{copy.from}</p>}
          <p>{active.warehouse ? copy.warehouse : copy.partner}</p>
        </div>
        <p className="caption muted">{copy.mapDemo}</p>
      </div>
    </div>
  );
}
