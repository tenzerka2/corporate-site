"use client";
import { useEffect, useRef, useState } from "react";
import {
  autoUpdate,
  flip,
  FloatingPortal,
  offset,
  shift,
  useFloating,
} from "@floating-ui/react";
import { Warehouse, MapPin } from "lucide-react";
import { cities, type City } from "@/content/cities";
import { russiaOutline } from "@/content/russia-outline";
import { mapCopy as copy } from "@/content/logistics";
import { routeQuote, cityById, type CityId } from "@/lib/routes";
import { formatDays } from "@/lib/tariff";

const origin = cities[0];
const networkRoutes = cities.filter(
  (city) => city.warehouse && city.id !== origin.id,
);

function routePath(from: City, to: City) {
  const lift = Math.min(90, 30 + Math.hypot(to.x - from.x, to.y - from.y) / 6);
  return `M${from.x},${from.y} Q${(from.x + to.x) / 2},${Math.min(from.y, to.y) - lift} ${to.x},${to.y}`;
}

function CityCard({ city }: { city: City }) {
  const quote = city.id === origin.id ? null : routeQuote(origin.id, city.id);
  return (
    <>
      <strong>{city.name}</strong>
      <span className="map-card-term">
        {quote ? `${formatDays(quote.days)} ${copy.fromMoscow}` : copy.origin}
      </span>
      <span className="map-card-type">
        {city.warehouse ? (
          <Warehouse size={16} aria-hidden="true" />
        ) : (
          <MapPin size={16} aria-hidden="true" />
        )}
        {city.warehouse ? copy.warehouse : copy.partner}
      </span>
    </>
  );
}

export function RussiaMap({
  route,
  onCitySelect,
  network = true,
  current,
}: {
  route: { from: CityId; to: CityId } | null;
  onCitySelect?: (id: CityId) => void;
  /** Draw routes from Moscow to every warehouse. */
  network?: boolean;
  /** City where a tracked shipment is now. */
  current?: CityId;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [drawState, setDrawState] = useState<"static" | "pending" | "drawn">(
    "static",
  );
  const [hovered, setHovered] = useState<City | null>(null);
  const [anchor, setAnchor] = useState<Element | null>(null);
  const { refs, floatingStyles } = useFloating({
    open: hovered !== null,
    elements: { reference: anchor },
    placement: "top",
    strategy: "fixed",
    whileElementsMounted: autoUpdate,
    middleware: [offset(14), flip({ padding: 80 }), shift({ padding: 16 })],
  });

  const setFloating = refs.setFloating;
  // Routes are visible without JavaScript; the draw-in only runs once on screen.
  useEffect(() => {
    const element = svgRef.current;
    if (!element) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = requestAnimationFrame(() => setDrawState("pending"));
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        frame = requestAnimationFrame(() => setDrawState("drawn"));
      },
      { threshold: 0.3 },
    );
    observer.observe(element);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    if (!hovered) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setHovered(null);
    };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [hovered]);

  const show = (city: City, element: Element) => {
    setAnchor(element);
    setHovered(city);
  };
  const hide = () => setHovered(null);
  const from = route ? cityById(route.from) : null;
  const to = route ? cityById(route.to) : null;
  const ends = new Set([route?.from, route?.to]);

  return (
    <div className="geography-map">
      <svg
        ref={svgRef}
        viewBox="0 0 1200 650"
        role="group"
        aria-label={copy.label}
        data-draw={drawState}
      >
        <path d={russiaOutline} className="map-land" />
        {(network ? networkRoutes : []).map((city, index) => (
          <path
            key={city.id}
            d={routePath(origin, city)}
            className="map-route"
            pathLength={1}
            style={{ animationDelay: `${index * 180}ms` }}
          />
        ))}
        {from && to && from.id !== to.id && (
          <path
            key={`${from.id}-${to.id}`}
            d={routePath(from, to)}
            className="map-route map-route-active"
            pathLength={1}
          />
        )}
        {cities.map((city) => (
          <g
            key={city.id}
            role="button"
            tabIndex={0}
            aria-label={city.name}
            aria-pressed={ends.has(city.id)}
            className={`map-city ${ends.has(city.id) ? "is-active" : ""}`}
            onMouseEnter={(event) => show(city, event.currentTarget)}
            onMouseLeave={hide}
            onFocus={(event) => show(city, event.currentTarget)}
            onBlur={hide}
            onClick={() => onCitySelect?.(city.id)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onCitySelect?.(city.id);
              }
            }}
          >
            <circle cx={city.x} cy={city.y} r={14} className="map-hit" />
            {city.warehouse ? (
              <rect
                x={city.x - 5}
                y={city.y - 5}
                width={10}
                height={10}
                className="map-dot"
              />
            ) : (
              <circle cx={city.x} cy={city.y} r={4} className="map-dot" />
            )}
          </g>
        ))}
        {current && (
          <g className="map-current" aria-hidden="true">
            <circle cx={cityById(current).x} cy={cityById(current).y} r={16} className="map-current-ring" />
            <circle cx={cityById(current).x} cy={cityById(current).y} r={7} className="map-current-dot" />
          </g>
        )}
        {[from ?? origin, to]
          .filter((city): city is City => city !== null)
          .filter((city, index, list) => list.indexOf(city) === index)
          .map((city, index) => (
            <text
              key={city.id}
              x={index === 0 ? city.x - 12 : city.x + 12}
              y={city.y - 16}
              textAnchor={index === 0 ? "end" : "start"}
              className={`map-label ${index === 1 ? "map-active-label" : ""}`}
              aria-hidden="true"
            >
              {city.name}
            </text>
          ))}
      </svg>
      {hovered && (
        <FloatingPortal>
          <div
            ref={(node) => setFloating(node)}
            style={floatingStyles}
            className="map-card"
            role="tooltip"
          >
            <CityCard city={hovered} />
          </div>
        </FloatingPortal>
      )}
      <div className="map-legend">
        <span>
          <i className="legend-square" />
          {copy.legendWarehouse}
        </span>
        <span>
          <i className="legend-circle" />
          {copy.legendCity}
        </span>
        <span>
          <i className="legend-line" />
          {copy.legendRoute}
        </span>
      </div>
      <a
        className="map-source"
        href="https://www.naturalearthdata.com/"
        target="_blank"
        rel="noreferrer"
      >
        {copy.source}
      </a>
    </div>
  );
}
