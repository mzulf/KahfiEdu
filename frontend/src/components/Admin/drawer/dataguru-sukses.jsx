import React from "react";

export default function PopupSuksesDaftar({ open, onClose, onNext }) {
  if (!open) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.card}>
        {/* ICON */}
        <div style={styles.iconWrapper}>
          ✓
        </div>

        {/* TEXT */}
        <h2 style={styles.title}>PENDAFTARAN SUKSES</h2>

        {/* BUTTON */}
        <div style={styles.buttonRow}>
          <button style={styles.backBtn} onClick={onClose}>
            Kembali
          </button>

          <button style={styles.nextBtn} onClick={onNext}>
            Lanjut
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.35)", // transparan
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  card: {
    width: 380,
    background: "#fff",
    borderRadius: 18,
    padding: "35px 30px",
    textAlign: "center",
    border: "2px solid #16a34a",
    boxShadow: "0 12px 30px rgba(0,0,0,0.25)",
  },
  iconWrapper: {
    width: 80,
    height: 80,
    borderRadius: "50%",
    background: "#008b47",
    color: "#fff",
    fontSize: 48,
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 20px",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 25,
  },
  buttonRow: {
    display: "flex",
    justifyContent: "center",
    gap: 15,
  },
  backBtn: {
    padding: "8px 22px",
    borderRadius: 20,
    border: "none",
    background: "#d9d9d9",
    fontWeight: "600",
    cursor: "pointer",
  },
  nextBtn: {
    padding: "8px 26px",
    borderRadius: 20,
    border: "none",
    background: "#008b47",
    color: "#fff",
    fontWeight: "600",
    cursor: "pointer",
  },
};
