import Image from "next/image";

interface Photo {
  src: string;
  alt: string;
}

export default function PhotoGrid({ photos }: { photos: Photo[] }) {
  return (
    <div className="columns-2 md:columns-3 gap-4 space-y-4">
      {photos.map((photo, i) => (
        <div
          key={i}
          className="break-inside-avoid rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow"
        >
          <Image
            src={photo.src}
            alt={photo.alt}
            width={600}
            height={600}
            className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500"
          />
        </div>
      ))}
    </div>
  );
}
