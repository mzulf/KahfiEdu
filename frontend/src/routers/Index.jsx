// src/routers/Index.jsx
import { Routes, Route } from "react-router-dom";

/* ==================== LAYOUT ==================== */
import GuestLayout from "../layouts/GuestLayout";
import AuthLayout from "../layouts/AuthLayout";
import AdminLayout from "../layouts/AdminLayout";
import ProtectedRoute from "./ProtectedRoute";

/* ==================== GUEST ==================== */
import Beranda from "../pages/Guest/Beranda";
import TentangKami from "../pages/Guest/TentangKami";
import Login from "../pages/Guest/login/Login";
import LoginAdmin from "../pages/Guest/login/LoginAdmin";
import Register from "../pages/Guest/Register";
import Blog from "../pages/Guest/Blog";
import BlogDetail from "../pages/Guest/BlogDetail";
import Karir from "../pages/Guest/Karir";
import Otp from "../pages/Guest/Otp";
import ResetPassword from "../pages/Guest/ResetPassword";
import ForgotPassword from "../pages/Guest/ForgotPassword";

/* ==================== AUTH SISWA ==================== */
import BerandaSiswa from "../pages/Auth/beranda/BerandaSiswa";
import JadwalSiswa from "../pages/Auth/beranda/JadwalSiswa";

import KelasSiswa from "../pages/Auth/kelas/KelasSiswa";
import DetailKelas from "../pages/Auth/kelas/DetailKelas";
import PilihProgram from "../pages/Auth/kelas/PilihProgram";
import PilihKelas from "../pages/Auth/kelas/PilihKelas";
import DetailPilihProgram from "../pages/Auth/kelas/DetailPilihProgram";

import MateriSiswa from "../pages/Auth/materi/MateriSiswa";

import FormProgram from "../pages/Auth/pendaftaran/FormProgram";
import DaftarAnak from "../pages/Auth/pendaftaran/DaftarAnak";
import DaftarOrtu from "../pages/Auth/pendaftaran/DaftarOrtu";

import PaymentMethod from "../pages/Auth/pembayaran/PaymentMethod";
import Invoice from "../pages/Auth/pembayaran/Invoice";

import PengajarSiswa from "../pages/Auth/pengajar/PengajarSiswa";

import Profile from "../pages/Auth/profil/Profile";
import ProfileDetail from "../pages/Auth/profil/ProfileDetail";
import ProfileEdit from "../pages/Auth/profil/ProfileEdit";

/* ==================== ADMIN ==================== */
import DashboardAdmin from "../pages/Admin/dashboard/DashboardAdmin";

import UserList from "../pages/Admin/user/UserList";
import UserDetail from "../pages/Admin/user/UserDetail";

import CourseList from "../pages/Admin/course/CourseList";
import CourseDetail from "../pages/Admin/course/CourseDetail";
import CourseCreate from "../pages/Admin/course/CourseCreate";
import CourseEdit from "../pages/Admin/course/CourseEdit";

import ClassList from "../pages/Admin/class/ClassList";
import ClassDetail from "../pages/Admin/class/ClassDetail";

import BlogListAdmin from "../pages/Admin/blog/BlogList";
import BlogDetailAdmin from "../pages/Admin/blog/BlogDetail";
import BlogCreate from "../pages/Admin/blog/BlogCreate";
import BlogEdit from "../pages/Admin/blog/BlogEdit";

import CategoryList from "../pages/Admin/settings/category/CategoryList";
import MateriList from "../pages/Admin/settings/materi/MateriList";
import PaymentMethodList from "../pages/Admin/settings/payment-method/PaymentMethodList";
import RoleList from "../pages/Admin/settings/role/RoleList";
import Job from "../pages/Admin/settings/job/Job";

import InvoiceList from "../pages/Admin/invoice/InvoiceList";
import InvoiceDetail from "../pages/Admin/invoice/InvoiceDetail";
import DataGuru from "../pages/Admin/settings/data-guru/DataGuru";

const AppRouter = () => {
  return (
    <Routes>
      {/* ==================== GUEST ==================== */}
      <Route element={<GuestLayout />}>
        <Route index element={<Beranda />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="blog" element={<Blog />} />
        <Route path="blog/detail" element={<BlogDetail />} />
        <Route path="karir" element={<Karir />} />
        <Route path="otp" element={<Otp />} />
        <Route path="reset-password" element={<ResetPassword />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="tentangkami" element={<TentangKami />} />
        <Route path="admin/login" element={<LoginAdmin />} />
      </Route>

      {/* ==================== AUTH SISWA ==================== */}
      <Route
        path="/siswa"
        element={
          <ProtectedRoute>
            <AuthLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<BerandaSiswa />} />
        <Route path="jadwal" element={<JadwalSiswa />} />

        <Route path="kelas" element={<KelasSiswa />} />
        <Route path="kelas/detail" element={<DetailKelas />} />
        <Route path="kelas/pilih-program" element={<PilihProgram />} />
        <Route path="kelas/pilih-kelas" element={<PilihKelas />} />
        <Route
          path="kelas/detail-pilih-program"
          element={<DetailPilihProgram />}
        />

        <Route path="materi" element={<MateriSiswa />} />

        <Route path="pendaftaran/form-program" element={<FormProgram />} />
        <Route path="pendaftaran/daftar-anak" element={<DaftarAnak />} />
        <Route path="pendaftaran/daftar-ortu" element={<DaftarOrtu />} />

        <Route path="pembayaran" element={<PaymentMethod />} />
        <Route path="pembayaran/invoice" element={<Invoice />} />

        <Route path="pengajar" element={<PengajarSiswa />} />

        <Route path="profile" element={<Profile />} />
        <Route path="profile-detail" element={<ProfileDetail />} />
        <Route path="profile-edit" element={<ProfileEdit />} />
      </Route>

      {/* ==================== ADMIN ==================== */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardAdmin />} />

        <Route path="user" element={<UserList />} />
        <Route path="user/detail" element={<UserDetail />} />

        <Route path="course" element={<CourseList />} />
        <Route path="course/detail" element={<CourseDetail />} />
        <Route path="course/create" element={<CourseCreate />} />
        <Route path="course/edit" element={<CourseEdit />} />

        <Route path="class" element={<ClassList />} />
        <Route path="class/detail" element={<ClassDetail />} />

        <Route path="blog" element={<BlogListAdmin />} />
        <Route path="blog/detail" element={<BlogDetailAdmin />} />
        <Route path="blog/create" element={<BlogCreate />} />
        <Route path="blog/edit" element={<BlogEdit />} />

        <Route path="category" element={<CategoryList />} />
        <Route path="materi" element={<MateriList />} />
        <Route path="payment-method" element={<PaymentMethodList />} />
        <Route path="role" element={<RoleList />} />
        <Route path="karir" element={<Job />} />
        <Route path="guru" element={<DataGuru />} />

        <Route path="invoice" element={<InvoiceList />} />
        <Route path="invoice/detail" element={<InvoiceDetail />} />
      </Route>
    </Routes>
  );
};

export default AppRouter;
