"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Code,
  Copy,
  Check,
  Monitor,
  Smartphone,
  Moon,
  Sun,
  Play,
  ExternalLink,
  Sparkles,
  Building2,
  Camera,
} from "lucide-react";
import { APP_VERSION } from "@/data/premium";

export default function EmbedDocsPage() {
  const [isRevealed, setIsRevealed] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");

  // Configurator state
  const [config, setConfig] = useState({
    theme: "light",
    brand: "Photo Booth",
    filter: "None",
    frame: "Classic",
    controls: true,
  });

  useEffect(() => {
    const timer = setTimeout(() => setIsRevealed(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const embedUrl = `/embed?theme=${config.theme}&brand=${encodeURIComponent(config.brand)}&filter=${config.filter}&frame=${config.frame}&controls=${config.controls}`;

  const scriptCode = `<!-- Photo Booth Embed Widget -->
<script src="${typeof window !== "undefined" ? window.location.origin : "https://photobooth.app"}/embed.js"></script>
<div id="photobooth-widget"
     data-theme="${config.theme}"
     data-brand="${config.brand}"
     data-filter="${config.filter}"
     data-frame="${config.frame}"
     data-controls="${config.controls}">
</div>`;

  const iframeCode = `<iframe
  src="${typeof window !== "undefined" ? window.location.origin : "https://photobooth.app"}${embedUrl}"
  width="100%"
  height="600"
  style="border: none; border-radius: 12px;"
  allow="camera; microphone"
  title="${config.brand}">
</iframe>`;

  return (
    <div className="min-h-screen bg-[#d4c4b5] relative overflow-hidden">
      {/* Background */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(135deg, #d9cec0 0%, #c9b8a8 50%, #d4c4b5 100%)`,
        }}
      />
      <div
        className="fixed inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 min-h-screen">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-stone-300/30">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-stone-600 hover:text-stone-800 transition-colors"
            >
              <ArrowLeft size={20} />
            </Link>
            <div className="flex items-center gap-2">
              <Code size={24} className="text-stone-600" />
              <h1 className="text-xl font-bold text-stone-800">Embed Documentation</h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/pricing"
              className="text-sm text-stone-500 hover:text-stone-700 transition-colors"
            >
              Pricing
            </Link>
            <span className="text-xs text-stone-400">v{APP_VERSION}</span>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-6 py-8">
          {/* Hero */}
          <section
            className={`
              text-center mb-12
              transition-all duration-700 ease-out
              ${isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
            `}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-stone-800 mb-4">
              Add Photo Booth to Your Website
            </h2>
            <p className="text-stone-500 text-lg max-w-2xl mx-auto">
              Embed our photo booth widget on any website with just a few lines of code.
              Perfect for events, portfolios, and interactive experiences.
            </p>
          </section>

          {/* Use Cases */}
          <section
            className={`
              grid md:grid-cols-3 gap-4 mb-12
              transition-all duration-700 ease-out delay-100
              ${isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
            `}
          >
            {[
              { icon: Sparkles, title: "Events", desc: "Weddings, parties, corporate events" },
              { icon: Camera, title: "Photographers", desc: "Portfolio sites, client galleries" },
              { icon: Building2, title: "Businesses", desc: "Product launches, marketing campaigns" },
            ].map((item, i) => (
              <div key={i} className="bg-white/60 backdrop-blur-sm rounded-xl p-5 text-center">
                <item.icon size={28} className="text-stone-600 mx-auto mb-3" />
                <h3 className="font-semibold text-stone-800 mb-1">{item.title}</h3>
                <p className="text-sm text-stone-500">{item.desc}</p>
              </div>
            ))}
          </section>

          {/* Configurator & Preview */}
          <section
            className={`
              grid lg:grid-cols-2 gap-8 mb-12
              transition-all duration-700 ease-out delay-200
              ${isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
            `}
          >
            {/* Configurator */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-lg font-bold text-stone-800 mb-6 flex items-center gap-2">
                <Sparkles size={20} className="text-amber-500" />
                Customize Your Widget
              </h3>

              <div className="space-y-5">
                {/* Theme */}
                <div>
                  <label className="text-sm font-medium text-stone-600 mb-2 block">Theme</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setConfig({ ...config, theme: "light" })}
                      className={`
                        flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border transition-all cursor-pointer
                        ${config.theme === "light"
                          ? "border-stone-700 bg-stone-700 text-white"
                          : "border-stone-200 hover:border-stone-300"}
                      `}
                    >
                      <Sun size={16} />
                      Light
                    </button>
                    <button
                      onClick={() => setConfig({ ...config, theme: "dark" })}
                      className={`
                        flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border transition-all cursor-pointer
                        ${config.theme === "dark"
                          ? "border-stone-700 bg-stone-700 text-white"
                          : "border-stone-200 hover:border-stone-300"}
                      `}
                    >
                      <Moon size={16} />
                      Dark
                    </button>
                  </div>
                </div>

                {/* Brand Name */}
                <div>
                  <label className="text-sm font-medium text-stone-600 mb-2 block">Brand Name</label>
                  <input
                    type="text"
                    value={config.brand}
                    onChange={(e) => setConfig({ ...config, brand: e.target.value })}
                    placeholder="Your Brand"
                    className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-transparent"
                  />
                </div>

                {/* Default Filter */}
                <div>
                  <label className="text-sm font-medium text-stone-600 mb-2 block">Default Filter</label>
                  <select
                    value={config.filter}
                    onChange={(e) => setConfig({ ...config, filter: e.target.value })}
                    className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-transparent"
                  >
                    {["None", "B&W", "Vintage", "Warm", "Golden", "Cool"].map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>

                {/* Default Frame */}
                <div>
                  <label className="text-sm font-medium text-stone-600 mb-2 block">Default Frame</label>
                  <select
                    value={config.frame}
                    onChange={(e) => setConfig({ ...config, frame: e.target.value })}
                    className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-transparent"
                  >
                    {["None", "Classic", "Black", "Pink", "Polaroid"].map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>

                {/* Show Controls */}
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-stone-600">Show Controls</label>
                  <button
                    onClick={() => setConfig({ ...config, controls: !config.controls })}
                    className={`
                      relative w-12 h-6 rounded-full transition-colors cursor-pointer
                      ${config.controls ? "bg-stone-700" : "bg-stone-300"}
                    `}
                  >
                    <div
                      className={`
                        absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform
                        ${config.controls ? "translate-x-7" : "translate-x-1"}
                      `}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-stone-800 flex items-center gap-2">
                  <Play size={20} className="text-green-500" />
                  Live Preview
                </h3>
                <div className="flex items-center gap-1 bg-stone-100 rounded-lg p-1">
                  <button
                    onClick={() => setPreviewDevice("desktop")}
                    className={`p-1.5 rounded transition-colors cursor-pointer ${
                      previewDevice === "desktop" ? "bg-white shadow" : ""
                    }`}
                  >
                    <Monitor size={16} />
                  </button>
                  <button
                    onClick={() => setPreviewDevice("mobile")}
                    className={`p-1.5 rounded transition-colors cursor-pointer ${
                      previewDevice === "mobile" ? "bg-white shadow" : ""
                    }`}
                  >
                    <Smartphone size={16} />
                  </button>
                </div>
              </div>

              <div
                className={`
                  mx-auto bg-stone-100 rounded-xl overflow-hidden transition-all
                  ${previewDevice === "desktop" ? "w-full" : "w-[280px]"}
                `}
                style={{ height: previewDevice === "desktop" ? "400px" : "500px" }}
              >
                <iframe
                  src={embedUrl}
                  className="w-full h-full"
                  allow="camera; microphone"
                  title="Preview"
                />
              </div>

              <div className="mt-4 flex justify-center">
                <a
                  href={embedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-stone-500 hover:text-stone-700 transition-colors"
                >
                  Open in new tab
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          </section>

          {/* Code Examples */}
          <section
            className={`
              mb-12
              transition-all duration-700 ease-out delay-300
              ${isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
            `}
          >
            <h3 className="text-2xl font-bold text-stone-800 mb-6 text-center">
              Integration Code
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Script Method */}
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 bg-stone-50 border-b border-stone-100">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    <span className="text-sm font-medium text-stone-700">Method 1: Script (Recommended)</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(scriptCode, "script")}
                    className="flex items-center gap-1 text-xs text-stone-500 hover:text-stone-700 cursor-pointer"
                  >
                    {copied === "script" ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                    {copied === "script" ? "Copied!" : "Copy"}
                  </button>
                </div>
                <pre className="p-4 text-sm font-mono text-stone-700 overflow-x-auto bg-stone-900 text-stone-300">
                  <code>{scriptCode}</code>
                </pre>
              </div>

              {/* iFrame Method */}
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 bg-stone-50 border-b border-stone-100">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                    <span className="text-sm font-medium text-stone-700">Method 2: iFrame</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(iframeCode, "iframe")}
                    className="flex items-center gap-1 text-xs text-stone-500 hover:text-stone-700 cursor-pointer"
                  >
                    {copied === "iframe" ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                    {copied === "iframe" ? "Copied!" : "Copy"}
                  </button>
                </div>
                <pre className="p-4 text-sm font-mono text-stone-700 overflow-x-auto bg-stone-900 text-stone-300">
                  <code>{iframeCode}</code>
                </pre>
              </div>
            </div>
          </section>

          {/* Parameters Table */}
          <section
            className={`
              mb-12
              transition-all duration-700 ease-out delay-400
              ${isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
            `}
          >
            <h3 className="text-2xl font-bold text-stone-800 mb-6 text-center">
              Configuration Options
            </h3>

            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-100">
                    <th className="text-left p-4 text-stone-600 font-medium">Parameter</th>
                    <th className="text-left p-4 text-stone-600 font-medium">Type</th>
                    <th className="text-left p-4 text-stone-600 font-medium">Default</th>
                    <th className="text-left p-4 text-stone-600 font-medium">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { param: "theme", type: "string", default: '"light"', desc: '"light" or "dark" color scheme' },
                    { param: "brand", type: "string", default: '"Photo Booth"', desc: "Custom title displayed in header" },
                    { param: "filter", type: "string", default: '"None"', desc: "Default filter (None, B&W, Vintage, etc.)" },
                    { param: "frame", type: "string", default: '"Classic"', desc: "Default frame (None, Classic, Black, etc.)" },
                    { param: "controls", type: "boolean", default: "true", desc: "Show/hide filter buttons and controls" },
                    { param: "width", type: "string", default: '"100%"', desc: "Widget width (script method only)" },
                    { param: "height", type: "string", default: '"600px"', desc: "Widget height (script method only)" },
                  ].map((row, i) => (
                    <tr key={i} className="border-b border-stone-50 last:border-0">
                      <td className="p-4 font-mono text-amber-600">{row.param}</td>
                      <td className="p-4 text-stone-500">{row.type}</td>
                      <td className="p-4 font-mono text-stone-400 text-sm">{row.default}</td>
                      <td className="p-4 text-stone-600">{row.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Events */}
          <section
            className={`
              mb-12
              transition-all duration-700 ease-out delay-500
              ${isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
            `}
          >
            <h3 className="text-2xl font-bold text-stone-800 mb-6 text-center">
              JavaScript Events
            </h3>

            <div className="bg-white rounded-2xl shadow-xl p-6">
              <p className="text-stone-500 mb-4">
                Listen for events from the embedded photo booth:
              </p>

              <pre className="p-4 rounded-xl bg-stone-900 text-stone-300 font-mono text-sm overflow-x-auto">
{`// Listen for photo downloads
const widget = document.getElementById('photobooth-widget');

widget.addEventListener('photobooth:download', (event) => {
  console.log('Photo downloaded!');
  console.log('Image URL:', event.detail.imageUrl);

  // Send to your server, show in gallery, etc.
});`}
              </pre>
            </div>
          </section>

          {/* Pricing Note */}
          <section
            className={`
              text-center
              transition-all duration-700 ease-out delay-600
              ${isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
            `}
          >
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-8 border border-amber-200/50">
              <h3 className="text-xl font-bold text-stone-800 mb-2">
                Embed Access Requires Pro or Business Plan
              </h3>
              <p className="text-stone-500 mb-4">
                Upgrade to unlock the embed widget for your websites and applications.
              </p>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 text-white rounded-full font-medium hover:bg-amber-600 transition-colors"
              >
                View Pricing
                <ExternalLink size={16} />
              </Link>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
