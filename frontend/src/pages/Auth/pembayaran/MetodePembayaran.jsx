import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Pembayaran() {
  const [metode, setMetode] = useState("ewallet");
  const [eWalletType, setEWalletType] = useState("dana");
  const navigate = useNavigate();

  const handleBayar = () => {
    navigate("/siswa/kelas/invoice"); // ⬅ navigasi ke halaman invoice
  };

  return (
    <div style={styles.page}>
      <h2 style={styles.title}>Pilih Metode Pembayaran</h2>

      {/* PILIH METODE */}
      <div style={styles.switchWrapper}>
        <button
          onClick={() => setMetode("ewallet")}
          style={{
            ...styles.switchBtn,
            background: metode === "ewallet" ? "#0a8f52" : "#eaeaea",
            color: metode === "ewallet" ? "#fff" : "#000",
          }}
        >
          💳 E-Wallet
        </button>

        <button
          onClick={() => setMetode("bank")}
          style={{
            ...styles.switchBtn,
            background: metode === "bank" ? "#0a8f52" : "#eaeaea",
            color: metode === "bank" ? "#fff" : "#000",
          }}
        >
          🏦 Transfer Bank
        </button>
      </div>

      {/* CARD */}
      <div style={styles.card}>
        {/* ========== FORM BANK ========== */}
        {metode === "bank" && (
          <div>
            <label style={styles.label}>Pilih Bank</label>
            <select style={styles.input}>
              <option>Bank BCA</option>
              <option>Bank BNI</option>
              <option>Bank BRI</option>
              <option>Bank Mandiri</option>
            </select>

            <label style={styles.label}>Nomor Rekening</label>
            <input type="text" placeholder="1234567890" style={styles.input} />

            <label style={styles.label}>Nama</label>
            <input type="text" placeholder="Nama lengkap" style={styles.input} />

            <label style={styles.label}>Jumlah Uang</label>
            <input type="text" placeholder="150000" style={styles.input} />
          </div>
        )}

        {/* ========== FORM E-WALLET ========== */}
        {metode === "ewallet" && (
          <div>
            <label style={styles.label}>Pilih E-Wallet</label>

            <div style={styles.walletRow}>
              {["dana", "ovo", "gopay", "shopeepay"].map((w) => (
                <button
                  key={w}
                  onClick={() => setEWalletType(w)}
                  style={{
                    ...styles.walletBtn,
                    background: eWalletType === w ? "#0a8f52" : "#eaeaea",
                    color: eWalletType === w ? "#fff" : "#000",
                  }}
                >
                  {w.toUpperCase()}
                </button>
              ))}
            </div>

            <label style={styles.label}>Nomor HP</label>
            <input type="text" placeholder="08xxxxxxxxxx" style={styles.input} />

            <label style={styles.label}>Nama</label>
            <input type="text" placeholder="Nama lengkap" style={styles.input} />

            <label style={styles.label}>Jumlah Uang</label>
            <input type="text" placeholder="150000" style={styles.input} />
          </div>
        )}

        {/* TOMBOL BAYAR */}
        <button style={styles.payBtn} onClick={handleBayar}>
          Bayar
        </button>
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
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 25,
  },

  /* SWITCH METODE */
  switchWrapper: {
    display: "flex",
    justifyContent: "center",
    gap: 15,
    marginBottom: 25,
  },
  switchBtn: {
    padding: "10px 18px",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
    fontSize: 16,
    fontWeight: 600,
  },

  /* CARD */
  card: {
    width: "70%",
    margin: "0 auto",
    padding: 25,
    border: "2px solid #ccc",
    borderRadius: 16,
    background: "#fff",
  },

  label: {
    fontWeight: "600",
    fontSize: 15,
    marginTop: 15,
    display: "block",
  },
  input: {
    width: "100%",
    padding: 12,
    borderRadius: 8,
    border: "1px solid #ccc",
    marginTop: 5,
    marginBottom: 10,
    fontSize: 15,
  },

  /* E-WALLET BUTTON CHOICE */
  walletRow: {
    display: "flex",
    gap: 10,
    marginBottom: 15,
  },
  walletBtn: {
    flex: 1,
    padding: "10px 0",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
  },

  payBtn: {
    marginTop: 20,
    width: "100%",
    padding: 12,
    background: "#008b47",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    cursor: "pointer",
    fontWeight: 700,
    fontSize: 16,
  },
};
