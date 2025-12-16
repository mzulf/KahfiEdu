// src/pages/Auth/kelas/DetailPilihProgram.jsx (Fix Final)
import React from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { FiMenu, FiBell, FiUser } from 'react-icons/fi';

const DetailPilihProgram = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Ambil data dari navigasi
    const program = location.state?.program;
    const kelas = location.state?.kelasDetail;

    // Default jika tidak ada data
    const defaultData = {
        name: 'Data Tidak Ditemukan',
        deskripsi: 'Silakan kembali ke halaman pemilihan kelas.',
        pengajar: '-',
        jadwal: '-',
        lokasi: '-',
        tanggalMulai: '-',
        kuotaTotal: 0,
        kuotaTerdaftar: 0,
    };

    const dataKelas = kelas || defaultData;

    // --- Handlers ---

    const handleBack = () => {
        navigate(-1);
    };

    const handleDaftar = () => {
        if (!dataKelas) {
            alert("Data kelas tidak ditemukan.");
            return;
        }

        // ⬅ ROUTE SUDAH SESUAI DENGAN ROUTER BARU
        navigate("/siswa/pendaftaran/form-program", {
            state: {
                program,
                kelas: dataKelas
            }
        });
    };

    // Komponen kecil untuk tampilan detail
    const DetailItem = ({ label, value }) => (
        <div className="p-4 bg-white/50 rounded-lg shadow-sm mb-3 border border-gray-100">
            <p className="text-gray-800 text-center font-medium">
                {label}: <strong>{value}</strong>
            </p>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center">
            <div className="w-full max-w-md bg-white shadow-xl min-h-screen p-4">

                {/* Header */}
                <header className="flex justify-between items-center mb-6">
                    <div className="flex items-center space-x-4">
                        <FiMenu className="text-2xl text-gray-700 cursor-pointer" />
                        <div className="flex items-center">
                            <span className="text-2xl font-bold text-green-700 font-serif" style={{ lineHeight: 1 }}>Kahfi</span>
                            <span className="text-xs text-green-700 ml-1 mt-1">education</span>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <FiBell className="text-2xl text-gray-700 cursor-pointer" />
                        <div className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center cursor-pointer">
                            <FiUser className="text-xl text-gray-700" />
                        </div>
                    </div>
                </header>

                {/* Konten */}
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-md">

                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">{dataKelas.name}</h2>
                        <p className="text-sm text-gray-600 px-4">{dataKelas.deskripsi}</p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <DetailItem label="Pengajar" value={dataKelas.pengajar} />
                        <DetailItem label="Jadwal Kelas" value={dataKelas.jadwal} />
                        <DetailItem label="Lokasi (offline)" value={dataKelas.lokasi} />
                        <DetailItem label="Tanggal Mulai" value={dataKelas.tanggalMulai} />
                        <DetailItem
                            label="Kuota"
                            value={`${dataKelas.kuotaTotal} siswa, terdaftar: ${dataKelas.kuotaTerdaftar}`}
                        />
                    </div>

                    {/* Tombol */}
                    <div className="mt-8 pt-4 flex justify-center space-x-6">
                        <button
                            className="px-6 py-3 border border-gray-400 text-gray-700 font-semibold rounded-full hover:bg-gray-100 transition duration-150"
                            onClick={handleBack}
                        >
                            Back
                        </button>
                        <button
                            className="px-6 py-3 bg-green-600 text-white font-semibold rounded-full shadow-lg hover:bg-green-700 transition duration-150"
                            onClick={handleDaftar}
                        >
                            Daftar
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default DetailPilihProgram;
