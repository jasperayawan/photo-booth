"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Code,
  Key,
  Send,
  Copy,
  Check,
  ChevronDown,
  ChevronRight,
  Zap,
  Lock,
  Globe,
} from "lucide-react";
import { APP_VERSION, API_CONFIG } from "@/data/premium";

interface Endpoint {
  method: "GET" | "POST";
  path: string;
  description: string;
  requiresAuth: boolean;
  params?: { name: string; type: string; required: boolean; description: string }[];
  body?: { name: string; type: string; required: boolean; description: string }[];
  response: string;
}

const ENDPOINTS: Endpoint[] = [
  {
    method: "GET",
    path: "/api/v1/filters",
    description: "Get list of available filters and frames based on your subscription tier",
    requiresAuth: true,
    response: `{
  "success": true,
  "tier": "business",
  "filters": [
    { "name": "None", "value": "none", "premium": false },
    { "name": "B&W", "value": "grayscale(100%)", "premium": false },
    { "name": "Vintage", "value": "sepia(100%) contrast(120%)", "premium": false }
  ],
  "frames": [
    { "name": "None", "style": "", "strokeColor": "", "premium": false },
    { "name": "Classic", "style": "border-8 border-white", "strokeColor": "#ffffff", "premium": false }
  ],
  "limits": {
    "filters": "unlimited",
    "frames": "unlimited"
  }
}`,
  },
  {
    method: "POST",
    path: "/api/v1/export",
    description: "Validate export parameters for generating a photo with filters",
    requiresAuth: true,
    body: [
      { name: "image", type: "string", required: true, description: "Base64 encoded image data" },
      { name: "filter", type: "string", required: false, description: "Filter name (default: None)" },
      { name: "frame", type: "string", required: false, description: "Frame name (default: None)" },
      { name: "text", type: "string", required: false, description: "Caption text" },
      { name: "mirror", type: "boolean", required: false, description: "Mirror the image (default: true)" },
    ],
    response: `{
  "success": true,
  "message": "Export parameters validated",
  "params": {
    "filter": "sepia(100%) contrast(120%)",
    "frame": { "name": "Classic", "strokeColor": "#ffffff" },
    "text": null,
    "mirror": true,
    "watermark": false
  }
}`,
  },
];

