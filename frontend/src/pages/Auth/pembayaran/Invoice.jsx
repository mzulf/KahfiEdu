import React, { useState } from "react";

export default function Invoice() {
  const [bukti, setBukti] = useState(null);

  const handleUpload = (e) => {
    setBukti(e.target.files[0]);
  };

  return (
    <div style={styles.page}>
      <h2 style={styles.title}>Invoice</h2>
      <p style={styles.kode}>INV/2025/05/00027</p>

      <div style={styles.card}>
        {/* TABEL INFO */}
        <table style={styles.table}>
          <tbody>
            <tr><td>Nama lengkap</td><td>Ahmad Fadli</td></tr>
            <tr><td>Email</td><td>ahmad.fadli@gmail.com</td></tr>
            <tr><td>Nomor HP</td><td>08123456789</td></tr>
            <tr><td>Nama kelas</td><td>Kelas A Tahfidz (online)</td></tr>
            <tr><td>Jadwal</td><td>Senin & Rabu, 19.00 – 20.30 WIB</td></tr>
            <tr><td>Biaya pendaftaran</td><td>Rp 50.000</td></tr>
            <tr><td>Biaya bulanan</td><td>Rp 100.000</td></tr>
            <tr><td>Total</td><td><b>Rp 150.000</b></td></tr>
            <tr><td>Transfer Bank</td><td>Bank BCA</td></tr>
            <tr><td>No. Rekening</td><td>1234567890 a.n. Kahfi Education</td></tr>
            <tr><td>Tanggal pembayaran</td><td>10 Juni 2025</td></tr>
            <tr><td>Status</td><td><b>Lunas</b></td></tr>
          </tbody>
        </table>

        {/* UPLOAD */}
        <label style={styles.uploadBox}>
          <span>📤 Upload bukti pembayaran</span>
          <input type="file" hidden onChange={handleUpload} />
        </label>

        {bukti && (
          <p style={{ textAlign: "center", marginTop: 5 }}>
            File: <b>{bukti.name}</b>
          </p>
        )}

        {/* BUTTON KIRIM */}
        <button style={styles.sendBtn}>Kirim</button>
      </div>
    </div>
  );
}

const styles = {
  page: {
    padding: "30px 20px",
    background: "#f6fff8",
    minHeight: "100vh",
  },
  title: {
    fontSize: 28,
    fontWeight: 700,
    textAlign: "center",
  },
  kode: {
    textAlign: "center",
    marginBottom: 30,
    fontWeight: 600,
  },
  card: {
    width: "70%",
    margin: "0 auto",
    padding: 25,
    border: "2px solid #ccc",
    borderRadius: 16,
    background: "#fff",
  },
  table: {
    width: "100%",
    marginBottom: 25,
    fontSize: 16,
    borderCollapse: "separate",
    borderSpacing: "0 8px",
  },
  uploadBox: {
    width: "100%",
    border: "1.5px dashed #777",
    borderRadius: 12,
    padding: 15,
    textAlign: "center",
    cursor: "pointer",
    marginBottom: 20,
    background: "#f9f9f9",
    fontWeight: 600,
  },
  sendBtn: {
    width: "100%",
    padding: 12,
    borderRadius: 10,
    background: "#008b47",
    color: "#fff",
    border: "none",
    fontWeight: 700,
    cursor: "pointer",
  },
};
