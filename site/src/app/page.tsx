import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Bon Anniversaire | Ser Levemente",
};

export default function BirthdayPage() {
  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Decorative top */}
      <div className="h-1 bg-gradient-to-r from-primary-light via-accent to-primary-light" />

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        {/* Birthday message */}
        <div className="text-center mb-16">
          <p className="text-sm tracking-[0.5em] uppercase text-primary/60 mb-4">
            Un cadeau pour toi
          </p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-light italic text-primary-dark mb-6 leading-tight">
            Bon Anniversaire
          </h1>
          <div className="w-24 h-px bg-accent mx-auto mb-6" />
          <p className="text-lg md:text-xl text-foreground/60 font-light max-w-md mx-auto leading-relaxed">
            Voici ton site web, en 3 versions.
            <br />
            <span className="text-primary-dark">Choisis celle que tu pr&eacute;f&egrave;res.</span>
          </p>
        </div>

        {/* 3 Choices */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-5xl w-full">
          {/* Version 1 - Elegant */}
          <Link
            href="/v1"
            className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
          >
            <div className="relative h-64 overflow-hidden">
              <Image
                src="/photos/ser.levemente_1745349010_3616572083368822439_6683801803_1.jpg"
                alt="Version Classique"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
            </div>
            <div className="p-6 text-center">
              <span className="text-xs tracking-[0.3em] uppercase text-primary/50 block mb-2">
                Version 1
              </span>
              <h2 className="text-xl font-light text-primary-dark mb-2">
                Classique
              </h2>
              <p className="text-sm text-foreground/50">
                &Eacute;l&eacute;gante et chaleureuse, tons cr&egrave;me
              </p>
            </div>
          </Link>

          {/* Version 2 - Nature */}
          <Link
            href="/v2"
            className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
          >
            <div className="relative h-64 overflow-hidden">
              <Image
                src="/photos/ser.levemente_1535555625_1856697615237570673_6683801803_4.jpg"
                alt="Version Nature"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
            </div>
            <div className="p-6 text-center">
              <span className="text-xs tracking-[0.3em] uppercase text-primary/50 block mb-2">
                Version 2
              </span>
              <h2 className="text-xl font-light text-primary-dark mb-2">
                Nature
              </h2>
              <p className="text-sm text-foreground/50">
                Organique et verte, esprit nature
              </p>
            </div>
          </Link>

          {/* Version 3 - Moderne */}
          <Link
            href="/v3"
            className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
          >
            <div className="relative h-64 overflow-hidden">
              <Image
                src="/photos/ser.levemente_1569699713_2143118985558736132_6683801803_7.jpg"
                alt="Version Moderne"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
            </div>
            <div className="p-6 text-center">
              <span className="text-xs tracking-[0.3em] uppercase text-primary/50 block mb-2">
                Version 3
              </span>
              <h2 className="text-xl font-light text-primary-dark mb-2">
                Moderne
              </h2>
              <p className="text-sm text-foreground/50">
                Audacieuse et contrast&eacute;e, style contemporain
              </p>
            </div>
          </Link>
        </div>

        {/* Signature */}
        <div className="mt-16 text-center">
          <p className="text-2xl italic text-primary-dark/40 font-light">
            &ldquo;Seja leve me leve&rdquo;
          </p>
        </div>
      </div>

      {/* Decorative bottom */}
      <div className="h-1 bg-gradient-to-r from-primary-light via-accent to-primary-light" />
    </div>
  );
}
