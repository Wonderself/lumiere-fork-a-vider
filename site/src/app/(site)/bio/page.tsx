import Image from "next/image";
import { defaultBio, defaultSettings } from "@/lib/defaults";

export default function BioPage() {
  const sections = [...defaultBio].sort((a, b) => a.order - b.order);
  const settings = defaultSettings;

  return (
    <div className="pt-8 pb-20">
      {/* Header */}
      <section className="py-16 bg-cream">
        <div className="max-w-6xl mx-auto px-4 text-center">
          {settings.logoUrl && (
            <div className="relative w-32 h-32 mx-auto mb-6">
              <Image
                src={settings.logoUrl}
                alt={settings.siteName}
                fill
                className="object-contain"
              />
            </div>
          )}
          <h1 className="text-4xl md:text-5xl font-light text-primary-dark mb-4">
            Minha História
          </h1>
          <p className="text-foreground/60 max-w-2xl mx-auto">
            Conheça a jornada por trás da {settings.siteName} — {settings.tagline}
          </p>
        </div>
      </section>

      {/* Bio Sections */}
      {sections.map((section, i) => (
        <section
          key={section.id}
          className={`py-16 ${i % 2 === 0 ? "bg-background" : "bg-sage-light/20"}`}
        >
          <div className="max-w-6xl mx-auto px-4">
            <div
              className={`grid md:grid-cols-2 gap-12 items-center ${
                i % 2 !== 0 ? "md:flex-row-reverse" : ""
              }`}
            >
              <div className={i % 2 !== 0 ? "md:order-2" : ""}>
                <h2 className="text-2xl md:text-3xl font-light text-primary-dark mb-6">
                  {section.title}
                </h2>
                <div className="space-y-4">
                  {section.content.split("\n").map((paragraph, j) => (
                    <p
                      key={j}
                      className="text-foreground/70 leading-relaxed"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
              {section.image ? (
                <div
                  className={`relative h-80 rounded-2xl overflow-hidden shadow-xl ${
                    i % 2 !== 0 ? "md:order-1" : ""
                  }`}
                >
                  <Image
                    src={section.image}
                    alt={section.title}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div
                  className={`hidden md:block ${i % 2 !== 0 ? "md:order-1" : ""}`}
                />
              )}
            </div>
          </div>
        </section>
      ))}

      {/* Quote */}
      <section className="py-20 bg-primary-dark text-cream">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-3xl md:text-4xl font-light italic mb-4">
            &quot;{settings.slogan}&quot;
          </p>
          <p className="text-cream/60">— {settings.siteName}</p>
        </div>
      </section>

      {/* Pilares */}
      <section className="py-16 bg-background">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-light text-primary-dark text-center mb-8">
            Nossos Pilares
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: "🌿", title: "Saudável" },
              { icon: "🍃", title: "Baixo Carboidrato" },
              { icon: "🌱", title: "Vegetariana" },
              { icon: "✨", title: "Funcional" },
            ].map((p) => (
              <div key={p.title} className="text-center p-6 rounded-2xl bg-cream/50">
                <span className="text-3xl block mb-3">{p.icon}</span>
                <h3 className="font-medium text-primary-dark text-sm">{p.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Localizações */}
      <section className="py-16 bg-cream">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-light text-primary-dark mb-6">
            Por onde passamos
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              "Paraty - RJ",
              "Capelinha - MG",
              "Caraíva - BA",
              "Chapada dos Veadeiros - GO",
              "Florianópolis - SC",
              "Vila Velha - ES",
              "Trancoso - BA",
            ].map((loc) => (
              <span
                key={loc}
                className="px-5 py-2.5 bg-white rounded-full text-sm text-primary-dark border border-primary-light/30 shadow-sm"
              >
                {loc}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
