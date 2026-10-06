import Image from "next/image";
import { photos, type PhotoKey } from "@/content/photos";

function Caption({ name, wide = false }: { name: PhotoKey; wide?: boolean }) {
  const photo = photos[name];
  const [title, place, spec] = photo.caption;
  const content = (
    <>
      <span className="photo-code">{photo.code}</span>
      <span className="photo-title">{title}</span>
      <span>{place}</span>
      <span>{spec}</span>
    </>
  );
  return (
    <figcaption className="photo-caption">
      {wide ? <div className="container container-wide photo-caption-grid">{content}</div> : <div className="photo-caption-grid">{content}</div>}
    </figcaption>
  );
}

/** Edge-to-edge documentary photo with a technical caption under it. */
export function PhotoBand({ name, priority = false }: { name: PhotoKey; priority?: boolean }) {
  const photo = photos[name];
  return (
    <figure className="photo-band">
      <Image src={photo.image} alt={photo.alt} sizes="100vw" placeholder="blur" priority={priority} />
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
      <Image src={photo.image} alt={photo.alt} sizes={sizes} placeholder="blur" />
      <Caption name={name} />
    </figure>
  );
}
