import React from "react";
import { FaCheckCircle, FaCalendarAlt, FaBook } from "react-icons/fa";

export default function NotificationPage() {
  const notifications = [
    {
      id: 1,
      icon: <FaCheckCircle style={{ fontSize: 28, color: "#00c853" }} />,
      text: "Pendaftaran kelas berhasil!!! Silahkan lihat kelas anda di jadwal."
    },
    {
      id: 2,
      icon: <FaCalendarAlt style={{ fontSize: 28, color: "#ff6f00" }} />,
      text: "Jangan lupa kelas BTQ Dasar dimulai besok 08.00 WIB!"
    },
    {
      id: 3,
      icon: <FaBook style={{ fontSize: 28, color: "#000" }} />,
      text: "Tugas Menulis Huruf Hijaiyah Dikumpulkan Besok jam 09.00"
    }
  ];

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.container}>
        <h2 style={styles.title}>Notifikasi</h2>

        <div style={styles.card}>
          {notifications.map((item) => (
            <div key={item.id} style={styles.item}>
              <div>{item.icon}</div>
              <div style={styles.text}>{item.text}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  pageWrapper: {
    background: "#f7fdfb",
    minHeight: "100vh"
  },
  container: {
    padding: "30px 60px"
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20
  },
  card: {
    background: "#fff",
    borderRadius: 12,
    border: "1px solid #dcdcdc"
  },
  item: {
    display: "flex",
    alignItems: "center",
    padding: "18px 25px",
    borderBottom: "1px solid #e3e3e3"
  },
  text: {
    fontSize: 16,
    marginLeft: 20,
    color: "#333"
  }
};
