export default function QrCodeModal({ setQrCodeModal, totalPrice }) {
  return (
    <div className="w-full mt-4 bg-white border border-gray-100 rounded-3xl shadow-lg overflow-hidden">
      <div className="flex flex-col items-center p-6 text-center relative w-full">
        {/* Close button */}
        <button
          onClick={() => setQrCodeModal(false)}
          className="absolute top-4 right-4 p-1.5 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors text-gray-500 hover:text-gray-800 cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <h3 className="font-serif font-black text-2xl mb-1 text-slate-800 tracking-tight">
          Scan to Pay
        </h3>
        <p className="text-sm text-slate-500 mb-4 px-4">
          Open your Satispay app and scan the code below.
        </p>

        <div className="bg-white p-2 rounded-2xl mb-4 shadow-sm border border-gray-100">
          <img
            src="/QrCode.jpeg"
            alt="Satispay QR Code"
            className="w-48 h-auto object-contain rounded-xl"
          />
        </div>

        <p className="font-bold text-slate-800 text-lg">
          Amount: <span className="text-red-600">€{totalPrice.toFixed(2)}</span>
        </p>
      </div>
    </div>
  );
}
