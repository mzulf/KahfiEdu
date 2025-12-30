const express = require('express')
const router = express.Router();
const { createUpload } = require('../config/multerConfig');
const { getUsers, getUserById, addUser, getMe, deleteUser, updateUser, restoreUser, getUserByRole } = require('../controllers/userController');

const uploadImage = createUpload("uploads/profil/", [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/webp"
]);

router.get('/users', getUsers);
router.get('/me', getMe);
router.get('/users/role', getUserByRole);
router.get('/user/:id', getUserById);
router.delete('/user/:id', deleteUser);
router.post('/user/restore/:id', restoreUser);
router.post('/user', uploadImage.single("avatar"), addUser);
router.put('/user/:id', uploadImage.single("avatar"), updateUser);

module.exports = router;