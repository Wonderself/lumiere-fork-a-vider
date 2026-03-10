import Image from "next/image";
import Link from "next/link";
import SectionTitle from "@/components/SectionTitle";

const services = [
  {
    title: "Menu de Aniversário",
    description:
      "Faça o menu de aniversário com o levemente! Tudo sem glúten e sem lactose como você precisa. Desafio aceito: agradar um paladar infantil com comida saudável.",
    image: "/photos/ser.levemente_1531318387_1821153085914835252_6683801803_8.jpg",
  },
  {
    title: "Feiras & Mercados",
    description:
      "Presente em feiras e eventos como o Sarau Vulva em Trancoso. Nosso stand com vitrine de madeira e produtos frescos, sempre com aquele carinho artesanal.",
    image: "/photos/ser.levemente_1542112822_1911703368185536361_6683801803_8.jpg",
  },
  {
    title: "Encomendas para Páscoa",
    description:
      "Ovos de colher brownie diet, pistache, vegano cookies. Caixinhas de cookies e brownies especiais. Porque em épocas de Páscoa, é saudável não abrir mão de um docinho.",
    image: "/photos/ser.levemente_1745349010_3616572083092053460_6683801803_4.jpg",
  },
  {
    title: "Eventos Corporativos",
    description:
      "Coffee breaks saudáveis, buffets para eventos e workshops. Bebidas refrescantes, salgados e doces que surpreendem.",
    image: "/photos/ser.levemente_1524327065_1762505629023286810_6683801803_9.jpg",
  },
];

const galleryPhotos = [
  "ser.levemente_1745349010_3616572083771350372_6683801803_3.jpg",
  "ser.levemente_1745346648_3616552271967771703_6683801803_13.jpg",
  "ser.levemente_1745349010_3616572083771506960_6683801803_5.jpg",
  "ser.levemente_1745346648_3616552271892346250_6683801803_14.jpg",
  "ser.levemente_1745349010_3616572083083495005_6683801803_7.jpg",
  "ser.levemente_1745346648_3616552271967863215_6683801803_11.jpg",
];

export default function Eventos() {
  return (
    <div className="pt-8 pb-20">
      {/* Header */}
      <section className="py-16 bg-cream">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-light text-primary-dark mb-4">
            Eventos & Encomendas
          </h1>
          <p className="text-foreground/60 max-w-2xl mx-auto">
            Ter oportunidade de fazer parte dos seus momentos especiais é um grande
            desafio e também uma grande alegria. Quando vemos o resultado final e todos
            amando, traz para o coração aquela sensação de dever cumprido!
          </p>
        </div>
      </section>

      {/* Services */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <SectionTitle
            title="Nossos Serviços"
            subtitle="Do aniversário infantil à feira artesanal"
          />
          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service) => (
              <div
                key={service.title}
                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow"
              >
                <div className="relative h-64">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-medium text-primary-dark mb-3">
                    {service.title}
                  </h3>
                  <p className="text-sm text-foreground/60 leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-16 bg-cream">
        <div className="max-w-6xl mx-auto px-4">
          <SectionTitle title="Momentos Especiais" />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {galleryPhotos.map((file, i) => (
              <div
                key={i}
                className="relative aspect-square rounded-2xl overflow-hidden shadow-md"
              >
                <Image
                  src={`/photos/${file}`}
                  alt="Evento Ser Levemente"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-light text-primary-dark mb-4">
            Vamos criar juntos?
          </h2>
          <p className="text-foreground/60 mb-8">
            Entre em contato para discutir seu evento. Cada encomenda é única e feita com
            muito carinho.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://wa.me/3300000000?text=Ol%C3%A1!%20Gostaria%20de%20saber%20mais%20sobre%20os%20servi%C3%A7os%20de%20eventos%20da%20Ser%20Levemente!"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-primary-dark text-cream px-8 py-3 rounded-full text-sm tracking-wide hover:bg-primary transition-colors"
            >
              Fale Conosco
            </a>
            <Link
              href="/contato"
              className="border border-primary-dark text-primary-dark px-8 py-3 rounded-full text-sm tracking-wide hover:bg-primary-dark hover:text-cream transition-colors"
            >
              Formulário
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