export default function ApiDocsPage() {
  const [isRevealed, setIsRevealed] = useState(false);
  const [apiKey, setApiKey] = useState("demo-api-key-12345");
  const [selectedEndpoint, setSelectedEndpoint] = useState<Endpoint>(ENDPOINTS[0]);
  const [response, setResponse] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>("authentication");

  useEffect(() => {
    const timer = setTimeout(() => setIsRevealed(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleTest = async () => {
    setIsLoading(true);
    setResponse("");

    try {
      const options: RequestInit = {
        method: selectedEndpoint.method,
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      };

      if (selectedEndpoint.method === "POST") {
        options.body = JSON.stringify({
          image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
          filter: "Vintage",
          frame: "Classic",
        });
      }

      const res = await fetch(selectedEndpoint.path, options);
      const data = await res.json();
      setResponse(JSON.stringify(data, null, 2));
    } catch (error) {
      setResponse(JSON.stringify({ error: "Request failed" }, null, 2));
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://photo-booth-jasper-dev.vercel.app/";
  const curlExample = selectedEndpoint.method === "GET"
    ? `curl -X GET "${baseUrl}${selectedEndpoint.path}" \\
  -H "Authorization: Bearer ${apiKey}"`
    : `curl -X POST "${baseUrl}${selectedEndpoint.path}" \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{"image": "base64...", "filter": "Vintage"}'`;

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-stone-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div className="flex items-center gap-2">
            <Code size={24} className="text-amber-400" />
            <h1 className="text-xl font-bold">API Documentation</h1>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/pricing"
            className="text-sm text-stone-400 hover:text-white transition-colors"
          >
            Pricing
          </Link>
          <span className="text-xs text-stone-500">v{APP_VERSION}</span>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 border-r border-white/10 p-4 min-h-[calc(100vh-65px)]">
          <nav className="space-y-2">
            {/* Authentication Section */}
            <button
              onClick={() => setExpandedSection(expandedSection === "authentication" ? null : "authentication")}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-left"
            >
              <div className="flex items-center gap-2">
                <Key size={16} className="text-amber-400" />
                <span className="text-sm font-medium">Authentication</span>
              </div>
              {expandedSection === "authentication" ? (
                <ChevronDown size={16} className="text-stone-500" />
              ) : (
                <ChevronRight size={16} className="text-stone-500" />
              )}
            </button>

            {/* Endpoints Section */}
            <div>
              <button
                onClick={() => setExpandedSection(expandedSection === "endpoints" ? null : "endpoints")}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-left"
              >
                <div className="flex items-center gap-2">
                  <Zap size={16} className="text-green-400" />
                  <span className="text-sm font-medium">Endpoints</span>
                </div>
                {expandedSection === "endpoints" ? (
                  <ChevronDown size={16} className="text-stone-500" />
                ) : (
                  <ChevronRight size={16} className="text-stone-500" />
                )}
              </button>

              {expandedSection === "endpoints" && (
                <div className="ml-4 mt-1 space-y-1">
                  {ENDPOINTS.map((endpoint) => (
                    <button
                      key={endpoint.path}
                      onClick={() => setSelectedEndpoint(endpoint)}
                      className={`
                        w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-sm transition-colors
                        ${selectedEndpoint.path === endpoint.path
                          ? "bg-amber-500/20 text-amber-400"
                          : "hover:bg-white/5 text-stone-400"}
                      `}
                    >
                      <span
                        className={`
                          text-xs font-mono px-1.5 py-0.5 rounded
                          ${endpoint.method === "GET" ? "bg-green-500/20 text-green-400" : "bg-blue-500/20 text-blue-400"}
                        `}
                      >
                        {endpoint.method}
                      </span>
                      <span className="truncate">{endpoint.path.split("/").pop()}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Rate Limits */}
            <button
              onClick={() => setExpandedSection(expandedSection === "limits" ? null : "limits")}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-left"
            >
              <div className="flex items-center gap-2">
                <Lock size={16} className="text-red-400" />
                <span className="text-sm font-medium">Rate Limits</span>
              </div>
              {expandedSection === "limits" ? (
                <ChevronDown size={16} className="text-stone-500" />
              ) : (
                <ChevronRight size={16} className="text-stone-500" />
              )}
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">
          {/* Authentication Section */}
          {expandedSection === "authentication" && (
            <section
              className={`
                transition-all duration-500
                ${isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
              `}
            >
              <h2 className="text-2xl font-bold mb-4">Authentication</h2>
              <p className="text-stone-400 mb-6">
                All API requests require authentication using a Bearer token in the Authorization header.
              </p>

              <div className="bg-white/5 rounded-xl p-6 mb-6">
                <h3 className="text-sm font-medium text-stone-400 mb-2">Your API Key</h3>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="flex-1 bg-black/30 border border-white/10 rounded-lg px-4 py-2 font-mono text-sm focus:outline-none focus:border-amber-500"
                  />
                  <button
                    onClick={() => copyToClipboard(apiKey)}
                    className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                  >
                    {copied ? <Check size={18} className="text-green-400" /> : <Copy size={18} />}
                  </button>
                </div>
                <p className="text-xs text-stone-500 mt-2">
                  Demo key for testing. Get your production key from the dashboard.
                </p>
              </div>

              <div className="bg-black/30 rounded-xl p-4 font-mono text-sm">
                <div className="text-stone-500 mb-2"># Example request header</div>
                <div className="text-green-400">
                  Authorization: Bearer {apiKey}
                </div>
              </div>
            </section>
          )}

          {/* Endpoints Section */}
          {expandedSection === "endpoints" && (
            <section
              className={`
                transition-all duration-500
                ${isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
              `}
            >
              <div className="flex items-center gap-3 mb-4">
                <span
                  className={`
                    text-xs font-mono px-2 py-1 rounded font-bold
                    ${selectedEndpoint.method === "GET"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-blue-500/20 text-blue-400"}
                  `}
                >
                  {selectedEndpoint.method}
                </span>
                <h2 className="text-xl font-mono">{selectedEndpoint.path}</h2>
                {selectedEndpoint.requiresAuth && (
                  <span className="flex items-center gap-1 text-xs text-amber-400 bg-amber-500/20 px-2 py-1 rounded">
                    <Lock size={12} />
                    Auth Required
                  </span>
                )}
              </div>

              <p className="text-stone-400 mb-6">{selectedEndpoint.description}</p>

              {/* Request Body */}
              {selectedEndpoint.body && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-stone-300 mb-3">Request Body</h3>
                  <div className="bg-white/5 rounded-xl overflow-hidden">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-left p-3 text-stone-400 font-medium">Parameter</th>
                          <th className="text-left p-3 text-stone-400 font-medium">Type</th>
                          <th className="text-left p-3 text-stone-400 font-medium">Required</th>
                          <th className="text-left p-3 text-stone-400 font-medium">Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedEndpoint.body.map((param) => (
                          <tr key={param.name} className="border-b border-white/5">
                            <td className="p-3 font-mono text-amber-400">{param.name}</td>
                            <td className="p-3 text-stone-400">{param.type}</td>
                            <td className="p-3">
                              {param.required ? (
                                <span className="text-green-400">Yes</span>
                              ) : (
                                <span className="text-stone-500">No</span>
                              )}
                            </td>
                            <td className="p-3 text-stone-400">{param.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* cURL Example */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-stone-300">cURL Example</h3>
                  <button
                    onClick={() => copyToClipboard(curlExample)}
                    className="text-xs text-stone-400 hover:text-white flex items-center gap-1"
                  >
                    <Copy size={12} />
                    Copy
                  </button>
                </div>
                <pre className="bg-black/30 rounded-xl p-4 font-mono text-sm text-green-400 overflow-x-auto">
                  {curlExample}
                </pre>
              </div>

              {/* Try It */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-stone-300 mb-3">Try It</h3>
                <button
                  onClick={handleTest}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-black rounded-lg font-medium hover:bg-amber-400 disabled:opacity-50 transition-colors cursor-pointer"
                >
                  <Send size={16} />
                  {isLoading ? "Sending..." : "Send Request"}
                </button>
              </div>

              {/* Response */}
              <div>
                <h3 className="text-sm font-medium text-stone-300 mb-3">
                  {response ? "Response" : "Example Response"}
                </h3>
                <pre className="bg-black/30 rounded-xl p-4 font-mono text-sm text-stone-300 overflow-x-auto max-h-96">
                  {response || selectedEndpoint.response}
                </pre>
              </div>
            </section>
          )}

          {/* Rate Limits Section */}
          {expandedSection === "limits" && (
            <section
              className={`
                transition-all duration-500
                ${isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
              `}
            >
              <h2 className="text-2xl font-bold mb-4">Rate Limits</h2>
              <p className="text-stone-400 mb-6">
                API rate limits vary by subscription tier. Limits reset daily at midnight UTC.
              </p>

              <div className="grid md:grid-cols-3 gap-4 mb-8">
                {Object.entries(API_CONFIG.rateLimit).map(([tier, limit]) => (
                  <div key={tier} className="bg-white/5 rounded-xl p-4">
                    <h3 className="text-lg font-semibold capitalize mb-1">{tier}</h3>
                    <p className="text-3xl font-bold text-amber-400">{limit.toLocaleString()}</p>
                    <p className="text-sm text-stone-500">requests/day</p>
                  </div>
                ))}
              </div>

              <div className="bg-white/5 rounded-xl p-6">
                <h3 className="font-medium mb-4">Rate Limit Headers</h3>
                <div className="space-y-3 font-mono text-sm">
                  <div className="flex items-start gap-4">
                    <span className="text-amber-400">X-RateLimit-Limit</span>
                    <span className="text-stone-400">Maximum requests allowed per day</span>
                  </div>
                  <div className="flex items-start gap-4">
                    <span className="text-amber-400">X-RateLimit-Remaining</span>
                    <span className="text-stone-400">Requests remaining in current period</span>
                  </div>
                  <div className="flex items-start gap-4">
                    <span className="text-amber-400">X-RateLimit-Reset</span>
                    <span className="text-stone-400">ISO timestamp when limits reset</span>
                  </div>
                </div>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
