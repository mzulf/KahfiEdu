// NavMenu.jsx
import { useLocation, Link } from 'react-router-dom';
import dataMenu from '../../../utils/dataMenu';
import { HiChevronDown } from 'react-icons/hi';
import {
    Drawer, List, ListItem, ListItemIcon, ListItemText, Box, Divider
} from '@mui/material';

function NavMenu({ drawerOpen, toggleDrawer }) {
    const location = useLocation();

    const renderDesktopMenu = () => (
        <div className="hidden md:flex gap-4 bg-white p-2 rounded-lg shadow-lg">
            {dataMenu.map((menu, index) => {
                const isActive = menu.link && location.pathname.startsWith(menu.link);
                const isSubActive = menu.dropdownData?.some(item => location.pathname.startsWith(item.link));

                if (menu.isDropdown) {
                    return (
                        <div key={index} className="relative group">
                            <button
                                className={`flex items-center gap-2 px-5 py-3 rounded-md transition
                                    ${isSubActive ? 'bg-kahf-green text-white font-medium' : 'text-gray-700 hover:bg-gray-100'}`}
                            >
                                {menu.icon}
                                <span>{menu.title}</span>
                                <HiChevronDown size={16} />
                            </button>
                            <div className="absolute left-0 mt-0 bg-white rounded-md shadow-lg z-10 w-auto p-2 hidden group-hover:block">
                                {menu.dropdownData.map((item, subIndex) => {
                                    const isActiveSub = location.pathname.startsWith(item.link);
                                    return (
                                        <Link
                                            to={item.link}
                                            key={subIndex}
                                            className={`flex items-center gap-2 px-4 py-2 transition rounded-md
                                                ${isActiveSub ? 'bg-kahf-green text-white font-medium' : 'text-gray-700 hover:bg-gray-100'}`}
                                        >
                                            {item.icon}
                                            <span>{item.title}</span>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    );
                }

                return (
                    <Link
                        key={index}
                        to={menu.link}
                        className={`flex items-center gap-2 px-5 py-3 rounded-md transition
                            ${isActive ? 'bg-kahf-green text-white font-medium' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                        {menu.icon}
                        <span>{menu.title}</span>
                    </Link>
                );
            })}
        </div>
    );

    const renderMobileMenu = () => (
        <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
            <Box width={250} role="presentation" onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
                <List>
                    {dataMenu.map((menu, index) => {
                        if (menu.isDropdown) {
                            return (
                                <Box key={index}>
                                    <Divider sx={{ my: 1 }} />
                                    {menu.dropdownData.map((item, i) => (
                                        <ListItem button component={Link} to={item.link} key={`${index}-${i}`}>
                                            <ListItemIcon>{item.icon}</ListItemIcon>
                                            <ListItemText primary={item.title} />
                                        </ListItem>
                                    ))}
                                </Box>
                            );
                        }

                        return (
                            <ListItem button component={Link} to={menu.link} key={index}>
                                <ListItemIcon>{menu.icon}</ListItemIcon>
                                <ListItemText primary={menu.title} />
                            </ListItem>
                        );
                    })}
                </List>
            </Box>
        </Drawer>
    );

    return (
        <>
            {renderDesktopMenu()}
            {renderMobileMenu()}
        </>
    );
}

export default NavMenu;
