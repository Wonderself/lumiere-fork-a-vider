"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import * as store from "@/lib/store";

type BioSection = store.BioSection;

export default function AdminBio() {
  const [sections, setSections] = useState<BioSection[]>([]);
  const [editing, setEditing] = useState<BioSection | null>(null);
  const [isNew, setIsNew] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  function fetchData() {
    setSections(store.getBio().sort((a, b) => a.order - b.order));
  }

  function handleSave() {
    if (!editing) return;
    const all = store.getBio();
    if (isNew) {
      store.setBio([...all, { ...editing, id: Date.now().toString() }]);
    } else {
      store.setBio(all.map((b) => (b.id === editing.id ? editing : b)));
    }
    setEditing(null);
    setIsNew(false);
    fetchData();
  }

  function handleDelete(id: string) {
    if (!confirm("Tem certeza que deseja excluir esta seção?")) return;
    store.setBio(store.getBio().filter((b) => b.id !== id));
    fetchData();
  }

  function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !editing) return;
    const url = URL.createObjectURL(file);
    setEditing({ ...editing, image: url });
  }

  return (
    <div>
      <div className="flex items-start justify-between mb-4 gap-3">
        <div className="min-w-0">
          <h1 className="text-xl md:text-2xl font-light text-gray-800">Bio / Parcours</h1>
          <p className="text-sm text-gray-500">Gerencie as seções da página &quot;Minha História&quot;</p>
        </div>
        <button
          onClick={() => {
            setEditing({ id: "", title: "", content: "", image: "", order: sections.length });
            setIsNew(true);
          }}
          className="bg-primary-dark text-cream px-3 py-2 rounded-lg text-sm hover:bg-primary transition-colors flex-shrink-0"
        >
          + Nova
        </button>
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center">
          <div className="bg-white rounded-t-2xl md:rounded-2xl w-full md:max-w-2xl max-h-[85vh] overflow-y-auto p-5 md:p-6 md:mx-4">
            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4 md:hidden" />
            <h2 className="text-lg font-medium text-gray-800 mb-4">
              {isNew ? "Nova Seção" : "Editar Seção"}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Título</label>
                <input
                  type="text"
                  value={editing.title}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                  className="w-full px-3 py-2.5 border rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Conteúdo</label>
                <textarea
                  rows={6}
                  value={editing.content}
                  onChange={(e) => setEditing({ ...editing, content: e.target.value })}
                  className="w-full px-3 py-2.5 border rounded-lg text-sm resize-none"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Imagem (opcional)</label>
                {editing.image && (
                  <div className="relative w-full h-40 md:h-48 rounded-lg overflow-hidden mb-2">
                    <Image src={editing.image} alt="" fill className="object-cover" />
                  </div>
                )}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editing.image}
                    onChange={(e) => setEditing({ ...editing, image: e.target.value })}
                    placeholder="URL da imagem"
                    className="flex-1 px-3 py-2.5 border rounded-lg text-sm min-w-0"
                  />
                  <label className="bg-gray-100 px-3 py-2.5 rounded-lg text-sm cursor-pointer hover:bg-gray-200 flex-shrink-0">
                    Upload
                    <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
                  </label>
                </div>
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

      {/* Sections List */}
      <div className="space-y-3">
        {sections.map((section) => (
          <div key={section.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {/* Mobile: stacked layout. Desktop: side-by-side */}
            <div className="flex flex-col md:flex-row">
              {section.image && (
                <div className="relative h-36 md:h-auto md:w-48 flex-shrink-0">
                  <Image src={section.image} alt={section.title} fill className="object-cover" />
                </div>
              )}
              <div className="p-4 flex-1 min-w-0">
                <span className="text-xs text-gray-400">Seção {section.order + 1}</span>
                <h3 className="font-medium text-gray-800">{section.title}</h3>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2 md:line-clamp-3">{section.content}</p>
                <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => { setEditing(section); setIsNew(false); }}
                    className="text-xs text-primary-dark hover:text-primary px-2.5 py-1.5 border rounded-lg font-medium"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(section.id)}
                    className="text-xs text-red-500 hover:text-red-700 px-2.5 py-1.5 border border-red-200 rounded-lg"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
