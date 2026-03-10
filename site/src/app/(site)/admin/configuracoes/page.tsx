"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import * as s from "@/lib/store";

type SiteSettings = s.SiteSettings;

export default function AdminConfiguracoes() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [saved, setSaved] = useState(false);
  const [newLocation, setNewLocation] = useState("");

  useEffect(() => {
    setSettings(s.getSettings());
  }, []);

  function handleSave() {
    if (!settings) return;
    s.setSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !settings) return;
    const url = URL.createObjectURL(file);
    setSettings({ ...settings, logoUrl: url });
  }

  if (!settings) return <div className="text-gray-500">Carregando...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl md:text-2xl font-light text-gray-800">Configurações</h1>
        <button
          onClick={handleSave}
          className={`px-3 py-2 rounded-lg text-sm transition-colors ${
            saved ? "bg-green-500 text-white" : "bg-primary-dark text-cream hover:bg-primary"
          }`}
        >
          {saved ? "Salvo!" : "Salvar"}
        </button>
      </div>

      <div className="space-y-4 md:space-y-6 max-w-2xl">
        {/* Logo */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
          <h2 className="text-base md:text-lg font-medium text-gray-800 mb-4">Logo</h2>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            {settings.logoUrl ? (
              <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-xl overflow-hidden border flex-shrink-0">
                <Image src={settings.logoUrl} alt="Logo" fill className="object-contain" />
              </div>
            ) : (
              <div className="w-28 h-28 md:w-32 md:h-32 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-sm flex-shrink-0">
                Sem logo
              </div>
            )}
            <div className="flex flex-col items-center sm:items-start gap-2">
              <label className="bg-primary-dark text-cream px-4 py-2 rounded-lg text-sm cursor-pointer hover:bg-primary transition-colors">
                Upload Logo
                <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
              </label>
              {settings.logoUrl && (
                <button
                  onClick={() => setSettings({ ...settings, logoUrl: "" })}
                  className="text-xs text-red-500 hover:text-red-700"
                >
                  Remover logo
                </button>
              )}
            </div>
          </div>
        </div>

        {/* General */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
          <h2 className="text-base md:text-lg font-medium text-gray-800 mb-4">Informações Gerais</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Nome do Site</label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                className="w-full px-3 py-2.5 border rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Tagline</label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className="w-full px-3 py-2.5 border rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Slogan</label>
              <input
                type="text"
                value={settings.slogan}
                onChange={(e) => setSettings({ ...settings, slogan: e.target.value })}
                className="w-full px-3 py-2.5 border rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Descrição</label>
              <textarea
                rows={3}
                value={settings.description}
                onChange={(e) => setSettings({ ...settings, description: e.target.value })}
                className="w-full px-3 py-2.5 border rounded-lg text-sm resize-none"
              />
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
          <h2 className="text-base md:text-lg font-medium text-gray-800 mb-4">Contato</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">WhatsApp (com código do país)</label>
              <input
                type="text"
                value={settings.whatsapp}
                onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                placeholder="5527999999999"
                className="w-full px-3 py-2.5 border rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Instagram (sem @)</label>
              <input
                type="text"
                value={settings.instagram}
                onChange={(e) => setSettings({ ...settings, instagram: e.target.value })}
                className="w-full px-3 py-2.5 border rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Email</label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="w-full px-3 py-2.5 border rounded-lg text-sm"
              />
            </div>
          </div>
        </div>

        {/* Locations */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
          <h2 className="text-base md:text-lg font-medium text-gray-800 mb-4">Localizações</h2>
          <div className="space-y-2 mb-4">
            {settings.locations.map((loc, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="flex-1 text-sm text-gray-700 bg-gray-50 px-3 py-2 rounded-lg truncate">
                  {loc}
                </span>
                <button
                  onClick={() => {
                    const locs = [...settings.locations];
                    locs.splice(i, 1);
                    setSettings({ ...settings, locations: locs });
                  }}
                  className="text-xs text-red-500 hover:text-red-700 px-2 py-1.5 flex-shrink-0"
                >
                  Remover
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newLocation}
              onChange={(e) => setNewLocation(e.target.value)}
              placeholder="Nova localização..."
              className="flex-1 px-3 py-2.5 border rounded-lg text-sm min-w-0"
            />
            <button
              onClick={() => {
                if (newLocation.trim()) {
                  setSettings({ ...settings, locations: [...settings.locations, newLocation.trim()] });
                  setNewLocation("");
                }
              }}
              className="bg-gray-100 px-3 py-2.5 rounded-lg text-sm hover:bg-gray-200 flex-shrink-0"
            >
              Adicionar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
