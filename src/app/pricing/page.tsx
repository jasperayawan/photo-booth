"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Check,
  X,
  Camera,
  Sparkles,
  Building2,
  ArrowLeft,
  Crown,
  Zap,
  Printer,
  Code,
  Palette,
} from "lucide-react";
import { TIERS, APP_VERSION, type TierType } from "@/data/premium";

export default function PricingPage() {
  const [isRevealed, setIsRevealed] = useState(false);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  useEffect(() => {
    const timer = setTimeout(() => setIsRevealed(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const yearlyDiscount = 0.2; // 20% off for yearly

  const getPrice = (monthlyPrice: number) => {
    if (billingCycle === "yearly") {
      return (monthlyPrice * 12 * (1 - yearlyDiscount)).toFixed(2);
    }
    return monthlyPrice.toFixed(2);
  };

  const tiers: { key: TierType; icon: typeof Camera; color: string; popular?: boolean }[] = [
    { key: "free", icon: Camera, color: "stone" },
    { key: "pro", icon: Sparkles, color: "amber", popular: true },
    { key: "business", icon: Building2, color: "indigo" },
  ];

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
        <header className="flex items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-stone-600 hover:text-stone-800 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="text-sm font-medium">Back</span>
          </Link>
          <span className="text-xs text-stone-400">v{APP_VERSION}</span>
        </header>

        {/* Main Content */}
        <main className="px-6 pb-16">
          {/* Hero */}
          <div
            className={`
              text-center max-w-2xl mx-auto mb-12
              transition-all duration-700 ease-out
              ${isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
            `}
          >
            <h1 className="text-4xl lg:text-5xl font-bold text-stone-800 mb-4">
              Choose Your Plan
            </h1>
            <p className="text-stone-500 text-lg">
              Unlock premium features and take your photo booth experience to the next level
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <span
                className={`text-sm font-medium ${
                  billingCycle === "monthly" ? "text-stone-800" : "text-stone-400"
                }`}
              >
                Monthly
              </span>
              <button
                onClick={() =>
                  setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")
                }
                className={`
                  relative w-14 h-7 rounded-full transition-colors cursor-pointer
                  ${billingCycle === "yearly" ? "bg-amber-500" : "bg-stone-300"}
                `}
              >
                <div
                  className={`
                    absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-transform
                    ${billingCycle === "yearly" ? "translate-x-8" : "translate-x-1"}
                  `}
                />
              </button>
              <span
                className={`text-sm font-medium ${
                  billingCycle === "yearly" ? "text-stone-800" : "text-stone-400"
                }`}
              >
                Yearly
                <span className="ml-1 text-xs text-amber-600 font-semibold">-20%</span>
              </span>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {tiers.map((tier, index) => {
              const config = TIERS[tier.key];
              const Icon = tier.icon;

              return (
                <div
                  key={tier.key}
                  className={`
                    relative bg-white rounded-2xl shadow-xl overflow-hidden
                    transition-all duration-500 ease-out
                    ${isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
                    ${tier.popular ? "ring-2 ring-amber-400 scale-105 md:scale-110 z-10" : ""}
                  `}
                  style={{ transitionDelay: `${150 + index * 100}ms` }}
                >
                  {/* Popular Badge */}
                  {tier.popular && (
                    <div className="absolute top-0 left-0 right-0 bg-amber-400 text-amber-900 text-xs font-bold py-1 text-center">
                      MOST POPULAR
                    </div>
                  )}

                  <div className={`p-6 ${tier.popular ? "pt-10" : ""}`}>
                    {/* Icon & Name */}
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className={`
                          w-12 h-12 rounded-xl flex items-center justify-center
                          ${tier.key === "free" ? "bg-stone-100" : ""}
                          ${tier.key === "pro" ? "bg-amber-100" : ""}
                          ${tier.key === "business" ? "bg-indigo-100" : ""}
                        `}
                      >
                        <Icon
                          size={24}
                          className={`
                            ${tier.key === "free" ? "text-stone-600" : ""}
                            ${tier.key === "pro" ? "text-amber-600" : ""}
                            ${tier.key === "business" ? "text-indigo-600" : ""}
                          `}
                        />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-stone-800">{config.name}</h3>
                        <p className="text-xs text-stone-400">
                          {tier.key === "free" && "For casual users"}
                          {tier.key === "pro" && "For enthusiasts"}
                          {tier.key === "business" && "For businesses"}
                        </p>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="mb-6">
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-bold text-stone-800">
                          ${config.price === 0 ? "0" : getPrice(config.price)}
                        </span>
                        {config.price > 0 && (
                          <span className="text-stone-400 text-sm">
                            /{billingCycle === "yearly" ? "year" : "month"}
                          </span>
                        )}
                      </div>
                      {billingCycle === "yearly" && config.price > 0 && (
                        <p className="text-xs text-stone-400 mt-1">
                          ${(config.price * 12).toFixed(2)}/year → Save $
                          {(config.price * 12 * yearlyDiscount).toFixed(2)}
                        </p>
                      )}
                    </div>

                    {/* CTA Button */}
                    <button
                      className={`
                        w-full py-3 rounded-xl font-semibold transition-all cursor-pointer
                        ${tier.key === "free"
                          ? "bg-stone-100 text-stone-600 hover:bg-stone-200"
                          : tier.key === "pro"
                            ? "bg-amber-500 text-white hover:bg-amber-600 shadow-lg shadow-amber-500/30"
                            : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-600/30"}
                      `}
                    >
                      {tier.key === "free" ? "Current Plan" : "Upgrade Now"}
                    </button>

                    {/* Features */}
                    <ul className="mt-6 space-y-3">
                      {config.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-stone-600">
                          <Check size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Feature Comparison */}
          <div
            className={`
              mt-16 max-w-4xl mx-auto
              transition-all duration-700 ease-out delay-500
              ${isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
            `}
          >
            <h2 className="text-2xl font-bold text-stone-800 text-center mb-8">
              Feature Comparison
            </h2>

            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-stone-100">
                    <th className="text-left p-4 text-stone-600 font-medium">Feature</th>
                    <th className="p-4 text-center text-stone-600 font-medium">Free</th>
                    <th className="p-4 text-center text-amber-600 font-medium bg-amber-50">Pro</th>
                    <th className="p-4 text-center text-indigo-600 font-medium">Business</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { feature: "Filters", free: "5", pro: "All 15+", business: "All + Custom" },
                    { feature: "Frames", free: "3", pro: "All 11+", business: "All + Custom" },
                    { feature: "Daily Exports", free: "10", pro: "Unlimited", business: "Unlimited" },
                    { feature: "Watermark", free: true, pro: false, business: false },
                    { feature: "Embed Widget", free: false, pro: true, business: true },
                    { feature: "API Access", free: false, pro: false, business: true },
                    { feature: "White Label", free: false, pro: false, business: true },
                    { feature: "Print Discount", free: "0%", pro: "10%", business: "20%" },
                    { feature: "Support", free: "Community", pro: "Priority", business: "Dedicated" },
                  ].map((row, i) => (
                    <tr key={i} className="border-b border-stone-50 last:border-0">
                      <td className="p-4 text-stone-700 font-medium">{row.feature}</td>
                      <td className="p-4 text-center">
                        {typeof row.free === "boolean" ? (
                          row.free ? (
                            <Check size={18} className="text-green-500 mx-auto" />
                          ) : (
                            <X size={18} className="text-stone-300 mx-auto" />
                          )
                        ) : (
                          <span className="text-stone-600">{row.free}</span>
                        )}
                      </td>
                      <td className="p-4 text-center bg-amber-50/50">
                        {typeof row.pro === "boolean" ? (
                          row.pro ? (
                            <Check size={18} className="text-green-500 mx-auto" />
                          ) : (
                            <X size={18} className="text-stone-300 mx-auto" />
                          )
                        ) : (
                          <span className="text-stone-600 font-medium">{row.pro}</span>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        {typeof row.business === "boolean" ? (
                          row.business ? (
                            <Check size={18} className="text-green-500 mx-auto" />
                          ) : (
                            <X size={18} className="text-stone-300 mx-auto" />
                          )
                        ) : (
                          <span className="text-stone-600 font-medium">{row.business}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* FAQ or CTA */}
          <div
            className={`
              mt-16 text-center
              transition-all duration-700 ease-out delay-700
              ${isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
            `}
          >
            <p className="text-stone-500 mb-4">
              Have questions? Check our{" "}
              <Link href="/api-docs" className="text-amber-600 hover:underline">
                API Documentation
              </Link>
            </p>
            <Link
              href="/photo-booth"
              className="inline-flex items-center gap-2 px-6 py-3 bg-stone-700 text-white rounded-full font-medium hover:bg-stone-800 transition-colors"
            >
              <Camera size={18} />
              Try Photo Booth Free
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
