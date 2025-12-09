import React from 'react';

// Asumsi: Anda menggunakan React dan ingin mereplikasi tampilan dengan styling minimal
// atau menggunakan class names yang Anda definisikan sendiri (misalnya, dengan Tailwind CSS).
// Saya akan menggunakan styling in-line untuk representasi warna dan tata letak dasar.

const DataOrtu = () => {
    // State untuk mengelola input form (opsional, bisa ditambahkan jika diperlukan)
    // const [formData, setFormData] = useState({ ... });
    
    return (
        <div style={{ 
            backgroundColor: '#f5f5f5', 
            minHeight: '100vh', 
            padding: '20px', 
            fontFamily: 'Arial, sans-serif' 
        }}>
            {/* Header dengan Logo dan Menu */}
            <header style={{ 
                backgroundColor: 'white', 
                padding: '15px 20px', 
                borderRadius: '10px', 
                display: 'flex', 
                alignItems: 'center', 
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                marginBottom: '20px',
                borderTop: '5px solid #A2D696' // Garis hijau muda di atas
            }}>
                {/* Tombol Menu Hamburger */}
                <button style={{ 
                    backgroundColor: 'transparent', 
                    border: '1px solid #333', 
                    borderRadius: '5px', 
                    padding: '8px 12px', 
                    marginRight: '20px',
                    fontSize: '20px',
                    cursor: 'pointer'
                }}>
                    &#9776;
                </button>
                
                {/* Logo Cahy Education */}
                <div style={{ color: '#00A859', fontSize: '24px', fontWeight: 'bold' }}>
                    Cahy<span style={{ color: '#333', fontSize: '14px', display: 'block', lineHeight: '1' }}>Education</span>
                </div>
                {/* Latar belakang hijau muda untuk header, sesuai gambar */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '80px', // Sesuaikan tinggi
                    backgroundColor: '#E6F3E3', // Warna hijau muda
                    zIndex: -1,
                    // Garis melengkung di bagian bawah header (lebih kompleks dengan CSS murni,
                    // ini hanya simulasi latar belakang)
                }}></div>
            </header>

            {/* Judul Halaman */}
            <h1 style={{ fontSize: '16px', color: '#555', marginBottom: '20px', marginLeft: '10px' }}>
                Daftar data ortu
            </h1>

            {/* Progress Bar/Steps */}
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '20px' }}>
                {/* Step Umum */}
                <StepButton label="Umum" isActive={true} />
                {/* Step Anak */}
                <StepButton label="Anak" isActive={true} />
                {/* Step Orang Tua (Aktif) */}
                <StepButton label="Orang Tua" isActive={true} /> 
            </div>

            {/* Form Kontainer */}
            <div style={{ 
                backgroundColor: 'white', 
                padding: '30px', 
                borderRadius: '15px', 
                boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
                border: '1px solid #ddd',
                position: 'relative',
                overflow: 'hidden'
            }}>
                
                {/* Inner Form Kontainer */}
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1fr 1fr', 
                    gap: '20px' 
                }}>
                    
                    {/* Kolom Kiri */}
                    <div>
                        <FormField 
                            label="Nama Ayah/Ibu (perwakilan salah satu siswa)" 
                            placeholder="" 
                            type="text" 
                            required 
                        />
                        <FormField 
                            label="No Whatsapp yang dapat dihubungi" 
                            placeholder="" 
                            type="tel" 
                            required 
                        />
                        <FormField 
                            label="Alamat Lengkap" 
                            placeholder="" 
                            type="text" 
                            required 
                        />
                    </div>

                    {/* Kolom Kanan */}
                    <div>
                        <FormField 
                            label="Wilayah Kabupaten/Kecamatan" 
                            placeholder="" 
                            type="text" 
                            required 
                        />
                        {/* Field Dropdown */}
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ 
                                display: 'block', 
                                marginBottom: '5px', 
                                fontSize: '14px', 
                                color: '#333' 
                            }}>
                                Apakah Orang Tua mengizinkan jika ananda di video aktivitas belajarnya untuk konten sosial media? <span style={{ color: 'red' }}>*</span>
                            </label>
                            <select 
                                style={{ 
                                    width: '100%', 
                                    padding: '10px', 
                                    border: '1px solid #ccc', 
                                    borderRadius: '8px',
                                    backgroundColor: 'white',
                                    fontSize: '16px',
                                    appearance: 'none', // Menghilangkan default arrow
                                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'%3E%3Cpath fill='%23333' d='M8 11.5l-4-4h8l-4 4z'/%3E%3C/svg%3E")`, // Custom arrow
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'right 10px center',
                                    cursor: 'pointer'
                                }}
                                required
                            >
                                <option value="">-- Pilih Opsi --</option>
                                <option value="ya">Ya</option>
                                <option value="tidak">Tidak</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Tombol Aksi */}
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'flex-start', 
                    marginTop: '30px' 
                }}>
                    <button 
                        style={{ 
                            padding: '10px 25px', 
                            marginRight: '15px', 
                            backgroundColor: '#E0E0E0', 
                            color: '#333', 
                            border: 'none', 
                            borderRadius: '25px', 
                            fontSize: '16px', 
                            cursor: 'pointer'
                        }}
                    >
                        Kembali
                    </button>
                    <button 
                        type="submit"
                        style={{ 
                            padding: '10px 30px', 
                            backgroundColor: '#00A859', 
                            color: 'white', 
                            border: 'none', 
                            borderRadius: '25px', 
                            fontSize: '16px', 
                            fontWeight: 'bold', 
                            cursor: 'pointer'
                        }}
                    >
                        Submit
                    </button>
                </div>
            </div>
            
            {/* Progress bar di bawah */}
            <div style={{
                height: '8px',
                width: '100%',
                backgroundColor: '#eee',
                marginTop: '20px',
                borderRadius: '4px'
            }}>
                <div style={{
                    height: '100%',
                    width: '90%', // Asumsi 90% progress
                    backgroundColor: '#00A859',
                    borderRadius: '4px'
                }}></div>
            </div>
        </div>
    );
};

// Komponen Pembantu untuk Tombol Langkah/Step
const StepButton = ({ label, isActive }) => {
    const activeStyle = {
        backgroundColor: '#00A859',
        color: 'white',
        fontWeight: 'bold',
        padding: '8px 15px',
        borderRadius: '20px',
        marginRight: '10px',
        display: 'flex',
        alignItems: 'center',
        border: 'none',
        cursor: 'default'
    };
    
    const icon = isActive ? '✓' : '';

    return (
        <button style={activeStyle}>
            <span style={{ marginRight: '5px', fontSize: '18px' }}>{icon}</span> {label}
        </button>
    );
};

// Komponen Pembantu untuk Field Input
const FormField = ({ label, placeholder, type, required }) => (
    <div style={{ marginBottom: '20px' }}>
        <label style={{ 
            display: 'block', 
            marginBottom: '5px', 
            fontSize: '14px', 
            color: '#333' 
        }}>
            {label} {required && <span style={{ color: 'red' }}>*</span>}
        </label>
        <input
            type={type}
            placeholder={placeholder}
            required={required}
            style={{ 
                width: '100%', 
                padding: '10px', 
                border: '1px solid #ccc', 
                borderRadius: '8px',
                fontSize: '16px' 
            }}
        />
    </div>
);

export default DataOrtu;