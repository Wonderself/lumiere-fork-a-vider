// Pure data exports (no filesystem) — safe for static export and client components
import type { Product, Category, BioSection, SiteSettings } from "./data";

export const defaultCategories: Category[] = [
  { id: "doces", name: "Doces Saudáveis", subtitle: "A arte de fazer vontade em vocês — sem culpa!", order: 0 },
  { id: "salgados", name: "Salgados Saudáveis", subtitle: "Ah, mas não sou chegada no doce... Não tem problema!", order: 1 },
  { id: "pratos", name: "Pratos Principais", subtitle: "Refeições completas, nutritivas e deliciosas", order: 2 },
  { id: "bolos", name: "Bolos & Tortas Especiais", subtitle: "Para momentos que merecem algo especial", order: 3 },
];

export const defaultProducts: Product[] = [
  { id: "1", name: "Brownie Sem Glúten", description: "Farinha de amêndoas, chocolate 70%, cacau 100%, nozes e amêndoas em lâminas", image: "/photos/ser.levemente_1745349010_3616572083368822439_6683801803_1.jpg", categoryId: "doces", order: 0 },
  { id: "2", name: "Cookies Vegan", description: "Chocolate e castanha do pará. Caixinha com 6 unidades", image: "/photos/ser.levemente_1745346648_3616552271900707356_6683801803_10.jpg", categoryId: "doces", order: 1 },
  { id: "3", name: "Cookies Recheados", description: "3 recheios: amêndoas laminadas + matcha, coco queimado + geleia de morango, bala de banana + castanha do pará", image: "/photos/ser.levemente_1745346648_3616552271917595464_6683801803_12.jpg", categoryId: "doces", order: 2 },
  { id: "4", name: "Brigadeiro Saudável", description: "Feito com muito cacau e carinho", image: "/photos/ser.levemente_1535734059_1858194432412569885_6683801803_2.jpg", categoryId: "doces", order: 3 },
  { id: "5", name: "Torta de Limão", description: "Base de mandioca com limão, casquinha crocante e merengue suíço com ingredientes não processados", image: "/photos/ser.levemente_1533559526_1839953124690740115_6683801803_8.jpg", categoryId: "doces", order: 4 },
  { id: "6", name: "Muffins de Chocolate", description: "Com nozes e cacau puro, sem glúten", image: "/photos/ser.levemente_1535555625_1856697615237570673_6683801803_4.jpg", categoryId: "doces", order: 5 },
  { id: "7", name: "Quibe de Abóbora", description: "Com quinoa, muitas especiarias e hortelã, recheado com carne de soja", image: "/photos/ser.levemente_1568567476_2133621091650608014_6683801803_12.jpg", categoryId: "salgados", order: 0 },
  { id: "8", name: "Pãozinho de Beterraba", description: "Com sementes e alecrim, disponível para vendas e encomendas", image: "/photos/ser.levemente_1559781853_2059921948084582377_6683801803_8.jpg", categoryId: "salgados", order: 1 },
  { id: "9", name: "Pão Artesanal", description: "Com cream cheese de ervas e suco natural", image: "/photos/ser.levemente_1569699713_2143118985558736132_6683801803_7.jpg", categoryId: "salgados", order: 2 },
  { id: "10", name: "Homus", description: "Pasta árabe de grão-de-bico, indispensável em uma dieta vegana e vegetariana", image: "/photos/ser.levemente_1519508988_1722088671233852388_6683801803_8.jpg", categoryId: "salgados", order: 3 },
  { id: "11", name: "PadThai Vegetariano", description: "Explosão de sabores e ingredientes que juntos se potencializam", image: "/photos/ser.levemente_1561128497_2071218418955904581_6683801803_1.jpg", categoryId: "pratos", order: 0 },
  { id: "12", name: "Marmitas Saudáveis", description: "Pratos principais com ingredientes frescos e gratinados", image: "/photos/ser.levemente_1555069958_2020395708588218435_6683801803_4.jpg", categoryId: "pratos", order: 1 },
  { id: "13", name: "Bolo Primavera", description: "Massa de chocolate e raspas de laranja, sem glúten, sem gordura, molhadinho com calda de maçã", image: "/photos/ser.levemente_1565651578_2109160769053505539_6683801803_10.jpg", categoryId: "bolos", order: 0 },
  { id: "14", name: "Bolo de Chocolate com Coco", description: "Cobertura de chocolate com copeaux de coco tostado", image: "/photos/ser.levemente_1555252604_2021927849780141228_6683801803_3.jpg", categoryId: "bolos", order: 1 },
  { id: "15", name: "Ovo de Colher", description: "Brownie diet, pistache, vegano cookies — para a Páscoa com consciência", image: "/photos/ser.levemente_1745349010_3616572083092053460_6683801803_4.jpg", categoryId: "bolos", order: 2 },
];

