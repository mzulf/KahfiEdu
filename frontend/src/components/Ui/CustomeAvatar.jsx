import PropTypes from 'prop-types';
import { Avatar } from '@mui/material';

function CustomeAvatar({ src, alt = 'avatar', size = 40 }) {
    return (
        <Avatar
            src={src}
            alt={alt}
            sx={{ width: size, height: size }}
        />
    );
}

CustomeAvatar.propTypes = {
    src: PropTypes.string.isRequired,
    alt: PropTypes.string,
    size: PropTypes.number,
};

export default CustomeAvatar;
