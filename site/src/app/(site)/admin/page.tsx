"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0, categories: 0, bio: 0 });

  useEffect(() => {
    import("@/lib/store").then(({ getProducts, getCategories, getBio }) => {
      setStats({
        products: getProducts().length,
        categories: getCategories().length,
        bio: getBio().length,
      });
    });
  }, []);

  const cards = [
    { label: "Produtos", value: stats.products, href: "/admin/produtos", icon: "🍪", color: "bg-amber-50 border-amber-200" },
    { label: "Categorias", value: stats.categories, href: "/admin/categorias", icon: "📂", color: "bg-blue-50 border-blue-200" },
    { label: "Seções Bio", value: stats.bio, href: "/admin/bio", icon: "📝", color: "bg-green-50 border-green-200" },
  ];

  return (
    <div>
      <h1 className="text-xl md:text-2xl font-light text-gray-800 mb-4 md:mb-6">
        Painel de Administração
      </h1>

      <div className="grid grid-cols-3 gap-2 md:gap-4 mb-6 md:mb-8">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className={`p-3 md:p-6 rounded-xl border ${card.color} hover:shadow-md transition-shadow`}
          >
            <div className="text-center md:text-left">
              <span className="text-2xl md:text-3xl block md:hidden mb-1">{card.icon}</span>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-gray-500">{card.label}</p>
                  <p className="text-2xl md:text-3xl font-light text-gray-800 mt-0.5">
                    {card.value}
                  </p>
                </div>
                <span className="text-3xl hidden md:block">{card.icon}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
        <h2 className="text-base md:text-lg font-medium text-gray-800 mb-3 md:mb-4">Ações Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
          <Link
            href="/admin/produtos"
            className="flex items-center gap-3 p-3 md:p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <span className="text-xl">➕</span>
            <div>
              <p className="text-sm font-medium text-gray-700">Adicionar Produto</p>
              <p className="text-xs text-gray-500 hidden md:block">Criar um novo produto no cardápio</p>
            </div>
          </Link>
          <Link
            href="/admin/bio"
            className="flex items-center gap-3 p-3 md:p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <span className="text-xl">✏️</span>
            <div>
              <p className="text-sm font-medium text-gray-700">Editar Bio</p>
              <p className="text-xs text-gray-500 hidden md:block">Atualizar a página de parcours</p>
            </div>
          </Link>
          <Link
            href="/admin/configuracoes"
            className="flex items-center gap-3 p-3 md:p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <span className="text-xl">🖼️</span>
            <div>
              <p className="text-sm font-medium text-gray-700">Alterar Logo</p>
              <p className="text-xs text-gray-500 hidden md:block">Fazer upload do logo da marca</p>
            </div>
          </Link>
          <Link
            href="/admin/configuracoes"
            className="flex items-center gap-3 p-3 md:p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <span className="text-xl">📱</span>
            <div>
              <p className="text-sm font-medium text-gray-700">WhatsApp / Contato</p>
              <p className="text-xs text-gray-500 hidden md:block">Alterar número e informações</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
