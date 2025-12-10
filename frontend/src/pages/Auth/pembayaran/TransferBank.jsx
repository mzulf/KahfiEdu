import React from "react";

export default function TransferBank() {
  return (
    <div style={styles.page}>
      <h2 style={styles.title}>Pilih Metode Pembayaran</h2>

      {/* MENU PILIH */}
      <div style={styles.methodWrapper}>
        <button style={styles.inactiveBtn}>💳 E-Wallet</button>
        <button style={{ ...styles.activeBtn }}>🏦 Transfer Bank</button>
      </div>

      <div style={styles.card}>
        <label style={styles.label}>Pilih Bank</label>
        <select style={styles.select}>
          <option>Bank BCA</option>
          <option>Bank BNI</option>
          <option>Bank BRI</option>
          <option>Bank Mandiri</option>
        </select>

        <input style={styles.input} placeholder="Nomor Rekening" />
        <input style={styles.input} placeholder="Nama" />
        <input style={styles.input} placeholder="Jumlah Uang" />

        <button style={styles.payBtn}>Bayar</button>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f7fdfb",
    padding: "50px 20px",
    textAlign: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 40,
  },
  methodWrapper: {
    display: "flex",
    justifyContent: "center",
    gap: 20,
  },
  activeBtn: {
    padding: "15px 35px",
    borderRadius: 14,
    border: "3px solid #008b47",
    fontSize: 18,
    background: "white",
    color: "#008b47",
  },
  inactiveBtn: {
    padding: "15px 35px",
    borderRadius: 14,
    border: "3px solid #ccc",
    fontSize: 18,
    background: "white",
    color: "#333",
  },
  card: {
    margin: "40px auto",
    width: "60%",
    background: "white",
    borderRadius: 16,
    border: "2px solid #ccc",
    padding: "30px 40px",
    textAlign: "left",
  },
  label: { fontWeight: "bold", marginBottom: 5 },
  select: {
    width: "100%",
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
    border: "1px solid #ccc",
  },
  input: {
    width: "100%",
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
    border: "1px solid #ccc",
  },
  payBtn: {
    width: "100%",
    padding: 12,
    background: "#008b47",
    color: "white",
    borderRadius: 10,
    border: "none",
    fontWeight: "bold",
    cursor: "pointer",
  },
};
