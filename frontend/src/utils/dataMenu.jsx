import { HiHome, HiUser, HiBookOpen, HiSpeakerphone, HiCog, HiCurrencyDollar, HiCreditCard, HiFlag, HiCollection, HiUserGroup, HiAcademicCap, HiBriefcase } from 'react-icons/hi';

const dataMenu = [
    {
        title: "Dashboard",
        link: "/admin/dashboard",
        icon: <HiHome size={20} />,
        isDropdown: false,
        dropdownData: null
    },
    {
        title: "Pengguna",
        link: "/admin/user",
        icon: <HiUser size={20} />,
        isDropdown: false,
        dropdownData: null
    },
    {
        title: "Program",
        link: "/admin/course",
        icon: <HiAcademicCap size={20} />,
        isDropdown: false,
        dropdownData: null
    },
    {
        title: "Kelas",
        link: "/admin/class",
        icon: <HiBookOpen size={20} />,
        isDropdown: false,
        dropdownData: null
    },

    {
        title: "Blog",
        link: "/admin/blog",
        icon: <HiSpeakerphone size={20} />,
        isDropdown: false,
        dropdownData: null
    },
    {
        title: "Invoice",
        link: "/admin/invoice",
        icon: <HiCurrencyDollar size={20} />,
        isDropdown: false,
        dropdownData: null
    },
    {
        title: "Pengaturan",
        link: null,
        icon: <HiCog size={20} />,
        isDropdown: true,
        dropdownData: [
            {
                title: "Pembayaran",
                icon: <HiCreditCard size={20} />,
                link: "/admin/payment-method"
            },
            {
                title: "Karir",
                icon: <HiBriefcase size={20} />,
                link: "/admin/karir"
            },
            {
                title: "Category",
                icon: <HiCollection size={20} />,
                link: "/admin/category"
            },
        ]
    },

];

export default dataMenu