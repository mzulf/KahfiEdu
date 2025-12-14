import { useState } from "react";
import Ewallet from "./Ewallet";
import Transfer from "./Transfer";

export default function PaymentMethod() {
  const [method, setMethod] = useState("ewallet");

  return (
    <div className="w-full min-h-screen bg-white flex flex-col items-center py-10">
      
      {/* Judul */}
      <h2 className="text-xl font-bold mb-6">Pilih Metode Pembayaran</h2>

      {/* Tombol Selector */}
      <div className="flex gap-6 mb-8">
        {/* E-Wallet */}
        <button
          onClick={() => setMethod("ewallet")}
          className={`px-8 py-4 rounded-xl border 
            flex flex-col items-center gap-2
            ${method === "ewallet" ? "bg-green-100 border-green-500 shadow-md" : "bg-white"}
          `}
        >
          <span className="font-semibold">E - Wallet</span>
        </button>

        {/* Transfer Bank */}
        <button
          onClick={() => setMethod("transfer")}
          className={`px-8 py-4 rounded-xl border 
            flex flex-col items-center gap-2
            ${method === "transfer" ? "bg-green-100 border-green-500 shadow-md" : "bg-white"}
          `}
        >
          <span className="font-semibold">Transfer Bank</span>
        </button>
      </div>

      {/* Konten berubah otomatis */}
      <div className="w-full max-w-xl">
        {method === "ewallet" ? <Ewallet /> : <Transfer />}
      </div>
    </div>
  );
}
