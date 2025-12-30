
const BUTTON_BASE_CLASSES = 'rounded-md flex items-center gap-2 font-poppins text-[12px] lg:text-[14px] font-medium transition-all duration-200 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed';

const CustomeButton = ({
    title,
    className = '',
    onClick,
    startIcon,
    endIcon,
    type = 'button',
    disabled = false
}) => {

    const buttonClasses = [
        className,
        BUTTON_BASE_CLASSES
    ].join(' ');

    return (
        <button
            type={type}
            disabled={disabled}
            onClick={onClick}
            className={buttonClasses}
        >
            {startIcon}
            {title}
            {endIcon}
        </button>
    );
}

export default CustomeButton