import React, { useState } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    InputBase,
    Badge,
    IconButton,
    Button,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Box,
    Grid,
    Card,
    CardMedia,
    CardContent,
    Chip,
    Pagination,
    Stack,
    Container,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    useMediaQuery,
    useTheme,
} from '@mui/material';

// Material-UI Icons
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MessageIcon from '@mui/icons-material/Message';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HomeIcon from '@mui/icons-material/Home';
import GroupIcon from '@mui/icons-material/Group';
import BookIcon from '@mui/icons-material/Book';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import SettingsIcon from '@mui/icons-material/Settings';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import EditIcon from '@mui/icons-material/Edit';
import { HiPlus } from 'react-icons/hi';

const Blog2 = () => {
    const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
    const [filters, setFilters] = useState({
        search: '',
        category: '',
        year: '',
        status: 'Semua',
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeNav, setActiveNav] = useState('Blog');
    const itemsPerPage = 9;

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('lg'));

    // Sample blog data
    const blogData = Array.from({ length: 13 }, (_, index) => ({
        id: index + 1,
        title: 'Title',
        date: '03 Mei 2023, oleh Kahfi Edu',
        description:
            'Tincidunt Donec ex ac porta enim, efficitur, at odio Sed id dui ac tortor. Ut faucibus placerat non nibh efficitur, eget elit elit sed nisl gravida molestusada ac Lorem vitae non, sapien commodo Nunc Ut eget locus urna. Donec Nam faucibus',
        tags: ['#Education', '#Information'],
        status:
            index % 3 === 0
                ? 'Published'
                : index % 3 === 1
                    ? 'Featured'
                    : 'Publish',
        image: `/api/placeholder/300/200`,
    }));

    const getStatusColor = (status) => {
        switch (status) {
            case 'Published':
                return 'success'; // MUI color variant
            case 'Featured':
                return 'warning';
            case 'Publish':
                return 'primary';
            default:
                return 'default';
        }
    };

    const navItems = [
        { name: 'Dashboard', icon: HomeIcon, active: false },
        { name: 'Pengguna', icon: GroupIcon, active: false },
        { name: 'Kelas', icon: BookIcon, active: false },
        { name: 'Kelas', icon: BookIcon, active: false },
        { name: 'Blog', icon: EditIcon, active: true },
        { name: 'Pembayaran', icon: CreditCardIcon, active: false },
        { name: 'Setting', icon: SettingsIcon, active: false, dropdown: true },
    ];

    const totalPages = Math.ceil(blogData.length / itemsPerPage);
    const currentItems = blogData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const FilterContent = ({ isMobile = false }) => (
        <Box sx={{ backgroundColor: 'orange.500', borderRadius: '8px', p: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" component="h3" fontWeight="bold">
                    Filter
                </Typography>
            </Box>

            <Stack spacing={2}>
                <InputBase
                    placeholder="Cari blog"
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    sx={{
                        width: '100%',
                        p: 1,
                        borderRadius: '4px',
                        border: '1px solid',
                        borderColor: 'grey.300',
                        backgroundColor: 'white',
                        '&.Mui-focused': {
                            boxShadow: '0 0 0 2px rgba(255, 165, 0, 0.3)', // orange-300 like effect
                            borderColor: 'orange.500',
                        },
                    }}
                />

                <Box display="flex" alignItems="center" gap={2} >

                    <FormControl fullWidth>
                        <InputLabel id="status-select-label">Status</InputLabel>
                        <Select
                            labelId="status-select-label"
                            value={filters.status}
                            label="Status"
                            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                            sx={{ backgroundColor: 'white' }}
                        >
                            <MenuItem value="Semua">Semua</MenuItem>
                            <MenuItem value="Published">Published</MenuItem>
                            <MenuItem value="Featured">Featured</MenuItem>
                            <MenuItem value="Publish">Publish</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl fullWidth>
                        <InputLabel id="year-select-label">Tahun</InputLabel>
                        <Select
                            labelId="year-select-label"
                            value={filters.year}
                            label="Tahun"
                            onChange={(e) => setFilters({ ...filters, year: e.target.value })}
                            sx={{ backgroundColor: 'white' }}
                        >
                            <MenuItem value="">Tahun</MenuItem>
                            <MenuItem value="2023">2023</MenuItem>
                            <MenuItem value="2024">2024</MenuItem>
                            <MenuItem value="2025">2025</MenuItem>
                        </Select>
                    </FormControl>
                </Box>

                <Button
                    variant="outlined"
                    onClick={() => setFilters({ search: '', category: '', year: '', status: 'Semua' })}
                >
                    Reset Filter
                </Button>

                <Button
                    variant="contained"
                    sx={{ backgroundColor: 'green.500', '&:hover': { backgroundColor: 'green.600' } }}
                    startIcon={<HiPlus />}
                >
                    Tambah
                </Button>
            </Stack>
        </Box>
    );

    return (
        <Box sx={{ minHeight: '100vh' }}>
            <Grid container spacing={3}>
                {/* Desktop Filter Sidebar */}
                {!isMobile && (
                    <Grid size={3}>
                        <Box position="sticky" top={24}>
                            <FilterContent />
                        </Box>
                    </Grid>
                )}

                {/* Main Content Area */}
                <Grid size={{ xs: 12, md: 9 }}>
                    {/* Mobile Filter Button */}
                    {isMobile && (
                        <Box mb={2}>
                            <Button
                                variant="contained"
                                sx={{ backgroundColor: 'orange.500', '&:hover': { backgroundColor: 'orange.600' } }}
                                startIcon={<FilterListIcon />}
                                onClick={() => setFilterDrawerOpen(true)}
                            >
                                Filter
                            </Button>
                        </Box>
                    )}

                    {/* Blog Grid */}
                    <Grid container spacing={3} mb={3}>
                        {currentItems.map((blog) => (
                            <Grid size={{ xs: 12, md: 4 }} key={blog.id}>
                                <Card sx={{ borderRadius: '8px', boxShadow: 3, '&:hover': { boxShadow: 6 } }}>
                                    <Box sx={{ position: 'relative' }}>
                                        <CardMedia
                                            component="img"
                                            height="192" // h-48 in tailwind = 12rem = 192px
                                            image={`https://via.placeholder.com/300x200/4caf50/ffffff?text=Blog+${blog.id}`}
                                            alt={blog.title}
                                        />
                                        <Box sx={{ position: 'absolute', top: 8, left: 8, display: 'flex', gap: 1 }}>
                                            <Chip
                                                label={blog.status}
                                                color={getStatusColor(blog.status)}
                                                size="small"
                                                sx={{ fontWeight: 'semibold' }}
                                            />
                                        </Box>
                                        <IconButton
                                            sx={{
                                                position: 'absolute',
                                                top: 8,
                                                right: 8,
                                                backgroundColor: 'white',
                                                '&:hover': { backgroundColor: 'grey.50' },
                                            }}
                                        >
                                            <MoreVertIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                    <CardContent sx={{ p: 2 }}>
                                        <Typography variant="h6" component="h3" fontWeight="bold" mb={1}>
                                            {blog.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" mb={1.5}>
                                            {blog.date}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.primary"
                                            sx={{
                                                mb: 2,
                                                display: '-webkit-box',
                                                WebkitLineClamp: 3,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden',
                                                lineHeight: '1.5rem', // leading-relaxed in tailwind
                                            }}
                                        >
                                            {blog.description}
                                        </Typography>
                                        <Stack direction="row" spacing={1} flexWrap="wrap">
                                            {blog.tags.map((tag, index) => (
                                                <Chip
                                                    key={index}
                                                    label={tag}
                                                    size="small"
                                                    sx={{ backgroundColor: 'grey.100', color: 'grey.600', border: '1px solid', borderColor: 'grey.300' }}
                                                />
                                            ))}
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>

                    {/* Pagination */}
                    <Stack spacing={2} alignItems="center">
                        <Typography variant="body2" color="text.secondary">
                            Rows per page: {itemsPerPage} | {((currentPage - 1) * itemsPerPage) + 1} -{' '}
                            {Math.min(currentPage * itemsPerPage, blogData.length)} of {blogData.length}
                        </Typography>
                        <Pagination
                            count={totalPages}
                            page={currentPage}
                            onChange={(event, value) => setCurrentPage(value)}
                            color="primary"
                            showFirstButton
                            showLastButton
                        />
                    </Stack>
                </Grid>
            </Grid>

            {/* Mobile Filter Drawer */}
            <Drawer
                anchor="left"
                open={filterDrawerOpen}
                onClose={() => setFilterDrawerOpen(false)}
                PaperProps={{
                    sx: { width: 280 }, // w-80 in tailwind = 20rem = 320px
                }}
            >
                <FilterContent isMobile={true} />
            </Drawer>

        </Box>
    );
};

export default Blog2;