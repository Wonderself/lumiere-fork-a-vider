import Image from "next/image";
import Link from "next/link";

const categories = [
  {
    title: "Doces",
    description: "Brownies, cookies, brigadeiros",
    image: "/photos/ser.levemente_1745349010_3616572083368822439_6683801803_1.jpg",
    href: "/cardapio#doces",
  },
  {
    title: "Salgados",
    description: "Quibes, pães, quiches",
    image: "/photos/ser.levemente_1569699713_2143118985558736132_6683801803_7.jpg",
    href: "/cardapio#salgados",
  },
  {
    title: "Pratos",
    description: "Refeições nutritivas",
    image: "/photos/ser.levemente_1561128497_2071218418955904581_6683801803_1.jpg",
    href: "/cardapio#pratos",
  },
  {
    title: "Bolos",
    description: "Ocasiões especiais",
    image: "/photos/ser.levemente_1535555625_1856697615237570673_6683801803_4.jpg",
    href: "/cardapio#bolos",
  },
];

export default function HomeV3() {
  return (
    <>
      {/* Hero - Bold & Modern */}
      <section className="relative min-h-screen flex items-end pb-20 bg-primary-dark">
        <div className="absolute inset-0">
          <Image
            src="/photos/ser.levemente_1569699713_2143118985558736132_6683801803_7.jpg"
            alt="Ser Levemente"
            fill
            className="object-cover opacity-40"
            priority
          />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto px-4 w-full">
          <div className="max-w-3xl">
            <span className="text-xs tracking-[0.5em] uppercase text-accent block mb-6">
              Cozinha Consciente
            </span>
            <h1 className="text-7xl md:text-9xl font-light text-cream leading-none mb-4">
              Ser
            </h1>
            <h1 className="text-6xl md:text-8xl font-light italic text-cream/70 leading-none mb-8">
              Levemente
            </h1>
            <p className="text-cream/50 text-lg md:text-xl max-w-md mb-10 leading-relaxed">
              Comida saudável com afeto. Simplificar, trazer comida boa,
              saudável, descomplicada na versão gostosa.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/cardapio"
                className="bg-accent text-primary-dark px-10 py-4 text-sm tracking-widest uppercase hover:bg-accent/80 transition-colors"
              >
                Cardápio
              </Link>
              <Link
                href="/contato"
                className="border border-cream/30 text-cream px-10 py-4 text-sm tracking-widest uppercase hover:bg-cream/10 transition-colors"
              >
                Encomenda
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Values - Minimal row */}
      <section className="py-6 bg-primary-dark border-t border-cream/10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap justify-between">
            {["Saudável", "Low Carb", "Vegano", "Funcional"].map((v) => (
              <span key={v} className="text-xs tracking-[0.3em] uppercase text-cream/30 py-3">
                {v}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Categories - Grid with overlap */}
      <section className="py-24 bg-background">
        <div className="max-w-6xl mx-auto px-4">
          <div className="mb-16">
            <span className="text-xs tracking-[0.3em] uppercase text-primary/40 block mb-2">
              Explore
            </span>
            <h2 className="text-4xl md:text-5xl font-light text-primary-dark">
              Nosso Cardápio
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.title}
                href={cat.href}
                className="group relative h-80 overflow-hidden"
              >
                <Image
                  src={cat.image}
                  alt={cat.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-primary-dark/40 group-hover:bg-primary-dark/60 transition-colors" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <h3 className="text-2xl text-cream font-light tracking-wide">{cat.title}</h3>
                  <p className="text-cream/60 text-sm mt-1">{cat.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Quote section */}
      <section className="py-32 bg-primary-dark relative overflow-hidden">
        <div className="absolute top-0 left-0 text-[20rem] leading-none text-cream/5 font-light select-none">
          &ldquo;
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <p className="text-cream/60 leading-relaxed text-xl md:text-2xl mb-10 font-light">
            Somos não só o que comemos, e sim o que somos, o que
            consumimos, o que vestimos, a música que ouvimos, o conteúdo que consumimos
            no dia-a-dia.
          </p>
          <p className="text-3xl md:text-4xl italic text-accent font-light">
            &quot;Seja leve me leve&quot;
          </p>
        </div>
      </section>

      {/* Gallery - Masonry-like */}
      <section className="py-24 bg-background">
        <div className="max-w-6xl mx-auto px-4">
          <div className="mb-16">
            <span className="text-xs tracking-[0.3em] uppercase text-primary/40 block mb-2">
              Instagram
            </span>
            <h2 className="text-4xl font-light text-primary-dark">@ser.levemente</h2>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-1">
            {[
              "ser.levemente_1745349010_3616572083368822439_6683801803_1.jpg",
              "ser.levemente_1745346648_3616552271900707356_6683801803_10.jpg",
              "ser.levemente_1535555625_1856697615237570673_6683801803_4.jpg",
              "ser.levemente_1569699713_2143118985558736132_6683801803_7.jpg",
              "ser.levemente_1565651578_2109160769053505539_6683801803_10.jpg",
              "ser.levemente_1561128497_2071218418955904581_6683801803_1.jpg",
              "ser.levemente_1548196844_1962739844117326612_6683801803_6.jpg",
              "ser.levemente_1543222645_1921013244313337774_6683801803_5.jpg",
              "ser.levemente_1542112822_1911703368185536361_6683801803_8.jpg",
              "ser.levemente_1535734059_1858194432412569885_6683801803_2.jpg",
              "ser.levemente_1533559526_1839953124690740115_6683801803_8.jpg",
              "ser.levemente_1531318387_1821153085914835252_6683801803_8.jpg",
            ].map((file, i) => (
              <div key={i} className="aspect-square relative overflow-hidden">
                <Image
                  src={`/photos/${file}`}
                  alt="Ser Levemente"
                  fill
                  className="object-cover hover:scale-110 transition-transform duration-500 grayscale hover:grayscale-0"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-primary-dark">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-light text-cream mb-6">Faça sua encomenda</h2>
          <p className="text-cream/40 mb-12 text-lg">
            WhatsApp ou formulário de contato
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://wa.me/3300000000?text=Ol%C3%A1!%20Gostaria%20de%20fazer%20uma%20encomenda%20com%20a%20Ser%20Levemente!"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-accent text-primary-dark px-10 py-4 text-sm tracking-widest uppercase hover:bg-accent/80 transition-colors"
            >
              WhatsApp
            </a>
            <Link
              href="/contato"
              className="border border-cream/30 text-cream px-10 py-4 text-sm tracking-widest uppercase hover:bg-cream/10 transition-colors"
            >
              Contato
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
