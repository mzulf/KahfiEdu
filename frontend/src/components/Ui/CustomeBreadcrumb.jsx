import { Box, Breadcrumbs, Link, Typography } from '@mui/material';
import { HiHome } from 'react-icons/hi';
import { useLocation, Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';

function CustomeBreadcrumb({ title }) {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter((x) => x);
    return (
        <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ py: 2, px: { xs: 2, md: 7 } }}>
            <Breadcrumbs aria-label="breadcrumb">
                <Link
                    component={RouterLink}
                    to="/admin/dashboard"
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        color: 'text.primary',
                        textDecoration: 'none',
                        '&:hover': {
                            textDecoration: 'underline'
                        },
                        gap: "10px"
                    }}
                >
                    <HiHome className="size-4" />
                </Link>

                {pathnames.slice(1).map((name, index) => {
                    if (name === 'dashboard') return null;

                    const routeTo = `/${pathnames.slice(0, index + 2).join('/')}`;
                    const isLast = index === pathnames.slice(1).length - 1;
                    const formattedName = name.replace(/-/g, ' ');

                    return isLast ? (
                        <Typography
                            key={name}
                            sx={{
                                textTransform: 'capitalize',
                                color: '#1B986E',
                                fontWeight: 500
                            }}
                        >
                            {formattedName}
                        </Typography>
                    ) : (
                        <Link
                            key={name}
                            component={RouterLink}
                            to={routeTo}
                            sx={{
                                color: 'text.primary',
                                textDecoration: 'none',
                                textTransform: 'capitalize',
                                '&:hover': {
                                    textDecoration: 'underline'
                                }
                            }}
                        >
                            {formattedName}
                        </Link>
                    );
                })}
            </Breadcrumbs>
            <h1 className='font-roboto text-lg text-kahf-green font-semibold'>{title}</h1>
        </Box>
    );
};

CustomeBreadcrumb.propsType = {
    title: PropTypes.string
}

export default CustomeBreadcrumb;