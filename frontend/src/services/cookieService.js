import Cookies from 'js-cookie';

const SECURE_OPTIONS = {
    secure: true,
    sameSite: 'strict',
    expires: 1
};

const cookieService = {
    _encrypt(value) {
        if (!value) return '';
        try {
            const encoded = btoa(encodeURIComponent(value));
            return encoded.split('').reverse().join('');
        } catch (error) {
            console.error('Encryption error:', error);
            return '';
        }
    },

    _decrypt(value) {
        if (!value) return '';
        try {
            const reversed = value.split('').reverse().join('');
            return decodeURIComponent(atob(reversed));
        } catch (error) {
            console.error('Decryption error:', error);
            return '';
        }
    },

    setAuthCookies(token, role) {
        Cookies.set('authToken', this._encrypt(token), SECURE_OPTIONS);
        Cookies.set('userRole', this._encrypt(role), SECURE_OPTIONS);
    },

    clearAuthCookies() {
        Cookies.remove('authToken');
        Cookies.remove('userRole');
    },

    getAuthToken() {
        return this._decrypt(Cookies.get('authToken'));
    },

    getUserRole() {
        return this._decrypt(Cookies.get('userRole'));
    },

    setSocketId(socketId) {
        const expires = new Date();
        expires.setDate(expires.getDate() + 1);
        document.cookie = `socketId=${socketId}; expires=${expires.toUTCString()}; path=/`;
    },

    getSocketId() {
        const cookies = document.cookie.split(';');
        const found = cookies.find(cookie => cookie.trim().startsWith('socketId='));
        return found ? found.split('=')[1] : null;
    },

    clearSocketId() {
        document.cookie = 'socketId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    }
};

export { cookieService };
