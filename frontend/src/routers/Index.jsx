// src/router/AppRouter.jsx
import { Route, Routes } from 'react-router-dom';
import GuestLayout from '../layouts/GuestLayout';
import AdminLayout from '../layouts/AdminLayout';

// Guest Pages
import Beranda from '../pages/Guest/Beranda';
import TentangKami from '../pages/Guest/TentangKami';
import Login from '../pages/Guest/login/Login';
import Register from '../pages/Guest/Register';
import Blog from '../pages/Guest/Blog';
import Otp from '../pages/Guest/Otp';
import ResetPassword from '../pages/Guest/ResetPassword';
import ForgotPassword from '../pages/Guest/ForgotPassword';
import LoginAdmin from '../pages/Guest/login/LoginAdmin';

// Auth Pages
import BerandaSiswa from '../pages/Auth/beranda/BerandaSiswa';
import KelasSiswa from '../pages/Auth/kelas/KelasSiswa';
import PengajarSiswa from '../pages/Auth/pengajar/PengajarSiswa';
import Profile from "../pages/Auth/profil/Profile";
import ProfileDetail from "../pages/Auth/profil/ProfileDetail";
import ProfileEdit from "../pages/Auth/profil/ProfileEdit";
import JadwalSiswa from "../pages/Auth/beranda/JadwalSiswa.jsx";
import NotificationPage from '../pages/Auth/notifikasi/NotificationPage.jsx';
import MateriSiswa from '../pages/Auth/materi/MateriSiswa.jsx';




// Admin Pages
import DashboardAdmin from '../pages/Admin/dashboard/DashboardAdmin';
import UserList from '../pages/Admin/user/UserList';
import UserDetail from '../pages/Admin/user/UserDetail';
import CourseList from '../pages/Admin/course/CourseList';
import CourseDetail from '../pages/Admin/course/CourseDetail';
import ProtectedRoute from './ProtectedRoute';
import CategoryList from '../pages/Admin/settings/category/CategoryList';
import PaymentMethodList from '../pages/Admin/settings/payment-method/PaymentMethodList';
import RoleList from '../pages/Admin/settings/role/RoleList';
import InvoiceList from '../pages/Admin/invoice/InvoiceList';
import ClassList from '../pages/Admin/class/ClassList';
import CourseCreate from '../pages/Admin/course/CourseCreate';
import CourseEdit from '../pages/Admin/course/CourseEdit';
import AuthLayout from '../layouts/AuthLayout';
import ClassDetail from '../pages/Admin/class/ClassDetail';
import Karir from '../pages/Guest/Karir';
import Job from '../pages/Admin/settings/job/Job';
import BlogDetail from '../pages/Guest/BlogDetail';
import BlogDetailAdmin from '../pages/Admin/blog/BlogDetail';
import InvoiceDetail from '../pages/Admin/invoice/InvoiceDetail';
import BlogListAdmin from '../pages/Admin/blog/BlogList';
import BlogCreate from '../pages/Admin/blog/BlogCreate';
import BlogEdit from '../pages/Admin/blog/BlogEdit';

const AppRouter = () => (
    <Routes>
        <Route element={<GuestLayout />}>
            <Route path="/" element={<Beranda />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/detail" element={<BlogDetail />} />
            <Route path="/karir" element={<Karir />} />
            <Route path="/otp" element={<Otp />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/tentangkami" element={<TentangKami />} />
            <Route path="/admin/login" element={<LoginAdmin />} />
        </Route>

        <Route
            element={
                <ProtectedRoute>
                    <AuthLayout />
                </ProtectedRoute>
            }
            path='/siswa'
        // element={
        //     <AuthLayout />
        // }
        >
            <Route path="" element={<BerandaSiswa />} />
            <Route path="kelas" element={<KelasSiswa />} />
            <Route path="pengajar" element={<PengajarSiswa />} />
            <Route path="profile" element={<Profile />} />
            <Route path="profile-edit" element={<ProfileEdit />} />
            <Route path="profile-detail" element={<ProfileDetail />} />
            <Route path="jadwal" element={<JadwalSiswa />} />
            <Route path="notifikasi" element={<NotificationPage />} />
            <Route path="materi" element={<MateriSiswa />} />
        </Route>


        <Route
            path="/admin"
            element={
                <ProtectedRoute>
                    <AdminLayout />
                </ProtectedRoute>
            }
        >
            <Route path="dashboard" element={<DashboardAdmin />} />
            <Route path="user" element={<UserList />} />
            <Route path="user/detail" element={<UserDetail />} />
            <Route path="course" element={<CourseList />} />
            <Route path="course/detail" element={<CourseDetail />} />
            <Route path="course/create" element={<CourseCreate />} />
            <Route path="course/edit" element={<CourseEdit />} />
            <Route path="class" element={<ClassList />} />
            <Route path="class/detail" element={<ClassDetail />} />
            <Route path="blog" element={<BlogListAdmin />} />
            <Route path="blog/create" element={<BlogCreate />} />
            <Route path="blog/edit" element={<BlogEdit />} />
            <Route path="blog/detail" element={<BlogDetailAdmin />} />
            <Route path="category" element={<CategoryList />} />
            <Route path="payment-method" element={<PaymentMethodList />} />
            <Route path="karir" element={<Job />} />
            <Route path="role" element={<RoleList />} />
            <Route path="invoice" element={<InvoiceList />} />
            <Route path="invoice/detail" element={<InvoiceDetail />} />
        </Route>
    </Routes>
);

export default AppRouter;
