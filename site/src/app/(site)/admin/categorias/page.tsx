"use client";

import { useEffect, useState } from "react";
import * as store from "@/lib/store";

type Category = store.Category;

export default function AdminCategorias() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [editing, setEditing] = useState<Category | null>(null);
  const [isNew, setIsNew] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  function fetchData() {
    setCategories(store.getCategories().sort((a, b) => a.order - b.order));
  }

  function handleSave() {
    if (!editing) return;
    const all = store.getCategories();
    if (isNew) {
      store.setCategories([...all, { ...editing, id: editing.id || Date.now().toString() }]);
    } else {
      store.setCategories(all.map((c) => (c.id === editing.id ? editing : c)));
    }
    setEditing(null);
    setIsNew(false);
    fetchData();
  }

  function handleDelete(id: string) {
    if (!confirm("Tem certeza? Os produtos desta categoria não serão excluídos.")) return;
    store.setCategories(store.getCategories().filter((c) => c.id !== id));
    fetchData();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl md:text-2xl font-light text-gray-800">Categorias</h1>
        <button
          onClick={() => {
            setEditing({ id: "", name: "", subtitle: "", order: categories.length });
            setIsNew(true);
          }}
          className="bg-primary-dark text-cream px-3 py-2 rounded-lg text-sm hover:bg-primary transition-colors"
        >
          + Nova
        </button>
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center">
          <div className="bg-white rounded-t-2xl md:rounded-2xl w-full md:max-w-lg max-h-[85vh] overflow-y-auto p-5 md:p-6 md:mx-4">
            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4 md:hidden" />
            <h2 className="text-lg font-medium text-gray-800 mb-4">
              {isNew ? "Nova Categoria" : "Editar Categoria"}
            </h2>
            <div className="space-y-4">
              {isNew && (
                <div>
                  <label className="block text-sm text-gray-600 mb-1">ID (slug)</label>
                  <input
                    type="text"
                    value={editing.id}
                    onChange={(e) => setEditing({ ...editing, id: e.target.value.toLowerCase().replace(/\s/g, "-") })}
                    placeholder="ex: doces-especiais"
                    className="w-full px-3 py-2.5 border rounded-lg text-sm"
                  />
                </div>
              )}
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
                <label className="block text-sm text-gray-600 mb-1">Subtítulo</label>
                <input
                  type="text"
                  value={editing.subtitle}
                  onChange={(e) => setEditing({ ...editing, subtitle: e.target.value })}
                  className="w-full px-3 py-2.5 border rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Ordem</label>
                <input
                  type="number"
                  value={editing.order}
                  onChange={(e) => setEditing({ ...editing, order: Number(e.target.value) })}
                  className="w-full px-3 py-2.5 border rounded-lg text-sm"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button onClick={handleSave} className="flex-1 bg-primary-dark text-cream py-2.5 rounded-lg text-sm">
                Salvar
              </button>
              <button onClick={() => { setEditing(null); setIsNew(false); }} className="flex-1 bg-gray-100 text-gray-600 py-2.5 rounded-lg text-sm">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Categories List */}
      <div className="space-y-3">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h3 className="font-medium text-gray-800">{cat.name}</h3>
                <p className="text-sm text-gray-500 truncate">{cat.subtitle}</p>
                <span className="text-xs text-gray-400">ID: {cat.id} | Ordem: {cat.order}</span>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => { setEditing(cat); setIsNew(false); }}
                  className="text-xs text-primary-dark hover:text-primary px-2.5 py-1.5 border rounded-lg"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="text-xs text-red-500 hover:text-red-700 px-2.5 py-1.5 border border-red-200 rounded-lg"
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