export const defaultBio: BioSection[] = [
  { id: "1", title: "A Origem", content: "A Ser Levemente nasceu em 2017 de uma paixão pela cozinha consciente e pela busca de uma alimentação que nutre não só o corpo, mas também a mente e a alma. Tudo começou com a vontade de simplificar — trazer comida boa, saudável, descomplicada na versão gostosa.", image: "/photos/ser.levemente_1543222645_1921013244313337774_6683801803_5.jpg", order: 0 },
  { id: "2", title: "Jornada pelo Brasil", content: "De Paraty (RJ) a Capelinha (MG), de Caraíva (BA) a Chapada dos Veadeiros (GO), passando por Florianópolis (SC), Vila Velha (ES) e Trancoso (BA) — cada lugar deixou uma semente do levemente e caminhos abertos. Essa é uma história de viagens, descobertas culinárias e muita troca com comunidades locais.", image: "/photos/ser.levemente_1542112822_1911703368185536361_6683801803_8.jpg", order: 1 },
  { id: "3", title: "Formação & Evolução", content: "Graduando nutrição (@euparanhos) para trazer mais informação com embasamento e qualidade. Participação em cursos de sobremesas saudáveis com o reconhecido Chef Renato Caleffi no Le Manjue em São Paulo — referência nacional em gastronomia orgânica e funcional. Estamos sempre em constante evolução, buscando proporcionar uma vida mais equilibrada e consciente.", image: "/photos/ser.levemente_1524327065_1762505629023286810_6683801803_9.jpg", order: 2 },
  { id: "4", title: "Filosofia", content: "O levemente é mais que um simples negócio. Trabalhamos com nutrição de uma forma geral: porque somos não só o que comemos, e sim o que somos, o que consumimos, o que vestimos, a música que ouvimos, o conteúdo que consumimos no dia-a-dia. Nutrir nossa mente com equilíbrio e consciência é um convite para uma vida mais bem vivida. Comer também pode ser um ato político, uma forma de ser mais correto com o meio ambiente.", image: "", order: 3 },
  { id: "5", title: "Missão", content: "Comida inclusiva com ingredientes naturais para diferentes gostos. Atendemos diabéticos, veganos, celíacos, intolerantes a lactose, mamães APLV, crianças. A ser levemente é feita pra ser consumida por todos! Não precisa ser vegano para comer um prato vegano — é uma explosão de sabores toda experiência. A consciência é de cada um, e cada um no seu tempo e processo.", image: "", order: 4 },
];

export const defaultSettings: SiteSettings = {
  siteName: "Ser Levemente",
  tagline: "Cozinha Consciente",
  slogan: "Seja leve me leve",
  description: "Comida saudável com afeto desde 2017. Simplificar, trazer comida boa, saudável, descomplicada na versão gostosa.",
  whatsapp: "3300000000",
  instagram: "ser.levemente",
  email: "contato@serlevemente.com",
  logoUrl: "",
  locations: ["Trancoso, Bahia - Brasil", "Vila Velha, ES - Brasil"],
};
