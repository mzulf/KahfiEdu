import React, { useEffect, useState } from "react";
import materiService from "../../../services/materiService";

export default function MateriSiswa() {
  const [materiList, setMateriList] = useState([]);
  const [selectedMateri, setSelectedMateri] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMateri = async () => {
      try {
        const res = await materiService.getMateri({
          status: "active",
          limit: 100,
        });

        setMateriList(res.data);
        setSelectedMateri(res.data[0] || null);
      } catch (error) {
        console.error("Gagal mengambil materi:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMateri();
  }, []);

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div style={styles.pageWrapper}>
        <div style={styles.container}>
          <SkeletonLeft />
          <SkeletonRight />
        </div>
      </div>
    );
  }

  if (!materiList.length) {
    return (
      <div style={styles.center}>
        <p>Materi belum tersedia</p>
      </div>
    );
  }

  const imageUrl = selectedMateri?.imageUrl
    ? `${import.meta.env.VITE_API_URL.replace("/api/v1", "")}${selectedMateri.imageUrl}`
    : null;

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.container}>
        {/* ================= LEFT ================= */}
        <div style={styles.leftBox}>
          {imageUrl && (
            <img
              src={imageUrl}
              alt="materi"
              loading="lazy"
              style={styles.mainImage}
            />
          )}

          <h2 style={styles.title}>{selectedMateri.title}</h2>
          <p style={styles.detail}>{selectedMateri.detail}</p>
        </div>

        {/* ================= RIGHT ================= */}
        <div style={styles.rightList}>
          {materiList.map((item) => (
            <div
              key={item.id}
              style={{
                ...styles.listItem,
                backgroundColor:
                  selectedMateri.id === item.id ? "#e9fff1" : "transparent",
              }}
              onClick={() => setSelectedMateri(item)}
            >
              <h4 style={styles.listTitle}>{item.title}</h4>
              <p style={styles.listDesc}>{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ====================== SKELETON ====================== */
const SkeletonLeft = () => (
  <div style={styles.leftBox}>
    <div style={styles.skeletonImage} />
    <div style={styles.skeletonLineLg} />
    <div style={styles.skeletonLine} />
    <div style={styles.skeletonLine} />
  </div>
);

const SkeletonRight = () => (
  <div style={styles.rightList}>
    {[1, 2, 3, 4].map((i) => (
      <div key={i} style={styles.skeletonItem} />
    ))}
  </div>
);

/* ====================== STYLES ====================== */
const styles = {
  pageWrapper: {
    background: "#f7fdfb",
    minHeight: "100vh",
    padding: "40px 0",
  },

  container: {
    display: "flex",
    gap: 20,
    padding: "0 40px",
    flexWrap: "wrap",
  },

  leftBox: {
    flex: "2 1 500px",
    background: "#fff",
    borderRadius: 12,
    border: "1px solid #ccc",
    padding: 25,
  },

  mainImage: {
    width: "100%",
    height: "auto",
    maxHeight: 400,
    objectFit: "contain", // 🔥 sesuai ukuran asli
    borderRadius: 12,
    marginBottom: 20,
    background: "#fafafa",
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },

  detail: {
    fontSize: 16,
    color: "#444",
    lineHeight: 1.6,
  },

  rightList: {
    flex: "1 1 280px",
    background: "#fff",
    borderRadius: 12,
    border: "1px solid #ccc",
    maxHeight: "80vh",
    overflowY: "auto",
    padding: 10,
  },

  listItem: {
    padding: "14px 10px",
    borderBottom: "1px solid #e3e3e3",
    cursor: "pointer",
    borderRadius: 8,
  },

  listTitle: {
    fontSize: 16,
    fontWeight: "bold",
    margin: 0,
  },

  listDesc: {
    margin: 0,
    fontSize: 14,
    color: "#666",
  },

  center: {
    minHeight: "60vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  /* ===== SKELETON ===== */
  skeletonImage: {
    height: 220,
    borderRadius: 12,
    background: "linear-gradient(90deg,#eee,#f5f5f5,#eee)",
    animation: "pulse 1.5s infinite",
    marginBottom: 20,
  },

  skeletonLineLg: {
    height: 22,
    width: "60%",
    borderRadius: 6,
    background: "#eee",
    marginBottom: 12,
  },

  skeletonLine: {
    height: 14,
    width: "100%",
    borderRadius: 6,
    background: "#eee",
    marginBottom: 8,
  },

  skeletonItem: {
    height: 60,
    borderRadius: 8,
    background: "#eee",
    marginBottom: 10,
  },
};
