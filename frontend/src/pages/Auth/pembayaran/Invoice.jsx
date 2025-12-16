import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogActions, Button, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useNavigate } from "react-router-dom";

export default function Invoice() {
  const navigate = useNavigate();
  const [openSuccess, setOpenSuccess] = useState(false);

  const handleSubmit = () => {
    setOpenSuccess(true);

    // Auto close & redirect after 5 seconds
    setTimeout(() => {
      navigate("/siswa");
    }, 5000);
  };

  return (
    <div className="min-h-screen flex justify-center items-start p-6 bg-white">
      <div className="w-full max-w-3xl bg-white border rounded-3xl p-10 shadow-sm">

        {/* Title */}
        <h1 className="text-4xl font-bold mb-2">Invoice</h1>
        <p className="text-gray-700 mb-6">INV/2025/05/00027</p>

        {/* Card */}
        <div className="border rounded-2xl p-8">

          {/* Table */}
          <div className="grid grid-cols-2 gap-y-3 text-sm">

            <p className="text-gray-600">Nama lengkap</p>
            <p className="text-right font-medium">Ahmad Fadli</p>

            <p className="text-gray-600">Email</p>
            <p className="text-right font-medium">ahmad.fadli@gmail.com</p>

            <p className="text-gray-600">Nomor HP</p>
            <p className="text-right font-medium">08123456789</p>

            <p className="text-gray-600">Nama kelas</p>
            <p className="text-right font-medium">Kelas A Tahfidz (online)</p>

            <p className="text-gray-600">Jadwal</p>
            <p className="text-right font-medium">Senin & Rabu, 19.00 - 20.30 WIB</p>

            <p className="text-gray-600">Biaya pendaftaran</p>
            <p className="text-right font-medium">Rp 50.000</p>

            <p className="text-gray-600">Biaya bulanan</p>
            <p className="text-right font-medium">Rp 100.000</p>

            <p className="text-gray-600">Total</p>
            <p className="text-right font-medium">Rp 150.000</p>

            <p className="text-gray-600">Transfer Bank</p>
            <p className="text-right font-medium">Bank BCA</p>

            <p className="text-gray-600">No. Rekening</p>
            <p className="text-right font-medium">1234567890 a.n Kahfi Education</p>

            <p className="text-gray-600">Tanggal pembayaran</p>
            <p className="text-right font-medium">10 Juni 2025</p>

            <p className="text-gray-600">Status</p>
            <p className="text-right font-medium">Lunas</p>
          </div>

          {/* Button */}
          <button
            className="w-full mt-8 bg-green-600 text-white py-3 rounded-full text-lg font-semibold hover:bg-green-700"
            onClick={handleSubmit}
          >
            Kirim
          </button>
        </div>
      </div>

      {/* Success Popup */}
      <Dialog open={openSuccess} maxWidth="xs" fullWidth>
        <DialogContent sx={{ textAlign: "center", py: 4 }}>
          <CheckCircleIcon sx={{ fontSize: 80, color: "#10B981", mb: 2 }} />
          <Typography variant="h5" fontWeight="bold" mb={1}>
            Pembayaran Berhasil!
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Anda akan diarahkan ke halaman utama dalam 5 detik...
          </Typography>
        </DialogContent>

        <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
          <Button
            onClick={() => navigate("/siswa")}
            variant="contained"
            sx={{
              backgroundColor: "#10B981",
              px: 4,
              borderRadius: 2,
              "&:hover": { backgroundColor: "#059669" },
            }}
          >
            Kembali Sekarang
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
