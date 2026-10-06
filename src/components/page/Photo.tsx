import Image from "next/image";
import { photos, type PhotoKey } from "@/content/photos";

// Sources are already 1672 px WebP, 150–300 KB. Runtime resizing stalled under
// load on a small self-hosted server, so photos are served as they are.

function Caption({ name, wide = false }: { name: PhotoKey; wide?: boolean }) {
  const [title, place] = photos[name].caption;
  const text = `${title}, ${place}`;
  return (
    <figcaption className="photo-caption">
      {wide ? <div className="container container-wide">{text}</div> : text}
    </figcaption>
  );
}

/** Edge-to-edge documentary photo with a technical caption under it. */
export function PhotoBand({ name, priority = false }: { name: PhotoKey; priority?: boolean }) {
  const photo = photos[name];
  return (
    <figure className="photo-band">
      <Image src={photo.image} alt={photo.alt} sizes="100vw" placeholder="blur" unoptimized priority={priority} />
      <Caption name={name} wide />
    </figure>
  );
}

/** Photo placed on the grid, same caption system. */
export function PhotoFigure({
  name,
  sizes,
  className = "",
}: {
  name: PhotoKey;
  sizes: string;
  className?: string;
}) {
  const photo = photos[name];
  return (
    <figure className={`photo-figure ${className}`}>
      <Image src={photo.image} alt={photo.alt} sizes={sizes} placeholder="blur" unoptimized />
      <Caption name={name} />
    </figure>
  );
}
