import Image from "next/image";
import Link from "next/link";
import SectionTitle from "@/components/SectionTitle";

const categories = [
  {
    title: "Doces Saudáveis",
    description: "Brownies, cookies, brigadeiros e muito mais",
    image: "/photos/ser.levemente_1745349010_3616572083368822439_6683801803_1.jpg",
    href: "/cardapio#doces",
  },
  {
    title: "Salgados",
    description: "Quibes, pães, quiches e tortas",
    image: "/photos/ser.levemente_1569699713_2143118985558736132_6683801803_7.jpg",
    href: "/cardapio#salgados",
  },
  {
    title: "Pratos Principais",
    description: "Refeições completas e nutritivas",
    image: "/photos/ser.levemente_1561128497_2071218418955904581_6683801803_1.jpg",
    href: "/cardapio#pratos",
  },
  {
    title: "Bolos & Tortas",
    description: "Para ocasiões especiais",
    image: "/photos/ser.levemente_1535555625_1856697615237570673_6683801803_4.jpg",
    href: "/cardapio#bolos",
  },
];

const pillars = [
  { icon: "🌿", title: "Saudável", text: "Ingredientes naturais que fazem bem ao corpo" },
  { icon: "🍃", title: "Baixo Carboidrato", text: "Opções low carb sem perder o sabor" },
  { icon: "🌱", title: "Vegetariana", text: "Pratos plant-based deliciosos" },
  { icon: "✨", title: "Funcional", text: "Cada ingrediente com um propósito" },
];

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center bg-cream">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-cream via-cream/95 to-cream/40 z-10" />
          <Image
            src="/photos/ser.levemente_1745349010_3616572083368822439_6683801803_1.jpg"
            alt="Ser Levemente"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="relative z-20 max-w-6xl mx-auto px-4 py-20">
          <div className="max-w-xl">
            <div className="mb-6">
              <span className="text-5xl md:text-7xl font-light italic tracking-wide text-primary-dark">
                Leve
              </span>
              <span className="text-lg md:text-xl tracking-[0.4em] uppercase text-primary ml-2">
                Mente
              </span>
            </div>
            <p className="text-lg md:text-xl text-primary-dark/80 font-light mb-2">
              Cozinha Consciente
            </p>
            <p className="text-foreground/70 leading-relaxed mb-8 max-w-md">
              Comida saudável com afeto desde 2017. Simplificar, trazer comida boa,
              saudável, descomplicada na versão gostosa.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/cardapio"
                className="bg-primary-dark text-cream px-8 py-3 rounded-full text-sm tracking-wide hover:bg-primary transition-colors"
              >
                Ver Cardápio
              </Link>
              <Link
                href="/contato"
                className="border border-primary-dark text-primary-dark px-8 py-3 rounded-full text-sm tracking-wide hover:bg-primary-dark hover:text-cream transition-colors"
              >
                Fazer Encomenda
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="py-16 bg-background">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {pillars.map((p) => (
              <div key={p.title} className="text-center p-6 rounded-2xl bg-cream/50">
                <span className="text-3xl block mb-3">{p.icon}</span>
                <h3 className="font-medium text-primary-dark mb-1">{p.title}</h3>
                <p className="text-xs text-foreground/60">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-background">
        <div className="max-w-6xl mx-auto px-4">
          <SectionTitle
            title="Nosso Cardápio"
            subtitle="Comida inclusiva com ingredientes naturais para diferentes gostos"
          />
          <div className="grid md:grid-cols-2 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.title}
                href={cat.href}
                className="group relative h-72 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow"
              >
                <Image
                  src={cat.image}
                  alt={cat.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-xl font-medium mb-1">{cat.title}</h3>
                  <p className="text-sm text-white/80">{cat.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-20 bg-sage-light/30">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <SectionTitle title="O que nutre sua mente?" />
          <p className="text-foreground/70 leading-relaxed text-lg mb-6">
            O levemente é mais que um simples negócio. Trabalhamos com nutrição de uma
            forma geral: porque somos não só o que comemos, e sim o que somos, o que
            consumimos, o que vestimos, a música que ouvimos, o conteúdo que consumimos
            no dia-a-dia.
          </p>
          <p className="text-foreground/70 leading-relaxed text-lg mb-8">
            Nutrir nossa mente com equilíbrio e consciência é um convite para uma vida
            mais bem vivida. Estamos aqui para fazer você levar a vida um pouco mais
            leve.
          </p>
          <p className="text-2xl italic text-primary-dark font-light">
            &quot;Seja leve me leve&quot;
          </p>
        </div>
      </section>

      {/* Gallery Preview */}
      <section className="py-20 bg-background">
        <div className="max-w-6xl mx-auto px-4">
          <SectionTitle title="Do nosso Instagram" subtitle="@ser.levemente" />
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
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
              <div key={i} className="aspect-square relative rounded-lg overflow-hidden">
                <Image
                  src={`/photos/${file}`}
                  alt="Ser Levemente"
                  fill
                  className="object-cover hover:scale-110 transition-transform duration-500"
                />
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <a
              href="https://instagram.com/ser.levemente"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-dark hover:text-primary transition-colors text-sm tracking-wide"
            >
              Siga-nos no Instagram →
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary-dark text-cream">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-light mb-4">Faça sua encomenda</h2>
          <p className="text-cream/70 mb-8">
            Entre em contato pelo WhatsApp ou pelo nosso formulário
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://wa.me/3300000000?text=Ol%C3%A1!%20Gostaria%20de%20fazer%20uma%20encomenda%20com%20a%20Ser%20Levemente!"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] text-white px-8 py-3 rounded-full text-sm tracking-wide hover:bg-[#20BD5A] transition-colors"
            >
              WhatsApp
            </a>
            <Link
              href="/contato"
              className="border border-cream text-cream px-8 py-3 rounded-full text-sm tracking-wide hover:bg-cream hover:text-primary-dark transition-colors"
            >
              Formulário de Contato
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
