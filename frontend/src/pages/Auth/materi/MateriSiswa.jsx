import React, { useState } from "react";

export default function MateriPage() {
  const materiList = [
    {
      id: 1,
      title: "Perkenalan Huruf Hijaiyah",
      desc: "sedikit deskripsi materi",
      detail: "Ini adalah detail materi ke-1",
      image: "/img/materi/materi1.jpg"
    },
    {
      id: 2,
      title: "Ceramah Singkat tentang Sholat",
      desc: "sedikit deskripsi materi",
      detail: "Ini adalah detail materi ke-2",
      image: "/img/materi/materi2.jpg"
    },
    {
      id: 3,
      title: "Judul Materi 3",
      desc: "sedikit deskripsi materi",
      detail: "Ini adalah detail materi ke-3",
      image: "/img/materi/sample1.jpg"
    },
    {
      id: 4,
      title: "Judul Materi 4",
      desc: "sedikit deskripsi materi",
      detail: "Ini adalah detail materi ke-4",
      image: "/img/materi/sample1.jpg"
    }
  ];

  // STATE — materi yang sedang dipilih
  const [selectedMateri, setSelectedMateri] = useState(materiList[0]);

  return (
    <div style={styles.pageWrapper}>
      
      <div style={styles.container}>

        {/* BAGIAN KIRI — DETAIL MATERI */}
        <div style={styles.leftBox}>
          <img 
            src={selectedMateri.image}
            alt="materi"
            style={styles.mainImage}
          />

          <h2 style={styles.title}>{selectedMateri.title}</h2>
          <p style={styles.detail}>{selectedMateri.detail}</p>
        </div>

        {/* BAGIAN KANAN — LIST MATERI */}
        <div style={styles.rightList}>
          {materiList.map((item) => (
            <div
              key={item.id}
              style={{
                ...styles.listItem,
                backgroundColor:
                  selectedMateri.id === item.id ? "#e9fff1" : "transparent",
              }}
              onClick={() => setSelectedMateri(item)}   // 🔥 UPDATE STATE
            >
              <h4 style={styles.listTitle}>{item.title}</h4>
              <p style={styles.listDesc}>{item.desc}</p>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
}


// ------------------- STYLES -------------------
const styles = {
  pageWrapper: {
    background: "#f7fdfb",
    minHeight: "100vh",
    paddingTop: 40,
    paddingBottom: 40
  },

  container: {
    display: "flex",
    gap: 20,
    padding: "0 40px"
  },

  leftBox: {
    flex: 2,
    background: "#fff",
    borderRadius: 12,
    border: "1px solid #ccc",
    padding: 25,
    minHeight: 400
  },

  mainImage: {
    width: 120,
    height: 120,
    borderRadius: 12,
    objectFit: "cover",
    marginBottom: 15
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10
  },

  detail: {
    fontSize: 16,
    color: "#444",
    lineHeight: 1.5
  },

  rightList: {
    flex: 1,
    background: "#fff",
    borderRadius: 12,
    border: "1px solid #ccc",
    maxHeight: "80vh",
    overflowY: "auto",
    padding: 10
  },

  listItem: {
    padding: "15px 10px",
    borderBottom: "1px solid #e3e3e3",
    cursor: "pointer",
    borderRadius: 8
  },

  listTitle: {
    fontSize: 18,
    fontWeight: "bold",
    margin: 0
  },

  listDesc: {
    margin: 0,
    fontSize: 14,
    color: "#666"
  }
};
