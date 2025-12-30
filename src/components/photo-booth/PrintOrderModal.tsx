"use client";

import { useState, useEffect } from "react";
import { X, Printer, Package, Truck, CreditCard, Check, ChevronLeft, ChevronRight } from "lucide-react";
import {
  getProducts,
  getShippingRates,
  calculateOrderTotal,
  validateAddress,
  getSupportedCountries,
  createPrintOrder,
  type ShippingAddress,
  type PrintOrderItem,
  type ShippingRate,
} from "@/lib/printful";
import { PRINT_PRODUCTS } from "@/data/premium";

interface PrintOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageDataUrl: string;
}

type Step = "product" | "shipping" | "payment" | "confirmation";

export default function PrintOrderModal({
  isOpen,
  onClose,
  imageDataUrl,
}: PrintOrderModalProps) {
  const [step, setStep] = useState<Step>("product");
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // Product selection
  const [selectedProduct, setSelectedProduct] = useState(PRINT_PRODUCTS[0].id);
  const [selectedSize, setSelectedSize] = useState(PRINT_PRODUCTS[0].sizes[0].id);
  const [quantity, setQuantity] = useState(1);

  // Shipping
  const [address, setAddress] = useState<Partial<ShippingAddress>>({
    countryCode: "US",
  });
  const [shippingRates, setShippingRates] = useState<ShippingRate[]>([]);
  const [selectedShipping, setSelectedShipping] = useState<string>("");
  const [addressErrors, setAddressErrors] = useState<string[]>([]);

  // Order
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderId, setOrderId] = useState<string>("");
  const [orderError, setOrderError] = useState<string>("");

  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => setIsVisible(true));
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setIsVisible(false);
    setTimeout(() => {
      onClose();
      // Reset state
      setStep("product");
      setIsClosing(false);
      setOrderId("");
      setOrderError("");
    }, 200);
  };

  const product = PRINT_PRODUCTS.find((p) => p.id === selectedProduct);
  const size = product?.sizes.find((s) => s.id === selectedSize);
  const shippingRate = shippingRates.find((r) => r.id === selectedShipping);

  const orderItem: PrintOrderItem = {
    productId: selectedProduct,
    sizeId: selectedSize,
    quantity,
    imageUrl: imageDataUrl,
  };

  const totals = calculateOrderTotal(
    [orderItem],
    shippingRate?.rate || 0,
    0 // TODO: Apply discount based on tier
  );

  const handleNextStep = async () => {
    if (step === "product") {
      setStep("shipping");
    } else if (step === "shipping") {
      const validation = validateAddress(address);
      if (!validation.valid) {
        setAddressErrors(validation.errors);
        return;
      }
      setAddressErrors([]);

      // Fetch shipping rates
      const rates = await getShippingRates(address as ShippingAddress, [orderItem]);
      setShippingRates(rates);
      if (rates.length > 0) {
        setSelectedShipping(rates[0].id);
      }
      setStep("payment");
    } else if (step === "payment") {
      setIsProcessing(true);
      setOrderError("");

      try {
        const result = await createPrintOrder(
          {
            items: [orderItem],
            shipping: address as ShippingAddress,
          },
          "mock-payment-token" // In production, use Stripe/PayPal token
        );

        if (result.success) {
          setOrderId(result.orderId || "");
          setStep("confirmation");
        } else {
          setOrderError(result.error || "Failed to process order");
        }
      } catch {
        setOrderError("An unexpected error occurred");
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handlePrevStep = () => {
    if (step === "shipping") setStep("product");
    else if (step === "payment") setStep("shipping");
  };

  if (!isOpen) return null;

  return (
    <div
      className={`
        fixed inset-0 z-50 flex items-center justify-center px-4
        transition-all duration-300 ease-out
        ${isVisible ? "bg-black/50 backdrop-blur-sm" : "bg-transparent"}
      `}
      onClick={handleClose}
    >
      <div
        className={`
          relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden
          transition-all duration-300 ease-out
          ${isVisible && !isClosing
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-4"}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
          <div className="flex items-center gap-3">
            <Printer size={20} className="text-stone-600" />
            <h2 className="text-lg font-semibold text-stone-800">Order Print</h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X size={20} className="text-stone-500" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 py-4 bg-stone-50">
          {(["product", "shipping", "payment", "confirmation"] as Step[]).map((s, i) => (
            <div key={s} className="flex items-center">
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                  ${step === s ? "bg-stone-700 text-white" : ""}
                  ${["product", "shipping", "payment", "confirmation"].indexOf(step) > i
                    ? "bg-green-500 text-white"
                    : ""}
                  ${["product", "shipping", "payment", "confirmation"].indexOf(step) < i
                    ? "bg-stone-200 text-stone-400"
                    : ""}
                `}
              >
                {["product", "shipping", "payment", "confirmation"].indexOf(step) > i ? (
                  <Check size={16} />
                ) : (
                  i + 1
                )}
              </div>
              {i < 3 && <div className="w-8 h-0.5 bg-stone-200 mx-1" />}
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {/* Step 1: Product Selection */}
          {step === "product" && (
            <div className="space-y-4">
              <div className="flex gap-4">
                {/* Preview */}
                <div className="w-32 h-40 bg-stone-100 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={imageDataUrl}
                    alt="Print preview"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Product Options */}
                <div className="flex-1 space-y-3">
                  <div>
                    <label className="text-sm font-medium text-stone-600">Product</label>
                    <select
                      value={selectedProduct}
                      onChange={(e) => {
                        setSelectedProduct(e.target.value);
                        const newProduct = PRINT_PRODUCTS.find((p) => p.id === e.target.value);
                        if (newProduct) setSelectedSize(newProduct.sizes[0].id);
                      }}
                      className="w-full mt-1 px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-transparent"
                    >
                      {PRINT_PRODUCTS.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-stone-600">Size</label>
                    <select
                      value={selectedSize}
                      onChange={(e) => setSelectedSize(e.target.value)}
                      className="w-full mt-1 px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-transparent"
                    >
                      {product?.sizes.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.label} ({s.dimensions}) - ${s.price.toFixed(2)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-stone-600">Quantity</label>
                    <div className="flex items-center gap-2 mt-1">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-8 h-8 rounded-lg border border-stone-200 flex items-center justify-center hover:bg-stone-50 cursor-pointer"
                      >
                        -
                      </button>
                      <span className="w-12 text-center font-medium">{quantity}</span>
                      <button
                        onClick={() => setQuantity(Math.min(10, quantity + 1))}
                        className="w-8 h-8 rounded-lg border border-stone-200 flex items-center justify-center hover:bg-stone-50 cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-stone-100">
                <div className="flex justify-between text-sm">
                  <span className="text-stone-500">Subtotal</span>
                  <span className="font-medium">${totals.subtotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Shipping */}
          {step === "shipping" && (
            <div className="space-y-4">
              {addressErrors.length > 0 && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <ul className="text-sm text-red-600 list-disc list-inside">
                    {addressErrors.map((e, i) => (
                      <li key={i}>{e}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="text-sm font-medium text-stone-600">Full Name</label>
                  <input
                    type="text"
                    value={address.name || ""}
                    onChange={(e) => setAddress({ ...address, name: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-transparent"
                    placeholder="John Doe"
                  />
                </div>

                <div className="col-span-2">
                  <label className="text-sm font-medium text-stone-600">Email</label>
                  <input
                    type="email"
                    value={address.email || ""}
                    onChange={(e) => setAddress({ ...address, email: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-transparent"
                    placeholder="john@example.com"
                  />
                </div>

                <div className="col-span-2">
                  <label className="text-sm font-medium text-stone-600">Address</label>
                  <input
                    type="text"
                    value={address.address1 || ""}
                    onChange={(e) => setAddress({ ...address, address1: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-transparent"
                    placeholder="123 Main St"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-stone-600">City</label>
                  <input
                    type="text"
                    value={address.city || ""}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-stone-600">State/Province</label>
                  <input
                    type="text"
                    value={address.stateCode || ""}
                    onChange={(e) => setAddress({ ...address, stateCode: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-stone-600">ZIP/Postal Code</label>
                  <input
                    type="text"
                    value={address.zip || ""}
                    onChange={(e) => setAddress({ ...address, zip: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-stone-600">Country</label>
                  <select
                    value={address.countryCode || "US"}
                    onChange={(e) => setAddress({ ...address, countryCode: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-transparent"
                  >
                    {getSupportedCountries().map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Payment */}
          {step === "payment" && (
            <div className="space-y-4">
              {/* Shipping Options */}
              <div>
                <label className="text-sm font-medium text-stone-600 flex items-center gap-2">
                  <Truck size={16} />
                  Shipping Method
                </label>
                <div className="mt-2 space-y-2">
                  {shippingRates.map((rate) => (
                    <label
                      key={rate.id}
                      className={`
                        flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors
                        ${selectedShipping === rate.id ? "border-stone-700 bg-stone-50" : "border-stone-200 hover:bg-stone-50"}
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="shipping"
                          value={rate.id}
                          checked={selectedShipping === rate.id}
                          onChange={(e) => setSelectedShipping(e.target.value)}
                          className="w-4 h-4"
                        />
                        <div>
                          <p className="font-medium text-stone-700">{rate.name}</p>
                          <p className="text-xs text-stone-500">{rate.estimatedDays}</p>
                        </div>
                      </div>
                      <span className="font-medium">${rate.rate.toFixed(2)}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="pt-4 border-t border-stone-100 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-stone-500">Subtotal</span>
                  <span>${totals.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stone-500">Shipping</span>
                  <span>${totals.shipping.toFixed(2)}</span>
                </div>
                {totals.discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount</span>
                    <span>-${totals.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-semibold pt-2 border-t border-stone-100">
                  <span>Total</span>
                  <span>${totals.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Payment (Mock) */}
              <div className="p-4 bg-stone-50 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-stone-600">
                  <CreditCard size={16} />
                  <span>Payment will be processed securely via Stripe</span>
                </div>
                <p className="mt-2 text-xs text-stone-400">
                  Demo mode: No actual payment will be processed
                </p>
              </div>

              {orderError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                  {orderError}
                </div>
              )}
            </div>
          )}

          {/* Step 4: Confirmation */}
          {step === "confirmation" && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check size={32} className="text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-stone-800">Order Confirmed!</h3>
              <p className="mt-2 text-stone-500">
                Your order <span className="font-mono font-medium">{orderId}</span> has been placed.
              </p>
              <p className="mt-4 text-sm text-stone-400">
                You will receive an email confirmation with tracking information.
              </p>

              <div className="mt-6 p-4 bg-stone-50 rounded-lg text-left">
                <div className="flex items-center gap-2 text-sm text-stone-600">
                  <Package size={16} />
                  <span>Estimated delivery: 7-14 business days</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-stone-100 bg-stone-50">
          {step !== "confirmation" ? (
            <>
              <button
                onClick={handlePrevStep}
                disabled={step === "product"}
                className={`
                  flex items-center gap-1 px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer
                  ${step === "product"
                    ? "text-stone-300 cursor-not-allowed"
                    : "text-stone-600 hover:bg-stone-100"}
                `}
              >
                <ChevronLeft size={16} />
                Back
              </button>

              <button
                onClick={handleNextStep}
                disabled={isProcessing}
                className="
                  flex items-center gap-2 px-6 py-2 rounded-lg font-medium
                  bg-stone-700 text-white hover:bg-stone-800
                  disabled:bg-stone-300 disabled:cursor-not-allowed
                  transition-colors cursor-pointer
                "
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </>
                ) : step === "payment" ? (
                  <>
                    <CreditCard size={16} />
                    Place Order
                  </>
                ) : (
                  <>
                    Continue
                    <ChevronRight size={16} />
                  </>
                )}
              </button>
            </>
          ) : (
            <button
              onClick={handleClose}
              className="
                w-full px-6 py-2 rounded-lg font-medium
                bg-stone-700 text-white hover:bg-stone-800
                transition-colors cursor-pointer
              "
            >
              Done
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
