import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PilihProgram() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);

  const programList = [
    { id: "offline", nama: "Kelas privat mengaji visit home offline", icon: "🏠" },
    { id: "online", nama: "Kelas privat mengaji visit home online", icon: "📶" },
    { id: "tahsin", nama: "Kelas tahsin full online", icon: "📖" },
    { id: "tahfidz", nama: "Kelas tahfidz full online", icon: "📚" }
  ];

  const handleNext = () => {
    if (!selected) return;

    // NAVIGASI KE HALAMAN PILIH KELAS
    navigate("/siswa/kelas/pilih-kelas", {
      state: { program: selected },
    });
  };

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.card}>
        <h1 style={styles.title}>Pilih Program</h1>
        <p style={styles.subtitle}>
          Yuk, pilih program belajar kamu sebelum daftar lebih lanjut!
        </p>

        <div style={styles.grid}>
          {programList.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelected(item)}
              style={{
                ...styles.programCard,
                border:
                  selected?.id === item.id
                    ? "2px solid #008b47"
                    : "2px solid #ccc",
                boxShadow:
                  selected?.id === item.id
                    ? "0 4px 12px rgba(0,0,0,0.15)"
                    : "none",
              }}
            >
              <div style={styles.icon}>{item.icon}</div>
              <div style={styles.programName}>{item.nama}</div>
            </div>
          ))}
        </div>

        <div style={styles.buttonWrapper}>
          <button style={styles.backBtn} onClick={() => navigate(-1)}>
            Back
          </button>

          <button
            onClick={handleNext}
            disabled={!selected}
            style={{
              ...styles.nextBtn,
              opacity: selected ? 1 : 0.4,
              cursor: selected ? "pointer" : "not-allowed",
            }}
          >
            Lanjut
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  pageWrapper: {
    minHeight: "100vh",
    background: "#f7fdfb",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "80%",
    background: "#fff",
    borderRadius: 20,
    border: "3px solid #d9d9d9",
    padding: 40,
    textAlign: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    marginBottom: 30,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 30,
    padding: "0 40px",
  },
  programCard: {
    padding: 20,
    borderRadius: 16,
    cursor: "pointer",
    transition: ".3s",
    background: "#fff",
  },
  icon: {
    fontSize: 45,
  },
  programName: {
    marginTop: 10,
    fontWeight: "600",
  },
  buttonWrapper: {
    marginTop: 40,
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
  },
};
