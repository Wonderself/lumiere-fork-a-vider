import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ser Levemente | Cozinha Consciente",
  description:
    "Comida saudável com afeto. Desde 2017, trazendo sabor e saúde com ingredientes naturais. Saudável, baixo carboidrato, vegetariana, funcional.",
  keywords: [
    "cozinha consciente",
    "comida saudável",
    "sem glúten",
    "vegano",
    "Trancoso",
    "Vila Velha",
    "brownies saudáveis",
    "cookies veganos",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
