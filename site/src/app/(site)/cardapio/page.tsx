import Image from "next/image";
import SectionTitle from "@/components/SectionTitle";
import { defaultProducts, defaultCategories, defaultSettings } from "@/lib/defaults";

export default function Cardapio() {
  const products = defaultProducts;
  const categories = [...defaultCategories].sort((a, b) => a.order - b.order);
  const whatsappUrl = `https://wa.me/${defaultSettings.whatsapp}?text=${encodeURIComponent("Olá! Gostaria de fazer uma encomenda!")}`;

  return (
    <div className="pt-8 pb-20">
      {/* Header */}
      <section className="py-12 bg-cream">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-light text-primary-dark mb-4">
            Cardápio
          </h1>
          <p className="text-foreground/60 max-w-2xl mx-auto">
            Todos os nossos produtos são feitos com ingredientes naturais, sem conservantes
            artificiais. Alimentos saudáveis e não fit — entender o que se come é
            fundamental para uma boa saúde a longo prazo.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            {categories.map((cat) => (
              <a
                key={cat.id}
                href={`#${cat.id}`}
                className="px-5 py-2 rounded-full border border-primary/30 text-sm text-primary-dark hover:bg-primary-dark hover:text-cream transition-colors"
              >
                {cat.name}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Categories & Products */}
      {categories.map((category) => {
        const catProducts = products
          .filter((p) => p.categoryId === category.id)
          .sort((a, b) => a.order - b.order);

        if (catProducts.length === 0) return null;

        return (
          <section key={category.id} id={category.id} className="py-16">
            <div className="max-w-6xl mx-auto px-4">
              <SectionTitle title={category.name} subtitle={category.subtitle} />
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {catProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow group"
                  >
                    {product.image && (
                      <div className="relative h-64 overflow-hidden">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}
                    <div className="p-5">
                      <h3 className="font-medium text-primary-dark text-lg mb-2">
                        {product.name}
                      </h3>
                      <p className="text-sm text-foreground/60 leading-relaxed">
                        {product.description}
                      </p>
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-4 text-sm text-primary-dark hover:text-primary transition-colors font-medium"
                      >
                        Encomendar →
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      })}

      {/* Note */}
      <section className="py-12 bg-sage-light/30">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-foreground/70 leading-relaxed">
            Não precisa ser vegano para comer um prato vegano! É uma explosão de sabores
            toda experiência de comer um prato desses. A consciência é de cada um, e cada
            um no seu tempo e processo.
          </p>
          <p className="text-primary-dark mt-4 italic">
            Sabedoria nas escolhas sempre vai ser o melhor caminho.
          </p>
        </div>
      </section>
    </div>
  );
}
