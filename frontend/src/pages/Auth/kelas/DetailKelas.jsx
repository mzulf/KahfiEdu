import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function DetailKelas() {
  const navigate = useNavigate();
  const { state } = useLocation();

  // Jika user langsung akses URL tanpa memilih kelas
  if (!state?.kelas) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <h2>Data kelas tidak ditemukan</h2>
        <button onClick={() => navigate("/siswa/kelas")}>Kembali</button>
      </div>
    );
  }

  const kelas = state.kelas; // kelas yang dipilih user

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.card}>
        <h1 style={styles.title}>{kelas.nama}</h1>

        <p style={styles.desc}>
          Kelas ini dirancang untuk pemula yang ingin
          memperbaiki bacaan Al-Quran dengan metode Yanbu'a
        </p>

        <div style={styles.infoBox}>
          <div style={styles.infoItem}>Pengajar : Ustadzah Ulul Azmi</div>
          <div style={styles.infoItem}>
            Jadwal Kelas : Senin & Rabu, 19.00 – 20.30 WIB
          </div>
          <div style={styles.infoItem}>
            Lokasi : (offline) Kahfi Education, Denpasar
          </div>
          <div style={styles.infoItem}>Tanggal Mulai : 15 Juni 2025</div>
          <div style={styles.infoItem}>
            Kuota : 20 siswa, terdaftar : 15 siswa
          </div>
        </div>

        <div style={styles.buttonWrapper}>
          <button style={styles.backBtn} onClick={() => navigate(-1)}>
            Back
          </button>

          <button
            style={styles.nextBtn}
            onClick={() => navigate("/siswa/kelas/daftar", { state: { kelas } })}
          >
            Daftar
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  pageWrapper: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f7fdfb",
  },
  card: {
    width: "75%",
    background: "#fff",
    borderRadius: 20,
    padding: 40,
    border: "3px solid #d9d9d9",
    textAlign: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
  },
  desc: {
    fontSize: 15,
    color: "#444",
    marginTop: 10,
    marginBottom: 30,
  },
  infoBox: {
    border: "2px solid #ccc",
    borderRadius: 15,
    padding: 25,
  },
  infoItem: {
    background: "#f4f4f4",
    padding: 12,
    borderRadius: 15,
    marginBottom: 12,
    fontSize: 16,
    fontWeight: "500",
  },
  buttonWrapper: {
    marginTop: 30,
    display: "flex",
    justifyContent: "center",
    gap: 20,
  },
  backBtn: {
    padding: "10px 25px",
    borderRadius: 25,
    border: "2px solid black",
    background: "white",
    fontWeight: "bold",
    cursor: "pointer",
  },
  nextBtn: {
    padding: "10px 30px",
    borderRadius: 25,
    background: "#008b47",
    color: "white",
    border: "none",
    fontWeight: "bold",
    cursor: "pointer",
  },
};
