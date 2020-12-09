const express = require('express');
const router = express.Router();
const authJWT = require('../auth');
//importing main functions 
const controller = require('../controllers/handler');
//ROUTE HANDLERS
// API FOR REGISTER USER WITH LOGIN
router
    .route('/registerUser') 
    .post(controller.regesterUser);
// API FOR LOGIN USER WITH APPLICATION
router
  .route('/login')
  .post(controller.checkLogin);
// API FOR UPDATE THE DETAILS OF USER
router
    .route('/update')
    .post(authJWT.authJWT,controller.updateUser);
// API FOR LISTING THE DATA OF USER  ONLY ROLE WITH ADMIN-SME CAN LIST THE DATA
router
    .route('/list')
    .post(authJWT.authJWT,controller.listUser);
// API FOR SEARCH AND LIST THE DATA OF USER  ONLY ROLE WITH ADMIN-SME CAN LIST THE DATA
router
    .route('/search')
    .post(authJWT.authJWT,controller.searchApi);

module.exports = router;