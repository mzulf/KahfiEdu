export const capitalizeFirst = (str) => {
    if (!str) return "";
    const lower = str.toLowerCase();
    return lower.charAt(0).toUpperCase() + lower.slice(1);
};


export const capitalizeWords = (str) => {
    if (!str) return "";
    return str
        .toLowerCase()
        .replace(/\b\w/g, (char) => char.toUpperCase());
};

export const toUpperCaseAll = (str) => {
    return str ? str.toUpperCase() : "";
};

export const toLowerCaseAll = (str) => {
    return str ? str.toLowerCase() : "";
};
