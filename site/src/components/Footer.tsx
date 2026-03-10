import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-primary-dark text-cream">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="mb-4">
              <span className="text-2xl font-light italic tracking-wide">
                Leve
              </span>
              <span className="text-xs tracking-[0.35em] uppercase ml-1">
                Mente
              </span>
            </div>
            <p className="text-cream/70 text-sm leading-relaxed">
              Cozinha Consciente
              <br />
              Comida saudável com afeto desde 2017
            </p>
            <p className="text-cream/50 text-sm mt-2 italic">
              &quot;Seja leve me leve&quot;
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-medium mb-4 text-accent">Navegação</h3>
            <div className="flex flex-col gap-2">
              <Link
                href="/cardapio"
                className="text-sm text-cream/70 hover:text-cream transition-colors"
              >
                Cardápio
              </Link>
              <Link
                href="/sobre"
                className="text-sm text-cream/70 hover:text-cream transition-colors"
              >
                Sobre
              </Link>
              <Link
                href="/eventos"
                className="text-sm text-cream/70 hover:text-cream transition-colors"
              >
                Eventos
              </Link>
              <Link
                href="/contato"
                className="text-sm text-cream/70 hover:text-cream transition-colors"
              >
                Contato
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-medium mb-4 text-accent">Contato</h3>
            <div className="flex flex-col gap-2 text-sm text-cream/70">
              <a
                href="https://instagram.com/ser.levemente"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-cream transition-colors"
              >
                @ser.levemente
              </a>
              <p>Trancoso, Bahia - Brasil</p>
              <p>Vila Velha, ES - Brasil</p>
            </div>
          </div>
        </div>

        <div className="border-t border-cream/20 mt-8 pt-6 text-center text-xs text-cream/40">
          <p>Saudável &bull; Baixo Carboidrato &bull; Vegetariana &bull; Funcional</p>
          <p className="mt-2">&copy; {new Date().getFullYear()} Ser Levemente. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
