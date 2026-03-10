"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import * as store from "@/lib/store";

type Product = store.Product;
type Category = store.Category;

export default function AdminProdutos() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editing, setEditing] = useState<Product | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  function fetchData() {
    setProducts(store.getProducts());
    setCategories(store.getCategories());
  }

  function handleSave() {
    if (!editing) return;
    const all = store.getProducts();
    if (isNew) {
      const newP = { ...editing, id: Date.now().toString(), order: all.length };
      store.setProducts([...all, newP]);
    } else {
      store.setProducts(all.map((p) => (p.id === editing.id ? editing : p)));
    }
    setEditing(null);
    setIsNew(false);
    fetchData();
  }

  function handleDelete(id: string) {
    if (!confirm("Tem certeza que deseja excluir este produto?")) return;
    store.setProducts(store.getProducts().filter((p) => p.id !== id));
    fetchData();
  }

  function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !editing) return;
    const url = URL.createObjectURL(file);
    setEditing({ ...editing, image: url });
  }

  const filtered = filter
    ? products.filter((p) => p.categoryId === filter)
    : products;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl md:text-2xl font-light text-gray-800">Produtos</h1>
        <button
          onClick={() => {
            setEditing({
              id: "",
              name: "",
              description: "",
              image: "",
              categoryId: categories[0]?.id || "",
              order: products.length,
            });
            setIsNew(true);
          }}
          className="bg-primary-dark text-cream px-3 py-2 rounded-lg text-sm hover:bg-primary transition-colors"
        >
          + Novo
        </button>
      </div>

      {/* Filter - scrollable on mobile */}
      <div className="mb-4 flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap">
        <button
          onClick={() => setFilter("")}
          className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap flex-shrink-0 ${!filter ? "bg-primary-dark text-cream" : "bg-gray-100 text-gray-600"}`}
        >
          Todos ({products.length})
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setFilter(cat.id)}
            className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap flex-shrink-0 ${filter === cat.id ? "bg-primary-dark text-cream" : "bg-gray-100 text-gray-600"}`}
          >
            {cat.name} ({products.filter((p) => p.categoryId === cat.id).length})
          </button>
        ))}
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center">
          <div className="bg-white rounded-t-2xl md:rounded-2xl w-full md:max-w-lg max-h-[85vh] overflow-y-auto p-5 md:p-6 md:mx-4">
            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4 md:hidden" />
            <h2 className="text-lg font-medium text-gray-800 mb-4">
              {isNew ? "Novo Produto" : "Editar Produto"}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Nome</label>
                <input
                  type="text"
                  value={editing.name}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  className="w-full px-3 py-2.5 border rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Descri&ccedil;&atilde;o</label>
                <textarea
                  rows={3}
                  value={editing.description}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  className="w-full px-3 py-2.5 border rounded-lg text-sm resize-none"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Categoria</label>
                <select
                  value={editing.categoryId}
                  onChange={(e) => setEditing({ ...editing, categoryId: e.target.value })}
                  className="w-full px-3 py-2.5 border rounded-lg text-sm bg-white"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Imagem</label>
                {editing.image && (
                  <div className="relative w-full h-40 rounded-lg overflow-hidden mb-2">
                    <Image src={editing.image} alt="" fill className="object-cover" />
                  </div>
                )}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editing.image}
                    onChange={(e) => setEditing({ ...editing, image: e.target.value })}
                    placeholder="URL da imagem ou upload"
                    className="flex-1 px-3 py-2.5 border rounded-lg text-sm min-w-0"
                  />
                  <label className="bg-gray-100 px-3 py-2.5 rounded-lg text-sm cursor-pointer hover:bg-gray-200 transition-colors flex-shrink-0">
                    Upload
                    <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
                  </label>
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button
                onClick={handleSave}
                className="flex-1 bg-primary-dark text-cream py-2.5 rounded-lg text-sm hover:bg-primary transition-colors"
              >
                Salvar
              </button>
              <button
                onClick={() => { setEditing(null); setIsNew(false); }}
                className="flex-1 bg-gray-100 text-gray-600 py-2.5 rounded-lg text-sm hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        {filtered.map((product) => (
          <div key={product.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {product.image && (
              <div className="relative h-36 md:h-40">
                <Image src={product.image} alt={product.name} fill className="object-cover" />
              </div>
            )}
            <div className="p-3 md:p-4">
              <h3 className="font-medium text-gray-800 text-sm">{product.name}</h3>
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">{product.description}</p>
              <span className="inline-block mt-2 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                {categories.find((c) => c.id === product.categoryId)?.name || product.categoryId}
              </span>
              <div className="flex gap-3 mt-3 pt-3 border-t border-gray-100">
                <button
                  onClick={() => { setEditing(product); setIsNew(false); }}
                  className="text-xs text-primary-dark hover:text-primary transition-colors font-medium"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="text-xs text-red-500 hover:text-red-700 transition-colors"
                >
                  Excluir
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
