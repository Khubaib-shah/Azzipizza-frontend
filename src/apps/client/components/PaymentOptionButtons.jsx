import { useEffect, useState } from "react";
import QrCodeModal from "./Modal/QrCodeModal";
import { CreditCard, Banknote, Smartphone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
export function PaymentModal({ isSubmitting, handleOrderSubmit, totalPrice }) {
  const [paymentMethod, setPaymentMethod] = useState("");
  const [qrCodeModal, setQrCodeModal] = useState(false);

  const paymentOptions = [
    { value: "cash", label: "Cash", icon: Banknote },
    { value: "scan", label: "Satispay", icon: Smartphone },
    { value: "bancomat", label: "Card", icon: CreditCard },
    { value: "paypal", label: "Online", icon: CreditCard },
  ];

  console.log('handleOrderSubmit', handleOrderSubmit)
  useEffect(() => {
    if (paymentMethod === "scan") {
      setQrCodeModal(true);
    } else {
      setQrCodeModal(false);
    }
  }, [paymentMethod]);
  console.log('paymentMethod', paymentMethod)

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="grid grid-cols-4 gap-2">
        {paymentOptions.map((option) => {
          const Icon = option.icon;
          const isSelected = paymentMethod === option.value;
          return (
            <button
              key={option.value}
              onClick={() => setPaymentMethod(option.value)}
              disabled={isSubmitting}
              className={`flex flex-col items-center justify-center rounded-2xl border-2 transition-all duration-200 relative cursor-pointer h-20 overflow-hidden ${isSelected
                ? "border-orange-500 bg-white text-slate-800 shadow-sm outline-2 outline-offset-2 outline-orange-400/30"
                : "border-gray-100 bg-white text-gray-500 hover:border-gray-200 hover:bg-gray-50"
                } ${option.value === "scan" ? "p-0" : "p-3"}`}
              title={option.label}
            >
              {option.value === "scan" ? (
                <>
                  {/* Mobile View */}
                  <div className="flex sm:hidden flex-col items-center justify-center w-full h-full p-3">
                    <Icon size={20} className={`mb-2 ${isSelected ? 'text-red-500' : "text-gray-400"}`} />
                    <span className={`font-bold text-[10px] leading-tight ${isSelected ? "text-slate-800" : "text-slate-700"}`}>{option.label}</span>
                  </div>
                  {/* Desktop View */}
                  <div className="hidden sm:flex w-full h-full items-center justify-center relative bg-white">
                    {isSelected && qrCodeModal ? (
                      <div className="w-full h-full bg-orange-50/50" />
                    ) : (
                      <motion.img 
                        layoutId="satispay-qr"
                        src="/QrCode.jpeg" 
                        alt="Satispay" 
                        className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity" 
                      />
                    )}
                  </div>
                </>
              ) : (
                <>
                  <Icon size={20} className={`mb-2 ${isSelected ? "text-slate-800" : "text-gray-400"}`} />
                  <span className={`font-bold text-[10px] leading-tight ${isSelected ? "text-slate-800" : "text-slate-700"}`}>{option.label}</span>
                </>
              )}
            </button>
          );
        })}
      </div>

      {/* Show QR Code Inline if Satispay is selected */}
      <AnimatePresence>
        {qrCodeModal && (
          <QrCodeModal totalPrice={totalPrice} setQrCodeModal={setQrCodeModal} />
        )}
      </AnimatePresence>

      <button
        onClick={() => handleOrderSubmit(paymentMethod)}
        disabled={isSubmitting || !paymentMethod}
        className={`w-full py-4 text-white font-black text-lg rounded-full shadow-sm transition-all transform active:scale-95 cursor-pointer ${isSubmitting || !paymentMethod
          ? "bg-slate-300 cursor-not-allowed text-white shadow-none"
          : "bg-red-600 hover:bg-red-700 hover:-translate-y-0.5"
          }`}
        title=""
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </span>
        ) : (
          `Confirm - €${totalPrice.toFixed(2)}`
        )}
      </button>
    </div>
  );
}
