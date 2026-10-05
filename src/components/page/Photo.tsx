import Image from "next/image";
import { photos, type PhotoKey } from "@/content/photos";

/** Full-bleed documentary photo with a technical caption. */
export function PhotoBand({ name, priority = false }: { name: PhotoKey; priority?: boolean }) {
  const photo = photos[name];
  return (
    <figure className="photo-band">
      <Image
        src={photo.image}
        alt={photo.alt}
        sizes="100vw"
        placeholder="blur"
        priority={priority}
      />
      <figcaption className="photo-caption">
        <div className="container container-wide">
          {photo.caption.map((part) => (
            <span key={part}>{part}</span>
          ))}
        </div>
      </figcaption>
    </figure>
  );
}

/** Photo inside the grid, keeps its own proportions. */
export function PhotoFigure({ name, sizes, className = "" }: { name: PhotoKey; sizes: string; className?: string }) {
  const photo = photos[name];
  return (
    <figure className={`photo-figure ${className}`}>
      <Image src={photo.image} alt={photo.alt} sizes={sizes} placeholder="blur" />
      <figcaption className="photo-caption">
        {photo.caption.map((part) => (
          <span key={part}>{part}</span>
        ))}
      </figcaption>
    </figure>
  );
}
