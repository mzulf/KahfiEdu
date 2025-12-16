import { useNavigate } from "react-router-dom";

export default function Transfer() {
  const navigate = useNavigate();

  const handleBayar = () => {
    navigate("/siswa/pembayaran/invoice");
  };

  return (
    <div className="border rounded-2xl p-6">
      <p className="text-sm font-semibold mb-3">Pilih Bank</p>

      <select className="w-full p-3 border rounded-lg mb-4">
        <option>BCA</option>
        <option>BNI</option>
        <option>BRI</option>
        <option>Mandiri</option>
      </select>

      <input className="w-full p-3 border rounded-lg mb-3" placeholder="Nomor Rekening" />
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
