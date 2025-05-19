const express = require('express');
const {
  getUserValidator,
  createUserValidator,
  updateUserValidator,
  deleteUserValidator,
  changeUserPasswordValidator,
  updateLoggedUserValidator,
} = require('../utils/validators/userValidator');

const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  uploadUserImage,
  changeUserPassword,
  getLoggedUserData,
  updateLoggedUserPassword,
  updateLoggedUserData,
  deleteLoggedUserData,
  updateLoggedUserImage,
  uploadUserImageToCloudinary,
  deactivateUser,
  activateUser,
  countUsers,
} = require('../services/userService');
const deletVehiclesUser = require('../middlewares/deletVehiclesUser');
const authService = require('../services/authService');

const router = express.Router();

router.use(authService.protect);

router.get('/getMe', getLoggedUserData, getUser);
router.put('/changeMyPassword', updateLoggedUserPassword);
router.put('/updateMe', updateLoggedUserValidator, updateLoggedUserData);
router.delete('/deleteMe', deleteLoggedUserData);
router.put('/updateImgMe', uploadUserImage, uploadUserImageToCloudinary, updateLoggedUserImage);
router.put

// Admin
router.use(authService.allowedTo('admin'));
router.put(
  '/changePassword/:id',
  changeUserPasswordValidator,
  changeUserPassword
);
router
  .route('/')
  .get(getUsers)
  .post(uploadUserImage, uploadUserImageToCloudinary, createUserValidator, createUser);

router.get('/count', countUsers);


router
  .route('/:id')
  .get(getUserValidator, getUser)
  .put(updateUserValidator,updateUser)
  .delete(deleteUserValidator,deletVehiclesUser, deleteUser);
router
.route('/deactivate/:id')
.put(
  deleteUserValidator,
  deactivateUser
);

router
.route('/activate/:id')
.put(
  deleteUserValidator,
  activateUser
)
module.exports = router;
