import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBook } from "react-icons/fa";

export default function PilihKelas() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);

  const kelasList = [
    { id: "A", nama: "Kelas A" },
    { id: "B", nama: "Kelas B" },
    { id: "C", nama: "Kelas C" },
    { id: "D", nama: "Kelas D" },
  ];

  const handleNext = () => {
    if (!selected) return;
    navigate("/siswa/kelas/detail-kelas", {
      state: {
        kelas: selected, // KIRIM DATA KE HALAMAN DETAIL
      },
    });
  };

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.card}>
        <h1 style={styles.title}>Pilih Kelas</h1>

        <div style={styles.grid}>
          {kelasList.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelected(item)}
              style={{
                ...styles.kelasCard,
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
              <FaBook size={22} color="#008b47" />
              <span style={styles.kelasText}>{item.nama}</span>
            </div>
          ))}
        </div>

        <div style={styles.buttonWrapper}>
          <button style={styles.backBtn} onClick={() => navigate(-1)}>
            Back
          </button>

          <button
            style={{
              ...styles.nextBtn,
              opacity: selected ? 1 : 0.4,
              cursor: selected ? "pointer" : "not-allowed",
            }}
            disabled={!selected}
            onClick={handleNext}
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
    width: "75%",
    background: "#fff",
    borderRadius: 20,
    padding: 40,
    textAlign: "center",
    border: "3px solid #d9d9d9",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 35,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 30,
    padding: "0 40px",
  },
  kelasCard: {
    padding: 20,
    borderRadius: 16,
    display: "flex",
    alignItems: "center",
    gap: 15,
    cursor: "pointer",
    background: "#fff",
    transition: ".3s",
  },
  kelasText: {
    fontSize: 18,
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
