import { useNavigate } from "react-router-dom";

export default function Ewallet() {
  const navigate = useNavigate();

  const handleBayar = () => {
    navigate("/siswa/pembayaran/invoice");
  };

  return (
    <div className="border rounded-2xl p-6">
      <p className="text-sm font-semibold mb-3">Pilih E-wallet</p>

      <div className="flex gap-3 mb-4">
        <button className="px-4 py-2 border rounded-full flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          Dana
        </button>
        <button className="px-4 py-2 border rounded-full flex items-center gap-2">
          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
          OVO
        </button>
        <button className="px-4 py-2 border rounded-full flex items-center gap-2">
          <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
          Shopee Pay
        </button>
      </div>

      <input className="w-full p-3 border rounded-lg mb-3" placeholder="Nomor HP" />
      <input className="w-full p-3 border rounded-lg mb-3" placeholder="Nama" />
      <input className="w-full p-3 border rounded-lg mb-3" placeholder="Jumlah uang" />

      <button
        onClick={handleBayar}
        className="w-full bg-green-600 text-white p-3 rounded-lg font-semibold"
      >
        Bayar
      </button>
    </div>
  );
}
