import Image from "next/image";
import SectionTitle from "@/components/SectionTitle";

const locations = [
  "Paraty - RJ",
  "Capelinha - MG",
  "Caraíva - BA",
  "Chapada dos Veadeiros - GO",
  "Florianópolis - SC",
  "Vila Velha - ES",
  "Trancoso - BA",
];

export default function Sobre() {
  return (
    <div className="pt-8 pb-20">
      {/* Hero */}
      <section className="relative py-24 bg-cream">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-light text-primary-dark mb-6">
                Nossa História
              </h1>
              <p className="text-foreground/70 leading-relaxed mb-4">
                A Ser Levemente nasceu em 2017, fruto de uma paixão pela cozinha
                consciente e pela busca de uma alimentação que nutre não só o corpo,
                mas também a mente e a alma.
              </p>
              <p className="text-foreground/70 leading-relaxed mb-4">
                Feliz da oportunidade de poder desenvolver o levemente em mais de um
                estado, todos deixados sementinhas do levemente e caminhos abertos.
              </p>
              <p className="text-foreground/70 leading-relaxed">
                Esse Instagram é feito de todas essas histórias que se iniciam agora
                em Vila Velha - ES, com já muitas ideias, parceiros, e um futuro na
                nutrição para trazer mais informação com embasamento e qualidade.
              </p>
            </div>
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="/photos/ser.levemente_1543222645_1921013244313337774_6683801803_5.jpg"
                alt="Ser Levemente - Nossa cozinha"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Journey */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <SectionTitle
            title="Nossa Jornada pelo Brasil"
            subtitle="Cada lugar deixou uma semente do levemente"
          />
          <div className="flex flex-wrap justify-center gap-4">
            {locations.map((loc) => (
              <span
                key={loc}
                className="px-6 py-3 bg-cream rounded-full text-sm text-primary-dark border border-primary-light/30"
              >
                {loc}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-20 bg-sage-light/30">
        <div className="max-w-4xl mx-auto px-4">
          <SectionTitle title="Nossa Filosofia" />
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-md">
              <h3 className="text-xl font-medium text-primary-dark mb-4">
                O que você leva?
              </h3>
              <p className="text-foreground/70 leading-relaxed">
                Trouxe essa pergunta para ser provocativa, para você pensar no que anda
                carregando pela sua vida... sua carga te traz leveza também? Te traz bem
                estar e apesar dos pesares faz você entender o porquê está carregando
                aquilo consigo?
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-md">
              <h3 className="text-xl font-medium text-primary-dark mb-4">
                Nossa Missão
              </h3>
              <p className="text-foreground/70 leading-relaxed">
                Simplificar, trazer comida boa, saudável, descomplicada na versão
                gostosa. De doces, refeições e lanches só que com ingredientes com
                diversos benefícios. Comida inclusiva com ingredientes naturais para
                diferentes gostos.
              </p>
            </div>
          </div>
          <div className="text-center mt-12">
            <p className="text-2xl italic text-primary-dark font-light">
              &quot;Seja leve me leve&quot;
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <SectionTitle title="Nossos Valores" />
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-cream rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🌿</span>
              </div>
              <h3 className="font-medium text-primary-dark mb-2">
                Ingredientes Naturais
              </h3>
              <p className="text-sm text-foreground/60">
                Sem conservantes artificiais, sem industrializados. Cada ingrediente é
                escolhido pelos seus benefícios.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-cream rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">💚</span>
              </div>
              <h3 className="font-medium text-primary-dark mb-2">
                Inclusividade
              </h3>
              <p className="text-sm text-foreground/60">
                Atendemos diabéticos, veganos, celíacos, intolerantes a lactose. A ser
                levemente é feita pra ser consumida por todos!
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-cream rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🤎</span>
              </div>
              <h3 className="font-medium text-primary-dark mb-2">
                Evolução Constante
              </h3>
              <p className="text-sm text-foreground/60">
                Estudando nutrição, fazendo cursos com chefs reconhecidos, sempre
                buscando proporcionar uma vida mais equilibrada e consciente.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Nutrition */}
      <section className="py-16 bg-cream">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-light text-primary-dark mb-4">
            Alimentação + Informação
          </h2>
          <p className="text-foreground/70 leading-relaxed mb-4">
            Graduando nutrição para trazer mais informação com embasamento e qualidade
            a vocês. Porque é possível provar que é possível comer saudável e gostoso!
          </p>
          <p className="text-foreground/60 text-sm">
            @euparanhos — Nutrição
          </p>
        </div>
      </section>
    </div>
  );
}
