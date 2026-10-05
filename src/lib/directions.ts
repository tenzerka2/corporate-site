import { directionsBlock } from "../content/logistics";
import { cityById, routeQuote, type CityId } from "./routes";

export type Direction = { from: CityId; to: CityId };

export const directions: Direction[] = directionsBlock.routes;

export function directionSlug({ from, to }: Direction) {
  return `${from}-${to}`;
}

export function findDirection(slug: string) {
  return directions.find((direction) => directionSlug(direction) === slug);
}

export function directionName({ from, to }: Direction) {
  return `${cityById(from).name} → ${cityById(to).name}`;
}

/** Directions sharing a city with this one, then the rest, up to four. */
export function nearbyDirections(current: Direction, limit = 4) {
  const others = directions.filter((d) => directionSlug(d) !== directionSlug(current));
  const shared = (d: Direction) =>
    [d.from, d.to].some((city) => city === current.from || city === current.to);
  return [...others.filter(shared), ...others.filter((d) => !shared(d))].slice(0, limit);
}

export function directionQuote(direction: Direction) {
  return routeQuote(direction.from, direction.to);
}
